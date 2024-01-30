import { IUnitOverrides } from "../../../../../../../common/utils/units/conversion"
import { LabelValueEntry } from "../LabelValueEntry"
import { ToggleHeader } from "../ToggleHeader"

export type TrackCriteriaUnitsProps = {
  units: IUnitOverrides
}
export function TrackCriteriaUnits({ units }: TrackCriteriaUnitsProps) {
  return units ?
    <div>
      <LabelValueEntry label={'Length'} value={units.length} />
      <LabelValueEntry label={'Time'} value={units.time} />
      <LabelValueEntry label={'Angle'} value={units.angle} />
    </div>
    : <></>
}