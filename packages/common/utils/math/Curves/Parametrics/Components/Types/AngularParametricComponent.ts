import { Angle } from "../../../../Coordinates/Angle";
import { ValueAtPosition } from "../ParametricEquation";
import { ParametricComponent } from "./ParametricComponent";

/**
 * Class for a parametric equation that returns a value in `Angle` coordinates.
 *
 * Also assigns the differential of the parametric equation, if supplied.
 *
 * @export
 * @class CartesianParametricComponent
 * @extends {ParametricComponent<CartesianCoordinate>}
 */
export class AngularParametricComponent extends ParametricComponent<Angle> {
  constructor(parametricCB: ValueAtPosition<Angle> | null = null,
    functionDifferential: AngularParametricComponent | null = null
  ) {
    super(
      Angle.Origin(),
      parametricCB,
      functionDifferential
    )
  }
}