import { ICloneable, IEquatable } from 'common/interfaces';

import { IDirection } from '../Direction';
import { IPointProperties } from '../Point/Point';

import { RouteSegment, IRouteSegmentProperties, RouteSegmentData } from '../Route/RouteSegment';
import { TimeStamp } from '../Time';
import { TrackPoint } from './TrackPoint';

/**
 * Basic data of {@link Point}s and corresponding timestamps that lie within the segment.
 *
 * @export
 * @interface TrackSegmentData
 */
export interface TrackSegmentData extends RouteSegmentData {
  /**
   * All of the timestamps contained within the segment.
   *
   * @type {string[]}
   * @memberof TrackSegmentData
   */
  segTimestamps: string[];
};


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @export
 * @interface ITrackSegmentProperties
 * @typedef {ITrackSegmentProperties}
 * @extends {IRouteSegmentProperties}
 */
export interface ITrackSegmentProperties extends IRouteSegmentProperties {
  /**
   * Duration in seconds.
   *
   * @type {number}
   * @memberof ITrackSegment
   */
  duration?: number;

  /**
   * Speed in m/s.
   *
   * @type {number}
   * @memberof ISegment
   */
  speed?: number;

  /**
   * Rate of height change in m/s.
   *
   * @type {number}
   * @memberof ITrackSegment
   */
  heightRate?: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @export
 * @interface ITrackSegment
 * @typedef {ITrackSegment}
 * @extends {ITrackSegmentProperties}
 * @extends {ICloneable<TrackSegment>}
 * @extends {IEquatable<ITrackSegmentProperties>}
 */
export interface ITrackSegment
  extends
  ITrackSegmentProperties,
  ICloneable<TrackSegment>,
  IEquatable<ITrackSegmentProperties> {

}

/**
 *
 *
 * @export
 * @class Segment
 * @extends {SegmentGeometry}
 * @implements {ISegment}
 */
export class TrackSegment
  extends RouteSegment
  implements ITrackSegment {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @type {number}
 */
  duration: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @type {number}
 */
  speed: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @type {number}
 */
  heightRate: number;

  /**
 * Creates an instance of TrackSegment.
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @constructor
 * @param {?number} [length]
 * @param {?number} [angle]
 * @param {?IDirection} [direction]
 * @param {?number} [height]
 * @param {?number} [duration]
 */
  constructor(length?: number, angle?: number, direction?: IDirection, height?: number, duration?: number) {
    super(length, angle, direction, height);

    this.duration = duration;
    if (duration) {
      this.speed = TrackSegment.calcSpeedMPS(this.length, duration);
      this.heightRate = TrackSegment.calcElevationSpeedMPS(this.height, duration);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {TrackPoint} prevCoord
 * @param {TrackPoint} nextCoord
 * @returns {TrackSegment}
 */
  static fromTrackPoints(prevCoord: TrackPoint, nextCoord: TrackPoint) {
    const trackSegment = new TrackSegment();

    trackSegment.addSegmentProperties(prevCoord, nextCoord);

    return trackSegment;
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @returns {TrackSegment}
 */
  clone(): TrackSegment {
    const segment = new TrackSegment(this.length, this.angle, this.direction, this.height);

    if (this.duration) {
      segment.duration = this.duration;
    }
    if (this.speed) {
      segment.speed = this.speed;
    }
    if (this.heightRate) {
      segment.heightRate = this.heightRate;
    }

    return segment;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @param {ITrackSegmentProperties} segment
 * @returns {boolean}
 */
  equals(segment: ITrackSegmentProperties): boolean {
    return super.equals(segment)
      && ((!this.duration && !segment.duration) || segment.duration === this.duration)
      && ((!this.speed && !segment.speed) || segment.speed === this.speed)
      && ((!this.heightRate && !segment.heightRate) || segment.heightRate === this.heightRate);
  }

  // === Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @param {TrackPoint} prevCoord
 * @param {TrackPoint} nextCoord
 */
  addSegmentProperties(prevCoord: TrackPoint, nextCoord: TrackPoint) {
    super.addSegmentProperties(prevCoord, nextCoord);

    this.duration = TimeStamp.calcIntervalSec(prevCoord.timestamp, nextCoord.timestamp);
    if (this.duration) {
      this.speed = this.length / this.duration;
    }

    if (this.height !== undefined) {
      this.heightRate = TrackSegment.calcElevationSpeedMPS(this.height, this.duration);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @param {IPointProperties} prevCoord
 * @param {IPointProperties} nextCoord
 */
  addElevationData(
    prevCoord: IPointProperties,
    nextCoord: IPointProperties
  ) {
    super.addElevationData(prevCoord, nextCoord);

    if (this.height !== undefined) {
      this.heightRate = TrackSegment.calcElevationSpeedMPS(this.height, this.duration);
    }
  }

  // == Static Methods

  /**
  * Returns the average speed of two segments in meters/second.
  * If one segment does not have a numerical speed, the valid segment's speed is returned.
  *
  * @protected
  * @param {TrackSegment} segI
  * @param {TrackSegment} segJ
  * @return {*}
  * @memberof Track
  */
  static calcAvgSpeedMPS(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    const speedI = prevSegment?.speed;
    const speedJ = nextSegment?.speed;

    return (speedI && speedJ)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 * @returns {number}
 */
  static calcAvgElevationSpeedMPS(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    const speedI = prevSegment?.heightRate;
    const speedJ = nextSegment?.heightRate;

    return ((speedI !== undefined && speedI !== null) && (speedJ !== undefined && speedJ !== null))
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 * @returns {number}
 */
  static calcAngularSpeedRadPerSec(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    const pathRotationRad = RouteSegment.calcPathRotationRad(prevSegment, nextSegment);
    const pathDurationSec = (prevSegment?.duration === undefined || nextSegment?.duration === undefined)
      ? null
      : prevSegment.duration + nextSegment.duration;

    return (pathRotationRad === null || pathDurationSec === null)
      ? null
      : pathRotationRad / pathDurationSec;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {TrackPoint} prevCoord
 * @param {TrackPoint} nextCoord
 * @returns {*}
 */
  static calcSegmentSpeedMPS(prevCoord: TrackPoint, nextCoord: TrackPoint) {
    if (!prevCoord.timestamp || !nextCoord.timestamp) {
      return 0;
    }

    const duration = TimeStamp.calcIntervalSec(prevCoord.timestamp, nextCoord.timestamp);
    if (duration === undefined) {
      return undefined;
    }

    const length = TrackPoint.calcSegmentDistanceMeters(prevCoord, nextCoord);
    return duration ? length / duration : Infinity;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {number} length
 * @param {number} duration
 * @returns {*}
 */
  static calcSpeedMPS(length: number, duration: number) {
    return duration ? length / duration : Infinity;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:56 PM
 *
 * @static
 * @param {number} elevationChange
 * @param {number} duration
 * @returns {*}
 */
  static calcElevationSpeedMPS(elevationChange: number, duration: number) {
    return duration ? elevationChange / duration : Infinity;
  }
}