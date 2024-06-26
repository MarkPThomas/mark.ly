import { ArgumentException } from "common/errors/exceptions";
import { IComparable } from "common/interfaces/IComparable";

import { ITolerance } from "./ITolerance";
import { Numbers } from "./Numbers";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @class Generics
 * @typedef {Generics}
 */
export class Generics {
  // = Properties =
  // /// <summary>
  // /// Gets the tolerance between two items.
  // /// This is the maximum defined, or the overwrite, if provided.
  // /// </summary>
  // /// <typeparam name="T"></typeparam>
  // /// <param name="item1">The item1.</param>
  // /// <param name="tolerance">The tolerance.</param>
  // /// <returns>System.Double.</returns>
  // public static GetTolerance<T extends ITolerance>(item1: T, tolerance: number = Numbers.ZeroTolerance): number {
  //   return tolerance === Numbers.ZeroTolerance ? Math.max(item1.Tolerance, Numbers.ZeroTolerance) : tolerance;
  // }

  /// <summary>
  /// Gets the tolerance between two items.
  /// This is the maximum defined, or the overwrite, if provided.
  /// </summary>
  /// <typeparam name="T"></typeparam>
  /// <typeparam name="U"></typeparam>
  /// <param name="item1">The item1.</param>
  /// <param name="item2">The item2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {ITolerance} T
 * @template {ITolerance} U
 * @param {T} item1
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static GetTolerance<T extends ITolerance, U extends ITolerance>(
    item1: T,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return Generics.getToleranceBetween(item1, undefined, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {ITolerance} T
 * @template {ITolerance} U
 * @param {T} item1
 * @param {?U} [item2]
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static getToleranceBetween<T extends ITolerance, U extends ITolerance>(
    item1: T,
    item2?: U,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return tolerance == Numbers.ZeroTolerance
      ? item2
        ? Math.max(item1.Tolerance, item2.Tolerance, Numbers.ZeroTolerance)
        : Math.max(item1.Tolerance, Numbers.ZeroTolerance)
      : tolerance;
  }


  // = Comparisons =

  /// <summary>
  /// Determines whether the specified value is within the value bounds, including the values themselves.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="valueBound1">First value bound.</param>
  /// <param name="valueBound2">Second value bound.</param>
  /// <returns><c>true</c> if [is within inclusive] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {IComparable<T>} T
 * @param {T} value
 * @param {T} valueBound1
 * @param {T} valueBound2
 * @returns {boolean}
 */
  public static IsWithinInclusive<T extends IComparable<T>>(value: T, valueBound1: T, valueBound2: T): boolean {
    const maxValue = Generics.Max(valueBound1, valueBound2);
    const minValue = Generics.Min(valueBound1, valueBound2);

    return Generics.IsWithinExclusive(value, valueBound1, valueBound2) ||
      minValue.compareTo(value) == 0 ||
      maxValue.compareTo(value) == 0;
  }


  /// <summary>
  /// Determines whether the specified value is within the value bounds, not including the values bounds themselves.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="valueBound1">First value bound.</param>
  /// <param name="valueBound2">Second value bound.</param>
  /// <returns><c>true</c> if [is within inclusive] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {IComparable<T>} T
 * @param {T} value
 * @param {T} valueBound1
 * @param {T} valueBound2
 * @returns {boolean}
 */
  public static IsWithinExclusive<T extends IComparable<T>>(value: T, valueBound1: T, valueBound2: T): boolean {
    const maxValue = Generics.Max(valueBound1, valueBound2);
    const minValue = Generics.Min(valueBound1, valueBound2);
    return minValue.compareTo(value) < 0 && maxValue.compareTo(value) > 0;
  }



  /// <summary>
  /// Determines the maximum of the parameters.
  /// </summary>
  /// <typeparam name="T"></typeparam>
  /// <param name="items">The items.</param>
  /// <returns>T.</returns>
  /// <exception cref="ArgumentException">Argument cannot be null.</exception>
  /// <exception cref="ArgumentException">Array has not been dimensioned.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {IComparable<T>} T
 * @param {...T[]} items
 * @returns {T}
 */
  public static Max<T extends IComparable<T>>(...items: T[]): T {
    if (items === null) { throw new ArgumentException("Argument cannot be null."); }
    if (items.length < 1) { throw new ArgumentException("Array has not been dimensioned."); }

    let max: T = items[0];;
    items.forEach((item) => {
      if (item.compareTo(max) > 0) {
        max = item;
      }
    });

    return max;
  }

  /// <summary>
  /// Determines the minimum of the parameters.
  /// </summary>
  /// <typeparam name="T"></typeparam>
  /// <param name="items">The items.</param>
  /// <returns>T.</returns>
  /// <exception cref="ArgumentException">Argument cannot be null.</exception>
  /// <exception cref="ArgumentException">Array has not been dimensioned.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @public
 * @static
 * @template {IComparable<T>} T
 * @param {...T[]} items
 * @returns {T}
 */
  public static Min<T extends IComparable<T>>(...items: T[]): T {
    if (items === null) { throw new ArgumentException("Argument cannot be null."); }
    if (items.length < 1) { throw new ArgumentException("Array has not been dimensioned."); }

    let min: T = items[0];
    items.forEach((item) => {
      if (item.compareTo(min) > 0) {
        min = item;
      }
    });

    return min;
  }
}