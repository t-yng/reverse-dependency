import { Path } from "./path";
import { SubGraph } from "./subgraph";

export interface Module {
  source: string;
  dirname: string;
  file: string;
  references: string[];
}

export class Graph {
  private _subGraphs: SubGraph[];
  private _directions: [string, string][];

  constructor() {
    this._subGraphs = [];
    this._directions = [];
  }

  get subGraphs() {
    return this._subGraphs;
  }

  public addModule(module: Module) {
    for (const subGraph of this._subGraphs) {
      if (subGraph.isSame(module.source)) {
        subGraph.addSource(module.source);
        return;
      }
    }

    this._subGraphs.push(new SubGraph(module.source));
  }

  public toDot() {
    return `
    digraph G {
      rankdir="LR"

      ${this._subGraphs.map((subGraph) => {})}
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
  }
}
