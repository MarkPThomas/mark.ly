import { DivideByZeroException } from "common/errors/exceptions";
import { IComparable, IEquatable } from "common/interfaces";

import { Generics } from "../Generics";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { Vector } from "../vectors/Vector";
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public readonly Tolerance: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @private
 * @type {Angle}
 */
  private _i: Angle;
  /**
   * Angle I (starting point).
   *
   * @readonly
   * @memberof Angle
   */
  get I() { return this._i }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @private
 * @type {Angle}
 */
  private _j: Angle;
  /**
   * Angle J (ending point).
   *
   * @readonly
   * @memberof Angle
   */
  get J() { return this._j }

  /**
 * Creates an instance of AngularOffset.
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @constructor
 * @protected
 * @param {Angle} i
 * @param {Angle} j
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 */
  protected constructor(
    i: Angle, j: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this._i = i;
    this._j = j;
    this.Tolerance = tolerance;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @static
 * @returns {AngularOffset}
 */
  public static fromNone() {
    return new AngularOffset(new Angle(), new Angle());
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @static
 * @param {Angle} i
 * @param {Angle} j
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {AngularOffset}
 */
  public static fromAngles(
    i: Angle, j: Angle,
    tolerance: number = Numbers.ZeroTolerance): AngularOffset {

    return new AngularOffset(i, j, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @static
 * @param {number} deltaAngle
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {AngularOffset}
 */
  public static fromDeltaRadians(
    deltaAngle: number,
    tolerance: number = Numbers.ZeroTolerance): AngularOffset {
    return new AngularOffset(new Angle(0), new Angle(deltaAngle), tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @param {CartesianCoordinate} point3
 * @returns {AngularOffset}
 */
  public static fromPoints(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate,
    point3: CartesianCoordinate
  ): AngularOffset {
    const angle1 = Vector.fromCoords(point1, point2).Angle();
    const angle2 = Vector.fromCoords(point2, point3).Angle();
    return angle1.OffsetFrom(angle2);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @returns {Angle}
 */
  public ToAngle(): Angle {
    return new Angle(this.Delta().Radians, this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @returns {string}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} [radius=1]
 * @returns {number}
 */
  public LengthChord(radius: number = 1): number {
    return radius * 2 * Math.sin(this.Delta().Radians / 2);
  }

  /// <summary>
  /// The total arc length of the offset.
  /// </summary>
  /// <param name="radius">The radius to use with the angular offset.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} [radius=1]
 * @returns {number}
 */
  public LengthArc(radius: number = 1): number {
    return radius * this.Delta().RadiansRaw;
  }



  // #region Operators: Comparison


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {boolean}
 */
  public isGreaterThan(offset: AngularOffset): boolean {
    return this.compareTo(offset) === 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isGreaterThanRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) === 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isGreaterThanDegrees(angleRadians: number): boolean {
    return this.compareToDegrees(angleRadians) === 1;
  }



  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {boolean}
 */
  public isLessThan(offset: AngularOffset): boolean {
    return this.compareTo(offset) === -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isLessThanRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) === -1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isLessThanDegrees(angleRadians: number): boolean {
    return this.compareToDegrees(angleRadians) === -1;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {boolean}
 */
  public isGreaterThanOrEqualTo(offset: AngularOffset): boolean {
    return this.compareTo(offset) >= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isGreaterOrEqualRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) >= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {boolean}
 */
  public isGreaterOrEqualDegrees(angleDegrees: number): boolean {
    return this.compareToDegrees(angleDegrees) >= 0;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {boolean}
 */
  public isLessThanOrEqualTo(offset: AngularOffset): boolean {
    return this.compareTo(offset) <= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public isLesserOrEqualRadians(angleRadians: number): boolean {
    return this.compareToRadians(angleRadians) <= 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {boolean}
 */
  public isLesserOrEqualDegrees(angleDegrees: number): boolean {
    return this.compareToDegrees(angleDegrees) <= 0;
  }



  // #region Operators: Combining

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {AngularOffset}
 */
  public subtractBy(offset: AngularOffset) {
    return new AngularOffset(
      Angle.atOrigin(),
      this.ToAngle().subtractBy(offset.ToAngle()),
      Generics.getToleranceBetween(this, offset));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {number}
 */
  public subtractByRadians(angleRadians: number): number {
    return this.Delta().Radians - angleRadians;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {number}
 */
  public subtractByDegrees(angleDegrees: number): number {
    return this.Delta().Degrees - angleDegrees;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {AngularOffset}
 */
  public addTo(offset: AngularOffset): AngularOffset {
    return new AngularOffset(
      this.I.addTo(offset.I),
      this.J.addTo(offset.J),
      Generics.getToleranceBetween(this, offset));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {number}
 */
  public addToRadians(angleRadians: number): number {
    return this.Delta().Radians + angleRadians;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {number}
 */
  public addToDegrees(angleDegrees: number): number {
    return this.Delta().Degrees + angleDegrees;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} multiplier
 * @returns {AngularOffset}
 */
  public multiplyBy(multiplier: number): AngularOffset {
    return new AngularOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} denominator
 * @returns {AngularOffset}
 */
  public divideBy(denominator: number): AngularOffset {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return new AngularOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} offset
 * @returns {boolean}
 */
  public equals(offset: AngularOffset): boolean {
    const tolerance = Generics.getToleranceBetween(this, offset);
    return Numbers.IsEqualTo(this.Delta().Radians, offset.Delta().Radians, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {boolean}
 */
  public equalsRadians(angleRadians: number): boolean {
    return Numbers.IsEqualTo(this.Delta().Radians, angleRadians, this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {boolean}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {AngularOffset} other
 * @returns {number}
 */
  public compareTo(other: AngularOffset): number {
    if (this.equals(other)) { return 0; }

    const tolerance = Generics.getToleranceBetween(this, other);
    return Numbers.IsLessThan(this.Delta().Radians, other.Delta().Radians, tolerance) ? -1 : 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {number}
 */
  public compareToRadians(angleRadians: number): number {
    if (this.equalsRadians(angleRadians)) { return 0; }

    return Numbers.IsLessThan(this.Delta().Radians, angleRadians, this.Tolerance) ? -1 : 1;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} angleDegrees
 * @returns {number}
 */
  public compareToDegrees(angleDegrees: number): number {
    if (this.equalsDegrees(angleDegrees)) { return 0; }

    return Numbers.IsLessThan(this.Delta().Radians, angleDegrees, this.Tolerance) ? -1 : 1;
  }
}