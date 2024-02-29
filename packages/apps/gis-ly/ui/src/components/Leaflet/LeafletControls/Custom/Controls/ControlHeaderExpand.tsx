import classnames from "classnames";
import { ControlPosition } from "leaflet";
import React, { useState } from "react";

import { toUpperFirstLetter } from "@markpthomas/common-libraries/utils";

import stylesHeader from './ControlHeader.module.css';
import stylesExpand from './ControlHeaderExpand.module.css';
import stylesDisabled from './disabled.module.css';

export type ControlHeaderExpandProps = {
  category: string;
  cb?: () => void;
  children: React.ReactNode[];
  childrenAlignedBeside?: boolean;
  childrenBeside?: boolean;
  forceClosed?: boolean;
  forceClosedIfToggled?: boolean;
  iconRight?: boolean;
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  isToggled?: boolean;
  position?: ControlPosition;
  showLabelWithIcon?: boolean;
  title?: string;
}

export function ControlHeaderExpand({
  category,
  cb,
  children,
  childrenAlignedBeside,
  childrenBeside,
  iconRight,
  iconSvg,
  isDisabled,
  isToggled,
  position,
  showLabelWithIcon,
  title
}: ControlHeaderExpandProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>((isToggled && !isDisabled) ? true : false);

  const setToggle = () => {
    if (!isDisabled) {
      setCurrentlyToggled(!currentlyToggled);
      if (cb) {
        cb();
      }
    }
  }

  const categoryUpperFirst = toUpperFirstLetter(category);
  const localTitle = `${categoryUpperFirst} Operations`;

  const classNameHeader = classnames([
    'leaflet-bar',
    stylesHeader.header,
    { [stylesExpand.childColBeside]: childrenBeside },
    { [stylesHeader.headerBottomRight]: position === 'bottomright' }
  ]);

  const classNameLink = classnames([
    stylesHeader.control,
    { [stylesExpand.toggled]: (currentlyToggled && !isDisabled) },
    { [stylesExpand.toggledBeside]: childrenBeside },
    { [stylesDisabled.disabled]: isDisabled },
  ]);

  const classNameContent = classnames([
    stylesHeader.content,
    { [stylesHeader.iconContent]: (showLabelWithIcon && iconSvg) }
  ]);

  const classNameChildren = classnames([
    { [stylesExpand.beside]: childrenAlignedBeside },
    { [stylesExpand.accordionContent]: currentlyToggled && !childrenBeside },
    { [stylesExpand.accordionContentHide]: !currentlyToggled && !childrenBeside },
    { [stylesExpand.accordionContentHorizontal]: currentlyToggled && childrenBeside },
    { [stylesExpand.accordionContentHorizontalHide]: !currentlyToggled && childrenBeside },
  ]);

  const classNameText = classnames([
    { [stylesHeader.textContentLeft]: (iconSvg && iconRight) || !iconSvg },
    { [stylesHeader.textContentRight]: (iconSvg && !iconRight) || !iconSvg },
  ]);

  return (
    <>
      <div className={classNameHeader}>
        <a className={classNameLink}
          href="#"
          title={title ?? localTitle}
          aria-label={title ?? localTitle}
          aria-disabled="false"
          role="button"
          onClick={setToggle}
        >
          <span aria-hidden="true" className={classNameContent}>
            {(showLabelWithIcon && iconSvg) ?
              iconRight ?
                <>
                  <div className={classNameText}>{categoryUpperFirst}</div>{iconSvg}
                </>
                :
                <>
                  {iconSvg}<div className={classNameText}>{categoryUpperFirst}</div>
                </>
              : iconSvg ?? <div className={classNameText}>{categoryUpperFirst}</div>
            }
          </span>

        </a>
        {(currentlyToggled && !isDisabled) ?
          <div className={classNameChildren}>
            {children.map((child) => child)}
          </div>
          : null}
      </div>
    </>
  );
}