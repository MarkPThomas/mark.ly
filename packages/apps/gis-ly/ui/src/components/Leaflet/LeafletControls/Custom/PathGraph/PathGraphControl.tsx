import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { GraphIcon } from "../../../../shared/components/Icons/GraphIcon";
import { ControlHeaderExpand } from "../Controls/ControlHeaderExpand";

export type ControlProps = {
  onClick: () => void;
  position?: ControlPosition;
  prepend?: boolean;
  isDisabled?: boolean;
}

export function PathGraphControl({
  onClick,
  position = "topleft",
  prepend = false,
  isDisabled = false
}: ControlProps) {
  return (
    <Control position={position} prepend={prepend}>
      <ControlHeaderExpand
        key={'graph'}
        category="graph"
        title="Show Graph"
        children={[]}
        isDisabled={isDisabled}
        position={position}
        cb={onClick}
        iconSvg={
          <GraphIcon isDisabled={isDisabled} />
        }
      />
    </Control>
  );
}