import { describe, expect, it } from "vitest";
import { Module } from "./graph";
import { generateSubsetModules } from "./search";

const modules: Module[] = [
  {
    source: "src/components/Button.tsx",
    references: ["src/components/UserForm.tsx", "src/components/LoginForm.tsx"],
  },
  {
    source: "src/components/UserForm.tsx",
    references: ["src/pages/users.tsx", "src/pages/users/[id].tsx"],
  },
  {
    source: "src/components/LoginForm.tsx",
    references: ["src/pages/login.tsx"],
  },
  {
    source: "src/pages/users.tsx",
    references: [],
  },
  {
    source: "src/pages/users/[id].tsx",
    references: [],
  },
  {
    source: "src/pages/login.tsx",
    references: [],
  },
  { source: "src/pages/_app.tsx", references: [] },
  {
    source: "src/hooks/useAuth.ts",
    references: ["src/pages/_app.tsx"],
  },
];

describe("search", () => {
  it("モジュールの一覧から指定したモジュールを終点としたモジュールのサブセットを生成", () => {
    const subsetModules = generateSubsetModules(
      modules,
      "src/components/Button.tsx"
    );

    expect(subsetModules).toEqual([
      {
        source: "src/components/Button.tsx",
        references: [
          "src/components/UserForm.tsx",
          "src/components/LoginForm.tsx",
        ],
      },
      {
        source: "src/components/UserForm.tsx",
        references: ["src/pages/users.tsx", "src/pages/users/[id].tsx"],
      },
      {
        source: "src/components/LoginForm.tsx",
        references: ["src/pages/login.tsx"],
      },
      {
        source: "src/pages/users.tsx",
        references: [],
      },
      {
        source: "src/pages/users/[id].tsx",
        references: [],
      },
      {
        source: "src/pages/login.tsx",
        references: [],
      },
    ]);
  });

  it("重複したモジュール返さない", () => {
    const modules = [
      {
        source: "src/components/FileTree.tsx",
        references: ["src/pages/index.tsx"],
      },
      {
        source: "src/components/DirectoryEntry.tsx",
        references: ["src/components/FileTree.tsx"],
      },
      {
        source: "src/common.css.ts",
        references: [
          "src/components/FileTree.tsx",
          "src/components/DirectoryEntry.tsx",
        ],
      },
      {
        source: "src/pages/index.tsx",
        references: [],
      },
    ];

    const subsetModules = generateSubsetModules(modules, "src/common.css.ts");

    expect(subsetModules.length).toBe(4);
    expect(subsetModules).toEqual(expect.arrayContaining(modules));
  });

  it("指定したモジュールが一覧に含まれない場合は空配列を返す", () => {
    const subsetModules = generateSubsetModules(
      modules,
      "src/components/NotExists.tsx"
    );
    expect(subsetModules.length).toBe(0);
  });
});
