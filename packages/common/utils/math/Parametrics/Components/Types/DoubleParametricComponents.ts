import { DivideByZeroException } from "../../../../../errors/exceptions";
import { Curve } from "../../../Curves/Curve";
import { ParametricEquation } from "../ParametricEquation";
import { DoubleParametricComponent } from "./DoubleParametricComponent";
import { ParametricComponents } from "./ParametricComponents";



/// <summary>
/// Class containing the type-defined component placeholders of a parametric equation in <see cref="double"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains functions to implement scaling of the parametric equations.
/// Implements the <see cref="ParametricComponents{Double, T, Curve}" />
/// </summary>
/// <typeparam name="T"></typeparam>
/// <seealso cref="ParametricComponents{Double, T, Curve}" />
abstract class LinearNumericParametricComponents<T extends ParametricEquation<number>> extends
  ParametricComponents<number, T, Curve> {

  constructor(parent: Curve) {
    super(parent);
  }

  // #region Methods: Parametric Equations and Differentials

  // TODO: Define one scaling function in base class where scaling * is defined here.

  /// <summary>
  /// The scaled component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected baseByParameterScaled(parameter: number) {
    return this._scale * this.BaseByParameter(parameter);
  }


  /// <summary>
  /// The scaled component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected primeByParameterScaled(parameter: number) {
    return this._scale * this.PrimeByParameter(parameter);
  }


  /// <summary>
  /// The scaled component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  protected primeDoubleByParameterScaled(parameter: number) {
    return this._scale * this.PrimeDoubleByParameter(parameter);
  }
}

/// <summary>
/// Class containing the assigned components of a parametric equation in <see cref="double"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains operators to implement scaling of the parametric equations.
/// Implements the <see cref="LinearParametricComponents{LinearParametricComponent}" />
/// </summary>
export abstract class DoubleParametricComponents extends LinearNumericParametricComponents<DoubleParametricComponent> {
  constructor(parent: Curve) {
    super(parent);

    this.initialize();
  }


  /**
   * Initializes the appropriate component type with scaled functions and differentials.
   *
   * @protected
   * @memberof DoubleParametricComponents
   */
  protected initialize() {
    this._doublePrime = new DoubleParametricComponent(this.primeDoubleByParameterScaled);
    this._prime = new DoubleParametricComponent(this.primeByParameterScaled, this._doublePrime);
    this._base = new DoubleParametricComponent(this.baseByParameterScaled, this._prime);

    this.initializeComponents();
  }

  /**
   * Mulitplies the scale at which the parametric output is generated.
   *
   * @param {number} multiplier
   * @return {*}  {DoubleParametricComponents}
   * @memberof DoubleParametricComponents
   */
  public multiplyBy(multiplier: number): DoubleParametricComponents {
    const parametric = this.Clone() as unknown as DoubleParametricComponents;
    parametric._scale = multiplier;
    return parametric;
  }

  /**
   * Divides the scale at which the parametric output is generated.
   *
   * @param {number} denominator
   * @return {*}  {DoubleParametricComponents}
   * @memberof DoubleParametricComponents
   */
  public divideBy(denominator: number): DoubleParametricComponents {
    if (denominator === 0) { throw new DivideByZeroException(); }

    const parametric = this.Clone() as unknown as DoubleParametricComponents;
    parametric._scale = 1 / denominator;
    return parametric;
  }
}