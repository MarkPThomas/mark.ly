import {
  Feature as SerialFeature,
  GeoJsonProperties as SerialGeoJsonProperties,
  Geometry as SerialGeometry
} from 'geojson';

import { BoundingBox } from "./BoundingBox";
import { IGeometry } from "./geometries/Geometry";
import { GeoJson, GeoJsonProperties } from "./GeoJson";
import { FeatureProperty, IFeatureProperty } from './FeatureProperty';
import { BBoxState, GeoJsonTypes } from "./enums";
import { GeometryBuilder, Point } from './geometries';

/**
 * Description placeholder
 * @date 2/1/2024 - 3:28:54 PM
 *
 * @export
 * @typedef {FeatureOptions}
 */
export type FeatureOptions = {
  properties?: IFeatureProperty,
  id?: string,
  bbox?: BoundingBox
}

/**
 * Description placeholder
 * @date 2/1/2024 - 3:28:54 PM
 *
 * @export
 * @interface FeatureProperties
 * @typedef {FeatureProperties}
 * @extends {GeoJsonProperties}
 */
export interface FeatureProperties extends GeoJsonProperties {
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @type {IGeometry<GeoJsonProperties, SerialGeometry>}
   */
  geometry: IGeometry<GeoJsonProperties, SerialGeometry>,
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @type {IFeatureProperty}
   */
  properties: IFeatureProperty;
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @type {(string | number | null)}
   */
  id: string | number | null;

}

/**
 * Description placeholder
 * @date 2/1/2024 - 3:28:53 PM
 *
 * @export
 * @interface IFeature
 * @typedef {IFeature}
 * @extends {FeatureProperties}
 */
export interface IFeature
  extends FeatureProperties {
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @param {IGeometry<GeoJsonProperties, SerialGeometry>} geometry
   * @param {?IFeatureProperty} [properties]
   */
  setGeometry(geometry: IGeometry<GeoJsonProperties, SerialGeometry>, properties?: IFeatureProperty): void;
}

/**
 * This defines a GeoJson Feature object which represents a spatially bound thing. Every Feature object is a GeoJson object no matter where it occurs in a GeoJson text. A Feature object will always have a "TYPE" member with the value "Feature".
A Feature object has a member with the name "geometry". The value of the geometry member SHALL be either a Geometry object or, in the case that the Feature is unlocated, a JSON null value.

A Feature object has a member with the name "properties". The value of the properties member is an object (any JSON object or a JSON null value).

If a Feature has a commonly used identifier, that identifier SHOULD be included as a member of the Feature object through the id() method, and the value of this member is either a JSON string or number.

An example of a serialized feature is given below:
@example
```
 {
   "type "Feature",
   "geometry": {
     "type": "Point",
     "coordinates": [102.0, 0.5]
   },
   "properties": {
     "prop0": "value0"
   }
  }
```
 *
 * @export
 * @class Feature
 * @implements {IGeoJSON}
 */
export class Feature
  extends GeoJson
  implements IFeature {

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @readonly
   * @type {*}
   */
  readonly type: any = GeoJsonTypes.Feature;

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @returns {BoundingBox}
   */
  bbox(): BoundingBox {
    if (!this._bbox) {
      let points: Point[] = GeometryBuilder.getCoordinates(this._geometry);
      this._bbox = BoundingBox.fromPoints(points);
      this._bboxDirty = true;
    }
    return this._bbox;
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @returns {boolean}
   */
  hasBBox(): boolean {
    return !!(this._bbox);
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @param {BBoxState} [includeBBox=BBoxState.IncludeIfPresent]
   * @returns {SerialFeature}
   */
  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialFeature {
    const jsonBase = super.toJsonBase(includeBBox);

    let json = {
      ...jsonBase,
      geometry: this.geometry.toJson(includeBBox),
      properties: this.properties as SerialGeoJsonProperties
    } as SerialFeature

    if (this._id) {
      json.id = this._id;
    }

    return json;
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @private
   * @type {boolean}
   */
  private _geometryDirty: boolean = false;
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @private
   * @type {IGeometry<GeoJsonProperties, SerialGeometry>}
   */
  private _geometry: IGeometry<GeoJsonProperties, SerialGeometry>;
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @readonly
   * @type {IGeometry<GeoJsonProperties, SerialGeometry>}
   */
  get geometry(): IGeometry<GeoJsonProperties, SerialGeometry> {
    // Not cloned as all geometry objects are immutable
    return this._geometry;
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @private
   * @type {boolean}
   */
  private _propertiesDirty: boolean = false;
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @private
   * @type {IFeatureProperty}
   */
  private _properties: IFeatureProperty = FeatureProperty.fromJson({});
  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @readonly
   * @type {IFeatureProperty}
   */
  get properties(): IFeatureProperty {
    return { ...this._properties };
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   */
  save() {
    if (this._geoJson) {
      this.saveBBox();

      if (this._geometryDirty) {
        (this._geoJson as SerialFeature).geometry = this._geometry.toJson(BBoxState.IncludeIfPresent);
        this._geometryDirty = false;
      }

      if (this._propertiesDirty) {
        (this._geoJson as SerialFeature).properties = this._properties.toJson();
        this._propertiesDirty = false;
      }
    }
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @private
   * @type {(string | null)}
   */
  private _id: string | null = null;
  /**
   * A feature may have a commonly used identifier which is either a unique String or number.
   *
   * @return {*}  {(string | null)} a String containing this features unique identification or null if one wasn't given during creation.
   * @memberof Feature
   */
  get id(): string | null {
    return this._id;
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @param {IGeometry<GeoJsonProperties, SerialGeometry>} geometry
   * @param {?IFeatureProperty} [properties]
   */
  setGeometry(geometry: IGeometry<GeoJsonProperties, SerialGeometry>, properties?: IFeatureProperty) {
    this._geometry = geometry;
    this._geometryDirty = true;

    if (properties) {
      this._properties = properties;
      this._propertiesDirty = true;
    }

    this._bbox = null;
    this._bboxDirty = true;
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @param {Feature} item
   * @returns {boolean}
   */
  equals(item: Feature): boolean {
    if (!this._properties.equals(item._properties)) {
      return false;
    }

    return this._id === item._id && this._geometry.equals(item._geometry);
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @returns {Feature}
   */
  clone(): Feature {
    const feature = new Feature();

    feature._id = this._id;
    feature._geometry = this._geometry.clone() as IGeometry<GeoJsonProperties, SerialGeometry>;
    if (this._properties) {
      feature._properties = this._properties.clone();
    }

    return feature;
  }

  /**
   * Creates an instance of Feature.
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @constructor
   * @protected
   */
  protected constructor() {
    super()
  }

  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @static
   * @param {SerialFeature} json
   * @returns {Feature}
   */
  static fromJson(json: SerialFeature): Feature {
    const feature = new Feature();
    if (json.id) {
      feature._id = json.id.toString();
    }

    feature._geometry = GeometryBuilder.fromJson(json.geometry);

    feature._properties = FeatureProperty.fromJson(json.properties);

    if (json.bbox) {
      feature._bbox = BoundingBox.fromJson(json.bbox);
    }
    feature._geoJson = json;

    return feature;
  }


  /**
   * Description placeholder
   * @date 2/1/2024 - 3:28:53 PM
   *
   * @static
   * @param {IGeometry<GeoJsonProperties, SerialGeometry>} geometry
   * @param {FeatureOptions} [param0={}]
   * @param {IFeatureProperty} param0.properties
   * @param {string} param0.id
   * @param {BoundingBox} param0.bbox
   * @returns {Feature}
   */
  static fromGeometry(
    geometry: IGeometry<GeoJsonProperties, SerialGeometry>,
    { properties, id, bbox }: FeatureOptions = {}
  ): Feature {
    const feature = new Feature();

    feature._geometry = geometry;

    if (id) {
      feature._id = id;
    }

    if (properties) {
      feature._properties = properties;
    } else

      if (bbox) {
        feature._bbox = bbox;
      }

    return feature;
  }
}