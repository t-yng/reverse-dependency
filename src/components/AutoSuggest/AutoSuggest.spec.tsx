import { describe, expect, it, vitest } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AutoSuggest, AutoSuggestProps } from "./AutoSuggest";

const list = [
  "src/pages/_app.tsx",
  "src/pages/users.tsx",
  "src/pages/users/[id].tsx",
  "src/pages/login.tsx",
  "src/components/UserForm.tsx",
  "src/components/LoginForm.tsx",
];

const renderAutoSuggest = (_props?: Partial<AutoSuggestProps>) => {
  const props: AutoSuggestProps = {
    list,
    onSelect: vitest.fn(),
    ..._props,
  };

  return render(<AutoSuggest {...props} />);
};

describe("AutoSuggest", () => {
  it("入力キーワードに部分マッチするリストを表示", async () => {
    renderAutoSuggest();
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "user");

    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  it("リストアイテムをクリックした時にコールバック関数を呼ぶ", async () => {
    const onSelectMock = vitest.fn();
    renderAutoSuggest({ onSelect: onSelectMock });

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "user");
    await userEvent.click(
      screen.getByText("src/pages/users.tsx", { exact: false })
    );

    expect(onSelectMock).toBeCalledWith("src/pages/users.tsx");
  });

  it("マッチする対象が存在しない時はリストを表示しない", async () => {
    renderAutoSuggest();
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });

  it("入力キーワードを空にした時にリストを表示しない", async () => {
    renderAutoSuggest();

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "user");
    expect(screen.getByRole("list")).toBeInTheDocument();

    await userEvent.clear(input);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
