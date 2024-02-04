import { Generics } from '../Generics';
import { IOffset } from '../IOffset';
import { Numbers } from '../Numbers';
import { Angle } from './Angle';
import { CartesianOffset } from './CartesianOffset';
import { PolarCoordinate } from './PolarCoordinate';

/**
 * Represents the difference between polar coordinates I (first) and J (second) in two-dimensional space.
 * @date 2/3/2024 - 9:04:58 AM
 *
 * @see {@link https://en.wikipedia.org/wiki/Polar_coordinate_system}
 * @export
 * @class PolarOffset
 * @typedef {PolarOffset}
 * @implements {IOffset<PolarCoordinate>}
 */
export class PolarOffset implements IOffset<PolarCoordinate> {

  readonly Tolerance: number;
  readonly I: PolarCoordinate;
  readonly J: PolarCoordinate;

  /**
   * 𝝙r = rj - ri.
   *
   * @readonly
   * @type {number}
   */
  get radius(): number {
    return (this.J.radius - this.I.radius);
  }

  /**
   * 𝝙φ = φj - φi.
   *
   * @readonly
   * @type {Angle}
   */
  get azimuth(): Angle {
    return this.J.azimuth.subtractBy(this.I.azimuth);
  }

  // ==== Initialization
  /**
   * Creates an instance of PolarOffset.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @constructor
   * @param {PolarCoordinate} i The first coordinate.
   * @param {PolarCoordinate} j The second coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   */
  protected constructor(
    i: PolarCoordinate,
    j: PolarCoordinate,
    tolerance: number = Numbers.ZeroTolerance) {
    this.I = i;
    this.J = j;
    this.Tolerance = tolerance;
  }

  /**
   * Creates an instance of CartesianOffset from the provided coordinates.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @static
   * @param {PolarCoordinate} i
   * @param {PolarCoordinate} j
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @returns {PolarOffset}
   */
  static fromCoordinates(
    i: PolarCoordinate,
    j: PolarCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarOffset {
    return new PolarOffset(i, j, tolerance)
  }

  /**
   * Creates an instance of PolarOffset from the specified offsets from the global origin.
   *
   * @static
   * @param {number} deltaRadius The radius offset from the origin.
   * @param {number} deltaAzimuth The rotation offset from the origin.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {CartesianOffset}
   * @memberof CartesianOffset
   */
  static fromOffsets(
    deltaRadius: number,
    deltaAzimuth: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ): PolarOffset {
    const i = PolarCoordinate.atOrigin();
    const j = PolarCoordinate.fromAngle(deltaRadius, deltaAzimuth, tolerance);

    return new PolarOffset(i, j, tolerance);
  }

  // ==== Conversions
  toString(): string {
    return `${PolarOffset.name} - `
      + `I: (r:${this.I.radius.toFixed(6)}, a:${this.I.azimuth.Radians.toFixed(6)}), `
      + `J: (r:${this.J.radius.toFixed(6)}, a:${this.J.azimuth.Radians.toFixed(6)})`;
  }

  /**
    * Converts to a single coordinate with the global origin aligned with the first point of the offset.
    *
    * @return {*}  {CartesianCoordinate}
    * @memberof CartesianOffset
    */
  toPolarCoordinate(): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      this.radius,
      this.azimuth,
      this.Tolerance);
  }

  /**
   * Converts to Cartesian offset.
   * @returns {CartesianOffset} CartesianOffset.
   */
  toCartesianOffset(): CartesianOffset {
    return CartesianOffset.fromCoordinates(this.I.toCartesian(), this.J.toCartesian(), this.Tolerance);
  }

  // ==== Public Methods
  /**
   * Calculates the total straight length between the offset points.
   * @returns {number} The total straight length.
   * @see {@link https://www.ck12.org/book/ck-12-trigonometry-concepts/section/6.2/}
   */
  arcLength(): number {
    return Math.sqrt(
      this.I.radius ** 2
      + this.J.radius ** 2
      - 2 * this.I.radius * this.J.radius * (Math.cos(this.azimuth.Radians))
    );
  }

  // TODO: Finish chordSeparation
  // chordSeparation(): number {

  // }

  // ==== Comparisons
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {PolarOffset} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: PolarOffset): boolean {
    const tolerance: number = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.AreEqual(this.radius, other.radius, tolerance) &&
      Numbers.AreEqual(this.azimuth.Radians, other.azimuth.Radians, tolerance)
    );
  }

  // ==== Combinations
  addToCoordinate(coord: PolarCoordinate): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      this.radius + coord.radius,
      coord.azimuth.addTo(this.azimuth),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractFromCoordinate(coord: PolarCoordinate): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      coord.radius - this.radius,
      coord.azimuth.subtractBy(this.azimuth),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractByCoordinate(coord: PolarCoordinate): PolarCoordinate {
    return PolarCoordinate.fromAngle(
      this.radius - coord.radius,
      this.azimuth.subtractBy(coord.azimuth),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  addTo(offset: PolarOffset): PolarOffset {
    return new PolarOffset(
      PolarCoordinate.atOrigin(),
      PolarCoordinate.fromAngle(
        this.radius + offset.radius,
        this.azimuth.addTo(offset.azimuth)
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  subtractBy(offset: PolarOffset): PolarOffset {
    return new PolarOffset(
      PolarCoordinate.atOrigin(),
      PolarCoordinate.fromAngle(
        this.radius + offset.radius,
        this.azimuth.subtractBy(offset.azimuth)
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  multiplyBy(multiplier: number): PolarOffset {
    return new PolarOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance
    );
  }

  divideBy(denominator: number): PolarOffset {
    return new PolarOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance
    );
  }
}