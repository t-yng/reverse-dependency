import { toDirectory } from "./helper";

const files: string[] = [
  "src/components/Button.tsx",
  "src/components/FileTree/FileTree.tsx",
  "src/components/FileTree/index.ts",
];

describe("FileTree/helper", () => {
  it("ファイルパスの配列からディレクトリオブジェクトを生成", () => {
    const dir = toDirectory(files);

    expect(dir?.name).toBe("src");
    expect(dir?.entries.length).toBe(1);
    expect(dir?.entries[0].name).toBe("components");
    expect(dir?.entries[0].entries?.length).toBe(2);
    expect(dir?.entries[0].entries?.[0].name).toBe("Button.tsx");
    expect(dir?.entries[0].entries?.[0].source).toBe(
      "src/components/Button.tsx"
    );
    expect(dir?.entries[0].entries?.[1].name).toBe("FileTree");
    expect(dir?.entries[0].entries?.[1].entries?.length).toBe(2);
    expect(dir?.entries[0].entries?.[1].entries?.[0].name).toBe("FileTree.tsx");
    expect(dir?.entries[0].entries?.[1].entries?.[0].source).toBe(
      "src/components/FileTree/FileTree.tsx"
    );
    expect(dir?.entries[0].entries?.[1].entries?.[1].name).toBe("index.ts");
    expect(dir?.entries[0].entries?.[1].entries?.[1].source).toBe(
      "src/components/FileTree/index.ts"
    );
  });
});
