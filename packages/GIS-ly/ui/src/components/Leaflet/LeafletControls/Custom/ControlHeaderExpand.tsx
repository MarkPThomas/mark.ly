import { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../common/utils/stringFormatting";
import { ControlItem } from "./ControlItem";
import React from "react";

export type ControlHeaderExpandProps = {
  category: string;
  cb?: () => void;
  children: React.ReactNode[];
  childrenAlignedBeside?: boolean;
  childrenBeside?: boolean;
  forceClosed?: boolean;
  forceClosedIfToggled?: boolean;
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
  iconSvg,
  isDisabled,
  isToggled,
  showLabelWithIcon,
  title
}: ControlHeaderExpandProps) {
  const [hover, setHover] = useState<boolean>(false);
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

  const classNameBar = `leaflet-bar header ${childrenBeside ? `child-col-beside` : ''}`;
  const classNameLink = `header-control
    ${(currentlyToggled && !isDisabled) ? ' toggled' : ''}
    ${isDisabled ? ` disabled` : ''}`;
  const classNameChildren = `${childrenAlignedBeside ? `beside` : ''}`;

  return (
    <>
      <div className={classNameBar}>
        <a className={classNameLink}
          href="#"
          title={title ?? localTitle}
          aria-label={title ?? localTitle}
          aria-disabled="false"
          role="button"
          onClick={setToggle}
        >
          {(showLabelWithIcon && iconSvg) ?
            <span aria-hidden="true" className="icon-label">
              {iconSvg}
              {categoryUpperFirst}
            </span>
            :
            iconSvg ?? <span aria-hidden="true">{categoryUpperFirst}</span>
          }
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