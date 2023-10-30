import { GeoJsonObject } from 'geojson';
import { ControlPosition } from 'leaflet';
import {
  FeatureGroup,
  FeatureGroupProps,
  LayerGroup,
  LayersControl as LC
} from 'react-leaflet';
import { ReactNode } from 'react';


import { hashString } from '../../../../../../../common/utils';//'common/utils';

import { TrackPoint } from '../../../../model/GIS/Core/Track';

import { CoordinateMarkersLayer } from '../../Custom/CoordinateMarkersLayer';
import GeoJsonWithUpdates from './GeoJsonWithUpdates';

type Overlay = {
  name: string,
  items: TrackPoint[][] | ReactNode[],
  groupOptions?: FeatureGroupProps
  geoJSON?: GeoJsonObject
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
          overlays ? overlays.map((overlay) => (
            <LC.Overlay checked={true} name={overlay.name} key={hashString(JSON.stringify(overlay.name))}>
              {('groupOptions' in overlay)
                ?
                <FeatureGroup {...overlay.groupOptions} key={hashString(JSON.stringify(overlay.groupOptions))}>
                  {overlay.items.map((item) => item)}
                </FeatureGroup>
                :
                overlay.geoJSON ?
                  <LayerGroup>
                    <GeoJsonWithUpdates
                      key={hashString(JSON.stringify(overlay.items[0]))}
                      data={overlay.geoJSON}
                      children={[<CoordinateMarkersLayer
                        key={hashString(JSON.stringify(overlay.items[0]))}
                        coords={overlay.items[0] as TrackPoint[]}
                      />]
                      }
                    />
                  </LayerGroup>
                  :
                  <LayerGroup>
                    {overlay.items.map((item) => item)}
                  </LayerGroup>

              }
            </LC.Overlay>
          )) : null
        }
      </LC>
      : null
  )
}