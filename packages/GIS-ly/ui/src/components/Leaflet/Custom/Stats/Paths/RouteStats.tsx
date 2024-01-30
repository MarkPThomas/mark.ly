import { Conversion } from '../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';

import { LabelValue } from "../../LabelValue";
import { ToggleGroup } from "../../ToggleGroup";
import { HeightStats, SlopeStats } from './Categories/Route';
import { IEditedStats } from "./Stats";

export type RouteStatsProp = { stats: IEditedStats, level: number }

export function RouteStats({ stats, level }: RouteStatsProp) {

  const lengthMiles = `${Conversion.Length.Meters.toMiles(stats.length).toFixed(2)} mi`;

  return (
    <div>
      <LabelValue label={'Distance'} value={lengthMiles} />
      {stats.height ?
        <ToggleGroup
          value={'Elevation'}
          level={level}
          children={[<HeightStats key={Date()} height={stats.height} level={level + 2} />]}
        /> : null}
      {stats.slope ?
        <ToggleGroup
          value={'Slope'}
          level={level}
          children={[<SlopeStats key={Date()} slope={stats.slope} level={level + 2} />]}
        /> : null}
    </div>
  );
}