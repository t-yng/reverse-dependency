import express from "express";
import path from "path";
import { cruise, ICruiseResult } from "dependency-cruiser";

interface CruiserModule {
  source: string;
  references: Set<string>;
}

type Module = Omit<CruiserModule, "references"> & {
  references: string[]; // JSONでシリアライズするために配列で保持する
};

export const createModulesRouter = ({ source }: { source: string }) => {
  const router = express.Router();

  router.get("/scan", (_req, res) => {
    const cruiserModules: CruiserModule[] = [];

    const target = path.join(process.cwd(), source);
    // TODO: ディレクトリのパスはCLIのオプションで指定可能（必須）にする
    const result = cruise([target], {
      combinedDependencies: true,
      includeOnly: "src", // TODO: デフォルト値として利用、CLIのオプションで指定可能にする
      exclude: {
        path: ["node_modules", "spec"], // TODO: デフォルト値として利用、CLIのオプションで指定可能にする
      },
      maxDepth: 10, // TODO: デフォルト値として利用、CLIのオプションで指定可能にする
    });

    for (const cruiseModule of (result.output as ICruiseResult).modules) {
      if (!cruiserModules.some((mod) => mod.source === cruiseModule.source)) {
        cruiserModules.push({
          source: cruiseModule.source,
          references: new Set(),
        });
      }

      for (const dependency of cruiseModule.dependencies) {
        const mod = cruiserModules.find(
          (mod) => mod.source === dependency.resolved
        ) ?? {
          source: dependency.resolved,
          references: new Set(),
        };
        mod.references.add(cruiseModule.source);

        if (!cruiserModules.some((mod) => mod.source === dependency.resolved)) {
          cruiserModules.push(mod);
        }
      }
    }

    const modules: Module[] = cruiserModules.map((mod) => ({
      source: mod.source,
      references: Array.from(mod.references),
    }));

    res.send({
      modules,
    });
  });

  return router;
};
