import { kml as fromKml, gpx as fromGpx } from '@tmcw/togeojson';
import rewind from '@mapbox/geojson-rewind';
import { togpx } from 'togpx';
import { FeatureCollection, Feature, Geometry } from 'geojson';

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

// from FeatureCollection<Geometry, {[name: string]: any;}>
type MyFeatureCollection = {
  features: [
    {
      geometry: {
        type: string, // 'MultiLineString',
        // array of track segments, each as an array of coord properties
        //    each of which is an varray of 3 indices:
        //      0 = longitude
        //      1 = latitude
        //      2 = elevation (m)
        coordinates: string[][][]
      },
      properties: {
        _gpxType: string, //trk
        name: string,
        time: string, //timestamp
        coordinateProperties: {
          // array of track segments, each as an array of timestamps for each coord
          times: string[][]
        }
      },
      type: string // Feature
    }
  ],
  type: string // FeatureCollection
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

export const prepareGeoJson = (rawGeoJson: FeatureCollection<Geometry, { [name: string]: any; }>) => {
  rewind(rawGeoJson, false); // correct right hand rule
  return rawGeoJson;
}

export const geoJsonToGpx = (geoJson: string): string => {
  return togpx(geoJson);
}

export const geoJsonToKml = (geoJson: string): string => {
  return '';
}