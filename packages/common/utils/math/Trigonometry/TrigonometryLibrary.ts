import { Numbers } from "../Numbers";

export class TrigonometryLibrary {

  // TODO: Work out if better to call System.Math often with this library, or just encapsulate methods.

  // #region Functions from System.Math

  // #region Sin / Cos / Tan & Arc variations


  /**
   * Returns the sine (opposite/hypotenuse) of the specified angle.
   *
   * @static
   * @param {number} radians The angle in radians.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Sin(radians: number): number {
    return Math.sin(radians);
  }

  /**
   * Returns the cosine (adjacent/hypotenuse) of the specified angle.
   *
   * @static
   * @param {number} radians The angle in radians.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Cos(radians: number): number {
    return Math.cos(radians);
  }


  /**
   * Returns the tangent (opposite/adjacent) of the specified angle.
   *
   * Returns `Infinity` if angle is a multiple of +π/2 or +(3/2)*π (90°/270° counter-clockwise from origin).
   *
   * Returns `-Infinity` if angle is a multiple of -π/2 or -(3/2)*π (90°/270° clockwise from origin).
   *
   * @static
   * @param {number} radians The angle in radians.
   * @param {number} [tolerance=Numbers.ZeroTolerance] Tolerance used for determining `Infinity` conditions.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Tan(radians: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (Numbers.AreEqual(radians, Numbers.PiOver2, tolerance) ||
      Numbers.AreEqual(radians, 3 * Numbers.PiOver2, tolerance)) { return Infinity; } // 90 deg

    if (Numbers.AreEqual(radians, -Numbers.PiOver2, tolerance) ||
      Numbers.AreEqual(radians, -3 * Numbers.PiOver2, tolerance)) { return -Infinity; } // -90 deg

    return Math.tan(radians);
  }


  /**
   *  Returns the angle whose sine is the specified ratio.
   *
   * @static
   * @param {number} ratio The ratio of 'opposite / hypotenuse'.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static ArcSin(ratio: number): number {
    return Math.asin(ratio);
  }

  /**
   * Returns the angle whose cosine is the specified ratio.
   *
   * @static
   * @param {number} ratio The ratio of 'adjacent / hypotenuse'.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static ArcCos(ratio: number): number {
    return Math.acos(ratio);
  }

  /**
   * Returns the angle whose tangent is the specified ratio.
   *
   * @static
   * @param {number} ratio The ratio of 'opposite / adjacent'.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static ArcTan(ratio: number): number {
    return Math.atan(ratio);
  }


  // #region Hyperbolics
  // https://en.wikipedia.org/wiki/Hyperbolic_functions

  /**
   * Returns the hyperbolic sine of the specified angle.
   *
   * @static
   * @param {number} radians The angle in radians.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static SinH(radians: number): number {
    return Math.sinh(radians);
  }

  /**
   *  Returns the hyperbolic cosine of the specified angle.
   *
   * @static
   * @param {number} radians The angle in radians.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static CosH(radians: number): number {
    return Math.cosh(radians);
  }

  /**
   * Returns the hyperbolic tangent of the specified angle.
   *
   * @static
   * @param {number} radians The angle in radians.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static TanH(radians: number): number {
    return Math.tanh(radians);
  }


  // #region Angle / Ratio Methods(Sec, Csc, Cot, etc.)

  /**
   * Returns the secant (hypotenuse/adjacent) of the specified angle.
   *
   * Returns `Infinity` if angle is a multiple of +/- π/2. (90° from origin, regardless of rotation direction)
   *
   * Returns `-Infinity` if 0 or angle is a multiple of +/- (3/2)*π.  (270° from origin, regardless of rotation direction)
   *
   * @static
   * @param {number} radians The angle in radians.
   * @param {number} [tolerance=Numbers.ZeroTolerance] Tolerance used for determining `Infinity` conditions.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Sec(radians: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (Numbers.AreEqual(Math.abs(radians), Numbers.PiOver2, tolerance)) { return Infinity; }   //  +/- 90 deg
    if (Numbers.AreEqual(Math.abs(radians), 3 * Numbers.PiOver2, tolerance)) { return -Infinity; }    // +/- 270 deg

    return 1 / Math.cos(radians);
  }

  /**
   * Returns the cosecant (hypotenuse/opposite) of the specified angle.
   *
   * Returns `Infinity` if 0 or angle is a multiple of +π or -2π. (180° counter-clockwise / 360° clockwise from origin)
   *
   * Returns `-Infinity` if angle is a multiple of -π or +2π. (180° clockwise / 360° counter-clockwise from origin)
   *
   * @static
   * @param {number} radians The angle in radians.
   * @param {number} [tolerance=Numbers.ZeroTolerance] Tolerance used for determining `Infinity` conditions.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Csc(radians: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (Numbers.IsZeroSign(Math.abs(radians))) { return Infinity; }
    if (Numbers.AreEqual(radians, Numbers.Pi, tolerance)) { return Infinity; }       // 180 deg
    if (Numbers.AreEqual(radians, Numbers.TwoPi, tolerance)) { return -Infinity; }    // 360 deg
    if (Numbers.AreEqual(radians, -Numbers.Pi, tolerance)) { return -Infinity; }      // -180 deg
    if (Numbers.AreEqual(radians, -Numbers.TwoPi, tolerance)) { return Infinity; }   // -360 deg

    return 1 / Math.sin(radians);
  }

  /**
   * Returns the cotangent (adjacent/opposite) of the specified angle.
   *
   * Returns `Infinity` if 0 or angle is a multiple of -π or -2π. (180°/360° clockwise from origin)
   *
   * Returns `-Infinity` if angle is a multiple of +π or +2π. (180°/360° counter-clockwise from origin)
   *
   * @static
   * @param {number} radians The angle in radians.
   * @param {number} [tolerance=Numbers.ZeroTolerance] Tolerance used for determining `Infinity` conditions.
   * @return {*}  {number}
   * @memberof TrigonometryLibrary
   */
  public static Cot(radians: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (Numbers.IsZeroSign(Math.abs(radians))) { return Infinity; }
    if (Numbers.AreEqual(radians, Numbers.Pi, tolerance)) { return -Infinity; }       // 180 deg
    if (Numbers.AreEqual(radians, Numbers.TwoPi, tolerance)) { return -Infinity; }    // 360 deg
    if (Numbers.AreEqual(radians, -Numbers.Pi, tolerance)) { return Infinity; }      // -180 deg
    if (Numbers.AreEqual(radians, -Numbers.TwoPi, tolerance)) { return Infinity; }   // -360 deg

    return 1 / Math.tan(radians);
  }
}