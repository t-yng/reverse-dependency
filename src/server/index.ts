import next from "next";
import express from "express";
import modules from "./api/modules";
import type { Express } from "express";

export const createServer = async ({
  dev,
}: {
  dev: boolean;
}): Promise<Express> => {
  console.log(`dev: ${dev}`);
  const app = next({ dev });
  const handle = app.getRequestHandler();

  const server = express();

  try {
    await app.prepare();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  server.use("/api/modules", modules);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  return server;
};
