import { FC } from "react";
import { Directory } from "./Directory";
import * as styles from "./FileTree.css";

type DirectoryEntryProps = {
  directory: Directory;
  onClickFile: (source: string) => void;
};

export const DirectoryEntry: FC<DirectoryEntryProps> = ({
  directory,
  onClickFile,
}) => {
  return (
    <details className={styles.directoryContent}>
      <summary className={styles.directorySummary}>{directory.name}</summary>
      {directory.subDirectories.map((subDir) => (
        <DirectoryEntry
          key={subDir.name}
          directory={subDir}
          onClickFile={onClickFile}
        />
      ))}
      {directory.containsFile() && (
        <ul className={styles.directoryContent}>
          {directory.files.map((file) => (
            <li key={file.name} onClick={() => onClickFile(file.source)}>
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
};
