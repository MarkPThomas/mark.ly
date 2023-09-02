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
}

export class Segment implements ISegment {
  length: number;
  angle: number;
}