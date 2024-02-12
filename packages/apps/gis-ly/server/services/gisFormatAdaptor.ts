import { GeoJSON } from 'geojson';

import { kml as fromKml, gpx as fromGpx } from '@tmcw/togeojson';
import rewind from '@mapbox/geojson-rewind';
import togpx from 'togpx';
import tokml from 'geojson-to-kml';

import { parseXML } from 'common/utils';//'common/utils';

// TODO: GPS-Specific data like workout metadata is lost of doing to/from here.
// TODO: KML-specific data like syling is lost if doing to/from here.
//    Consider making a means of storing and updating the original file after conversion to GeoJSON
//    GeoJSON collection does not have an ID property. Consider returning a key: val tuple with [id: GeoJSON]

export interface IGisFormatAdaptor {
  /**
   * Converts a generic strig to a GeoJSON object.
   *
   * @param {string} text Text representing the stream of whichever GIS file format is to be converted to an object.
   * @param {('kml' | 'gpx' | string)} type Format types listed are explicitly supported.
   * Any other type is assumed to be a GeoJSON-compatible stream.
   * @return {*}  {GeoJSON}
   * @memberof IGisFormatAdaptor
   */
  toGeoJsonByType(text: string, type: 'kml' | 'gpx' | string): GeoJSON;
  // importedBackToType(id, geoJson): string;

  // === GPX File Format
  gpxToGeoJson(gpx: string): GeoJSON;
  geoJsonToGpx(geoJson: GeoJSON): string;
  // importedBackToGPX(id, geoJson): string;

  // === KML File Format
  kmlToGeoJson(kml: string): GeoJSON;
  geoJsonToKml(geoJson: GeoJSON): string;
  // importedBackToKML(id, geoJson): string;
}

export class GisFormatAdaptor implements IGisFormatAdaptor {
  private constructor() { }

  toGeoJsonByType(text: string, type: 'kml' | 'gpx' | string) {
    switch (type) {
      case 'kml':
        return this.kmlToGeoJson(text);
      case 'gpx':
        return this.gpxToGeoJson(text);
      default:
        const json = JSON.parse(text);
        return this.prepareGeoJson(json);
    }
  }

  protected prepareGeoJson(rawGeoJson: GeoJSON) {
    rewind(rawGeoJson, false); // correct right hand rule
    return rawGeoJson;
  }

  // === GPX File Format
  gpxToGeoJson(gpx: string) {
    const xmlDom = parseXML(gpx);
    const converted = fromGpx(xmlDom);
    prepareGeoJson(converted);

    return converted;
  };

  geoJsonToGpx(geoJson: GeoJSON): string {
    return togpx(geoJson);
  }


  // === KML File Format
  kmlToGeoJson(kml: string) {
    const xmlDom = parseXML(kml);
    const converted = fromKml(xmlDom);
    prepareGeoJson(converted);

    return converted;
  }

  geoJsonToKml(geoJson: GeoJSON): string {
    return tokml(geoJson);
  }
}

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