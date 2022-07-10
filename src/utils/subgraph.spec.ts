import { describe, expect, it } from "vitest";
import { Graph } from "./graph";
import { SubGraph } from "./subgraph";

describe("Subgraph", () => {
  it("ファイルパスからSubGraphを生成", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");

    expect(subGraph.label).toBe("pages");
    expect(subGraph.subGraphs.length).toBe(1);
    expect(subGraph.subGraphs[0].label).toBe("users");
    expect(subGraph.subGraphs[0].nodes[0]).toEqual({
      id: "node_0",
      label: "account.tsx",
    });
  });

  it("SubGraphにファイルパスを追加", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");
    subGraph.addSource("pages/users/[id].tsx");

    expect(subGraph.subGraphs.length).toBe(1);
    expect(subGraph.subGraphs[0].nodes.length).toBe(2);
    expect(subGraph.subGraphs[0].nodes[1]).toEqual({
      id: "node_1",
      label: "[id].tsx",
    });
  });

  it("DOT言語の文字列を出力", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");
    subGraph.addSource("pages/users/[id].tsx");

    const expected = `
    subgraph subgraph_0 {
      label="pages"
      subgraph subgraph_1 {
        label="users"
        node_0 [label="account.tsx"]
        node_1 [label="[id].tsx"]
      }
    }
    `;

    const dot = subGraph.toDot();

    expect(dot.trimStart()).toBe(dot.trimStart());
  });
});
