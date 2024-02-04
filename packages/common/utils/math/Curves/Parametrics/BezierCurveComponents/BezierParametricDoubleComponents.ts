import { BezierCurve } from "../../BezierCurve";
import { DoubleParametricComponents } from "../Components/Types/DoubleParametricComponents";

/**
 * Class containing the assigned components of a parametric equation in double coordinates and the corresponding bezier curve object.
 * This class has the basic components of differentiating and accessing the different parametric equations.
 * Also contains operators to implement scaling of the parametric equations.
 * @extends {DoubleParametricComponents}
 */
export abstract class BezierParametricDoubleComponents extends DoubleParametricComponents {
  /**
   * Gets the parent object whose properties are used in the associated parametric equations.
   * @type {BezierCurve}
   */
  protected get _parent(): BezierCurve {
    return this._parentCurve as BezierCurve;
  }

  /**
   * Initializes a new instance of the {@linkcode BezierParametricDoubleComponents} class.
   * @param {BezierCurve} parent The parent.
   */
  constructor(parent: BezierCurve) {
    super(parent);
  }
}
