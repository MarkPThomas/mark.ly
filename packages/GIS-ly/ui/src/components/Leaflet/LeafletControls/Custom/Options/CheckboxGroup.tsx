import styled from "styled-components";
import { toCamelCase, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

const S = {
  OptionsTitle: styled.h3`
    margin: 0;
  `
};

export interface ICheckboxGroup {
  title: string;
  items: ICheckboxItem[];
}

export interface ICheckboxItem {
  name: string;
  isChecked: boolean;
  cb: () => void;
}

export type Props = {
  group: ICheckboxGroup;
}

export function CheckboxGroup({ group }: Props) {
  const titleLowercase = group.title.toLowerCase();
  const titleFirstUpperCase = toUpperFirstLetterOfEach(group.title, true);

  const optionsFormatted = [];
  group.items.forEach((item) => {
    optionsFormatted.push({
      nameCamelCase: toCamelCase(item.name),
      nameFormatted: toUpperFirstLetterOfEach(item.name)
    });
  });

  return (group.items.length ?
    <div key={`options-${titleLowercase}`} className={`options options-${titleLowercase}`}>
      <hr />
      <S.OptionsTitle>{titleFirstUpperCase}</S.OptionsTitle>
      {group.items.map((item, index) =>
        <div key={optionsFormatted[index].nameCamelCase}>
          <input type="checkbox" onChange={item.cb} id={optionsFormatted[index].nameCamelCase} checked={item.isChecked} />
          <label htmlFor={optionsFormatted[index].nameCamelCase}>{optionsFormatted[index].nameFormatted}</label>
        </div>
      )}
    </div>
    : null
  );
}