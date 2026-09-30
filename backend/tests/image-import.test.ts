import assert from "node:assert/strict";
import test from "node:test";
import { fetchRemoteImage, isPrivateAddress, sniffImageType } from "@/lib/imageImport";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
const publicDns = async () => ["142.250.1.1"];
const respond = (body: Uint8Array | string, init: ResponseInit = {}) => new Response(body, { status: 200, ...init });

test("private, loopback and cloud-metadata addresses are refused", () => {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.20.0.5", "192.168.1.10", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"]) {
    assert.equal(isPrivateAddress(ip), true, ip);
  }
  for (const ip of ["142.250.1.1", "104.16.0.1", "2606:4700::1"]) assert.equal(isPrivateAddress(ip), false, ip);
});

test("imports a public https image and identifies it from its bytes", async () => {
  const result = await fetchRemoteImage("https://lh7-rt.googleusercontent.com/docsz/abc", {
    maxBytes: 1024, resolve: publicDns, fetchImpl: async () => respond(JPEG, { headers: { "content-type": "text/plain" } }),
  });
  assert.equal(result.contentType, "image/jpeg", "the file's own bytes decide the type, not the header");
  assert.equal(result.body.byteLength, JPEG.byteLength);
});

test("refuses non-https links, private hosts and redirects into a private network", async () => {
  const fetchImpl = async () => respond(PNG);
  await assert.rejects(fetchRemoteImage("http://example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl }), /secure \(https\)/);
  await assert.rejects(fetchRemoteImage("https://intranet.local/a.png", { maxBytes: 1024, resolve: async () => ["10.0.0.5"], fetchImpl }), /isn't allowed/);
  await assert.rejects(fetchRemoteImage("https://169.254.169.254/latest/meta-data", { maxBytes: 1024, fetchImpl }), /isn't allowed/);
  let calls = 0;
  const redirecting = async () => (calls++ === 0 ? new Response(null, { status: 302, headers: { location: "https://127.0.0.1/secret.png" } }) : respond(PNG));
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: redirecting }), /isn't allowed/);
});

test("follows a normal redirect, but not endlessly", async () => {
  let calls = 0;
  const once = async () => (calls++ === 0 ? new Response(null, { status: 302, headers: { location: "/real.png" } }) : respond(PNG));
  assert.equal((await fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: once })).contentType, "image/png");
  const loop = async () => new Response(null, { status: 302, headers: { location: "/again" } });
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: loop }), /redirects too many times/);
});

test("stops at the size limit even when the site doesn't say how big the file is", async () => {
  const big = new Uint8Array(4096); big.set(PNG);
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: async () => respond(big, { headers: { "content-length": "4096" } }) }), /over/);
  const unannounced = async () => new Response(new ReadableStream({ start(c) { c.enqueue(big.slice(0, 800)); c.enqueue(big.slice(800)); c.close(); } }), { status: 200 });
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: unannounced }), /over/);
});

test("rejects pages and files that only pretend to be images, and reports refusals", async () => {
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: async () => respond("<html>login</html>", { headers: { "content-type": "image/png" } }) }), /isn't a PNG, JPEG, WebP or GIF/);
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: async () => respond("no", { status: 403 }) }), /refused to share that image \(error 403\)/);
  assert.equal(sniffImageType(new TextEncoder().encode("GIF89a....")), "image/gif");
  assert.equal(sniffImageType(new TextEncoder().encode("RIFF1234WEBPVP8 ")), "image/webp");
});

test("a download that stalls part-way gives a plain message, not a raw error", async () => {
  const stalls = async () => new Response(new ReadableStream({ start(c) { c.enqueue(PNG); c.error(new DOMException("The operation was aborted due to timeout", "TimeoutError")); } }), { status: 200 });
  await assert.rejects(fetchRemoteImage("https://cdn.example.com/a.png", { maxBytes: 1024, resolve: publicDns, fetchImpl: stalls }), /too slow to download from/);
});
