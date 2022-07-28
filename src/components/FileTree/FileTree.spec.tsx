import { render } from "@testing-library/react";
import { it, describe } from "vitest";
import { FileTree } from "./FileTree";

const files: string[] = [
  "src/components/Button.tsx",
  "src/components/FileTree/FileTree.tsx",
  "src/components/FileTree/index.ts",
];

describe("FileTree", () => {
  it("モジュールの一覧からファイルのツリー構造を生成", () => {
    const { asFragment } = render(<FileTree files={files} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
