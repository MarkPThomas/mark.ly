/// <summary>
/// Represents the difference between Cartesian coordinates I (first) and J (second) in two-dimensional space.
/// </summary>

import { IEquatable } from "../../../interfaces";
import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { CartesianCoordinate } from "./CartesianCoordinate";
import { Angle } from './Angle';
import { Generics } from "../Generics";
import { DivideByZeroException } from "../../../errors/exceptions";

/// <seealso cref="System.IEquatable{CartesianOffset}" />
export class CartesianOffset implements IEquatable<CartesianOffset>, ITolerance {
  public readonly Tolerance: number;

  private _i: CartesianCoordinate;
  /**
   * Coordinate I (starting point).
   *
   * @readonly
   * @memberof CartesianOffset
   */
  get I() { return this._i }

  private _j: CartesianCoordinate;
  /**
   * Coordinate J (ending point).
   *
   * @readonly
   * @memberof CartesianOffset
   */
  get J() { return this._j }

  /**
   * 𝝙X = Xj - Xi.
   *
   * @readonly
   * @type {number}
   * @memberof CartesianOffset
   */
  get X(): number {
    return (this.J.X - this.I.X);
  }

  /**
   * 𝝙Y = Yj - Yi.
   *
   * @readonly
   * @type {number}
   * @memberof CartesianOffset
   */
  get Y(): number {
    return (this.J.Y - this.I.Y);
  }

  /// <summary>
  /// Initializes a new instance of the <see cref="CartesianOffset"/> struct.
  /// </summary>
  /// <param name="i">The first coordinate.</param>
  /// <param name="j">The second coordinate.</param>
  /// <param name="tolerance">The tolerance.</param>
  constructor(
    i: CartesianCoordinate, j: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this._i = i;
    this._j = j;
    this.Tolerance = tolerance;
  }

  // === Factory Methods
  static FromCoordinates(
    i: CartesianCoordinate, j: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset {
    return new CartesianOffset(i, j, tolerance)
  }


  /**
   * Returns a new CartesianOffset based on the specified offsets from the global origin.
   *
   * @static
   * @param {number} deltaX The x-axis offset from the origin.
   * @param {number} deltaY The y-axis offset from the origin.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {CartesianOffset}
   * @memberof CartesianOffset
   */
  static FromOffsets(
    deltaX: number, deltaY: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset {
    const i = new CartesianCoordinate(0, 0);
    const j = new CartesianCoordinate(deltaX, deltaY);
    return new CartesianOffset(
      i, j, tolerance
    );
  }


  // === Conversions
  public ToString(): string {
    return this.toString() + " - I: (" + this.I.X + ", " + this.I.Y + "), J: (" + this.J.X + ", " + this.J.Y + ")";
  }

  /**
   * Converts to a single coordinate with the global origin aligned with the first point of the offset.
   *
   * @return {*}  {CartesianCoordinate}
   * @memberof CartesianOffset
   */
  public ToCartesianCoordinate(): CartesianCoordinate {
    return new CartesianCoordinate(
      this.X,
      this.Y,
      this.Tolerance);
  }

  // /// <summary>
  // /// Converts to polar offset.
  // /// </summary>
  // /// <returns>PolarOffset.</returns>
  // public ToPolar(): PolarOffset {
  //   return new PolarOffset(I, J, Tolerance);
  // }

  // === Public Methods

  /**
   * The total straight length of the offset.
   *
   * @return {*}  {number}
   * @memberof CartesianOffset
   */
  public Length(): number {
    return AlgebraLibrary.SRSS(this.X, this.Y);
  }

  /**
   * The slope angle of the offset.
   *
   * @return {*}  {Angle}
   * @memberof CartesianOffset
   */
  public SlopeAngle(): Angle {
    return Angle.CreateFromPoint(this.ToCartesianCoordinate());
  }


  /**
   * The separation distance between the provided points.
   *
   * @static
   * @param {CartesianCoordinate} coord1
   * @param {CartesianCoordinate} coord2
   * @return {*}  {number}
   * @memberof CartesianOffset
   */
  public static Separation(coord1: CartesianCoordinate, coord2: CartesianCoordinate): number {
    return AlgebraLibrary.SRSS((coord2.X - coord1.X), (coord2.Y - coord1.Y));
  }

  // === Comparisons & Operators

  public equals(other: CartesianOffset): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return Numbers.AreEqual(this.X, other.X, tolerance) &&
      Numbers.AreEqual(this.Y, other.Y, tolerance);
  }

  /// <summary>
  /// Implements the - operator.
  /// </summary>
  /// <param name="offset1">The offset1.</param>
  /// <param name="offset2">The offset2.</param>
  /// <returns>The result of the operator.</returns>
  public subtractByOffset(offset: CartesianOffset): CartesianOffset {
    return new CartesianOffset(
      new CartesianCoordinate(),
      this.ToCartesianCoordinate().subtractBy(offset.ToCartesianCoordinate()),
      Generics.GetTolerance(this, offset));
  }
  /// <summary>
  /// Implements the - operator.
  /// </summary>
  /// <param name="point1">The point1.</param>
  /// <param name="offset2">The offset2.</param>
  /// <returns>The result of the operator.</returns>
  public subtractFromCoordinate(point: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(
      point.X - this.X,
      point.Y - this.Y,
      Generics.GetTolerance(point, this));
  }
  /// <summary>
  /// Implements the - operator.
  /// </summary>
  /// <param name="offset1">The offset1.</param>
  /// <param name="point2">The point2.</param>
  /// <returns>The result of the operator.</returns>
  public subtractByCoordinate(point: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(
      this.X - point.X,
      this.Y - point.Y,
      Generics.GetTolerance(this, point));
  }

  /// <summary>
  /// Implements the + operator.
  /// </summary>
  /// <param name="offset1">The offset1.</param>
  /// <param name="offset2">The offset2.</param>
  /// <returns>The result of the operator.</returns>
  public addTo(offset: CartesianOffset): CartesianOffset {
    return new CartesianOffset(
      new CartesianCoordinate(),
      new CartesianCoordinate(
        this.X + offset.X,
        this.Y + offset.Y),
      Generics.GetTolerance(this, offset));
  }
  /// <summary>
  /// Implements the + operator.
  /// </summary>
  /// <param name="point1">The point1.</param>
  /// <param name="offset2">The offset2.</param>
  /// <returns>The result of the operator.</returns>
  public addToCoordinate(point: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(
      point.X + this.X,
      point.Y + this.Y,
      Generics.GetTolerance(point, this));
  }


  /// <summary>
  /// Implements the * operator.
  /// </summary>
  /// <param name="multiplier">Multiplier value.</param>
  /// <param name="offset">The offset.</param>
  /// <returns>The result of the operator.</returns>
  public multiplyBy(multiplier: number): CartesianOffset {
    return new CartesianOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance);
  }


  /// <summary>
  /// Implements the / operator.
  /// </summary>
  /// <param name="offset">The offset.</param>
  /// <param name="denominator">Denominator value.</param>
  /// <returns>The result of the operator.</returns>
  public divideBy(denominator: number): CartesianOffset {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return new CartesianOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance);
  }
}