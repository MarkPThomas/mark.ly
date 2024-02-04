import { ConicSectionCurve } from "../../ConicSectionCurve";
import { PolarParametricEquation } from "../Components/PolarParametricEquation";
import { ConicFocusParametricAngularComponents } from "./ConicFocusParametricAngularComponents";
import { ConicFocusParametricDoubleComponents } from "./ConicFocusParametricDoubleComponents";

/**
 * Represents a set of parametric equations in radial and rotational components to describe curve positions in relation to the conic focus.
 * These equations can be scaled and differentiated.
 * @extends {PolarParametricEquation}
 */
export class ConicFocusParametric extends PolarParametricEquation {
  protected readonly _radius: ConicFocusParametricDoubleComponents;
  protected readonly _azimuth: ConicFocusParametricAngularComponents;

  /**
   * Initializes a new instance of the ConicFocusParametric class.
   * @param {ConicSectionCurve} parent The parent conic section curve.
   */
  public constructor(parent: ConicSectionCurve) {
    super();
    this._radius = new ConicFocusParametricDoubleComponents(parent);
    this._azimuth = new ConicFocusParametricAngularComponents(parent);
  }
}
