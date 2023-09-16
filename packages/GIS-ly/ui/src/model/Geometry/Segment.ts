import { ICloneable, IEquatable } from '../../../../../common/interfaces';

export interface ISegmentProperties {
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

export interface ISegment
  extends
  ISegmentProperties,
  ICloneable<Segment>,
  IEquatable<ISegmentProperties> {
}

export class Segment implements ISegment {
  length: number;
  angle: number;

  constructor(length?: number, angle?: number,) {
    this.angle = angle;
    this.length = length;
  }

  // === Common Interfaces ===
  clone(): Segment {
    const segment = new Segment(this.length, this.angle);

    return segment;
  }

  equals(segment: ISegmentProperties): boolean {
    return this.length === segment.length
      && this.angle === segment.angle;
  }


  // === Calc Methods ===

  static calcPathRotationRad(segI: ISegmentProperties, segJ: ISegmentProperties) {
    return (segJ?.angle === undefined || segJ.angle === null
      || segI?.angle === undefined || segI.angle === null
      || isNaN(segJ.angle - segI.angle)
    )
      ? null
      : segJ.angle - segI.angle;
  }
}