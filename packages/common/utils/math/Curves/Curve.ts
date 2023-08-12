import { ICloneable } from "../../../interfaces";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { CartesianParametricEquationXY } from "../Parametrics/Components/CartesianParametricEquationXY";
import { VectorParametric } from "../Vectors/VectorParametric";
import { ICurve } from "./ICurve";
import { CurveRange } from "./tools/CurveRange";

export abstract class Curve implements ICurve, ICloneable<Curve> {
  protected readonly DEFAULT_TOLERANCE = 10E-6;

  protected _tolerance: number
  public get Tolerance() {
    return this._tolerance;
  }

  public set Tolerance(value: number) {
    this._tolerance = value;
  }

  protected _vectorParametric: VectorParametric;
  protected get vectorParametric(): VectorParametric {
    if (this._vectorParametric == null) {
      this._vectorParametric = new VectorParametric(this.createParametricEquation());
    }
    return this._vectorParametric;
  }

  protected _range: CurveRange;
  protected _limitStartDefault: CartesianCoordinate;
  protected _limitEndDefault: CartesianCoordinate;
  get Range(): CurveRange {
    if (this._range == null) {
      this._range = CurveRange.fromCoordinatesOnCurve(this, this._limitStartDefault, this._limitEndDefault);
    }
    return this._range;
  }


  constructor(tolerance?: number) {
    this.Tolerance = tolerance ?? this.DEFAULT_TOLERANCE;
  }



  // #region Curve Position

  /// <summary>
  /// X-coordinate on the right curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
  /// </summary>
  /// <param name="angleRadians">Angle of rotation about the local origin, in radians.</param>
  /// <returns>System.Double.</returns>
  public XbyRotationAboutOrigin(angleRadians: number): number {

    return this.vectorParametric.CurveParametric.Xcomponent.ValueAt(angleRadians);
  }

  /// <summary>
  /// Y-coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
  /// </summary>
  /// <param name="angleRadians">Angle of rotation about the local origin, in radians.</param>
  /// <returns>System.Double.</returns>
  public YbyRotationAboutOrigin(angleRadians: number): number {

    return this.vectorParametric.CurveParametric.Ycomponent.ValueAt(angleRadians);
  }

  /// <summary>
  /// The x-component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected xByParameter(parameter: number): number {

    return this.vectorParametric.CurveParametric.Xcomponent.ValueAt(parameter);
  }

  /// <summary>
  /// The y-component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected yByParameter(parameter: number): number {

    return this.vectorParametric.CurveParametric.Ycomponent.ValueAt(parameter);
  }

  /// <summary>
  /// The x-component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected xPrimeByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Xcomponent.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The y-component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected yPrimeByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Ycomponent.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The x-component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected xPrimeDoubleByParameter(parameter: number): number {
    const value = this.vectorParametric.CurveParametric.Xcomponent.Differential?.Differential?.ValueAt(parameter);

    return value ?? 0;
  }

  /// <summary>
  /// The y-component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
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

  public abstract Clone(): Curve;
}