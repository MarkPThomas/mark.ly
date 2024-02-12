import { ArgumentOutOfRangeException, NotSupportedException } from "common/errors/exceptions";
import { ICloneable } from "common/interfaces";

import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { Curve } from "../Curve";
import { ICurvePositionCartesian } from "../ICurvePositionCartesian";

/**
 * Handles limits applied to curves.
 *
 * @export
 * @class CurveLimit
 * @implements {ICloneable<CurveLimit>}
 */
export class CurveLimit implements ICloneable<CurveLimit> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @private
 * @type {Curve}
 */
  private _curve: Curve;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _limit: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @readonly
 * @type {CartesianCoordinate}
 */
  get Limit(): CartesianCoordinate {
    return this._limit;
  }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 */
  ;

  /**
 * Creates an instance of CurveLimit.
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @constructor
 * @protected
 * @param {Curve} curve
 */
  protected constructor(curve: Curve) {
    this._curve = curve;
    this._limit = new CartesianCoordinate(0, 0, curve.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @static
 * @param {Curve} curve
 * @returns {CurveLimit}
 */
  static fromCurve(curve: Curve) {
    return new CurveLimit(curve);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @static
 * @param {Curve} curve
 * @param {CartesianCoordinate} defaultLimit
 * @returns {CurveLimit}
 */
  static fromCoordinatesOnCurve(curve: Curve, defaultLimit: CartesianCoordinate) {
    const curveLimit = new CurveLimit(curve);
    curveLimit._limit = defaultLimit;

    return curveLimit;
  }

  /// <summary>
  /// Sets the limit by the x-coordinate.
  /// </summary>
  /// <param name="xCoordinate">The x coordinate.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @param {number} xCoordinate
 */
  public SetLimitByX(xCoordinate: number) {
    const curve = this._curve as unknown as ICurvePositionCartesian;
    if (!curve) {
      throw new NotSupportedException(`Curve ${this._curve} cannot be represented in cartesian coordinates.`);
    }

    const tolerance = this._limit.Tolerance;
    this._limit = CurveLimit.GetLimitByX(xCoordinate, curve);
    this._limit.Tolerance = tolerance;
  }

  /// <summary>
  /// Sets the limit by the y-coordinate.
  /// </summary>
  /// <param name="yCoordinate">The y coordinate.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @param {number} yCoordinate
 */
  public SetLimitByY(yCoordinate: number) {
    const curve = this._curve as unknown as ICurvePositionCartesian;
    if (!curve) {
      throw new NotSupportedException(`Curve ${this._curve} cannot be represented in cartesian coordinates.`);
    }

    const tolerance = this._limit.Tolerance;
    this._limit = CurveLimit.GetLimitByY(yCoordinate, curve);
    this._limit.Tolerance = tolerance;
  }

  // /// <summary>
  // /// Sets the limit by rotation.
  // /// </summary>
  // /// <param name="angleRadians">The angle in radians.</param>
  // public SetLimitByRotation(angleRadians: number) {
  //   const curve = this._curve as unknown as ICurvePositionPolar;
  //   // Currently made to work with curves that have parametric equations in rotations.
  //   // Need to flesh this out more. Parametric vector has polar transformation?
  //   if (!curve) {
  //     throw new NotSupportedException(`Curve ${this._curve} cannot be represented in polar coordinates.`);
  //   }

  //   const tolerance = this._limit.Tolerance;
  //   this._limit = CurveLimit.GetLimitByRotation(angleRadians, curve);
  //   this._limit.Tolerance = tolerance;
  // }

  /// <summary>
  /// Sets the limit by coordinate, if the coordinate lies on the curve.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @param {CartesianCoordinate} coordinate
 */
  public SetLimitByCoordinate(coordinate: CartesianCoordinate) {
    const curve = this._curve as unknown as ICurvePositionCartesian;
    if (!curve) {
      throw new NotSupportedException(`Curve ${this._curve} cannot be represented in cartesian coordinates.`);
    }

    const tolerance = this._limit.Tolerance;
    this._limit = CurveLimit.GetLimitByCoordinate(coordinate, curve);
    this._limit.Tolerance = tolerance;
  }

  // /// <summary>
  // /// The limit in polar coordinates.
  // /// </summary>
  // /// <returns>PolarCoordinate.</returns>
  // public LimitPolar(): PolarCoordinate {
  //   return this.Limit;
  // }

  /// <summary>
  /// Gets the limit by the x-coordinate.
  /// </summary>
  /// <param name="xCoordinate">The x coordinate.</param>
  /// <param name="curve">The curve.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @static
 * @param {number} xCoordinate
 * @param {ICurvePositionCartesian} curve
 * @returns {CartesianCoordinate}
 */
  public static GetLimitByX(xCoordinate: number, curve: ICurvePositionCartesian): CartesianCoordinate {
    const yCoordinate = curve.YatX(xCoordinate);
    return new CartesianCoordinate(xCoordinate, yCoordinate);
  }

  /// <summary>
  /// Gets the limit by the y-coordinate.
  /// </summary>
  /// <param name="yCoordinate">The y coordinate.</param>
  /// <param name="curve">The curve.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @static
 * @param {number} yCoordinate
 * @param {ICurvePositionCartesian} curve
 * @returns {CartesianCoordinate}
 */
  public static GetLimitByY(yCoordinate: number, curve: ICurvePositionCartesian): CartesianCoordinate {
    const xCoordinate = curve.XatY(yCoordinate);
    return new CartesianCoordinate(xCoordinate, yCoordinate);
  }

  /// <summary>
  /// Gets the limit by rotation.
  /// </summary>
  /// <param name="angleRadians">The angle in radians.</param>
  /// <param name="curve">The curve.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @static
 * @param {number} angleRadians
 * @param {Curve} curve
 * @returns {CartesianCoordinate}
 */
  public static GetLimitByRotation(angleRadians: number, curve: Curve): CartesianCoordinate {
    // Currently made to work with curves that have parametric equations in rotations.
    //  Need to flesh this out more. Parametric vector has polar transformation?
    const xCoordinate = curve.XbyRotationAboutOrigin(angleRadians);
    const yCoordinate = curve.YbyRotationAboutOrigin(angleRadians);
    return new CartesianCoordinate(xCoordinate, yCoordinate);
  }

  /// <summary>
  /// Gets the limit by coordinate, if the coordinate lies on the curve.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="curve">The curve.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} coordinate
 * @param {ICurvePositionCartesian} curve
 * @returns {CartesianCoordinate}
 */
  public static GetLimitByCoordinate(coordinate: CartesianCoordinate, curve: ICurvePositionCartesian): CartesianCoordinate {
    if (!curve.IsIntersectingCoordinate(coordinate)) {
      throw new ArgumentOutOfRangeException(
        `Coordinate ${coordinate} cannot be used as a limit as it does not lie on the curve ${curve} provided.`
      );
    }
    return coordinate;
  }

  /// <summary>
  /// Clones the limit.
  /// </summary>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @returns {CurveLimit}
 */
  public clone(): CurveLimit {
    const curveLimit = new CurveLimit(this._curve);
    curveLimit._limit = this._limit;
    return curveLimit;
  }
}