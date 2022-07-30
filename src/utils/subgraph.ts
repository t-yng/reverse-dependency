import { Path } from "./path";

export interface DotNode {
  id: string;
  label: string;
}

const generateNodeId = (() => {
  let id = 0;
  return () => `node_${id++}`;
})();

const generateSubGraphId = (() => {
  let id = 0;
  return () => `cluster_${id++}`;
})();

export class SubGraph {
  private _id: string;
  private _label: string;
  private _nodes: DotNode[];
  private _subGraphs: SubGraph[];

  constructor(source: string) {
    const path = new Path(source);
    this._id = generateSubGraphId();
    this._label = path.directories[0];
    this._nodes = [];
    this._subGraphs = [];

    this.addSource(source);
  }

  get id() {
    return this._id;
  }

  get label() {
    return this._label;
  }

  get nodes() {
    return this._nodes;
  }

  get subGraphs() {
    return this._subGraphs;
  }

  get allNodes(): DotNode[] {
    const _nodes: DotNode[] = [];
    _nodes.push(...this._nodes);
    _nodes.push(
      ...this._subGraphs.reduce<DotNode[]>((acc, subGraph) => {
        acc.push(...subGraph.allNodes);
        return acc;
      }, [])
    );

    return _nodes;
  }

  public getNode(source: string): DotNode | null {
    if (this.isSame(source)) {
      const path = new Path(source);
      const node = this._nodes.find((node) => node.label === path.base);
      if (node != null) {
        return node;
      }
      const subGraph = this._subGraphs.find(
        (subGraph) => subGraph.label === path.directories[1]
      );
      if (subGraph != null) {
        const nestedSource = [...path.directories.slice(1), path.base].join(
          "/"
        );
        return subGraph.getNode(nestedSource);
      }
    }

    return null;
  }

  public isSame(source: string) {
    const path = new Path(source);
    return this._label === path.directories[0];
  }

  public addSource(source: string) {
    const path = new Path(source);
    if (!path.hasDirname()) {
      this.addNode(path.base);
      return;
    }

    const nestedSource = [...path.directories.slice(1), path.base].join("/");

    if (this.isSame(source)) {
      this.addSource(nestedSource);
      return;
    }

    for (const subGraph of this.subGraphs) {
      if (subGraph.isSame(source)) {
        subGraph.addSource(nestedSource);
        return;
      }
    }

    this.subGraphs.push(new SubGraph(source));
  }

  public addNode(file: string) {
    // NOTE: 既に追加済みの場合は追加しない
    if (this.nodes.find((node) => node.label === file)) {
      return;
    }

    this.nodes.push({
      id: generateNodeId(),
      label: file,
    });
  }

  public toDot(): string {
    return `
    subgraph ${this._id} {
      label="${this._label}"
      ${this._nodes
        .map((node) => {
          return `${node.id} [label="${node.label}"]`;
        })
        .join("\n")}
      ${this._subGraphs
        .map((subGraph) => {
          return subGraph.toDot();
        })
        .join("\n")}
    }`;
  }
}
