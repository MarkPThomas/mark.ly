import { Feature, GeoJsonObject, Geometry } from 'geojson';
import { ControlPosition, Layer } from 'leaflet';
import {
  FeatureGroupProps,
  LayersControl as LC
} from 'react-leaflet';

import { Track, TrackPoint, TrackSegment } from '@markpthomas/gis/core/track';

import { PathLayers } from '../Custom/Layers/PathLayers';
import { BaseLayers, IBaseLayer } from './BaseLayers';

export interface IOverlay {
  name: string;
  points: TrackPoint[];
  segments?: TrackSegment[];
  groupOptions?: FeatureGroupProps;
  geoJSON?: GeoJsonObject;
  onEachFeature?: (feature: Feature<Geometry, any>, layer: Layer) => void;
}

export type LayersControlProps = {
  position: ControlPosition;
  baseLayers?: IBaseLayer[];
  overlays?: IOverlay[];
  selectedTrack?: Track;
  showTrackPoints?: boolean;
}

export function LayersControl({
  position,
  baseLayers,
  overlays,
  selectedTrack,
  showTrackPoints = true
}: LayersControlProps) {
  console.log('baseLayers: ', baseLayers)

  return (
    (baseLayers || overlays) ?
      <LC position={position}>
        <BaseLayers baseLayers={baseLayers} />
        <PathLayers
          overlays={overlays}
          selectedTrack={selectedTrack}
          showTrackPoints={showTrackPoints}
        />
      </LC >
      : null
  )
}
