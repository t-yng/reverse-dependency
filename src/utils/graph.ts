import { DotNode, SubGraph } from "./subgraph";

export interface Module {
  source: string;
  // dirname: string;
  // file: string;
  references: string[];
}

export class Graph {
  private _subGraphs: SubGraph[];
  private _modules: Module[];

  constructor() {
    this._subGraphs = [];
    this._modules = [];
  }

  get subGraphs() {
    return this._subGraphs;
  }

  private get directions() {
    let directions = [];
    for (const mod of this._modules) {
      if (mod.references.length > 0) {
        const targetNode = this._subGraphs
          .map((subGraph) => subGraph.getNode(mod.source))
          .find((node) => node != null);

        if (targetNode == null) {
          continue;
        }

        for (const ref of mod.references) {
          const sourceNode = this._subGraphs.map((subGraph) =>
            subGraph.getNode(ref)
          )[0];
          if (sourceNode == null) {
            continue;
          }
          directions.push([sourceNode.id, targetNode.id]);
        }
      }
    }

    return directions;
  }

  private get nodes() {
    const _nodes = this._subGraphs.reduce<DotNode[]>((acc, subGraph) => {
      acc.push(...subGraph.allNodes);
      return acc;
    }, []);

    return _nodes;
  }

  public addModule(module: Module) {
    this._modules.push(module);

    for (const subGraph of this._subGraphs) {
      if (subGraph.isSame(module.source)) {
        subGraph.addSource(module.source);
        return;
      }
    }

    this._subGraphs.push(new SubGraph(module.source));
  }

  public toDot() {
    const directions = this.directions;

    return `
    digraph G {
      rankdir="LR"

      ${this._subGraphs.map((subGraph) => subGraph.toDot()).join("\n")}

      ${directions
        .map((direction) => `${direction[0]} -> ${direction[1]}`)
        .join("\n")}
    }
    `;
  }
}
