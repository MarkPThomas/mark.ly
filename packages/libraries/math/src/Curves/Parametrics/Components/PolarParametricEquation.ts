import { ICloneable } from "@markpthomas/common-libraries/interfaces";

import { IParametricPolar } from "./IParametricPolar";
import { AngularParametricComponent } from "./Types/AngularParametricComponent";
import { AngularParametricComponents } from "./Types/AngularParametricComponents";
import { DoubleParametricComponent } from "./Types/DoubleParametricComponent";
import { DoubleParametricComponents } from "./Types/DoubleParametricComponents";

/**
 * Represents a set of parametric equations in radial {@linkcode DoubleParametricComponent} and rotational {@linkcode AngularParametricComponent} components, such as polar coordinates systems.
 * These equations can be scaled and differentiated.
 * @implements {IParametricPolar<DoubleParametricComponent, AngularParametricComponent>}
 * @implements {ICloneable}
 */
export class PolarParametricEquation
  implements IParametricPolar<DoubleParametricComponent, AngularParametricComponent>, ICloneable<PolarParametricEquation> {
  /**
   * The differentiation index
   * @protected
   * @type {number}
   */
  protected _differentiationIndex: number = 0;

  /**
   * The x-component, at position s.
   * @internal
   * @type {DoubleParametricComponents}
   */
  protected _radius: DoubleParametricComponents;

  /**
   * The x-component, at position s.
   * @returns {DoubleParametricComponent} The xcomponent.
   */
  get Radius(): DoubleParametricComponent {
    return this._radius.get(this._differentiationIndex);
  }

  /**
   * The y-component, at position s.
   * @internal
   * @type {AngularParametricComponents}
   */
  protected _azimuth: AngularParametricComponents;

  /**
   * The y-component, at position s.
   * @returns {AngularParametricComponent} The ycomponent.
   */
  get Azimuth(): AngularParametricComponent {
    return this._azimuth.get(this._differentiationIndex);
  }

  /**
   * Initializes a new instance of the {@linkcode PolarParametricEquation} class.
   * @protected
   */
  protected constructor() { }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:27 PM
 *
 * @returns {PolarParametricEquation}
 */
  clone(): PolarParametricEquation {
    throw new Error("Method not implemented.");
  }

  /**
   * Returns the differential of the current parametric function.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public Differentiate(): PolarParametricEquation {
    const differential: PolarParametricEquation = this.CloneParametric();
    differential._radius = this._radius.Differentiate(this._differentiationIndex) as DoubleParametricComponents;
    differential._azimuth = this._azimuth.Differentiate(this._differentiationIndex) as AngularParametricComponents;
    differential._differentiationIndex++;
    return differential;
  }

  /**
   * Returns the current parametric function, differentiated to the specified # of times.
   * @param {number} index The index to differentiate to, which must be greater than 0.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public DifferentiateBy(index: number): PolarParametricEquation {
    const differential: PolarParametricEquation = this.CloneParametric();
    differential._radius = this._radius.DifferentiateBy(index) as DoubleParametricComponents;
    differential._azimuth = this._azimuth.DifferentiateBy(index) as AngularParametricComponents;
    differential._differentiationIndex = index;
    return differential;
  }

  /**
   * Returns the first differential of the parametric function.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public DifferentialFirst(): PolarParametricEquation {
    return this.DifferentiateBy(1);
  }

  /**
   * Returns the second differential of the parametric function.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public DifferentialSecond(): PolarParametricEquation {
    return this.DifferentiateBy(2);
  }

  /**
   * Determines whether this instance can be differentiated further.
   * @returns {boolean} <code>true</code> if this instance has differential; otherwise, <code>false</code>.
   */
  public HasDifferential(): boolean {
    return this._radius.HasDifferential() || this._azimuth.HasDifferential();
  }

  /**
   * Implements the * operator.
   * @param {PolarParametricEquation} a {@linkcode PolarParametricEquation}.
   * @param {number} b The number.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public static operator_multiply(a: PolarParametricEquation, b: number): PolarParametricEquation {
    const parametric: PolarParametricEquation = a.CloneParametric();
    parametric._radius.multiplyBy(b);
    parametric._azimuth.multiplyBy(b);
    return parametric;
  }

  /**
   * Implements the / operator.
   * @param {PolarParametricEquation} a {@linkcode PolarParametricEquation}.
   * @param {number} b The number.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public static operator_divide(a: PolarParametricEquation, b: number): PolarParametricEquation {
    const parametric: PolarParametricEquation = a.CloneParametric();
    parametric._radius.divideBy(b);
    parametric._azimuth.divideBy(b);
    return parametric;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {object} A new object that is a copy of this instance.
   */
  public Clone(): object {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {PolarParametricEquation} {@linkcode PolarParametricEquation}.
   */
  public CloneParametric(): PolarParametricEquation {
    const parametric: PolarParametricEquation = new PolarParametricEquation();
    parametric._radius.Clone();
    parametric._azimuth.Clone();
    parametric._differentiationIndex = this._differentiationIndex;
    return parametric;
  }
}
