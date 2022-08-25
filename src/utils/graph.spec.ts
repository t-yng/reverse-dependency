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
    const graph = new Graph();
    graph.addModule(modules[0]);
    graph.addModule(modules[1]);
    graph.addModule(modules[2]);

    const node_0 = graph.subGraphs[0].subGraphs[0].nodes[0];
    const node_1 = graph.subGraphs[0].subGraphs[0].nodes[1];
    const node_2 = graph.subGraphs[1].nodes[0];

    const expected = `
    digraph G {
      rankdir="LR"

      subgraph ${graph.subGraphs[0].id} {
        label="pages"
        subgraph ${graph.subGraphs[0].subGraphs[0].id} {
          label="users"
          ${graph.subGraphs[0].subGraphs[0].nodes[0].id} [label="account.tsx"]
          ${graph.subGraphs[0].subGraphs[0].nodes[1].id} [label="[id].tsx"]
        }
      }

      subgraph ${graph.subGraphs[1].id} {
        label="components"
        ${graph.subGraphs[1].nodes[0].id} [label="Button.tsx"]
      }

      ${node_0.id} -> ${node_2.id}
      ${node_1.id} -> ${node_2.id}
    }
    `;

    const dot = graph.toDot();

    expect(dot.trimStart().replaceAll("\n", "").replace(/\s/g, "")).toBe(
      expected.trimStart().replaceAll("\n", "").replace(/\s/g, "")
    );
  });
});
