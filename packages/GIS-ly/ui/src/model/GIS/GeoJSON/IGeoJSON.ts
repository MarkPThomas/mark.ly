import {
  GeoJsonObject as SerialGeoJsonObject,
  GeoJsonTypes as SerialGeoJsonTypes
} from "geojson";

import { ICloneable, IEquatable } from "../../../../../../common/interfaces";

import { BoundingBox } from "./BoundingBox";

export interface GeoJsonBaseProperties {
  /**
   * A GeoJson object MAY have a member named "bbox" to include information on the coordinate range for its `Geometries`, `Features`, or `FeatureCollections`.
   *
   * @type {(BoundingBox | undefined)}
   * @memberof GeoJsonBaseProperties
   */
  bbox?: BoundingBox | undefined
}

export interface IGeoJsonBase<TProperties extends GeoJsonBaseProperties, TSerial extends SerialGeoJsonObject>
  extends
  GeoJsonBaseProperties,
  IEquatable<TProperties>,
  ICloneable<IGeoJsonBase<TProperties, TSerial>> {

}

export interface GeoJsonProperties extends GeoJsonBaseProperties {
  /**
   * This describes the type of GeoJson `Geometry`, `Feature`, or `FeatureCollection` this object is.
   *
   * @type {SerialGeoJsonTypes}
   * @memberof GeoJsonProperties
   */
  type: SerialGeoJsonTypes
}

/**
 * Generic implementation for all GeoJson objects defining common traits that each GeoJson object has.
 *
 * This logic is carried over to `IGeometry` which is an interface which all seven GeoJson geometries implement.
 *
 * @export
 * @interface IGeoJSON
 */
export interface IGeoJSON<TProperties extends GeoJsonProperties, TSerial extends SerialGeoJsonObject>
  extends
  IGeoJsonBase<TProperties, TSerial>,
  GeoJsonProperties {
  /**
   * This takes the currently defined values found inside the GeoJson instance and converts it to a GeoJson string.
   *
   * @return {*}  {string}
   * @memberof IGeoJSON
   */
  toJson(includeBoundingBox: boolean): TSerial
}

export abstract class GeoJSON implements IGeoJSON<GeoJsonProperties, SerialGeoJsonObject> {
  abstract get bbox(): BoundingBox;
  abstract readonly type: SerialGeoJsonTypes;

  abstract equals(item: GeoJsonProperties): boolean;
  abstract clone(): IGeoJSON<GeoJsonProperties, SerialGeoJsonObject>;

  abstract toJson(includeBoundingBox: boolean): SerialGeoJsonObject;
  protected toJsonBase(includeBoundingBox: boolean = false): SerialGeoJsonObject {
    let json: SerialGeoJsonObject = {
      type: this.type
    };

    if (includeBoundingBox) {
      json = {
        ...json,
        bbox: this.bbox.toJson()
      }
    }

    return json;
  }
}