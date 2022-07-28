import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { cruise, ICruiseResult } from "dependency-cruiser";
import { Graph } from "../utils/graph";
import { generateSubsetModules } from "../utils/search";
import { AutoSuggest } from "../components/AutoSuggest";
import * as styles from "./index.css";

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

const generateDot = (modules: Module[]) => {
  const graph = new Graph();
  for (const mod of modules) {
    graph.addModule(mod);
  }

  return graph.toDot();
};

const Index: NextPage<IndexProps> = ({ modules }) => {
  const [searchTarget, setSearchTarget] = useState("");

  useEffect(() => {
    const clickListeners: Record<string, EventListener> = {};

    (async () => {
      const { graphviz } = await import("d3-graphviz");

      const onRender = () => {
        const nodes = document.querySelectorAll(".node");
        for (const node of Array.from(nodes)) {
          const clickListener = () => {
            const text = node.querySelector("text")?.textContent;
          };
          node.addEventListener("click", clickListener);
          clickListeners[node.id] = clickListener;
        }
      };

      const filteredModules = generateSubsetModules(modules, searchTarget);
      const dot = generateDot(filteredModules);
      graphviz("#graph").renderDot(dot, onRender);
    })();

    return () => {
      const nodes = document.querySelectorAll(".node");
      for (const node of Array.from(nodes)) {
        node.removeEventListener("click", clickListeners[node.id]);
      }
    };
  }, [modules, searchTarget]);

  return (
    <main className={styles.main}>
      <AutoSuggest
        list={modules.map((mod) => mod.source)}
        onSelect={(text) => setSearchTarget(text)}
      />
      <div id="graph" style={{ textAlign: "center" }}></div>
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
