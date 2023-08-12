/// <summary>
/// Represents a linear curve in parametric equations defining the y-component and differentials.
/// Implements the <see cref="MPT.Math.Curves.Parametrics.LinearCurveComponents.LinearParametricDoubleComponents" />
/// </summary>

import { LinearCurve } from "../../Curves/LinearCurve";
import { LinearParametricDoubleComponents } from "./LinearParametricDoubleComponents"
import { LinearParametricP } from "./LinearParametricP";

export class LinearParametricY extends LinearParametricDoubleComponents {

  constructor(parent: LinearCurve) {
    super(parent);
  }

  /// <summary>
  /// The component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public BaseByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).BaseByParameter(parameter).Y;
  }


  /// <summary>
  /// The component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public PrimeByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).PrimeByParameter(parameter).Y;
  }


  /// <summary>
  /// The component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public PrimeDoubleByParameter(parameter: number): number {
    return new LinearParametricP(this._parent()).PrimeDoubleByParameter(parameter).Y;
  }


  /// <summary>
  /// Clones the curve.
  /// </summary>
  /// <returns>LinearCurve.</returns>
  public Clone(): LinearParametricY {
    const parametric = new LinearParametricY(this._parent() as LinearCurve);
    return parametric;
  }
}