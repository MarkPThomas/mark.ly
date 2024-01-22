import { toTrainCase, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

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
      <h3>{titleFirstUpperCase}</h3>
      {group.items.map((item, index) =>
        <a key={`${titleTrainCase}-${index}-option`} className={`${optionsFormatted[index].nameTrainCase}-option`}
          href="#"
          title={optionsFormatted[index].nameTrainCase}
          aria-label={optionsFormatted[index].nameTrainCase}
          aria-disabled="false"
          role="button"
          onClick={item.cb}
        >
          <span aria-hidden="true">{optionsFormatted[index].nameFormatted}</span>
        </a>
      )}
    </div>
    : null
  );
}