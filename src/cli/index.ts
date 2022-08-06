import { createServer } from "../server";
import { getOptions } from "./options";

const dev = process.env.production
  ? false
  : process.env.NODE_ENV !== "production";

const options = getOptions();

console.log(options);

createServer({ dev, scanModulesOptions: options }).then((server) => {
  server.listen(options.port, () => {
    console.log(
      `> Server listening at http://localhost:${options.port} as ${
        dev ? "development" : "production"
      }`
    );
  });
});
