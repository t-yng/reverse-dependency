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

export type ScanModulesOptions = {
  source: string;
  includeOnly?: string | string[];
  exclude?: string | string[];
  maxDepth?: number;
};

export const createModulesRouter = ({
  source,
  includeOnly,
  exclude,
  maxDepth,
}: ScanModulesOptions) => {
  const router = express.Router();

  router.get("/scan", (_req, res) => {
    const cruiserModules: CruiserModule[] = [];

    // NOTE: 親ディレクトリを指定した場合にdependency-cruiserでバグが発生する
    // @see https://github.com/sverweij/dependency-cruiser/issues/575#issuecomment-1082136809
    const target = path.join(process.cwd(), source);
    const result = cruise([target], {
      combinedDependencies: true,
      includeOnly: includeOnly,
      exclude: {
        path: exclude,
      },
      maxDepth: maxDepth,
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
