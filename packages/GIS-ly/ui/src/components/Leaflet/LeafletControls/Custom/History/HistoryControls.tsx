import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { UndoRedoIcon } from "../../../../shared/components/Icons/UndoRedoIcon";
import { ControlItem } from "../Controls/ControlItem";

export type ControlProps = {
  hasUndo: boolean;
  hasRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  position?: ControlPosition;
  isDisabled?: boolean;
}

export function HistoryControls({
  hasUndo,
  hasRedo,
  onUndo,
  onRedo,
  position = "topleft",
  isDisabled = false
}: ControlProps) {
  return (
    <Control position={position}>
      <ControlItem
        key={'history undo'}
        type="history"
        criteria="undo"
        title="Undo"
        isDisabled={!hasUndo}
        cb={onUndo}
        iconSvg={
          <UndoRedoIcon isDisabled={!hasUndo || isDisabled} />
        }
      />
      <ControlItem
        key={'history redo'}
        type="history"
        criteria="redo"
        title="Redo"
        isDisabled={!hasRedo}
        cb={onRedo}
        iconSvg={
          <UndoRedoIcon redo={true} isDisabled={!hasRedo || isDisabled} />
        }
      />
    </Control>
  );
}