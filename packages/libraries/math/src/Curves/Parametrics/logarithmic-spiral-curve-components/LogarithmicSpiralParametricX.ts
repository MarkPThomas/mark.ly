import { TrigonometryLibrary as Trig } from '../../../trigonometry/TrigonometryLibrary';

import { Numbers } from "../../../Numbers";
import { Curve } from "../../Curve";
import { LogarithmicSpiralCurve } from "../../LogarithmicSpiralCurve";
import { DoubleParametricComponent } from "../components/Types/DoubleParametricComponent";
import { ParametricComponents } from "../components/Types/ParametricComponents";
import { LogarithmicSpiralParametricDoubleComponents } from "./LogarithmicSpiralParametricDoubleComponents";


/**
 * Represents a logarithmic spiral curve in parametric equations defining the x-component and differentials.
 * @extends {LogarithmicSpiralParametricDoubleComponents}
 * @internal
 */
export class LogarithmicSpiralParametricX extends LogarithmicSpiralParametricDoubleComponents {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:23 PM
 *
 * @public
 * @returns {ParametricComponents<number, DoubleParametricComponent, Curve>}
 */
  public Clone(): ParametricComponents<number, DoubleParametricComponent, Curve> {
    throw new Error("Method not implemented.");
  }
  /**
   * Initializes a new instance of the {@linkcode LogarithmicSpiralParametricX} class.
   * @param {LogarithmicSpiralCurve} parent The parent.
   */
  constructor(parent: LogarithmicSpiralCurve) {
    super(parent);
  }

  /**
   * Calculates the base value by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The calculated base value.
   */
  public BaseByParameter(angleRadians: number): number {
    return this._parent.RadiusAtOrigin
      * Numbers.E ** (this._parent.RadiusChangeWithRotation * angleRadians)
      * Trig.Cos(angleRadians);
  }

  /**
   * Calculates the prime value by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The calculated prime value.
   */
  public PrimeByParameter(angleRadians: number): number {
    return this._parent.RadiusAtOrigin
      * Numbers.E ** (this._parent.RadiusChangeWithRotation * angleRadians)
      * (Trig.Cos(angleRadians) - Trig.Sin(angleRadians));
  }

  /**
   * Calculates the double prime value by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The calculated double prime value.
   */
  public PrimeDoubleByParameter(angleRadians: number): number {
    return this._parent.RadiusAtOrigin
      * Numbers.E ** (this._parent.RadiusChangeWithRotation * angleRadians) * -2
      * Trig.Sin(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {LogarithmicSpiralParametricX} A new object that is a copy of this instance.
   */
  public cloneParametric(): LogarithmicSpiralParametricX {
    return new LogarithmicSpiralParametricX(this._parent as LogarithmicSpiralCurve);
  }
}
