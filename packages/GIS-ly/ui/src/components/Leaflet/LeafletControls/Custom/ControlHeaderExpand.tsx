import { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../common/utils/stringFormatting";
import { ControlItem } from "./ControlItem";

export type ControlHeaderExpandProps = {
  isToggled?: boolean;
  isDisabled?: boolean;
  forceClosedIfToggled?: boolean;
  category: string;
  children: React.ReactNode[];
  childrenBeside?: boolean;
  childrenAlignedBeside?: boolean;
  forceClosed?: boolean;
  cb?: () => void;
}

export function ControlHeaderExpand({
  isToggled,
  isDisabled,
  category,
  children,
  childrenBeside,
  childrenAlignedBeside,
  cb
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
  const title = `${categoryUpperFirst} Operations`;

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
          title={title}
          aria-label={title}
          aria-disabled="false"
          role="button"
          onClick={setToggle}
        >
          <span aria-hidden="true">{categoryUpperFirst}</span>
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