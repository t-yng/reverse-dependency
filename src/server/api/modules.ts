import express from "express";
import path from "path";
import { cruise, ICruiseOptions, ICruiseResult } from "dependency-cruiser";
// @ts-ignore
import extractTsConfig from "../../../node_modules/dependency-cruiser/src/config-utl/extract-ts-config";
import fs from "fs";

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
  tsConfig?: string; // e.g: tsconfig.json
};

const loadTsConfig = (tsConfigFileName: string) => {
  let tsConfig = undefined;
  if (fs.existsSync(path.join(process.cwd(), tsConfigFileName))) {
    tsConfig = extractTsConfig(tsConfigFileName);
  }

  return tsConfig;
};

export const createModulesRouter = ({
  source,
  includeOnly,
  exclude,
  maxDepth,
  tsConfig: tsConfigFileName,
}: ScanModulesOptions) => {
  const router = express.Router();

  router.get("/scan", (_req, res) => {
    const cruiserModules: CruiserModule[] = [];
    const tsConfig = tsConfigFileName
      ? loadTsConfig(tsConfigFileName)
      : undefined;

    const cruiseOptions: ICruiseOptions = {
      includeOnly: includeOnly,
      exclude: {
        path: exclude,
      },
      maxDepth: maxDepth,
      // NOTE: dependency-cruiser does not read tsConfig if options.tsConfig is not set
      // @see: https://github.com/sverweij/dependency-cruiser/blob/d2ab3deed0d0bd2bcdb7b9a9f2198f2ecaca8c34/src/main/resolve-options/normalize.js#L89
      ruleSet: {
        // @ts-ignore
        options: {
          tsConfig:
            tsConfigFileName && tsConfig
              ? { fileName: tsConfigFileName }
              : undefined,
        },
      },
    };

    // NOTE: 親ディレクトリを指定した場合にdependency-cruiserでバグが発生する
    // @see https://github.com/sverweij/dependency-cruiser/issues/575#issuecomment-1082136809
    const target = path.join(process.cwd(), source);
    const result = cruise([target], cruiseOptions, undefined, tsConfig);

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
