import { AlgebraLibrary } from './AlgebraLibrary';
import { CartesianCoordinate } from '../Coordinates/CartesianCoordinate';

describe("AlgebraTests", () => {
  const Tolerance = 0.00001;

  describe('Solutions to Formulas', () => {
    describe("QuadraticFormula", () => {
      test.each([
        [1, 6, 3, -5.44949, -0.55051],
        [1, -6, 3, 0.55051, 5.44949],
        [1, 0, 0, 0, 0],
      ])("with a = %f, b = %f, c = %f", (a, b, c, expectedPositive, expectedNegative) => {
        const results = AlgebraLibrary.QuadraticFormula(a, b, c);
        expect(results[0]).toBeCloseTo(expectedNegative, Tolerance);
        expect(results[1]).toBeCloseTo(expectedPositive, Tolerance);
      });

      test.each([
        [0, 0, 0],
        [0, 6, 1],
      ])("Throws Exception when a is 0 with a = %f, b = %f, c = %f", (a, b, c) => {
        expect(() => AlgebraLibrary.QuadraticFormula(a, b, c)).toThrow();
      });

      test("Throws Exception when SQRT of Negative Value", () => {
        expect(() => AlgebraLibrary.QuadraticFormula(1, 1, 1)).toThrow();
      });
    });

    describe("CubicCurveLowestRoot", () => {
      test.each([
        [0.7225, -1.7, 284.772087, -5274.720807, 13.440692],
        [0.7225, 1.7, 284.772087, 5274.720807, -13.440692],
        [0.636733, -378.604263, 59057.623334, -1627072.644858, 34.90111],
      ])("with a = %f, b = %f, c = %f, d = %f", (a, b, c, d, expectedResult) => {
        const result = AlgebraLibrary.CubicCurveLowestRoot(a, b, c, d);
        expect(result).toBeCloseTo(expectedResult, 0.001);
      });
    });
  });

  describe("Interpolations", () => {
    describe('#InterpolationLinear', () => {
      test.each([
        [1, 11, 0, 1],
        [1, 11, 1, 11],
        [1, 11, 0.5, 6],
        [1.1, 11.1, 0.5, 6.1],
      ])(
        "Interpolates between two values: (%f, %f) with weight %f, expecting %f",
        (value1, value2, point2Weight, expectedResult) => {
          const interpolatedValue = AlgebraLibrary.InterpolationLinear(
            value1,
            value2,
            point2Weight
          );
          expect(interpolatedValue).toBeCloseTo(expectedResult, Tolerance);
        }
      );

      test.each([
        [1, 11, 2],
        [1, 11, -2],
      ])(
        "Throws exception for weight %f when interpolating between values %f and %f",
        (point2Weight, value1, value2) => {
          expect(() =>
            AlgebraLibrary.InterpolationLinear(value1, value2, point2Weight)
          ).toThrow();
        }
      );

      test.each([
        [1, -2, 11, 6, 0, 1, -2],
        [1, -2, 11, 6, 1, 11, 6],
        [1, -2, 11, 6, 0.5, 6, 2],
        [1.1, -2.2, 11.1, 6.6, 0.5, 6.1, 2.2],
      ])(
        "Interpolates between two coordinates: (%f, %f) and (%f, %f) with weight %f, expecting X: %f, Y: %f",
        (x1, y1, x2, y2, point2Weight, expectedX, expectedY) => {
          const coordinate1 = new CartesianCoordinate(x1, y1);
          const coordinate2 = new CartesianCoordinate(x2, y2);

          const interpolatedCoordinate = AlgebraLibrary.InterpolationLinear(
            coordinate1,
            coordinate2,
            point2Weight
          ) as CartesianCoordinate;

          expect(interpolatedCoordinate.X).toBeCloseTo(expectedX, Tolerance);
          expect(interpolatedCoordinate.Y).toBeCloseTo(expectedY, Tolerance);
        }
      );
    });

    test.each([
      [2.2, 3.3, 1.1, 2.2, 4.4, 6.6, 1.5, 1.5, 1.5, 1.5, 1.5], // All corners have same value
      [1.1, 2.2, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 1], // Pt ii
      [4.4, 6.6, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 4], // Pt jj
      [1.1, 6.6, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 3], // Pt ij
      [4.4, 2.2, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 2], // Pt ji
      [2.75, 2.2, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 1.5], // Top Edge
      [2.75, 6.6, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 3.5], // Bottom Edge
      [1.1, 4.4, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 2], // Left Edge
      [4.4, 4.4, 1.1, 2.2, 4.4, 6.6, 1, 2, 3, 4, 3], // Right Edge
      [2.75, 4.4, 1.1, 2.2, 4.4, 6.6, 1.5, 1.5, 2.5, 2.5, 2], // Center of plane sloped along rows
      [2.75, 4.4, 1.1, 2.2, 4.4, 6.6, 1.5, 3.5, 1.5, 3.5, 2.5], // Center of plane sloped along columns
      [2.2, 3.3, 1.1, 2.2, 4.4, 6.6, 1.1, 2.2, 3.3, 4.4, 2.016667], // All corners have different value, point not centered
    ])(
      "Interpolates value at (%f, %f) within plane defined by corner coordinates",
      (
        col0,
        row0,
        iiCol,
        iiRow,
        jjCol,
        jjRow,
        iiValue,
        ijValue,
        jiValue,
        jjValue,
        expectedValue
      ) => {
        const pO = new CartesianCoordinate(col0, row0);
        const ii = new CartesianCoordinate(iiCol, iiRow);
        const jj = new CartesianCoordinate(jjCol, jjRow);

        const value = AlgebraLibrary.InterpolationLinear2D(
          pO,
          ii,
          jj,
          iiValue,
          ijValue,
          jiValue,
          jjValue
        );

        expect(value).toBeCloseTo(expectedValue, Tolerance);
      }
    );

    test("Throws ArgumentException when width is 0", () => {
      const pO = new CartesianCoordinate(2.2, 3.3);
      const ii = new CartesianCoordinate(1.1, 2.2);
      const jj = new CartesianCoordinate(1.1, 6.6);

      expect(() =>
        AlgebraLibrary.InterpolationLinear2D(pO, ii, jj, 1, 1, 1, 1)
      ).toThrowError("ArgumentException");
    });

    test("Throws ArgumentException when height is 0", () => {
      const pO = new CartesianCoordinate(2.2, 3.3);
      const ii = new CartesianCoordinate(1.1, 2.2);
      const jj = new CartesianCoordinate(4.4, 2.2);

      expect(() =>
        AlgebraLibrary.InterpolationLinear2D(pO, ii, jj, 1, 1, 1, 1)
      ).toThrowError("ArgumentException");
    });

    test("Throws ArgumentOutOfRangeException when coordinates are out of bounds", () => {
      const pO = new CartesianCoordinate(1, 2);
      const ii = new CartesianCoordinate(1.1, 2.2);
      const jj = new CartesianCoordinate(4.4, 6.6);

      expect(() =>
        AlgebraLibrary.InterpolationLinear2D(pO, ii, jj, 1, 1, 1, 1)
      ).toThrowError("ArgumentOutOfRangeException");
    });
  });

  describe('Intersections', () => {
    test.each([
      [3, 2, 3, 2, 10, 2], // Vertical line
      [4, 2, 3, 5, 6, 3], // Within points
      [7, 2, 3, 5, 6, 6], // Outside of points
      [-1, 2, 3, -2, -3, -0.666667], // Negative slope
    ])(
      "Calculates X coordinate intersection for y = %f",
      (y, x1, y1, x2, y2, expectedX) => {
        const result = AlgebraLibrary.IntersectionX(y, x1, y1, x2, y2);
        expect(result).toBeCloseTo(expectedX);
      }
    );

    test("Throws exception for line as point", () => {
      expect(() => {
        AlgebraLibrary.IntersectionX(3, 2, 3, 2, 3);
      }).toThrowError("Line cannot be represented as a point");
    });

    test("Throws exception for collinear line", () => {
      expect(() => {
        AlgebraLibrary.IntersectionX(2, 2, 3, 6, 3);
      }).toThrowError("Lines are collinear and do not intersect");
    });

    test("Throws exception for parallel line", () => {
      expect(() => {
        AlgebraLibrary.IntersectionX(3, 2, 3, 6, 3);
      }).toThrowError("Lines are parallel and do not intersect");
    });

    test.each([
      [3, 2, 3, 2, 10, 2], // Vertical line
      [4, 2, 3, 5, 6, 3], // Within points
      [7, 2, 3, 5, 6, 6], // Outside of points
      [-1, 2, 3, -2, -3, -0.666667], // Negative slope
    ])(
      "Calculates X coordinate intersection of line formed for y = %f",
      (y, x1, y1, x2, y2, expectedX) => {
        const result = AlgebraLibrary.IntersectionXCoordinates(
          y,
          new CartesianCoordinate(x1, y1),
          new CartesianCoordinate(x2, y2)
        );
        expect(result).toBeCloseTo(expectedX);
      }
    );

    test("Throws exception for line as point of line formed", () => {
      expect(() => {
        AlgebraLibrary.IntersectionXCoordinates(
          3,
          new CartesianCoordinate(2, 3),
          new CartesianCoordinate(2, 3)
        );
      }).toThrowError("Line cannot be represented as a point");
    });

    test("Throws exception for collinear line of line formed", () => {
      expect(() => {
        AlgebraLibrary.IntersectionXCoordinates(
          2,
          new CartesianCoordinate(2, 3),
          new CartesianCoordinate(6, 3)
        );
      }).toThrowError("Lines are collinear and do not intersect");
    });

    test("Throws exception for parallel line of line formed", () => {
      expect(() => {
        AlgebraLibrary.IntersectionXCoordinates(
          3,
          new CartesianCoordinate(2, 3),
          new CartesianCoordinate(6, 3)
        );
      }).toThrowError("Lines are parallel and do not intersect");
    });
  });

  describe('Calcs', () => {
    test.each([
      [0, 0, 0], // All values are zero
      [0, 0, 1], // One value is non-zero
      [1, 1, 1], // All values are non-zero
      [3, 5.5, 12], // Positive values
      [3, -5.5, 12], // Negative values
    ])(
      "Calculates SRSS value for (%f, %f, %f)",
      (value1, value2, value3) => {
        const expectedResult = Math.sqrt(
          value1 * value1 + value2 * value2 + value3 * value3
        );
        expect(AlgebraLibrary.SRSS(value1, value2, value3)).toBeCloseTo(
          expectedResult
        );
      }
    );
  });
});
