import { CartesianCoordinate } from "@markpthomas/math/Coordinates";
import { Curve } from "@markpthomas/math/Curves";

import { IPathSegment } from "./IPathSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @interface IPathSegmentCollision
 * @typedef {IPathSegmentCollision}
 * @template {Curve} T
 */
export interface IPathSegmentCollision<T extends Curve> {
  /// <summary>
  /// Gets the curve.
  /// </summary>
  /// <value>The curve.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @type {T}
 */
  Curve: T;

  /// <summary>
  /// Provided point lies on the line segment between or on the defining points.
  /// </summary>
  /// <param name="point"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} point
 * @returns {boolean}
 */
  IncludesCoordinate(point: CartesianCoordinate): boolean;

  /// <summary>
  /// Provided line segment intersects the line segment between or on the defining points.
  /// </summary>
  /// <param name="otherLine"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} otherLine
 * @returns {boolean}
 */
  IsIntersecting(otherLine: IPathSegment): boolean;

  /// <summary>
  /// Returns a point where the line segment intersects the provided line segment.
  /// </summary>
  /// <param name="otherLine">Line segment that intersects the current line segment.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} otherLine
 * @returns {CartesianCoordinate}
 */
  IntersectionCoordinate(otherLine: IPathSegment): CartesianCoordinate;
}