import { DOMParser } from '@xmldom/xmldom';

export const getFileExtension = (file: File) => {
  const name = file.name;
  const lastDot = name.lastIndexOf(".");
  return name.substring(lastDot + 1);
};


// Notes:
// from https://www.npmjs.com/package/@tmcw/togeojson
// We recommend that you use xmldom, not the platform (native DOMParser).
// DOMParser requires XML to be valid, which means that any XML namespaces that a KML,
//   GPX, or TCX file contains are valid. A lot of existing data is invalid XML,
//    and will be parsed only in part by DOMParser, but can be fully parsed by xmldom.
export const parseXML = (str: string) => {
  if (typeof str === 'string') {
    return new DOMParser().parseFromString(str, 'text/xml');
  } else {
    return str;
  }
}

export const serializeXml = (doc: Document) => {
  return new XMLSerializer().serializeToString(doc);
}