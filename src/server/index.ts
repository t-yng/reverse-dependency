import path from "path";
import next from "next";
import express from "express";
import { createModulesRouter } from "./api/modules";
import type { Express } from "express";

type ServerOptions = {
  dev: boolean;
  source: string;
};

export const createServer = async ({
  dev,
  source,
}: ServerOptions): Promise<Express> => {
  const projectDir = path.join(__dirname, "../../"); // パッケージがインストールされた場所をプロジェクトディレクトリとする
  const app = next({ dev, dir: projectDir });
  const handle = app.getRequestHandler();

  const server = express();

  try {
    await app.prepare();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  server.use("/api/modules", createModulesRouter({ source }));
  server.get("/_next/static/chunks/graphvizlib.wasm", (_req, res) => {
    return res.redirect("/graphvizlib.wasm");
  });
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  return server;
};
