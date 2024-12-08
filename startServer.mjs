import { Hono } from "hono";
import { compress } from "hono/compress";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { serverEngine } from "waku/unstable_hono";

const app = new Hono();

app.use(compress());

app.use(serveStatic({ root: "./public" }));

app.use(
  serverEngine({
    cmd: "start",
    loadEntries: () => import("./entries.js"),
    env: process.env,
  })
);

app.notFound((c) => c.text("404 Not Found", 404));

console.log(`ready: Listening on http://localhost:3000/`);

serve({ ...app, port: 3000 });
