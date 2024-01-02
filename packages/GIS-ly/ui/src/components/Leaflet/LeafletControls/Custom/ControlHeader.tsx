import { useState } from "react";

import { toUpperFirstLetter, toUpperFirstLetterOfEach } from "../../../../../../../common/utils/stringFormatting";
import { ControlItem } from "./ControlItem";

export type ControlHeaderProps = {
  isToggled?: boolean;
  isEnabled?: boolean;
  category: string;
  children: React.ReactNode[];
  childrenBeside?: boolean;
  childrenAlignedBeside?: boolean;
}

export function ControlHeader({ isToggled, isEnabled, category, children, childrenBeside, childrenAlignedBeside }: ControlHeaderProps) {
  const [currentlyToggled, setCurrentlyToggled] = useState<boolean>(isToggled ?? false);

  const handleClick = () => {
    setCurrentlyToggled(!currentlyToggled);
  };

  const categoryUpperFirst = toUpperFirstLetter(category);
  const title = `${categoryUpperFirst} Operations`;

  const classNameBar = `leaflet-bar header ${childrenBeside ? `child-col-beside` : ''}`;
  const classNameLink = `header-control${currentlyToggled ? ' toggled' : ''}`;
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
          onClick={handleClick}>
          <span aria-hidden="true">{categoryUpperFirst}</span>
        </a>
        {currentlyToggled ?
          <div className={classNameChildren}>
            {children.map((child) => child)}
          </div>
          : null}
      </div>
    </>
  );
}