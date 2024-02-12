import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { CleanIcon } from "../../../../shared/components/Icons/CleanIcon";
import { ControlHeaderExpand } from "../Controls/ControlHeaderExpand";
import { ControlItem } from "../Controls/ControlItem";

export interface ICleanGroup {
  type: string;
  items: ICleanItem[];
}

export interface ICleanItem {
  name?: string;
  criteria: string;
  cb: () => void;
}

export type ControlProps = {
  position?: ControlPosition;
  isDisabled?: boolean;
  groups: ICleanGroup[];
}

export function CleanControls({
  position = "topleft",
  isDisabled = false,
  groups = []
}: ControlProps) {
  return (groups.length ?
    <Control position={position}>
      <ControlHeaderExpand
        category="clean"
        isDisabled={isDisabled}
        iconSvg={
          <CleanIcon isDisabled={isDisabled} />
        }
        children={
          groups.map((group) =>
            <ControlHeaderExpand
              key={group.type}
              category={group.type}
              childrenBeside={true}
              children={
                group.items.map((item) =>
                  <ControlItem
                    key={`${group.type} ${item.criteria}`}
                    type={group.type}
                    criteria={item.criteria}
                    cb={item.cb}
                    title={item.name}
                  />
                )
              }
            />
          )
        }
      />
    </Control>
    : null
  );
}