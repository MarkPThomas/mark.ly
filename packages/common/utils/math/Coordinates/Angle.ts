import { IEquatable, IComparable } from "../../../interfaces";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { CartesianCoordinate } from "./CartesianCoordinate";
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';
import { Generics } from "../Generics";
import { Vector } from "../Vectors/Vector";
import { AngularOffset } from "./AngularOffset";
import { DivideByZeroException } from "../../../errors/exceptions";


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
  public readonly Tolerance: number;

  /// <summary>
  /// The raw angle as radians, without any modifications done.
  /// </summary>
  /// <value>The radians raw.</value>
  public readonly RadiansRaw: number;

  /// <summary>
  /// The raw angle as degrees, without any modifications done.
  /// </summary>
  /// <value>The degrees raw.</value>
  get DegreesRaw() { return Angle.RadiansToDegrees(this.RadiansRaw) };


  /// <summary>
  /// The angle as radians, which is a value between -π (clockwise) and +π (counter-clockwise).
  /// </summary>
  /// <value>The radians.</value>
  public readonly Radians: number;

  /// <summary>
  /// The angle as clockwise (inverted) radians, which is a value between -π (counter-clockwise) and +π (clockwise).
  /// </summary>
  /// <value>The clockwise radians.</value>
  get ClockwiseRadians() { return -this.Radians; }

  /// <summary>
  /// The angle as degrees, which is a value between -180 (clockwise) and +180 (counter-clockwise).
  /// </summary>
  /// <value>The degree.</value>
  get Degrees() { return Angle.RadiansToDegrees(this.Radians) };

  /// <summary>
  /// The angle as clockwise (inverted) degrees, which is a value between -180 (counter-clockwise) and +180 (clockwise).
  /// </summary>
  /// <value>The clockwise degree.</value>
  get ClockwiseDegrees() { return Angle.RadiansToDegrees(-this.Radians) };


  /// <summary>
  /// Initializes a new instance of the <see cref="Angle" /> struct.
  /// </summary>
  /// <param name="radians">The radian value of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  constructor(
    radians: number,
    tolerance: number = Numbers.ZeroTolerance) {
    this.RadiansRaw = radians;
    this.Radians = Angle.WrapAngleWithinPositiveNegativePi(radians);
    this.Tolerance = tolerance;
  }

  public static fromOrigin() {
    return new Angle(0);
  }

  /// <summary>
  /// Creates an <see cref="Angle" /> from a radian value.
  /// </summary>
  /// <param name="radians">The radian value of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /// <returns>Angle.</returns>
  public static CreateFromRadian(
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
  public static CreateFromDegree(
    degrees: number,
    tolerance: number = Numbers.ZeroTolerance
  ): Angle {
    return new Angle(this.DegreesToRadians(degrees), tolerance);
  }

  /// <summary>
  /// Creates an <see cref="Angle" /> from a direction vector.
  /// </summary>
  /// <param name="direction">The direction vector of the angle.</param>
  /// <param name="tolerance">The tolerance to be used in relating coordinates.</param>
  /// <returns>Angle.</returns>
  public static CreateFromVector(
    direction: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): Angle {
    return new Angle(this.AsRadians(direction.Xcomponent, direction.Ycomponent), tolerance);
  }

  /// <summary>
  /// Creates an Angle from a point.
  /// The angle is assumed to lie between the origin, point, and positive horizontal axis.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <returns>Angle.</returns>
  public static CreateFromPoint(point: CartesianCoordinate): Angle {
    const vector = Vector.fromCoords(CartesianCoordinate.Origin(), point);
    return vector.Angle();
  }

  /// <summary>
  /// Creates an Angle from two points.
  /// The angle is assumed to lie between the line formed by the two points, and the positive horizontal axis.
  /// </summary>
  /// <param name="point1">The first point.</param>
  /// <param name="point2">The second point.</param>
  /// <returns>Angle.</returns>
  public static CreateFromPoints(point1: CartesianCoordinate, point2: CartesianCoordinate): Angle {
    const vector = Vector.fromCoords(point1, point2);
    return vector.Angle();
  }

  public static RadiansToDegrees(radians: number): number {
    return radians * (180 / Numbers.Pi);
  }

  public static DegreesToRadians(degrees: number): number {
    return degrees * (Numbers.Pi / 180);
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  public static AsDegreesFromCoordinate(coordinate: CartesianCoordinate): number {
    return Angle.AsDegrees(coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="x">The x-coordinate.</param>
  /// <param name="y">The y-coordinate.</param>
  /// <returns>System.Double.</returns>
  public static AsDegrees(x: number, y: number): number {
    return Angle.RadiansToDegrees(Angle.AsRadians(x, y));
  }

  /// <summary>
  /// Returns the positive angle [degrees] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  public static AsRadiansFromCoordinate(coordinate: CartesianCoordinate): number {
    return Angle.AsRadians(coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the positive angle [radians] from the x-axis, counter-clockwise, of the coordinates.
  /// </summary>
  /// <param name="x">The x-coordinate.</param>
  /// <param name="y">The y-coordinate.</param>
  /// <returns>System.Double.</returns>
  public static AsRadians(x: number, y: number): number {
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
  public static WrapAngleWithinPositiveNegativePi(
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
  public static WrapAngleWithinTwoPi(
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
  public static Origin(): Angle {
    return new Angle(0);
  }

  public ToString(): string {
    return this.toString() + " - Radians: " + this.Radians;
  }


  /**
   * Gets the direction vector, which is a normalized vector pointing to the direction of this angle.
   *
   * @return {*}  {Vector}
   * @memberof Angle
   */
  public GetDirectionVector(): Vector {
    return Vector.fromMagnitudesAtLocation(Math.cos(this.Radians), Math.sin(this.Radians));
  }


  /**
   * Rotates the given Vector around the zero point.
   *
   * @param {Vector} vector
   * @return {*}  {Vector}
   * @memberof Angle
   */
  public RotateVector(vector: Vector): Vector {
    const tolerance = Generics.GetTolerance(this, vector);
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
  public OffsetFrom(angleI: Angle): AngularOffset {
    return AngularOffset.fromAngles(angleI, this);
  }


  public isGreater(angle: Angle): boolean {
    return this.compareTo(angle) == 1;
  }

  public isGreaterThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) == 1;
  }

  public isGreaterThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) == 1;
  }


  public isLess(angle: Angle): boolean {
    return this.compareTo(angle) == -1;
  }

  public isLessThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) == -1;
  }

  public isLessThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) == -1;
  }


  public isGreaterOrEqual(angle: Angle): boolean {
    return this.compareTo(angle) >= 0;
  }

  public isGreaterOrEqualThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) >= 0;
  }

  public isGreaterOrEqualThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) >= 0;
  }


  public isLesserOrEqual(angle: Angle): boolean {
    return this.compareTo(angle) <= 0;
  }

  public isLesserOrEqualThanRadians(radians: number): boolean {
    return this.CompareToRadians(radians) <= 0;
  }

  public isLesserOrEqualThanDegrees(degrees: number): boolean {
    return this.CompareToDegrees(degrees) <= 0;
  }


  public addTo(angle: Angle): Angle {
    return new Angle(this.Radians + angle.Radians, Generics.GetTolerance(this, angle));
  }

  public addToRadians(radians: number): Angle {
    return new Angle(this.Radians + radians, this.Tolerance);
  }

  public addToDegrees(degrees: number): Angle {
    return new Angle(this.Degrees + degrees, this.Tolerance);
  }


  public subtractBy(angle: Angle): Angle {
    return new Angle(this.Radians - angle.Radians, Generics.GetTolerance(this, angle));
  }

  public subtractByRadians(radians: number): Angle {
    return new Angle(this.Radians - radians, this.Tolerance);
  }

  public subtractByDegrees(degrees: number): Angle {
    return new Angle(this.Degrees - degrees, this.Tolerance);
  }

  /// <summary>
  /// Implements the * operator for an angle and a double which represents a multiplier.
  /// </summary>
  /// <param name="angle">The angle.</param>
  /// <param name="multiplier">Multiplier value.</param>
  /// <returns>The result of the operator.</returns>
  public multiplyBy(multiplier: number): Angle {
    return new Angle(this.Radians * multiplier, this.Tolerance);
  }

  /// <summary>
  /// Implements the / operator for an angle and a double which represents the denominator.
  /// </summary>
  /// <param name="angle">The angle.</param>
  /// <param name="denominator">The denominator value.</param>
  /// <returns>The result of the operator.</returns>
  public divideBy(denominator: number): Angle {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return new Angle(this.Radians / denominator, this.Tolerance);
  }


  public equals(other: Angle): boolean {
    const tolerance = Generics.GetTolerance(this, other);
    return Numbers.AreEqual(this.Radians, other.Radians, tolerance);
  }

  public equalsRadians(radians: number): boolean {
    return Numbers.AreEqual(this.Radians, radians, this.Tolerance);
  }

  public equalsDegrees(degrees: number): boolean {
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
  public compareTo(angle: Angle): number {
    if (this.equals(angle)) { return 0; }

    const tolerance = Generics.GetTolerance(this, angle);
    return Numbers.IsLessThan(this.Radians, angle.Radians, tolerance) ? -1 : 1;
  }

  public CompareToRadians(radians: number): number {
    if (this.equalsRadians(radians)) { return 0; }

    return Numbers.IsLessThan(this.Radians, radians, this.Tolerance) ? -1 : 1;
  }

  public CompareToDegrees(degrees: number): number {
    if (this.equalsDegrees(degrees)) { return 0; }

    return Numbers.IsLessThan(this.Radians, degrees, this.Tolerance) ? -1 : 1;
  }
}