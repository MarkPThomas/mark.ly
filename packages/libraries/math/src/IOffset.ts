import { IEquatable } from "@markpthomas/common-libraries/interfaces";

import { ICoordinate } from "./coordinates/ICoordinate";
import { ICoordinate3D } from "./coordinates3D/ICoordinate3D";
import { ITolerance } from "./ITolerance";

/**
 * Represents the difference between coordinates I (first) and J (second) in the coordinate space.
 * @date 2/3/2024 - 8:51:51 AM
 *
 * @export
 * @interface IOffset
 * @typedef {IOffset}
 * @template {ICoordinate | ICoordinate3D} T
 * @extends {IEquatable<IOffset<T>>}
 * @extends {ITolerance}
 */
export interface IOffset<T extends ICoordinate | ICoordinate3D>
  extends IEquatable<IOffset<T>>, ITolerance {

  /**
   * Coordinate I (starting coord).
   *
   * @readonly
   * @memberof T
   */
  readonly I: T;

  /**
   * Coordinate J (ending coord).
   *
   * @readonly
   * @memberof T
   */
  readonly J: T;


  /**
   * Adds offset deltas to the provided coordinate.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {T} coord
   * @returns {T}
   */
  addToCoordinate(coord: T): T;


  /**
   * Subtracts offset deltas from the provided coordinate.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {T} coord
   * @returns {T}
   */
  subtractFromCoordinate(coord: T): T;


  /**
   * Subtracts the provided coordinate from the offset deltas.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {T} coord
   * @returns {T}
   */
  subtractByCoordinate(coord: T): T;


  /**
   * Adds the provided offset.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {IOffset<T>} offset
   * @returns {IOffset<T>}
   */
  addTo(offset: IOffset<T>): IOffset<T>;


  /**
   * Subtracts the provided offset.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {IOffset<T>} offset
   * @returns {IOffset<T>}
   */
  subtractBy(offset: IOffset<T>): IOffset<T>;


  /**
   * Multiplies the offset by the provided scalar.
   * @date 2/3/2024 - 8:51:51 AM
   *
   * @param {number} multiplier
   * @returns {IOffset<T>}
   */
  multiplyBy(multiplier: number): IOffset<T>;


  /**
   * Divides the offset by the provided scalar.
   * @date 2/3/2024 - 8:51:50 AM
   *
   * @param {number} denominator
   * @returns {IOffset<T>}
   */
  divideBy(denominator: number): IOffset<T>;
}