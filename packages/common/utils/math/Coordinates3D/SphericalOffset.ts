import { Angle } from "../Coordinates/Angle";
import { Generics } from "../Generics";
import { IOffset } from "../IOffset";
import { Numbers } from "../Numbers";
import { CartesianOffset3D } from "./CartesianOffset3D";
import { CylindricalOffset } from "./CylindricalOffset";
import { SphericalCoordinate } from "./SphericalCoordinate";

/**
 * Represents the difference between spherical coordinates I (first) and J (second) in two-dimensional space.
 * @date 2/3/2024 - 9:04:58 AM
 *
 * @see {@link https://en.wikipedia.org/wiki/Spherical_coordinate_system}
 * @export
 * @class SphericalOffset
 * @typedef {SphericalOffset}
 * @implements {IOffset<SphericalCoordinate>}
 */
export class SphericalOffset implements IOffset<SphericalCoordinate> {

  readonly Tolerance: number;
  readonly I: SphericalCoordinate;
  readonly J: SphericalCoordinate;

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
   * 𝝙θ = θj - θi.
   *
   * @readonly
   * @type {Angle}
   */
  get inclination(): Angle {
    return this.J.inclination.subtractBy(this.I.inclination);
  }

  // ==== Initialization
  /**
   * Creates an instance of SphericalOffset.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @constructor
   * @param {SphericalCoordinate} i The first coordinate.
   * @param {SphericalCoordinate} j The second coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   */
  constructor(
    i: SphericalCoordinate,
    j: SphericalCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.I = i;
    this.J = j;
    this.Tolerance = tolerance;
  }

  /**
   * Creates an instance of SphericalOffset from the provided coordinates.
   * @date 2/3/2024 - 9:04:58 AM
   *
   * @static
   * @param {SphericalCoordinate} i
   * @param {SphericalCoordinate} j
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @returns {SphericalOffset}
   */
  static fromCoordinates(
    i: SphericalCoordinate,
    j: SphericalCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalOffset {
    return new SphericalOffset(i, j, tolerance)
  }

  /**
   * Creates an instance of PolarOffset from the specified offsets from the global origin.
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
    deltaInclination: Angle,
    tolerance: number = Numbers.ZeroTolerance
  ): SphericalOffset {
    const i = SphericalCoordinate.atOrigin();
    const j = SphericalCoordinate.fromAngle(deltaRadius, deltaAzimuth, deltaInclination, tolerance);

    return new SphericalOffset(i, j, tolerance);
  }

  // ==== Conversions
  toString(): string {
    return `${SphericalOffset.name} - `
      + `I: (r:${this.I.radius.toFixed(6)}, a:${this.I.azimuth.Radians.toFixed(6)}, i:${this.I.inclination.Radians.toFixed(6)}), `
      + `J: (r:${this.J.radius.toFixed(6)}, a:${this.J.azimuth.Radians.toFixed(6)}, i:${this.J.inclination.Radians.toFixed(6)})`;
  }

  /**
    * Converts to a single coordinate with the global origin aligned with the first point of the offset.
    *
    * @return {*}  {SphericalCoordinate}
    * @memberof SphericalOffset
    */
  toSphericalCoordinate(): SphericalCoordinate {
    return SphericalCoordinate.fromAngle(
      this.radius,
      this.azimuth,
      this.inclination,
      this.Tolerance);
  }

  /**
   * Converts to Cartesian offset.
   * @returns {CartesianOffset} CartesianOffset.
   */
  toCartesianOffset(): CartesianOffset3D {
    return CartesianOffset3D.fromCoordinates(this.I.toCartesian(), this.J.toCartesian(), this.Tolerance);
  }

  toCylindricalOffset(): CylindricalOffset {
    return CylindricalOffset.fromCoordinates(this.I.toCylindrical(), this.J.toCylindrical(), this.Tolerance);
  }

  // ==== Public Methods
  /**
   * Calculates the total length between the offset points.
   * @returns {number} The total length.
   */
  arcLength(): number {
    return Math.sqrt(
      this.I.radius ** 2
      + this.J.radius ** 2
      - 2 * this.I.radius * this.J.radius
      * (
        Math.sin(this.I.inclination.Radians) * Math.sin(this.J.inclination.Radians) * Math.cos(this.I.azimuth.Radians - this.J.azimuth.Radians)
        + Math.cos(this.I.inclination.Radians) * Math.cos(this.J.inclination.Radians)
      )
    );
  }

  // TODO: Finish chordSeparation
  // chordSeparation(): number {

  // }

  // ==== Comparisons
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {SphericalOffset} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: SphericalOffset): boolean {
    const tolerance: number = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.AreEqual(this.radius, other.radius, tolerance) &&
      Numbers.AreEqual(this.azimuth.Radians, other.azimuth.Radians, tolerance) &&
      Numbers.AreEqual(this.inclination.Radians, other.inclination.Radians, tolerance)
    );
  }

  // ==== Combinations
  addToCoordinate(coord: SphericalCoordinate): SphericalCoordinate {
    return SphericalCoordinate.fromAngle(
      this.radius + coord.radius,
      coord.azimuth.addTo(this.azimuth),
      coord.inclination.addTo(this.inclination),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractFromCoordinate(coord: SphericalCoordinate): SphericalCoordinate {
    return SphericalCoordinate.fromAngle(
      coord.radius - this.radius,
      coord.azimuth.subtractBy(this.azimuth),
      coord.inclination.subtractBy(this.inclination),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  subtractByCoordinate(coord: SphericalCoordinate): SphericalCoordinate {
    return SphericalCoordinate.fromAngle(
      this.radius - coord.radius,
      this.azimuth.subtractBy(coord.azimuth),
      this.inclination.subtractBy(coord.inclination),
      Math.max(coord.Tolerance, this.Tolerance)
    );
  }

  addTo(offset: SphericalOffset): SphericalOffset {
    return new SphericalOffset(
      SphericalCoordinate.atOrigin(),
      SphericalCoordinate.fromAngle(
        this.radius + offset.radius,
        this.azimuth.addTo(offset.azimuth),
        this.inclination.subtractBy(offset.inclination)
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  subtractBy(offset: SphericalOffset): SphericalOffset {
    return new SphericalOffset(
      SphericalCoordinate.atOrigin(),
      SphericalCoordinate.fromAngle(
        this.radius - offset.radius,
        this.azimuth.subtractBy(offset.azimuth),
        this.inclination.subtractBy(offset.inclination)
      ),
      Generics.getToleranceBetween(this, offset)
    );
  }

  multiplyBy(multiplier: number): SphericalOffset {
    return new SphericalOffset(
      this.I.multiplyBy(multiplier),
      this.J.multiplyBy(multiplier),
      this.Tolerance
    );
  }

  divideBy(denominator: number): SphericalOffset {
    return new SphericalOffset(
      this.I.divideBy(denominator),
      this.J.divideBy(denominator),
      this.Tolerance
    );
  }
}
