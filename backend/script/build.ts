import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";

console.log(
  "Database schema changes and seed data are intentionally excluded from builds. " +
    "Apply reviewed migrations and any required seed data as an explicit release step."
);

console.log("Building Next.js application...");
execSync("npx next build", { stdio: "inherit", cwd: process.cwd() });

console.log("Creating production entry point...");
mkdirSync("dist", { recursive: true });

writeFileSync("dist/index.cjs", `
const { spawn } = require("child_process");

const port = process.env.PORT || "5000";
console.log("Starting Next.js production server on port " + port + "...");
const child = spawn("npx", ["next", "start", "-p", port], {
  stdio: "inherit",
  env: Object.assign({}, process.env, { NODE_ENV: "production" }),
  cwd: process.cwd(),
});

child.on("error", function(err) {
  console.error("Failed to start Next.js:", err);
  process.exit(1);
});

child.on("close", function(code) {
  process.exit(code || 0);
});
`);

console.log("Build complete. Production entry point created at dist/index.cjs");
