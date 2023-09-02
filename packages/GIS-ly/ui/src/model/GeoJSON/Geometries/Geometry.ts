import {
  Geometry as SerialGeometry,
  GeoJsonGeometryTypes as SerialGeoJsonGeometryTypes
} from "geojson";

import { IGeoJson, GeoJson, GeoJsonProperties } from "../GeoJson";
import { BoundingBox } from "../BoundingBox";
import { BBoxState } from "../enums";

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

  /**
   * This describes the type of GeoJson `Geometry` this object is.
   *
   * @abstract
   * @type {SerialGeoJsonGeometryTypes}
   * @memberof Geometry
   */
  abstract readonly type: SerialGeoJsonGeometryTypes;

  abstract toJson(includeBBox: BBoxState): TSerial;
}