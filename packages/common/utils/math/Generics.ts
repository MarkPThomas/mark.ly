import { ArgumentException } from "../../errors/exceptions";
import { IComparable } from "../../interfaces/IComparable";
import { ITolerance } from "./ITolerance";
import { Numbers } from "./Numbers";

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
  public static GetTolerance<T extends ITolerance, U extends ITolerance>(
    item1: T,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return Generics.GetToleranceBetween(item1, undefined, tolerance);
  }

  public static GetToleranceBetween<T extends ITolerance, U extends ITolerance>(
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