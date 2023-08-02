import { toGeoJsonByType } from '../../../server/services/gisFormatAdaptor';
import { FeatureCollection, Geometry } from 'geojson';
import { getFileExtension } from '../../../../common/utils';//'common/utils';

export const toGeoJson = async (file: File, hookCBs = undefined) => {
  const ext = getFileExtension(file);

  const reader = new FileReader();
  let converted: FeatureCollection<Geometry, { [name: string]: any; }>;
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