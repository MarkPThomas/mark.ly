import { ArgumentException } from "@markpthomas/common-libraries/exceptions";

import { AlgebraLibrary } from "../algebra/AlgebraLibrary";
import { Numbers } from "../Numbers";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @type {{ Magnitude(xComponent: number, yComponent: number, tolerance?: number): number; DotProduct(x1: number, y1: number, x2: number, y2: number): number; CrossProduct(x1: number, y1: number, x2: number, y2: number): number; Magnitude3D(xComponent: number, yComponent: number, zComponent: number, tolerance?: number): numbe...}
 */
export const VectorLibrary = {
  // === 2D Vectors
  /// <summary>
  /// Gets the magnitude from parametric vector components.
  /// </summary>
  /// <param name="xComponent">The x component.</param>
  /// <param name="yComponent">The y component.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
  Magnitude(
    xComponent: number, yComponent: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    const magnitude = AlgebraLibrary.SRSS(xComponent, yComponent);
    return validatedMagnitude(magnitude, tolerance);
  },

  /// <summary>
  /// Returns the dot product of parametric vector components.
  /// x1*x2 + y1*y2
  /// </summary>
  /// <param name="x1">The x component of the first vector.</param>
  /// <param name="y1">The y component of the first vector.</param>
  /// <param name="x2">The x component of the second vector.</param>
  /// <param name="y2">The y component of the second vector.</param>
  /// <returns>System.Double.</returns>
  DotProduct(
    x1: number, y1: number,
    x2: number, y2: number
  ): number {
    return (x1 * x2 + y1 * y2);
  },

  /// <summary>
  /// Returns the cross product/determinant of parametric vector components.
  /// x1*y2 - x2*y1
  /// </summary>
  /// <param name="x1">The x component of the first vector.</param>
  /// <param name="y1">The y component of the first vector.</param>
  /// <param name="x2">The x component of the second vector.</param>
  /// <param name="y2">The y component of the second vector.</param>
  /// <returns>System.Double.</returns>
  CrossProduct(
    x1: number, y1: number,
    x2: number, y2: number
  ): number {
    return ((x1 * y2) - (y1 * x2));
  },

  // === 3D Vectors

  /// <summary>
  /// Gets the magnitude from parametric vector components.
  /// </summary>
  /// <param name="xComponent">The x component.</param>
  /// <param name="yComponent">The y component.</param>
  /// <param name="zComponent">The z component.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
  Magnitude3D(
    xComponent: number, yComponent: number, zComponent: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    const magnitude = AlgebraLibrary.SRSS(xComponent, yComponent, zComponent);
    return validatedMagnitude(magnitude, tolerance);
  },

  /// <summary>
  /// Returns the dot product of the points.
  /// </summary>
  /// <param name="x1">The x component of the first vector.</param>
  /// <param name="y1">The y component of the first vector.</param>
  /// <param name="z1">The z component of the first vector.</param>
  /// <param name="x2">The x component of the second vector.</param>
  /// <param name="y2">The y component of the second vector.</param>
  /// <param name="z2">The z component of the second vector.</param>
  /// <returns>System.Double.</returns>
  DotProduct3D(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number
  ): number {
    return (x1 * x2 + y1 * y2 + z1 * z2);
  },


  /// <summary>
  /// Returns the cross product/determinant of the points.
  /// </summary>
  /// <param name="x1">The x component of the first vector.</param>
  /// <param name="y1">The y component of the first vector.</param>
  /// <param name="z1">The z component of the first vector.</param>
  /// <param name="x2">The x component of the second vector.</param>
  /// <param name="y2">The y component of the second vector.</param>
  /// <param name="z2">The z component of the second vector.</param>
  /// <returns>System.Double.</returns>
  CrossProduct3D(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number
  ): number[] {
    const x = (y1 * z2) - (z1 * y2);
    const y = (z1 * x2) - (x1 * z2);
    const z = (x1 * y2) - (y1 * x2);

    const matrix = [x, y, z];

    return matrix;
  }
}

/// <summary>
/// Validateds the magnitude.
/// </summary>
/// <param name="magnitude">The magnitude.</param>
/// <param name="tolerance">The tolerance.</param>
/// <returns>System.Double.</returns>
/// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
*/
const validatedMagnitude = (magnitude: number, tolerance: number = Numbers.ZeroTolerance): number => {
  if (Numbers.IsZeroSign(magnitude, tolerance)) { throw new ArgumentException("Ill-formed vector. Vector magnitude cannot be zero."); }
  return magnitude;
}