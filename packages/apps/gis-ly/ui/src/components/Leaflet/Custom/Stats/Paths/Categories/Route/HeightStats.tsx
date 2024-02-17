import { Conversion } from '@markpthomas/units/conversion';
import { IHeight } from '@markpthomas/gis/core/route/stats';

// TODO: Remove later once Median Elevation fixed. VVVVVVV
import { RoutePoint, RouteSegment } from '@markpthomas/gis/core/route';
import { SegmentNode } from '@markpthomas/geometry';
// TODO: Remove later once Median Elevation fixed. ^^^^^^^


import { LabelValue } from "../../../../LabelValue";
import { RangeStatsProps, RangeStats } from '../../RangeStats';


export type HeightStatsProps = { height: IHeight, level: number };

export function HeightStats({ height, level }: HeightStatsProps) {
  const heightFormat = (value: number): string => {
    return value ? `${Conversion.Length.Meters.toFeet(value).toFixed(0)} ft` : '';
  }

  const heightGainFeet = heightFormat(height.gain);
  const heightLossFeet = heightFormat(height.loss);
  const heightNetFeet = heightFormat(height.net);

  // TODO: Remove later once Median Elevation fixed. VVVVVVV
  const medianNode = height.mdn?.nodes[0] as SegmentNode<RoutePoint, RouteSegment>
  const medianHeight = medianNode?.prevVert.val.elevation ?? medianNode?.prevVert.val.alt;
  // TODO: Remove later once Median Elevation fixed. ^^^^^^^

  const rangeProps: RangeStatsProps = {
    ...height,
    mdn: medianHeight,
    level
  }

  return (
    <div>
      <LabelValue label={'Gain'} value={heightGainFeet} />
      <LabelValue label={'Loss'} value={heightLossFeet} />
      <LabelValue label={'Net'} value={heightNetFeet} />
      <RangeStats {...rangeProps} formatter={heightFormat} />
    </div >
  )
}