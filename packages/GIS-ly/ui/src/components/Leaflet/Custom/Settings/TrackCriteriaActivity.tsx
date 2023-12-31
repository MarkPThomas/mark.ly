import { IActivity } from "../../../../model/GIS/settings"
import { LabelValue } from "../LabelValueList"
import { ToggleGroup } from "../ToggleGroup"
import { TrackCriteriaUnits } from "./TrackCriteriaUnits"

export type TrackCriteriaActivityProps = {
  activity: IActivity,
  level?: number
}

export function TrackCriteriaActivity({ activity, level }: TrackCriteriaActivityProps) {
  const CustomTag = level ? `h${level}` as keyof JSX.IntrinsicElements : `h2` as keyof JSX.IntrinsicElements;

  return (
    activity ?
      <div>
        <ToggleGroup value={activity.name} level={level}
          children={[
            activity.units ?
              <ToggleGroup value={'Units'} level={level + 1}
                children={[<TrackCriteriaUnits units={activity.units} />]} />
              : null,

            activity.speed ? <ToggleGroup value={'Speed'} level={level + 1}
              children={[
                activity.speed?.units ?
                  <ToggleGroup value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits units={activity.speed?.units} />]} />
                  : null,
                <LabelValue label={'Min'} value={activity.speed?.min} />,
                <LabelValue label={'Max'} value={activity.speed?.max} />
              ]} />
              : null,

            activity.rotation ? <ToggleGroup value={'Rotation'} level={level + 1}
              children={[
                activity.rotation?.units ?
                  <ToggleGroup value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits units={activity.rotation?.units} />]} />
                  : null,
                <LabelValue label={'Max Angular Velocity'} value={activity.rotation?.angularVelocityMax} />
              ]} />
              : null,

            activity.elevation ? <ToggleGroup value={'Elevation'} level={level + 1}
              children={[
                activity.elevation?.units ?
                  <ToggleGroup value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits units={activity.elevation?.units} />]} />
                  : null,
                <LabelValue label={'Max Ascent Rate'} value={activity.elevation?.ascentRateMax} />,
                <LabelValue label={'Max Descent Rate'} value={activity.elevation?.descentRateMax} />
              ]} />
              : null,

            activity.slope ? <ToggleGroup value={'Slope'} level={level + 1}
              children={[
                activity.slope?.units ?
                  <ToggleGroup value={'Units'} level={level + 2}
                    children={[<TrackCriteriaUnits units={activity.slope?.units} />]} />
                  : null,
                <LabelValue label={'Max'} value={activity.slope?.max} />
              ]} />
              : null,

            activity.gapDistanceMax ? <ToggleGroup value={'Gap'} level={level + 1}
              children={[
                <LabelValue label={'Max Distance'} value={activity.gapDistanceMax} />
              ]} />
              : null
          ]} />
      </div>
      : null
  );
}