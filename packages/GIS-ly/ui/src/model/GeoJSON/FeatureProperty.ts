import { ICloneable, IEquatable } from "../../../../../common/interfaces";

import { GeoJsonProperties as SerialGeoJsonProperties } from 'geojson';


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
  toJson(): SerialGeoJsonProperties;
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
      const currentItem = item[keys[i]];
      const currentThisItem = this[keys[i]];
      if (Array.isArray(currentItem) || typeof currentItem === 'object') {
        // Stringify to compare nested structures by value rather than by reference
        if (JSON.stringify(currentItem) !== JSON.stringify(currentThisItem)) {
          return false;
        }
      } else if (currentItem !== currentThisItem) {
        // Do not stringify primitives in order to consider numbers different than strings
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

  toJson(): SerialGeoJsonProperties {
    let json = {}

    const keys = Object.keys(this);
    keys.forEach((key) => {
      json[key] = this[key];
    });

    return json;
  }

  static fromJson(json: SerialGeoJsonProperties): FeatureProperty {
    const featureProperty = new FeatureProperty();

    if (!!(json)) {
      const keys = Object.keys(json);
      keys.forEach((key) => {
        featureProperty[key] = json[key];
      });
    }

    return featureProperty;
  }
}