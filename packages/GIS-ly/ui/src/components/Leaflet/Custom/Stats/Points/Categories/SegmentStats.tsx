import { Conversion } from '../../../../../../../../../common/utils/units/conversion/Conversion'; //'common/utils';
import { Angle } from '../../../../../../../../../common/utils/math/Coordinates/Angle';

import { ITrackSegment } from '../../../../../../model/GIS/Core/Track';
import { LabelValue } from '../../../LabelValueList';

import './SegmentStats.css';

export type SegmentStatsProps = { segment: ITrackSegment };

export function SegmentStats({ segment }: SegmentStatsProps) {

  // TODO: Note this is also in TimeStats. Refactor out to future Format library
  const timeDHHMMSSFormat = (seconds: number) => {
    const days = Math.floor(Conversion.Time.Seconds.toDays(seconds));
    const hhmmss = new Date(seconds * 1000).toISOString().slice(11, 19);

    return days ? `${days}:${hhmmss}` : hhmmss;
  }
  const durationSec = segment.duration ? timeDHHMMSSFormat(segment.duration) : '';

  const lengthFt = segment.length ? `${Conversion.Length.Meters.toFeet(segment.length).toFixed(0)} ft` : '';
  const speedMph = segment.speed ? `${Conversion.Speed.MetersPerSecond.toMph(segment.speed).toFixed(1)} mph` : '';

  const heightFt = segment.height ? `${Conversion.Length.Meters.toFeet(segment.height).toFixed(0)} ft` : '';
  const heightRateFtPerHour = segment.heightRate ? `${Conversion.Speed.MetersPerSecond.toFeetPerHour(segment.heightRate).toFixed(0)} ft/hr` : '';

  const slope = segment.slope ? `${(100 * segment.slope).toFixed(0)}% / ${Conversion.Angle.Percent.toDegrees(100 * segment.slope).toFixed(0)}°` : '';

  const angleDegree = segment.angle ? `${Angle.RadiansToDegrees(segment.angle).toFixed(1)}°` : '';
  const direction = segment.direction ? segment.direction.lat + segment.direction.lng : '';

  return (
    <div className="segment-stats">
      <LabelValue label={'Duration'} value={durationSec} />
      <LabelValue label={'Length'} value={lengthFt} />
      <LabelValue label={'Speed'} value={speedMph} />
      <LabelValue label={'Height'} value={heightFt} />
      <LabelValue label={'Height Rate'} value={heightRateFtPerHour} />
      <LabelValue label={'Slope'} value={slope} />
      <LabelValue label={'Orientation'} value={angleDegree} />
      <LabelValue label={'Direction'} value={direction} />
    </div>
  );
}