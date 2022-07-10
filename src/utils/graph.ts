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

      ${this._subGraphs.map((subGraph) => subGraph.toDot()).join("\n\n")}
    }
    `;
  }
}
