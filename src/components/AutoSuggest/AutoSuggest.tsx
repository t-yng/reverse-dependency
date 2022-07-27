import { ChangeEvent, FC, useState } from "react";

export type AutoSuggestProps = {
  list: string[];
  onSelect: (item: string) => void;
};

export const AutoSuggest: FC<AutoSuggestProps> = ({ list, onSelect }) => {
  const [filteredItems, setItems] = useState<typeof list>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (keyword === "") {
      setItems([]);
      return;
    }
    setItems(
      list.filter((item) =>
        item.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      )
    );
  };

  return (
    <>
      <input type="text" onChange={handleChange} />
      {filteredItems.length > 0 && (
        <ul>
          {filteredItems.map((item) => (
            <li key={item} onClick={() => onSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
