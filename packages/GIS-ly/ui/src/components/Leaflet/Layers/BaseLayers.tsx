import {
  TileLayer, TileLayerProps
} from 'react-leaflet';
import { ControlPosition } from 'leaflet';

import { hashString } from '../../../../../../common/utils';

import { ITileApiKeysResponse } from '../../../../../server/api/model';

import { LayersControlProps } from '../LeafletControls/Layers/LayersControl';

export interface IBaseLayer {
  name: string
  attributions: IAttribution[]
  url: string
  apiKey?: string
}

export interface IAttribution {
  label: string
  url?: string
}

export async function appendLayerApiKey(
  baseLayer: IBaseLayer,
  handleLayerApiKeys: (apiKeyName: string) => Promise<ITileApiKeysResponse>
): Promise<string> {
  if (baseLayer.apiKey) {
    handleLayerApiKeys(baseLayer.apiKey)
      .then((result) => {
        console.log('Result: ', result)
        baseLayer.url += result.key

        return baseLayer.url;
      })
      .catch((error) => {
        console.log('Error fetching API key', error);
      });
  } else {
    return baseLayer.url;
  }
}

export function createBaseTileLayers(
  baseLayers: IBaseLayer[],
  position: ControlPosition = 'topright'
): LayersControlProps {
  function getAttributionLink(name: string, url: string = null) {
    return url ? `<a href="${url}">${name}</a>` : name;
  }

  function getAttribution(contributorLinks: string | string[]) {
    if (!contributorLinks.length) {
      return '';
    }

    if (Array.isArray(contributorLinks)) {
      let attribution = `&copy; ${contributorLinks[0]} contributors`;

      if (contributorLinks.length > 1) {
        attribution += ` & ${contributorLinks[1]}`;
      }
      if (contributorLinks.length > 2) {
        for (let i = 2; i < contributorLinks.length; i++) {
          attribution += `, ${contributorLinks[i]}`;
        }
      }

      return attribution;
    } else {
      return `&copy; ${contributorLinks} contributors`;
    }
  }

  const tileLayerProps: TileLayerProps[] = baseLayers.map((baseLayer) => {
    const attributionLinks = baseLayer.attributions.map((attribution) =>
      getAttributionLink(attribution.label, attribution.url)
    );

    const attribution = getAttribution(attributionLinks);

    return {
      attribution,
      url: baseLayer.url
    }
  });

  const baseLayersComponents = tileLayerProps.map((tileLayerProp: TileLayerProps, index) => {
    return {
      name: baseLayers[index].name,
      item: <TileLayer key={hashString(JSON.stringify(tileLayerProp))} {...tileLayerProp} />
    }
  });


  return {
    position,
    baseLayers: baseLayersComponents
  }
}
