import { ParametricEquation, ValueAtPosition } from "../ParametricEquation";

/**
 * Class for a parametric equation that returns a value in specified coordinates.
 *
 * Also assigns the differential of the parametric equation as another `ParametricComponent`, if supplied.
 *
 * @export
 * @class ParametricComponent
 * @extends {ParametricEquation<T>}
 * @template T Data type used for the parametric equation. What the parametric equation returns.
 */
export class ParametricComponent<T> extends ParametricEquation<T> {
  /**
   * Creates an instance of ParametricComponent.
   * @param {T} constantValue Constant value to return at any position along the parametric curve.
   * @param {(ValueAtPosition<T> | null)} [parametricCB=null] Parametric curve function.
   * @param {(ParametricComponent<T> | null)} [functionDifferential=null] Next differential of the supplied parametric curve function.
   * @memberof ParametricComponent
   */
  constructor(
    constantValue: T,
    parametricCB: ValueAtPosition<T> | null = null,
    functionDifferential: ParametricComponent<T> | null = null
  ) {
    if (parametricCB) {
      super(undefined, parametricCB);
      this._differential = functionDifferential;
    } else {
      super(constantValue, undefined)
    }
  }
}