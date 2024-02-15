import { CartesianCoordinate } from "@markpthomas/math/coordinates";
import { Numbers } from "@markpthomas/math";

import { LineSegment } from "../Segments/LineSegment";
import { LineToLineIntersection } from "./LineToLineIntersection";


/// <summary>
/// Handles calculations related to point intersections.
/// </summary>
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @class PointIntersection
 * @typedef {PointIntersection}
 */
export class PointIntersection {
  /// <summary>
  /// Determines if the points overlap.
  /// </summary>
  /// <param name="point1">The point1.</param>
  /// <param name="point2">The point2.</param>
  /// <returns><c>true</c> if the points lie in the same position, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @returns {boolean}
 */
  public static IsOnPoint(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate): boolean {
    return point1 == point2;
  }

  /// <summary>
  /// Determines whether the specified location is on the path defined by straight line segments connecting the provided coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="shapeBoundary">The shape boundary.</param>
  /// <returns><c>true</c> if [is on shape] [the specified coordinate]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {CartesianCoordinate[]} shapeBoundary
 * @returns {boolean}
 */
  public static IsOnBoundary(
    coordinate: CartesianCoordinate,
    shapeBoundary: CartesianCoordinate[]): boolean {
    for (let i = 0; i < shapeBoundary.length - 1; i++) {
      const segment = new LineSegment(shapeBoundary[i], shapeBoundary[i + 1]);
      if (segment.IncludesCoordinate(coordinate)) {
        return true;
      }
    }
    return false;
  }

  // TODO: Implement IsOnBoundary for Polyline
  // TODO: Implement IsOnBoundary for Shape

  /// <summary>
  /// Determines whether the specified location is within the shape defined by straight line segments connecting the provided coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="shapeBoundary">The shape boundary composed of n points.</param>
  /// <returns><c>true</c> if the specified location is within the shape; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {CartesianCoordinate[]} shapeBoundary
 * @returns {boolean}
 */
  public static IsWithinShape(
    coordinate: CartesianCoordinate,
    shapeBoundary: CartesianCoordinate[]): boolean {
    // 3. If # intersections%2 == 0 (even) => point is outside.
    //    If # intersections%2 == 1 (odd) => point is inside.
    return Numbers.IsOdd(LineToLineIntersection.NumberOfIntersectionsOnHorizontalProjection(
      coordinate,
      shapeBoundary));
  }

  // TODO: Implement IsWithinShape for Shape
}