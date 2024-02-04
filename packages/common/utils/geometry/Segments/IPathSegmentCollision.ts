import { CartesianCoordinate } from "../../math/Coordinates/CartesianCoordinate";
import { Curve } from "../../math/Curves/Curve";
import { IPathSegment } from "./IPathSegment";

export interface IPathSegmentCollision<T extends Curve> {
  /// <summary>
  /// Gets the curve.
  /// </summary>
  /// <value>The curve.</value>
  Curve: T;

  /// <summary>
  /// Provided point lies on the line segment between or on the defining points.
  /// </summary>
  /// <param name="point"></param>
  /// <returns></returns>
  IncludesCoordinate(point: CartesianCoordinate): boolean;

  /// <summary>
  /// Provided line segment intersects the line segment between or on the defining points.
  /// </summary>
  /// <param name="otherLine"></param>
  /// <returns></returns>
  IsIntersecting(otherLine: IPathSegment): boolean;

  /// <summary>
  /// Returns a point where the line segment intersects the provided line segment.
  /// </summary>
  /// <param name="otherLine">Line segment that intersects the current line segment.</param>
  /// <returns></returns>
  IntersectionCoordinate(otherLine: IPathSegment): CartesianCoordinate;
}