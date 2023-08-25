import {
  Feature as SerialFeature,
  GeoJsonProperties as SerialGeoJsonProperties,
  Geometry as SerialGeometry
} from 'geojson';

import { ICloneable, IEquatable } from "../../../../../../common/interfaces";

import { BoundingBox } from "./BoundingBox";
import { Geometry, IGeometry } from "./Geometries/Geometry";
import { GeoJson, GeoJsonProperties } from "./GeoJson";
import { GeoJsonTypes } from "./enums";

export type FeatureOptions = {
  properties?: IFeatureProperty,
  id?: string
}

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
export interface IFeatureProperty extends IEquatable<IFeatureProperty>, ICloneable<IFeatureProperty> {
}

class FeatureProperty implements IFeatureProperty {
  protected constructor() {

  }

  equals(item: IFeatureProperty): boolean {
    const keys = Object.keys(this);
    const itemKeys = Object.keys(item);
    if (keys.length !== itemKeys.length) {
      return false;
    }

    keys.forEach((key) => {
      if (item[key] !== this[key]) {
        return false;
      }
    });

    return true;
  }

  clone(): IFeatureProperty {
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

  get bbox(): BoundingBox {
    return this._geometry.bbox;
  }

  toJson(includeBoundingBox: boolean = false): SerialFeature {
    const jsonBase = super.toJsonBase(includeBoundingBox);

    let json = {
      ...jsonBase,
      geometry: this.geometry.toJson(includeBoundingBox),
      properties: this.properties as SerialGeoJsonProperties
    } as SerialFeature

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

    return this._geometry.equals(item._geometry);
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
      feature._id;
    }

    if (json.bbox && !json.geometry.bbox) {
      // Both bboxes should be the same. Assume geometry is more up to date, but if it is not present, use feature bbox.
      json.geometry.bbox = json.bbox;
    }
    feature._geometry = Geometry.fromJson(json.geometry);

    feature._properties = FeatureProperty.fromJson(json.properties);

    return feature;
  }

  //     {
  //       type: string, // Feature
  //       // bbox?: BBox[] // of n x n dimensions for lower-left-bottom & upper-right-top corners
  //       geometry: {
  //         type: string, // 'MultiLineString',
  //         // array of track segments, each as an array of coord properties
  //         //    each of which is an array of 3 indices:
  //         //      0 = longitude
  //         //      1 = latitude
  //         //      2 = elevation (m)
  //         coordinates: string[][][]
  //       },
  //       properties: {
  //         _gpxType: string, //trk
  //         name: string,
  //         time: string, //timestamp
  //         coordinateProperties: {
  //           // array of track segments, each as an array of timestamps for each coord
  //           times: string[][]
  //         }
  //       },
  //     }

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