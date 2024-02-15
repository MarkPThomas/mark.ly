/// <summary>
/// Curve position can be represented in cartesian coordinates.

import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";

/// </summary>
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @export
 * @interface ICurvePositionCartesian
 * @typedef {ICurvePositionCartesian}
 */
export interface ICurvePositionCartesian {
  /// <summary>
  /// X-coordinate on the curve that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @param {number} y
 * @returns {number}
 */
  XatY(y: number): number;

  /// <summary>
  /// Y-coordinate on the curve that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @param {number} x
 * @returns {number}
 */
  YatX(x: number): number;

  /// <summary>
  /// X-coordinates on the curve that correspond to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which x-coordinates are desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @param {number} y
 * @returns {number[]}
 */
  XsAtY(y: number): number[];

  /// <summary>
  /// Y-coordinates on the curve that correspond to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which y-coordinates are desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @param {number} x
 * @returns {number[]}
 */
  YsAtX(x: number): number[];

  /// <summary>
  /// Provided point lies on the curve.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns><c>true</c> if [is intersecting coordinate] [the specified coordinate]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @param {CartesianCoordinate} coordinate
 * @returns {boolean}
 */
  IsIntersectingCoordinate(coordinate: CartesianCoordinate): boolean;
}