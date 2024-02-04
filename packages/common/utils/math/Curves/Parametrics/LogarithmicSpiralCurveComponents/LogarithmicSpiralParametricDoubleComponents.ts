import { Curve } from "../../Curve";
import { LogarithmicSpiralCurve } from "../../LogarithmicSpiralCurve";
import { DoubleParametricComponents } from "../Components/Types/DoubleParametricComponents";


/**
 * Class containing the assigned components of a parametric equation in {@linkcode double} coordinates and the corresponding logarithmic spiral curve object.
 * This class has the basic components of differentiating and accessing the different parametric equations.
 * Also contains operators to implement scaling of the parametric equations.
 * @extends {DoubleParametricComponents}
 * @internal
 */
export abstract class LogarithmicSpiralParametricDoubleComponents extends DoubleParametricComponents {
  /**
   * Gets the parent object whose properties are used in the associated parametric equations.
   * @type {LogarithmicSpiralCurve}
   * @protected
   */
  protected get _parent(): LogarithmicSpiralCurve {
    return this._parentCurve as LogarithmicSpiralCurve;
  }

  /**
   * Initializes a new instance of the {@linkcode LogarithmicSpiralParametricDoubleComponents} class.
   * @param {LogarithmicSpiralCurve} parent The parent.
   */
  constructor(parent: LogarithmicSpiralCurve) {
    super(parent as Curve);
  }
}
