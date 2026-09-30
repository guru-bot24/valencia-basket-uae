import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Downloads an image from a public web address so it can be re-hosted in R2
 * (images pasted from Google Docs arrive as links to Google's servers, which
 * aren't guaranteed to keep working).
 *
 * Guard rails: https only, public addresses only (no localhost/private
 * networks, re-checked on every redirect), 60s timeout, 5 MB cap enforced
 * while streaming, and the bytes must really be a PNG/JPEG/WebP/GIF.
 */

export class ImageImportError extends Error {}

const MAX_REDIRECTS = 3;
// Generous: some image hosts are slow (a 2.4 MB photo from one took 22-55s in testing).
const TIMEOUT_MS = 60_000;

function ipv4ToInt(ip: string) {
  return ip.split(".").reduce((value, part) => (value << 8) + Number(part), 0) >>> 0;
}

function inRange(ip: string, cidr: string) {
  const [base, bits] = cidr.split("/");
  const mask = Number(bits) === 0 ? 0 : (~0 << (32 - Number(bits))) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

const PRIVATE_V4 = [
  "0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8", "169.254.0.0/16",
  "172.16.0.0/12", "192.0.0.0/24", "192.168.0.0/16", "198.18.0.0/15", "224.0.0.0/4", "240.0.0.0/4",
];

/** True for loopback, private, link-local, carrier-grade NAT, multicast and reserved addresses. */
export function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 4) return PRIVATE_V4.some((range) => inRange(ip, range));
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateAddress(mapped[1]);
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6) || /^ff/.test(v6);
}

type Resolver = (hostname: string) => Promise<string[]>;
const resolveAll: Resolver = async (hostname) => (await lookup(hostname, { all: true })).map((entry) => entry.address);

async function assertPublicHttps(raw: string, resolve: Resolver): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ImageImportError("That image link isn't a valid web address.");
  }
  if (url.protocol !== "https:") throw new ImageImportError("Only images on secure (https) links can be copied.");
  if (url.username || url.password) throw new ImageImportError("That image link isn't allowed.");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname) ? [hostname] : await resolve(hostname).catch(() => []);
  if (!addresses.length) throw new ImageImportError("Couldn't reach the site that image is on.");
  if (addresses.some(isPrivateAddress)) throw new ImageImportError("That image link isn't allowed.");
  return url;
}

/** Identifies the real format from the file's first bytes (the server's Content-Type can't be trusted). */
export function sniffImageType(bytes: Uint8Array): string | null {
  const starts = (...sig: number[]) => sig.every((byte, index) => bytes[index] === byte);
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x47, 0x49, 0x46, 0x38)) return "image/gif";
  if (starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

export async function fetchRemoteImage(
  raw: string,
  { maxBytes, resolve = resolveAll, fetchImpl = fetch }: { maxBytes: number; resolve?: Resolver; fetchImpl?: typeof fetch },
): Promise<{ body: Uint8Array; contentType: string }> {
  let url = await assertPublicHttps(raw, resolve);
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let response: Response | null = null;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    try {
      response = await fetchImpl(url, {
        redirect: "manual",
        signal,
        headers: {
          accept: "image/png,image/jpeg,image/webp,image/gif",
          // Some hosts (e.g. Wikimedia) refuse anonymous downloads.
          "user-agent": "ValenciaBasketUAE-ImageImport/1.0 (+https://valenciabasket.ae)",
        },
      });
    } catch {
      throw new ImageImportError("The site that image is on didn't respond in time.");
    }
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      url = await assertPublicHttps(new URL(location, url).toString(), resolve);
      continue;
    }
    break;
  }
  if (!response || (response.status >= 300 && response.status < 400)) throw new ImageImportError("That image link redirects too many times.");
  if (!response.ok) throw new ImageImportError(`The site refused to share that image (error ${response.status}).`);

  const declared = Number(response.headers.get("content-length") ?? 0);
  const tooBig = () => new ImageImportError(`That image is over ${Math.round(maxBytes / 1048576)} MB.`);
  if (declared > maxBytes) throw tooBig();

  const reader = response.body?.getReader();
  if (!reader) throw new ImageImportError("That image link returned nothing.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    let chunk: ReadableStreamReadResult<Uint8Array>;
    try {
      chunk = await reader.read();
    } catch {
      throw new ImageImportError("The site that image is on was too slow to download from.");
    }
    const { done, value } = chunk;
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw tooBig();
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const contentType = sniffImageType(body);
  if (!contentType) throw new ImageImportError("That link isn't a PNG, JPEG, WebP or GIF image.");
  return { body, contentType };
}
