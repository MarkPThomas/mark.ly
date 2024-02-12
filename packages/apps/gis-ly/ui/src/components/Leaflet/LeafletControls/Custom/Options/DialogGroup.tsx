import classnames from "classnames";
import { toTrainCase, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

import styles from './styles.module.css';
import stylesDisabled from '../Controls/disabled.module.css';

export interface IDialogGroup {
  title: string;
  items: IDialogItem[];
}

export interface IDialogItem {
  name: string;
  cb: () => void;
  isDisabled?: boolean;
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
      <h3 className={styles.title}>{titleFirstUpperCase}</h3>
      {group.items.map((item, index) =>
        <a key={`${titleTrainCase}-${index}-option`}
          href="#"
          className={classnames([
            styles.link,
            { [stylesDisabled.disabled]: group.items[index].isDisabled },
          ])}
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