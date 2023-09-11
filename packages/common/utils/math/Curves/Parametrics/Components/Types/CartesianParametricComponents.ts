import { DivideByZeroException } from "../../../../../../errors/exceptions";
import { CartesianCoordinate } from "../../../../Coordinates/CartesianCoordinate";
import { Curve } from "../../../../Curves/Curve";
import { ParametricEquation } from "../ParametricEquation";
import { CartesianParametricComponent } from "./CartesianParametricComponent";
import { ParametricComponents } from "./ParametricComponents";


/// <summary>
/// Class containing the type-defined component placeholders of a parametric equation in <see cref="CartesianCoordinate"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains functions to implement scaling of the parametric equations.
/// Implements the <see cref="ParametricComponents{CartesianCoordinate, T, Curve}" />
/// </summary>
/// <typeparam name="T"></typeparam>
/// <seealso cref="ParametricComponents{CartesianCoordinate, T, Curve}" />
abstract class LinearCartesianParametricComponents<T extends ParametricEquation<CartesianCoordinate>> extends
  ParametricComponents<CartesianCoordinate, T, Curve> {

  protected constructor(parent: Curve) {
    super(parent);
  }

  /// <summary>
  /// The scaled component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected baseByParameterScaled(parameter: number) {
    return this.BaseByParameter(parameter).multiplyBy(this._scale);
  }


  /// <summary>
  /// The scaled component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected primeByParameterScaled(parameter: number) {
    return this.PrimeByParameter(parameter).multiplyBy(this._scale);
  }


  /// <summary>
  /// The scaled component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected primeDoubleByParameterScaled(parameter: number) {
    return this.PrimeDoubleByParameter(parameter).multiplyBy(this._scale);
  }
}

/// <summary>
/// Class containing the assigned components of a parametric equation in <see cref="CartesianCoordinate"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains operators to implement scaling of the parametric equations.
/// Implements the <see cref="CartesianParametricComponents{CartesianParametricComponent}" />
/// </summary>

export abstract class CartesianParametricComponents extends LinearCartesianParametricComponents<CartesianParametricComponent> {

  constructor(parent: Curve) {
    super(parent);
    this.initialize();
  }

  protected initialize() {
    this._doublePrime = new CartesianParametricComponent(this.primeDoubleByParameterScaled);
    this._prime = new CartesianParametricComponent(this.primeByParameterScaled, this._doublePrime);
    this._base = new CartesianParametricComponent(this.baseByParameterScaled, this._prime);
  }


  public multiplyBy(multiplier: number): CartesianParametricComponents {
    const parametric = this.Clone() as unknown as CartesianParametricComponents;
    parametric._scale = multiplier;
    return parametric;
  }


  public divideBy(denominator: number): CartesianParametricComponents {
    if (denominator === 0) { throw new DivideByZeroException(); }

    const parametric = this.Clone() as unknown as CartesianParametricComponents;
    parametric._scale = 1 / denominator;
    return parametric;
  }
}