import {
  TileLayer, TileLayerProps
} from 'react-leaflet';
import { ControlPosition } from 'leaflet';

import { hashString } from '../../../../../../common/utils';

import { ITileApiKeysResponse } from '../../../../../server/api/model';

import { LayersControlProps } from '../LeafletControls/Layers/LayersControl';

export interface ITilesLayer {
  name: string
  attributions: IAttribution[]
  url: string
  apiKey?: string
}

export interface IAttribution {
  label: string
  url?: string
}

export async function appendTilesApiKey(
  tilesLayer: ITilesLayer,
  handleLayerApiKeys: (apiKeyName: string) => Promise<ITileApiKeysResponse>
): Promise<string> {
  if (tilesLayer.apiKey) {
    handleLayerApiKeys(tilesLayer.apiKey)
      .then((result) => {
        console.log('Result: ', result)
        tilesLayer.url += result.key

        return tilesLayer.url;
      })
      .catch((error) => {
        console.log('Error fetching API key', error);
      });
  } else {
    return tilesLayer.url;
  }
}

export function createTileLayers(
  baseLayers: ITilesLayer[],
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

  const tileLayersComponents = tileLayerProps.map((tileLayerProp: TileLayerProps, index) => {
    return {
      name: baseLayers[index].name,
      item: <TileLayer key={hashString(JSON.stringify(tileLayerProp))} {...tileLayerProp} />
    }
  });


  return {
    position,
    baseLayers: tileLayersComponents
  }
}
