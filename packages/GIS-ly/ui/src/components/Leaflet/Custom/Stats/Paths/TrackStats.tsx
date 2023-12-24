import { Conversion } from '../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { ITrackStats } from "../../../../../model/GIS/Core/Track/Stats";
import { IPolylineSize } from "../../../../../model/Geometry";
import { LabelValue } from "../../LabelValueList";
import { HeightStats } from './Categories/Route/HeightStats';

export interface IEditedTrackStats extends ITrackStats {
  size: IPolylineSize
}

export type TrackStatsProps = { stats: IEditedTrackStats };

export function TrackStats({ stats }: TrackStatsProps) {
  console.log('Stats: ', stats);

  const lengthMiles = `${Conversion.Length.Meters.toMiles(stats.length).toFixed(2)} mi`;

  const toDegrees = (slopeRatio: number) => {
    return ((180 / Math.PI) * Math.atan(slopeRatio)).toFixed(0);
  }

  const toPercent = (slopeRatio: number) => {
    return (100 * slopeRatio).toFixed(0);
  }

  const slopeFormat = (slopeRatio: number) => {
    return `${toPercent(slopeRatio)} % / ${toDegrees(slopeRatio)} deg`;
  }

  const slopeAvg = slopeFormat(stats.slope.avg);
  const slopeUphillAvg = slopeFormat(stats.slope.uphill.avg);
  const slopeUphillMax = slopeFormat(stats.slope.uphill.max.value);
  const slopeDownhillAvg = slopeFormat(stats.slope.downhill.avg);
  const slopeDownhillMax = slopeFormat(stats.slope.downhill.max.value);

  const timeDurationFormat = (timeSec: number) => {
    return `${Conversion.Time.Seconds.toHours(timeSec).toFixed(2)} hrs`;
  }

  const timeIntervalsFormat = (timeSec: number) => {
    return `${timeSec.toFixed(0)} sec`;
  }

  const durationHr = timeDurationFormat(stats.time.duration);
  // Place beneath distance?
  // Details Dropdown?
  const durationMinSec = timeIntervalsFormat(stats.time.minInterval.value);
  const durationMaxSec = timeIntervalsFormat(stats.time.maxInterval.value);


  const speedFormat = (valMetersPerSecond: number) => {
    return `${Conversion.Speed.metersPerSecondToMph(valMetersPerSecond).toFixed(1)} mph`;
  }

  const speedAvgMph = speedFormat(stats.speed.avg);
  const speedMaxMph = speedFormat(stats.speed.max.value);
  const speedMinMph = speedFormat(stats.speed.min.value);


  const heightRateFormat = (valMetersPerSecond: number) => {
    return `${Conversion.Speed.metersPerSecondToFeetPerHour(valMetersPerSecond).toFixed(0)} ft/hr`;
  }

  const ascentAvgFtPrHr = heightRateFormat(stats.heightRate.ascent.avg);
  const ascentMaxFtPrHr = heightRateFormat(stats.heightRate.ascent.max.value);
  const descentAvgFtPrHr = heightRateFormat(stats.heightRate.descent.avg);
  const descentMaxFtPrHr = heightRateFormat(stats.heightRate.descent.max.value);

  return (
    <div>
      <div><h2>Stats</h2></div>
      <div><h3>Route</h3></div>

      {stats.length ?
        <LabelValue label={'Distance'} value={lengthMiles} /> : null}
      {stats.height ?
        <div>
          <h4>Elevation</h4>
          <HeightStats height={stats.height} />
        </div>
        : null}
      {stats.slope ?
        <div>
          <LabelValue label={'Slope Avg'} value={slopeAvg} />
          <LabelValue label={'Slope Uphill Avg'} value={slopeUphillAvg} />
          <LabelValue label={'Slope Uphill Max'} value={slopeUphillMax} />
          <LabelValue label={'Slope Downhill Avg'} value={slopeDownhillAvg} />
          <LabelValue label={'Slope Downhill Max'} value={slopeDownhillMax} />
        </div>
        : null}

      <div><h3>Track</h3></div>
      {stats.time ?
        <div>
          <LabelValue label={'Duration'} value={durationHr} />
          <LabelValue label={'Duration Min'} value={durationMinSec} />
          <LabelValue label={'Duration Max'} value={durationMaxSec} />
        </div>
        : null}
      {stats.speed ?
        <div>
          <LabelValue label={'Speed Avg'} value={speedAvgMph} />
          <LabelValue label={'Speed Max'} value={speedMaxMph} />
          <LabelValue label={'Speed Min'} value={speedMinMph} />
        </div>
        : null}
      {stats.heightRate ?
        <div>
          <LabelValue label={'Ascent Avg'} value={ascentAvgFtPrHr} />
          <LabelValue label={'Ascent Max'} value={ascentMaxFtPrHr} />
          <LabelValue label={'Descent Avg'} value={descentAvgFtPrHr} />
          <LabelValue label={'Descent Max'} value={descentMaxFtPrHr} />
        </div>
        : null}
    </div>
  )
}