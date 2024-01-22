import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { OptionsIcon } from "../../../../shared/components/Icons/OptionsIcon";
import { ControlHeaderSwap } from "../Controls/ControlHeaderSwap";
import { DialogGroup, IDialogGroup, IDialogItem } from "./DialogGroup";
import { CheckboxGroup, ICheckboxGroup } from "./CheckboxGroup";

export type OptionsControlProps = {
  position?: ControlPosition;
  isDisabled?: boolean;
  dialogGroups: IDialogGroup[];
  checkboxGroups: ICheckboxGroup[];
}

export function OptionsControl({
  position = "topleft",
  isDisabled = false,
  dialogGroups = [],
  checkboxGroups = [],
}: OptionsControlProps) {
  return (
    <Control position={position}>
      <ControlHeaderSwap
        category="options"
        isDisabled={isDisabled}
        iconSvg={
          <OptionsIcon height="24px" />
        }
        children={[
          dialogGroups.length ?
            dialogGroups.map((dialogGroup, index) =>
              <DialogGroup key={`${Date()}-${index}`} group={dialogGroup} />
            ) : null
          ,
          checkboxGroups.length ?
            checkboxGroups.map((checkboxGroup, index) =>
              <CheckboxGroup key={`${Date()}-${index}`} group={checkboxGroup} />
            ) : null
        ]}
      />
    </Control>
  );
}