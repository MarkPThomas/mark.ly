import { IUnitOverrides } from "@markpthomas/units/conversion"
import { LabelValue } from "../LabelValue"

export type TrackCriteriaUnitsProps = {
  units: IUnitOverrides
}
export function TrackCriteriaUnits({ units }: TrackCriteriaUnitsProps) {
  return units ?
    <div>
      <LabelValue label={'Length'} value={units.length} />
      <LabelValue label={'Time'} value={units.time} />
      <LabelValue label={'Angle'} value={units.angle} />
    </div>
    : <></>
}