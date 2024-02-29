import { PathOptions } from 'leaflet';
import { LayerGroup } from 'react-leaflet';

import { TrackPoint, TrackSegment } from '@markpthomas/gis/core/track';

import { hashString } from '@markpthomas/common-libraries/utils';

import GeoJsonWithUpdates from '../../../Layers/GeoJsonWithUpdates';
import { CoordinateMarkersLayer } from '../../../Custom/Stats/Points/CoordinateMarkersLayer';
import { IOverlay } from '../../Layers/LayersControl';

export type PathLayerProps = {
  overlay: IOverlay;
  index: number;
  overlaysPathOptions: PathOptions[];
  useAltColors: boolean[];
  showTrackPoints?: boolean;
}

export function PathLayer({
  overlay,
  index,
  overlaysPathOptions,
  useAltColors,
  showTrackPoints = true
}: PathLayerProps) {

  return (
    <LayerGroup>
      <GeoJsonWithUpdates
        key={hashString(JSON.stringify(overlay.points[0]))}
        data={overlay.geoJSON}
        onEachFeature={overlay.onEachFeature}
        pathOptions={overlaysPathOptions[index]}
        children={[
          <CoordinateMarkersLayer
            key={hashString(JSON.stringify(overlay.points[0]))}
            points={overlay.points as TrackPoint[]}
            segments={overlay.segments as TrackSegment[]}
            useAltColor={useAltColors[index]}
            isVisible={showTrackPoints}
          />
        ]}
      />
    </LayerGroup>
  );
}