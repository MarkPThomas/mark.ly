import { ICloneable, IEquatable } from '../../../../../common/interfaces';

export interface ISegmentProperties {
  /**
   * Length in meters projected onto a 2D plane.
   *
   * @type {number}
   * @memberof ISegment
   */
  length: number;
}

export interface ISegment
  extends
  ISegmentProperties,
  ICloneable<Segment>,
  IEquatable<ISegmentProperties> {
}

export class Segment implements ISegment {
  length: number;

  constructor(length?: number) {
    this.length = length;
  }

  // === Common Interfaces ===
  clone(): Segment {
    const segment = new Segment(this.length);

    return segment;
  }

  equals(segment: ISegmentProperties): boolean {
    return this.length === segment.length;
  }
}