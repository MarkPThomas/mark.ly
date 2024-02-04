import classnames from "classnames";
import React, { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../../common/utils/stringFormatting";

import stylesHeader from './ControlHeader.module.css';
import stylesExpand from './ControlHeaderExpand.module.css';

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
    { [stylesExpand.child_col_beside]: childrenBeside }
  ]);

  const classNameLink = classnames([
    stylesHeader.control,
    { [stylesExpand.toggled]: (currentlyToggled && !isDisabled) },
    { [stylesExpand.toggled_beside]: childrenBeside },
    { 'disabled': isDisabled },
  ]);

  const classNameContent = classnames([
    stylesHeader.content,
    { [stylesHeader.icon_content]: (showLabelWithIcon && iconSvg) }
  ]);

  const classNameChildren = classnames([
    { [stylesExpand.beside]: childrenAlignedBeside }
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
                  {categoryUpperFirst}
                  {iconSvg}
                </>
                :
                <>
                  {iconSvg}
                  {categoryUpperFirst}
                </>
              : <>{categoryUpperFirst}</>
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