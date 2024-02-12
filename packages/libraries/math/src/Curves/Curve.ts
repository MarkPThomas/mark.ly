import { ICloneable } from "common/interfaces";

import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { CartesianParametricEquationXY } from "./Parametrics/Components/CartesianParametricEquationXY";
import { VectorParametric } from "../Vectors/VectorParametric";
import { ICurve } from "./ICurve";
import { CurveRange } from "./tools/CurveRange";
import { Angle } from "../Coordinates/Angle";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @export
 * @abstract
 * @class Curve
 * @typedef {Curve}
 * @implements {ICurve}
 * @implements {ICloneable<Curve>}
 */
export abstract class Curve implements ICurve, ICloneable<Curve> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @static
 * @readonly
 * @type {0.00001}
 */
  protected static readonly DEFAULT_TOLERANCE = 10E-6;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {number}
 */
  protected _tolerance: number
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @type {number}
 */
  public get Tolerance() {
    return this._tolerance;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @type {number}
 */
  public set Tolerance(value: number) {
    this._tolerance = value;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {VectorParametric}
 */
  protected _vectorParametric: VectorParametric;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @readonly
 * @type {VectorParametric}
 */
  protected get vectorParametric(): VectorParametric {
    if (this._vectorParametric == null) {
      this._vectorParametric = new VectorParametric(this.createParametricEquation());
    }
    return this._vectorParametric;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {CurveRange}
 */
  protected _range: CurveRange;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _limitStartDefault: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _limitEndDefault: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @readonly
 * @type {CurveRange}
 */
  get Range(): CurveRange {
    if (this._range == null) {
      this._range = CurveRange.fromCoordinatesOnCurve(this, this._limitStartDefault, this._limitEndDefault);
    }
    return this._range;
  }


  /**
 * Creates an instance of Curve.
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @constructor
 * @param {?number} [tolerance]
 */
  constructor(tolerance?: number) {
    this.Tolerance = tolerance ?? Curve.DEFAULT_TOLERANCE;
  }



  // #region Curve Position

  /// <summary>
  /// X-coordinate on the right curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
  /// </summary>
  /// <param name="angleRadians">Angle of rotation about the local origin, in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {(Angle | number)} angle
 * @returns {number}
 */
  public XbyRotationAboutOrigin(angle: Angle | number): number {

    return this.vectorParametric.CurveParametric.Xcomponent.ValueAt(this.asRadians(angle));
  }

  /// <summary>
  /// Y-coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
  /// </summary>
  /// <param name="angleRadians">Angle of rotation about the local origin, in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {(Angle | number)} angle
 * @returns {number}
 */
  public YbyRotationAboutOrigin(angle: Angle | number): number {

    return this.vectorParametric.CurveParametric.Ycomponent.ValueAt(this.asRadians(angle));
  }

  /// <summary>
  /// The x-component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected xByParameter(parameter: number): number {

    return this.vectorParametric.CurveParametric.Xcomponent.ValueAt(parameter);
  }

  /// <summary>
  /// The y-component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected yByParameter(parameter: number): number {

    return this.vectorParametric.CurveParametric.Ycomponent.ValueAt(parameter);
  }

  /// <summary>
  /// The x-component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected xPrimeByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Xcomponent.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The y-component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected yPrimeByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Ycomponent.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The x-component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected xPrimeDoubleByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Xcomponent.Differential?.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The y-component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {number}
 */
  protected yPrimeDoubleByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Ycomponent.Differential?.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /**
   * Creates the parametric vector.
   *
   * @protected
   * @abstract
   * @return {*}  {CartesianParametricEquationXY}
   * @memberof Curve
   */
  protected abstract createParametricEquation(): CartesianParametricEquationXY;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {(Angle | number)} angle
 * @returns {*}
 */
  protected asRadians(angle: Angle | number) {
    return angle instanceof Angle ? angle.Radians : angle;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @abstract
 * @returns {Curve}
 */
  public abstract clone(): Curve;
}