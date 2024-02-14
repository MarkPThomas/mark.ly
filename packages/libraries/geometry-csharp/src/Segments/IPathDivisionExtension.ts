/// <summary>
/// Interface for paths that are divisible.

import { CartesianCoordinate } from "@markpthomas/math/coordinates";
import { LinearCurve } from "@markpthomas/math/Curves";

import { IPathSegment } from "./IPathSegment";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @interface IPathDivisionExtension
 * @typedef {IPathDivisionExtension}
 */
export interface IPathDivisionExtension {
  /// <summary>
  /// Splits the segment by the provided point.
  /// </summary>
  /// <param name="pointDivision">The point to use for division.</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} pointDivision
 * @returns {[IPathSegment, IPathSegment]}
 */
  SplitBySegmentPoint(pointDivision: CartesianCoordinate): [IPathSegment, IPathSegment];

  /// <summary>
  /// Returns a copy of the segment that splits the segment by the relative location.
  /// <paramref name="sRelative"/> must be between 0 and 1.
  /// </summary>
  /// <param name="sRelative">The relative position along the path between 0 (point i) and 1 (point j).</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} sRelative
 * @returns {[IPathSegment, IPathSegment]}
 */
  SplitBySegmentPosition(sRelative: number): [IPathSegment, IPathSegment];

  /// <summary>
  /// Extends the segment to the provided point.
  /// </summary>
  /// <param name="pointExtension">The point to extend the segment to.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} pointExtension
 * @returns {IPathSegment}
 */
  ExtendSegmentToPoint(pointExtension: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Extends the segment to intersect the provided curve.
  /// </summary>
  /// <param name="curve">The curve.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {LinearCurve} curve
 * @returns {IPathSegment}
 */
  ExtendSegmentToCurve(curve: LinearCurve): IPathSegment;

  /// <summary>
  /// Coordinate of where the segment projection intersects the provided curve.
  /// </summary>
  /// <param name="curve">The curve.</param>
  /// <returns>CartesianCoordinate.</returns>
  /// <exception cref="ArgumentOutOfRangeException">Curves never intersect.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {LinearCurve} curve
 * @returns {CartesianCoordinate}
 */
  CoordinateOfSegmentProjectedToCurve(curve: LinearCurve): CartesianCoordinate;

  /// <summary>
  /// Coordinate of where a perpendicular projection intersects the provided coordinate.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} point
 * @returns {CartesianCoordinate}
 */
  CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate;

  /// <summary>
  /// Returns a point determined by a given fraction of the distance between point i and point j of the segment.
  ///  <paramref name="fraction"/> must be between 0 and 1.
  /// </summary>
  /// <param name="fraction">Fraction of the way from point 1 to point 2.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} fraction
 * @returns {CartesianCoordinate}
 */
  PointOffsetOnSegment(fraction: number): CartesianCoordinate;

  /// <summary>
  ///  Returns a point determined by a given ratio of the distance between point i and point j of the segment.
  /// </summary>
  /// <param name="ratio">Ratio of the size of the existing segment.
  /// If <paramref name="ratio"/>&lt; 0, returned point is offset from point i, in that direction.
  /// If <paramref name="ratio"/>&gt; 0, returned point is offset from point j, in that direction.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} ratio
 * @returns {CartesianCoordinate}
 */
  PointScaledFromSegment(ratio: number): CartesianCoordinate;

  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} priorSegment
 * @returns {IPathSegment}
 */
  MergeWithPriorSegment(priorSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} followingSegment
 * @returns {IPathSegment}
 */
  MergeWithFollowingSegment(followingSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} priorSegment
 * @returns {(IPathSegment | null)}
 */
  JoinWithPriorSegment(priorSegment: IPathSegment): IPathSegment | null;

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} followingSegment
 * @returns {(IPathSegment | null)}
 */
  JoinWithFollowingSegment(followingSegment: IPathSegment): IPathSegment | null;


}