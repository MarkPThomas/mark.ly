import { ControlPosition } from "leaflet";
import Control from "react-leaflet-custom-control";

import { Track } from "../../../../../../../../libraries/gis/src";

import { FileIcon } from "../../../../shared/components/Icons/FileIcon";
import { ControlHeaderExpand } from "../Controls/ControlHeaderExpand";
import { SaveFileControl } from "./SaveFileControl";
import { LoadFileControl } from "./LoadFileControl";

export type ControlProps = {
  track: Track;
  onFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
  position?: ControlPosition;
  isDisabled?: boolean;
}

export function FileControl({
  track,
  onFileSelection: handleFileSelection,
  position = "topleft",
  isDisabled = false
}: ControlProps) {

  return (
    <Control position={position}>
      <ControlHeaderExpand
        category="file"
        isDisabled={isDisabled}
        iconSvg={
          <FileIcon isDisabled={isDisabled} />
        }
        children={[
          <LoadFileControl key={'loadFile'} onChange={handleFileSelection} />,
          <SaveFileControl key={'saveFile'} track={track} />
        ]}
      />
    </Control>
  );
}