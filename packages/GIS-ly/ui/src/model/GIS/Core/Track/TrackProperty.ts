import {
  IFeatureProperty,
  FeatureProperty,
  Feature,
  Point, MultiLineString, MultiPoint, LineString
} from '../../../GeoJSON';

/**
 * GeoJSON string formats for timestamps recorded by GPS.
 *
 * {@link Point} | {@link MultiPoint}/{@link LineString} | {@link MultiLineString}
 *
 * @export
 * @type TrackTimestamps
 */
export type TrackTimestamps = string | string[] | string[][];

export function getFeatureTimes(feature: Feature): TrackTimestamps {
  return feature.properties?.coordinateProperties?.times;
}

export interface ITrackPropertyProperties {
  /**
   * Typically 'trk' for GPS recordings.
   *
   * @type {string}
   * @memberof ITrackPropertyProperties
   */
  _gpxType: string,
  name: string,
  /**
   * Typically the timestamp at the start of the GPS recording.
   *
   * @type {string}
   * @memberof ITrackPropertyProperties
   */
  time: string,
  coordinateProperties: {
    /**
     * Timestamps mapped by indices to the corresponding Point in the associated gemoetry.
     *
     * @type {TrackTimestamps}
     */
    times: TrackTimestamps
  }

}

export interface ITrackProperty extends IFeatureProperty, ITrackPropertyProperties {
  fromTimestamps(timeStamps: string[]): FeatureProperty;
}

export class TrackProperty
  extends FeatureProperty
  implements ITrackProperty {

  _gpxType: string;
  name: string;
  time: string;
  coordinateProperties: {
    times: TrackTimestamps;
  }

  equals(item: TrackProperty): boolean {
    return (
      this._gpxType === item._gpxType
      && this.name === item.name
      && this.time === item.time
      && this.coordinatePropertiesAreEqual(item)
    );
  }

  protected coordinatePropertiesAreEqual(item: TrackProperty): boolean {
    const thisTimes = this.coordinateProperties.times;
    const itemTimes = item.coordinateProperties.times;

    return this.timestampsAreEqual(thisTimes, itemTimes);
  }

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

  clone(): TrackProperty {
    const properties = super.clone() as TrackProperty;

    properties._gpxType = this._gpxType;
    properties.name = this.name;
    properties.time = this.time;
    properties.coordinateProperties = this.cloneCoordinateProperties(this.coordinateProperties.times);

    return properties;
  }

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

  protected constructor() {
    super()
  }

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

  static fromJson(json: ITrackPropertyProperties): TrackProperty {
    const featureProperty = new TrackProperty();

    const keys = Object.keys(json);
    keys.forEach((key) => {
      featureProperty[key] = json[key];
    });

    return featureProperty;
  }
}