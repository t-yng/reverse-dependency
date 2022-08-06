import { FC, useEffect, useRef } from "react";
import { Graph as GraphModel, Module } from "../../utils/graph";
import { generateSubsetModules } from "../../utils/search";
import * as styles from "./Graph.css";

const generateDot = (modules: Module[]) => {
  const graph = new GraphModel();
  for (const mod of modules) {
    graph.addModule(mod);
  }

  return graph.toDot();
};

type GraphProps = {
  modules: Module[];
  target: string;
};

export const Graph: FC<GraphProps> = ({ modules, target }) => {
  const ref = useRef<HTMLDivElement>(null);

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

      const filteredModules = generateSubsetModules(modules, target);
      const dot = generateDot(filteredModules);

      const width = ref.current != null ? ref.current.clientWidth : undefined;
      const height = ref.current != null ? ref.current.clientHeight : undefined;

      graphviz("#graph", {
        zoom: true,
        fit: true,
        width,
        height,
      }).renderDot(dot, onRender);
    })();

    return () => {
      const nodes = document.querySelectorAll(".node");
      for (const node of Array.from(nodes)) {
        node.removeEventListener("click", clickListeners[node.id]);
      }
    };
  }, [modules, target]);

  return <div id="graph" className={styles.graph} ref={ref} />;
};
