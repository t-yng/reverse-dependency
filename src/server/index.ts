import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.isDevelopment;
const app = next({ dev });
const handle = app.getRequestHandler();

export const startServer = () => {
  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port);

    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : "production"
      }`
    );
  });
};
