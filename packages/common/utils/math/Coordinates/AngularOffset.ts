import { DivideByZeroException } from "../../../errors/exceptions";
import { IComparable, IEquatable } from "../../../interfaces";
import { Generics } from "../Generics";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { Vector } from "../Vectors/Vector";
import { Angle } from "./Angle";
import { CartesianCoordinate } from "./CartesianCoordinate";


/**
 * Represents the angular difference between angles I (first) and J (second) in one-dimensional space.
 *
 * @export
 * @class AngularOffset
 * @implements {IEquatable<AngularOffset>}
 * @implements {IComparable<AngularOffset>}
 * @implements {ITolerance}
 */
export class AngularOffset implements IEquatable<AngularOffset>, IComparable<AngularOffset>, ITolerance {
  public readonly Tolerance: number;

  private _i: Angle;
  /**
   * Angle I (starting point).
   *
   * @readonly
   * @memberof Angle
   */
  get I() { return this._i }

  private _j: Angle;
  /**
   * Angle J (ending point).
   *
   * @readonly
   * @memberof Angle
   */
  get J() { return this._j }

  protected constructor(
    i: Angle, j: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this._i = i;
    this._j = j;
    this.Tolerance = tolerance;
  }

  public static fromNone() {
    return new AngularOffset(new Angle(), new Angle());
  }

  public static fromAngles(
    i: Angle, j: Angle,
    tolerance: number = Numbers.ZeroTolerance): AngularOffset {

    return new AngularOffset(i, j, tolerance);
  }

  public static fromDeltaRadians(
    deltaAngle: number,
    tolerance: number = Numbers.ZeroTolerance): AngularOffset {
    return new AngularOffset(new Angle(0), new Angle(deltaAngle), tolerance);
  }

  public static fromPoints(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate,
    point3: CartesianCoordinate
  ): AngularOffset {
    const angle1 = Vector.fromCoords(point1, point2).Angle();
    const angle2 = Vector.fromCoords(point2, point3).Angle();
    return angle1.OffsetFrom(angle2);
  }

  public ToAngle(): Angle {
    return new Angle(this.Delta().Radians, this.Tolerance);
  }

  public ToString(): string {
    return this.ToString() + " - Radians_i: " + this.I.Radians + " - Radians_j: " + this.J.Radians;
  }

  /**
   * j - i.
   *
   * @return {*}  {Angle}
   * @memberof AngularOffset
   */
  public Delta(): Angle {
    return Angle.fromRadians(this.J.RadiansRaw - this.I.RadiansRaw);
  }

  /// <summary>
  /// The total straight length of the offset.
  /// </summary>
  /// <param name="radius">The radius to use with the angular offset.</param>
  /// <returns>System.Double.</returns>
  public LengthChord(radius: number = 1): number {
    return radius * 2 * Math.sin(this.Delta().Radians / 2);
  }

  /// <summary>
  /// The total arc length of the offset.
  /// </summary>
  /// <param name="radius">The radius to use with the angular offset.</param>
  /// <returns>System.Double.</returns>
  public LengthArc(radius: number = 1): number {
    return radius * this.Delta().RadiansRaw;
  }



  // #region Operators: Comparison


  public isGreaterThan(offset: AngularOffset): boolean {
    return this.compareTo(offset) === 1;
  }

  public isGreaterThanRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) === 1;
  }

  public isGreaterThanDegrees(angleRadians: number): boolean {
    return this.compareToDegrees(angleRadians) === 1;
  }



  public isLessThan(offset: AngularOffset): boolean {
    return this.compareTo(offset) === -1;
  }

  public isLessThanRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) === -1;
  }

  public isLessThanDegrees(angleRadians: number): boolean {
    return this.compareToDegrees(angleRadians) === -1;
  }


  public isGreaterThanOrEqualTo(offset: AngularOffset): boolean {
    return this.compareTo(offset) >= 0;
  }

  public isGreaterOrEqualRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) >= 0;
  }

  public isGreaterOrEqualDegrees(angleDegrees: number): boolean {
    return this.compareToDegrees(angleDegrees) >= 0;
  }


  public isLessThanOrEqualTo(offset: AngularOffset): boolean {
    return this.compareTo(offset) <= 0;
  }

  public isLesserOrEqualRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) <= 0;
  }

  public isLesserOrEqualDegrees(angleDegrees: number): boolean {
    return this.compareToDegrees(angleDegrees) <= 0;
  }



  // #region Operators: Combining

  public subtractBy(offset: AngularOffset) {
    return new AngularOffset(
      Angle.atOrigin(),
      this.ToAngle().subtractBy(offset.ToAngle()),
      Generics.getToleranceBetween(this, offset));
  }

  public subtractByRadians(angleRadians: number): number {
    return this.Delta().Radians - angleRadians;
  }

  public subtractByDegrees(angleDegrees: number): number {
    return this.Delta().Degrees - angleDegrees;
  }

  public addTo(offset: AngularOffset): AngularOffset {
    return new AngularOffset(
      this.I.addTo(offset.I),
      this.J.addTo(offset.J),
      Generics.getToleranceBetween(this, offset));
  }

  public addToRadians(angleRadians: number): number {
    return this.Delta().Radians + angleRadians;
  }

  public addToDegrees(angleDegrees: number): number {
    return this.Delta().Degrees + angleDegrees;
  }


  public multiplyBy(multiplier: number): AngularOffset {
    return new AngularOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance);
  }


  public divideBy(denominator: number): AngularOffset {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return new AngularOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance);
  }

  public equals(offset: AngularOffset): boolean {
    const tolerance = Generics.getToleranceBetween(this, offset);
    return Numbers.IsEqualTo(this.Delta().Radians, offset.Delta().Radians, tolerance);
  }

  public equalsRadians(angleRadians: number): boolean {
    return Numbers.IsEqualTo(this.Delta().Radians, angleRadians, this.Tolerance);
  }

  public equalsDegrees(angleDegrees: number): boolean {
    return Numbers.IsEqualTo(this.Delta().Radians, angleDegrees, this.Tolerance);
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
  public compareTo(other: AngularOffset): number {
    if (this.equals(other)) { return 0; }

    const tolerance = Generics.getToleranceBetween(this, other);
    return Numbers.IsLessThan(this.Delta().Radians, other.Delta().Radians, tolerance) ? -1 : 1;
  }

  public compareToRadians(angleRadians: number): number {
    if (this.equalsRadians(angleRadians)) { return 0; }

    return Numbers.IsLessThan(this.Delta().Radians, angleRadians, this.Tolerance) ? -1 : 1;
  }

  public compareToDegrees(angleDegrees: number): number {
    if (this.equalsDegrees(angleDegrees)) { return 0; }

    return Numbers.IsLessThan(this.Delta().Radians, angleDegrees, this.Tolerance) ? -1 : 1;
  }
}