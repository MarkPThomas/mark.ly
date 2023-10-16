// TODO: Quadratic formula from object
// TODO: Summation from object & strategy pattern

import { ArgumentException, ArgumentOutOfRangeException } from "../../../errors/exceptions";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { Numbers } from "../Numbers";

/// <summary>
/// Contains static methods for common algebraic operations.
/// </summary>
export class AlgebraLibrary {
  // ===  Solutions to Formulas

  /**
   * Returns the 2 x solutions to the equation ax^2 + bx + c = 0.
   *
   * @static
   * @param {number} a Multiplier to x^2.
   * @param {number} b Multiplier to x.
   * @param {number} c Constant.
   * @return {*}  {number[]}
   * @memberof AlgebraLibrary
   */
  public static QuadraticFormula(a: number, b: number, c: number): number[] {
    if (Numbers.IsZeroSign(a)) { throw new ArgumentException("Argument 'a' cannot be 0"); }

    const denominator = 2 * a;
    const operand1 = -b / denominator;
    const operand2Sqrt = Numbers.Squared(b) - 4 * a * c;
    if (Numbers.IsNegativeSign(operand2Sqrt)) { throw new ArgumentException("'b^2 - 4 * a * c' cannot be negative"); }

    const operand2 = Numbers.Sqrt(operand2Sqrt) / denominator;

    return Numbers.PlusMinus(operand1, operand2);
  }

  /**
   * Returns the least positive solution to the equation ax^3 + bx^2 + cx + d = 0.
   *
   * From: https://mathworld.wolfram.com/CubicFormula.html
   * @static
   * @param {number} a Multiplier to x^3.
   * @param {number} b Multiplier to x^2.
   * @param {number} c Multiplier to x.
   * @param {number} d Constant.
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  public static CubicCurveLowestRoot(a: number, b: number, c: number, d: number): number {
    const a2 = b / a;
    const a1 = c / a;
    const a0 = d / a;

    const B = (9 * a1 * a2 - 27 * a0 - 2 * Numbers.Cubed(a2)) / 27;

    return this.cubicCurveLeastRootNormalized(a0, a1, a2, B);
  }

  /**
   * Returns the least positive solution to the equation x^3 + a2x^2 + a1x + a0 = 0.
   *
   * @private
   * @static
   * @param {number} a0 The a0.
   * @param {number} a1 Multiplier to x^2.
   * @param {number} a2 Multiplier to x.
   * @param {number} B Derived constant.
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  private static cubicCurveLeastRootNormalized(a0: number, a1: number, a2: number, B: number): number {
    const A = (1 / 3) * (3 * a1 - Numbers.Pow(a2, 2));
    const tSqrt = Numbers.Squared(B) + (4 / 27) * Numbers.Cubed(A);

    if (Numbers.IsNegativeSign(B) || Numbers.IsNegativeSign(tSqrt)) {
      return Numbers.Min(...this.cubicCurveRootsNormalized(a0, a1, a2, true));
    }
    const t = Numbers.CubeRoot(0.5 * (-B + Numbers.Sqrt(tSqrt)));

    return Numbers.CubeRoot(B + Numbers.Cubed(t)) - t - a2 / 3;
  }


  /**
   * Returns the 3 'x' solutions to the equation ax^3 + bx^2 + cx + d = 0.
   *
   * From: https://mathworld.wolfram.com/CubicFormula.html
   *
   * @static
   * @param {number} a Multiplier to x^3.
   * @param {number} b Multiplier to x^2.
   * @param {number} c Multiplier to x.
   * @param {number} d Constant.
   * @return {*}  {numbers[]}
   * @memberof AlgebraLibrary
   */
  public static CubicCurveRoots(a: number, b: number, c: number, d: number): number[] {
    const a2 = b / a;
    const a1 = c / a;
    const a0 = d / a;

    return this.cubicCurveRootsNormalized(a0, a1, a2);
  }


  /**
   * Returns the 3 'x' solutions to the equation x^3 + a2*x^2 + a1*x + a0 = 0.
   *
   * @private
   * @static
   * @param {number} a0 Constant.
   * @param {number} a1 Multiplier to x.
   * @param {number} a2 Multiplier to x^2.
   * @param {boolean} [returnFirstRoot=false] if set to `true` [return first root]
   * @return {*}  {number[]}
   * @memberof AlgebraLibrary
   */
  private static cubicCurveRootsNormalized(a0: number, a1: number, a2: number, returnFirstRoot: boolean = false): number[] {
    const Q = (3 * a1 - Numbers.Squared(a2)) / 9;
    const R = (9 * a2 * a1 - 27 * a0 - 2 * Numbers.Cubed(a2)) / 54;
    const D = Numbers.Cubed(Q) + Numbers.Squared(R);
    const aCosRatio = R / Numbers.Sqrt(Math.abs(-Numbers.Cubed(Q)));

    let x1;

    if ((returnFirstRoot && Numbers.IsGreaterThanOrEqualTo(D, 0)) ||
      (Numbers.IsLessThan(aCosRatio, -1) || Numbers.IsGreaterThan(aCosRatio, 1))) {
      const S = Numbers.CubeRoot(R + Numbers.Sqrt(D));
      const T = Numbers.CubeRoot(R - Numbers.Sqrt(D));
      x1 = (S + T) - (1 / 3) * a2;

      return [x1];
    }

    const theta = Math.acos(aCosRatio);

    x1 = 2 * Numbers.Sqrt((Math.abs(-Q))) * Math.cos(theta / 3) - a2 / 3;
    const x2 = 2 * Numbers.Sqrt(Math.abs(-Q)) * Math.cos((theta + 2 * Numbers.Pi) / 3) - a2 / 3;
    const x3 = 2 * Numbers.Sqrt(Math.abs(-Q)) * Math.cos((theta + 4 * Numbers.Pi) / 3) - a2 / 3;

    return [x1, x2, x3];
  }



  // === Interpolations

  /**
   * Interpolates linearly between two values.
   *
   * @static
   * @param {number} value1
   * @param {number} value2
   * @param {number} value2Weight The weight applied to the difference between `value1` and `value2`. 0 &lt;= `value2Weight` &lt;= 1
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for determining if a weight lies within the inclusive range of 0 to 1.
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  public static InterpolationLinear<T = number | CartesianCoordinate>(
    value1: T,
    value2: T,
    value2Weight: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number | CartesianCoordinate {
    if (!Numbers.IsWithinInclusive(value2Weight, 0, 1, tolerance)) {
      throw new ArgumentOutOfRangeException(`Weight must be between 0 and 1. Weight provided was ${value2Weight}`);
    }

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 + (value2 - value1) * value2Weight;
    } else {
      const point1 = (value1 as unknown as CartesianCoordinate);
      const point2 = (value2 as unknown as CartesianCoordinate);
      return point1.addTo(point2.subtractBy(point1).multiplyBy(value2Weight));
    }
  }

  /**
   * Lineary interpolates across a 2D plane to return an interpolated third dimensional value.
   *
   * Expected to be used for table interpolation, where x-axis are the columns, and y-axis are the rows.
   *
   * @static
   * @param {CartesianCoordinate} Po The point in the plane to get the corresponding magnitude of.
   * @param {CartesianCoordinate} ii Point ii (closest to the origin), where `iiValue` is the corresponding value.
   * @param {CartesianCoordinate} jj Point jj (farthest from the origin), where `jjValue` is the corresponding value.
   * @param {number} iiValue The value at point ii, which is closest to the origin.
   * @param {number} ijValue The value at point ij, which is in line with point ii but farthest along the x-axis (columns).
   * @param {number} jiValue The value at point ji, which is in line with point ii but farthest along the y-axis (rows).
   * @param {number} jjValue The value at point jj, which is farthest from the origin.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for determining if a weight lies within the boundaries of the values being interpolated.
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  public static InterpolationLinear2D(
    Po: CartesianCoordinate,
    ii: CartesianCoordinate,
    jj: CartesianCoordinate,
    iiValue: number,
    ijValue: number,
    jiValue: number,
    jjValue: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (Numbers.AreEqual(ii.X, jj.X, tolerance)) {
      throw new ArgumentException(`Different columns must be chosen: Column ii = Column jj = ${ii.X}`);
    }
    if (Numbers.AreEqual(ii.Y, jj.Y, tolerance)) {
      throw new ArgumentException(`Different rows must be chosen: Row ii = Row jj = ${ii.Y}`);
    }
    if (!Numbers.IsWithinInclusive(Po.X, ii.X, jj.X, tolerance)
      || !Numbers.IsWithinInclusive(Po.Y, ii.Y, jj.Y, tolerance)) {
      throw new ArgumentOutOfRangeException(
        `Point (${Po.X}, ${Po.Y}) must lie within the bounds of values to interpolate within, (${ii.X}, ${ii.Y}), (${jj.X}, ${jj.Y})`
      );
    }

    const Wii = (Po.X - ii.X) * (Po.Y - ii.Y);
    const Wij = (jj.X - Po.X) * (Po.Y - ii.Y);
    const Wji = (Po.X - ii.X) * (jj.Y - Po.Y);
    const Wjj = (jj.X - Po.X) * (jj.Y - Po.Y);
    const Ao = (jj.X - ii.X) * (jj.Y - ii.Y);

    return (iiValue * Wjj + ijValue * Wji + jiValue * Wij + jjValue * Wii) / Ao;
  }


  ///// <summary>
  ///// Interpolates the polynomial.
  ///// From: https://en.wikipedia.org/wiki/Polynomial_interpolation
  ///// </summary>
  ///// <param name="points">The points.</param>
  ///// <param name="amount">The amount.</param>
  ///// <returns>System.Double.</returns>
  //public static double InterpolationPolynomial(CartesianCoordinate[] points,
  //                                             double amount)
  //{
  //    // TODO: Use Lagrange polynomials:
  //    // https://en.wikipedia.org/wiki/Polynomial_interpolation
  //    // Consider making object in order to follow curve
  //    throw new NotImplementedException();
  //}



  // === Intersections

  /**
   * X-coordinate of a horizontal line intersecting the line described by the points provided.
   *
   * @static
   * @param {number} y Y-coordinate of the horizontal line.
   * @param {ICartesianCoordinate} I First point.
   * @param {ICartesianCoordinate} J Second point.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  public static IntersectionXCoordinates(
    y: number,
    I: CartesianCoordinate,
    J: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return AlgebraLibrary.IntersectionX(y, I.X, I.Y, J.X, J.Y, tolerance);
  }


  /**
   * X-coordinate of a horizontal line intersecting the line described by the points provided.
   *
   * @static
   * @param {number} y Y-coordinate of the horizontal line.
   * @param {number} x1 X-coordinate of first point.
   * @param {number} y1 Y-coordinate of first point.
   * @param {number} x2 X-coordinate of second point.
   * @param {number} y2 Y-coordinate of second point.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {number}
   * @memberof AlgebraLibrary
   */
  public static IntersectionX(
    y: number,
    x1: number, y1: number,
    x2: number, y2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (Numbers.AreEqual(x1, x2, tolerance) && Numbers.AreEqual(y1, y2, tolerance)) {
      throw new ArgumentException("Identical points provided. Points need to define a line.");
    }
    if (Numbers.AreEqual(y1, y2, tolerance)) // Horizontal line
    {
      if (Numbers.AreEqual(y, y1, tolerance)) // Collinear line
      {
        throw new ArgumentException("Line is collinear to horizontal projection.");
      }
      throw new ArgumentException("Line is parallel to horizontal projection.");
    }
    return ((((y - y1) * (x2 - x1)) / (y2 - y1)) + x1);
  }



  // === Calcs

  /// <summary>
  /// Performs the square root of the sum of the squares of the provided values.
  /// </summary>
  /// <param name="values">The values.</param>
  /// <returns>System.Double.</returns>
  public static SRSS(...values: number[]): number {
    let sumOfSquares = 0;
    values.forEach((value) => {
      sumOfSquares += Numbers.Squared(value);
    });

    return Math.sqrt(sumOfSquares);
  }

  // TODO: Work out if better to call System.Math often with this library, or just encapsulate methods.
  //#region Functions from System.Math
  //public static double Abs(double a)
  //{
  //    return NMath.Abs(a);
  //}

  //public static int Abs(int a)
  //{
  //    return NMath.Abs(a);
  //}
}