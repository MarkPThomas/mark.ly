import { PathOptions } from 'leaflet';
import { LayersControl } from 'react-leaflet';

import { Track } from '../../../../../../../../libraries/gis/src/Core/Track';
import { IOverlay } from '../../Layers/LayersControl';
import { PathLayer } from './PathLayer';

export type PathLayersProps = {
  overlays?: IOverlay[];
  selectedTrack?: Track;
  showTrackPoints?: boolean;
}

export function PathLayers({
  overlays,
  selectedTrack,
  showTrackPoints = true
}: PathLayersProps) {

  console.log('PathLayers: ', overlays)

  const defaultColors: string[] = [
    '#3388FF',
    '#00F7FF'
  ];
  const defaultWeight = 2;

  const selectedColor = '#84ff84';
  const selectedWeight = 3;

  let useAltColor = false;

  const isSelected = (overlay: IOverlay) => selectedTrack === undefined || selectedTrack === null
    || overlay.points[0].timestamp === selectedTrack.firstPoint.val.timestamp;

  const useAltColors: boolean[] = [];
  const overlaysPathOptions: PathOptions[] = [];
  if (overlays) {
    overlays.forEach((overlay, index) => {
      overlaysPathOptions.push({
        color: isSelected(overlay) ? selectedColor : defaultColors[index % 2],
        weight: isSelected(overlay) ? selectedWeight : defaultWeight
      });

      useAltColors.push(useAltColor);
      useAltColor = !useAltColor;
    });
  }

  return (
    overlays ?
      <>
        {overlays.map((overlay, index) => (
          <LayersControl.Overlay checked={true} name={overlay.name} key={overlay.name}>
            <PathLayer
              overlay={overlay}
              index={index}
              overlaysPathOptions={overlaysPathOptions}
              useAltColors={useAltColors}
              showTrackPoints={showTrackPoints}
            />
          </LayersControl.Overlay>
        ))}
      </>
      : null
  );
}