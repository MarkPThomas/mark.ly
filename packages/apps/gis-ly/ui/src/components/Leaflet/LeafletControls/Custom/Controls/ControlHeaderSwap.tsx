import { useState } from "react";
import classnames from 'classnames';

import { toUpperFirstLetter } from "common/utils/stringFormatting";

import stylesHeader from './ControlHeader.module.css';
import stylesSwap from './ControlHeaderSwap.module.css';
import stylesDisabled from './disabled.module.css';

export type ControlHeaderSwapProps = {
  category: string;
  cb?: () => void;
  children: React.ReactNode[];
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  isToggled?: boolean;
}

export function ControlHeaderSwap({
  category,
  cb,
  children,
  iconSvg,
  isToggled,
  isDisabled,
}: ControlHeaderSwapProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const setToggle = () => {
    if (!isDisabled) {
      setCurrentlyToggled(!currentlyToggled);
      if (cb) {
        cb();
      }
    }
  }

  const categoryUpperFirst = toUpperFirstLetter(category);
  const title = `${categoryUpperFirst} Operations`;

  const classNameHeader = classnames([
    'leaflet-bar',
    stylesHeader.header
  ]);

  const classNameLink = classnames([
    stylesHeader.control,
    { [stylesDisabled.disabled]: isDisabled },
  ]);

  const classNameChildren = classnames([
    stylesSwap.swap,
    { [stylesSwap.accordionContent]: currentlyToggled },
    { [stylesSwap.accordionContentHide]: !currentlyToggled },
  ]);

  return (
    <>
      <div
        className={classNameHeader}
        onMouseEnter={setToggle}
        onMouseLeave={setToggle}
      >
        {!currentlyToggled ?
          <a className={classNameLink}
            href="#"
            title={title}
            aria-label={title}
            aria-disabled="false"
            role="button"
          >
            {
              iconSvg ?? <span aria-hidden="true" className={stylesHeader.content}>{categoryUpperFirst}</span>
            }
          </a>
          :
          <div className={classNameChildren} >
            {children.map((child) => child)}
          </div>}
      </div>
    </>
  );
}