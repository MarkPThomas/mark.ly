import { TrigonometryLibrary as Trig } from '../../../Trigonometry/TrigonometryLibrary';

import { Numbers } from "../../../Numbers";
import { LogarithmicSpiralCurve } from "../../LogarithmicSpiralCurve";
import { LogarithmicSpiralParametricDoubleComponents } from './LogarithmicSpiralParametricDoubleComponents';
import { Curve } from '../../Curve';
import { DoubleParametricComponent } from '../Components/Types/DoubleParametricComponent';
import { ParametricComponents } from '../Components/Types/ParametricComponents';


/**
 * Represents a logarithmic spiral curve in parametric equations defining the y-component and differentials.
 * @extends {LogarithmicSpiralParametricDoubleComponents}
 * @internal
 */
export class LogarithmicSpiralParametricY extends LogarithmicSpiralParametricDoubleComponents {
  public Clone(): ParametricComponents<number, DoubleParametricComponent, Curve> {
    throw new Error('Method not implemented.');
  }
  /**
   * Initializes a new instance of the {@linkcode LogarithmicSpiralParametricY} class.
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
      * Trig.Sin(angleRadians);
  }

  /**
   * Calculates the prime value by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The calculated prime value.
   */
  public PrimeByParameter(angleRadians: number): number {
    return this._parent.RadiusAtOrigin
      * Numbers.E ** (this._parent.RadiusChangeWithRotation * angleRadians)
      * (Trig.Cos(angleRadians) + Trig.Sin(angleRadians));
  }

  /**
   * Calculates the double prime value by angle.
   * @param {number} angleRadians The angle in radians.
   * @returns {number} The calculated double prime value.
   */
  public PrimeDoubleByParameter(angleRadians: number): number {
    return this._parent.RadiusAtOrigin
      * Numbers.E ** (this._parent.RadiusChangeWithRotation * angleRadians)
      * 2 * Trig.Cos(angleRadians);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {LogarithmicSpiralParametricY} A new object that is a copy of this instance.
   */
  public cloneParametric(): LogarithmicSpiralParametricY {
    return new LogarithmicSpiralParametricY(this._parent as LogarithmicSpiralCurve);
  }
}
