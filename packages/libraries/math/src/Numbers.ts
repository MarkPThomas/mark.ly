import { DivideByZeroException, ArgumentException } from "common/errors/exceptions";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @export
 * @class Numbers
 * @typedef {Numbers}
 */
export class Numbers {
  /**
 * Creates an instance of Numbers.
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @constructor
 * @protected
 */
  protected constructor() { }


  // = Constants =

  /// <summary>
  /// Default zero tolerance for operations.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly ZeroTolerance: number = 1E-20;

  /// <summary>
  /// Represents the value of pi (180&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly Pi: number = Math.PI;

  /// <summary>
  /// Represents the value of pi times two (360&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly TwoPi: number = 2 * Math.PI;

  /// <summary>
  /// Represents the value of pi divided by two (90&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly PiOver2: number = Math.PI / 2;

  /// <summary>
  /// Represents the value of pi divided by four (45&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly PiOver4: number = Math.PI / 4;

  /// <summary>
  /// Represents the value of pi divided by six (30&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly PiOver6: number = Math.PI / 6;

  /// <summary>
  /// Represents the value of pi divided by three (60&#176;).
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly PiOver3: number = Math.PI / 3;

  /// <summary>
  /// Represents the mathematical constant e.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @static
 * @readonly
 * @type {number}
 */
  static readonly E: number = Math.E;

  /// <summary>
  /// Represents the log base ten of e.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
   * ${1:Description placeholder}
   * @date 2/11/2024 - 6:34:24 PM
   *
  */
  public static Log10E = (): number => Math.log10(Math.E);

  /// <summary>
  /// Represents the log base two of e.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
   * ${1:Description placeholder}
   * @date 2/11/2024 - 6:34:24 PM
   *
  */
  public static Log2E = (): number => Math.log2(Math.E);

  /// <summary>
  /// The golden ratio, also known as the divine proportion, golden mean, or golden section, is a number often encountered when taking the ratios of distances in simple geometric figures such as the pentagon, pentagram, decagon and dodecahedron.
  /// It is denoted phi and is approximately 1.618033988749...
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
   * ${1:Description placeholder}
   * @date 2/11/2024 - 6:34:24 PM
   *
  */
  public static GoldenRatio = (): number => 0.5 * (1 + Math.sqrt(5));


  // ===Signs
  /// <summary>
  /// Value is greater than the zero-tolerance.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is positive sign] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsPositiveSign(value: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    if (Numbers.IsZeroSign(value, tolerance)) { return false; }
    return (value > Math.abs(tolerance));
  }

  /// <summary>
  /// Value is less than the zero-tolerance.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is negative sign] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsNegativeSign(value: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    if (Numbers.IsZeroSign(value, tolerance)) { return false; }
    return (value < Math.abs(tolerance));
  }

  /// <summary>
  /// Value is within the absolute value of the zero-tolerance.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is zero sign] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsZeroSign(value: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    return (Math.abs(value) < Math.abs(tolerance));
  }

  /// <summary>
  /// Returns the sign of a value as either 1 (positive or 0), or -1 (negative).
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>System.Int32.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {(1 | -1)}
 */
  public static Sign(value: number, tolerance: number = Numbers.ZeroTolerance): 1 | -1 {
    if (Numbers.IsZeroSign(value, tolerance)) { return 1; }
    return (value > -Math.abs(tolerance) ? 1 : -1);
  }



  // === Comparisons

  /// <summary>
  /// Value is equal to the provided value within the absolute value of the zero-tolerance.
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is equal to] [the specified value1]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsEqualTo(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    return Numbers.AreEqual(value1, value2, tolerance);
  }

  /// <summary>
  /// Value is greater than the provided value, within the absolute value of the zero-tolerance.
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is greater than] [the specified value1]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsGreaterThan(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    return ((value1 - value2) > Math.abs(tolerance));
  }

  /// <summary>
  /// Value is less than the provided value, within the absolute value of the zero-tolerance.
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is less than] [the specified value1]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsLessThan(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    if (Numbers.IsEqualTo(value1, value2, tolerance)) { return false; }
    return ((value1 - value2) < Math.abs(tolerance));
  }

  /// <summary>
  /// Values are equal within the absolute value of the zero-tolerance.
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static AreEqual(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    if (value1 === Infinity && value2 === Infinity) { return true; }
    if (value1 === -Infinity && value2 === -Infinity) { return true; }
    return (Math.abs(value1 - value2) < Math.abs(tolerance));
  }

  /// <summary>
  /// Determines whether [is greater than or equal to] [the specified value2].
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is greater than or equal to] [the specified value2]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsGreaterThanOrEqualTo(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    return (Numbers.IsGreaterThan(value1, value2, tolerance) || Numbers.IsEqualTo(value1, value2, tolerance));
  }

  /// <summary>
  /// Determines whether [is less than or equal to] [the specified value2].
  /// </summary>
  /// <param name="value1">The value1.</param>
  /// <param name="value2">The value2.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns><c>true</c> if [is less than or equal to] [the specified value2]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value1
 * @param {number} value2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsLessThanOrEqualTo(value1: number, value2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    return (Numbers.IsLessThan(value1, value2, tolerance) || Numbers.IsEqualTo(value1, value2, tolerance));
  }


  /// <summary>
  /// Determines whether the specified value is within the value bounds, including the values themselves.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="valueBound1">First value bound.</param>
  /// <param name="valueBound2">Second value bound.</param>
  /// <param name="tolerance">The tolerance used in comparing against the bounds.</param>
  /// <returns><c>true</c> if [is within inclusive] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} valueBound1
 * @param {number} valueBound2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsWithinInclusive(value: number, valueBound1: number, valueBound2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    const maxValue = Math.max(valueBound1, valueBound2);
    const minValue = Math.min(valueBound1, valueBound2);
    return Numbers.IsLessThanOrEqualTo(minValue, value, tolerance) && Numbers.IsGreaterThanOrEqualTo(maxValue, value, tolerance);
  }

  /// <summary>
  /// Determines whether the specified value is within the value bounds, not including the values bounds themselves.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="valueBound1">First value bound.</param>
  /// <param name="valueBound2">Second value bound.</param>
  /// <param name="tolerance">The tolerance used in comparing against the bounds.</param>
  /// <returns><c>true</c> if [is within inclusive] [the specified value]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} valueBound1
 * @param {number} valueBound2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static IsWithinExclusive(value: number, valueBound1: number, valueBound2: number, tolerance: number = Numbers.ZeroTolerance): boolean {
    const maxValue = Math.max(valueBound1, valueBound2);
    const minValue = Math.min(valueBound1, valueBound2);
    return Numbers.IsLessThan(minValue, value, tolerance) && Numbers.IsGreaterThan(maxValue, value, tolerance);
  }



  // === Properties

  /// <summary>
  /// Value is an odd number.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns><c>true</c> if the specified value is odd; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {boolean}
 */
  public static IsOdd(value: number): boolean {
    return Number.isInteger(value) && (value % 2 !== 0);
  }

  /// <summary>
  /// Value is an even number.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns><c>true</c> if the specified value is even; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {boolean}
 */
  public static IsEven(value: number): boolean {
    return !Numbers.IsOdd(value);
  }

  /// <summary>
  /// A whole number greater than 1, whose only two whole-number factors are 1 and itself.
  /// Uses the 'Sieve of Eratosthenes', which is very efficient for solving small primes (i.e. &lt; 10,000,000,000).
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns><c>true</c> if the specified value is prime; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {boolean}
 */
  public static IsPrime(value: number): boolean {
    if (!Number.isInteger(value)) {
      return false;
    }

    value = Math.abs(value);
    if (value === 0) {
      return false;
    }
    if (value === 1) {
      return false;
    }
    if (value === 2) {
      return true;
    }
    if (value === 3) {
      return true;
    }
    if (Numbers.IsEven(value)) {
      /* For all > 2*/
      return false;
    }
    if (value == 5) {
      return true;
    }
    if (Numbers.LastDigit(value) === 5) {
      /* For all > 5*/
      return false;
    }

    const limit = Math.sqrt(value);

    for (let i = 3; i <= limit; i += 2) {
      if (value % i === 0) {
        return false;
      }
    }

    return true;
  }

  /// <summary>
  /// A whole number that can be divided evenly by numbers other than 1 or itself.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns><c>true</c> if the specified value is composite; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {boolean}
 */
  public static IsComposite(value: number): boolean {
    if (value === 0) {
      return false;
    }
    if (value === 1) {
      return false;
    }
    return !Numbers.IsPrime(value);
  }

  /**
   * Returns the last digit without sign of the value provided.
   *
   * @static
   * @param {number} value
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static LastDigit(value: number): number {
    return Math.abs(value % 10);
  }

  /**
   * Number of decimal places.
   *
   * Note that for non-scientific notation, the maximum that may be returned is (# decimal places) &lt;= 15 - (# whole numbers, not including leading 0s).
   *
   * @static
   * @param {number} value
   * @param {boolean} [limitForRounding=true]
   * If set to `true<`, results are limited to a range that is appropriate for rounding methods (0 &lt;= value &lt;= 15).
   * Not using this limit may result in a thrown exception when rounding.
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static DecimalPlaces(value: number, limitForRounding: boolean = true): number {
    const ePortions = Math.abs(value).toString().split('e');
    const numberPortions = ePortions[0].toString().split('.');

    let ePortion = parseInt(ePortions[1]);
    if (isNaN(ePortion) || !ePortion) {
      ePortion = 0;
    }

    let wholeNumber = numberPortions[0];
    // Remove leading zeros
    wholeNumber = Numbers.trimStart(wholeNumber, '0');

    let wholeNumberLength = wholeNumber.length;
    wholeNumberLength = Math.max(0, wholeNumberLength + ePortion);

    let decimalPortionLength = numberPortions[1] ? numberPortions[1].length : 0;
    decimalPortionLength = Math.max(0, decimalPortionLength - ePortion);

    if (decimalPortionLength === 0) {
      return 0;
    }

    const fullLength = wholeNumberLength + decimalPortionLength;

    return limitForRounding && fullLength > 15
      ? decimalPortionLength - (fullLength - 15)
      : decimalPortionLength;
  }

  /**
   * Number of significant figures.
   *
   * From: https://en.wikipedia.org/wiki/Significant_figures#Identifying_significant_figures
   * https://en.wikipedia.org/wiki/Significant_figures#Identifying_significant_figures
   *
   * @static
   * @param {number} value
   * @param {number} [decimalDigitsTolerance=Number.MAX_VALUE]
   * Tolerance limit to avoid spurious digits, in number of decimal places to include.
   * Numbers beyond this are truncated.
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static SignificantFigures(value: number, decimalDigitsTolerance: number = Number.MAX_VALUE): number {
    const ePortions = Math.abs(value).toString().split('e');
    const numberPortions = ePortions[0].toString().split('.');

    // TODO: Handle Scientific Notation
    let ePortion = parseInt(ePortions[1]);
    if (isNaN(ePortion) || !ePortion) {
      ePortion = 0;
    }

    let wholeNumber = numberPortions[0];
    // Remove leading zeros
    wholeNumber = Numbers.trimStart(wholeNumber, '0');

    if (numberPortions.length === 1 || decimalDigitsTolerance === 0) {   // Number has no decimal places.
      // Remove trailing zeros as they are all to the left of the decimal point
      return Numbers.trimEnd(wholeNumber, '0').length;
    }

    let decimalNumber = numberPortions[1];
    if (decimalDigitsTolerance !== Number.MAX_VALUE
      && 0 < decimalDigitsTolerance
      && decimalDigitsTolerance < decimalNumber.length) {
      decimalNumber = decimalNumber.slice(0, decimalDigitsTolerance);
    }

    if (wholeNumber.length === 0) {
      // Number has no whole numbers
      // Remove leading zeros as they are all to the left of the sig figs
      // Keep trailing zeros since they count as sig figs
      return Numbers.trimStart(decimalNumber, '0').length;
    }

    // Number contains whole numbers as well as decimals.
    // Leading zeros have been trimmed
    // Trailing zeros are in decimal portion
    // Remaining zeros are all between sig figs
    return wholeNumber.length + decimalNumber.length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @protected
 * @static
 * @param {string} value
 * @param {string} char
 * @returns {*}
 */
  protected static trimStart(value: string, char: string) {
    return value.replace(new RegExp(`^${char}+`), '');
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @protected
 * @static
 * @param {string} value
 * @param {string} char
 * @returns {*}
 */
  protected static trimEnd(value: string, char: string) {
    return value.replace(new RegExp(`${char}+$`), '');
  }

  /// <summary>
  /// Determines the maximum of the parameters.
  /// </summary>
  /// <param name="items">The items.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="ArgumentException">Argument cannot be null.</exception>
  /// <exception cref="ArgumentException">Array has not been dimensioned.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {...number[]} items
 * @returns {number}
 */
  public static Max(...items: number[]): number {
    return Math.max(...items);
  }

  /// <summary>
  /// Determines the minimum of the parameters.
  /// </summary>
  /// <param name="items">The items.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="ArgumentException">Argument cannot be null.</exception>
  /// <exception cref="ArgumentException">Array has not been dimensioned.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {...number[]} items
 * @returns {number}
 */
  public static Min(...items: number[]): number {
    return Math.min(...items);
  }

  // === Powers
  /// <summary>
  /// Returns the value squared.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {number}
 */
  public static Squared(value: number): number {
    return (value * value);
  }

  /// <summary>
  /// Returns the value cubed.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {number}
 */
  public static Cubed(value: number): number {
    return (value * value * value);
  }

  /// <summary>
  /// Returns the value raised to the power provided.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="power">The power.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="DivideByZeroException"></exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} power
 * @returns {number}
 */
  public static Pow(value: number, power: number): number {
    if (value == 0 && Numbers.IsNegativeSign(power)) {
      throw new DivideByZeroException(`${value}^${power} results in a division by zero, which is undefined.`);
    }
    return Math.pow(value, power);
  }

  /// <summary>
  /// Returns the square root of the specified value.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {number}
 */
  public static Sqrt(value: number): number {
    return Math.sqrt(value);
  }

  /// <summary>
  /// Returns the cube root of the specified value.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @returns {number}
 */
  public static CubeRoot(value: number): number {
    return Numbers.Root(value, 3);
  }

  /// <summary>
  /// Returns the root of the number.
  /// </summary>
  /// <param name="value">The value.</param>
  /// <param name="root">The root.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} root
 * @returns {number}
 */
  public static Root(value: number, root: number): number {
    if (Numbers.IsZeroSign(root)) {
      throw new DivideByZeroException("Root cannot be zero.");
    }

    return Numbers.IsOdd(root) ? Math.sign(value) * Numbers.Pow(Math.abs(value), 1 / root) : Numbers.Pow(value, 1 / root);
  }

  // #region Other Modifications

  /**
   * Sets value to zero if within absolute tolerance (exclusive), otherwise returns value.
   *
   * @static
   * @param {number} value
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static ValueAsZeroIfWithinAbsoluteTolerance(value: number, tolerance: number = Numbers.ZeroTolerance): number {
    return Numbers.IsZeroSign(value, tolerance) ? 0 : value;
  }

  /**
   * The product of an integer and all the integers below it; e.g., factorial four ( 4! ) is equal to 24.
   *
   * @static
   * @param {number} value If the value is not an integer, the factorial will be calculated by the next lowest integer.
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static Factorial(value: number): number {
    if (value === 0) {
      return 0;
    }
    let result = 1;
    for (let i = 1; i <= value; i++) {
      result *= i;
    }
    return result;
  }


  /**
   * Returns the paired result of adding and subtracting the provided value from the base value.
   *
   * @static
   * @param {number} baseValue
   * @param {number} plusMinusValue Value to add and subtract from the base value.
   * @return {*}  {number[]}
   * @memberof Numbers
   */
  public static PlusMinus(baseValue: number, plusMinusValue: number): number[] {
    return [
      baseValue + plusMinusValue,
      baseValue - plusMinusValue
    ];
  }


  /**
   * Restricts a value to be within a specified range.
   *
   * @static
   * @param {number} value The value to clamp.
   * @param {number} min The minimum value. If value is less than min, min will be returned.
   * @param {number} max The maximum value. If value is greater than max, max will be returned.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}  {number} The clamped value.
   *
   * If value &gt; max, max will be returned.
   *
   * If value &lt; min, min will be returned.
   *
   * If min ≤ value ≥ max, value will be returned.
   * @memberof Numbers
   */
  public static Limit(value: number, min: number, max: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (max < min) {
      throw new ArgumentException(`Max limit, ${max}, is less than the min limit, ${min}`);
    }

    if (Number.isInteger(value)) {
      if (value > max) { return max; }
      if (value < min) { return min; }
    } else {
      if (Numbers.IsGreaterThan(value, max, tolerance)) { return max; }
      if (Numbers.IsLessThan(value, min, tolerance)) { return min; }
    }
    return value;
  }

  /**
   * Rounds to significant figures.
   *
   * See: https://stackoverflow.com/questions/36369239/how-can-i-round-to-an-arbitrary-number-of-significant-digits-with-javascript
   * https://en.wikipedia.org/wiki/Significant_figures
   *
   * @static
   * @param {number} value
   * @param {number} significantFigures The number of significant figures.
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static RoundToSignificantFigures(
    value: number,
    significantFigures: number
  ): number {
    if (value === 0 || significantFigures === 0) { return 0; }

    // Get value scaled to having sig figs result as an integer
    //    e.g. 4th sig fig 12345 = 1234.5
    //    or 0.00012345 = 1234.5,
    //    7th sig fig 12.345 = 1234500
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const nIntegers = exponent + 1
    const precision = 10 ** (nIntegers - significantFigures);
    return Numbers.RoundToPrecision(value, precision);
  }

  /**
   * // TODO: Fix. This is completely broken.
   * Rounds to decimal places.
   *
   * See: https://stackoverflow.com/questions/36369239/how-can-i-round-to-an-arbitrary-number-of-significant-digits-with-javascript
   * https://en.wikipedia.org/wiki/Significant_figures
   *
   * @static
   * @param {number} value
   * @param {number} decimalPlaces The number of decimal places.
   * @return {*}  {number}
   * @memberof Numbers
   */
  public static RoundToDecimalPlaces(
    value: number,
    decimalPlaces: number
  ): number {
    // RoundToPrecision does not work for this in this way!
    return Numbers.RoundToPrecision(value, decimalPlaces * 0.1);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:24 PM
 *
 * @public
 * @static
 * @param {number} value
 * @param {number} precision
 * @returns {number}
 */
  public static RoundToPrecision(
    value: number,
    precision: number
  ) {
    if (value === 0 || precision === 0) { return 0; }
    return Math.round(value / precision) * precision;
  }


  // #region Display
  // /// <summary>
  // /// Rounds to significant figures.
  // /// </summary>
  // /// <seealso cref="RoundToSignificantFigures">https://en.wikipedia.org/wiki/Significant_figures</seealso>
  // /// <param name="value">The value.</param>
  // /// <param name="significantFigures">The number of significant figures.</param>
  // /// <param name="roundingTieBreaker">Method by which rounding is performed if the triggering rounding number is 5.</param>
  // /// <returns>System.Double.</returns>
  // public static string DisplayRoundedToSignificantFigures(
  //     double value,
  //     int significantFigures,
  //     RoundingTieBreaker roundingTieBreaker = RoundingTieBreaker.HalfAwayFromZero)
  // {
  //     value = RoundToSignificantFigures(value, significantFigures, roundingTieBreaker);
  //     string valueAsString = value.ToString(CultureInfo.InvariantCulture);
  //     if (significantFigures <= 0)
  //     {
  //         return valueAsString;
  //     }

  //     // Get number of decimal places
  //     int prePaddingLength = valueAsString.Length;
  //     string wholeNumber;
  //     string decimalNumber = "";
  //     int wholeNumberLength;
  //     if (valueAsString.Contains(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator))
  //     {
  //         wholeNumber = valueAsString.Split(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator)[0];
  //         decimalNumber = valueAsString.Split(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator)[1];
  //         wholeNumberLength = (wholeNumber[0] == '-') ? wholeNumber.Length - 1 : wholeNumber.Length;
  //     }
  //     else
  //     {
  //         wholeNumber = valueAsString;
  //         wholeNumberLength = (wholeNumber[0] == '-') ? wholeNumber.Length - 1 : wholeNumber.Length;

  //         if (wholeNumber[0] == '0')
  //         {
  //             prePaddingLength += 1;
  //         }
  //         else if(significantFigures <= wholeNumberLength)
  //         {
  //             return valueAsString;
  //         }
  //     }
  //     int valueSigFigLength;
  //     char firstInteger = (wholeNumber[0] == '-') ? wholeNumber[1] : wholeNumber[0];
  //     if (valueAsString.Contains(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator) && firstInteger != '0')
  //     {
  //         valueSigFigLength = (wholeNumber[0] == '-') ? valueAsString.Length - 2 : valueAsString.Length - 1;
  //     }
  //     else
  //     {
  //         string sigFigAsString = valueAsString.TrimStart('-')
  //                                              .TrimStart('0')
  //                                              .Replace(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator, "")
  //                                              .TrimStart('0');
  //         valueSigFigLength = sigFigAsString.Length;
  //     }
  //     string separator = ((significantFigures >= wholeNumberLength) || firstInteger == '0') ? CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator : "";

  //     string result = wholeNumber + separator + decimalNumber;
  //     int zeroPadding = significantFigures - valueSigFigLength;
  //     result = result.PadRight(prePaddingLength + zeroPadding, '0');
  //     return result;
  // }

  // /// <summary>
  // /// Rounds to decimal places.
  // /// </summary>
  // /// <seealso cref="RoundToDecimalPlaces">https://en.wikipedia.org/wiki/Significant_figures</seealso>
  // /// <param name="value">The value.</param>
  // /// <param name="decimalPlaces">The number of decimal places.</param>
  // /// <param name="roundingTieBreaker">Method by which rounding is performed if the triggering rounding number is 5.</param>
  // /// <returns>System.Double.</returns>
  // public static string DisplayRoundedToDecimalPlaces(
  //     double value,
  //     int decimalPlaces,
  //     RoundingTieBreaker roundingTieBreaker = RoundingTieBreaker.HalfAwayFromZero)
  // {
  //     value = RoundToDecimalPlaces(value, decimalPlaces, roundingTieBreaker);
  //     string valueAsString = value.ToString(CultureInfo.InvariantCulture);
  //     if (decimalPlaces <= 0)
  //     {
  //         return valueAsString;
  //     }

  //     // Get number of decimal places
  //     int prePaddingLength = valueAsString.Length;
  //     string wholeNumber;
  //     string decimalNumber = "";
  //     int valueDecimalLength = valueAsString.Length;
  //     if (valueAsString.Contains(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator))
  //     {
  //         wholeNumber = valueAsString.Split(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator)[0];
  //         decimalNumber = valueAsString.Split(CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator)[1];
  //         valueDecimalLength -= (wholeNumber.Length + 1);
  //     }
  //     else
  //     {
  //         wholeNumber = valueAsString;
  //         valueDecimalLength = 0;

  //         if (wholeNumber[0] == '0')
  //         {
  //             prePaddingLength += 1;
  //         }
  //     }

  //     string result = wholeNumber + CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator + decimalNumber;
  //     int zeroPadding = decimalPlaces - valueDecimalLength;
  //     result = result.PadRight(prePaddingLength + zeroPadding, '0');
  //     return result;
  // }
}