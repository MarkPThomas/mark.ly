import { toGpxFile } from '../../../../../model/Files';

import { Track } from '../../../../../model/GIS';
import { ControlItem } from "../Controls/ControlItem";

export type Props = {
  track: Track;
}

export function SaveFileGpx({ track }: Props) {

  const handleGPXSaveFile = () => {
    toGpxFile(track.toJson());
  }

  return (
    <ControlItem
      key={'save gpx'}
      type="save"
      criteria="gpx"
      title="Save selected Track to GPX file"
      cb={handleGPXSaveFile}
    />
  );
}