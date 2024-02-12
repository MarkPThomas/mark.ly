import { ICloneable } from "common/interfaces";

import { Angle } from "../../Coordinates/Angle";
import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../../Coordinates/CartesianOffset";
import { PolarOffset } from "../../Coordinates/PolarOffset";
import { Numbers } from "../../Numbers";
import { Curve } from "../Curve";
import { CurveLimit } from "./CurveLimit";

/**
 * Handles Limit ranges applied to curves.
 * @implements {ICloneable}
 */
export class CurveRange implements ICloneable<CurveRange> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @readonly
 * @type {Curve}
 */
  readonly curve: Curve;

  /**
   * The Limit where the curve starts.
   * @type {CurveLimit}
   */
  readonly start: CurveLimit;

  /**
   * The Limit where the curve ends.
   * @type {CurveLimit}
   */
  readonly end: CurveLimit;

  /**
   * Initializes a new instance of the `CurveRange` class.
   * @param {Curve} curve The curve.
   * @param {CartesianCoordinate} defaultStartLimit The default start Limit.
   * @param {CartesianCoordinate} defaultEndLimit The default end Limit.
   * @internal
   */
  private constructor(
    curve: Curve,
    defaultStartLimit?: CartesianCoordinate,
    defaultEndLimit?: CartesianCoordinate
  ) {

    this.start = defaultStartLimit
      ? CurveLimit.fromCoordinatesOnCurve(curve, defaultStartLimit) :
      CurveLimit.fromCurve(curve);

    this.end = defaultEndLimit
      ? CurveLimit.fromCoordinatesOnCurve(curve, defaultEndLimit) :
      CurveLimit.fromCurve(curve);

    this.curve = curve;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @static
 * @param {Curve} curve
 * @returns {CurveRange}
 */
  static fromCurve(curve: Curve): CurveRange {
    return new CurveRange(curve);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @static
 * @param {Curve} curve
 * @param {CartesianCoordinate} defaultStartLimit
 * @param {CartesianCoordinate} defaultEndLimit
 * @returns {CurveRange}
 */
  static fromCoordinatesOnCurve(
    curve: Curve,
    defaultStartLimit: CartesianCoordinate,
    defaultEndLimit: CartesianCoordinate
  ): CurveRange {
    return new CurveRange(curve, defaultStartLimit, defaultEndLimit);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @static
 * @param {CurveRange} range
 * @returns {CurveRange}
 */
  static fromRange(range: CurveRange): CurveRange {
    return new CurveRange(range.curve, range.start.Limit, range.end.Limit);
  }


  /**
   * Returns a string that represents the current object.
   * @returns {string} A string that represents the current object.
   */
  public toString(): string {
    return (
      `${CurveRange.name} - `
      + `Start: (X: ${this.start.Limit.X}, Y: ${this.start.Limit.Y}), `
      + `End: (X: ${this.end.Limit.X}, Y: ${this.end.Limit.Y})`
    );
  }

  /**
   * Converts to cartesian offset.
   * @returns {CartesianOffset}
   */
  public toOffset(): CartesianOffset {
    return this.end.Limit.offsetFrom(this.start.Limit);
  }

  /**
   * Converts to polar offset.
   * @returns {PolarOffset}
   */
  public toOffsetPolar(): PolarOffset {
    return this.end.Limit.offsetFrom(this.start.Limit).toPolarOffset();
  }

  /**
   * The linear distance of the range.
   * @returns {number}
   */
  public LengthLinear(): number {
    return this.toOffset().length();
  }

  /**
   * The x-axis distance of the range.
   * @returns {number}
   */
  public LengthX(): number {
    return this.toOffset().X;
  }

  /**
   * The y-axis distance of the range.
   * @returns {number}
   */
  public lengthY(): number {
    return this.toOffset().Y;
  }

  /**
   * The radial distance of the range.
   * @returns {number}
   */
  public lengthRadius(): number {
    return this.toOffsetPolar().radius;
  }

  /**
   * The rotational distance of the range.
   * @returns {Angle}
   */
  public lengthRotation(): Angle {
    return this.toOffsetPolar().azimuth;
  }

  /**
   * The rotational distance of the range, in radians.
   * @returns {number}
   */
  public lengthRotationRadians(): number {
    return this.lengthRotation().Radians;
  }

  /**
   * The rotational distance of the range, in degrees.
   * @returns {number}
   */
  public lengthRotationDegrees(): number {
    return this.lengthRotation().Degrees;
  }

  /**
   * Validates the angular position provided based on +/- values of a half circle.
   * @param {number} position The angular position, must be between -π and +π.
   * @param {number} [tolerance=0] The tolerance.
   * @throws {RangeError} Relative position must be between -π and +π, but was {position}.
   */
  public static validateRangeLimitRotationalHalfCirclePosition(
    position: number,
    tolerance: number = 0
  ): void {
    if (!Numbers.IsWithinInclusive(position, -1 * Math.PI, Math.PI, tolerance)) {
      throw new RangeError(`Position must be between -π and +π, but was ${position}.`);
    }
  }

  /**
   * Validates the angular position provided based on + values of a full circle.
   * @param {number} position The relative position, s. Relative position must be between 0 and +2π.
   * @param {number} [tolerance=0] The tolerance.
   * @throws {RangeError} Relative position must be between 0 and +2π, but was {position}.
   */
  public static validateRangeLimitRotationalFullCirclePosition(
    position: number,
    tolerance: number = 0
  ): void {
    if (!Numbers.IsWithinInclusive(position, 0, 2 * Math.PI, tolerance)) {
      throw new RangeError(`Position must be between 0 and +2π, but was ${position}.`);
    }
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {CurveHandle} A new object that is a copy of this instance.
   */
  public clone(): CurveRange {
    return CurveRange.fromRange(this);
  }
}