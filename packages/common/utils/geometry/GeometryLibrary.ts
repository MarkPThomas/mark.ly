/// <summary>
/// Library of operations related to the geometry framework.

import { Generics } from "../math/Generics";
import { Vector } from "../math/Vectors/Vector";
import { LineSegment } from "./Segments/LineSegment";

/// </summary>
export class GeometryLibrary {
  /// <summary>
  /// Default zero tolerance for operations.
  /// </summary>
  static ZeroTolerance: number = 1E-5;

  // #region Vector-Derived

  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the same direction.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsCollinearSameDirection(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsCollinearSameDirection(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a concave angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsConcave(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsConcave(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a 90 degree angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsOrthogonal(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsOrthogonal(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a convex angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsConvex(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsConvex(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  ///  True: Segments are parallel, on the same line, oriented in the opposite direction.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsCollinearOppositeDirection(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsCollinearOppositeDirection(line1.ToVector(), line2.ToVector(), tolerance));
  }



  /// <summary>
  /// True: The concave side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsConcaveInside(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsConcaveInside(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// True: The convex side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  public static IsConvexInside(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(line1, line2, tolerance);
    return (Vector.IsConvexInside(line1.ToVector(), line2.ToVector(), tolerance));
  }





  /// <summary>
  /// Returns a value indicating the concavity of the vectors.
  /// 1 = Pointing the same way.
  /// &gt; 0 = Concave.
  /// 0 = Orthogonal.
  /// &lt; 0 = Convex.
  /// -1 = Pointing the exact opposite way.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  public static ConcavityCollinearity(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().ConcavityCollinearity(line2.ToVector()));
  }

  /// <summary>
  /// Dot product of two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  public static DotProduct(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().DotProduct(line2.ToVector()));
  }

  /// <summary>
  /// Cross-product of two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  public static CrossProduct(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().CrossProduct(line2.ToVector()));
  }

  /// <summary>
  /// Returns the angle [radians] between the two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  public static Angle(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().toAngle(line2.ToVector()));
  }

  /// <summary>
  /// Returns the area between two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  public static Area(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().Area(line2.ToVector()));
  }
}