import { Position } from "@MPT/geojson";
import { Point } from "@MPT/geojson/Geometries";

import { ICloneable, IEquatable } from 'common/interfaces';

import { TimeStamp } from "../Time";
import { ITrackPathProps, TrackPathProps } from "./TrackPathProps";
import { IRoutePointProperties, RoutePoint } from "../Route/RoutePoint";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @interface PositionProperties
 * @typedef {PositionProperties}
 */
interface PositionProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {Position}
 */
  position: Position;
  // indices?: PositionIndex;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {?string}
 */
  timestamp?: string;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @interface PointProperties
 * @typedef {PointProperties}
 */
interface PointProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {Point}
 */
  point: Point;
  // indices?: PositionIndex;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {?string}
 */
  timestamp?: string;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface LatLngGPS
 * @typedef {LatLngGPS}
 */
export interface LatLngGPS {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  lat: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  lng: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {?(number | undefined)}
 */
  alt?: number | undefined;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {?string}
 */
  timestamp?: string;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackPointProperties
 * @typedef {ITrackPointProperties}
 * @extends {IRoutePointProperties}
 */
export interface ITrackPointProperties extends IRoutePointProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  timestamp: string;

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  path: ITrackPathProps;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackPoint
 * @typedef {ITrackPoint}
 * @extends {ITrackPointProperties}
 * @extends {ICloneable<TrackPoint>}
 * @extends {IEquatable<ITrackPointProperties>}
 */
export interface ITrackPoint
  extends
  ITrackPointProperties,
  ICloneable<TrackPoint>,
  IEquatable<ITrackPointProperties> {
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @class TrackPoint
 * @typedef {TrackPoint}
 * @extends {RoutePoint}
 * @implements {ITrackPoint}
 */
export class TrackPoint
  extends RoutePoint
  implements ITrackPoint {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @type {TimeStamp}
 */
  protected _timestamp: TimeStamp;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  get timestamp(): string {
    return this._timestamp?.time;
  }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {string}
 */
  set timestamp(timestamp: string) {
    this._timestamp = new TimeStamp(timestamp);
  }

  /**
   * Properties associated with the coordinate, but derived from context within a path.
   *
   * @type {{
   *     rotation: number;
   *     angularSpeed: number;
   *   }}
   * @memberof Coordinate
   */
  _path: ITrackPathProps;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @readonly
 * @type {ITrackPathProps}
 */
  get path(): ITrackPathProps {
    if (!this._path) {
      this._path = new TrackPathProps();
    }
    return this._path;
  }

  /**
 * Creates an instance of TrackPoint.
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @constructor
 * @param {number} lat
 * @param {number} lng
 * @param {?number} [altitude]
 * @param {?string} [timestamp]
 */
  constructor(lat: number, lng: number, altitude?: number, timestamp?: string) {
    super(lat, lng, altitude);
    if (timestamp) {
      this._timestamp = new TimeStamp(timestamp);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 */
  protected initialize() {
    this._path = new TrackPathProps();
  }


  // == Factory Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {PositionProperties} param0
 * @param {Position} param0.position
 * @param {string} param0.timestamp
 * @returns {TrackPoint}
 */
  static fromPositionInTime({ position, timestamp }: PositionProperties): TrackPoint {
    const trackPoint = new TrackPoint(position[1], position[0], position[2], timestamp);
    trackPoint.initialize();
    return trackPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {PointProperties} param0
 * @param {Point} param0.point
 * @param {string} param0.timestamp
 * @returns {TrackPoint}
 */
  static fromPointInTime({ point, timestamp }: PointProperties): TrackPoint {
    const trackPoint = new TrackPoint(point.latitude, point.longitude, point.altitude, timestamp);
    trackPoint.initialize();
    return trackPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @static
 * @param {ITrackPointProperties} properties
 * @returns {TrackPoint}
 */
  static fromProperties(properties: ITrackPointProperties): TrackPoint {
    const point = new TrackPoint(properties.lat, properties.lng, properties.alt, properties.timestamp);
    point.elevation = properties.elevation;
    point._path = properties.path;

    return point;
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackPoint}
 */
  clone(): TrackPoint {
    const trackPoint = new TrackPoint(this.lat, this.lng, this.alt, this.timestamp);

    if (this.elevation) {
      trackPoint.elevation = this.elevation;
    }

    if (this._path) {
      trackPoint._path = this._path.clone();
    }

    return trackPoint;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackPointProperties} trackPoint
 * @returns {boolean}
 */
  equals(trackPoint: ITrackPointProperties): boolean {
    return this.equalsBase(trackPoint)
      && ((!this.timestamp && !trackPoint.timestamp) || trackPoint.timestamp === this.timestamp)
      && this.path.equals(trackPoint.path);

  }
}


