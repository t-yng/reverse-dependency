import { FC } from "react";
import { Directory } from "./Directory";
import * as styles from "./FileTree.css";

type DirectoryEntryProps = {
  directory: Directory;
};

export const DirectoryEntry: FC<DirectoryEntryProps> = ({ directory }) => {
  return (
    <details className={styles.directoryContent}>
      <summary className={styles.directorySummary}>{directory.name}</summary>
      {directory.subDirectories.map((subDir) => (
        <DirectoryEntry key={subDir.name} directory={subDir} />
      ))}
      {directory.containsFile() && (
        <ul className={styles.directoryContent}>
          {directory.files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </details>
  );
};
