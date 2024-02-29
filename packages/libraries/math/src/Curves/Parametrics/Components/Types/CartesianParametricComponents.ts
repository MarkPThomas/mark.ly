import { DivideByZeroException } from "@markpthomas/common-libraries/exceptions";

import { CartesianCoordinate } from "../../../../coordinates/CartesianCoordinate";
import { Curve } from "../../../Curve";
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
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @abstract
 * @class LinearCartesianParametricComponents
 * @typedef {LinearCartesianParametricComponents}
 * @template {ParametricEquation<CartesianCoordinate>} T
 * @extends {ParametricComponents<CartesianCoordinate, T, Curve>}
 */
abstract class LinearCartesianParametricComponents<T extends ParametricEquation<CartesianCoordinate>> extends
  ParametricComponents<CartesianCoordinate, T, Curve> {

  /**
 * Creates an instance of LinearCartesianParametricComponents.
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @constructor
 * @protected
 * @param {Curve} parent
 */
  protected constructor(parent: Curve) {
    super(parent);
  }

  /// <summary>
  /// The scaled component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {CartesianCoordinate}
 */
  protected baseByParameterScaled(parameter: number) {
    return this.BaseByParameter(parameter).multiplyBy(this._scale);
  }


  /// <summary>
  /// The scaled component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {CartesianCoordinate}
 */
  protected primeByParameterScaled(parameter: number) {
    return this.PrimeByParameter(parameter).multiplyBy(this._scale);
  }


  /// <summary>
  /// The scaled component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {CartesianCoordinate}
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @abstract
 * @class CartesianParametricComponents
 * @typedef {CartesianParametricComponents}
 * @extends {LinearCartesianParametricComponents<CartesianParametricComponent>}
 */
export abstract class CartesianParametricComponents extends LinearCartesianParametricComponents<CartesianParametricComponent> {

  /**
 * Creates an instance of CartesianParametricComponents.
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @constructor
 * @param {Curve} parent
 */
  constructor(parent: Curve) {
    super(parent);
    this.initialize();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @protected
 */
  protected initialize() {
    this._doublePrime = new CartesianParametricComponent(this.primeDoubleByParameterScaled);
    this._prime = new CartesianParametricComponent(this.primeByParameterScaled, this._doublePrime);
    this._base = new CartesianParametricComponent(this.baseByParameterScaled, this._prime);
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} multiplier
 * @returns {CartesianParametricComponents}
 */
  public multiplyBy(multiplier: number): CartesianParametricComponents {
    const parametric = this.Clone() as unknown as CartesianParametricComponents;
    parametric._scale = multiplier;
    return parametric;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @public
 * @param {number} denominator
 * @returns {CartesianParametricComponents}
 */
  public divideBy(denominator: number): CartesianParametricComponents {
    if (denominator === 0) { throw new DivideByZeroException(); }

    const parametric = this.Clone() as unknown as CartesianParametricComponents;
    parametric._scale = 1 / denominator;
    return parametric;
  }
}