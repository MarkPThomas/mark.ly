/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @enum {number}
 */
export enum GeoJsonTypes {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection',
  Other = 'Other'   // Primarily used for testing
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:27 PM
 *
 * @export
 * @enum {number}
 */
export enum GeoJsonGeometryTypes {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Other = 'Other'  // Primarily used for testing
}

/**
 * State desired for BoundingBox output from a containing class.
 *
 * @export
 * @enum {number}
 */
export enum BBoxState {
  Include,
  IncludeIfPresent,
  Exclude
}