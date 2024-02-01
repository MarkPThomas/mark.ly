import { ICruft, ISplit, INoiseCloud, IMisc } from "../../../../model/GIS/settings";
import { LabelValue } from "../LabelValue";
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
            cruft?.units ? <ToggleGroup key={Date()} value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits key={Date()} units={cruft?.units} />]} />
              : null,
            <LabelValue key={Date()} label={'Max Gap Distance'} value={cruft?.gapDistanceMax} />,
            <LabelValue key={Date()} label={'Max Gap Time'} value={cruft?.gapTimeMax} />
          ]} />
        : null}

      {split ?
        <ToggleGroup value={'Split'} level={level}
          children={[
            split?.units ? <ToggleGroup key={Date()} value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits key={Date()} units={split?.units} />]} />
              : null,
            <LabelValue key={Date()} label={'Min Move Duration'} value={split?.moveDurationMin} />,
            <LabelValue key={Date()} label={'Max Stop Duration'} value={split?.stopDurationMax} />
          ]} />
        : null}

      {noiseCloud ?
        <ToggleGroup value={'Noise Cloud'} level={level}
          children={[
            noiseCloud?.units ? <ToggleGroup key={Date()} value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits key={Date()} units={noiseCloud?.units} />]} />
              : null,
            <LabelValue key={Date()} label={'Min Speed'} value={noiseCloud?.speedMin} />,
            <LabelValue key={Date()} label={'Min Stop Duration'} value={noiseCloud?.stopDurationMin} />
          ]} />
        : null}

      {misc ?
        <ToggleGroup value={'Misc'} level={level}
          children={[
            misc?.units ? <ToggleGroup key={Date()} value={'Units'} level={level + 1}
              children={[<TrackCriteriaUnits key={Date()} units={misc?.units} />]} />
              : null,
            <LabelValue key={Date()} label={'GPS Time Interval'} value={misc?.gpsTimeInterval} />
          ]} />
        : null}
    </div>);
}