import { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../common/utils/stringFormatting";
import { ControlItem } from "./ControlItem";

export type ControlHeaderSwapProps = {
  isToggled?: boolean;
  isDisabled?: boolean;
  category: string;
  children: React.ReactNode[];
  cb?: () => void;
}

export function ControlHeaderSwap({
  isToggled,
  isDisabled,
  category,
  children,
  cb
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

  const classNameLink = `header-control
    ${isDisabled ? ` disabled` : ''}`;

  return (
    <>
      <div
        className="leaflet-bar header"
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
            <span aria-hidden="true">{categoryUpperFirst}</span>
          </a>
          :
          <div className="header-control swap" >
            {children.map((child) => child)}
          </div>}
      </div>
    </>
  );
}