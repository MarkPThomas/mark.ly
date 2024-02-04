import React, { useState } from "react";

import { toUpperFirstLetter } from "../../../../../../../../common/utils/stringFormatting";
import { IEditedStats, Stats } from "../../../Custom/Stats/Paths/Stats";

import styles from './StatsDisplay.module.css';

export type StatsDisplayProps = {
  stats: IEditedStats;
  category: string;
  cb?: () => void;
  children: React.ReactNode[];
  iconSvg?: React.ReactNode;
  isDisabled?: boolean;
  isToggled?: boolean;
  title?: string;
}

export function StatsDisplay({
  stats,
  category,
  cb,
  iconSvg,
  isDisabled,
  isToggled,
  title
}: StatsDisplayProps) {
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

  const classNameBar = `leaflet-bar header`;
  const classNameLink = `header-control
    ${(currentlyToggled && !isDisabled) ? ' toggled' : ''}
    ${isDisabled ? ` disabled` : ''}`;

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
          {(currentlyToggled && !isDisabled) ?
            <span aria-hidden="true" className={styles.label}>
              <h2 className={styles.title}>{categoryUpperFirst}</h2>
              {iconSvg}
            </span>
            :
            iconSvg
          }
        </a>
        {(currentlyToggled && !isDisabled) ?
          <div className="leaflet-bar">
            <Stats stats={stats} />
          </div>
          : null}
      </div>
    </>
  )
}