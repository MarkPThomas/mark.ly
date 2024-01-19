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