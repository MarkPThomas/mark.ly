import { ICloneable, IEquatable } from 'common/interfaces';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @interface ISegmentProperties
 * @typedef {ISegmentProperties}
 */
export interface ISegmentProperties {
  /**
   * Length in meters projected onto a 2D plane.
   *
   * @type {number}
   * @memberof ISegment
   */
  length: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @interface ISegment
 * @typedef {ISegment}
 * @extends {ISegmentProperties}
 * @extends {ICloneable<Segment>}
 * @extends {IEquatable<ISegmentProperties>}
 */
export interface ISegment
  extends
  ISegmentProperties,
  ICloneable<Segment>,
  IEquatable<ISegmentProperties> {
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @export
 * @class Segment
 * @typedef {Segment}
 * @implements {ISegment}
 */
export class Segment implements ISegment {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @type {number}
 */
  length: number;

  /**
 * Creates an instance of Segment.
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @constructor
 * @param {?number} [length]
 */
  constructor(length?: number) {
    this.length = length;
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @returns {Segment}
 */
  clone(): Segment {
    const segment = new Segment(this.length);

    return segment;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:20 PM
 *
 * @param {ISegmentProperties} segment
 * @returns {boolean}
 */
  equals(segment: ISegmentProperties): boolean {
    return this.length === segment.length;
  }
}