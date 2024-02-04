/// <summary>
/// Represents a linear curve in parametric equations defining the <see cref="CartesianCoordinate"/> component and differentials.
/// This class tends to be used as a base from which the x- and y-components are derived.
/// Implements the <see cref="MPT.Math.Curves.Parametrics.LinearCurveComponents.LinearParametricCartesianComponents" />
/// </summary>

import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../../../Coordinates/CartesianOffset";
import { Curve } from "../../../Curves/Curve";
import { LinearCurve } from "../../../Curves/LinearCurve";
import { CartesianParametricComponent } from "../Components/Types/CartesianParametricComponent";
import { ParametricComponents } from "../Components/Types/ParametricComponents";
import { LinearParametricCartesianComponents } from "./LinearParametricCartesianComponents";

export class LinearParametricP extends LinearParametricCartesianComponents {
  /// <summary>
  /// The offset between points defining the linear curve.
  /// </summary>
  private _offset: CartesianOffset;

  constructor(parent: LinearCurve) {
    super(parent);
    this._offset = parent.Range.end.Limit.offsetFrom(parent.Range.start.Limit);
  }

  /// <summary>
  /// The component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public BaseByParameter(parameter: number): CartesianCoordinate {
    return this._parent().Range.start.Limit.addTo(
      this._offset.multiplyBy(parameter).toCartesianCoordinate()
    );
  }


  /// <summary>
  /// The component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public PrimeByParameter(parameter: number): CartesianCoordinate {
    return this._offset.toCartesianCoordinate();
  }


  /// <summary>
  /// The component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>System.Double.</returns>
  public PrimeDoubleByParameter(parameter: number): CartesianCoordinate {
    return CartesianCoordinate.atOrigin();
  }


  public Clone(): ParametricComponents<CartesianCoordinate, CartesianParametricComponent, Curve> {
    // This is placed here due to LinearParametricP not needing a cloning method in usage or access, but derives from base classes that require it.
    const parametric = new LinearParametricP(this._parent());
    parametric._offset = this._offset;

    return parametric;
  }
}