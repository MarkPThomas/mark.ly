import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { Numbers } from "../Numbers";
import { CartesianCoordinate } from "./CartesianCoordinate";
import { Angle } from './Angle';
import { Generics } from "../Generics";
import { DivideByZeroException } from "../../../errors/exceptions";
import { PolarOffset } from "./PolarOffset";
import { IOffset } from "../IOffset";

/**
 * Represents the difference between Cartesian coordinates I (first) and J (second) in two-dimensional space.
 * @date 2/3/2024 - 9:04:58 AM
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 * @export
 * @class CartesianOffset
 * @typedef {CartesianOffset}
 * @implements {IOffset<CartesianCoordinate>}
 */
export class CartesianOffset implements IOffset<CartesianCoordinate> {

  readonly Tolerance: number;
  readonly I: CartesianCoordinate;
  readonly J: CartesianCoordinate;

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

  // ==== Initialization
  /**
   * Creates an instance of CartesianOffset.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @constructor
   * @param {CartesianCoordinate} i The first coordinate.
   * @param {CartesianCoordinate} j The second coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   */
  protected constructor(
    i: CartesianCoordinate,
    j: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.I = i;
    this.J = j;
    this.Tolerance = tolerance;
  }

  /**
   * Creates an instance of CartesianOffset from the provided coordinates.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @static
   * @param {CartesianCoordinate} i
   * @param {CartesianCoordinate} j
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @returns {CartesianOffset}
   */
  static fromCoordinates(
    i: CartesianCoordinate,
    j: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset {
    return new CartesianOffset(i, j, tolerance)
  }

  /**
   * Creates an instance of CartesianOffset from the specified offsets from the global origin.
   *
   * @static
   * @param {number} deltaX The x-axis offset from the origin.
   * @param {number} deltaY The y-axis offset from the origin.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {CartesianOffset}
   * @memberof CartesianOffset
   */
  static fromOffsets(
    deltaX: number,
    deltaY: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset {
    const i = CartesianCoordinate.atOrigin();
    const j = CartesianCoordinate.fromXY(deltaX, deltaY);

    return new CartesianOffset(i, j, tolerance);
  }

  // ==== Conversions
  toString(): string {
    return `${CartesianOffset.name} - `
      + `I: (${this.I.X}, ${this.I.Y}), `
      + `J: (${this.J.X}, ${this.J.Y})`;
  }

  /**
   * Converts to a single coordinate with the global origin aligned with the first coord of the offset.
   *
   * @return {*}  {CartesianCoordinate}
   * @memberof CartesianOffset
   */
  toCartesianCoordinate(): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      this.X,
      this.Y,
      this.Tolerance);
  }

  /**
   * Converts to a single polar coordinate with the global origin aligned with the first coord of the offset.
   *
   * @return {*}  {PolarOffset}
   * @memberof PolarOffset
   */
  toPolarOffset(): PolarOffset {
    return PolarOffset.fromCoordinates(this.I.toPolar(), this.J.toPolar(), this.Tolerance);
  }

  // ==== Public Methods
  /**
   * The total straight length of the offset.
   *
   * @return {*}  {number}
   * @memberof CartesianOffset
   */
  length(): number {
    return AlgebraLibrary.SRSS(this.X, this.Y);
  }

  /**
   * The slope angle of the offset.
   *
   * @return {*}  {Angle}
   * @memberof CartesianOffset
   */
  slopeAngle(): Angle {
    return Angle.CreateFromPoint(this.toCartesianCoordinate());
  }

  /**
   * The separation distance between the provided coordinates.
   *
   * @static
   * @param {CartesianCoordinate} coord1
   * @param {CartesianCoordinate} coord2
   * @return {*}  {number}
   * @memberof CartesianOffset
   */
  static lengthBetween(coord1: CartesianCoordinate, coord2: CartesianCoordinate): number {
    return AlgebraLibrary.SRSS((coord2.X - coord1.X), (coord2.Y - coord1.Y));
  }

  // ==== Comparisons
  equals(other: CartesianOffset): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.AreEqual(this.X, other.X, tolerance) &&
      Numbers.AreEqual(this.Y, other.Y, tolerance)
    );
  }

  // ==== Combinations
  addToCoordinate(coord: CartesianCoordinate): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      coord.X + this.X,
      coord.Y + this.Y,
      Generics.getToleranceBetween(coord, this));
  }

  subtractFromCoordinate(coord: CartesianCoordinate): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      coord.X - this.X,
      coord.Y - this.Y,
      Generics.getToleranceBetween(coord, this));
  }

  subtractByCoordinate(coord: CartesianCoordinate): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      this.X - coord.X,
      this.Y - coord.Y,
      Generics.getToleranceBetween(this, coord));
  }

  addTo(offset: CartesianOffset): CartesianOffset {
    return CartesianOffset.fromCoordinates(
      CartesianCoordinate.atOrigin(),
      CartesianCoordinate.fromXY(
        this.X + offset.X,
        this.Y + offset.Y),
      Generics.getToleranceBetween(this, offset));
  }

  subtractBy(offset: CartesianOffset): CartesianOffset {
    return CartesianOffset.fromCoordinates(
      CartesianCoordinate.atOrigin(),
      this.toCartesianCoordinate().subtractBy(offset.toCartesianCoordinate()).toCartesianCoordinate(),
      Generics.getToleranceBetween(this, offset));
  }

  multiplyBy(multiplier: number): CartesianOffset {
    return CartesianOffset.fromCoordinates(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance);
  }

  divideBy(denominator: number): CartesianOffset {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return CartesianOffset.fromCoordinates(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance);
  }
}