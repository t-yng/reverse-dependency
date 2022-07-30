export interface DirectoryEntry {
  name: string;
  source: string;
  entries?: DirectoryEntry[];
}

export class File implements DirectoryEntry {
  constructor(readonly name: string, readonly source: string) {}
}

const isDirectory = (entry: DirectoryEntry): entry is Directory => {
  return entry.entries != null;
};

const isFile = (entry: DirectoryEntry): entry is Directory => {
  return entry.entries == null;
};

export class Directory implements DirectoryEntry {
  readonly name: string;
  readonly source: string;
  private _entries: DirectoryEntry[];

  constructor(name: string, source: string) {
    this.name = name;
    this.source = source;
    this._entries = [];
  }

  get entries() {
    return this._entries;
  }

  get subDirectories(): Directory[] {
    return (
      this._entries.filter<Directory>((entry): entry is Directory =>
        isDirectory(entry)
      ) ?? []
    );
  }

  get files(): File[] {
    return (
      this._entries.filter<File>((entry): entry is File => isFile(entry)) ?? []
    );
  }

  public getEntry(name: string) {
    return this._entries.find((entry) => entry.name === name);
  }

  public getSubDirectory(name: string): Directory | null {
    const entry = this._entries.find((entry) => entry.name === name);
    return entry != null && isDirectory(entry) ? entry : null;
  }

  public addEntry(entry: DirectoryEntry) {
    // 重複したものは追加しない
    if (this._entries.findIndex((_entry) => _entry.name === entry.name) < 0) {
      this._entries.push(entry);
    }
  }

  public containsFile() {
    return this._entries.find((entry) => isFile(entry));
  }
}
