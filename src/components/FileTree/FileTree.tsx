import { FC } from "react";
import * as styles from "./FileTree.css";
import { toDirectory } from "./helper";
import { DirectoryEntry } from "./DirectoryEntry";

type FileTreeProps = {
  files: string[];
};

export const FileTree: FC<FileTreeProps> = ({ files }) => {
  const rootDirectory = toDirectory(files);

  if (rootDirectory == null) {
    return null;
  }

  return (
    <div className={styles.root}>
      <DirectoryEntry directory={rootDirectory} />
    </div>
  );
};
