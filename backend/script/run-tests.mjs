import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const setupFailure = (error) => {
  console.error(
    [
      "[test setup] Could not load the server-only dependency under the React Server condition.",
      'Run "npm ci" to restore the locked dependencies.',
      'If it is already installed, keep "--conditions=react-server" in the npm test command.',
    ].join("\n")
  );
  console.error(error);
  process.exit(1);
};

try {
  await import("server-only");
} catch (error) {
  setupFailure(error);
}

const testsDirectory = fileURLToPath(new URL("../tests/", import.meta.url));
const testFiles = readdirSync(testsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.ts"))
  .map((entry) => fileURLToPath(new URL(`../tests/${entry.name}`, import.meta.url)))
  .sort();

if (testFiles.length === 0) {
  console.error("[test setup] No test files matching tests/*.test.ts were found.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--conditions=react-server", "--import", "tsx", "--test", ...testFiles],
  {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://localhost/seo_test",
    },
    stdio: "inherit",
  }
);

if (result.error) {
  console.error("[test setup] The Node.js test process could not be started.");
  console.error(result.error);
  process.exit(1);
}

if (result.status === null) {
  console.error(
    `[test setup] The Node.js test process ended unexpectedly${
      result.signal ? ` with signal ${result.signal}` : ""
    }.`
  );
  process.exit(1);
}

process.exit(result.status);