import { IEquatable, IComparable } from "@markpthomas/common-libraries/interfaces";
import { DivideByZeroException } from "@markpthomas/common-libraries/exceptions";

import { Generics } from "../Generics";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { TrigonometryLibrary as Trig } from '../trigonometry/TrigonometryLibrary';
import { Vector } from "../vectors/Vector";

import { CartesianCoordinate } from "./CartesianCoordinate";
import { AngularOffset } from "./AngularOffset";

/**
 * Represents an Angle based on a radian value.
 *
 * @export
 * @class Angle
 * @implements {IEquatable<Angle>}
 * @implements {IComparable<Angle>}
 * @implements {ITolerance}
 */
export class Angle implements IEquatable<Angle>, IComparable<Angle>, ITolerance {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  readonly Tolerance: number;

  /// <summary>
  /// The raw angle as radians, without any modifications done.
  /// </summary>
  /// <value>The radians raw.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  readonly RadiansRaw: number;

  /// <summary>
  /// The raw angle as degrees, without any modifications done.
  /// </summary>
  /// <value>The degrees raw.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  get DegreesRaw() { return Angle.RadiansToDegrees(this.RadiansRaw) }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 */
  ;


  /// <summary>
  /// The angle as radians, which is a value between -π (clockwise) and +π (counter-clockwise).
  /// </summary>
  /// <value>The radians.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  readonly Radians: number;

  /// <summary>
  /// The angle as clockwise (inverted) radians, which is a value between -π (counter-clockwise) and +π (clockwise).
  /// </summary>
  /// <value>The clockwise radians.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  get ClockwiseRadians() { return -this.Radians; }

  /// <summary>
  /// The angle as degrees, which is a value between -180 (clockwise) and +180 (counter-clockwise).
  /// </summary>
  /// <value>The degree.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  get Degrees() { return Angle.RadiansToDegrees(this.Radians) }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 */
  ;

  /// <summary>
  /// The angle as clockwise (inverted) degrees, which is a value between -180 (counter-clockwise) and +180 (clockwise).
  /// </summary>
  /// <value>The clockwise degree.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @readonly
 * @type {number}
 */
  get ClockwiseDegrees() { return Angle.RadiansToDegrees(-this.Radians) }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 */
  ;


  /// <summary>
  /// Initializes a new instance of the <see cref="Angle" /> struct.
  /// </summary>
  /// <param name="radians">The radian value of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /**
 * Creates an instance of Angle.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {number} [radians=0]
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 */
  constructor(
    radians: number = 0,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.RadiansRaw = radians;
    this.Radians = Angle.WrapAngleWithinPositiveNegativePi(radians);
    this.Tolerance = tolerance;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @returns {Angle}
 */
  static atOrigin() {
    return new Angle(0);
  }

  /// <summary>
  /// Creates an <see cref="Angle" /> from a radian value.
  /// </summary>
  /// <param name="radians">The radian value of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /// <returns>Angle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} radians
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {Angle}
 */
  static fromRadians(
    radians: number,
    tolerance: number = Numbers.ZeroTolerance
  ): Angle {
    return new Angle(radians, tolerance);
  }

  /// <summary>
  /// Creates an <see cref="Angle" /> from a degree value.
  /// </summary>
  /// <param name="degrees">The degree value of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /// <returns>Angle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} degrees
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {Angle}
 */
  static fromDegrees(
    degrees: number,
    tolerance: number = Numbers.ZeroTolerance
  ): Angle {
    return new Angle(Angle.DegreesToRadians(degrees), tolerance);
  }

  /// <summary>
  /// Creates an <see cref="Angle" /> from a direction vector.
  /// </summary>
  /// <param name="direction">The direction vector of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /// <returns>Angle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {Vector} direction
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {Angle}
 */
  static CreateFromVector(
    direction: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): Angle {
    return new Angle(Angle.AsRadians(direction.Xcomponent, direction.Ycomponent), tolerance);
  }

  /// <summary>
  /// Creates an Angle from a point.
  /// The angle is assumed to lie between the origin, point, and positive horizontal axis.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <returns>Angle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {CartesianCoordinate} point
 * @returns {Angle}
 */
  static CreateFromPoint(point: CartesianCoordinate): Angle {
    const vector = Vector.fromCoords(CartesianCoordinate.atOrigin(), point);
    return vector.Angle();
  }

  /// <summary>
  /// Creates an Angle from two points.
  /// The angle is assumed to lie between the line formed by the two points, and the positive horizontal axis.
  /// </summary>
  /// <param name="point1">The first point.</param>
  /// <param name="point2">The second point.</param>
  /// <returns>Angle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @returns {Angle}
 */
  static CreateFromPoints(point1: CartesianCoordinate, point2: CartesianCoordinate): Angle {
    const vector = Vector.fromCoords(point1, point2);
    return vector.Angle();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} radians
 * @returns {number}
 */
  static RadiansToDegrees(radians: number): number {
    return radians * (180 / Numbers.Pi);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} degrees
 * @returns {number}
 */
  static DegreesToRadians(degrees: number): number {
    return degrees * (Numbers.Pi / 180);
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {CartesianCoordinate} coordinate
 * @returns {number}
 */
  static AsDegreesFromCoordinate(coordinate: CartesianCoordinate): number {
    return Angle.AsDegrees(coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="x">The x-coordinate.</param>
  /// <param name="y">The y-coordinate.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
  static AsDegrees(x: number, y: number): number {
    return Angle.RadiansToDegrees(Angle.AsRadians(x, y));
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {CartesianCoordinate} coordinate
 * @returns {number}
 */
  static AsRadiansFromCoordinate(coordinate: CartesianCoordinate): number {
    return Angle.AsRadians(coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the positive angle [radians] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="x">The x-coordinate.</param>
  /// <param name="y">The y-coordinate.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
  static AsRadians(x: number, y: number): number {
    if (Numbers.IsZeroSign(x)) {
      if (Numbers.IsPositiveSign(y)) {
        return Numbers.Pi / 2;  // 90 deg
      }
      if (Numbers.IsNegativeSign(y)) {
        return (3 / 2) * Numbers.Pi;  // 270 deg
      }
      return 0;  // Assume 0 degrees for origin
    }

    let angleOffset = 0;
    if (Numbers.IsNegativeSign(x)) {
      // 2nd or 3rd quadrant
      angleOffset = Numbers.Pi;
    }
    else if (Numbers.IsNegativeSign(y)) {
      // 4th quadrant
      angleOffset = 2 * Numbers.Pi;
    }

    return angleOffset + Trig.ArcTan(y / x);
  }


  /// <summary>
  /// Reduces a given angle to a value between -π and +π radians.
  /// </summary>
  /// <param name="radians">The angle in radians.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @static
 * @param {number} radians
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  static WrapAngleWithinPositiveNegativePi(
    radians: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    const wrappedAngleWithinTwoPi = Angle.WrapAngleWithinTwoPi(radians, tolerance);

    if (Math.abs(wrappedAngleWithinTwoPi) > Numbers.Pi) {
      return -Math.sign(wrappedAngleWithinTwoPi) * (Numbers.TwoPi - Math.abs(wrappedAngleWithinTwoPi));
    }
    return wrappedAngleWithinTwoPi;
  }


  /**
   * Reduces a given angle to a value between 0 and 2π radians, matching the sign of the angle.
   *
   * @static
   * @param {number} radians The angle in radians
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}
   * @memberof Angle
   */
  static WrapAngleWithinTwoPi(
    radians: number,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    if (Numbers.IsZeroSign(radians, tolerance)) {
      radians = 0;
    }
    if (radians === Infinity || radians === -Infinity) {
      return Infinity;
    }
    const inferredRounding = Math.max(Numbers.DecimalPlaces(radians), 6);
    const roundedPi = Numbers.RoundToDecimalPlaces(Numbers.TwoPi, inferredRounding);
    const revolutions = Numbers.RoundToDecimalPlaces(Math.floor(radians / roundedPi), inferredRounding);

    return radians - revolutions * roundedPi;
  }


  /**
   * Returns a default static coordinate at the origin.
   *
   * @static
   * @return {*}  {Angle}
   * @memberof Angle
   */
  static Origin(): Angle {
    return new Angle(0);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @returns {string}
 */
  ToString(): string {
    return this.toString() + " - Radians: " + this.Radians;
  }


  /**
   * Gets the direction vector, which is a normalized vector pointing to the direction of this angle.
   *
   * @return {*}  {Vector}
   * @memberof Angle
   */
  GetDirectionVector(): Vector {
    return Vector.fromMagnitudesAtLocation(Math.cos(this.Radians), Math.sin(this.Radians));
  }


  /**
   * Rotates the given Vector around the zero point.
   *
   * @param {Vector} vector
   * @return {*}  {Vector}
   * @memberof Angle
   */
  RotateVector(vector: Vector): Vector {
    const tolerance = Generics.getToleranceBetween(this, vector);
    if (Numbers.IsZeroSign(this.Radians, tolerance)) {
      return vector;
    }

    const completeAngle = Angle.CreateFromVector(vector).addToRadians(this.Radians);
    return completeAngle.GetDirectionVector().multiplyBy(vector.Magnitude);
  }

  /**
   * Returns the angular offset of the current angle from the provided angle.
   *
   * i.e. the current angle subtracting the provided angle.
   *
   * @param {Angle} angleI
   * @return {*}  {AngularOffset}
   * @memberof Angle
   */
  OffsetFrom(angleI: Angle): AngularOffset {
    return AngularOffset.fromAngles(angleI, this);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {boolean}
 */
  isGreaterThan(angle: Angle): boolean {
    return this.compareTo(angle) == 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {boolean}
 */
  isGreaterThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) == 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {boolean}
 */
  isGreaterThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) == 1;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {boolean}
 */
  isLessThan(angle: Angle): boolean {
    return this.compareTo(angle) == -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {boolean}
 */
  isLessThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) == -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {boolean}
 */
  isLessThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) == -1;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {boolean}
 */
  isGreaterThanOrEqualTo(angle: Angle): boolean {
    return this.compareTo(angle) >= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {boolean}
 */
  isGreaterThanOrEqualToRadians(radians: number): boolean {
    return this.CompareToRadians(radians) >= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {boolean}
 */
  isGreaterThanOrEqualToDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) >= 0;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {boolean}
 */
  isLessThanOrEqualTo(angle: Angle): boolean {
    return this.compareTo(angle) <= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {boolean}
 */
  isLessThanOrEqualToRadians(radians: number): boolean {
    return this.CompareToRadians(radians) <= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {boolean}
 */
  isLessThanOrEqualToDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) <= 0;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {Angle}
 */
  addTo(angle: Angle): Angle {
    return new Angle(this.Radians + angle.Radians, Generics.getToleranceBetween(this, angle));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {Angle}
 */
  addToRadians(radians: number): Angle {
    return new Angle(this.Radians + radians, this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {Angle}
 */
  addToDegrees(degrees: number): Angle {
    return new Angle(this.Degrees + degrees, this.Tolerance);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {Angle}
 */
  subtractBy(angle: Angle): Angle {
    return new Angle(this.Radians - angle.Radians, Generics.getToleranceBetween(this, angle));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {Angle}
 */
  subtractByRadians(radians: number): Angle {
    return new Angle(this.Radians - radians, this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {Angle}
 */
  subtractByDegrees(degrees: number): Angle {
    return new Angle(this.Degrees - degrees, this.Tolerance);
  }

  /// <summary>
  /// Implements the * operator for an angle and a double which represents a multiplier.
  /// </summary>
  /// <param name="angle">The angle.</param>
  /// <param name="multiplier">Multiplier value.</param>
  /// <returns>The result of the operator.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} multiplier
 * @returns {Angle}
 */
  multiplyBy(multiplier: number): Angle {
    return new Angle(this.Radians * multiplier, this.Tolerance);
  }

  /// <summary>
  /// Implements the / operator for an angle and a double which represents the denominator.
  /// </summary>
  /// <param name="angle">The angle.</param>
  /// <param name="denominator">The denominator value.</param>
  /// <returns>The result of the operator.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} denominator
 * @returns {Angle}
 */
  divideBy(denominator: number): Angle {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return new Angle(this.Radians / denominator, this.Tolerance);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} other
 * @returns {boolean}
 */
  equals(other: Angle): boolean {
    const tolerance = Generics.getToleranceBetween(this, other);
    return Numbers.AreEqual(this.Radians, other.Radians, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {boolean}
 */
  equalsRadians(radians: number): boolean {
    return Numbers.AreEqual(this.Radians, radians, this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {boolean}
 */
  equalsDegrees(degrees: number): boolean {
    return Numbers.AreEqual(this.Degrees, degrees, this.Tolerance);
  }

  /// <summary>
  /// Compares the current instance with another object of the same type and returns an integer that indicates whether the current instance precedes, follows, or occurs in the same position in the sort order as the other object.
  /// </summary>
  /// <param name="other">An object to compare with this instance.</param>
  /// <returns>A value that indicates the relative order of the objects being compared. The return value has these meanings:
  /// Value
  /// Meaning
  /// Less than zero
  /// This instance precedes <paramref name="other">other</paramref> in the sort order.
  /// Zero
  /// This instance occurs in the same position in the sort order as <paramref name="other">other</paramref>.
  /// Greater than zero
  /// This instance follows <paramref name="other">other</paramref> in the sort order.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {Angle} angle
 * @returns {number}
 */
  compareTo(angle: Angle): number {
    if (this.equals(angle)) { return 0; }

    const tolerance = Generics.getToleranceBetween(this, angle);
    return Numbers.IsLessThan(this.Radians, angle.Radians, tolerance) ? -1 : 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} radians
 * @returns {number}
 */
  CompareToRadians(radians: number): number {
    if (this.equalsRadians(radians)) { return 0; }

    return Numbers.IsLessThan(this.Radians, radians, this.Tolerance) ? -1 : 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @param {number} degrees
 * @returns {number}
 */
  CompareToDegrees(degrees: number): number {
    if (this.equalsDegrees(degrees)) { return 0; }

    return Numbers.IsLessThan(this.Radians, degrees, this.Tolerance) ? -1 : 1;
  }
}