import { createServer } from "../server";
import { getOptions } from "./options";

const dev = process.env.NODE_ENV === "development";
const options = getOptions();

createServer({ dev, scanModulesOptions: options }).then((server) => {
  server.listen(options.port, () => {
    console.log(
      `> Server listening at http://localhost:${options.port} as ${
        dev ? "development" : "production"
      }`
    );
  });
});
