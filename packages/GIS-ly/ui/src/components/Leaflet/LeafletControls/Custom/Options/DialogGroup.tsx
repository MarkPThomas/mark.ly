import styled from "styled-components";
import { toTrainCase, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

// TODO: Not quite working
const S = {
  Option: styled.a`
    white-space: nowrap;
    font-weight: bold;
    color: blue;
    width: fit-content;
    padding-left: 5px;
    padding-right: 5px;
    &:hover {
      font-style: underline;
      color: red;
    }
  `,

  OptionsTitle: styled.h3`
    margin: 0;
  `
};

export interface IDialogGroup {
  title: string;
  items: IDialogItem[];
}

export interface IDialogItem {
  name: string;
  cb: () => void;
}


export type Props = {
  group: IDialogGroup
}

export function DialogGroup({ group }: Props) {
  const titleTrainCase = toTrainCase(group.title);
  const titleFirstUpperCase = toUpperFirstLetterOfEach(group.title, true);

  const optionsFormatted = [];
  group.items.forEach((item) => {
    optionsFormatted.push({
      nameTrainCase: toTrainCase(item.name),
      nameFormatted: toUpperFirstLetterOfEach(item.name)
    });
  });

  return (group.items.length ?
    <div key={`options-${titleTrainCase}`} className={`options options-${titleTrainCase}`}>
      <S.OptionsTitle>{titleFirstUpperCase}</S.OptionsTitle>
      {group.items.map((item, index) =>
        <S.Option key={`${titleTrainCase}-${index}-option`}
          href="#"
          title={optionsFormatted[index].nameTrainCase}
          aria-label={optionsFormatted[index].nameTrainCase}
          aria-disabled="false"
          role="button"
          onClick={item.cb}
        >
          <span aria-hidden="true">{optionsFormatted[index].nameFormatted}</span>
        </S.Option>
      )}
    </div>
    : null
  );
}