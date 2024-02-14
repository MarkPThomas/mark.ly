import { LinearCurve } from "../../LinearCurve";
import { CartesianParametricComponents } from "../components/Types/CartesianParametricComponents";

/**
 * Class containing the assigned components of a parametric equation in `CartesianCoordinate` coordinates and the corresponding linear curve object.
 *
 * This class has the basic components of differentiating and accessing the different parametric equations.
 *
 * Also contains operators to implement scaling of the parametric equations.
 *
 * @export
 * @abstract
 * @class LinearParametricCartesianComponents
 * @extends {CartesianParametricComponents}
 */
export abstract class LinearParametricCartesianComponents extends CartesianParametricComponents {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @protected
 * @returns {LinearCurve}
 */
  protected _parent(): LinearCurve {
    return this._parentCurve as LinearCurve;
  }

  /**
 * Creates an instance of LinearParametricCartesianComponents.
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @constructor
 * @param {LinearCurve} parent
 */
  constructor(parent: LinearCurve) {
    super(parent)
  }
}