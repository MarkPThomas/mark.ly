import {
  IFeatureProperty,
  FeatureProperty,
  Feature,
  Point, MultiLineString, MultiPoint, LineString
} from '../../GeoJSON';

/**
 * GeoJSON string formats for timestamps recorded by GPS.
 *
 * {@link Point} | {@link MultiPoint}/{@link LineString} | {@link MultiLineString}
 *
 * @export
 * @type TrackTimeStamps
 */
export type TrackTimeStamps = string | string[] | string[][];

export function getFeatureTimes(feature: Feature): TrackTimeStamps {
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
     * @type {TrackTimeStamps}
     */
    times: TrackTimeStamps
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
  time: string
  coordinateProperties: {
    times: TrackTimeStamps
  }

  equals(item: TrackProperty): boolean {
    if (super.equals(item)) {
      return (
        this._gpxType === item._gpxType
        && this.name === item.name
        && this.time === item.time
        && this.coordinatePropertiesAreEqual(item)
      );
    }
    return false;
  }

  protected coordinatePropertiesAreEqual(item: TrackProperty): boolean {
    const thisTimes = this.coordinateProperties.times;
    const itemTimes = item.coordinateProperties.times;

    return this.timestampsAreEqual(thisTimes, itemTimes);
  }

  protected timestampsAreEqual(timestamp1, timestamp2) {
    if (timestamp1.length !== timestamp2.length) {
      return false;
    }

    for (let i = 0; i < timestamp1.length; i++) {
      if (Array.isArray(timestamp1[i]) && Array.isArray(timestamp2[i])
        && !this.timestampsAreEqual(timestamp1[i], timestamp2[i])
      ) {
        return false;
      } else if (timestamp1[i] !== timestamp2[i]) {
        return false;
      }
    }
    return true;
  }

  clone(): TrackProperty {
    const properties = super.clone() as TrackProperty;

    properties._gpxType = this._gpxType;
    properties.name = this.name;
    properties.time = this.time;
    properties.coordinateProperties = this.cloneCoordinateProperties();

    return properties;
  }

  protected cloneCoordinateProperties() {
    const timesFirstDim = [...this.coordinateProperties.times[0]];

    if (timesFirstDim.length && timesFirstDim[0].length) {
      const timesSecondDim = [];
      timesFirstDim.forEach((timeSet) => {
        timesSecondDim.push([...timeSet]);
      });

      return { times: timesSecondDim };
    } else {
      return { times: timesFirstDim };
    }
  }

  protected constructor() {
    super()
  }

  fromTimestamps(timestamps: string[]): TrackProperty {
    const json: ITrackPropertyProperties = {
      _gpxType: this._gpxType,
      name: this.name,
      time: this.name,
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