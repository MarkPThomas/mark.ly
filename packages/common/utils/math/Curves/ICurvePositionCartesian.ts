/// <summary>
/// Curve position can be represented in cartesian coordinates.

import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";

/// </summary>
export interface ICurvePositionCartesian {
  /// <summary>
  /// X-coordinate on the curve that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  XatY(y: number): number;

  /// <summary>
  /// Y-coordinate on the curve that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  YatX(x: number): number;

  /// <summary>
  /// X-coordinates on the curve that correspond to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which x-coordinates are desired.</param>
  /// <returns>System.Double.</returns>
  XsAtY(y: number): number[];

  /// <summary>
  /// Y-coordinates on the curve that correspond to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which y-coordinates are desired.</param>
  /// <returns>System.Double.</returns>
  YsAtX(x: number): number[];

  /// <summary>
  /// Provided point lies on the curve.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns><c>true</c> if [is intersecting coordinate] [the specified coordinate]; otherwise, <c>false</c>.</returns>
  IsIntersectingCoordinate(coordinate: CartesianCoordinate): boolean;
}