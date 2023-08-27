import {
  Feature as SerialFeature,
  GeoJsonProperties as SerialGeoJsonProperties,
  Geometry as SerialGeometry
} from 'geojson';

import { ICloneable, IEquatable } from "../../../../../../common/interfaces";

import { BoundingBox } from "./BoundingBox";
import { IGeometry } from "./Geometries/Geometry";
import { GeoJson, GeoJsonProperties } from "./GeoJson";
import { BBoxState, GeoJsonTypes } from "./enums";
import { GeometryBuilder } from './Geometries';

export type FeatureOptions = {
  properties?: IFeatureProperty,
  id?: string
}

export type FeaturePropertyProperties = { [name: string]: any; }

/**
 * Properties of features in GeoJSON files have not specified shape.
 *
 * Deriving from this base interface at least ensures that they can be manipulated consistently.
 *
 * @export
 * @interface IFeatureProperty
 * @extends {IEquatable<IFeatureProperty>}
 * @extends {ICloneable<IFeatureProperty>}
 */
export interface IFeatureProperty
  extends
  FeaturePropertyProperties,
  IEquatable<FeaturePropertyProperties>, ICloneable<FeatureProperty> {
}

export class FeatureProperty implements IFeatureProperty {
  protected constructor() { }

  equals(item: FeaturePropertyProperties): boolean {
    const keys = Object.keys(this);
    const itemKeys = Object.keys(item);
    if (keys.length !== itemKeys.length) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      if (item[keys[i]] !== this[keys[i]]) {
        return false;
      }
    }

    return true;
  }

  clone(): FeatureProperty {
    const featureProperty = new FeatureProperty();

    const keys = Object.keys(this);
    keys.forEach((key) => {
      featureProperty[key] = this[key];
    });

    return featureProperty;
  }

  static fromJson(json: SerialGeoJsonProperties): FeatureProperty {
    const featureProperty = new FeatureProperty();

    const keys = Object.keys(json);
    keys.forEach((key) => {
      featureProperty[key] = json[key];
    })

    return featureProperty;
  }
}

export interface FeatureProperties extends GeoJsonProperties {
  geometry: IGeometry<GeoJsonProperties, SerialGeometry>,
  properties: IFeatureProperty;
  id: string | null;

}

export interface IFeature
  extends FeatureProperties {
  setGeometry(geometry: IGeometry<GeoJsonProperties, SerialGeometry>, properties?: IFeatureProperty): void;
}

/**
 * This defines a GeoJson Feature object which represents a spatially bound thing. Every Feature object is a GeoJson object no matter where it occurs in a GeoJson text. A Feature object will always have a "TYPE" member with the value "Feature".
A Feature object has a member with the name "geometry". The value of the geometry member SHALL be either a Geometry object or, in the case that the Feature is unlocated, a JSON null value.

A Feature object has a member with the name "properties". The value of the properties member is an object (any JSON object or a JSON null value).

If a Feature has a commonly used identifier, that identifier SHOULD be included as a member of the Feature object through the id() method, and the value of this member is either a JSON string or number.

An example of a serialized feature is given below:

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
 *
 * @export
 * @class Feature
 * @implements {IGeoJSON}
 */
export class Feature
  extends GeoJson
  implements IFeature {

  readonly type = GeoJsonTypes.Feature;

  bbox(): BoundingBox {
    return this._geometry.bbox();
  }
  hasBBox(): boolean {
    return this._geometry.hasBBox();
  }

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

  private _geometry: IGeometry<GeoJsonProperties, SerialGeometry>;
  get geometry(): IGeometry<GeoJsonProperties, SerialGeometry> {
    // Not cloned as all geometry objects are immutable
    return this._geometry;
  }

  private _properties: IFeatureProperty;
  get properties(): IFeatureProperty {
    return { ...this._properties };
  }

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

  setGeometry(geometry: IGeometry<GeoJsonProperties, SerialGeometry>, properties?: IFeatureProperty) {
    this._geometry = geometry;

    if (this.properties) {
      this._properties = properties;
    }
  }

  equals(item: Feature): boolean {
    if (!this._properties.equals(item.properties)) {
      return false;
    }

    return this._id === item._id && this._geometry.equals(item._geometry);
  }

  clone(): Feature {
    const feature = new Feature();

    feature._id = this._id;
    feature._geometry = this._geometry.clone() as IGeometry<GeoJsonProperties, SerialGeometry>;
    if (this._properties) {
      feature._properties = this._properties.clone();
    }

    return feature;
  }

  protected constructor() {
    super()
  }

  static fromJson(json: SerialFeature): Feature {
    const feature = new Feature();
    if (json.id) {
      feature._id = json.id.toString();
    }

    if (json.bbox && !json.geometry.bbox) {
      // Both bboxes should be the same. Assume geometry is more up to date, but if it is not present, use feature bbox.
      json.geometry.bbox = json.bbox;
    }
    feature._geometry = GeometryBuilder.fromJson(json.geometry);

    feature._properties = FeatureProperty.fromJson(json.properties);

    return feature;
  }

  static fromGeometry(geometry: IGeometry<GeoJsonProperties, SerialGeometry>, { properties, id }: FeatureOptions): Feature {
    const feature = new Feature();

    feature._geometry = geometry;
    if (id) {
      feature._id = id;
    }
    if (properties) {
      feature._properties = properties;
    }

    return feature;
  }
}