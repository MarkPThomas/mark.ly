import { DivideByZeroException } from "@markpthomas/common-libraries/exceptions";

import { Angle } from "../../../../coordinates/Angle";
import { Curve } from "../../../Curve";
import { ParametricEquation } from "../ParametricEquation";
import { AngularParametricComponent } from "./AngularParametricComponent";
import { ParametricComponents } from "./ParametricComponents";


/// <summary>
/// Class containing the type-defined component placeholders of a parametric equation in <see cref="Angle"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains functions to implement scaling of the parametric equations.
/// Implements the <see cref="ParametricComponents{Angle, T, Curve}" />
/// </summary>
/// <typeparam name="T"></typeparam>
/// <seealso cref="ParametricComponents{Angle, T, Curve}" />
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @abstract
 * @class LinearAngularParametricComponents
 * @typedef {LinearAngularParametricComponents}
 * @template {ParametricEquation<Angle>} T
 * @extends {ParametricComponents<Angle, T, Curve>}
 */
abstract class LinearAngularParametricComponents<T extends ParametricEquation<Angle>> extends
  ParametricComponents<Angle, T, Curve> {

  /**
 * Creates an instance of LinearAngularParametricComponents.
 * @date 2/11/2024 - 6:34:29 PM
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
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {Angle}
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
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {Angle}
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
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @protected
 * @param {number} parameter
 * @returns {Angle}
 */
  protected primeDoubleByParameterScaled(parameter: number) {
    return this.PrimeDoubleByParameter(parameter).multiplyBy(this._scale);
  }
}


// <summary>
/// Class containing the assigned components of a parametric equation in <see cref="Angle"/> coordinates and the corresponding curve object.
/// This class has the basic components of differentiating and accessing the different parametric equations.
/// Also contains operators to implement scaling of the parametric equations.
/// Implements the <see cref="AngularParametricComponents{AngularParametricComponent}" />
/// </summary>

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @abstract
 * @class AngularParametricComponents
 * @typedef {AngularParametricComponents}
 * @extends {LinearAngularParametricComponents<AngularParametricComponent>}
 */
export abstract class AngularParametricComponents extends LinearAngularParametricComponents<AngularParametricComponent> {
  /**
 * Creates an instance of AngularParametricComponents.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {Curve} parent
 */
  constructor(parent: Curve) {
    super(parent)
    this.initialize();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @protected
 */
  protected initialize() {
    this._doublePrime = new AngularParametricComponent(this.primeDoubleByParameterScaled);
    this._prime = new AngularParametricComponent(this.primeByParameterScaled, this._doublePrime);
    this._base = new AngularParametricComponent(this.baseByParameterScaled, this._prime);
  }

  ///// <summary>
  ///// Implements the + operator.
  ///// </summary>
  ///// <param name="a">a.</param>
  ///// <param name="b">The b.</param>
  ///// <returns>The result of the operator.</returns>
  //public static VectorParametric operator +(VectorParametric a, VectorParametric b)
  //{
  //    return new VectorParametric(a.Xcomponent + b.Xcomponent, a.Ycomponent + b.Ycomponent);
  //}

  ///// <summary>
  ///// Implements the - operator.
  ///// </summary>
  ///// <param name="a">a.</param>
  ///// <param name="b">The b.</param>
  ///// <returns>The result of the operator.</returns>
  //public static VectorParametric operator -(VectorParametric a, VectorParametric b)
  //{
  //    return new VectorParametric(a.Xcomponent - b.Xcomponent, a.Ycomponent - b.Ycomponent);
  //}


  /// <summary>
  /// Implements the * operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @param {number} multiplier
 * @returns {AngularParametricComponents}
 */
  public multiplyBy(multiplier: number): AngularParametricComponents {
    const parametric = this.Clone() as unknown as AngularParametricComponents;
    parametric._scale = multiplier;
    return parametric;
  }


  /// <summary>
  /// Implements the / operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @param {number} denominator
 * @returns {AngularParametricComponents}
 */
  public divideBy(denominator: number): AngularParametricComponents {
    if (denominator === 0) { throw new DivideByZeroException(); }

    const parametric = this.Clone() as unknown as AngularParametricComponents;
    parametric._scale = 1 / denominator;

    return parametric;
  }
}