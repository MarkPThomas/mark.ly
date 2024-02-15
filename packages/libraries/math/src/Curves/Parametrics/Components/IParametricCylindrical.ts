import { Angle } from "../../../coordinates/Angle";
import { ParametricEquation } from "./ParametricEquation";

/**
 * Represents a parametric equation in cylindrical coordinates.
 */
export interface IParametricCylindrical {
  /**
   * The radial length, ρ, at position s, which is the Euclidean distance from the z-axis to the point P.
   * @type {ParametricEquation<number>}
   */
  Radius: ParametricEquation<number>;

  /**
   * The height at position s.
   * @type {ParametricEquation<number>}
   */
  Height: ParametricEquation<number>;

  /**
   * The azimuth angle, φ, at position s, which lies in the x-y plane sweeping out from the X-axis.
   * @type {ParametricEquation<Angle>}
   */
  Azimuth: ParametricEquation<Angle>;
}
