import { Conversion } from '../../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { ISlope } from "../../../../../../../../../../libraries/gis/src/Core/Route/Stats/SlopeStats";
import { RangeStats } from '../../RangeStats';
import { LabelValue } from "../../../../LabelValue";

import styles from '../../Stats.module.css';

export type SlopeStatsProps = { slope: ISlope, level: number };

export function SlopeStats({ slope, level }: SlopeStatsProps) {
  const CustomTag = level ? `h${level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  const slopeFormat = (slopeRatio: number) => {
    return slopeRatio ? `${(100 * slopeRatio).toFixed(0)}% / ${Conversion.Angle.Percent.toDegrees(100 * slopeRatio).toFixed(0)}°` : '';
  }

  const averageSlope = slopeFormat(slope.avg);

  return (
    <div>
      <LabelValue label={'Avg'} value={averageSlope} />
      <div>
        <CustomTag className={styles.subStatsHeader}>Uphill</CustomTag>
        <RangeStats {...slope.uphill} formatter={slopeFormat} level={level + 1} />
      </div>
      <div>
        <CustomTag className={styles.subStatsHeader}>Downhill</CustomTag>
        <RangeStats {...slope.downhill} formatter={slopeFormat} level={level + 1} />
      </div>
    </div>
  )
}