import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn, type ChildProcess } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { join } from "node:path";
import test from "node:test";
import { chromium } from "@playwright/test";

const seoPage = {
  path: "/programs",
  label: "Programs",
  group: "Main",
  defaults: {
    title: "Basketball Programs for Every Age in Dubai",
    description:
      "Explore Valencia Basket UAE basketball programs for young players of every age and experience level.",
    canonical: "/programs",
    ogTitle: "Valencia Basket UAE Programs",
    ogDescription: "Find the right basketball development pathway for your player.",
    noIndex: false,
  },
  override: {
    metaTitle: null,
    metaDescription: null,
    canonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: "/images/programs-share-card.jpg",
    noIndex: null,
    updatedAt: "2026-08-26T12:00:00.000Z",
  },
  resolved: {
    title: "Basketball Programs for Every Age in Dubai",
    description:
      "Explore Valencia Basket UAE basketball programs for young players of every age and experience level.",
    canonical: "/programs",
    ogTitle: "Valencia Basket UAE Programs",
    ogDescription: "Find the right basketball development pathway for your player.",
    ogImage: "/images/programs-share-card.jpg",
    noIndex: false,
  },
};

const imageAlt = "Young basketball players training together on an indoor court";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Valencia Basket UAE",
};

async function unusedPort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function startNextServer(): Promise<{ baseUrl: string; process: ChildProcess }> {
  const port = await unusedPort();
  const nextProcess = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--webpack", "-p", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: "development",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  const baseUrl = `http://127.0.0.1:${port}`;
  const output: string[] = [];
  nextProcess.stdout?.on("data", (chunk) => output.push(String(chunk)));
  nextProcess.stderr?.on("data", (chunk) => output.push(String(chunk)));

  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (nextProcess.exitCode !== null) {
      throw new Error(`Next.js test server exited early:\n${output.join("")}`);
    }
    try {
      const response = await fetch(`${baseUrl}/admin`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok || response.status === 404) {
        return { baseUrl, process: nextProcess };
      }
    } catch {
      // The development server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  nextProcess.kill("SIGTERM");
  throw new Error(`Timed out waiting for the Next.js test server:\n${output.join("")}`);
}

async function stopNextServer(nextProcess: ChildProcess) {
  if (nextProcess.exitCode !== null) return;

  const exited = once(nextProcess, "exit");
  nextProcess.kill("SIGTERM");
  await Promise.race([
    exited,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);

  if (nextProcess.exitCode === null) {
    const forceExited = once(nextProcess, "exit");
    nextProcess.kill("SIGKILL");
    await forceExited;
  }
}

test("authenticated admins can copy SEO content and retry failed page loads", async () => {
  const nextEnvPath = join(process.cwd(), "next-env.d.ts");
  const originalNextEnv = await readFile(nextEnvPath, "utf8");
  let server: { baseUrl: string; process: ChildProcess } | undefined;
  let browser;
  let context;

  try {
    server = await startNextServer();
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      baseURL: server.baseUrl,
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    let seoPagesAttempts = 0;
    let savedBlogPayload: Record<string, unknown> | undefined;

    await page.route("**/api/**", async (route) => {
      const request = route.request();
      const pathname = new URL(request.url()).pathname;

      if (pathname === "/api/admin/auth") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            authenticated: true,
            user: { id: "browser-admin", username: "admin", role: "admin" },
          }),
        });
        return;
      }

      if (pathname === "/api/admin/seo/pages") {
        seoPagesAttempts += 1;
        if (seoPagesAttempts === 1) {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Test SEO pages failure" }),
          });
        } else {
          await route.fulfill({
            contentType: "application/json",
            body: JSON.stringify([seoPage]),
          });
        }
        return;
      }

      if (pathname === "/api/admin/seo/images") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            assets: [
              {
                src: "/images/team-training.jpg",
                defaultAlt: imageAlt,
                override: null,
                isDecorative: false,
                resolved: imageAlt,
                placements: [{ key: "programs.team", page: "Programs" }],
              },
            ],
            conflicts: [],
            eventImages: [],
          }),
        });
        return;
      }

      if (pathname === "/api/admin/seo/schema") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify([
            {
              key: "/__schema/sitewide-organization",
              path: "/",
              label: "Organization",
              type: "SportsOrganization",
              note: "The academy identity published in structured data.",
              json: structuredData,
              lastModified: null,
              enabled: true,
              override: null,
              fields: [],
              lockedFields: ["name"],
            },
          ]),
        });
        return;
      }

      if (pathname === "/api/admin/blog/meta") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            categories: [{ id: 1, name: "Academy News", slug: "academy-news", usage: 2 }],
            tags: [{ id: 1, name: "Basketball", slug: "basketball", usage: 3 }],
          }),
        });
        return;
      }

      if (pathname === "/api/admin/blog" && request.method() === "POST") {
        savedBlogPayload = request.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1,
            ...savedBlogPayload,
            status: "published",
            password: undefined,
            passwordHash: undefined,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            trashedAt: null,
            viewCount: 0,
            categories: [{ id: 1, name: "Academy News", slug: "academy-news", description: null, parentId: null, displayOrder: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
            tags: [],
          }),
        });
        return;
      }

      await route.fulfill({
        contentType: "application/json",
        body: "[]",
      });
    });

    await page.goto("/admin");
    await page.getByTestId("text-admin-title").waitFor();
    await page.getByTestId("tab-trigger-seo").click();

    await page.getByTestId("seo-pages-error").waitFor();
    assert.equal(await page.getByText("Couldn't load SEO pages").isVisible(), true);
    assert.equal(seoPagesAttempts, 1);

    await page.getByRole("button", { name: "Try again" }).click();
    await page.getByTestId("input-seo-meta-title").waitFor();
    assert.equal(seoPagesAttempts, 2);

    const metaTitle = await page.getByTestId("input-seo-meta-title").inputValue();
    const metaDescription = await page.getByTestId("input-seo-meta-description").inputValue();
    const canonicalUrl = await page.getByTestId("input-seo-canonical").inputValue();
    const socialImageUrl = await page.getByTestId("input-seo-og-image").inputValue();
    assert.equal(metaTitle, seoPage.defaults.title);
    assert.equal(metaDescription, seoPage.defaults.description);
    assert.equal(canonicalUrl, seoPage.defaults.canonical);
    assert.equal(socialImageUrl, seoPage.resolved.ogImage);

    const pageCopyButtons = page.getByRole("button", { name: "Copy value" });
    await pageCopyButtons.nth(0).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), metaTitle);
    await pageCopyButtons.nth(1).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), metaDescription);

    const urlCopyButtons = page.getByRole("button", { name: "Copy URL value" });
    await urlCopyButtons.nth(0).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), canonicalUrl);
    await urlCopyButtons.nth(1).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), socialImageUrl);

    await page.getByTestId("tab-trigger-seo-images").click();
    const imageRow = page.getByTestId("row-seo-image-/images/team-training.jpg");
    await imageRow.waitFor();
    await imageRow.getByRole("button", { name: "Copy" }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), imageAlt);

    await page.getByTestId("tab-trigger-seo-schema").click();
    const schemaRow = page.getByTestId("schema--schema-sitewide-organization");
    await schemaRow.waitFor();
    await schemaRow.getByRole("button").click();
    const expectedJson = JSON.stringify(structuredData, null, 2);
    await schemaRow.getByRole("button", { name: "Copy JSON" }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expectedJson);

    await page.getByTestId("tab-trigger-blog").click();
    await page.getByTestId("blog-manager").waitFor();
    assert.equal(await page.getByTestId("text-blog-heading").isVisible(), true);
    await page.getByTestId("button-create-blog-post").click();
    await page.getByTestId("blog-post-editor").waitFor();
    await page.getByLabel("Post title").pressSequentially("Browser editor article");
    await page.getByLabel("Article content").pressSequentially("A complete article written in the rich editor.");
    assert.equal(await page.getByLabel("Article content").textContent(), "A complete article written in the rich editor.");
    await page.getByRole("button", { name: "Code", exact: true }).click();
    assert.match(await page.getByLabel("Article HTML code").inputValue(), /complete article written/);
    await page.getByRole("button", { name: "Visual", exact: true }).click();
    assert.equal(await page.getByLabel("Article content").textContent(), "A complete article written in the rich editor.");
    const publishButton = page.getByRole("button", { name: "Publish", exact: true });
    assert.equal(await publishButton.isDisabled(), true);
    await page.getByLabel("Academy News").click();
    assert.equal(await publishButton.isEnabled(), true);
    await publishButton.click();
    await page.getByText("Article saved", { exact: true }).waitFor();
    assert.equal(savedBlogPayload?.slug, "browser-editor-article");
    assert.deepEqual(savedBlogPayload?.categoryNames, ["Academy News"]);
  } finally {
    await context?.close();
    await browser?.close();
    if (server) await stopNextServer(server.process);
    await writeFile(nextEnvPath, originalNextEnv);
  }
});