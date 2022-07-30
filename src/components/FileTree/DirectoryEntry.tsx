import { FC } from "react";
import classNames from "classnames";
import { Directory } from "./Directory";
import * as styles from "./DirectoryEntry.css";

type DirectoryEntryProps = {
  directory: Directory;

  onClickFile: (source: string) => void;
  onClickDirectory: (source: string) => void;
  selectedEntrySource: string | null;
};

export const DirectoryEntry: FC<DirectoryEntryProps> = ({
  directory,
  onClickFile,
  onClickDirectory,
  selectedEntrySource,
}) => {
  return (
    <details className={styles.directoryContent}>
      <summary
        className={classNames([styles.directorySummary, styles.entry], {
          [styles.selected]: directory.source === selectedEntrySource,
        })}
        onClick={() => {
          onClickDirectory(directory.source);
        }}
      >
        {directory.name}
      </summary>
      {directory.subDirectories.map((subDir) => (
        <DirectoryEntry
          key={subDir.source}
          directory={subDir}
          onClickFile={onClickFile}
          onClickDirectory={onClickDirectory}
          selectedEntrySource={selectedEntrySource}
        />
      ))}
      {directory.containsFile() && (
        <ul className={styles.directoryContent}>
          {directory.files.map((file) => (
            <li
              key={file.source}
              onClick={() => {
                onClickFile(file.source);
              }}
              className={classNames(
                {
                  [styles.selected]: file.source === selectedEntrySource,
                },
                styles.entry
              )}
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
};
