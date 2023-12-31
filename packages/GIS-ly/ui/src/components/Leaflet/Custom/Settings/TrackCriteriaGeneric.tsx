import { ICruft, ISplit, INoiseCloud, IMisc } from "../../../../model/GIS/settings";
import { LabelValue } from "../LabelValueList";
import { ToggleGroup } from "../ToggleGroup";
import { TrackCriteriaUnits } from "./TrackCriteriaUnits";

export type TrackCriteriaGenericProps = {
  cruft?: ICruft
  split?: ISplit
  noiseCloud?: INoiseCloud
  misc?: IMisc
  level?: number
};

export function TrackCriteriaGeneric({ cruft, split, noiseCloud, misc, level }: TrackCriteriaGenericProps) {
  return (
    <div>
      {cruft ?
        <ToggleGroup value={'Cruft'} level={level}
          children={[
            cruft?.units ? <ToggleGroup value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits units={cruft?.units} />]} />
              : null,
            <LabelValue label={'Max Gap Distance'} value={cruft?.gapDistanceMax} />,
            <LabelValue label={'Max Gap Time'} value={cruft?.gapTimeMax} />
          ]} />
        : null}

      {split ?
        <ToggleGroup value={'Split'} level={level}
          children={[
            split?.units ? <ToggleGroup value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits units={split?.units} />]} />
              : null,
            <LabelValue label={'Min Move Duration'} value={split?.moveDurationMin} />,
            <LabelValue label={'Max Stop Duration'} value={split?.stopDurationMax} />
          ]} />
        : null}

      {noiseCloud ?
        <ToggleGroup value={'Noise Cloud'} level={level}
          children={[
            noiseCloud?.units ? <ToggleGroup value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits units={noiseCloud?.units} />]} />
              : null,
            <LabelValue label={'Min Speed'} value={noiseCloud?.speedMin} />,
            <LabelValue label={'Min Stop Duration'} value={noiseCloud?.stopDurationMin} />
          ]} />
        : null}

      {misc ?
        <ToggleGroup value={'Misc'} level={level}
          children={[
            misc?.units ? <ToggleGroup value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits units={misc?.units} />]} />
              : null,
            <LabelValue label={'GPS Time Interval'} value={misc?.gpsTimeInterval} />
          ]} />
        : null}
    </div>);
}