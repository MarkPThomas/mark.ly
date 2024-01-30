import { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../../common/utils/stringFormatting";

import './ControlHeader.css';
import './ControlHeaderSwap.css';

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
            {
              iconSvg ?? <span aria-hidden="true">{categoryUpperFirst}</span>
            }
          </a>
          :
          <div className="header-control swap" >
            {children.map((child) => child)}
          </div>}
      </div>
    </>
  );
}