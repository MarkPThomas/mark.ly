import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { Segment } from '../../Geometry/Segment';
import { IDirection } from '../Direction';
import { IPointProperties, PPoint } from '../Point/Point';

import { RouteSegment, IRouteSegmentProperties, RouteSegmentData } from '../Route/RouteSegment';
import { TimeStamp } from './TimeStamp';
import { ITrackPointProperties, TrackPoint } from './TrackPoint';

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

// TODO: Add validation - at least that end time > start time, if not also format of timestamp
/**
 * Simple data storage for how to determine sub-segments within an existing larger segment.
 *
 * @export
 * @interface ISegmentLimits
 * @template TCoord
 */
export interface ITrackSegmentLimits {
  /**
   * First timestamp, indicating the start of a segment.
   *
   * @type {string}
   * @memberof ITrackSegmentLimits
   */
  startTime: string,

  /**
   * Last timestamp, indicating the end of a segment.
   *
   * @type {(string | null)}
   * @memberof ITrackSegmentLimits
   */
  endTime: string | null
};

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

  duration: number;
  speed: number;
  heightRate: number;

  constructor(length?: number, angle?: number, direction?: IDirection, height?: number, duration?: number) {
    super(length, angle, direction, height);

    this.duration = duration;
    if (duration) {
      this.speed = TrackSegment.calcSpeedMPS(this.length, duration);
      this.heightRate = TrackSegment.calcElevationSpeedMPS(this.height, duration);
    }
  }

  static fromTrackPoints(prevCoord: TrackPoint, nextCoord: TrackPoint) {
    const trackSegment = new TrackSegment();

    trackSegment.addSegmentProperties(prevCoord, nextCoord);

    return trackSegment;
  }

  // === Common Interfaces ===
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

  equals(segment: ITrackSegmentProperties): boolean {
    return super.equals(segment)
      && ((!this.duration && !segment.duration) || segment.duration === this.duration)
      && ((!this.speed && !segment.speed) || segment.speed === this.speed)
      && ((!this.heightRate && !segment.heightRate) || segment.heightRate === this.heightRate);
  }

  // === Methods ===
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

  static calcAngularSpeedRadPerSec(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    const pathRotationRad = Segment.calcPathRotationRad(prevSegment, nextSegment);
    const pathDurationSec = (prevSegment.duration === undefined || nextSegment.duration === undefined)
      ? null
      : prevSegment.duration + nextSegment.duration;

    return (pathRotationRad === null || pathDurationSec === null)
      ? null
      : pathRotationRad / pathDurationSec;
  }

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

  static calcSpeedMPS(length: number, duration: number) {
    return duration ? length / duration : Infinity;
  }

  static calcElevationSpeedMPS(elevationChange: number, duration: number) {
    return duration ? elevationChange / duration : Infinity;
  }
}