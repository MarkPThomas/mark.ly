import { GeoJsonObject } from 'geojson';
import { ControlPosition, PathOptions } from 'leaflet';
import {
  FeatureGroup,
  FeatureGroupProps,
  LayerGroup,
  LayersControl as LC
} from 'react-leaflet';
import { ReactNode } from 'react';

import { randomColor } from '../../../../../../../common/utils';
import { hashString } from '../../../../../../../common/utils';//'common/utils';

import { TrackPoint, TrackSegment } from '../../../../model/GIS/Core/Track';

import { CoordinateMarkersLayer } from '../../Custom/Stats/Points/CoordinateMarkersLayer';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

type Overlay = {
  name: string,
  points: TrackPoint[],
  segments?: TrackSegment[],
  groupOptions?: FeatureGroupProps
  geoJSON?: GeoJsonObject
  onEachFeature?: (feature, layer) => void
}

type BaseLayer = {
  name: string,
  item: ReactNode
}

export type LayersControlProps = {
  position: ControlPosition,
  overlays?: Overlay[],
  baseLayers?: BaseLayer[]
}

export function LayersControl({ position, overlays, baseLayers }: LayersControlProps) {
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

  // selected - color: #84ff84, weight: 4 (default is 3)
  // non-selected - weight: 2  (default is 3)

  const useAltColors: boolean[] = [];
  let useAltColor = false;

  const colors: string[] = [
    '#3388FF',
    '#00F7FF'
  ];

  const overlaysPathOptions: PathOptions[] = [];
  if (overlays && overlays.length > 1) {
    overlays.forEach((_overlay, index) => {
      overlaysPathOptions.push({
        color: colors[index % 2],
        weight: 2
      });

      useAltColors.push(useAltColor);
      useAltColor = !useAltColor;
    })
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
                <GeoJsonWithUpdates
                  key={hashString(JSON.stringify(overlay.points[0]))}
                  data={overlay.geoJSON}
                  onEachFeature={overlay.onEachFeature}
                  pathOptions={overlaysPathOptions[index]}
                  children={[<CoordinateMarkersLayer
                    key={hashString(JSON.stringify(overlay.points[0]))}
                    points={overlay.points as TrackPoint[]}
                    segments={overlay.segments as TrackSegment[]}
                    useAltColor={useAltColors[index]}
                  />]}
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
