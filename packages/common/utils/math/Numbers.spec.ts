import { Numbers } from './Numbers';


const Tolerance = 0.00001;
describe('###Numbers', () => {
  describe('##Constants', () => {
    describe('#Log10E', () => {
      it('should return log base 10 of e', () => {
        const result = Numbers.Log10E();
        expect(Math.abs(result - 0.4342944819)).toBeLessThanOrEqual(0.00000000001);
      });
    });

    describe('#Log2E', () => {
      it('should return log base 2 of e', () => {
        const result = Numbers.Log2E();
        expect(Math.abs(result - 1.44269504)).toBeLessThanOrEqual(0.00000001);
      })
    });

    describe('#GoldenRatio', () => {
      it('should return the golden ratio number', () => {
        const result = Numbers.GoldenRatio();
        expect(Math.abs(result - 1.61803398875)).toBeLessThanOrEqual(0.00000000001);
      })
    });
  });


  describe('##Signs', () => {
    describe('#IsPositiveSign', () => {
      it.each([
        [-1, false],
        [0, false],
        [1, true],
        [-5.31256712, false],
        [5.31256712, true],
        [Infinity, true],
        [-Infinity, false]
      ])('given %p should return %p for the default tolerance',
        (value, expected) => {
          value = value as number;

          const result = Numbers.IsPositiveSign(value);

          expect(result).toEqual(expected);
        });

      it.each([
        [-0.001, 0.1, false],
        [0, 0.1, false],
        [0.001, 0.1, false],
        [0.001, 0.0001, true],
        [0.001, -0.0001, true],
      ])('given %p and a custom tolerance %p, should return %p',
        (value, customTolerance, expected) => {
          value = value as number;
          customTolerance = customTolerance as number;

          const result = Numbers.IsPositiveSign(value, customTolerance);

          expect(result).toEqual(expected);
        })
    });

    describe('#IsNegativeSign', () => {
      it.each([
        [-1, true],
        [0, false],
        [1, false],
        [-5.31256712, true],
        [5.31256712, false],
        [Infinity, false],
        [-Infinity, true]
      ])('given %p should return %p for the default tolerance', (value, expected) => {
        value = value as number;

        const result = Numbers.IsNegativeSign(value);

        expect(result).toEqual(expected);
      });

      it.each([
        [-0.001, 0.1, false],
        [0, 0.1, false],
        [0.001, 0.1, false],
        [-0.001, 0.0001, true],
        [-0.001, -0.0001, true]
      ])('given %p and a custom tolerance %p, should return %p',
        (value, customTolerance, expected) => {
          value = value as number;
          customTolerance = customTolerance as number;

          const result = Numbers.IsNegativeSign(value, customTolerance);

          expect(result).toEqual(expected);
        })
    });

    describe('#IsZeroSign', () => {
      it.each([
        [0, true],
        [1, false],
        [-1, false],
        [0.0001, false],
        [-0.0001, false],
        [1.2345E-7, false],
        [1.437821381955473E-07, false],
        [-1.2345E-7, false],
        [-1.437821381955473E-07, false],
        [Infinity, false],
        [-Infinity, false]
      ])('given %p should return %p for the default tolerance', (value, expected) => {
        value = value as number;

        const result = Numbers.IsZeroSign(value);

        expect(result).toEqual(expected);
      });


      it.each([
        [0.0001, 0.001, true],
        [-0.0001, 0.001, true],
        [0.0001, -0.001, true],
        [-0.0001, -0.001, true],
        [0.0001, 0.0001, false],
        [-0.0001, 0.0001, false],
        [0.0001, -0.0001, false],
        [-0.0001, -0.0001, false],
        [1.2345E-7, 0.0001, true],
        [1.437821381955473E-07, 0.0001, true],
        [-1.2345E-7, 0.0001, true],
        [-1.437821381955473E-07, 0.0001, true],
        [Infinity, 0.0001, false],
        [-Infinity, 0.0001, false]
      ])('given %p and a custom tolerance %p, should return %p',
        (value, customTolerance, expected) => {
          value = value as number;
          customTolerance = customTolerance as number;

          const result = Numbers.IsZeroSign(value, customTolerance);

          expect(result).toEqual(expected);

        })
    });

    describe('#Sign', () => {
      it.each([
        [0, 1],
        [1, 1],
        [-1, -1],
        [5.5, 1],
        [-5.5, -1]
      ])('given %p, should return %p for the default tolerance',
        (value, expected) => {
          value = value as number;

          const result = Numbers.Sign(value);

          expect(result).toEqual(expected);
        });

      it.each([
        [0.01, 0.001, 1],
        [0.001, 0.001, 1],
        [-0.01, 0.001, -1],
        [-0.0001, 0.001, 1], // Near zero on the negative end, within tolerance
      ])('given %p & %p, and a custom tolerance %p, should return %p',
        (value, customTolerance, expected) => {
          value = value as number;
          customTolerance = customTolerance as number;

          const result = Numbers.Sign(value, customTolerance);

          expect(result).toEqual(expected);

        });

    });
  });


  describe('##Comparisons', () => {

    describe('#AreEqual', () => {
      it.each([
        [0, 0, true],
        [1, 1, true],
        [-1, -1, true],
        [-1, 1, false],
        [5.6882, 5.6882, true],
        [5.6882, 5.6880, false],
        [Infinity, Infinity, true],
        [-Infinity, -Infinity, true],
        [Infinity, -Infinity, false]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.AreEqual(valueA, valueB);

          expect(result).toEqual(expected);
        });

      it.each([
        [5.555, 5.554, 0.001, true],
        [5.555, 5.554, -0.001, true],
        [-5.555, -5.554, 0.001, true],
        [-5.555, -5.554, -0.001, true],
        [5.555, 5.554, 0.0001, false],
        [-5.555, -5.554, 0.0001, false]
      ])('given %p & %p, and custom tolerance %p, should return %p',
        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.AreEqual(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);

        });
    });

    describe('#IsEqualTo', () => {
      it.each([
        [0, 0, true],
        [1, 1, true],
        [-1, -1, true],
        [-1, 1, false],
        [5.6882, 5.6882, true],
        [5.6882, 5.6880, false],
        [Infinity, Infinity, true],
        [-Infinity, -Infinity, true],
        [Infinity, -Infinity, false]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.IsEqualTo(valueA, valueB);

          expect(result).toEqual(expected);
        });

      it.each([
        [5.555, 5.554, 0.001, true],
        [5.555, 5.554, -0.001, true],
        [-5.555, -5.554, 0.001, true],
        [-5.555, -5.554, -0.001, true],
        [5.555, 5.554, 0.0001, false],
        [-5.555, -5.554, 0.0001, false]
      ])('given %p & %p, and a custom tolerance %p, should return %p',
        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.IsEqualTo(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsGreaterThan', () => {
      it.each([
        [0, 0, false],
        [1, 1, false],
        [-1, -1, false],
        [-1, -2, true],
        [-2, -1, false],
        [1, -1, true],
        [5.6882, 0, true],
        [5.6882, 5.68, true],
        [-5.6882, 0, false],
        [-5.6882, -5.68, false],
        [5.6882, Infinity, false],
        [5.6882, -Infinity, true],
        [-5.6882, Infinity, false],
        [-5.6882, -Infinity, true]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.IsGreaterThan(valueA, valueB);

          expect(result).toEqual(expected);
        });
      it.each([
        [5.555, 5.554, 0.001, false],
        [5.555, 5.554, 0.0001, true],
        [5.555, 5.554, -0.0001, true],
        [-5.554, -5.555, 0.001, false],
        [-5.554, -5.555, 0.0001, true],
        [-5.554, -5.555, -0.0001, true]
      ])('given %p & %p, and a custom tolerance %p, should return %p',
        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.IsGreaterThan(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsLessThan', () => {
      it.each([
        [0, 0, false],
        [1, 1, false],
        [-1, -1, false],
        [-1, -2, false],
        [-2, -1, true],
        [1, -1, false],
        [5.6882, 0, false],
        [5.68, 5.6882, true],
        [-5.6882, 0, true],
        [-5.6882, -5.68, true],
        [5.6882, Infinity, true],
        [5.6882, -Infinity, false],
        [-5.6882, Infinity, true],
        [-5.6882, -Infinity, false]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.IsLessThan(valueA, valueB);

          expect(result).toEqual(expected);
        });

      it.each([
        [5.554, 5.555, 0.0001, true],
        [5.554, 5.555, -0.0001, true],
        [5.554, 5.555, 0.01, false],
        [-5.555, -5.554, 0.0001, true],
        [-5.555, -5.554, -0.0001, true],
        [-5.555, -5.554, 0.01, false]
      ])('given %p & %p, and a custom tolerance %p, should return %p',

        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.IsLessThan(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsGreaterThanOrEqualTo', () => {
      it.each([
        [-1, 0, false],
        [0, 0, true],
        [1, 0, true],
        [-1, 2.3, false],
        [1.5, -2.3, true],
        [0, 2.3, false],
        [2.29, 2.3, false],
        [2.3, 2.3, true],
        [2.31, 2.3, true],
        [-2.29, -2.3, true],
        [-2.3, -2.3, true],
        [-2.31, -2.3, false]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.IsGreaterThanOrEqualTo(valueA, valueB);

          expect(result).toEqual(expected);

        });

      it.each([
        [-1, 0, 0.0001, false],
        [0, 0, 0.0001, true],
        [1, 0, 0.0001, true],
        [-1, 2.3, 0.0001, false],
        [1.5, -2.3, 0.0001, true],
        [0, 2.3, 0.0001, false],
        [2.29, 2.3, 0.0001, false],
        [2.3, 2.3, 0.0001, true],
        [2.31, 2.3, 0.0001, true],
        [-2.29, -2.3, 0.0001, true],
        [-2.3, -2.3, 0.0001, true],
        [-2.31, -2.3, 0.0001, false]
      ])('given %p & %p, and a custom tolerance %p, should return %p',

        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.IsGreaterThanOrEqualTo(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsLessThanOrEqualTo', () => {
      it.each([
        [-1, 0, true],
        [0, 0, true],
        [1, 0, false],
        [-1, 2.3, true],
        [1.5, -2.3, false],
        [0, 2.3, true],
        [2.29, 2.3, true],
        [2.3, 2.3, true],
        [2.31, 2.3, false],
        [-2.29, -2.3, false],
        [-2.3, -2.3, true],
        [-2.31, -2.3, true]
      ])('given %p & %p, should return %p for the default tolerance',
        (valueA, valueB, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          expected = expected as boolean;

          const result = Numbers.IsLessThanOrEqualTo(valueA, valueB);

          expect(result).toEqual(expected);

        });

      it.each([
        [-1, 0, 0.0001, true],
        [0, 0, 0.0001, true],
        [1, 0, 0.0001, false],
        [-1, 2.3, 0.0001, true],
        [1.5, -2.3, 0.0001, false],
        [0, 2.3, 0.0001, true],
        [2.29, 2.3, 0.0001, true],
        [2.3, 2.3, 0.0001, true],
        [2.31, 2.3, 0.0001, false],
        [-2.29, -2.3, 0.0001, false],
        [-2.3, -2.3, 0.0001, true],
        [-2.31, -2.3, 0.0001, true]
      ])('given %p & %p, and a custom tolerance %p, should return %p',
        (valueA, valueB, customTolerance, expected) => {
          valueA = valueA as number;
          valueB = valueB as number;
          customTolerance = customTolerance as number;
          expected = expected as boolean;

          const result = Numbers.IsLessThanOrEqualTo(valueA, valueB, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsWithinInclusive', () => {
      it.each([
        [2, 1, 3, true],
        [1, 1, 3, true],
        [1, 3, 1, true],
        [0.999, 1, 3, false],
        [0.999, 3, 1, false],
        [3, 1, 3, true],
        [3, 3, 1, true],
        [3.001, 1, 3, false],
        [3.001, 3, 1, false],
        [1, 1.1, 3, false],
        [1.2, 1.1, 3, true],
        [3.01, 1, 3.001, false],
        [3.0001, 1, 3.001, true]
      ])('given value %p, and inclusive bounds %p & %p, should return %p',
        (value, bound1, bound2, expected) => {
          value = value as number;
          bound1 = bound1 as number;
          bound2 = bound2 as number;
          expected = expected as boolean;

          const result = Numbers.IsWithinInclusive(value, bound1, bound2);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsWithinExclusive', () => {
      it.each([
        [2, 1, 3, true],
        [1, 1, 3, false],
        [1, 3, 1, false],
        [0.999, 1, 3, false],
        [0.999, 3, 1, false],
        [3, 1, 3, false],
        [3, 3, 1, false],
        [3.001, 1, 3, false],
        [3.001, 3, 1, false],
        [1, 1.1, 3, false],
        [1.1, 1.1, 3, false],
        [3.01, 1, 3.001, false],
        [3.001, 1, 3.001, false]
      ])('given value %p, and exclusive bounds %p & %p, should return %p',
        (value, bound1, bound2, expected) => {
          value = value as number;
          bound1 = bound1 as number;
          bound2 = bound2 as number;
          expected = expected as boolean;

          const result = Numbers.IsWithinExclusive(value, bound1, bound2);

          expect(result).toEqual(expected);
        });
    });
  });

  describe('##Properties', () => {
    describe('#IsEven', () => {
      it.each([
        [0, true],
        [2, true],
        [6, true],
        [54, true],
        [-2, true],
        [-6, true],
        [-54, true],
        [1, false],
        [3, false],
        [5, false],
        [-1, false],
        [-3, false],
        [-5, false]
      ])('given %p, should return %p', (value, expected) => {
        value = value as number;

        const result = Numbers.IsEven(value);

        expect(result).toEqual(expected);

      });
    });

    describe('#IsOdd', () => {
      it.each([
        [0, false],
        [2, false],
        [6, false],
        [54, false],
        [-2, false],
        [-6, false],
        [-54, false],
        [1, true],
        [3, true],
        [5, true],
        [-1, true],
        [-3, true],
        [-5, true]
      ])('given %p, should return %p', (value, expected) => {
        value = value as number;

        const result = Numbers.IsOdd(value);

        expect(result).toEqual(expected);
      });
    });

    describe('#IsPrime', () => {
      it.each([
        [0, false],
        [1, false],
        [2, true],
        [2.1, false],
        [3, true],
        [5, true],
        [7, true],
        [11, true],
        [13, true],
        [17, true],
        [19, true],
        [23, true],
        [29, true],
        [71, true],
        [113, true],
        [601, true],
        [733, true],
        [809, true],
        [863, true],
        [941, true],
        [967, true],
        [997, true],
        [-2, true],
        [-3, true],
        [-5, true],
        [-7, true],
        [-11, true],
        [-13, true],
        [-17, true],
        [-19, true],
        [-23, true],
        [-29, true],
        [-71, true],
        [-113, true],
        [-601, true],
        [-733, true],
        [-809, true],
        [-863, true],
        [-941, true],
        [-967, true],
        [-997, true]
      ])('given prime %p, should return %p', (value, expected) => {
        value = value as number;

        const result = Numbers.IsPrime(value);

        expect(result).toEqual(expected);

      });

      it.each([
        [0, false],
        [1, false],
        [4, false],
        [6, false],
        [8, false],
        [9, false],
        [10, false],
        [25, false],
        [841, false],
        [-1, false],
        [-4, false],
        [-6, false],
        [-8, false],
        [-9, false],
        [-10, false],
        [-841, false]
      ])('given non-prime %p, should return %p', (value, expected) => {
        value = value as number;

        const result = Numbers.IsPrime(value);

        expect(result).toEqual(expected);

      });
    });

    describe('#LastDigit', () => {
      it.each([
        [-1, 1],
        [-97, 7],
        [3, 3],
        [45, 5],
        [63, 3]
      ])('given %p should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.LastDigit(value);

          expect(result).toEqual(expected);
        });
    });

    describe('#IsComposite', () => {
      it.each([
        [0, false],
        [1, false],
        [2, false],
        [3, false],
        [5, false],
        [7, false],
        [11, false],
        [13, false],
        [17, false],
        [19, false],
        [23, false],
        [29, false],
        [71, false],
        [113, false],
        [601, false],
        [733, false],
        [809, false],
        [863, false],
        [941, false],
        [967, false],
        [997, false],
        [-2, false],
        [-3, false],
        [-5, false],
        [-7, false],
        [-11, false],
        [-13, false],
        [-17, false],
        [-19, false],
        [-23, false],
        [-29, false],
        [-71, false],
        [-113, false],
        [-601, false],
        [-733, false],
        [-809, false],
        [-863, false],
        [-941, false],
        [-967, false],
        [-997, false]
      ])('given %p should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as boolean;

          const result = Numbers.IsComposite(value);

          expect(result).toEqual(expected);
        });


      it.each([
        [0, false],
        [1, false],
        [4, true],
        [6, true],
        [8, true],
        [9, true],
        [10, true],
        [841, true],
        [-1, true],
        [-4, true],
        [-6, true],
        [-8, true],
        [-9, true],
        [-10, true],
        [-841, true]
      ])('given %p should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as boolean;

          const result = Numbers.IsComposite(value);

          expect(result).toEqual(expected);
        });
    });

    describe('#DecimalPlaces', () => {
      it.each([
        [0, 0],
        [1, 0],
        [-1, 0],
        [0.0009, 4],
        [0.9, 1],
        [1.1, 1],
        [-0.0009, 4],
        [-0.9, 1],
        [-1.1, 1],
        [5000.12345678, 8],
        [-5000.12345678, 8],
        [-0.1234567891111111, 15],  // 16 places = 16 > 15 so 1 places extra => 16 - 1 places = 15 places
        [-5000.1234567891115, 11],  // 13 places + 4 whole = 17 > 15 so 2 places extra => 13 - 2 places = 11 places
        [-1.437821381955473E-07, 15], // 15 places + 7 exp (includes 1 whole) = 22 > 15 so 7 places extra => 22 - 7 = 15
        [1E-1, 1],
        [1E-2, 2],
        [1E-3, 3],
        [1.34E-3, 5],
        [1E-15, 15], // Compare to test w/ no rounding limits
        [1E-16, 15], // Compare to test w/ no rounding limits
      ])('given %p, should return %p decimal places',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.DecimalPlaces(value);

          expect(result).toEqual(expected);
        });

      it.each([
        [-0.1234567891111111, 16],  // 16 places = 16
        [-5000.1234567891115, 13],  // 16 places + 4 whole = 20 > 15 so 5 places extra => 16 - 5 places = 11 places
        [-1.437821381955473E-07, 22],
        [1E-15, 15], // Compare to test w/ rounding limits
        [1E-16, 16], // Compare to test w/ rounding limits
      ])('given %p, should return %p decimal places not limited when overridden',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const limitForRounding = false;

          const result = Numbers.DecimalPlaces(value, limitForRounding);

          expect(result).toEqual(expected);
        });
    });

    describe('#SignificantFigures', () => {
      it.each([
        [0, 0],
        [1, 1],
        [10, 1],
        [10.0, 1],
        [15, 2],
        [15.0, 2],
        [666, 3],
        [6.66, 3],
        [-6.66, 3],
        [0.1, 1],
        [0.01, 1],
        [0.21, 2],
        [0.001, 1],
        [0.321, 3],
        [0.00321, 3],
        [-0.00321, 3],
        [1.00321, 6],
        // TODO: Handle Scientific Notation
      ])('given %p, should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.SignificantFigures(value);

          expect(result).toEqual(expected);
        });

      it.each([
        [1.23456, -10, 6], // Limit negative
        [1.23456, 0, 1], // Limit zero
        [1.23456, 1, 2], // Limit one
        [1.23456, 3, 4], // Limit less than number provided
        [1.23456, 5, 6], // Limit equal to number provided
        [1.23456, 6, 6], // Limit greater than number provided
      ])('given %p with decimalDigitsTolerance %p, should return %p',
        (value, decimalDigitsTolerance, expected) => {
          value = value as number;
          decimalDigitsTolerance = decimalDigitsTolerance as number;
          expected = expected as number;

          const result = Numbers.SignificantFigures(value, decimalDigitsTolerance);

          expect(result).toEqual(expected);
        });

    });

    describe('#Max', () => {
      it('should return the max of a set of numbers', () => {
        const result = Numbers.Max(3, 5.2, 9.1, 0, -1.3);

        expect(result).toEqual(9.1);
      });
    });

    describe('#Min', () => {
      it('should return the min of a set of numbers', () => {
        const result = Numbers.Min(3, 5.2, 9.1, 0, -1.3);

        expect(result).toEqual(-1.3);
      });
    });
  });

  describe('##Powers', () => {
    describe('#Squared', () => {
      it.each([
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4.4, 4.4 * 4.4],
        [Infinity, Infinity],
        [-Infinity, Infinity]
      ])('given %p should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.Squared(value);

          expect(result).toEqual(expected);
        });
    });

    describe('#Cubed', () => {
      it.each([
        [0, 0],
        [1, 1],
        [2, 8],
        [3, 27],
        [4.4, 4.4 * 4.4 * 4.4],
        [Infinity, Infinity],
        [-Infinity, -Infinity]
      ])('given %p should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.Cubed(value);

          expect(result).toEqual(expected);
        });
    });

    describe('#Pow', () => {
      it.each([
        [5, 2, 25],
        [5, -2, (1 / 25)],
        [0, 2, 0],
        [2, 0, 1],
        [0, 0, 1],
        [-1, 0, 1],
        [Infinity, 0, 1],
        [-Infinity, 0, 1],
        [Infinity, 2, Infinity],
        [-Infinity, 2, Infinity],
        [-Infinity, 3, -Infinity],
        [2, Infinity, Infinity],
        [2, -Infinity, 0]
      ])('given %p to %p power, should return %p',
        (value, power, expected) => {
          value = value as number;
          power = power as number;
          expected = expected as number;

          const result = Numbers.Pow(value, power);

          expect(result).toEqual(expected);
        });


      it.each([
        [0, -1]
      ])('given %p should throw an error',
        (value, power) => {
          value = value as number;
          power = power as number;

          expect(() => Numbers.Pow(value, power)).toThrow();
        });

    });

    describe('#Sqrt', () => {
      it.each([
        [0, 0],
        [4, 2],
        [3, 1.73205081],
        [2, 1.414213562],
        [2.31, 1.51986842],
      ])('given %p, should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.Sqrt(value);

          expect(result - expected).toBeLessThanOrEqual(Tolerance);
        });

      it.each([
        [-4],
        [-2.31],
        [-4],
        [-3],
        [-2]
      ])('given negative value %p, should return NaN',
        (value) => {
          const result = Numbers.Sqrt(value);

          expect(result).toBeNaN();
        });
    });

    describe('#CubeRoot', () => {
      it.each([
        [-9, -2.0801],
        [-3, -1.4422],
        [-1, -1],
        [0, 0],
        [1, 1],
        [3, 1.4422],
        [8, 2],
        [9, 2.0801],
        [15, 2.4662],
        [27, 3],
        [-9.9, -2.1472],
        [0, 0],
        [9.9, 2.1472]
      ])('given %p, should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.CubeRoot(value);
          expect(result - expected).toBeLessThanOrEqual(0.0001);
        });

    });

    describe('#Root', () => {
      it.each([
        [3, 0],
        [3.3, 0]
      ])('given %p should throw an error for a zero root',
        (value, root) => {
          value = value as number;
          root = root as number;

          expect(() => Numbers.Root(value, root)).toThrow();
        });

      it.each([
        [4, 2, 2],
        [9, 3, 2.0801],
        [-1, 3, -1],
        [-9, 3, -2.0801],
        [-1, -3, -1],
        [-9, -3, -0.4807],
        [4.1, 2, 2.0248],
        [9.1, 3.1, 2.0388],
        [9.1, -3.1, 0.4905]
      ])('given %p and the %p root, should return %p',
        (value, root, expected) => {
          value = value as number;
          root = root as number;

          const result = Numbers.Root(value, root);

          expect(result - expected).toBeLessThanOrEqual(0.0001);
        });

      it.each([
        [-1, 2],
        [-1.1, 2.2]
      ])('given negative value %p, the non-odd root %p should return NaN',
        (value, root) => {
          value = value as number;
          root = root as number;

          const result = Numbers.Root(value, root);

          expect(result).toBeNaN();
        });
    });
  });

  describe('##Other Modifications', () => {
    describe('#ValueAsZeroIfWithinAbsoluteTolerance', () => {
      it.each([
        [1, 1.1, 0],
        [-1, 1.1, 0],
        [1, -1.1, 0],
        [-1, -1.1, 0],
        [1, 0.9, 1],
        [-1, 0.9, -1],
        [1, -0.9, 1],
        [-1, -0.9, -1],
        [1, 1, 1],
        [-1, 1, -1],
        [1, -1, 1],
        [-1, -1, -1]
      ])('given %p and custom tolerance %p, should return %p',
        (value, customTolerance, expected) => {
          value = value as number;
          customTolerance = customTolerance as number;
          expected = expected as number;

          const result = Numbers.ValueAsZeroIfWithinAbsoluteTolerance(value, customTolerance);

          expect(result).toEqual(expected);
        });
    });

    describe('#Factorial', () => {
      it.each([
        [0, 0],
        [1, 1],
        [2, 1 * 2],
        [3, 1 * 2 * 3],
        [4, 1 * 2 * 3 * 4]
      ])('given %p, should return %p',
        (value, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.Factorial(value);

          expect(result).toEqual(expected);
        });
    });

    describe('#PlusMinus', () => {
      it.each([
        [0, 0, 0, 0],
        [1, 1, 2, 0],
        [-2, -3, -5, 1],
        [0, 0.0, 0.0, 0.0],
        [1, 1.1, 2.1, -0.1],
        [-2, -3.2, -5.2, 1.2],
        [0.0, 0.0, 0.0, 0.0],
        [1.1, 1, 2.1, 0.1],
        [-2.1, -3, -5.1, 0.9],
        [1.1, 1.1, 2.2, 0],
        [-2.2, -3.2, -5.4, 1]
      ])('given %p should return %p for the default tolerance',
        (value, plusMinusValue, expected1, expected2) => {
          value = value as number;
          plusMinusValue = plusMinusValue as number;
          expected1 = expected1 as number;
          expected2 = expected2 as number;

          const results = Numbers.PlusMinus(value, plusMinusValue);

          expect(results[0] - expected1).toBeLessThanOrEqual(0.000001);
          expect(results[1] - expected2).toBeLessThanOrEqual(0.000001);
        });
    });

    describe('#Limit', () => {
      it.each([
        [1, 1, 1, 1],
        [1, 1, 2, 1],
        [1, -1, 2, 1],
        [2, 1, 2, 2],
        [-1, -1, 2, -1],
        [3, 1, 2, 2],
        [-2, -1, 2, -1],
        [1, 0.9, 1.1, 1],
        [1, 0.9, 2.1, 1],
        [1, -1.1, 2.1, 1],
        [2, 1.1, 2.1, 2],
        [-1, -1.1, 2.1, -1],
        [3, 1.1, 2.1, 2.1],
        [-2, -1.1, 2.1, -1.1],
        [1.0, 0.9, 1.1, 1.0],
        [1.1, 0.9, 2.1, 1.1],
        [1.1, -1.1, 2.1, 1.1],
        [2.1, 1.1, 2.1, 2.1],
        [-1.1, -1.1, 2.1, -1.1],
        [3.1, 1.1, 2.1, 2.1],
        [-2.1, -1.1, 2.1, -1.1]
      ])('given %p, and min %p and max %p, should return %p',
        (value, min, max, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.Limit(value, min, max);

          expect(result).toEqual(expected);
        });

      it.each([
        [-2, 2, -1],   // Flipped max/min
        [3, 2, -1],   // Flipped max/min
        [-2, 2.2, -1.2],   // Flipped max/min
        [3, 2.2, -1.2],   // Flipped max/min
        [-2.2, 2.2, -1.2],   // Flipped max/min
        [3.2, 2.2, -1.2],   // Flipped max/min
      ])('given %p & reversed max/min %p & %p, should throw error',
        (value, min, max) => {
          value = value as number;

          expect(() => Numbers.Limit(value, min, max)).toThrow();
        });
    });

    describe('#RoundToSignificantFigures', () => {
      it.each([
        [0, 0, 0],
        [0, 1, 0],
        [5, 0, 0],
        [-549, 1, -500],
        [-551, 1, -600],
        [12.345, 6, 12.345], // technically 12.3450, but doubles do not retain trailing decimal zeros
        [12.345, 5, 12.345],
        [12.345, 3, 12.3],
        [12.345, 2, 12],
        [12.345, 1, 10],
        [12.345, 0, 0],
        [-12.345, 6, -12.345], // technically 12.3450, but doubles do not retain trailing decimal zeros
        [-12.345, 5, -12.345],
        [-12.345, 3, -12.3],
        [-12.345, 2, -12],
        [-12.345, 1, -10],
        [-12.345, 0, 0],
        [0.012345, 7, 0.012345], // technically 0.01234500, but doubles do not retain trailing decimal zeros
        [0.012345, 6, 0.012345], // technically 0.0123450, but doubles do not retain trailing decimal zeros
        [0.012345, 5, 0.012345],
        [0.012345, 3, 0.0123],
        [0.012345, 2, 0.012],
        [0.012345, 1, 0.01],
        [0.012345, 0, 0],
        [-0.012345, 7, -0.012345], // technically 0.01234500, but doubles do not retain trailing decimal zeros
        [-0.012345, 6, -0.012345], // technically 0.0123450, but doubles do not retain trailing decimal zeros
        [-0.012345, 5, -0.012345],
        [-0.012345, 3, -0.0123],
        [-0.012345, 2, -0.012],
        [-0.012345, 1, -0.01],
        [-0.012345, 0, 0]
        // TODO: Check scientific notation
        // TODO: Fix failing tests. Mostly fail by either:
        //    truncating rather than rounding tiebreakers
        //    returning long trailing decimals, e.g. 12.3499999 rather than 12.35
      ])('given %p rounded to %p sig figs, should return %p',
        (value, digits, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.RoundToSignificantFigures(value, digits);

          expect(result).toBeCloseTo(expected, 6);
        });

      it.each([
        [12.345, 4, 12.35], // 12.34 (even) or 12.35 (zero) *******************
        [12.355, 4, 12.36], // *******************
        [-12.345, 4, -12.35], // -12.34 or -12.35 *******************
        [-12.355, 4, -12.36], // *******************
        [0.012345, 4, 0.01235], // 0.01234 (even) or 0.01235 (zero) *******************
        [0.012355, 4, 0.01236], // *******************
        [-0.012345, 4, -0.01235], // -0.01234 or -0.01235 *******************
        [-0.012355, 4, -0.01236], // *******************
      ])('given %p rounded by %p sig figs, should return %p by the tiebreaker default',
        (value, digits, expected) => {
          value = value as number;
          expected = expected as number;

          const result = Numbers.RoundToSignificantFigures(value, digits);

          expect(result).toBeCloseTo(expected, 5);
        });

      // This was available in C# but not ported. May be worth adding later?
      // it.each([
      //   [12.345, 4, 12.35], // 12.34 (even) or 12.35 (zero) *******************
      //   [12.355, 4, 12.36], // *******************
      //   [-12.345, 4, -12.35], // -12.34 or -12.35 *******************
      //   [-12.355, 4, -12.36], // *******************
      //   [0.012345, 4, 0.01235], // 0.01234 (even) or 0.01235 (zero) *******************
      //   [0.012355, 4, 0.01236], // *******************
      //   [-0.012345, 4, -0.01235], // -0.01234 or -0.01235 *******************
      //   [-0.012355, 4, -0.01236], // *******************
      // ])('given %p should return %p for the default tolerance',
      //   (value, expected) => {

      //   });

      //   public static void RoundToSignificantFigures_TieBreaker_AwayFromZero(double value, int digits, double expectedResult) {
      //   Assert.AreEqual(expectedResult, Numbers.RoundToSignificantFigures(value, digits, RoundingTieBreaker.HalfAwayFromZero), 0.000001);
      // }

      // This only matters if the above feature is added.
      // it.each([
      //   [12.345, 4, 12.34], // 12.34 (even) or 12.35 (zero) *******************
      //   [12.355, 4, 12.36], // *******************
      //   [-12.345, 4, -12.34], // -12.34 or -12.35 *******************
      //   [-12.355, 4, -12.36], // *******************
      //   [0.012345, 4, 0.01234], // 0.01234 (even) or 0.01235 (zero) *******************
      //   [0.012355, 4, 0.01236], // *******************
      //   [-0.012345, 4, -0.01234], // -0.01234 or -0.01235 *******************
      //   [-0.012355, 4, -0.01236], // *******************
      // ])('given %p should return %p for the default tolerance',
      //   (value, expected) => {

      //   });
    });

    describe('#RoundToDecimalPlaces', () => {
      it.each([
        [12.345, 6, 12.345], // technically 12.345000, but doubles do not retain trailing decimal zeros
        [12.345, 5, 12.345], // technically 12.34500, but doubles do not retain trailing decimal zeros
        [12.345, 4, 12.345], // technically 12.3450, but doubles do not retain trailing decimal zeros
        [12.345, 3, 12.345],
        [12.345, 1, 12.3],
        [12.345, 0, 12],
        [-12.345, 6, -12.345], // technically 12.345000, but doubles do not retain trailing decimal zeros
        [-12.345, 5, -12.345], // technically 12.34500, but doubles do not retain trailing decimal zeros
        [-12.345, 4, -12.345], // technically 12.3450, but doubles do not retain trailing decimal zeros
        [-12.345, 3, -12.345],
        [-12.345, 1, -12.3],
        [-12.345, 0, -12],
        [0.012345, 7, 0.012345], // technically 0.0123450, but doubles do not retain trailing decimal zeros
        [0.012345, 6, 0.012345],
        [0.012345, 4, 0.0123],
        [0.012345, 3, 0.012],
        [0.012345, 2, 0.01],
        [0.012345, 1, 0], // technically 0.0, but doubles do not retain trailing decimal zeros
        [0.012345, 0, 0],
        [-0.012345, 7, -0.012345], // technically 0.0123450, but doubles do not retain trailing decimal zeros
        [-0.012345, 6, -0.012345],
        [-0.012345, 4, -0.0123],
        [-0.012345, 3, -0.012],
        [-0.012345, 2, -0.01],
        [-0.012345, 1, 0], // technically 0.0, but doubles do not retain trailing decimal zeros
        [-0.012345, 0, 0],
        // TODO: Check scientific notation
        // TODO: Fix. This is completely broken.
      ])('given %p rounded to %p decimal places, should return %p',
        (value, digits, expected) => {
          const result = Numbers.RoundToDecimalPlaces(value, digits);

          expect(result).toBeCloseTo(expected, 6);
        });

      it.each([
        [12.345, 2, 12.35], // 12.34 (even) or 12.35 (zero)
        [12.355, 2, 12.36], // Both methods
        [-12.345, 2, -12.35], // -12.34 (even) or -12.35 (zero)
        [-12.355, 2, -12.36], // Both methods
        [0.012345, 5, 0.01235], // 0.01234 (even) or 0.01235 (zero)
        [0.012355, 5, 0.01236], // Both methods
        [-0.012345, 5, -0.01235], // -0.01234 (even) or -0.01235 (zero)
        [-0.012355, 5, -0.01236], // Both methods
        // TODO: Check scientific notation
        // TODO: Fix. This is completely broken.
      ])('given %p rounded to %p decimal places, should return %p by the tiebreaker default',
        (value, digits, expected) => {
          const result = Numbers.RoundToDecimalPlaces(value, digits);

          expect(result).toBeCloseTo(expected, 5);
        });

      // This was available in C# but not ported. May be worth adding later?
      // it.each([
      //   [12.345, 2, 12.35], // 12.34 (even) or 12.35 (zero)
      //   [12.355, 2, 12.36], // Both methods
      //   [-12.345, 2, -12.35], // -12.34 (even) or -12.35 (zero)
      //   [-12.355, 2, -12.36], // Both methods
      //   [0.012345, 5, 0.01235], // 0.01234 (even) or 0.01235 (zero)
      //   [0.012355, 5, 0.01236], // Both methods
      //   [-0.012345, 5, -0.01235], // -0.01234 (even) or -0.01235 (zero)
      //   [-0.012355, 5, -0.01236], // Both methods
      // ])('given %p should return %p for the default tolerance',
      //   (value, expected) => {

      //   });

      //   public static void RoundToDecimalPlaces_TieBreaker_AwayFromZero(double value, int digits, double expectedResult) {
      //   Assert.AreEqual(expectedResult, Numbers.RoundToDecimalPlaces(value, digits, RoundingTieBreaker.HalfAwayFromZero), 0.000001);
      // }


      // This only matters if the above feature is added.
      // it.each([
      //   [12.345, 2, 12.34], // 12.34 (even) or 12.35 (zero)
      //   [12.355, 2, 12.36], // Both methods
      //   [-12.345, 2, -12.34], // -12.34 (even) or -12.35 (zero)
      //   [-12.355, 2, -12.36], // Both methods
      //   [0.012345, 5, 0.01234], // 0.01234 (even) or 0.01235 (zero)
      //   [0.012355, 5, 0.01236], // Both methods
      //   [-0.012345, 5, -0.01234], // -0.01234 (even) or -0.01235 (zero)
      //   [-0.012355, 5, -0.01236], // Both methods
      // ])('given %p should return %p for the default tolerance',
      //   (value, expected) => {

      //   });

      //   public static void RoundToDecimalPlaces_TieBreaker_HalfToEven(double value, int digits, double expectedResult) {
      //   Assert.AreEqual(expectedResult, Numbers.RoundToDecimalPlaces(value, digits, RoundingTieBreaker.HalfToEven), 0.000001);
      // }
    });

    // Not added... yet? Currently commented out.
    // describe('#Display', () => {
    //   describe('#DisplayRoundedToSignificantFigures', () => {
    //     it.each([
    //       [0, 0, "0"],
    //       [0, 1, "0.0"],
    //       [5, 0, "0"],
    //       [-549, 1, "-500"],
    //       [-551, 1, "-600"],
    //       [12.345, 7, "12.34500"],
    //       [12.345, 6, "12.3450"],
    //       [12.345, 5, "12.345"],
    //       [12.345, 3, "12.3"],
    //       [12.345, 2, "12"],
    //       [12.345, 1, "10"],
    //       [12.345, 0, "0"],
    //       [-12.345, 7, "-12.34500"],
    //       [-12.345, 6, "-12.3450"],
    //       [-12.345, 5, "-12.345"],
    //       [-12.345, 3, "-12.3"],
    //       [-12.345, 2, "-12"],
    //       [-12.345, 1, "-10"],
    //       [-12.345, 0, "0"],
    //       [0.012345, 7, "0.01234500"],
    //       [0.012345, 6, "0.0123450"],
    //       [0.012345, 5, "0.012345"],
    //       [0.012345, 3, "0.0123"],
    //       [0.012345, 2, "0.012"],
    //       [0.012345, 1, "0.01"],
    //       [0.012345, 0, "0"],
    //       [-0.012345, 7, "-0.01234500"],
    //       [-0.012345, 6, "-0.0123450"],
    //       [-0.012345, 5, "-0.012345"],
    //       [-0.012345, 3, "-0.0123"],
    //       [-0.012345, 2, "-0.012"],
    //       [-0.012345, 1, "-0.01"],
    //       [-0.012345, 0, "0"]
    //     ])('given %p should return %p for the default tolerance',
    //       (value, digits, expected) => {
    //         const result = Numbers.DisplayRoundedToSignificantFigures(value, digits);

    //         expect(result).toEqual(expected);
    //       });
    //   });


    //   describe('#DisplayRoundedToDecimalPlaces', () => {
    //     it.each([
    //       [12.345, 6, "12.345000"],
    //       [12.345, 5, "12.34500"],
    //       [12.345, 4, "12.3450"],
    //       [12.345, 3, "12.345"],
    //       [12.345, 1, "12.3"],
    //       [12.345, 0, "12"],
    //       [-12.345, 6, "-12.345000"],
    //       [-12.345, 5, "-12.34500"],
    //       [-12.345, 4, "-12.3450"],
    //       [-12.345, 3, "-12.345"],
    //       [-12.345, 1, "-12.3"],
    //       [-12.345, 0, "-12"],
    //       [0.012345, 7, "0.0123450"],
    //       [0.012345, 6, "0.012345"],
    //       [0.012345, 4, "0.0123"],
    //       [0.012345, 3, "0.012"],
    //       [0.012345, 2, "0.01"],
    //       [0.012345, 1, "0.0"],
    //       [0.012345, 0, "0"],
    //       [-0.012345, 7, "-0.0123450"],
    //       [-0.012345, 6, "-0.012345"],
    //       [-0.012345, 4, "-0.0123"],
    //       [-0.012345, 3, "-0.012"],
    //       [-0.012345, 2, "-0.01"],
    //       [-0.012345, 1, "0.0"],
    //       [-0.012345, 0, "0"],
    //     ])('given %p should return %p for the default tolerance',
    //       (value, digits, expected) => {
    //         const result = Numbers.DisplayRoundedToDecimalPlaces(value, digits);

    //         expect(result).toEqual(expected);
    //       });
    //   });
  });
});