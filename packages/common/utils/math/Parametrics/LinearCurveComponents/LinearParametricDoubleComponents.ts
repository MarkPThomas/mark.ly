import { LinearCurve } from "../../Curves/LinearCurve";
import { DoubleParametricComponents } from "../Components/Types/DoubleParametricComponents";

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
  protected _parent(): LinearCurve {
    return this._parentCurve as LinearCurve;
  }

  constructor(parent: LinearCurve) {
    super(parent)
  }
}