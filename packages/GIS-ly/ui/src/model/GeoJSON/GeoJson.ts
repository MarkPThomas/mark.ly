import {
  GeoJsonObject as SerialGeoJsonObject,
  GeoJsonTypes as SerialGeoJsonTypes
} from "geojson";

import { ICloneable, IEquatable } from "../../../../../common/interfaces";

import { BBoxState } from "./enums";
import { BoundingBox } from "./BoundingBox";

export interface GeoJsonBaseProperties {
  /**
   * A GeoJson object MAY have a member named "bbox" to include information on the coordinate range for its `Geometries`, `Features`, or `FeatureCollections`.
   *
   * @type {BoundingBox}
   * @memberof GeoJsonBaseProperties
   */
  bbox(): BoundingBox;
  hasBBox(): boolean;
}

export interface IJson<TSerial extends SerialGeoJsonObject | SerialGeoJsonObject[]> {
  /**
   * This takes the currently defined/desired values found inside the GeoJson instance and converts it to a GeoJson string.
   *
   * @param {BBoxState} includeBBox Specifies the default behavior of including this optional property.
   *
   * Recommended default is {@link BBoxState.IncludeIfPresent} as a tradeoff between maintaining I/O document consistency
   * and avoiding expensive operations of calculating new Bounding Boxes.
   * @return {*}  {TSerial[]}
   * @memberof IJson
   */
  toJson(includeBBox: BBoxState): TSerial;
}

export interface IGeoJsonBase<TProperties extends GeoJsonBaseProperties>
  extends
  GeoJsonBaseProperties,
  IEquatable<TProperties>,
  ICloneable<IGeoJsonBase<TProperties>> {

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
export interface IGeoJson<TProperties extends GeoJsonProperties, TSerial extends SerialGeoJsonObject>
  extends
  IGeoJsonBase<TProperties>,
  GeoJsonProperties,
  IJson<TSerial> {

  /**
   * Save changes in object state to contained JSON object.
   *
   * @memberof IGeoJson
   */
  save(): void;
}

export abstract class GeoJson implements IGeoJson<GeoJsonProperties, SerialGeoJsonObject> {
  protected _geoJson: SerialGeoJsonObject;
  protected _bbox: BoundingBox;
  protected _bboxDirty: boolean;

  abstract readonly type: SerialGeoJsonTypes;

  abstract save(): void;
  abstract bbox(): BoundingBox;
  abstract hasBBox(): boolean;

  abstract equals(item: GeoJsonProperties): boolean;
  abstract clone(): IGeoJson<GeoJsonProperties, SerialGeoJsonObject>;

  abstract toJson(includeBBox: BBoxState): SerialGeoJsonObject;
  protected toJsonBase(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialGeoJsonObject {
    let json: SerialGeoJsonObject = {
      type: this.type
    };

    if (includeBBox === BBoxState.Include
      || (includeBBox === BBoxState.IncludeIfPresent && this.hasBBox())) {
      json = {
        ...json,
        bbox: this.bbox().toJson()
      }
    }

    return json;
  }

  protected saveBBox() {
    if (this._bboxDirty) {
      this._geoJson.bbox = this._bbox.toJson();
      this._bboxDirty = false;
    }
  }
}