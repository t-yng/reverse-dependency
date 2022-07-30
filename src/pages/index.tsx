import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { cruise, ICruiseResult } from "dependency-cruiser";
import * as styles from "./index.css";
import { FileTree } from "../components/FileTree";
import { Graph } from "../components/Graph/Graph";

interface CruiserModule {
  source: string;
  references: Set<string>;
}

type Module = Omit<CruiserModule, "references"> & {
  references: string[]; // JSONでシリアライズするために配列で保持する
};

type IndexProps = {
  modules: Module[];
};

const Index: NextPage<IndexProps> = ({ modules }) => {
  const [searchTarget, setSearchTarget] = useState("");

  return (
    <main className={styles.main}>
      <FileTree
        files={modules.map((mod) => mod.source)}
        onClickFile={setSearchTarget}
      />
      <Graph modules={modules} target={searchTarget} />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const cruiserModules: CruiserModule[] = [];

  const result = cruise([`${__dirname}/../../../src`], {
    combinedDependencies: true,
    includeOnly: "src",
    exclude: {
      path: ["node_modules"],
    },
    maxDepth: 10,
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

  return {
    props: {
      modules: modules,
    },
  };
};

export default Index;
