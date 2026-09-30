import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { ImageOptimizeError, optimizeBlogImage } from "@/lib/imageOptimize";
import { collectCandidates, planBackfill, replaceImageSrc } from "@/lib/imageBackfill";
import { blogImageTooBig } from "@/lib/r2";

/** A noisy photo-like JPEG so compression behaves realistically. */
async function photo(width: number, height: number, options: { orientation?: number } = {}) {
  const noise = Buffer.alloc(width * height * 3);
  for (let i = 0; i < noise.length; i += 1) noise[i] = (i * 2654435761) >>> 24;
  let image = sharp(noise, { raw: { width, height, channels: 3 } }).blur(1.2);
  if (options.orientation) image = image.withMetadata({ orientation: options.orientation });
  return new Uint8Array(await image.jpeg({ quality: 95 }).toBuffer());
}

test("large photos are resized to 2000px and saved as much smaller WebP", async () => {
  const input = await photo(4000, 3000);
  const result = await optimizeBlogImage(input, "image/jpeg");
  assert.equal(result.contentType, "image/webp");
  assert.deepEqual([result.width, result.height], [2000, 1500]);
  assert.ok(result.body.byteLength < input.byteLength / 2, `${result.body.byteLength} vs ${input.byteLength}`);
});

test("sideways phone photos come out upright, without camera metadata", async () => {
  const result = await optimizeBlogImage(await photo(3000, 2000, { orientation: 6 }), "image/jpeg");
  const meta = await sharp(Buffer.from(result.body)).metadata();
  assert.deepEqual([meta.width, meta.height], [1333, 2000]);
  assert.equal(meta.orientation ?? 1, 1);
  assert.equal(meta.exif, undefined);
});

test("featured (social) images become JPEG with transparency on white", async () => {
  const png = new Uint8Array(await sharp({ create: { width: 2400, height: 1260, channels: 4, background: { r: 255, g: 108, b: 14, alpha: 0.4 } } }).png().toBuffer());
  const result = await optimizeBlogImage(png, "image/png", "social");
  assert.equal(result.contentType, "image/jpeg");
  const meta = await sharp(Buffer.from(result.body)).metadata();
  assert.equal(meta.hasAlpha, false);
  assert.equal(meta.width, 2000);
});

test("GIFs, already-small images and damaged files are handled safely", async () => {
  const gif = new Uint8Array(await sharp({ create: { width: 10, height: 10, channels: 3, background: "#000" } }).gif().toBuffer());
  assert.equal((await optimizeBlogImage(gif, "image/gif")).body, gif, "GIFs are stored untouched");
  const tiny = new Uint8Array(await sharp({ create: { width: 40, height: 40, channels: 3, background: "#fff" } }).webp({ quality: 50 }).toBuffer());
  const kept = await optimizeBlogImage(tiny, "image/webp");
  assert.equal(kept.optimized, false);
  assert.equal(kept.body, tiny);
  const damaged = (await photo(800, 600)).slice(0, 3000);
  await assert.rejects(optimizeBlogImage(damaged, "image/jpeg"), ImageOptimizeError);
});

test("upload limits: 20 MB for photos, 5 MB for GIFs", () => {
  assert.equal(blogImageTooBig(19 * 1048576, "image/jpeg"), null);
  assert.match(blogImageTooBig(21 * 1048576, "image/png") ?? "", /20 MB/);
  assert.match(blogImageTooBig(6 * 1048576, "image/gif") ?? "", /5 MB/);
});

const R2 = "pub-test.r2.dev";
const options = { ownHost: R2, imageContentKeys: new Set(["home.hero.image"]), defaultStaffImages: new Set([`https://${R2}/coach-maros.jpg`]) };

test("existing images: finds our stored and inline images once each, and leaves others alone", () => {
  const shared = `https://${R2}/blog/shared.jpg`;
  const candidates = collectCandidates({
    posts: [
      { id: 1, title: "A", content: `<p><img src="${shared}"><img src="https://other.site/x.jpg"><img src="data:image/png;base64,AAAA"><img src="https://${R2}/blog/anim.gif"></p>`, featuredImageSrc: shared, ogImage: null },
      { id: 2, title: "B", content: `<img alt="" src="${shared}">`, featuredImageSrc: "https://other.site/f.jpg", ogImage: `https://${R2}/blog/og.png` },
    ],
    pageContent: [{ key: "home.hero.image", value: `https://${R2}/hero.jpg` }, { key: "home.hero.subtext", value: `https://${R2}/not-an-image-field.jpg` }],
    staff: [{ id: 1, name: "Maros", image: `https://${R2}/coach-maros.jpg` }, { id: 2, name: "New", image: `https://${R2}/blog/new-coach.jpg` }],
  }, options);
  const summary = candidates.map((c) => `${c.purpose}:${c.src.split("/").pop()}:${c.refs.length}`).sort();
  assert.deepEqual(summary, [
    "content:hero.jpg:1",
    "content:new-coach.jpg:1",
    "content:png;base64,AAAA:1",
    "content:shared.jpg:2",
    "social:og.png:1",
    "social:shared.jpg:1",
  ]);
});

test("existing images: only worthwhile savings are planned, failures are reported not fatal", async () => {
  const bytes = (n: number) => new Uint8Array(n);
  const plan = await planBackfill([
    { src: "big", purpose: "content", refs: [] },
    { src: "tiny-saving", purpose: "content", refs: [] },
    { src: "gone", purpose: "content", refs: [] },
  ], {
    load: async (src) => { if (src === "gone") throw new Error("HTTP 404"); return { body: bytes(src === "big" ? 900_000 : 100_000), contentType: "image/jpeg" }; },
    optimize: async (body) => ({ body: bytes(body.byteLength === 900_000 ? 120_000 : 95_000), contentType: "image/webp", width: 1, height: 1, originalBytes: body.byteLength, optimized: true }),
  });
  assert.deepEqual(plan.map((item) => `${item.candidate.src}:${item.action}`), ["big:shrink", "tiny-saving:skip", "gone:skip"]);
  assert.match(plan[2].reason, /HTTP 404/);
});

test("existing images: links are switched everywhere they appear", () => {
  const from = "https://pub-test.r2.dev/blog/a.jpg?x=1&y=2";
  const html = `<img src="${from}"><p>text ${from}</p><img alt="" src="${from.replace("&", "&amp;")}">`;
  assert.equal(replaceImageSrc(html, from, "NEW"), `<img src="NEW"><p>text ${from}</p><img alt="" src="NEW">`, "only image sources change, not mentions in text");
  assert.equal(replaceImageSrc(from, from, "NEW"), "NEW");
});

test("existing images: inline and preview-unsafe images are moved even when not smaller", async () => {
  const bytes = (n: number) => new Uint8Array(n);
  const same = async (body: Uint8Array, contentType: string) => ({ body, contentType, width: 1, height: 1, originalBytes: body.byteLength, optimized: false });
  const plan = await planBackfill([
    { src: "data:image/webp;base64,AAAA", purpose: "social", refs: [] },
    { src: "https://pub-test.r2.dev/blog/small.webp", purpose: "social", refs: [] },
    { src: "https://pub-test.r2.dev/blog/small.jpg", purpose: "social", refs: [] },
    { src: "https://pub-test.r2.dev/blog/small.webp", purpose: "content", refs: [] },
  ], {
    load: async (src) => ({ body: bytes(50_000), contentType: src.endsWith(".jpg") ? "image/jpeg" : "image/webp" }),
    optimize: same,
  });
  assert.deepEqual(plan.map((item) => item.action), ["move", "move", "skip", "skip"]);
  assert.match(plan[0].reason, /inside the database/);
  assert.match(plan[1].reason, /link previews/);
});
