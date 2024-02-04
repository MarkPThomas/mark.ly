import { Angle } from "../Coordinates/Angle";
import { Generics } from "../Generics";
import { IOffset } from "../IOffset";
import { Numbers } from "../Numbers";
import { CartesianOffset3D } from "./CartesianOffset3D";
import { CylindricalCoordinate } from "./CylindricalCoordinate";
import { SphericalOffset } from "./SphericalOffset";


/**
 * Represents the difference between cylindrical coordinates I (first) and J (second) in two-dimensional space.
 * @date 2/3/2024 - 9:04:58 AM
 *
 * @see {@link https://en.wikipedia.org/wiki/Cylindrical_coordinate_system}
 * @export
 * @class CylindricalOffset
 * @typedef {CylindricalOffset}
 * @implements {IOffset<CylindricalCoordinate>}
 */
export class CylindricalOffset implements IOffset<CylindricalCoordinate> {

  readonly Tolerance: number;
  readonly I: CylindricalCoordinate;
  readonly J: CylindricalCoordinate;

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

  /**
   * 𝝙h = hj - hi.
   *
   * @readonly
   * @type {number}
   */
  get height(): number {
    return (this.J.height - this.I.height);
  }

  // ==== Initialization
  /**
   * Initializes a new instance of the CylindricalOffset struct.
   * @param {CylindricalCoordinate} i The first coordinate.
   * @param {CylindricalCoordinate} j The second coordinate.
   * @param {number} tolerance The tolerance.
   */
  constructor(
    i: CylindricalCoordinate,
    j: CylindricalCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.I = i;
    this.J = j;
    this.Tolerance = tolerance;
  }

  /**
   * Creates an instance of CylindricalOffset from the provided coordinates.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @static
   * @param {CylindricalCoordinate} i
   * @param {CylindricalCoordinate} j
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @returns {CylindricalOffset}
   */
  static fromCoordinates(
    i: CylindricalCoordinate,
    j: CylindricalCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalOffset {
    return new CylindricalOffset(i, j, tolerance)
  }

  /**
   * Creates an instance of CylindricalOffset from the specified offsets from the global origin.
   *
   * @static
   * @param {number} deltaRadius The radius offset from the origin.
   * @param {number} deltaAzimuth The rotation offset from the origin in the horizontal plane.
   * @param {number} deltaInclination The rotation offset from the origin in the vertical dimension.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {SphericalOffset}
   * @memberof SphericalOffset
   */
  static fromOffsets(
    deltaRadius: number,
    deltaAzimuth: Angle,
    height: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CylindricalOffset {
    const i = CylindricalCoordinate.atOrigin();
    const j = CylindricalCoordinate.fromAngle(deltaRadius, deltaAzimuth, height, tolerance);

    return new CylindricalOffset(i, j, tolerance);
  }

  // ==== Conversions
  toString(): string {
    return `${CylindricalOffset.name} - `
      + `I: (r:${this.I.radius.toFixed(6)}, a:${this.I.azimuth.Radians.toFixed(6)}, h:${this.I.height.toFixed(6)}), `
      + `J: (r:${this.J.radius.toFixed(6)}, a:${this.J.azimuth.Radians.toFixed(6)}, h:${this.J.height.toFixed(6)})`;
  }

  /**
    * Converts to a single coordinate with the global origin aligned with the first point of the offset.
    *
    * @return {*}  {SphericalCoordinate}
    * @memberof CylindricalOffset
    */
  toCylindricalCoordinate(): CylindricalCoordinate {
    return CylindricalCoordinate.fromAngle(
      this.radius,
      this.azimuth,
      this.height,
      this.Tolerance);
  }

  /**
   * Converts to Cartesian offset.
   * @returns {CartesianOffset} CartesianOffset.
   */
  toCartesianOffset(): CartesianOffset3D {
    return CartesianOffset3D.fromCoordinates(this.I.toCartesian(), this.J.toCartesian(), this.Tolerance);
  }

  toSphericalOffset(): SphericalOffset {
    return SphericalOffset.fromCoordinates(this.I.toSpherical(), this.J.toSpherical(), this.Tolerance);
  }

  // ==== Public Methods
  /**
   * The total length between the offset points.
   * @returns {number} The total length.
   */
  public arcLength(): number {
    return Math.sqrt(
      this.I.radius ** 2
      + this.J.radius ** 2
      - 2 * this.I.radius * this.J.radius *
      (Math.cos(this.I.azimuth.Radians - this.J.azimuth.Radians)) + (this.J.height - this.I.height) ** 2
    );
  }

  // TODO: Finish chordSeparation
  // chordSeparation(): number {

  // }

  // ==== Comparisons
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {CylindricalOffset} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: CylindricalOffset): boolean {
    const tolerance: number = Math.min(this.Tolerance, other.Tolerance);
    return (
      this.radius.toFixed(tolerance) === other.radius.toFixed(tolerance) &&
      this.height.toFixed(tolerance) === other.height.toFixed(tolerance) &&
      this.azimuth.Radians.toFixed(tolerance) === other.azimuth.Radians.toFixed(tolerance)
    );
  }

  // ==== Combinations
  addToCoordinate(coord: CylindricalCoordinate): CylindricalCoordinate {
    return CylindricalCoordinate.fromAngle(
      this.radius + coord.radius,
      coord.azimuth.addTo(this.azimuth),
      this.height + coord.height,
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractFromCoordinate(coord: CylindricalCoordinate): CylindricalCoordinate {
    return CylindricalCoordinate.fromAngle(
      coord.radius - this.radius,
      coord.azimuth.subtractBy(this.azimuth),
      coord.height - this.height,
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractByCoordinate(coord: CylindricalCoordinate): CylindricalCoordinate {
    return CylindricalCoordinate.fromAngle(
      this.radius - coord.radius,
      this.azimuth.subtractBy(coord.azimuth),
      this.height - coord.height,
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  addTo(offset: CylindricalOffset): CylindricalOffset {
    return new CylindricalOffset(
      CylindricalCoordinate.atOrigin(),
      CylindricalCoordinate.fromAngle(
        this.radius + offset.radius,
        this.azimuth.addTo(offset.azimuth),
        this.height + offset.height,
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  subtractBy(offset: CylindricalOffset): CylindricalOffset {
    return new CylindricalOffset(
      CylindricalCoordinate.atOrigin(),
      CylindricalCoordinate.fromAngle(
        this.radius - offset.radius,
        this.azimuth.subtractBy(offset.azimuth),
        this.height - offset.height,
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  multiplyBy(multiplier: number): CylindricalOffset {
    return new CylindricalOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance
    );
  }

  divideBy(denominator: number): CylindricalOffset {
    return new CylindricalOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance
    );
  }
}