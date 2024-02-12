import { toKmlFile } from '../../../../../model/Files';

import { Track } from '../../../../../../../../libraries/gis/src';
import { ControlItem } from "../Controls/ControlItem";

export type Props = {
  track: Track;
}

export function SaveFileKml({ track }: Props) {

  const handleKMLSaveFile = () => {
    toKmlFile(track.toJson());
  }

  return (
    <ControlItem
      key={'save kml'}
      type="save"
      criteria="kml"
      title="Save selected Track to KML file"
      cb={handleKMLSaveFile}
    />
  );
}