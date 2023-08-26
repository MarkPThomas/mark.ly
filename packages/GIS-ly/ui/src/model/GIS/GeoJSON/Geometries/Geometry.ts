import {
  Geometry as SerialGeometry,
  GeoJsonGeometryTypes as SerialGeoJsonGeometryTypes
} from "geojson";

import { IGeoJson, GeoJson, GeoJsonProperties } from "../GeoJson";
import { BoundingBox } from "../BoundingBox";

export type GeometryType = Geometry<GeoJsonProperties, SerialGeometry>;

/**
 * Each of the six geometries and `GeometryCollection` which make up GeoJson implement this interface.
 *
 * @export
 * @interface IGeometry
 * @extends {IGeoJSON<TJson>}
 * @template TJson
 */
export interface IGeometry<TProperties extends GeoJsonProperties, TSerial extends SerialGeometry>
  extends IGeoJson<TProperties, TSerial> {

}

/**
 * Each of the six geometries and `GeometryCollection` which make up GeoJson implement this interface.
 *
 * @export
 * @abstract
 * @class Geometry
 * @implements {IGeometry<TJson>}
 * @template TJson
 */
export abstract class Geometry<TProperties extends GeoJsonProperties, TSerial extends SerialGeometry>
  extends GeoJson
  implements IGeometry<TProperties, TSerial>
{
  abstract equals(item: TProperties): boolean;
  abstract clone(): Geometry<TProperties, TSerial>;

  protected _bbox: BoundingBox;

  /**
   * This describes the type of GeoJson `Geometry` this object is.
   *
   * @abstract
   * @type {SerialGeoJsonGeometryTypes}
   * @memberof Geometry
   */
  abstract readonly type: SerialGeoJsonGeometryTypes;

  abstract toJson(includeBoundingBox: boolean): TSerial;

  //       geometry: {
  //         type: string, // 'MultiLineString',
  //         // array of track segments, each as an array of coord properties
  //         //    each of which is an array of 3 indices:
  //         //      0 = longitude
  //         //      1 = latitude
  //         //      2 = elevation (m)
  //         coordinates: string[][][]
  //       },
}