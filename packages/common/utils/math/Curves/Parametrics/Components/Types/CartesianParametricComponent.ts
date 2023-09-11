import { CartesianCoordinate } from "../../../../Coordinates/CartesianCoordinate";
import { ValueAtPosition } from "../ParametricEquation";
import { ParametricComponent } from "./ParametricComponent";

/**
 * Class for a parametric equation that returns a value in `CartesianCoordinate` coordinates.
 *
 * Also assigns the differential of the parametric equation, if supplied.
 *
 * @export
 * @class CartesianParametricComponent
 * @extends {ParametricComponent<CartesianCoordinate>}
 */
export class CartesianParametricComponent extends ParametricComponent<CartesianCoordinate> {
  constructor(parametricCB: ValueAtPosition<CartesianCoordinate> | null = null,
    functionDifferential: CartesianParametricComponent | null = null
  ) {
    super(
      CartesianCoordinate.Origin(),
      parametricCB,
      functionDifferential
    )
  }
}