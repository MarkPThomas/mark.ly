// using NMath = System.Math;

import { IPathSegment } from "../segments/IPathSegment";
import { PointExtents } from "../tools/PointExtents";

// using MPT.Math.coordinates;
// using MPT.Geometry.Segments;
// using MPT.Math.Curves;
// using MPT.Geometry.Tools;

/// <summary>
/// Handles calculations related to horizontal projections.
/// </summary>
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @class PointProjection
 * @typedef {PointProjection}
 */
export class PointProjection {
  // #region Number of Intersections

  ///// <summary>
  ///// The numbers of shape boundary intersections a horizontal line makes when projecting to the right from the provided point.
  ///// If the point is on a vertex or segment, the function returns either 0 or 1.
  ///// </summary>
  ///// <param name="coordinate">The coordinate.</param>
  ///// <param name="shapeBoundary">The shape boundary composed of n points.</param>
  ///// <param name="includePointOnSegment">if set to <c>true</c> [include point on segment].</param>
  ///// <param name="includePointOnVertex">if set to <c>true</c> [include point on vertex].</param>
  ///// <param name="tolerance">The tolerance.</param>
  ///// <returns>System.Int32.</returns>
  ///// <exception cref="System.ArgumentException">Shape boundary describes a shape. Closure to the shape boundary is needed.</exception>
  //public static int NumberOfIntersectionsOnHorizontalProjection(
  //    CartesianCoordinate coordinate,
  //    CartesianCoordinate [] shapeBoundary,
  //    bool includePointOnSegment = true,
  //    bool includePointOnVertex = true,
  //    double tolerance = GeometryLibrary.ZeroTolerance)
  //{
  //    if (shapeBoundary[0] != shapeBoundary[shapeBoundary.Length - 1])
  //        throw new ArgumentException("Shape boundary describes a shape. Closure to the shape boundary is needed.");

  //    // 1. Check horizontal line projection from a pt. n to the right
  //    // 2. Count # of intersections of the line with shape edges

  //    // Note shape coordinates from XML already repeat starting node as an ending node.
  //    // No need to handle wrap-around below.

  //    int numberOfIntersections = 0;
  //    for (int i = 0; i < shapeBoundary.Length - 1; i++)
  //    {
  //        CartesianCoordinate vertexI = shapeBoundary[i];
  //        if (PointIntersection.IsOnPoint(coordinate, vertexI))
  //        {
  //            return 0;
  //        }

  //        CartesianCoordinate vertexJ = shapeBoundary[i + 1];
  //        LineSegment segment = new LineSegment(vertexI, vertexJ);
  //        LinearCurve segmentCurve = segment.Curve;
  //        if (segment.IncludesCoordinate(coordinate))
  //        {
  //            return 0;
  //        }
  //        if (segmentCurve.IsHorizontal())
  //        {   // Segment would be parallel or collinear to line projection.
  //            continue;
  //        }


  //        if (!LineToLineIntersection.PointIsLeftOfLineEndExclusive(coordinate.X, vertexI, vertexJ))
  //        {   // Pt is to the right of the segment.
  //            continue;
  //        }
  //        bool pointIsWithinSegmentHeight = LineToLineIntersection.PointIsWithinLineHeightInclusive(
  //                                            coordinate.Y,
  //                                            vertexI, vertexJ);
  //        if (!pointIsWithinSegmentHeight)
  //        {   // CartesianCoordinate is out of vertical bounds of the segment extents.
  //            continue;
  //        }
  //        //bool pointIsWithinSegmentWidth = ProjectionVertical.PointIsWithinSegmentWidth(
  //        //                                    coordinate.X,
  //        //                                    vertexI, vertexJ,
  //        //                                    includeEnds: includePointOnSegment);
  //        if (segmentCurve.IsVertical())
  //        {
  //            //if (pointIsWithinSegmentWidth)
  //            //{ // CartesianCoordinate is on vertical segment
  //            //    return includePointOnSegment ? 1 : 0;
  //            //}
  //            //// CartesianCoordinate hits vertical segment
  //            numberOfIntersections++;
  //            continue;
  //        }
  //        //if (segment.IsHorizontal())
  //        //{   // Segment would be parallel to line projection.
  //        //    // CartesianCoordinate is collinear since it is within segment height
  //        //    if (pointIsWithinSegmentWidth)
  //        //    { // CartesianCoordinate is on horizontal segment
  //        //        return includePointOnSegment ? 1 : 0;
  //        //    }
  //        //    continue;
  //        //}

  //        double xIntersection = LineToLineIntersection.IntersectionPointX(coordinate.Y, vertexI, vertexJ);
  //        if (LineToLineIntersection.PointIsLeftOfSegmentIntersection(coordinate.X, xIntersection, vertexI, vertexJ))
  //        {
  //            numberOfIntersections++;
  //        }
  //        //else if (coordinate.X.IsEqualTo(xIntersection, tolerance))
  //        //{ // CartesianCoordinate is on sloped segment
  //        //    return includePointOnSegment ? 1 : 0;
  //        //}
  //    }
  //    return numberOfIntersections;
  //}

  // TODO: Determine if this sort of function is ever needed: NumberOfIntersectionsOnVerticalProjection
  ///// <summary>
  ///// The numbers of shape boundary intersections a vertical line makes when projecting to the top from the provided point.
  ///// If the point is on a vertex or segment, the function returns either 0 or 1.
  ///// </summary>
  ///// <param name="coordinate">The coordinate.</param>
  ///// <param name="shapeBoundary">The shape boundary composed of n points.</param>
  ///// <param name="includePointOnSegment">if set to <c>true</c> [include point on segment].</param>
  ///// <param name="includePointOnVertex">if set to <c>true</c> [include point on vertex].</param>
  ///// <param name="tolerance">The tolerance.</param>
  ///// <returns>System.Int32.</returns>
  //public static int NumberOfIntersectionsOnVerticalProjection(
  //    CartesianCoordinate coordinate,
  //    CartesianCoordinate[] shapeBoundary,
  //    bool includePointOnSegment = true,
  //    bool includePointOnVertex = true,
  //    double tolerance = GeometryLibrary.ZeroTolerance)
  //{
  //    if (shapeBoundary[0] != shapeBoundary[shapeBoundary.Length - 1])
  //        throw new ArgumentException("Shape boundary describes a shape. Closure to the shape boundary is needed.");

  //    // 1. Check vertical line projection from a pt. n to the top
  //    // 2. Count # of intersections of the line with shape edges

  //    // Note shape coordinates from XML already repeat starting node as an ending node.
  //    // No need to handle wrap-around below.

  //    int numberOfIntersections = 0;
  //    for (int i = 0; i < shapeBoundary.Length - 1; i++)
  //    {
  //        CartesianCoordinate vertexI = shapeBoundary[i];
  //        if (PointIntersection.IsOnPoint(coordinate, vertexI))
  //        {
  //            return includePointOnVertex ? 1 : 0;
  //        }

  //        CartesianCoordinate vertexJ = shapeBoundary[i + 1];

  //        if (!LineToLineIntersection.PointIsBelowLineBottomInclusive(coordinate.X, vertexI, vertexJ))
  //        {
  //            // Pt is above the segment.
  //            continue;
  //        }
  //        bool pointIsWithinSegmentWidth = LineToLineIntersection.PointIsWithinLineWidthInclusive(
  //                                            coordinate.X,
  //                                            vertexI, vertexJ);
  //        if (!pointIsWithinSegmentWidth)
  //        {
  //            // CartesianCoordinate is out of horizontal bounds of the segment extents.
  //            continue;
  //        }
  //        bool pointIsWithinSegmentHeight = LineToLineIntersection.PointIsWithinLineHeightInclusive(
  //                                            coordinate.Y,
  //                                            vertexI, vertexJ);
  //        if (LinearCurve.IsHorizontal(vertexI, vertexJ))
  //        {
  //            if (pointIsWithinSegmentHeight)
  //            { // CartesianCoordinate is on horizontal segment
  //                return includePointOnSegment ? 1 : 0;
  //            }
  //            // CartesianCoordinate hits horizontal segment
  //            numberOfIntersections++;
  //            continue;
  //        }
  //        if (LinearCurve.IsVertical(vertexI, vertexJ))
  //        {   // Segment would be parallel to line projection.
  //            // CartesianCoordinate is collinear since it is within segment height
  //            if (pointIsWithinSegmentHeight)
  //            { // CartesianCoordinate is on vertical segment
  //                return includePointOnSegment ? 1 : 0;
  //            }
  //            continue;
  //        }

  //        double yIntersection = LineToLineIntersection.IntersectionPointY(coordinate.X, vertexI, vertexJ);
  //        if (LineToLineIntersection.PointIsBelowSegmentIntersection(coordinate.Y, yIntersection, vertexI, vertexJ))
  //        {
  //            numberOfIntersections++;
  //        }
  //        else if (NMath.Abs(coordinate.Y - yIntersection) < tolerance)
  //        { // CartesianCoordinate is on sloped segment
  //            return includePointOnSegment ? 1 : 0;
  //        }
  //    }
  //    return numberOfIntersections;
  //}



  // #region Within Bounds

  /// <summary>
  /// Determines if the point lies within the segment extents height.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies within the segment extents height, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsWithinSegmentExtentsHeightInclusive(
    yPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return (extents.MinY <= yPtN && yPtN <= extents.MaxY);
  }

  /// <summary>
  /// Determines if the point lies within the segment extents height, not including the boundary locations.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies within the segment extents height, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsWithinSegmentExtentsHeightExclusive(
    yPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return (extents.MinY < yPtN && yPtN < extents.MaxY);
  }


  /// <summary>
  /// Determines if the point lies within the segment extents width.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies within the segment width, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsWithinSegmentExtentsWidthInclusive(
    xPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return (extents.MinX <= xPtN && xPtN <= extents.MaxX);
  }

  /// <summary>
  /// Determines if the point lies within the segment extents width.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies within the segment width, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsWithinSegmentExtentsWidthExclusive(
    xPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return (extents.MinX < xPtN && xPtN < extents.MaxX);
  }




  // #region Left of / Below Potential Intersection
  /// <summary>
  /// Determines if the point lies to the left of the segment extents max x-coordinate.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies to the left of the segment end, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsLeftOfSegmentExtentsEndInclusive(
    xPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return xPtN <= extents.MaxX;
  }

  /// <summary>
  /// Determines if the point lies to the left of the segment extents max x-coordinate, not including the boundary coordinate.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies to the left of the segment end, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsLeftOfSegmentExtentsEndExclusive(
    xPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return xPtN < extents.MaxX;
  }

  /// <summary>
  /// Determines if the point lies below the segment extents end.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies to below the segment bottom, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsBelowSegmentExtentsInclusive(
    yPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return yPtN <= extents.MaxY;
  }

  /// <summary>
  /// Determines if the point lies below the segment extents end.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point lies to below the segment bottom, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsBelowSegmentExtentsExclusive(
    yPtN: number,
    segment: IPathSegment): boolean {
    let extents: PointExtents = segment.Extents;
    return yPtN < extents.MaxY;
  }




  // #region Left of / Below Intersection

  /// <summary>
  /// The x-coordinate of the intersection of the horizontally projected line with the provided segment.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n, where the projection starts.</param>
  /// <param name="segment">The segment.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="System.ArgumentException">Segment is horizontal, so intersection point is either infinity or NAN.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {IPathSegment} segment
 * @returns {number}
 */
  public static IntersectionPointX(
    yPtN: number,
    segment: IPathSegment
  ): number {
    return segment.X(yPtN);
  }


  /// <summary>
  /// Determines if the point is to the left of the horizontally projected segment intersection.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="xIntersection">The x-coordinate of the intersection of the projected line.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point is to the left of the horizontally projected segment intersection, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {number} xIntersection
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsLeftOfSegmentIntersection(
    xPtN: number,
    xIntersection: number,
    segment: IPathSegment): boolean {
    return (xPtN < xIntersection &&
      PointProjection.PointIsWithinSegmentExtentsWidthInclusive(xIntersection, segment));
  }

  /// <summary>
  /// The y-coordinate of the intersection of the vertically projected line with the provided segment.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n, where the projection starts.</param>
  /// <param name="segment">The segment.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="System.ArgumentException">Segment is vertical, so intersection point is either infinity or NAN.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {IPathSegment} segment
 * @returns {number}
 */
  public static IntersectionPointY(
    xPtN: number,
    segment: IPathSegment): number {
    return segment.Y(xPtN);
  }

  /// <summary>
  /// Determines if the point is below the vertically projected segment intersection.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="yIntersection">The y-coordinate of the intersection of the projected line.</param>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if the point is below the vertically projected segment intersection, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {number} yIntersection
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public static PointIsBelowSegmentIntersection(
    yPtN: number,
    yIntersection: number,
    segment: IPathSegment): boolean {
    return (yPtN < yIntersection &&
      PointProjection.PointIsWithinSegmentExtentsHeightInclusive(yIntersection, segment));
  }
}