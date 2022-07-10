/**
 * supported only unix file system
 */
export class Path {
  private _dirname: string;
  private _directories: string[];
  private _base: string;

  constructor(path: string) {
    const entries = path.split("/");
    this._directories = entries.slice(0, -1);
    this._dirname = this._directories.join();
    this._base = entries[entries.length - 1];
  }

  get dirname() {
    return this._dirname;
  }

  get directories() {
    return this._directories;
  }

  get base() {
    return this._base;
  }

  public hasDirname() {
    return this._directories.length > 0;
  }
}
