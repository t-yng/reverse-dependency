import { describe, expect, it } from "vitest";
import { generateDotSubGraph, Module, modulesToSubGraphs } from "./dot-graph";

describe("utils/graph", () => {
  it("Dot言語のグラフを生成する", () => {
    const expected = `
    digraph G {
      subgraph subgraph_0 {
        label="pages"

        subgraph subgraph_1 {
          label="users"

          node_0 [label="account.tsx"]
          node_1 [label="[id].tsx"]
        }
      }

      subgraph subgraph_2 {
        label="components"

        node_2 [label="UserProfile.tsx"]
      }

      node_0 -> node_2
      node_0 -> node_2
    }
    `;
    expect(true);
  });

  // it("subgraphを生成", () => {
  //   const mod: Module = {
  //     source: "pages/users/account.tsx",
  //     directory: "pages/users",
  //     file: "account.tsx",
  //     references: [],
  //   };

  //   const expected = `
  //   subgraph subgraph_0 {
  //     label="pages"

  //     subgraph subgraph_1 {
  //       label="users"

  //       node_0 [label="account.tsx"]
  //       node_1 [label="[id].tsx"]
  //     }
  //   }
  //   `;

  //   const subgraph = generateDotSubGraph(mod);

  //   expect(subgraph);
  // });

  it("モジュールをSubgraphに変換", () => {
    const modules: Module[] = [
      {
        source: "pages/users/account.tsx",
        directoryPath: "pages/users",
        file: "account.tsx",
        references: [],
      },
      {
        source: "pages/users/[id].tsx",
        directoryPath: "pages/users",
        file: "[id].tsx",
        references: [],
      },
      {
        source: "components/Button.tsx",
        directoryPath: "components",
        file: "Button.tsx",
        references: ["pages/users/account.tsx", "pages/users/[id].tsx"],
      },
    ];

    const expected = [
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

    const result = modulesToSubGraphs(modules);
    expect(result).toEqual(expected);
  });
});
