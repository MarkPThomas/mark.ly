import { IEquatable } from 'common/interfaces';

import { CartesianCoordinate } from '@markpthomas/math/Coordinates/CartesianCoordinate';
import { ITolerance } from '@markpthomas/math/ITolerance';
import { Vector } from '@markpthomas/math/Vectors/Vector';

import { ITransform } from '../ITransform';
import { PointExtents } from '../Tools/PointExtents';

/// <summary>
/// Interface for any segment along a path lying in a plane.
/// </summary>

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @interface IPathSegment
 * @typedef {IPathSegment}
 * @extends {ITolerance}
 * @extends {IEquatable<IPathSegment>}
 * @extends {ITransform<IPathSegment>}
 */
export interface IPathSegment extends
  ITolerance,
  IEquatable<IPathSegment>,
  ITransform<IPathSegment> {
  /// <summary>
  /// Gets the extents.
  /// </summary>
  /// <value>The extents.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @readonly
 * @type {PointExtents}
 */
  readonly Extents: PointExtents;

  /// <summary>
  /// First coordinate value.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @type {CartesianCoordinate}
 */
  I: CartesianCoordinate;

  /// <summary>
  /// Second coordinate value.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @type {CartesianCoordinate}
 */
  J: CartesianCoordinate;

  /// <summary>
  /// Length of the path segment.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {number}
 */
  Length(): number;

  /// <summary>
  /// X-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {number}
 */
  Xo(): number;

  /// <summary>
  /// Y-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {number}
 */
  Yo(): number;

  /// <summary>
  /// X-coordinate on the path that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} y
 * @returns {number}
 */
  X(y: number): number;

  /// <summary>
  /// Y-coordinate on the path that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} x
 * @returns {number}
 */
  Y(x: number): number;

  /// <summary>
  /// Determines whether the segment [has same coordinates] as [the specified segment].
  /// </summary>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if [has same coordinates] [the specified segment]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  HasSameCoordinates(segment: IPathSegment): boolean;

  /// <summary>
  /// Coordinate on the path that corresponds to the position along the path.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  PointByPathPosition(sRelative: number): CartesianCoordinate;

  /// <summary>
  /// Vector that is normal to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} sRelative
 * @returns {Vector}
 */
  NormalVector(sRelative: number): Vector;

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} sRelative
 * @returns {Vector}
 */
  TangentVector(sRelative: number): Vector;

  /// <summary>
  /// Returns a copy of the segment with an updated I coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  UpdateI(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment with an updated J coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  UpdateJ(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment with the I- &amp; J-coordinates reversed, as well as any other relevant control points.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @returns {IPathSegment}
 */
  Reverse(): IPathSegment;

  /// <summary>
  /// Merges the with leading segment.
  /// </summary>
  /// <param name="leadingSegment">The leading segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {IPathSegment} leadingSegment
 * @returns {IPathSegment}
 */
  MergeWithPriorSegment(leadingSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Merges the with following segment.
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
  /// Splits the segment by the relative location.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @param {number} sRelative
 * @returns {[IPathSegment, IPathSegment]}
 */
  SplitBySegmentPosition(sRelative: number): [IPathSegment, IPathSegment];


  // #region Methods: Chamfer & Fillet

  // /// <summary>
  // /// Chamfers the segments at the specified point.
  // /// Returns the new bounding segments and joining chamfer segment.
  // /// </summary>
  // /// <param name="segment">Segment to chamfer with.</param>
  // /// <param name="depth">The depth.</param>
  // /// <returns>Polyline.</returns>
  // Tuple<IPathSegment, LineSegment, IPathSegment> Chamfer(segment: IPathSegment, depth: number);

  // /// <summary>
  // /// Fillets the segments at the specified point.
  // /// Returns the new bounding segments and joining fillet segment.
  // /// </summary>
  // /// <param name="segment">Segment to fillet with.</param>
  // /// <param name="radius">The radius.</param>
  // /// <returns>Polyline.</returns>
  // Tuple<IPathSegment, IPathSegment, IPathSegment> Fillet(segment: IPathSegment, radius: number);
}