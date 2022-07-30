import { Module } from "./graph";

const searchModule = (modules: Module[], targets: string[]) => {
  const matchedModules = [];
  for (const mod of modules) {
    if (targets.includes(mod.source)) {
      matchedModules.push(mod);
    }
  }

  return matchedModules;
};

const uniqueBy = (modules: Module[], key: keyof Module): Module[] => {
  const result: Module[] = [];
  for (const mod of modules) {
    if (
      result.length === 0 ||
      !result.find((module) => module[key] === mod[key])
    ) {
      result.push(mod);
    }
  }

  return result;
};

/**
 * モジュールの一覧から引数で指定したモジュールを終点としたモジュールのサブセットを生成
 * @param modules サブセットを生成するモジュールの一覧
 * @param target  サブセットの終点となるモジュールのパス
 * @returns
 */
export const generateSubsetModules = (
  modules: Module[],
  target: string
): Module[] => {
  let targets = [target];
  const subsetModules: Module[] = [];

  while (true) {
    const matchedModules = searchModule(modules, targets);
    if (matchedModules.length > 0) {
      subsetModules.push(...matchedModules);
      targets = matchedModules.flatMap((mod) => mod.references);
      continue;
    } else {
      break;
    }
  }

  return uniqueBy(subsetModules, "source");
};
