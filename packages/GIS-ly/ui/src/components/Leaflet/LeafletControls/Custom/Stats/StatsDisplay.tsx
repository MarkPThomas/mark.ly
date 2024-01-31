import React, { useState } from "react";
import styled from "styled-components";

import { toUpperFirstLetter } from "../../../../../../../../common/utils/stringFormatting";
import { IEditedStats, Stats } from "../../../Custom/Stats/Paths/Stats";

const S = {
  StatsLabel: styled.span`
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 0;
    padding-bottom: 0;
    justify-content: space-evenly;
  `,

  StatsTitle: styled.h2`
    margin: 0;
  `
};

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
            <S.StatsLabel aria-hidden="true" className="icon-label">
              <S.StatsTitle>{categoryUpperFirst}</S.StatsTitle>
              {iconSvg}
            </S.StatsLabel>
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