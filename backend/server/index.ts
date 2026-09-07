import { execFileSync, execSync } from "child_process";
import { resolve } from "path";

const nextBin = resolve(process.cwd(), "node_modules/next/dist/bin/next");

console.log("Building Next.js application...");
try {
  execFileSync(process.execPath, [nextBin, "build"], {
    stdio: "inherit",
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
  });
} catch {
  console.error("Build failed");
  process.exit(1);
}

const port = process.env.PORT || "5000";
console.log("Starting Next.js server...");
try {
  execSync(`${process.execPath} ${nextBin} start -p ${port}`, {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    cwd: process.cwd(),
  });
} catch (err) {
  console.error("Next.js server exited:", err);
  process.exit(1);
}
