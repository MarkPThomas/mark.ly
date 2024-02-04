import { Angle } from "../Coordinates/Angle";

export interface IAngle3D {
  /**
   * Gets or sets the inclination angle, θ, which lies in the vertical plane sweeping out from the Z-axis.
   * @type {Angle}
   */
  inclination: Angle;

  /**
   * Gets or sets the azimuth angle, φ, which lies in the x-y plane sweeping out from the X-axis.
   * @type {Angle}
   */
  azimuth: Angle;
}