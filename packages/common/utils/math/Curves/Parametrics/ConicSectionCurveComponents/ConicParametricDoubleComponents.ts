import { ConicSectionCurve } from "../../ConicSectionCurve";
import { DoubleParametricComponents } from "../Components/Types/DoubleParametricComponents";

/**
 * Class containing the assigned components of a parametric equation in coordinates and the corresponding curve object for conic sections.
 * This class has the basic components of differentiating and accessing the different parametric equations.
 * Also contains operators to implement scaling of the parametric equations.
 * @extends {DoubleParametricComponents}
 * @internal
 */
export abstract class ConicParametricDoubleComponents extends DoubleParametricComponents {
  /**
   * Gets the parent object whose properties are used in the associated parametric equations.
   * @type {ConicSectionCurve}
   */
  protected get parent(): ConicSectionCurve {
    return this._parentCurve as ConicSectionCurve;
  }

  /**
   * Initializes a new instance of the ConicParametricDoubleComponents class.
   * @param {ConicSectionCurve} parent The parent conic section curve.
   */
  public constructor(parent: ConicSectionCurve) {
    super(parent);
  }
}
