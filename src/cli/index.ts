import { createServer } from "../server";
import { cliOptions } from "./options";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.production
  ? false
  : process.env.NODE_ENV !== "production";

const options = cliOptions();

createServer({ dev, source: options.source }).then((server) => {
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : "production"
      }`
    );
  });
});
