/**
 *
 *
 * @export
 * @interface ISegment
 */
export interface ISegment {
  /**
   * Length in meters projected onto a 2D plane.
   *
   * @type {number}
   * @memberof ISegment
   */
  length: number;
  /**
   * Angle in radians, measured the Cartesian/Polar origin, or from due East, projected onto a 2D plane.
   *
   * @type {number}
   * @memberof ISegment
   */
  angle: number;
  // TODO: Separate segment geometry from GIS, w/ GIS deriving and having the following...
  direction?: {
    lat: string;
    lng: string;
  };
  duration?: number;
  /**
   * Speed in m/s
   *
   * @type {number}
   * @memberof ISegment
   */
  speed?: number;
  height?: number;
  heightRate?: number;
}

export class Segment implements ISegment {
  length: number;
  angle: number;
  direction?: {
    lat: string;
    lng: string;
  };
  duration?: number;
  speed?: number;
  height?: number;
  heightRate?: number;
}