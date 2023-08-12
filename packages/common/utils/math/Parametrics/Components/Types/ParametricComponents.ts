import { ArgumentOutOfRangeException } from "../../../../../errors/exceptions";
import { Curve } from "../../../Curves/Curve";
import { ParametricEquation } from "../ParametricEquation";
import { ParametricComponent } from "./ParametricComponent";

/**
 * Class containing the component placeholders of a parametric equation of a given data type (e.g. number, angle, etc.) and
 * the corresponding curve object.
 *
 * This class has the basic implementation of differentiating and accessing the different parametric equations.
 *
 * Also contains abstract functions to implement scaling for a specific set of parametric equations.
 *
 * @export
 * @abstract
 * @class ParametricComponents
 * @template T1 Data type used for the parametric equation. What the parametric equation returns.
 * @template T2 Parametric equation of a given differential, initialized with either a constant, or first (and possibly 2nd) differential.
 * @template T3 Curve for which the parametric curve is based.
 */
export abstract class ParametricComponents<
  T1,
  T2 extends ParametricComponent<T1>,
  T3 extends Curve>
{
  /**
   * The `Curve` whose properties are used in the associated parametric equations.
   *
   * @protected
   * @type {T3}
   * @memberof ParametricComponents
   */
  protected readonly _parentCurve: T3

  // TODO: This up through _components & Get is clunky & limiting. Extend later by dealing with types better?
  /**
   * The function base. Returns values at the component scale.
   *
   * @protected
   * @type {T2}
   * @memberof ParametricComponents
   */
  protected _base: T2;

  /**
   * The first derivative of the function. Returns values at the component scale.
   *
   * @protected
   * @type {T2}
   * @memberof ParametricComponents
   */
  protected _prime: T2;

  /**
   * The second derivative of the function. Returns values at the component scale.
   *
   * @protected
   * @type {T2}
   * @memberof ParametricComponents
   */
  protected _doublePrime: T2;

  /**
   * Contains the current component and next 2 differentials.
   *
   * Currently at most components can only be differentiated twice.
   *
   * @protected
   * @type {T2[]}
   * @memberof ParametricComponents
   */
  protected _components: T2[] = [];


  /**
   * Gets the parametric component at the specified index, which corresponds to the differentiation level.
   *
   * @param {number} differentialLevel The differentiation level sought for the parametric function.
   * Base function (0), first differential (1), second differential (2).
   * @return {*}  {T2}
   * @memberof ParametricComponents
   */
  public get(differentialLevel: number): T2 {
    return this._components[differentialLevel];
  }

  /**
   * The index corresponding with the max level of differentiation of the components.
   *
   * @protected
   * @type {number}
   * @memberof ParametricComponents
   */
  protected _differentiationIndex: number = 0;


  /**
   * The scale applied to the parametric function.
   * Begins at 1, but is modified through multiplication & division operations.
   *
   * @protected
   * @type {number}
   * @memberof ParametricComponents
   */
  protected _scale: number = 1;

  protected constructor(parent: T3) {
    this._parentCurve = parent;
  }

  /**
   * Adds components to components list.
   *
   * @protected
   * @memberof ParametricComponents
   */
  protected initializeComponents() {
    this._components.push(this._base);
    this._components.push(this._prime);
    this._components.push(this._doublePrime);
  }

  // TODO: Incomplete. Next 2 functions are mostly the same called in ways higher up that need to be understood.

  /**
   * Returns the differential of the current parametric function.
   *
   * @param {number} index The index to differentiate to, which must be greater than 0.
   * @return {*}  {ParametricComponents<T1, T2, T3>}
   * @memberof ParametricComponents
   */
  public Differentiate(index: number): ParametricComponents<T1, T2, T3> {
    if (index === 0) {
      throw new ArgumentOutOfRangeException(`Index: ${index} must be greater 0 in order to differentiate.`);
    }
    if (this._components.length <= index) {
      throw new ArgumentOutOfRangeException(`Index: ${index} must be less than ${this._components.length} in order to differentiate.`);
    }
    const differential = this.Clone();
    // index++;
    differential._differentiationIndex = index;
    return differential;
  }


  /**
   * Returns the current parametric function, differentiated to the specified # of times.
   *
   * @param {number} index The index to differentiate to, which must be greater than 0.
   * @return {*}  {ParametricComponents<T1, T2, T3>}
   * @memberof ParametricComponents
   */
  public DifferentiateBy(index: number): ParametricComponents<T1, T2, T3> {
    if (index < 0) {
      throw new ArgumentOutOfRangeException(`Index: ${index} must not be less than 0.`);
    }
    if (index < this._differentiationIndex) {
      throw new ArgumentOutOfRangeException(`Differentiation index ${index} cannot be less than than current index ${this._differentiationIndex}.`);
    }
    if (this._components.length <= index) {
      throw new ArgumentOutOfRangeException(`Index: ${index} must not be greater than ${this._components.length - 1} in order to differentiate.`);
    }

    const differential = this.Clone();
    differential._differentiationIndex = index;
    return differential;
  }

  // TODO: Might not be used. Consider removing. Currently these are being called higher up. Incomplete.
  ///// <summary>
  ///// Returns the first differential of the parametric function.
  ///// </summary>
  ///// <returns>HyperbolicParametric.</returns>
  //public ParametricComponents<T1, T2, T3> DifferentialFirst()
  //{
  //    return DifferentiateBy(1);
  //}

  ///// <summary>
  ///// Returns the second differential of the parametric function.
  ///// </summary>
  ///// <returns>HyperbolicParametric.</returns>
  //public ParametricComponents<T1, T2, T3> DifferentialSecond()
  //{
  //    return DifferentiateBy(2);
  //}


  /**
   * Determines whether this instance can be differentiated further.
   *
   * @return {*}  {boolean} `true` if this instance has differential; otherwise, `false`.
   * @memberof ParametricComponents
   */
  public HasDifferential(): boolean {
    return this._differentiationIndex < this._components.length;
  }


  // #region Methods: Parametric Equations and Differentials


  /// <summary>
  /// The scaled component as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected abstract baseByParameterScaled(parameter: number): T1;

  /// <summary>
  /// The component first differentical as a function of the supplied parameter at the original scale. Defined in the highest level class.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  public abstract BaseByParameter(parameter: number): T1;


  /// <summary>
  /// The scaled component first differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected abstract primeByParameterScaled(parameter: number): T1;

  /// <summary>
  /// The component first differentical as a function of the supplied parameter. Defined in the highest level class.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  public abstract PrimeByParameter(parameter: number): T1;


  /// <summary>
  /// The scaled component second differentical as a function of the supplied parameter.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  protected abstract primeDoubleByParameterScaled(parameter: number): T1;
  /// <summary>
  /// The component second differentical as a function of the supplied parameter. Defined in the highest level class.
  /// </summary>
  /// <param name="parameter">The parameter, such as relative position between 0 &amp; 1, or the angle in radians.</param>
  /// <returns>T1.</returns>
  public abstract PrimeDoubleByParameter(parameter: number): T1;

  public abstract Clone(): ParametricComponents<T1, T2, T3>;
}