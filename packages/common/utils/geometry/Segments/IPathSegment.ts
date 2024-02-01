import { IEquatable } from '../../../interfaces';
import { CartesianCoordinate } from '../../math/Coordinates/CartesianCoordinate';
import { ITolerance } from '../../math/ITolerance';
import { Vector } from '../../math/Vectors/Vector';
import { ITransform } from '../ITransform';
import { PointExtents } from '../Tools/PointExtents';

/// <summary>
/// Interface for any segment along a path lying in a plane.
/// </summary>

export interface IPathSegment extends
  ITolerance,
  IEquatable<IPathSegment>,
  ITransform<IPathSegment> {
  /// <summary>
  /// Gets the extents.
  /// </summary>
  /// <value>The extents.</value>
  readonly Extents: PointExtents;

  /// <summary>
  /// First coordinate value.
  /// </summary>
  I: CartesianCoordinate;

  /// <summary>
  /// Second coordinate value.
  /// </summary>
  J: CartesianCoordinate;

  /// <summary>
  /// Length of the path segment.
  /// </summary>
  /// <returns></returns>
  Length(): number;

  /// <summary>
  /// X-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  Xo(): number;

  /// <summary>
  /// Y-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  Yo(): number;

  /// <summary>
  /// X-coordinate on the path that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns></returns>
  X(y: number): number;

  /// <summary>
  /// Y-coordinate on the path that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns></returns>
  Y(x: number): number;

  /// <summary>
  /// Determines whether the segment [has same coordinates] as [the specified segment].
  /// </summary>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if [has same coordinates] [the specified segment]; otherwise, <c>false</c>.</returns>
  HasSameCoordinates(segment: IPathSegment): boolean;

  /// <summary>
  /// Coordinate on the path that corresponds to the position along the path.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns></returns>
  PointByPathPosition(sRelative: number): CartesianCoordinate;

  /// <summary>
  /// Vector that is normal to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  NormalVector(sRelative: number): Vector;

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  TangentVector(sRelative: number): Vector;

  /// <summary>
  /// Returns a copy of the segment with an updated I coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  UpdateI(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment with an updated J coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  UpdateJ(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment with the I- &amp; J-coordinates reversed, as well as any other relevant control points.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  Reverse(): IPathSegment;

  /// <summary>
  /// Merges the with leading segment.
  /// </summary>
  /// <param name="leadingSegment">The leading segment.</param>
  /// <returns>IPathSegment.</returns>
  MergeWithPriorSegment(leadingSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Merges the with following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  MergeWithFollowingSegment(followingSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Splits the segment by the relative location.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
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