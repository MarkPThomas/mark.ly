import { Track } from "../../../../../model/GIS";

import { SaveIcon } from "../../../../shared/components/Icons/SaveIcon";

import { ControlHeaderExpand } from "../Controls/ControlHeaderExpand";
import { SaveFileGpx } from "./SaveFileGpx";
import { SaveFileKml } from "./SaveFileKml";

export type Props = {
  track: Track;
}

export function SaveFileControl({ track }: Props) {
  return (
    <ControlHeaderExpand
      key={'file save'}
      category="save selected..."
      childrenBeside={true}
      isDisabled={!track}
      iconSvg={
        <SaveIcon isDisabled={!track} />
      }
      showLabelWithIcon={true}
      children={[
        <SaveFileGpx key={'save-gpx'} track={track} />,
        <SaveFileKml key={'save-kml'} track={track} />
      ]}
    />
  );
}