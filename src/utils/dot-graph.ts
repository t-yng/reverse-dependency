export interface Module {
  source: string;
  directoryPath: string;
  file: string;
  references: string[];
}

interface DotNode {
  id: string;
  label: string;
  htmlId: string;
}

interface SubGraph {
  label: string;
  nodes: DotNode[];
  subGraphs: SubGraph[];
}

interface DotGraph {
  rankdir: "TB" | "BT" | "LR" | "RL";
  subgraphs: SubGraph[];
  directions: [DotNode, DotNode];
}

export const generateNodeId = (() => {
  let id = 0;

  return () => `node_${id++}`;
})();

[
  {
    source: "pages/users/account.tsx",
    directory: "pages/users",
    file: "account.tsx",
    references: [],
  },
  {
    source: "pages/users/[id].tsx",
    directory: "pages/users",
    file: "[id].tsx",
    references: [],
  },
  {
    source: "components/Button.tsx",
    directory: "components",
    file: "Button.tsx",
    references: ["pages/users/account.tsx", "pages/users/[id].tsx"],
  },
];

export const modulesToSubGraphs = (modules: Module[]): SubGraph[] => {
  const subgraphs: SubGraph[] = [];

  for (const mod of modules) {
    const directories = mod.directoryPath.split("/");
    for (let i = 0; i < directories.length; i++) {
      const directory = directories[i];

      const subgraph: SubGraph = subgraphs.find(
        (subgraph) => subgraph.label === directory
      ) ?? {
        label: directory,
        nodes: [],
        subGraphs: [],
      };

      if (i === directories.length - 1) {
      }

      if (i < directories.length - 1) {
        const nextDirectory = directories[i + 1];
        if (
          !subgraph.subGraphs.some(
            (subgraph) => subgraph.label === nextDirectory
          )
        ) {
          subgraph.subGraphs.push({
            label: directory,
            nodes: [],
            subGraphs: [],
          });
        }
      }

      subgraph.nodes.push({
        id: generateNodeId(),
        label: mod.file,
        htmlId: mod.source,
      });
    }
  }

  return [
    {
      label: "pages",
      nodes: [],
      subGraphs: [
        {
          label: "users",
          nodes: [
            {
              id: "node_0",
              label: "account.tsx",
              htmlId: "pages/users/account.tsx",
            },
            {
              id: "node_1",
              label: "[id].tsx",
              htmlId: "pages/users/[id].tsx",
            },
          ],
          subGraphs: [],
        },
      ],
    },
    {
      label: "components",
      nodes: [
        {
          id: "node_2",
          label: "Button.tsx",
          htmlId: "components/Button.tsx",
        },
      ],
      subGraphs: [],
    },
  ];
};

export const generateDotSubGraph = (subgraph: SubGraph) => {
  return `
  subgraph subgraph_0 {
    label="pages"

    subgraph subgraph_1 {
      label="users"

      node_0 [label="account.tsx"]
      node_1 [label="[id].tsx"]
    }
  }
  `;
};

export const generateDotGraph = (modules: Module[]) => {};
