import {
  ISegment as ISegmentGeometry,
  Segment as SegmentGeometry
} from '../../Geometry/Segment';

import { IDirection } from '../Direction';
import { Point } from '../../GeoJSON';
import { TrackPoint } from './TrackPoint';

/**
 * Basic data of {@link Point}s and corresponding timestamps that lie within the segment.
 *
 * @export
 * @interface TrackSegmentData
 */
export interface TrackSegmentData {
  /**
   * All of the {@link Point}s contained within the {@link TrackSegment}.
   *
   * @type {Point[]}
   * @memberof TrackSegments
   */
  segPoints: Point[];

  /**
   * All of the timestamps contained within the {@link TrackSegment}.
   *
   * @type {string[]}
   * @memberof TrackSegments
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

export interface ITrackSegment extends ISegmentGeometry {
  /**
   * Cardinal direction that the segment is pointing, directed from {@link TrackPoint} I towards {@link TrackPoint} J.
   *
   * @type {{
   *     lat: string;
   *     lng: string;
   *   }}
   * @memberof ITrackSegment
   */
  direction?: IDirection;

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
   * Height in meters.
   *
   * @type {number}
   * @memberof ITrackSegment
   */
  height?: number;

  /**
   * Rate of height change in m/s.
   *
   * @type {number}
   * @memberof ITrackSegment
   */
  heightRate?: number;
}

/**
 *
 *
 * @export
 * @class Segment
 * @extends {SegmentGeometry}
 * @implements {ISegment}
 */
export class TrackSegment extends SegmentGeometry implements ITrackSegment {
  direction?: IDirection;
  duration?: number;
  speed?: number;
  height?: number;
  heightRate?: number;

  static calcPathRotationRad(segI: ITrackSegment, segJ: ITrackSegment) {
    return (segJ?.angle === undefined || segJ.angle === null
      || segI?.angle === undefined || segI.angle === null
      || isNaN(segJ.angle - segI.angle)
    )
      ? null
      : segJ.angle - segI.angle;
  }

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
  static calcCoordAvgSpeedMPS(segI: ITrackSegment, segJ: ITrackSegment) {
    const speedI = segI?.speed;
    const speedJ = segJ?.speed;

    return (speedI && speedJ)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }

  static calcPathAngularSpeedRadPerSec(segI: ITrackSegment, segJ: ITrackSegment) {
    const pathRotationRad = this.calcPathRotationRad(segI, segJ);
    const pathDurationSec = (segI?.duration === undefined || segJ?.duration === undefined)
      ? null
      : segI.duration + segJ.duration;

    return (pathRotationRad === null || pathDurationSec === null)
      ? null
      : pathRotationRad / pathDurationSec;
  }

  static calcCoordAvgElevationSpeedMPS(segI: ITrackSegment, segJ: ITrackSegment) {
    const speedI = segI?.heightRate;
    const speedJ = segJ?.heightRate;

    return (speedI !== undefined && speedJ !== undefined)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }
}