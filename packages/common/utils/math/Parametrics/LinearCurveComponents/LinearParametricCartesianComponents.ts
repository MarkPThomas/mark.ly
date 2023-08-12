import { LinearCurve } from "../../Curves/LinearCurve";
import { CartesianParametricComponents } from "../Components/Types/CartesianParametricComponents";

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
  protected _parent(): LinearCurve {
    return this._parentCurve as LinearCurve;
  }

  constructor(parent: LinearCurve) {
    super(parent)
  }
}