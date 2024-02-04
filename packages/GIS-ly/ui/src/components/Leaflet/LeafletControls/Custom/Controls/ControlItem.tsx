import classnames from "classnames";

import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../../common/utils/stringFormatting";

import stylesHeader from './ControlHeader.module.css';
import stylesItem from './ControlItem.module.css';

export type ControlItemProps = {
  cb: () => void;
  criteria: string;
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  showLabelWithIcon?: boolean;
  title?: string;
  type: string;
}

export function ControlItem({
  cb,
  criteria,
  iconSvg,
  isDisabled,
  showLabelWithIcon,
  title,
  type,
}: ControlItemProps) {
  const typeUpperFirst = toUpperFirstLetter(type);
  const criteriaUppers = toUpperFirstLetterOfEach(criteria);
  const localTitle = `${typeUpperFirst} by ${criteriaUppers}`;

  const classNameHeader = classnames([
    'leaflet-bar'
  ]);

  const classNameLink = classnames([
    stylesHeader.control,
    { 'disabled': isDisabled }
  ]);

  const classNameContent = classnames([
    stylesHeader.content,
    { [stylesHeader.icon_content]: (showLabelWithIcon && iconSvg) },
    { [stylesItem.icon_item_content]: (showLabelWithIcon && iconSvg) }
  ]);

  const handleClick = () => {
    if (!isDisabled && cb) {
      cb();
    }
  }

  return (
    <div className={classNameHeader}>
      <a className={classNameLink}
        href="#"
        title={title ?? localTitle}
        aria-label={title ?? localTitle}
        aria-disabled="false"
        role="button"
        onClick={handleClick}
      >
        {(!showLabelWithIcon && iconSvg) ?
          iconSvg
          :
          <span aria-hidden="true" className={classNameContent}>
            {(showLabelWithIcon && iconSvg) ?
              <>
                {iconSvg} {criteriaUppers}
              </>
              :
              <>
                {criteriaUppers}
              </>
            }
          </span>
        }
      </a>
    </div>
  );
}