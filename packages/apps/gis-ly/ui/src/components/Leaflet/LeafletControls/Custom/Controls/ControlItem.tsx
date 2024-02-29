import classnames from "classnames";

import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "@markpthomas/common-libraries/utils";

import stylesHeader from './ControlHeader.module.css';
import stylesItem from './ControlItem.module.css';
import stylesDisabled from './disabled.module.css';

export type ControlItemProps = {
  cb: () => void;
  criteria: string;
  iconRight?: boolean;
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  showLabelWithIcon?: boolean;
  title?: string;
  type: string;
}

export function ControlItem({
  cb,
  criteria,
  iconRight,
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
    { [stylesDisabled.disabled]: isDisabled },
  ]);

  const classNameContent = classnames([
    stylesHeader.content,
    { [stylesHeader.iconContent]: (showLabelWithIcon && iconSvg) },
    { [stylesItem.iconItemContent]: (showLabelWithIcon && iconSvg) }
  ]);

  const classNameText = classnames([
    { [stylesHeader.textContentLeft]: (iconSvg && iconRight) || !iconSvg },
    { [stylesHeader.textContentRight]: (iconSvg && !iconRight) || !iconSvg },
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
        <span aria-hidden="true" className={classNameContent}>
          {(showLabelWithIcon && iconSvg) ?
            iconRight ?
              <>
                <div className={classNameText}>{criteriaUppers}</div>{iconSvg}
              </>
              :
              <>
                {iconSvg}<div className={classNameText}>{criteriaUppers}</div>
              </>
            : iconSvg ?? <div className={classNameText}>{criteriaUppers}</div>
          }
        </span>
      </a>
    </div>
  );
}