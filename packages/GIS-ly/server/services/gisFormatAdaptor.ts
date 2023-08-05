import { kml as fromKml, gpx as fromGpx } from '@tmcw/togeojson';
import rewind from '@mapbox/geojson-rewind';
import togpx from 'togpx';
import tokml from 'geojson-to-kml';
import { GeoJSON } from 'geojson';

import { parseXML } from '../../../common/utils';//'common/utils';

export const toGeoJsonByType = (text: string, type: 'kml' | 'gpx' | string) => {
  switch (type) {
    case 'kml':
      return kmlToGeoJson(text);
    case 'gpx':
      return gpxToGeoJson(text);
    default:
      // imported geojson
      const json = JSON.parse(text);
      return prepareGeoJson(json);
  }
}

export const gpxToGeoJson = (gpx: string) => {
  const xmlDom = parseXML(gpx);
  const converted = fromGpx(xmlDom);
  prepareGeoJson(converted);

  return converted;
};

export const kmlToGeoJson = (kml: string) => {
  const xmlDom = parseXML(kml);
  const converted = fromKml(xmlDom);
  prepareGeoJson(converted);

  return converted;
}

export const prepareGeoJson = (rawGeoJson: GeoJSON) => {
  rewind(rawGeoJson, false); // correct right hand rule
  return rawGeoJson;
}

export const geoJsonToGpx = (geoJson: GeoJSON): string => {
  return togpx(geoJson);
}

export const geoJsonToKml = (geoJson: GeoJSON): string => {
  return tokml(geoJson);
}