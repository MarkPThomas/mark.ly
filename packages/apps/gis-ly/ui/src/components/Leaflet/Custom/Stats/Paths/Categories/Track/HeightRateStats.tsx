import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { IHeightRate } from "../../../../../../../../../../libraries/gis/src/Core/Track/Stats/HeightRateStats";
import { RangeStats } from '../../RangeStats';

import styles from '../../Stats.module.css';

export type HeightRateStatsProps = { heightRate: IHeightRate, level: number };

export function HeightRateStats({ heightRate, level }: HeightRateStatsProps) {
  const CustomTag = level ? `h${level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;


  const heightRateFormat = (valMetersPerSecond: number) => {
    return valMetersPerSecond ? `${Conversion.Speed.MetersPerSecond.toFeetPerHour(valMetersPerSecond).toFixed(0)} ft/hr` : '';
  }

  return (
    <div>
      <div>
        <CustomTag className={styles.subStatsHeader}>Ascent</CustomTag>
        <RangeStats {...heightRate.ascent} formatter={heightRateFormat} level={level + 1} />
      </div>
      <div>
        <CustomTag className={styles.subStatsHeader}>Descent</CustomTag>
        <RangeStats {...heightRate.descent} formatter={heightRateFormat} level={level + 1} />
      </div>
    </div>
  )
}