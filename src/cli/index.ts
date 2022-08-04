import { program } from "commander";
import { createServer } from "../server";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

program.option("-s, --source <source>");
program.parse(process.argv);

const options = program.opts();

createServer({ dev, source: options.source }).then((server) => {
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : "production"
      }`
    );
  });
});
