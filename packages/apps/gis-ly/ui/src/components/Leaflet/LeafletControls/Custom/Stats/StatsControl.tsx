import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { StatsIcon } from "../../../../shared/components/Icons/StatsIcon";
import { IEditedStats } from "../../../Custom/Stats/Paths/Stats";
import { StatsDisplay } from "./StatsDisplay";

export type ControlProps = {
  stats: IEditedStats
  position?: ControlPosition;
  isDisabled?: boolean;
}

export function StatsControl({
  stats,
  position = "topleft",
  isDisabled = false
}: ControlProps) {
  return (
    <Control position={position}>
      <StatsDisplay
        key={'stats'}
        category="stats"
        title="Show stats"
        stats={stats}
        children={[]}
        isDisabled={isDisabled}
        iconSvg={
          <StatsIcon isDisabled={isDisabled} />
        }
      />
    </Control>
  );
}