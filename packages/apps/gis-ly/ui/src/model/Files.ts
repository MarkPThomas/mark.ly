import {
  geoJsonToGpx,
  geoJsonToKml,
  toGeoJsonByType
} from '../../../server/services/gisFormatAdaptor';

import { GeoJSON } from 'geojson';
import { getFileExtension } from '@markpthomas/common-libraries/utils';

export const toGeoJson = async (file: File, hookCBs = undefined) => {
  const ext = getFileExtension(file);

  const reader = new FileReader();
  let converted: GeoJSON;
  reader.onloadend = (event) => {
    const text: string = event.target.result as string;
    if (text && ext) {
      converted = toGeoJsonByType(text, ext);
      if (hookCBs && hookCBs.length) {
        console.log('File Converted to GeoJSON: ', converted);
        hookCBs.forEach((cb) => {
          cb(converted);
        })
      }
    } else {
      console.log('Error in file');
      console.log('ext: ', ext);
      console.log('text: ', text);
    }
  };

  reader.readAsText(file);
  return converted;
}

function writeToFile(content: string, fileName: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  saveBlobAs(blob, fileName);
}

function saveBlobAs(blob: Blob, fileName: string) {
  const saver: HTMLAnchorElement = document.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement;
  saver.href = URL.createObjectURL(blob);
  saver.download = fileName;

  const body = document.body;
  body.appendChild(saver);
  saver.dispatchEvent(new MouseEvent("click"));
  body.removeChild(saver);

  const blobURL = saver.href;
  URL.revokeObjectURL(blobURL);
}

export const toGpxFile = async (geoJson: GeoJSON) => {
  const gpx = geoJsonToGpx(geoJson);
  writeToFile(gpx, 'SampleFile.gpx');
}

export const toKmlFile = async (geoJson: GeoJSON) => {
  const kml = geoJsonToKml(geoJson);
  writeToFile(kml, 'SampleFile.kml');
}