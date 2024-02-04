import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { Numbers } from "../../Numbers";
import { Curve } from "../Curve";
import { CurveRange } from "./CurveRange";

/**
 * Returns coordinates on a curve for the relative position provided.
 * @static
 */
export class RelativePosition {
  /**
   * Validates the relative position provided.
   * @param {number} sRelative The relative position, s. Relative position must be between 0 and 1.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for relative comparisons of floating point numbers.
   * @throws {Error} Relative position must be between 0 and 1, but was {sRelative}.
   */
  public static ValidateRangeLimitRelativePosition(sRelative: number, tolerance: number = Numbers.ZeroTolerance): void {
    if (!Numbers.IsWithinInclusive(sRelative, 0, 1, tolerance)) {
      throw new Error(`Relative position must be between 0 and 1, but was ${sRelative}.`);
    }
  }

  /**
   * Returns a coordinate that is a linear interpolation in cartesian coordinates within the range provided.
   * @param {number} sRelative The relative position, s. Relative position must be between 0 and 1.
   * @param {CurveRange} range The range.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for relative comparisons of floating point numbers.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static CoordinateInterpolated(
    sRelative: number,
    range: CurveRange,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    RelativePosition.ValidateRangeLimitRelativePosition(sRelative, tolerance);
    return (range.toOffset().multiplyBy(sRelative)).toCartesianCoordinate();
  }

  /**
   * Returns a coordinate that is a linear interpolation in polar coordinates within the range provided.
   * @param {number} sRelative The relative position, s. Relative position must be between 0 and 1.
   * @param {CurveRange} range The range.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for relative comparisons of floating point numbers.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static CoordinateInterpolatedPolar(
    sRelative: number,
    range: CurveRange,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    RelativePosition.ValidateRangeLimitRelativePosition(sRelative, tolerance);
    return (range.toOffset().multiplyBy(sRelative)).toCartesianCoordinate();
  }

  // /**
  //  * Returns a coordinate that is a polar interpolation within the range provided for +/- half circles.
  //  * @param {number} sRelative The relative position, s. Relative position must be between -π and +π.
  //  * @param {CurveRange} range The range.
  //  * @returns {CartesianCoordinate} CartesianCoordinate.
  //  */
  // static CoordinateInterpolatedPolarHalfCirclePosition(
  //   sRelative: number,
  //   range: CurveRange
  // ): CartesianCoordinate {
  //   return (range.toOffsetPolar().multiplyBy(sRelative)).toPolarCoordinate();
  // }

  // /**
  //  * Returns a coordinate that is a polar interpolation within the range provided for full circle.
  //  * @param {number} sRelative The relative position, s. Relative position must be between 0 and +2π.
  //  * @param {CurveRange} range The range.
  //  * @returns {CartesianCoordinate} CartesianCoordinate.
  //  */
  // static CoordinateInterpolatedPolarFullCirclePosition(
  //   sRelative: number,
  //   range: CurveRange
  // ): CartesianCoordinate {
  //   return (range.toOffsetPolar().multiplyBy(sRelative)).toPolarCoordinate();
  // }

  /**
   * Returns a coordinate that is at the relative position on the curve provided within ranges specified for the curve.
   * @param {number} sRelative The relative position, s. Relative position must be between 0 and 1.
   * @param {Curve} curve The curve.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance used for relative comparisons of floating point numbers.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   * @throws {Error} NotImplementedException.
   */
  public static Coordinate(sRelative: number, curve: Curve, tolerance: number = Numbers.ZeroTolerance): CartesianCoordinate {
    RelativePosition.ValidateRangeLimitRelativePosition(sRelative, tolerance);
    throw new Error("NotImplementedException");
  }
}