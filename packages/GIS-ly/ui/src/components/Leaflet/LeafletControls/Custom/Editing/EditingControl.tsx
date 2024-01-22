import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { ControlHeaderExpand } from "../Controls/ControlHeaderExpand";
import { EditIcon } from "../../../../shared/components/Icons/EditIcon";

export type ControlProps = {
  onClick: () => void;
  position?: ControlPosition;
  isDisabled?: boolean;
}

export function EditingControl({
  onClick,
  position = "topleft",
  isDisabled = false
}: ControlProps) {
  return (
    <Control position={position}>
      <ControlHeaderExpand
        key={'edit'}
        category="edit"
        childrenBeside={true}
        children={[]}
        isDisabled={isDisabled}
        cb={onClick}
        iconSvg={
          <EditIcon isDisabled={isDisabled} />
        }
      />
    </Control>
  );
}