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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @export
 * @class LinearParametricP
 * @typedef {LinearParametricP}
 * @extends {LinearParametricCartesianComponents}
 */
export class LinearParametricP extends LinearParametricCartesianComponents {
  /// <summary>
  /// The offset between points defining the linear curve.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @private
 * @type {CartesianOffset}
 */
  private _offset: CartesianOffset;

  /**
 * Creates an instance of LinearParametricP.
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @constructor
 * @param {LinearCurve} parent
 */
  constructor(parent: LinearCurve) {
    super(parent);
    this._offset = parent.Range.end.Limit.offsetFrom(parent.Range.start.Limit);
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
 * @returns {CartesianCoordinate}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @param {number} parameter
 * @returns {CartesianCoordinate}
 */
  public PrimeByParameter(parameter: number): CartesianCoordinate {
    return this._offset.toCartesianCoordinate();
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
 * @returns {CartesianCoordinate}
 */
  public PrimeDoubleByParameter(parameter: number): CartesianCoordinate {
    return CartesianCoordinate.atOrigin();
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @public
 * @returns {ParametricComponents<CartesianCoordinate, CartesianParametricComponent, Curve>}
 */
  public Clone(): ParametricComponents<CartesianCoordinate, CartesianParametricComponent, Curve> {
    // This is placed here due to LinearParametricP not needing a cloning method in usage or access, but derives from base classes that require it.
    const parametric = new LinearParametricP(this._parent());
    parametric._offset = this._offset;

    return parametric;
  }
}