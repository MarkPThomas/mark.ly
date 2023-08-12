import { IParametricEquation } from "./IParametricEquation";

/// Delegate that is used for calling a function that returns a value based on the provided parametric position.
export type ValueAtPosition<T> = (s: number) => T;


/**
 * Base class for any type of parametric equation that returns a value of the defined type.
 *
 * @export
 * @abstract
 * @class ParametricEquation
 * @implements {IParametricEquation<T>}
 * @template T
 */
export abstract class ParametricEquation<T> implements IParametricEquation<T> {
  /**
   * The constant value that is returned, regardless of the parametric position.
   *
   * @protected
   * @type {T}
   * @memberof ParametricEquation
   */
  protected _constantValue: T;

  /**
   * The function that returns a value based on the provided parametric position.
   *
   * @protected
   * @type {ValueAtPosition<T>}
   * @memberof ParametricEquation
   */
  protected _valueAtPosition: ValueAtPosition<T>;

  protected _differential: ParametricEquation<T> | null;
  /**
   * The differential of the parametric equation.
   *
   * @readonly
   * @type {ParametricEquation<T>}
   * @memberof ParametricEquation
   */
  get Differential() {
    return this._differential;
  };

  /**
   * Creates an instance of ParametricEquation based on either of the mutually exclusive parameters provided.
   * @param {(T | undefined)}  constantValue The constant value that is returned, regardless of the parametric position.
   * @param {(ValueAtPosition<T> | undefined)} parametricCB The function that returns a value based on the provided parametric position.
   * @memberof ParametricEquation
   */
  protected constructor(constantValue: T | undefined, parametricCB: ValueAtPosition<T> | undefined) {
    if (constantValue) {
      this._constantValue = constantValue;
      this._valueAtPosition = this.ConstantValue;
    } else if (parametricCB) {
      this._valueAtPosition = parametricCB;
    }
  }

  /**
   * The value, at parametric position s.
   *
   * @param {number} s The parametric position, s.
   * @return {*}  {T}
   * @memberof ParametricEquation
   */
  public ValueAt(s: number): T { return this._valueAtPosition(s); }

  /**
   *  Determines whether this instance has a differential equation assigned.
   *
   * @return {*}  {boolean}
   * @memberof ParametricEquation
   */
  public HasDifferential(): boolean {
    return this._differential !== null;
  }

  /**
   * The constant value, at parametric position s, that is the same for all positions.
   *
   * @protected
   * @param {number} s
   * @return {*}  {T}
   * @memberof ParametricEquation
   */
  protected ConstantValue(s: number): T { return this._constantValue; }
}