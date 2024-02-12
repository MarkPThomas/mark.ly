import { ValueAtPosition } from "../ParametricEquation";
import { ParametricComponent } from "./ParametricComponent";

/**
 * Class for a parametric equation that returns a value in `number` values.
 *
 * Also assigns the differential of the parametric equation, if supplied.
 *
 * @export
 * @class DoubleParametricComponent
 * @extends {ParametricComponent<number>}
 */
export class DoubleParametricComponent extends ParametricComponent<number> {
  /**
 * Creates an instance of DoubleParametricComponent.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {(ValueAtPosition<number> | null)} [parametricCB=null]
 * @param {(DoubleParametricComponent | null)} [functionDifferential=null]
 */
  constructor(parametricCB: ValueAtPosition<number> | null = null,
    functionDifferential: DoubleParametricComponent | null = null
  ) {
    super(
      0,
      parametricCB,
      functionDifferential
    )
  }
}