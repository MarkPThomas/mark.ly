import { IParametricCartesianXY } from "./IParametricCartesianXY";
import { ParametricEquation } from "./ParametricEquation";

/**
 * Represents a parametric equation in 3D cartesian coordinates.
 * @template T The type of the parametric equation.
 */
export interface IParametricCartesianXYZ<T extends ParametricEquation<number>> extends IParametricCartesianXY<T> {
  /**
   * The z-component, at position s.
   * @type {T}
   */
  Zcomponent: T;
}
