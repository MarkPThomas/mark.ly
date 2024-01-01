import { Conversion } from '../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { LabelValue } from "../../LabelValueList";
import { ToggleGroup } from "../../ToggleGroup";
import { HeightStats, SlopeStats } from './Categories/Route';
import { IEditedStats } from "./Stats";

export type RouteStatsProp = { stats: IEditedStats }

export function RouteStats({ stats }: RouteStatsProp) {

  const lengthMiles = `${Conversion.Length.Meters.toMiles(stats.length).toFixed(2)} mi`;

  return (
    <div>
      {lengthMiles ?
        <LabelValue label={'Distance'} value={lengthMiles} /> : null
      }
      {stats.height ?
        <ToggleGroup
          value={'Elevation'}
          level={4}
          children={[<HeightStats height={stats.height} />]}
        /> : null}
      {stats.slope ?
        <ToggleGroup
          value={'Slope'}
          level={4}
          children={[<SlopeStats slope={stats.slope} />]}
        /> : null}
    </div>
  );
}