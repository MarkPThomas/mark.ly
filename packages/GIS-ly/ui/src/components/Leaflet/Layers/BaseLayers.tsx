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

export async function BaseLayers(
  baseLayers: IBaseLayer[],
  handleLayerApiKeys: (apiKeyName: string) => Promise<ITileApiKeysResponse>,
  position: ControlPosition = 'topright'
): Promise<LayersControlProps> {
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

  console.log('Creating Base Layers');

  const tileLayerProps: TileLayerProps[] = baseLayers.map((baseLayer) => {
    const attributionLinks = baseLayer.attributions.map((attribution) =>
      getAttributionLink(attribution.label, attribution.url)
    );

    const attribution = getAttribution(attributionLinks);

    if (baseLayer.apiKey) {
      handleLayerApiKeys(baseLayer.apiKey)
        .then((result) => baseLayer.url += result.key)
        .catch((error) => {
          console.log('Error fetching API key', error);
        });
    }

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

  console.log('baseLayersComponents: ', baseLayersComponents);

  // const osmLink = getAttributionLink('OpenStreetMap', 'https://openstreetmap.org/copyright');
  // const osm: TileLayerProps = {
  //   attribution: getAttribution([osmLink]),
  //   url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // }

  // const ocmLink = getAttributionLink('Thunderforest', 'http://thunderforest.com/');
  // const ocm: TileLayerProps = {
  //   attribution: getAttribution([osmLink, ocmLink]),
  //   url: "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ae378a58d8024aaba88b8b761391e887"
  // }

  // const ewtmLink = getAttributionLink('Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community');
  // const ewtm: TileLayerProps = {
  //   attribution: getAttribution([ewtmLink]),
  //   url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  // }

  // const ewiLink = getAttributionLink('Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community');
  // const ewi: TileLayerProps = {
  //   attribution: getAttribution([ewiLink]),
  //   url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  // }

  return {
    position,
    baseLayers: baseLayersComponents
  }
  // return {
  //   position: position,
  //   baseLayers: [
  //     { name: 'OpenStreetMap', item: <TileLayer key={hashString(JSON.stringify(osm))} {...osm} /> },
  //     { name: 'Topo Map', item: <TileLayer key={hashString(JSON.stringify(ocm))} {...ocm} /> },
  //     { name: 'ESRI Topo Map', item: <TileLayer key={hashString(JSON.stringify(ewtm))} {...ewtm} /> },
  //     { name: 'ESRI Satellite Map', item: <TileLayer key={hashString(JSON.stringify(ewi))} {...ewi} /> },
  //   ]
  // }
}
