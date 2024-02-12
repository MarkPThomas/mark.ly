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
  /**
 * Creates an instance of AngularParametricComponent.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {(ValueAtPosition<Angle> | null)} [parametricCB=null]
 * @param {(AngularParametricComponent | null)} [functionDifferential=null]
 */
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