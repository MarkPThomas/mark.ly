import { CartesianCoordinate, CartesianOffset, Numbers } from './your-cartesian-math-library'; // Import your Cartesian math library here

describe('CartesianOffset', () => {
  let Tolerance: number;

  beforeAll(() => {
    Tolerance = 0.00001;
  });

  describe('Initialization', () => {
    it('should initialize with default tolerance', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const offset = new CartesianOffset(coordinate1, coordinate2);

      expect(offset.I.X).toBe(coordinate1.X);
      expect(offset.I.Y).toBe(coordinate1.Y);
      expect(offset.J.X).toBe(coordinate2.X);
      expect(offset.J.Y).toBe(coordinate2.Y);
      expect(offset.Tolerance).toBe(Numbers.ZeroTolerance);
    });

    it('should initialize with specified coordinates and tolerance', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const tolerance = 0.5;
      const offset = new CartesianOffset(coordinate1, coordinate2, tolerance);

      expect(offset.I.X).toBe(coordinate1.X);
      expect(offset.I.Y).toBe(coordinate1.Y);
      expect(offset.J.X).toBe(coordinate2.X);
      expect(offset.J.Y).toBe(coordinate2.Y);
      expect(offset.Tolerance).toBe(tolerance);
    });

    it('should initialize with specified offsets and tolerance', () => {
      const tolerance = 0.5;
      const offset = new CartesianOffset(2, 3, tolerance);

      expect(offset.I.X).toBe(0);
      expect(offset.I.Y).toBe(0);
      expect(offset.J.X).toBe(2);
      expect(offset.J.Y).toBe(3);
      expect(offset.Tolerance).toBe(tolerance);
    });
  });

  describe('Methods: Public', () => {
    describe('ToString', () => {
      it('should return overridden value', () => {
        const offset = new CartesianOffset(new CartesianCoordinate(0.1, 2), new CartesianCoordinate(0.5, 3));

        expect(offset.toString()).toBe('MPT.Math.Coordinates.CartesianOffset - I: (0.1, 2), J: (0.5, 3)');
      });
    });

    describe('ToCartesianCoordinate', () => {
      it.each([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 2, 1, 2],
        [1.1, 2.3, 3.3, 4.4, 2.2, 2.1],
        [1.1, -2.3, -3.3, -4.4, -4.4, -2.1],
        [-1.1, -2.3, -3.3, 4.4, -2.2, 6.7],
        [-1.1, -2.3, 3.3, -4.4, 4.4, -2.1],
      ])('should return Cartesian coordinate offset from origin', (
        xI, yI, xJ, yJ, xNew, yNew
      ) => {
        const offset = new CartesianOffset(
          new CartesianCoordinate(xI, yI),
          new CartesianCoordinate(xJ, yJ)
        );

        const newCoordinate = offset.toCartesianCoordinate();

        expect(newCoordinate.X).toBeCloseTo(xNew, Tolerance);
        expect(newCoordinate.Y).toBeCloseTo(yNew, Tolerance);
      });
    });

    describe('X', () => {
      it.each([
        [0, 0, 0],
        [1, 0, -1],
        [0, 1, 1],
        [1, 2.2, 1.2],
        [-1.1, 2.2, 3.3],
        [-1.1, -2.2, -1.1],
        [1.1, -2.2, -3.3],
      ])('should return X coordinates difference', (xI, xJ, xDifference) => {
        const offset = new CartesianOffset(
          new CartesianCoordinate(xI, 0),
          new CartesianCoordinate(xJ, 0)
        );

        expect(offset.x()).toBeCloseTo(xDifference, Tolerance);
      });
    });

    describe('Y', () => {
      it.each([
        [0, 0, 0],
        [1, 0, -1],
        [0, 1, 1],
        [1, 2.2, 1.2],
        [-1.1, 2.2, 3.3],
        [-1.1, -2.2, -1.1],
        [1.1, -2.2, -3.3],
      ])('should return Y coordinates difference', (yI, yJ, yDifference) => {
        const offset = new CartesianOffset(
          new CartesianCoordinate(0, yI),
          new CartesianCoordinate(0, yJ)
        );

        expect(offset.y()).toBeCloseTo(yDifference, Tolerance);
      });
    });

    describe('Length', () => {
      it.each([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1],
        [0, 0, 1, 0, 1],
        [1.1, 2.3, 3.3, 4.4, 3.041381],
        [1.1, -2.3, -3.3, -4.4, 4.875449],
        [-1.1, -2.3, -3.3, 4.4, 7.05195],
        [-1.1, -2.3, 3.3, -4.4, 4.875449],
      ])('should return linear distance between offset points', (
        xI, yI, xJ, yJ, distance
      ) => {
        const offset = new CartesianOffset(
          new CartesianCoordinate(xI, yI),
          new CartesianCoordinate(xJ, yJ)
        );

        expect(offset.length()).toBeCloseTo(distance, Tolerance);
      });
    });

    describe('SlopeAngle', () => {
      describe.each([
        [0, 0, 1, 1, 45],
        [0, 0, -1, 1, 135],
        [0, 0, -1, -1, -135],
        [0, 0, 1, -1, -45],
      ])('SlopeAngle: (%d, %d) to (%d, %d) should return %d degrees',
        (xI, yI, xJ, yJ, angleDegreesExpected) => {
          it('should calculate the angle of slope between offset points', () => {
            const offset = new CartesianOffset(new CartesianCoordinate(xI, yI), new CartesianCoordinate(xJ, yJ));
            const slope = offset.SlopeAngle();
            expect(slope.Degrees).toBe(angleDegreesExpected);
          });
        }
      );
    });
  });

  describe('Conversion methods', () => {
    it('should convert Cartesian Offset to Polar Offset', () => {
      const cartesian = new CartesianOffset(1, 1.73205081, Tolerance);
      const polar = cartesian.ToPolar();
      const polarExpected = new PolarOffset(
        new PolarCoordinate(0, 0),
        new PolarCoordinate(2, Angle.CreateFromDegree(60)),
        Tolerance
      );

      expect(polar).toEqual(polarExpected);
    });
  });

  describe('Operators: Equals & IEquatable', () => {
    it('should return true for objects with identical coordinates', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const offset1 = new CartesianOffset(coordinate1, coordinate2);
      const offset2 = new CartesianOffset(coordinate1, coordinate2);

      expect(offset1.equals(offset2)).toBe(true);
      expect(offset1.equals(offset2 as unknown)).toBe(true);
      expect(offset1.equals(offset2)).toBe(true); // Testing the equality operator
    });

    it('should return false for objects with differing max-min coordinates', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const coordinate3 = new CartesianCoordinate(3, 4);
      const offset1 = new CartesianOffset(coordinate1, coordinate2);
      const offsetDiffI = new CartesianOffset(coordinate3, coordinate2);

      expect(offset1.equals(offsetDiffI)).toBe(false);

      const coordinate4 = new CartesianCoordinate(3, 5);
      const offsetDiffJ = new CartesianOffset(coordinate1, coordinate4);
      expect(offset1.equals(offsetDiffJ)).toBe(false);

      const offsetDiffT = new CartesianOffset(coordinate1, coordinate2, 0.001);
      expect(offset1.equals(offsetDiffT)).toBe(true);

      const obj = {};
      expect(offset1.equals(obj)).toBe(false);
    });

    it('should return true for inequality when objects have differing max-min coordinates', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const coordinate3 = new CartesianCoordinate(3, 4);
      const offset1 = new CartesianOffset(coordinate1, coordinate2);
      const offsetDiffI = new CartesianOffset(coordinate3, coordinate2);

      expect(offset1.notEquals(offsetDiffI)).toBe(true);
    });

    it('should have matching hash codes for objects with identical coordinates', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const tolerance = 0.0002;
      const offset1 = new CartesianOffset(coordinate1, coordinate2, tolerance);
      const offset2 = new CartesianOffset(coordinate1, coordinate2, tolerance);

      expect(offset1.getHashCode()).toBe(offset2.getHashCode());
    });

    it('should have differing hash codes for objects with differing max-min coordinates', () => {
      const coordinate1 = new CartesianCoordinate(1, 2);
      const coordinate2 = new CartesianCoordinate(3, 4);
      const tolerance = 0.0002;
      const offset1 = new CartesianOffset(coordinate1, coordinate2, tolerance);

      let offset2 = new CartesianOffset(coordinate1.multiply(2), coordinate2, tolerance);
      expect(offset1.getHashCode()).not.toBe(offset2.getHashCode());

      offset2 = new CartesianOffset(coordinate1, coordinate2.multiply(2), tolerance);
      expect(offset1.getHashCode()).not.toBe(offset2.getHashCode());

      offset2 = new CartesianOffset(coordinate1, coordinate2, tolerance * 2);
      expect(offset1.getHashCode()).toBe(offset2.getHashCode());
    });
  });

  describe('Operators: Combining', () => {
    it.each([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 4, 3, 4, 5, 6, 7, 8, 0, 0, -1, -2],
      [-2, 4, -3, 4, -5, 6, -7, 8, 0, 0, 1, -2],
      [-2, -4, -3, -4, -5, -6, -7, -8, 0, 0, 1, 2],
      [2, -4, 3, -4, 5, -6, 7, -8, 0, 0, -1, 2],
      [2, 4, 3, 4, -5, -6, -7, -8, 0, 0, 3, 2],
      [1, 4, 3, 4, -5, 6, -7, 8, 0, 0, 4, -2],
      [2, 4, 3, 4, 5, -6, 7, -8, 0, 0, -1, 2],
      [1, 4, 3, 4, 5, 6, 5, 8, 0, 0, 2, -2],
      [1, 4, 3, 4, 5, 6, 4, 8, 0, 0, 3, -2],
      [1.1, 2.3, 2.6, 4.7, 5.9, 6.6, 7.7, 8.8, 0, 0, -0.3, 0.2],
    ])('SubtractOverride should return the expected result', (
      Xi1, Yi1, Xj1, Yj1, Xi2, Yi2, Xj2, Yj2,
      XiResult, YiResult, XjResult, YjResult
    ) => {
      const offset1 = new CartesianOffset(
        new CartesianCoordinate(Xi1, Yi1),
        new CartesianCoordinate(Xj1, Yj1)
      );

      const offset2 = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offset = offset1.subtract(offset2);

      expect(offset.I.X).toBeCloseTo(XiResult, 6);
      expect(offset.I.Y).toBeCloseTo(YiResult, 6);
      expect(offset.J.X).toBeCloseTo(XjResult, 6);
      expect(offset.J.Y).toBeCloseTo(YjResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0],
      [1, 4, 5, 6, 7, 8, -1, 2],
      [-1, 4, -5, 6, -7, 8, 1, 2],
      [-1, -4, -5, -6, -7, -8, 1, -2],
      [1, -4, 5, -6, 7, -8, -1, -2],
      [1, 4, -5, -6, -7, -8, 3, 6],
      [1, 4, -5, 6, -7, 8, 3, 2],
      [1, 4, 5, -6, 7, -8, 1, 6],
      [1, 4, 5, 6, 5, 8, 1, 2],
      [1, 4, 5, 6, 4, 8, 2, 2],
      [3.2, 4.4, 5.5, 6.6, 4.4, 8.8, 2.1, 6.6],
    ])('SubtractOverride subtracted by Coordinate should return the expected result', (
      x, y, Xi2, Yi2, Xj2, Yj2, XResult, YResult
    ) => {
      const coordinate = new CartesianCoordinate(x, y);

      const offset = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offsetCoordinate = coordinate.subtract(offset);

      expect(offsetCoordinate.X).toBeCloseTo(XResult, 6);
      expect(offsetCoordinate.Y).toBeCloseTo(YResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0, 0],
      [1, 4, 5, 6, 7, 8, 1, -2],
      [-1, 4, -5, 6, -7, 8, -1, -2],
      [-1, -4, -5, -6, -7, -8, -1, 2],
      [1, -4, 5, -6, 7, -8, 1, 2],
      [1, 4, -5, -6, -7, -8, -3, -6],
      [1, 4, -5, 6, -7, 8, -3, -2],
      [1, 4, 5, -6, 7, -8, 1, -6],
      [1, 4, 5, 6, 5, 8, -1, -2],
      [1, 4, 5, 6, 4, 8, -2, -2],
      [3.2, 4.4, 5.5, 6.6, 4.4, 8.8, -2.2, -2.9],
    ])('Subtracting Coordinate from Offset should return the expected result', (
      x, y, Xi2, Yi2, Xj2, Yj2, XResult, YResult
    ) => {
      const coordinate = new CartesianCoordinate(x, y);

      const offset = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offsetCoordinate = offset.subtract(coordinate);

      expect(offsetCoordinate.X).toBeCloseTo(XResult, 6);
      expect(offsetCoordinate.Y).toBeCloseTo(YResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 4, 4],
      [-1, 2, -3, 4, -5, 6, -7, 8, 0, 0, -4, 4],
      [-1, -2, -3, -4, -5, -6, -7, -8, 0, 0, -4, -4],
      [1, -2, 3, -4, 5, -6, 7, -8, 0, 0, 4, -4],
      [2, 4, 3, 4, -5, -6, -7, -8, 0, 0, -1, -2],
      [2, 2, 3, 4, -5, 6, -7, 8, 0, 0, -1, 4],
      [2, 4, 3, 4, 5, -6, 7, -8, 0, 0, 3, -2],
      [1, 2, 3, 4, 5, 6, 5, 8, 0, 0, 2, 4],
      [1, 2, 3, 4, 5, 6, 4, 8, 0, 0, 1, 4],
      [1.1, 2.3, 2.6, 4.7, 5.9, 6.6, 7.7, 8.8, 0, 0, 4.4, 4.4],
    ])('AddOverride should return the expected result', (
      Xi1, Yi1, Xj1, Yj1, Xi2, Yi2, Xj2, Yj2,
      XiResult, YiResult, XjResult, YjResult
    ) => {
      const offset1 = new CartesianOffset(
        new CartesianCoordinate(Xi1, Yi1),
        new CartesianCoordinate(Xj1, Yj1)
      );

      const offset2 = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offset = offset1.add(offset2);

      expect(offset.I.X).toBeCloseTo(XiResult, 6);
      expect(offset.I.Y).toBeCloseTo(YiResult, 6);
      expect(offset.J.X).toBeCloseTo(XjResult, 6);
      expect(offset.J.Y).toBeCloseTo(YjResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0],
      [1, 4, 5, 6, 7, 8, 3, 6],
      [-1, 4, -5, 6, -7, 8, -3, 6],
      [-1, -4, -5, -6, -7, -8, -3, -6],
      [1, -4, 5, -6, 7, -8, 3, -6],
      [1, 4, -5, -6, -7, -8, -1, 2],
      [1, 4, -5, 6, -7, 8, -1, 6],
      [1, 4, 5, -6, 7, -8, 3, 2],
      [1, 4, 5, 6, 5, 8, 1, 6],
      [1, 4, 5, 6, 4, 8, 0, 6],
      [3.2, 4.4, 5.5, 6.6, 4.4, 8.8, 2.1, 6.6],
    ])('Adding Coordinate to Offset should return the expected result', (
      x, y, Xi2, Yi2, Xj2, Yj2, XResult, YResult
    ) => {
      const coordinate = new CartesianCoordinate(x, y);

      const offset = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offsetCoordinate = coordinate.add(offset);

      expect(offsetCoordinate.X).toBeCloseTo(XResult, 6);
      expect(offsetCoordinate.Y).toBeCloseTo(YResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0, 0],
      [1, 4, 5, 6, 7, 8, 3, 6],
      [-1, 4, -5, 6, -7, 8, -3, 6],
      [-1, -4, -5, -6, -7, -8, -3, -6],
      [1, -4, 5, -6, 7, -8, 3, -6],
      [1, 4, -5, -6, -7, -8, -1, 2],
      [1, 4, -5, 6, -7, 8, -1, 6],
      [1, 4, 5, -6, 7, -8, 3, 2],
      [1, 4, 5, 6, 5, 8, 1, 6],
      [1, 4, 5, 6, 4, 8, 0, 6],
      [3.2, 4.4, 5.5, 6.6, 4.4, 8.8, 2.1, 6.6],
    ])('Adding Offset to Coordinate should return the expected result', (
      x, y, Xi2, Yi2, Xj2, Yj2, XResult, YResult
    ) => {
      const coordinate = new CartesianCoordinate(x, y);

      const offset = new CartesianOffset(
        new CartesianCoordinate(Xi2, Yi2),
        new CartesianCoordinate(Xj2, Yj2)
      );

      const offsetCoordinate = offset.add(coordinate);

      expect(offsetCoordinate.X).toBeCloseTo(XResult, 6);
      expect(offsetCoordinate.Y).toBeCloseTo(YResult, 6);
    });

    it.each([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 4, 4],
      [-1, 2, -3, 4, -5, 6, -7, 8, 0, 0, -4, 4],
      [-1, -2, -3, -4, -5, -6, -7, -8, 0, 0, -4, -4],
      [1, -2, 3, -4, 5, -6, 7, -8, 0, 0, 4, -4],
      [2, 4, 3, 4, -5, -6, -7, -8, 0, 0, -1, -2],
      [2, 2, 3, 4, -5, 6, -7, 8, 0, 0, -1, 4],
      [2, 4, 3, 4, 5, -6, 7, -8, 0, 0, 3, -2],
      [1, 2, 3, 4, 5, 6, 5, 8, 0, 0, 2, 4],
      [1, 2, 3, 4, 5, 6, 4, 8, 0, 0, 1, 4],
      [1.1, 2.3, 2.6, 4.7, 5.9, 6.6, 7.7, 8.8, 0, 0, 4.4, 4.4],
    ])('MultiplyOverride should return the expected result', (
      a1, a2, factor, scaledIX, scaledIY, scaledJX, scaledJY
    ) => {
      const coordinate1 = new CartesianCoordinate(a1, a2);
      const coordinate2 = new CartesianCoordinate(a2, a1);
      const offset = new CartesianOffset(coordinate1, coordinate2);

      const offsetNew = offset.multiply(factor);

      expect(offsetNew.I.X).toBeCloseTo(scaledIX, 6);
      expect(offsetNew.I.Y).toBeCloseTo(scaledIY, 6);
      expect(offsetNew.J.X).toBeCloseTo(scaledJX, 6);
      expect(offsetNew.J.Y).toBeCloseTo(scaledJY, 6);
    });

    it.each([
      [0, 0, 2, 0, 0, 0, 0],
      [2, 3, 1, 2, 3, 3, 2],
      [2, 3, -1, -2, -3, -3, -2],
      [2, 3, 3.2, 0.625, 0.9375, 0.9375, 0.625],
      [2, 3, -1.2, -1.666667, -2.5, -2.5, -1.666667],
      [2.2, 3.1, 5.4, 0.407407, 0.574074, 0.574074, 0.407407],
    ])('DivideOverride should return the expected result', (
      a1, a2, factor, scaledIX, scaledIY, scaledJX, scaledJY
    ) => {
      const coordinate1 = new CartesianCoordinate(a1, a2);
      const coordinate2 = new CartesianCoordinate(a2, a1);
      const offset = new CartesianOffset(coordinate1, coordinate2);

      const offsetNew = offset.divide(factor);

      expect(offsetNew.I.X).toBeCloseTo(scaledIX, 6);
      expect(offsetNew.I.Y).toBeCloseTo(scaledIY, 6);
      expect(offsetNew.J.X).toBeCloseTo(scaledJX, 6);
      expect(offsetNew.J.Y).toBeCloseTo(scaledJY, 6);
    });

    it('DivideOverride should throw an exception when dividing by zero', () => {
      const offset = new CartesianOffset(
        new CartesianCoordinate(1, 2),
        new CartesianCoordinate(-2, 3)
      );

      expect(() => {
        offset.divide(0);
      }).toThrowError(DivideByZeroException);
    });
  });
});