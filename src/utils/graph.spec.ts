import { describe, expect, it } from "vitest";
import { Graph } from "./graph";

const modules = [
  {
    source: "pages/users/account.tsx",
    dirname: "pages/users",
    file: "account.tsx",
    references: [],
  },
  {
    source: "pages/users/[id].tsx",
    dirname: "pages/users",
    file: "[id].tsx",
    references: [],
  },
  {
    source: "components/Button.tsx",
    dirname: "components",
    file: "Button.tsx",
    references: ["pages/users/account.tsx", "pages/users/[id].tsx"],
  },
];

describe("Graph", () => {
  it("Graphオブジェクトにモジュールを追加", () => {
    const graph = new Graph();
    graph.addModule(modules[0]);
    graph.addModule(modules[1]);
    graph.addModule(modules[2]);

    expect(graph.subGraphs.length).toBe(2);
  });

  it("DOT言語のグラフ文字列を出力", () => {
    const expected = `
    digraph G {
      rankdir="LR"

      subgraph subgraph_0 {
        label="pages"
        subgraph subgraph_1 {
          label="users"
          node_0 [label="account.tsx"]
          node_1 [label="[id].tsx"]
        }
      }

      subgraph subgraph_1 {
        label="components"
        node_2 [label=""]
      }
    }
    `;

    const graph = new Graph();
    graph.addModule(modules[0]);
    graph.addModule(modules[1]);
    graph.addModule(modules[2]);
    const dot = graph.toDot();

    expect(dot.trimStart()).toBe(expected.trimStart());
  });
});
