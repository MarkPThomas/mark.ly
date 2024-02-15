/// <summary>
/// Represents a linear curve in parametric equations defining the x-component and differentials.
/// Implements the <see cref="MPT.Math.Curves.Parametrics.LinearCurveComponents.LinearParametricDoubleComponents" />
/// </summary>

import { LinearCurve } from "../../LinearCurve";
import { LinearParametricDoubleComponents } from "./LinearParametricDoubleComponents"
import { LinearParametricP } from "./LinearParametricP";

/// <seealso cref="MPT.Math.Curves.Parametrics.LinearCurveComponents.LinearParametricDoubleComponents" />
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @export
 * @class LinearParametricX
 * @typedef {LinearParametricX}
 * @extends {LinearParametricDoubleComponents}
 */
export class LinearParametricX extends LinearParametricDoubleComponents {

  /// <summary>
  /// Initializes a new instance of the <see cref="LinearParametricX" /> class.
  /// </summary>
  /// <param name="parent">The parent.</param>
  /**
 * Creates an instance of LinearParametricX.
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @constructor
 * @public
 * @param {LinearCurve} parent
 */
  public constructor(parent: LinearCurve) {
    super(parent);
  }


  /// <summary>
  /// The component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @param {number} parameter
 * @returns {number}
 */
  public BaseByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).BaseByParameter(parameter).X;
  }


  /// <summary>
  /// The component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @param {number} parameter
 * @returns {number}
 */
  public PrimeByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).PrimeByParameter(parameter).X;
  }


  /// <summary>
  /// The component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @param {number} parameter
 * @returns {number}
 */
  public PrimeDoubleByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).PrimeDoubleByParameter(parameter).X;
  }


  /// <summary>
  /// Clones the curve.
  /// </summary>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @returns {LinearParametricX}
 */
  public Clone(): LinearParametricX {
    const parametric = new LinearParametricX(this._parent as unknown as LinearCurve);
    return parametric;
  }
}