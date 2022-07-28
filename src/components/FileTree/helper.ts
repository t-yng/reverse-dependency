import { Directory, File } from "./Directory";

export const toDirectory = (files: string[]) => {
  if (files.length === 0) return null;

  let rootDir: Directory = new Directory(files[0].split("/")[0]);

  for (const file of files) {
    const entries = file.split("/").slice(1);
    entries.reduce<Directory>((prevDir, entry, i) => {
      // if (prev.length === 0) {
      //   return [new Directory(entry)];
      // }

      if (i === entries.length - 1) {
        prevDir.addEntry(new File(entry));
        return prevDir;
      }

      const subDirectory = prevDir.getSubDirectory(entry);
      if (subDirectory != null) {
        return subDirectory;
      } else {
        const dir = new Directory(entry);
        prevDir.addEntry(dir);
        return dir;
      }
    }, rootDir);
  }

  return rootDir;
};
