import { Feature, GeoJsonObject, Geometry } from 'geojson';
import { ControlPosition, Layer, PathOptions } from 'leaflet';
import {
  FeatureGroup,
  FeatureGroupProps,
  LayerGroup,
  LayersControl as LC
} from 'react-leaflet';
import { ReactNode } from 'react';

import { randomColor } from '../../../../../../../common/utils';
import { hashString } from '../../../../../../../common/utils';//'common/utils';

import { Track, TrackPoint, TrackSegment } from '../../../../model/GIS/Core/Track';

import { CoordinateMarkersLayer } from '../../Custom/Stats/Points/CoordinateMarkersLayer';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

export interface IOverlay {
  name: string;
  points: TrackPoint[];
  segments?: TrackSegment[];
  groupOptions?: FeatureGroupProps;
  geoJSON?: GeoJsonObject;
  onEachFeature?: (feature: Feature<Geometry, any>, layer: Layer) => void;
}

export interface IBaseLayer {
  name: string;
  item: ReactNode;
}

export type LayersControlProps = {
  position: ControlPosition;
  overlays?: IOverlay[];
  baseLayers?: IBaseLayer[];
  selectedTrack?: Track;
  showTrackPoints?: boolean;
}

export function LayersControl({
  position,
  overlays,
  baseLayers,
  selectedTrack,
  showTrackPoints = true
}: LayersControlProps) {
  console.log('position: ', position)
  console.log('overlays: ', overlays)
  console.log('baseLayers: ', baseLayers)

  // pathOptions {
  //   stroke?: boolean | undefined;
  //   color?: string | undefined;
  //   weight?: number | undefined;
  //   opacity?: number | undefined;
  //   lineCap?: LineCapShape | undefined;
  //   lineJoin?: LineJoinShape | undefined;
  //   dashArray?: string | number[] | undefined;
  //   dashOffset?: string | undefined;
  //   fill?: boolean | undefined;
  //   fillColor?: string | undefined;
  //   fillOpacity?: number | undefined;
  //   fillRule?: FillRule | undefined;
  //   renderer?: Renderer | undefined;
  //   className?: string | undefined;
  // }

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
    (overlays || baseLayers) ?
      <LC position={position}>
        {
          baseLayers ? baseLayers.map((baseLayer, index) => (
            <LC.BaseLayer checked={index === 0 ? true : false} name={baseLayer.name} key={hashString(JSON.stringify(baseLayer.name))}>
              {baseLayer.item}
            </LC.BaseLayer>
          )) : null
        }
        {
          overlays ? overlays.map((overlay, index) => (
            <LC.Overlay checked={true} name={overlay.name} key={hashString(JSON.stringify(overlay.name))}>
              {/* {('groupOptions' in overlay)
                ?
                <FeatureGroup {...overlay.groupOptions} key={hashString(JSON.stringify(overlay.groupOptions))}>
                  {overlay.points.map((item) => item)}
                </FeatureGroup>
                :
                overlay.geoJSON ? */}
              {/* {('groupOptions' in overlay && overlay.geoJSON) ? */}
              <LayerGroup>
                {/* GeoJsonPreview */}
                {/* Points Preview */}
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
              {/* : null} */}
              {/* // <LayerGroup>
                  //   {overlay.points.map((item) => item)}
                  // </LayerGroup> */}


            </LC.Overlay>
          )) : null
        }
      </LC>
      : null
  )
}
