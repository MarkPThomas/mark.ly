import { ArgumentException } from "common/errors/exceptions";

import { CartesianCoordinate } from "@markpthomas/math/Coordinates/CartesianCoordinate";
import { LinearCurve } from "@markpthomas/math/Curves/LinearCurve";
import { Numbers } from "@markpthomas/math/Numbers";

import { GeometryLibrary } from "../GeometryLibrary";
import { LineSegment } from "../Segments/LineSegment";
import { PointIntersection } from "./PointIntersection";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @class LineToLineIntersection
 * @typedef {LineToLineIntersection}
 */
export class LineToLineIntersection {
  // #region Methods: Static (Using Points)
  // #region Number of Intersections


  /// <summary>
  /// The numbers of shape boundary intersections a horizontal line makes when projecting to the right from the provided point.
  /// An odd number indicates the point is inside the shape.
  /// An even number indicates the point is outside the shape.
  /// If the point is on a vertex or segment, the function returns 0.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="shapeBoundary">The shape boundary composed of n points.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Int32.</returns>
  /// <exception cref="System.ArgumentException">Shape boundary describes a shape. Closure to the shape boundary is needed.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {CartesianCoordinate[]} shapeBoundary
 * @param {number} [tolerance=GeometryLibrary.ZeroTolerance]
 * @returns {number}
 */
  public static NumberOfIntersectionsOnHorizontalProjection(
    coordinate: CartesianCoordinate,
    shapeBoundary: CartesianCoordinate[],
    tolerance: number = GeometryLibrary.ZeroTolerance
  ): number {
    if (!(shapeBoundary[0].equals(shapeBoundary[shapeBoundary.length - 1]))) {
      throw new ArgumentException("Shape boundary describes a shape. Closure to the shape boundary is needed.");
    }

    // 1. Check horizontal line projection from a pt. n to the right
    // 2. Count # of intersections of the line with shape edges

    let currentNumberOfIntersections = 0;
    for (let i = 0; i < shapeBoundary.length - 1; i++) {
      const vertexI = shapeBoundary[i];
      if (PointIntersection.IsOnPoint(coordinate, vertexI)) {   // Pt lies on vertex
        return 0;
      }

      const vertexJ = shapeBoundary[i + 1];
      const segment = new LineSegment(vertexI, vertexJ);
      if (segment.IncludesCoordinate(coordinate)) {   // Pt lies on boundary
        return 0;
      }

      if (!LineToLineIntersection.PointIsLeftOfLineEndInclusive(coordinate.X, vertexI, vertexJ)) {
        // Pt is to the right of the line segment.
        continue;
      }

      if (!LineToLineIntersection.PointIsWithinLineHeightInclusive(coordinate.Y, vertexI, vertexJ)) {
        // Pt is out of vertical bounds of the line segment.
        continue;
      }

      const segmentCurve = segment.Curve;
      if (segmentCurve.IsHorizontal()) {   // Projection is tangent to segment
        continue;
      }

      if (this.pointHorizontalProjectionIntersectsVertex(coordinate, vertexI)) {
        // Projection hits vertex at point I. Do offset check on current segment
        if (this.slopeIsDownwardBetweenCoordinates(vertexI, vertexJ, tolerance)) {
          continue;
        }
        currentNumberOfIntersections++;
        continue;
      }
      if (this.pointHorizontalProjectionIntersectsVertex(coordinate, vertexJ)) {
        // Projection hits vertex at point J. Do offset check on current segment
        if (this.slopeIsDownwardBetweenCoordinates(vertexJ, vertexI, tolerance)) {
          continue;
        }
        currentNumberOfIntersections++;
        continue;
      }

      if (segmentCurve.IsVertical()) {   // Projection hits vertical segment
        currentNumberOfIntersections++;
        continue;
      }

      currentNumberOfIntersections += this.numberOfIntersectionsHorizontal(coordinate, vertexI, vertexJ);
    }
    return currentNumberOfIntersections;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @private
 * @static
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @param {number} [tolerance=GeometryLibrary.ZeroTolerance]
 * @returns {boolean}
 */
  private static slopeIsDownwardBetweenCoordinates(
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate,
    tolerance: number = GeometryLibrary.ZeroTolerance
  ): boolean {
    return Numbers.IsLessThan(ptJ.Y, ptI.Y, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @private
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {CartesianCoordinate} vertexI
 * @param {CartesianCoordinate} vertexJ
 * @returns {number}
 */
  private static numberOfIntersectionsHorizontal(
    coordinate: CartesianCoordinate,
    vertexI: CartesianCoordinate,
    vertexJ: CartesianCoordinate
  ): number {
    const xIntersection = LineToLineIntersection.IntersectionPointX(coordinate.Y, vertexI, vertexJ);
    return LineToLineIntersection.PointIsLeftOfSegmentIntersection(coordinate.X, xIntersection, vertexI, vertexJ) ? 1 : 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @private
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {CartesianCoordinate} vertex
 * @param {number} [tolerance=GeometryLibrary.ZeroTolerance]
 * @returns {boolean}
 */
  private static pointHorizontalProjectionIntersectsVertex(
    coordinate: CartesianCoordinate,
    vertex: CartesianCoordinate,
    tolerance: number = GeometryLibrary.ZeroTolerance
  ): boolean {
    return (Numbers.IsEqualTo(coordinate.Y, vertex.Y, tolerance) &&
      Numbers.IsLessThan(coordinate.X, vertex.X, tolerance));
  }

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


  // #region Within Bounds(Points)


  /// <summary>
  /// Determines if the point lies within the straight line height.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="ptI">The vertex i.</param>
  /// <param name="ptJ">The vertex j.</param>
  /// <returns><c>true</c> if the point lies within the segment extents height, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsWithinLineHeightInclusive(
    yPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (Math.min(ptI.Y, ptJ.Y) <= yPtN && yPtN <= Math.max(ptI.Y, ptJ.Y));
  }

  /// <summary>
  /// Determines if the point lies within the straight line height, not including the vertex locations.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="ptI">The vertex i.</param>
  /// <param name="ptJ">The vertex j.</param>
  /// <returns><c>true</c> if the point lies within the segment extents height, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsWithinLineHeightExclusive(
    yPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (Math.min(ptI.Y, ptJ.Y) < yPtN && yPtN < Math.max(ptI.Y, ptJ.Y));
  }

  /// <summary>
  /// Determines if the point lies within the straight line width.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="ptI">The vertex i.</param>
  /// <param name="ptJ">The vertex j.</param>
  /// <returns><c>true</c> if the point lies within the segment width, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsWithinLineWidthInclusive(
    xPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (Math.min(ptI.X, ptJ.X) <= xPtN && xPtN <= Math.max(ptI.X, ptJ.X));
  }

  /// <summary>
  /// Determines if the point lies within the straight line width.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="ptI">The vertex i.</param>
  /// <param name="ptJ">The vertex j.</param>
  /// <returns><c>true</c> if the point lies within the segment width, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsWithinLineWidthExclusive(
    xPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (Math.min(ptI.X, ptJ.X) < xPtN && xPtN < Math.max(ptI.X, ptJ.X));
  }


  // #region Left of / Below Potential Intersection(Points)

  /// <summary>
  /// Determines if the point lies to the left of the straight line end.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="ptI">Vertex i.</param>
  /// <param name="ptJ">Vertex j.</param>
  /// <returns><c>true</c> if the point lies to the left of the straight line end, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsLeftOfLineEndInclusive(
    xPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return xPtN <= Math.max(ptI.X, ptJ.X);
  }

  /// <summary>
  /// Determines if the point lies to the left of the straight line end, not including the vertex locations..
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="ptI">Vertex i.</param>
  /// <param name="ptJ">Vertex j.</param>
  /// <returns><c>true</c> if the point lies to the left of the straight line end, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsLeftOfLineEndExclusive(
    xPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return xPtN < Math.max(ptI.X, ptJ.X);
  }

  /// <summary>
  /// Determines if the point lies below the straight line end.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="ptI">Vertex i.</param>
  /// <param name="ptJ">Vertex j.</param>
  /// <returns><c>true</c> if the point lies to below the segment bottom, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsBelowLineBottomInclusive(
    yPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return yPtN <= Math.max(ptI.Y, ptJ.Y);
  }

  /// <summary>
  /// Determines if the point lies below the straight line end.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="ptI">Vertex i.</param>
  /// <param name="ptJ">Vertex j.</param>
  /// <returns><c>true</c> if the point lies to below the segment bottom, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsBelowLineBottomExclusive(
    yPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return yPtN < Math.max(ptI.Y, ptJ.Y);
  }




  // #region Left of / Below Intersection(Points)

  /// <summary>
  /// Determines if the point is to the left of the horizontally projected segment intersection.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n.</param>
  /// <param name="xIntersection">The x-coordinate of the intersection of the projected line.</param>
  /// <param name="vertexI">The vertex i.</param>
  /// <param name="vertexJ">The vertex j.</param>
  /// <returns><c>true</c> if the point is to the left of the horizontally projected segment intersection, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {number} xIntersection
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsLeftOfSegmentIntersection(
    xPtN: number,
    xIntersection: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (xPtN < xIntersection &&
      LineToLineIntersection.PointIsWithinLineWidthInclusive(xIntersection, ptI, ptJ));
  }

  /// <summary>
  /// Determines if the point is below the vertically projected segment intersection.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n.</param>
  /// <param name="yIntersection">The y-coordinate of the intersection of the projected line.</param>
  /// <param name="vertexI">The vertex i.</param>
  /// <param name="vertexJ">The vertex j.</param>
  /// <returns><c>true</c> if the point is below the vertically projected segment intersection, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {number} yIntersection
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {boolean}
 */
  public static PointIsBelowSegmentIntersection(
    yPtN: number,
    yIntersection: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): boolean {
    return (yPtN < yIntersection &&
      LineToLineIntersection.PointIsWithinLineHeightInclusive(yIntersection, ptI, ptJ));
  }

  /// <summary>
  /// The x-coordinate of the intersection of the horizontally projected line with the provided segment.
  /// </summary>
  /// <param name="yPtN">The y-coordinate of pt n, where the projection starts.</param>
  /// <param name="ptI">Vertex i of the segment.</param>
  /// <param name="ptJ">Vertex j of the segment.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} yPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {number}
 */
  public static IntersectionPointX(
    yPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): number {
    if (LinearCurve.PtsHorizontal(ptI, ptJ)) {
      throw new ArgumentException("Segment is horizontal, so intersection point is either infinity or NAN.");
    }

    const curve = new LinearCurve(ptI, ptJ);
    return curve.XatY(yPtN);
  }

  /// <summary>
  /// The y-coordinate of the intersection of the vertically projected line with the provided segment.
  /// </summary>
  /// <param name="xPtN">The x-coordinate of pt n, where the projection starts.</param>
  /// <param name="ptI">Vertex i of the segment.</param>
  /// <param name="ptJ">Vertex j of the segment.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {number} xPtN
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @returns {number}
 */
  public static IntersectionPointY(
    xPtN: number,
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate
  ): number {
    if (LinearCurve.PtsVertical(ptI, ptJ)) {
      throw new ArgumentException("Segment is vertical, so intersection point is either infinity or NAN.");
    }

    const curve = new LinearCurve(ptI, ptJ);
    return curve.YatX(xPtN);
  }
}