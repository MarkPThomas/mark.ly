import { IActivity } from "../../../../../../../libraries/gis/src/settings"
import { LabelValue } from "../LabelValue"
import { ToggleGroup } from "../ToggleGroup"
import { TrackCriteriaUnits } from "./TrackCriteriaUnits"

export type TrackCriteriaActivityProps = {
  activity: IActivity,
  level?: number
}

export function TrackCriteriaActivity({ activity, level }: TrackCriteriaActivityProps) {
  return (
    activity ?
      <div>
        <ToggleGroup value={activity.name} level={level}
          children={[
            activity.units ?
              <ToggleGroup key={Date()} value={'Units'} level={level + 1}
                children={[<TrackCriteriaUnits key={Date()} units={activity.units} />]} />
              : null,

            activity.speed ? <ToggleGroup key={Date()} value={'Speed'} level={level + 1}
              children={[
                activity.speed?.units ?
                  <ToggleGroup key={Date()} value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits key={Date()} units={activity.speed?.units} />]} />
                  : null,
                <LabelValue key={Date()} label={'Min'} value={activity.speed?.min} />,
                <LabelValue key={Date()} label={'Max'} value={activity.speed?.max} />
              ]} />
              : null,

            activity.rotation ? <ToggleGroup key={Date()} value={'Rotation'} level={level + 1}
              children={[
                activity.rotation?.units ?
                  <ToggleGroup key={Date()} value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits key={Date()} units={activity.rotation?.units} />]} />
                  : null,
                <LabelValue key={Date()} label={'Max Angular Velocity'} value={activity.rotation?.angularVelocityMax} />
              ]} />
              : null,

            activity.elevation ? <ToggleGroup key={Date()} value={'Elevation'} level={level + 1}
              children={[
                activity.elevation?.units ?
                  <ToggleGroup key={Date()} value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits key={Date()} units={activity.elevation?.units} />]} />
                  : null,
                <LabelValue key={Date()} label={'Max Ascent Rate'} value={activity.elevation?.ascentRateMax} />,
                <LabelValue key={Date()} label={'Max Descent Rate'} value={activity.elevation?.descentRateMax} />
              ]} />
              : null,

            activity.slope ? <ToggleGroup key={Date()} value={'Slope'} level={level + 1}
              children={[
                activity.slope?.units ?
                  <ToggleGroup key={Date()} value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits key={Date()} units={activity.slope?.units} />]} />
                  : null,
                <LabelValue key={Date()} label={'Max'} value={activity.slope?.max} />
              ]} />
              : null,

            activity.gapDistanceMax ? <ToggleGroup key={Date()} value={'Gap'} level={level + 1}
              children={[
                <LabelValue key={Date()} label={'Max Distance'} value={activity.gapDistanceMax} />
              ]} />
              : null
          ]} />
      </div>
      : null
  );
}