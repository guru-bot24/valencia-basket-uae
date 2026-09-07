import { createServer } from "http";
import { parse } from "url";
import next from "next";

const app = next({ dev: false, hostname: "0.0.0.0", port: 5000 });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
  });

  server.listen(5000, "0.0.0.0", () => {
    console.log("> Ready on http://0.0.0.0:5000");
  });
});
