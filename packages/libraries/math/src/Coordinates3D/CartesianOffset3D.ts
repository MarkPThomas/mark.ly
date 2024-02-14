import { DivideByZeroException } from "common/errors/exceptions";

import { AlgebraLibrary } from "../algebra/AlgebraLibrary";
import { Generics } from "../Generics";
import { IOffset } from "../IOffset";
import { Numbers } from "../Numbers";
import { CartesianCoordinate3D } from "./CartesianCoordinate3D";
import { CylindricalOffset } from "./CylindricalOffset";
import { IAngle3D } from "./IAngle3D";
import { SphericalOffset } from "./SphericalOffset";

/**
 * Represents the difference between 3D Cartesian coordinates I (first) and J (second) in three-dimensional space.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 * @implements {IOffset<CartesianCoordinate3D>}
 */
export class CartesianOffset3D implements IOffset<CartesianCoordinate3D> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {number}
 */
  readonly Tolerance: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {CartesianCoordinate3D}
 */
  readonly I: CartesianCoordinate3D;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {CartesianCoordinate3D}
 */
  readonly J: CartesianCoordinate3D;

  /**
   * 𝝙X = Xj - Xi.
   *
   * @readonly
   * @type {number}
   * @memberof CartesianOffset3D
   */
  get X(): number {
    return (this.J.X - this.I.X);
  }

  /**
   * 𝝙Y = Yj - Yi.
   *
   * @readonly
   * @type {number}
   * @memberof CartesianOffset3D
   */
  get Y(): number {
    return (this.J.Y - this.I.Y);
  }

  /**
   * 𝝙Z = Zj - Zi.
   *
   * @readonly
   * @type {number}
   * @memberof CartesianOffset3D
   */
  get Z(): number {
    return (this.J.Z - this.I.Z);
  }

  // ==== Initialization


  /**
 * Creates an instance of CartesianOffset3D.
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @constructor
 * @protected
 * @param {CartesianCoordinate3D} i
 * @param {CartesianCoordinate3D} j
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 */
  protected constructor(
    i: CartesianCoordinate3D,
    j: CartesianCoordinate3D,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.I = i;
    this.J = j;
    this.Tolerance = tolerance;
  }

  /**
   * Creates an instance of CartesianOffset3D from the provided coordinates.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @static
   * @param {CartesianCoordinate3D} i
   * @param {CartesianCoordinate3D} j
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @returns {CartesianOffset3D}
   */
  static fromCoordinates(
    i: CartesianCoordinate3D,
    j: CartesianCoordinate3D,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset3D {
    return new CartesianOffset3D(i, j, tolerance)
  }

  /**
   * Creates an instance of CartesianOffset3D the specified offsets from the global origin.
   *
   * @static
   * @param {number} deltaX The x-axis offset from the origin.
   * @param {number} deltaY The y-axis offset from the origin.
   * @param {number} deltaZ The z-axis offset from the origin.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {CartesianOffset3D}
   * @memberof CartesianOffset3D
   */
  static fromOffsets(
    deltaX: number,
    deltaY: number,
    deltaZ: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianOffset3D {
    const i = CartesianCoordinate3D.fromXYZ(0, 0, 0);
    const j = CartesianCoordinate3D.fromXYZ(deltaX, deltaY, deltaZ);

    return new CartesianOffset3D(i, j, tolerance);
  }

  // ==== Conversions
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {string}
 */
  toString(): string {
    return `${CartesianOffset3D.name} - `
      + `I: (${this.I.X}, ${this.I.Y}, ${this.I.Z}), `
      + `J: (${this.J.X}, ${this.J.Y}, ${this.J.Z})`;
  }

  /**
   * Converts to a single coordinate with the global origin aligned with the first coord of the offset.
   *
   * @return {*}  {CartesianCoordinate3D}
   * @memberof CartesianOffset3D
   */
  toCartesianCoordinate3D(): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      this.J.X - this.I.X,
      this.J.Y - this.I.Y,
      this.J.Z - this.I.Z,
      this.Tolerance
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {SphericalOffset}
 */
  toSphericalOffset(): SphericalOffset {
    return SphericalOffset.fromCoordinates(this.I.toSpherical(), this.J.toSpherical(), this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {CylindricalOffset}
 */
  toCylindricalOffset(): CylindricalOffset {
    return CylindricalOffset.fromCoordinates(this.I.toCylindrical(), this.J.toCylindrical(), this.Tolerance);
  }



  // ==== Public Methods
  /**
   * The total straight length of the offset.
   * @returns {number} System.Double.
   */
  length(): number {
    return AlgebraLibrary.SRSS(this.X, this.Y, this.Z);
  }

  /**
   * The slope angles of the offset.
   *
   * @return {*}  {Angle}
   * @memberof CartesianOffset
   */
  slopeAngles(): IAngle3D {
    return this.toCartesianCoordinate3D().anglesFromOrigin();
  }

  /**
   * The separation distance between the provided coordinates.
   *
   * @static
   * @param {CartesianCoordinate3D} coord1
   * @param {CartesianCoordinate3D} coord2
   * @param {CartesianCoordinate3D} coord3
   * @return {*}  {number}
   * @memberof CartesianOffset3D
   */
  static lengthBetween(
    coord1: CartesianCoordinate3D,
    coord2: CartesianCoordinate3D): number {
    return AlgebraLibrary.SRSS((coord2.X - coord1.X), (coord2.Y - coord1.Y), (coord2.Z - coord1.Z));
  }

  // ==== Comparisons
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianOffset3D} other
 * @returns {boolean}
 */
  equals(other: CartesianOffset3D): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.IsEqualTo(this.X, other.X, tolerance) &&
      Numbers.IsEqualTo(this.Y, other.Y, tolerance) &&
      Numbers.IsEqualTo(this.Z, other.Z, tolerance)
    );
  }

  // ==== Combinations
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianCoordinate3D} coord
 * @returns {CartesianCoordinate3D}
 */
  addToCoordinate(coord: CartesianCoordinate3D): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      coord.X + this.X,
      coord.Y + this.Y,
      coord.Z + this.Z,
      Generics.getToleranceBetween(coord, this));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianCoordinate3D} coord
 * @returns {CartesianCoordinate3D}
 */
  subtractFromCoordinate(coord: CartesianCoordinate3D): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      coord.X - this.X,
      coord.Y - this.Y,
      coord.Z - this.Z,
      Generics.getToleranceBetween(coord, this));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianCoordinate3D} coord
 * @returns {CartesianCoordinate3D}
 */
  subtractByCoordinate(coord: CartesianCoordinate3D): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      this.X - coord.X,
      this.Y - coord.Y,
      this.Z - coord.Z,
      Generics.getToleranceBetween(this, coord));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianOffset3D} offset
 * @returns {CartesianOffset3D}
 */
  addTo(offset: CartesianOffset3D): CartesianOffset3D {
    return CartesianOffset3D.fromCoordinates(
      CartesianCoordinate3D.atOrigin(),
      CartesianCoordinate3D.fromXYZ(
        this.X + offset.X,
        this.Y + offset.Y,
        this.Z + offset.Z
      ),
      Generics.getToleranceBetween(this, offset));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianOffset3D} offset
 * @returns {CartesianOffset3D}
 */
  subtractBy(offset: CartesianOffset3D): CartesianOffset3D {
    return new CartesianOffset3D(
      CartesianCoordinate3D.atOrigin(),
      this.toCartesianCoordinate3D().subtractBy(offset.toCartesianCoordinate3D()).toCartesianCoordinate3D(),
      Generics.getToleranceBetween(this, offset));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} multiplier
 * @returns {CartesianOffset3D}
 */
  multiplyBy(multiplier: number): CartesianOffset3D {
    return CartesianOffset3D.fromCoordinates(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} denominator
 * @returns {CartesianOffset3D}
 */
  divideBy(denominator: number): CartesianOffset3D {
    if (denominator == 0) { throw new DivideByZeroException(); }
    return CartesianOffset3D.fromCoordinates(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance);
  }
}
