import { ICloneable, IEquatable } from "../../../common/interfaces";

import { GeoJsonProperties as SerialGeoJsonProperties } from 'geojson';


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @typedef {FeaturePropertyProperties}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {SerialGeoJsonProperties}
 */
  toJson(): SerialGeoJsonProperties;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @class FeatureProperty
 * @typedef {FeatureProperty}
 * @implements {IFeatureProperty}
 */
export class FeatureProperty implements IFeatureProperty {
  /**
 * Creates an instance of FeatureProperty.
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() { }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @param {FeaturePropertyProperties} item
 * @returns {boolean}
 */
  equals(item: FeaturePropertyProperties): boolean {
    const keys: string[] = Object.keys(this);
    const itemKeys: string[] = Object.keys(item);
    if (keys.length !== itemKeys.length) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const currentItem: FeaturePropertyProperties = item[keys[i]];
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {FeatureProperty}
 */
  clone(): FeatureProperty {
    const featureProperty = new FeatureProperty();

    const keys: string[] = Object.keys(this);
    keys.forEach((key) => {
      featureProperty[key] = this[key];
    });

    return featureProperty;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @returns {SerialGeoJsonProperties}
 */
  toJson(): SerialGeoJsonProperties {
    let json = {}

    const keys: string[] = Object.keys(this);
    keys.forEach((key) => {
      json[key] = this[key];
    });

    return json;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @param {SerialGeoJsonProperties} json
 * @returns {FeatureProperty}
 */
  static fromJson(json: SerialGeoJsonProperties): FeatureProperty {
    const featureProperty = new FeatureProperty();

    if (!!(json)) {
      const keys: string[] = Object.keys(json);
      keys.forEach((key) => {
        featureProperty[key] = json[key];
      });
    }

    return featureProperty;
  }
}