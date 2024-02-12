import {
  Geometry as SerialGeometry,
  GeoJsonGeometryTypes as SerialGeoJsonGeometryTypes
} from "geojson";

import { IGeoJson, GeoJson, GeoJsonProperties } from "../GeoJson";
import { BBoxState } from "../enums";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @export
 * @typedef {GeometryType}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @abstract
 * @param {TProperties} item
 * @returns {boolean}
 */
  abstract equals(item: TProperties): boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @abstract
 * @returns {Geometry<TProperties, TSerial>}
 */
  abstract clone(): Geometry<TProperties, TSerial>;

  /**
   * This describes the type of GeoJson `Geometry` this object is.
   *
   * @abstract
   * @type {SerialGeoJsonGeometryTypes}
   * @memberof Geometry
   */
  abstract readonly type: SerialGeoJsonGeometryTypes;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:29 PM
 *
 * @abstract
 * @param {BBoxState} includeBBox
 * @returns {TSerial}
 */
  abstract toJson(includeBBox: BBoxState): TSerial;
}