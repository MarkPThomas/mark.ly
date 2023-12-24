import { Conversion } from '../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { IPolylineSize } from "../../../../../model/Geometry";
import { ITrackStats } from "../../../../../model/GIS/Core/Track/Stats";

import { LabelValue } from "../../LabelValueList";

import { HeightStats, SlopeStats } from './Categories/Route';
import { HeightRateStats, SpeedStats, TimeStats } from './Categories/Track';

export interface IEditedTrackStats extends ITrackStats {
  size: IPolylineSize
}

export type TrackStatsProps = { stats: IEditedTrackStats };

export function TrackStats({ stats }: TrackStatsProps) {
  console.log('Stats: ', stats);

  const lengthMiles = `${Conversion.Length.Meters.toMiles(stats.length).toFixed(2)} mi`;

  return (
    <div>
      <div>
        <h2>Stats</h2>
        <div>
          <h3>Route</h3>
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
              <h4>Slope</h4>
              <SlopeStats slope={stats.slope} />
            </div>
            : null}
        </div>
        <div>
          <h3>Track</h3>
          {stats.height ?
            <div>
              <h4>Time</h4>
              <TimeStats time={stats.time} />
            </div>
            : null}
          {stats.height ?
            <div>
              <h4>Speed</h4>
              <SpeedStats speed={stats.speed} />
            </div>
            : null}
          {stats.height ?
            <div>
              <h4>Height Rate</h4>
              <HeightRateStats heightRate={stats.heightRate} />
            </div>
            : null}
        </div>
      </div>
    </div>
  )
}