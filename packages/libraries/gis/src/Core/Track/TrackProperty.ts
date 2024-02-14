import {
  IFeatureProperty,
  FeatureProperty,
  Feature,
} from '@markpthomas/geojson';

import {
  Point, MultiLineString, MultiPoint, LineString
} from '@markpthomas/geojson/geometries';

/**
 * GeoJSON string formats for timestamps recorded by GPS.
 *
 * {@link Point} | {@link MultiPoint}/{@link LineString} | {@link MultiLineString}
 *
 * @export
 * @type TrackTimestamps
 */
export type TrackTimestamps = string | string[] | string[][];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @param {Feature} feature
 * @returns {TrackTimestamps}
 */
export function getFeatureTimes(feature: Feature): TrackTimestamps {
  return feature.properties?.coordinateProperties?.times;
}

type CoordinateProperties = {
  times: TrackTimestamps
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackPropertyProperties
 * @typedef {ITrackPropertyProperties}
 */
export interface ITrackPropertyProperties {
  /**
   * Typically 'trk' for GPS recordings.
   *
   * @type {string}
   * @memberof ITrackPropertyProperties
   */
  _gpxType: string,

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  name: string,

  /**
   * Typically the timestamp at the start of the GPS recording.
   *
   * @type {string}
   * @memberof ITrackPropertyProperties
   */
  time: string,

  /**
   * ${1:Description placeholder}
   * @date 2/11/2024 - 6:34:55 PM
   *
   * @type {CoordinateProperties}
   */
  coordinateProperties: CoordinateProperties
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackProperty
 * @typedef {ITrackProperty}
 * @extends {IFeatureProperty}
 * @extends {ITrackPropertyProperties}
 */
export interface ITrackProperty extends IFeatureProperty, ITrackPropertyProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} timeStamps
 * @returns {FeatureProperty}
 */
  fromTimestamps(timeStamps: string[]): FeatureProperty;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @class TrackProperty
 * @typedef {TrackProperty}
 * @extends {FeatureProperty}
 * @implements {ITrackProperty}
 */
export class TrackProperty
  extends FeatureProperty
  implements ITrackProperty {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  _gpxType: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  name: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  time: string;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {{
 *     times: TrackTimestamps;
 *   }\}
 */
  coordinateProperties: {
    times: TrackTimestamps;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {TrackProperty} item
 * @returns {boolean}
 */
  equals(item: TrackProperty): boolean {
    return (
      this._gpxType === item._gpxType
      && this.name === item.name
      && this.time === item.time
      && this.coordinatePropertiesAreEqual(item)
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {TrackProperty} item
 * @returns {boolean}
 */
  protected coordinatePropertiesAreEqual(item: TrackProperty): boolean {
    const thisTimes = this.coordinateProperties.times;
    const itemTimes = item.coordinateProperties.times;

    return this.timestampsAreEqual(thisTimes, itemTimes);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {TrackTimestamps} timestamp1
 * @param {TrackTimestamps} timestamp2
 * @returns {boolean}
 */
  protected timestampsAreEqual(timestamp1: TrackTimestamps, timestamp2: TrackTimestamps) {
    if (!Array.isArray(timestamp1) && !Array.isArray(timestamp2)) {
      return timestamp1 === timestamp2;
    }

    if (!Array.isArray(timestamp1) || !Array.isArray(timestamp2) || timestamp1.length !== timestamp2.length) {
      return false;
    }

    for (let i = 0; i < timestamp1.length; i++) {
      if (!this.timestampsAreEqual(timestamp1[i], timestamp2[i])) {
        return false;
      }
      // if (Array.isArray(timestamp1[i]) && Array.isArray(timestamp2[i])
      //   && !this.timestampsAreEqual(timestamp1[i], timestamp2[i])
      // ) {
      //   return false;
      // } else if (timestamp1[i] !== timestamp2[i]) {
      //   return false;
      // }
    }
    return true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackProperty}
 */
  clone(): TrackProperty {
    const properties = super.clone() as TrackProperty;

    properties._gpxType = this._gpxType;
    properties.name = this.name;
    properties.time = this.time;
    properties.coordinateProperties = this.cloneCoordinateProperties(this.coordinateProperties.times);

    return properties;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {TrackTimestamps} times
 * @returns {{ times: TrackTimestamps; }\}
 */
  protected cloneCoordinateProperties(times: TrackTimestamps) {
    if (!Array.isArray(times)) {
      return { times };
    }

    const timesFirstDim = this.coordinateProperties.times[0];

    if (!Array.isArray(timesFirstDim)) {
      return { times: [...times] };
    } else {
      const timesSecondDim = [];
      times.forEach((timeSet: TrackTimestamps) => {
        timesSecondDim.push([...timeSet]);
      });

      return { times: timesSecondDim };
    }
  }

  /**
 * Creates an instance of TrackProperty.
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() {
    super()
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {string[]} timestamps
 * @returns {TrackProperty}
 */
  fromTimestamps(timestamps: string[]): TrackProperty {
    const json: ITrackPropertyProperties = {
      _gpxType: this._gpxType,
      name: this.name,
      time: this.time,
      coordinateProperties: {
        times: timestamps
      }
    }

    return TrackProperty.fromJson(json);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {ITrackPropertyProperties} json
 * @returns {TrackProperty}
 */
  static fromJson(json: ITrackPropertyProperties): TrackProperty {
    const featureProperty = new TrackProperty();

    const keys = Object.keys(json);
    keys.forEach((key) => {
      featureProperty[key] = json[key];
    });

    return featureProperty;
  }
}