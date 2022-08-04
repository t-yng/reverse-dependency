import next from "next";
import express from "express";
import { createModulesRouter } from "./api/modules";
import type { Express } from "express";

export const createServer = async ({
  dev,
  source,
}: {
  dev: boolean;
  source: string;
}): Promise<Express> => {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  const server = express();

  try {
    await app.prepare();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  server.use("/api/modules", createModulesRouter({ source }));
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  return server;
};
