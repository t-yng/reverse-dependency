import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
// import { graphviz } from "d3-graphviz";
import { cruise, ICruiseResult } from "dependency-cruiser";
import { Button } from "../components/Button";

// const dot = `
// digraph G {
//   rankdir="LR"

//   subgraph cluster_1 {
//     label="components"
//     a
//   }

//   subgraph cluster_2 {
//     label="pages"
//     b
//   }

//   a -> b
// }
// `;

const dot = `
digraph G {
  rankdir="LR"

  subgraph subgraph_0 {
    label="pages"

    subgraph cluster_1 {
      label="users"
      node_1 [label="pages/users/account.tsx"]
      node_2 [label="pages/users/[id].tsx"]
    }
  }

  subgraph cluster_1 {
    label="components"
    node_0 [label="components/Button.tsx"]
  }

  node_2 -> node_0
  node_1 -> node_0
}
`;

interface Module {
  source: string;
  references: Set<string>;
}

type SerializableModule = Omit<Module, "references"> & {
  references: string[];
};

interface SubGraph {
  label: string;
  files: Set<string>;
  childSubgraphs: SubGraph[];
}

type IndexProps = {
  modules: SerializableModule[];
};

const generateNodeId = (() => {
  let num = 0;

  return () => {
    return `node_${num++}`;
  };
})();

const generateDot = (modules: SerializableModule[]) => {
  const nodes: any[] = [];

  for (const mod of modules) {
    nodes.push({
      id: generateNodeId(),
      label: mod.source,
      referenceNodes: mod.references.map((ref) => ({
        id: generateNodeId(),
        label: ref,
      })),
    });
  }

  console.log(nodes);

  return `digraph G {
    rankdir="LR"

    {
      ${nodes
        .map((node) => {
          return [
            `${node.id} [label="${node.label}"]`,
            ...node.referenceNodes.map(
              (node: any) => `${node.id} [label="${node.label}"]`
            ),
          ].join("\n");
        })
        .join("\n")}
    }

    ${nodes
      .map((node) => {
        return node.referenceNodes
          .map((ref: any) => `${ref.id} -> ${node.id}`)
          .join("\n");
      })
      .join("\n")}
  }`;
};

const Index: NextPage<IndexProps> = ({ modules }) => {
  useEffect(() => {
    const clickListeners: Record<string, EventListener> = {};

    (async () => {
      const { graphviz } = await import("d3-graphviz");

      const onRender = () => {
        const nodes = document.querySelectorAll(".node");
        for (const node of Array.from(nodes)) {
          const clickListener = () => {
            const text = node.querySelector("text")?.textContent;
            console.log(text);
          };
          node.addEventListener("click", clickListener);
          clickListeners[node.id] = clickListener;
        }
      };

      // const dot = generateDot(modules);
      // console.log(dot);
      graphviz("#graph").renderDot(dot, onRender);
    })();

    return () => {
      const nodes = document.querySelectorAll(".node");
      for (const node of Array.from(nodes)) {
        node.removeEventListener("click", clickListeners[node.id]);
      }
    };
  }, [modules]);

  return (
    <>
      <Button />
      <div id="graph" style={{ textAlign: "center" }}></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const modules: Module[] = [];

  const result = cruise([`${__dirname}/../../../src`], {
    combinedDependencies: true,
    includeOnly: "src",
    exclude: {
      path: ["node_modules"],
    },
    maxDepth: 10,
  });

  for (const cruiseModule of (result.output as ICruiseResult).modules) {
    if (cruiseModule.dependencies.length === 0) {
      continue;
    }

    for (const dependency of cruiseModule.dependencies) {
      const mod = modules.find((mod) => mod.source === dependency.resolved) ?? {
        source: dependency.resolved,
        references: new Set(),
      };
      mod.references.add(cruiseModule.source);

      if (!modules.some((mod) => mod.source === dependency.resolved)) {
        modules.push(mod);
      }
    }
  }

  const serializableModules: SerializableModule[] = modules.map((mod) => ({
    source: mod.source,
    references: Array.from(mod.references),
  }));

  return {
    props: {
      modules: serializableModules,
    },
  };
};

export default Index;
