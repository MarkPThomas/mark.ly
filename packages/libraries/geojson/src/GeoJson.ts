import {
  GeoJsonObject as SerialGeoJsonObject,
  GeoJsonTypes as SerialGeoJsonTypes
} from "geojson";

import { ICloneable, IEquatable } from "common/interfaces";

import { BBoxState } from "./enums";
import { BoundingBox } from "./BoundingBox";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface GeoJsonBaseProperties
 * @typedef {GeoJsonBaseProperties}
 */
export interface GeoJsonBaseProperties {
  /**
   * A GeoJson object MAY have a member named "bbox" to include information on the coordinate range for its `Geometries`, `Features`, or `FeatureCollections`.
   *
   * @type {BoundingBox}
   * @memberof GeoJsonBaseProperties
   */
  bbox(): BoundingBox;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {boolean}
 */
  hasBBox(): boolean;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface IJson
 * @typedef {IJson}
 * @template {SerialGeoJsonObject | SerialGeoJsonObject[]} TSerial
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface IGeoJsonBase
 * @typedef {IGeoJsonBase}
 * @template {GeoJsonBaseProperties} TProperties
 * @extends {GeoJsonBaseProperties}
 * @extends {IEquatable<TProperties>}
 * @extends {ICloneable<IGeoJsonBase<TProperties>>}
 */
export interface IGeoJsonBase<TProperties extends GeoJsonBaseProperties>
  extends
  GeoJsonBaseProperties,
  IEquatable<TProperties>,
  ICloneable<IGeoJsonBase<TProperties>> {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @interface GeoJsonProperties
 * @typedef {GeoJsonProperties}
 * @extends {GeoJsonBaseProperties}
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @abstract
 * @class GeoJson
 * @typedef {GeoJson}
 * @implements {IGeoJson<GeoJsonProperties, SerialGeoJsonObject>}
 */
export abstract class GeoJson implements IGeoJson<GeoJsonProperties, SerialGeoJsonObject> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {SerialGeoJsonObject}
 */
  protected _geoJson: SerialGeoJsonObject;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {(BoundingBox | undefined | null)}
 */
  protected _bbox: BoundingBox | undefined | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _bboxDirty: boolean = false;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @readonly
 * @type {SerialGeoJsonTypes}
 */
  abstract readonly type: SerialGeoJsonTypes;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 */
  abstract save(): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @returns {BoundingBox}
 */
  abstract bbox(): BoundingBox;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @returns {boolean}
 */
  abstract hasBBox(): boolean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @param {GeoJsonProperties} item
 * @returns {boolean}
 */
  abstract equals(item: GeoJsonProperties): boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @returns {IGeoJson<GeoJsonProperties, SerialGeoJsonObject>}
 */
  abstract clone(): IGeoJson<GeoJsonProperties, SerialGeoJsonObject>;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @abstract
 * @param {BBoxState} includeBBox
 * @returns {SerialGeoJsonObject}
 */
  abstract toJson(includeBBox: BBoxState): SerialGeoJsonObject;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
 * @returns {SerialGeoJsonObject}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @protected
 */
  protected saveBBox() {
    if (this._bboxDirty && this._geoJson) {
      if (this._bbox) {
        this._geoJson.bbox = this._bbox.toJson();
      } else {
        delete this._geoJson.bbox;
      }
      this._bboxDirty = false;
    }
  }
}