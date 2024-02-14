import { LinearCurve } from "../../LinearCurve";
import { DoubleParametricComponents } from "../components/Types/DoubleParametricComponents";

/**
 * Class containing the assigned components of a parametric equation in numerical coordinates and the corresponding linear curve object.
 *
 * This class has the basic components of differentiating and accessing the different parametric equations.
 *
 * Also contains operators to implement scaling of the parametric equations.
 *
 * @export
 * @abstract
 * @class LinearParametricDoubleComponents
 * @extends {DoubleParametricComponents}
 */
export abstract class LinearParametricDoubleComponents extends DoubleParametricComponents {
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
 * Creates an instance of LinearParametricDoubleComponents.
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @constructor
 * @param {LinearCurve} parent
 */
  constructor(parent: LinearCurve) {
    super(parent)
  }
}