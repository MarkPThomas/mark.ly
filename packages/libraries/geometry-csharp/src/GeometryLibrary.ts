import { Generics } from "@markpthomas/math";
import { Vector } from "@markpthomas/math/Vectors";

import { LineSegment } from "./Segments/LineSegment";

/// </summary>
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @export
 * @class GeometryLibrary
 * @typedef {GeometryLibrary}
 */
export class GeometryLibrary {
  /// <summary>
  /// Default zero tolerance for operations.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @static
 * @type {number}
 */
  static ZeroTolerance: number = 1E-5;

  // #region Vector-Derived

  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the same direction.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsCollinearSameDirection(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreCollinearSameDirection(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a concave angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsConcave(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreConcave(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a 90 degree angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsOrthogonal(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreOrthogonal(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// Vectors form a convex angle.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsConvex(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreConvex(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  ///  True: Segments are parallel, on the same line, oriented in the opposite direction.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsCollinearOppositeDirection(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreCollinearOppositeDirection(line1.ToVector(), line2.ToVector(), tolerance));
  }



  /// <summary>
  /// True: The concave side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsConcaveInside(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreConcaveInside(line1.ToVector(), line2.ToVector(), tolerance));
  }

  /// <summary>
  /// True: The convex side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @param {number} [tolerance=this.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsConvexInside(
    line1: LineSegment,
    line2: LineSegment,
    tolerance: number = this.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(line1, line2, tolerance);
    return (Vector.AreConvexInside(line1.ToVector(), line2.ToVector(), tolerance));
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @returns {number}
 */
  public static ConcavityCollinearity(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().ConcavityCollinearity(line2.ToVector()));
  }

  /// <summary>
  /// Dot product of two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @returns {number}
 */
  public static DotProduct(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().DotProduct(line2.ToVector()));
  }

  /// <summary>
  /// Cross-product of two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @returns {number}
 */
  public static CrossProduct(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().CrossProduct(line2.ToVector()));
  }

  /// <summary>
  /// Returns the angle [radians] between the two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @returns {number}
 */
  public static Angle(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().toAngle(line2.ToVector()));
  }

  /// <summary>
  /// Returns the area between two vectors.
  /// </summary>
  /// <param name="line1"></param>
  /// <param name="line2"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @static
 * @param {LineSegment} line1
 * @param {LineSegment} line2
 * @returns {number}
 */
  public static Area(line1: LineSegment, line2: LineSegment): number {
    return (line1.ToVector().Area(line2.ToVector()));
  }
}