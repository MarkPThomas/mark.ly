import { CartesianCoordinate } from "../../../../coordinates/CartesianCoordinate";
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
  /**
 * Creates an instance of CartesianParametricComponent.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {(ValueAtPosition<CartesianCoordinate> | null)} [parametricCB=null]
 * @param {(CartesianParametricComponent | null)} [functionDifferential=null]
 */
  constructor(parametricCB: ValueAtPosition<CartesianCoordinate> | null = null,
    functionDifferential: CartesianParametricComponent | null = null
  ) {
    super(
      CartesianCoordinate.atOrigin(),
      parametricCB,
      functionDifferential
    )
  }
}