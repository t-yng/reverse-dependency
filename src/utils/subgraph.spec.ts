import { describe, expect, it, vi } from "vitest";
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
      id: expect.any(String),
      label: "[id].tsx",
    });
  });

  it("子のSubGraphを含めた全てのNodeを返す", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");
    subGraph.addSource("pages/users/[id].tsx");
    subGraph.addSource("pages/index.tsx");

    const nodes = subGraph.allNodes;
    expect(nodes.length).toBe(3);
  });

  it("指定したパスのNodeを返す", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");
    subGraph.addSource("pages/users/[id].tsx");
    subGraph.addSource("pages/index.tsx");

    const node = subGraph.getNode("pages/users/[id].tsx");
    expect(node).not.toBe(null);
    expect(node?.label).toBe("[id].tsx");
  });

  it("DOT言語の文字列を出力", () => {
    const subGraph = new SubGraph("pages/users/account.tsx");
    subGraph.addSource("pages/users/[id].tsx");

    const expected = `
    subgraph ${subGraph.id} {
      label="pages"
      subgraph ${subGraph.subGraphs[0].id} {
        label="users"
        ${subGraph.subGraphs[0].nodes[0].id} [label="account.tsx"]
        ${subGraph.subGraphs[0].nodes[1].id} [label="[id].tsx"]
      }
    }`;

    const dot = subGraph.toDot();

    expect(dot.trimStart().replaceAll("\n", "").replace(/\s/g, "")).toBe(
      expected.trimStart().replaceAll("\n", "").replace(/\s/g, "")
    );
  });
});
