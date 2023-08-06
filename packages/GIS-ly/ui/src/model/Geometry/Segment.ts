/**
 *
 *
 * @export
 * @interface ISegment
 */
export interface ISegment {
  /**
   * Length in meters
   *
   * @type {number}
   * @memberof ISegment
   */
  length: number;
  /**
   * Angle in radians, measured from due East
   *
   * @type {number}
   * @memberof ISegment
   */
  angle: number;
  direction?: {
    lat: string;
    lng: string;
  };
  /**
   * Speed in m/s
   *
   * @type {number}
   * @memberof ISegment
   */
  speed?: number;
}

export class Segment implements ISegment {
  length: number;
  angle: number;
  direction?: {
    lat: string;
    lng: string;
  };
  speed: number;
}