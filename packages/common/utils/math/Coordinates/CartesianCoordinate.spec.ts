import { LinearCurve } from '../Curves/LinearCurve';
import { Numbers } from '../Numbers';
import { Angle } from './Angle';
import { CartesianCoordinate } from './CartesianCoordinate';
import { CartesianOffset } from './CartesianOffset';
import { ICoordinate } from './ICoordinate';

describe('#CartesianCoordinate', () => {
  let Tolerance: number = 0.00001;

  class TestCoordinate implements ICoordinate {
    Tolerance: number;

    constructor() {
      this.Tolerance = Tolerance;
    }

    equals(item: ICoordinate): boolean {
      throw new Error('Method not implemented.');
    }
  }

  describe('Initialization', () => {
    it('should initialize with default tolerance', () => {
      const x = 5.3;
      const y = -2;
      const coordinate = new CartesianCoordinate(x, y);

      expect(coordinate.X).toBe(x);
      expect(coordinate.Y).toBe(y);
      expect(coordinate.Tolerance).toBe(0.00001); // You might want to use a variable or constant for this value
    });

    it('should initialize with specified tolerance', () => {
      const x = 5.3;
      const y = -2;
      const tolerance = 0.0002;
      const coordinate = new CartesianCoordinate(x, y, tolerance);

      expect(coordinate.X).toBe(x);
      expect(coordinate.Y).toBe(y);
      expect(coordinate.Tolerance).toBe(tolerance);
    });
  });

  describe('Methods', () => {
    describe('##ToString', () => {
      it('should return overridden string value', () => {
        const coordinate = new CartesianCoordinate(1, 2);

        expect(coordinate.toString()).toBe('CartesianCoordinate - X: 1, Y: 2');
      });
    });

    describe('##DotProduct', () => {
      it.each([
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 2],
        [1, 2, 3, 4, 11],
        [-1, -2, -3, -4, 11],
        [1, -2, 3, 4, -5],
      ])(`should calculate dot product of the 2 coordinates
          (%d, %d) DOT (%d, %d) = %d`,
        (x1, y1, x2, y2, expectedResult) => {
          const coordinate1 = new CartesianCoordinate(x1, y1);
          const coordinate2 = new CartesianCoordinate(x2, y2);

          const result = coordinate1.DotProduct(coordinate2);

          expect(result).toBe(expectedResult);
        });
    });

    describe('##CrossProduct', () => {
      it.each([
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 2, 3, 4, -2],
        [-1, -2, -3, -4, -2],
        [1, -2, 3, 4, 10],
      ])(`should calculate the cross product of the 2 coordinates
          (%d, %d) CROSS (%d, %d) = %d`,
        (x1, y1, x2, y2, expectedResult) => {
          const coordinate1 = new CartesianCoordinate(x1, y1);
          const coordinate2 = new CartesianCoordinate(x2, y2);
          const result = coordinate1.CrossProduct(coordinate2);
          expect(result).toBe(expectedResult);
        });
    });

    describe('##OffsetFrom', () => {
      it.each([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 1, -2, -1, 2, 1, -2, -1],
        [-1, -2, 3, 4, -1, -2, 3, 4],
      ])(`should return an offset between the 2 coordinates
          (x: %d, y: %d) offset by (x: %d, y: %d) should give an offset object I:(x: %d, y: %d), J: (x: %d, y: %d)`,
        (xi, yi, xj, yj, expectedI_X, expectedI_Y, expectedJ_X, expectedJ_Y) => {
          const coordinate1 = new CartesianCoordinate(xj, yj);
          const coordinate2 = new CartesianCoordinate(xi, yi);
          const offset: CartesianOffset = coordinate1.OffsetFrom(coordinate2);

          expect(offset.I.X).toBe(expectedI_X);
          expect(offset.I.Y).toBe(expectedI_Y);
          expect(offset.J.X).toBe(expectedJ_X);
          expect(offset.J.Y).toBe(expectedJ_Y);
        });
    });

    describe('##OffsetCoordinate', () => {
      it.each([
        [2, 3, 0, 0, 2, 3],
        [2, 3, 0, 45, 2, 3],
        [2, 3, 0, -45, 2, 3],
        [2, 3, 1, 0, 3, 3],
        [2, 3, -1, 0, 1, 3],
        [2, 3, 1, 60, 2.5, 3.866025],
        [2, 3, -1, 60, 1.5, 2.133975],
        [2, 3, -1, -60, 1.5, 3.866025],
        [2, 3, 1, -60, 2.5, 2.133975],
      ])(`should return an offset from the coordinate by the specified distance & rotation
          (x: %d, y: %d) offset by distance %d & rotation %d degrees should be at (x: %f, y: %f)`,
        (x, y, distance, rotationDegrees, expectedX, expectedY) => {
          const coordinate = new CartesianCoordinate(x, y);
          const rotation = Angle.CreateFromDegree(rotationDegrees);
          const offsetCoordinate = coordinate.OffsetCoordinate(distance, rotation);
          const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

          expect(offsetCoordinate).toEqual(expectedCoordinate);
        });
    });

    describe('##DistanceFromOrigin', () => {
      it.each([
        [2, 3, 3.605551275463989],
        [-2, 3, 3.605551275463989],
        [-2, -3, 3.605551275463989],
        [2, -3, 3.605551275463989],
        [0, 0, 0],
      ])(`should calculate the distance from the origin for the coordinate
        (x: %d, y: %d) should be %f from the origin`,
        (x, y, expectedDistance) => {
          const coordinate = new CartesianCoordinate(x, y);
          const distance = coordinate.DistanceFromOrigin();
          expect(distance).toBeCloseTo(expectedDistance, 6);
        });
    });
  });

  describe('Combining Methods', () => {
    describe('#subtractBy', () => {
      it.each`
          x1     | y1     | x2     | y2     | xResult | yResult
          ${0}   | ${0}   | ${0}   | ${0}   | ${0}    | ${0}
          ${1}   | ${2}   | ${3}   | ${4}   | ${-2}   | ${-2}
          ${1}   | ${2}   | ${-1}  | ${-2}  | ${0}    | ${0}
          ${1}   | ${-2}  | ${-2}  | ${4}   | ${3}    | ${-6}
          ${-3}  | ${2}   | ${-2}  | ${-4}  | ${-1}   | ${6}
          ${-3}  | ${2}   | ${-3}  | ${2}   | ${0}    | ${0}
      `(`should return the difference between the 2 coordinates
          (x: %d, y: %d) - (x: %d, y: %d) = (x: %d, y: %d)`,
        ({ x1, y1, x2, y2, xResult, yResult }) => {
          const coordinate1 = new CartesianCoordinate(x1, y1);
          const coordinate2 = new CartesianCoordinate(x2, y2);

          const coordinate3 = coordinate1.subtractBy(coordinate2);

          expect(coordinate3.X).toBe(xResult);
          expect(coordinate3.Y).toBe(yResult);
        });
    });

    describe('#addTo', () => {
      it.each`
          x1     | y1     | x2     | y2     | xResult | yResult
          ${0}   | ${0}   | ${0}   | ${0}   | ${0}    | ${0}
          ${1}   | ${2}   | ${3}   | ${4}   | ${4}    | ${6}
          ${1}   | ${2}   | ${-1}  | ${-2}  | ${0}    | ${0}
          ${1}   | ${-2}  | ${-2}  | ${4}   | ${-1}   | ${2}
          ${-1}  | ${2}   | ${-2}  | ${-4}  | ${-3}   | ${-2}
          ${-1}  | ${2}   | ${2}   | ${-4}  | ${1}    | ${-2}
      `(`should return the addition of the 2 coordinates
          (x: %d, y: %d) + (x: %d, y: %d) = (x: %d, y: %d)`,
        ({ x1, y1, x2, y2, xResult, yResult }) => {
          const coordinate1 = new CartesianCoordinate(x1, y1);
          const coordinate2 = new CartesianCoordinate(x2, y2);

          const coordinate3 = coordinate1.addTo(coordinate2);

          expect(coordinate3.X).toBe(xResult);
          expect(coordinate3.Y).toBe(yResult);
        });
    });

    describe('#multiplyBy', () => {
      it.each`
          x     | y     | factor | scaledX | scaledY
          ${0}  | ${0}  | ${0}   | ${0}    | ${0}
          ${2}  | ${3}  | ${2}   | ${4}    | ${6}
          ${2}  | ${3}  | ${-1}  | ${-2}   | ${-3}
          ${2}  | ${3}  | ${3.2} | ${6.4}  | ${9.6}
          ${2}  | ${3}  | ${-1.2}| ${-1.44}| ${-2.88}
      `(`should multiply the coordinate by the provided scale
          (x: %d, y: %d) * %d = (x: %d, y: %d)`,
        ({ x, y, factor, scaledX, scaledY }) => {
          const coordinate = new CartesianCoordinate(x, y);

          const coordinateNew = coordinate.multiplyBy(factor);

          expect(coordinateNew.X).toBeCloseTo(scaledX, 4);
          expect(coordinateNew.Y).toBeCloseTo(scaledY, 4);
        });
    });


    describe('#divideBy', () => {
      it('should throw an exception when dividing by zero', () => {
        const coordinate = new CartesianCoordinate(2, -3);

        expect(() => coordinate.divideBy(0)).toThrowError();
      });

      it.each`
          x     | y     | factor | scaledX | scaledY
          ${2}  | ${3}  | ${2}   | ${1}    | ${1.5}
          ${2}  | ${3}  | ${-1}  | ${-2}   | ${-3}
          ${2}  | ${3}  | ${2}   | ${1}    | ${1.5}
          ${2}  | ${3}  | ${3.2} | ${0.625}| ${0.9375}
          ${2}  | ${3}  | ${-1.2}| ${-1.666667}| ${-2.5}
          ${2.2}| ${3.1}| ${5.4} | ${0.407407}| ${0.574074}
      `(`should divide the coordinates by the provided scale
          (x: %d, y: %d) / %d = (x: %d, y: %d)`,
        ({ x, y, factor, scaledX, scaledY }) => {
          const coordinate = new CartesianCoordinate(x, y);

          const coordinateNew = coordinate.divideBy(factor);

          expect(coordinateNew.X).toBeCloseTo(scaledX, 6);
          expect(coordinateNew.Y).toBeCloseTo(scaledY, 6);
        });
    });
  });

  describe('Conversion Methods', () => {
    describe('#toPolar', () => {
      it('should convert Cartesian Coordinate to Polar Coordinate', () => {
        const cartesian = new CartesianCoordinate(1, 1.73205081, Tolerance);
        // const polarExpected = new PolarCoordinate(2, Angle.createFromDegree(60), Tolerance);

        // const polar = cartesian.toPolar();

        // expect(polar).toEqual(polarExpected);
      });
    });
  });

  describe('Equality & Comparison', () => {
    describe('#equals', () => {
      it.each`
          x1     | y1     | x2     | y2     | expectedResult
          ${5.3} | ${-2}  | ${5.3} | ${-2}  | ${true}
          ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${false}
      `('should return $expectedResult when comparing CartesianCoordinates (x: %d, y: %d) & (x: %d, y: %d)',
        ({ x1, y1, x2, y2, expectedResult }) => {
          const tolerance = 0.0002;
          const coordinate1 = new CartesianCoordinate(x1, y1, tolerance);
          const coordinate2 = new CartesianCoordinate(x2, y2, tolerance);

          expect(coordinate1.equals(coordinate2)).toBe(expectedResult);
        });

      it.each`
          x1     | y1     | x2     | y2     | expectedResult
          ${1}   | ${2}   | ${1}   | ${2}   | ${true}
          ${1}   | ${2}   | ${3}   | ${4}   | ${false}
      `('should return $expectedResult when comparing CartesianCoordinate (x: %d, y: %d) & ICoordinate (x: %d, y: %d)',
        ({ x1, y1, x2, y2, expectedResult }) => {
          const tolerance = 0.0002;
          const cartesianCoordinate = new CartesianCoordinate(x1, y1, tolerance);
          const iCoordinate = new CartesianCoordinate(x2, y2, tolerance) as unknown as ICoordinate;

          expect(cartesianCoordinate.equals(iCoordinate)).toBe(expectedResult);
        });

      it('should return false when comparing CartesianCoordinate and incompatible ICoordinate as object', () => {
        const tolerance = 0.0002;
        const cartesianCoordinate = new CartesianCoordinate(1, 2, tolerance);
        const iCoordinate = new TestCoordinate();

        expect(cartesianCoordinate.equals(iCoordinate)).toBe(false);
      });

      it.each`
            x       | y       | radius    | azimuth         | expectedResult
            ${0}    | ${0}    | ${0}      | ${0}            | ${true}
            ${2}    | ${3}    | ${2.8284} | ${1.0472}       | ${true}
            ${-2}   | ${2}    | ${2.8284} | ${2.0944}       | ${true}
            ${-2}   | ${0}    | ${2}      | ${3.1416}       | ${true}
            ${-2}   | ${-2}   | ${2.8284} | ${4.1888}       | ${true}
            ${0}    | ${-2}   | ${2}      | ${-1.5708}      | ${true}
            ${2}    | ${-2}   | ${2.8284} | ${-0.5236}      | ${true}
            ${2}    | ${-2}   | ${5}      | ${-1.5708}      | ${false}
        `('should return $expectedResult when comparing CartesianCoordinate (x: %d, y: %d) and PolarCoordinate (r: %d, degrees: %d)',
        ({ x, y, radius, azimuth, expectedResult }) => {
          const tolerance = 0.0002;
          const cartesianCoordinate = new CartesianCoordinate(x, y, tolerance);
          // const polarCoordinate = new PolarCoordinate(radius, azimuth, tolerance) as unknown as ICoordinate;

          // expect(cartesianCoordinate.equals(polarCoordinate)).toBe(expectedResult);
        });
    });
  });

  describe('Methods: Static', () => {
    describe('##Origin', () => {
      it('should return a Cartesian Coordinate at the origin', () => {
        const coordinate = CartesianCoordinate.Origin();
        const expectedCoordinate = new CartesianCoordinate(0, 0);

        expect(coordinate).toEqual(expectedCoordinate);
      });
    });

    describe('##OffsetCoordinate', () => {
      it.each([
        [2, 3, 0, 0, 2, 3],        // No offset
        [2, 3, 0, 45, 2, 3],       // Rotation of coordinate about itself
        [2, 3, 0, -45, 2, 3],      // Negative Rotation of coordinate about itself
        [2, 3, 1, 0, 3, 3],        // Linear offset with default rotation
        [2, 3, -1, 0, 1, 3],       // Negative linear offset with default rotation
        [2, 3, 1, 60, 2.5, 3.866025],
        [2, 3, -1, 60, 1.5, 2.133975],
        [2, 3, -1, -60, 1.5, 3.866025],
        [2, 3, 1, -60, 2.5, 2.133975],
      ])(`should return an offset from the coordinate by the specified distance & rotation
          (x: %d, y: %d) offset by distance %d & rotation %d degrees should be at (x: %d, y: %d)`,
        (x, y, distance, rotationDegrees, expectedX, expectedY) => {
          const coordinate = new CartesianCoordinate(x, y, Tolerance);
          const rotation = Angle.CreateFromDegree(rotationDegrees);
          const offsetCoordinate = CartesianCoordinate.OffsetCoordinate(coordinate, distance, rotation);
          const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY, Tolerance);

          expect(offsetCoordinate).toEqual(expectedCoordinate);
        }
      );
    });

    describe('ITransform', () => {
      describe('Rotate', () => {
        describe('#Rotate', () => {
          it.each([
            [0, 0, Numbers.PiOver2, 0, 0],
            [3, 4, 0, 3, 4],
            [3, 4, 0.785398, -0.707107, 4.949747],
            [3, 4, 1.570796, -4, 3],
            [3, 4, 2.356194, -4.949747, -0.707107],
            [3, 4, 3.141593, -3, -4],
            [3, 4, 3.926991, 0.707107, -4.949747],
            [3, 4, 4.712389, 4, -3],
            [3, 4, 5.497787, 4.949747, 0.707107],
            [3, 4, 6.283185, 3, 4],
          ])(`Rotate(%d, %d) by %f radians should yield (%f, %f)`,
            (x, y, angleRadians, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const cartesianCoordinate = CartesianCoordinate.Rotate(coordinate, angleRadians);

              expect(cartesianCoordinate.X).toBeCloseTo(expectedX, Tolerance);
              expect(cartesianCoordinate.Y).toBeCloseTo(expectedY, Tolerance);
            });
        });

        describe('#RotateAboutPoint', () => {
          it.each([
            [3, 4, 2, 1, 0, 3, 4],
            [3, 4, 2, 1, 0.785398, 0.585786, 3.828427],
            [3, 4, 2, 1, 1.570796, -1, 2],
            [3, 4, 2, 1, 2.356194, -0.828427, -0.414214],
            [3, 4, 2, 1, 3.141593, 1, -2],
            [3, 4, 2, 1, 3.926991, 3.414214, -1.828427],
            [3, 4, 2, 1, 4.712389, 5, 0],
            [3, 4, 2, 1, 5.497787, 4.828427, 2.414214],
            [3, 4, 2, 1, 6.283185, 3, 4],
          ])(`RotateAboutPoint(%d, %d, %d, %d, %f) should yield (%f, %f)`,
            (x, y, centerX, centerY, angleRadians, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const centerOfRotation = new CartesianCoordinate(centerX, centerY);
              const cartesianCoordinate = CartesianCoordinate.RotateAboutPoint(coordinate, centerOfRotation, angleRadians);

              expect(cartesianCoordinate.X).toBeCloseTo(expectedX, Tolerance);
              expect(cartesianCoordinate.Y).toBeCloseTo(expectedY, Tolerance);
            });
        });
      });

      describe('Scale', () => {
        describe('#Scale', () => {
          it.each([
            [3, 2, 2, 6, 4],        // Default - larger, Quadrant I
            [3, 2, 0.5, 1.5, 1],    // Smaller
            [3, 2, -2, -6, -4],     // Negative
            [3, 2, 0, 0, 0],        // 0
            [-3, 2, 2, -6, 4],      // Default in Quadrant II
            [-3, -2, 2, -6, -4],    // Default in Quadrant III
            [3, -2, 2, 6, -4],      // Default in Quadrant IV
          ])(`Scale(%d, %d) by %d should yield (%d, %d)`,
            (x, y, scale, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

              const transformedCoordinate = CartesianCoordinate.Scale(coordinate, scale);

              expect(transformedCoordinate.X).toBeCloseTo(expectedCoordinate.X, Tolerance);
              expect(transformedCoordinate.Y).toBeCloseTo(expectedCoordinate.Y, Tolerance);
            });
        });

        describe('#ScaleFromPoint', () => {
          it.each([
            [3, 2, 2, 6, 4],        // Default - larger, Quadrant I
            [3, 2, 0.5, 1.5, 1],    // Smaller
            [3, 2, -2, -6, -4],     // Negative
            [3, 2, 0, 0, 0],        // 0
            [-3, 2, 2, -6, 4],      // Default in Quadrant II
            [-3, -2, 2, -6, -4],    // Default in Quadrant III
            [3, -2, 2, 6, -4],      // Default in Quadrant IV
          ])(`ScaleFromPoint(%d, %d) by %d should yield (%d, %d)`,
            (x, y, scale, expectedX, expectedY) => {
              const referencePoint = new CartesianCoordinate(2, -3);
              const coordinate = new CartesianCoordinate(x, y).addTo(referencePoint);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY).addTo(referencePoint);

              const transformedCoordinate = CartesianCoordinate.ScaleFromPoint(coordinate, referencePoint, scale);

              expect(transformedCoordinate.X).toBeCloseTo(expectedCoordinate.X, Tolerance);
              expect(transformedCoordinate.Y).toBeCloseTo(expectedCoordinate.Y, Tolerance);
            });
        });
      });

      describe('Skew', () => {
        describe('#Skew', () => {
          // TODO: Update method signatures for lambda values or object. Tests Cases are identical.
          it.each([
            [3, 2, 0.4, 0, 0, 3.8, 2],            // Shear +x
            [3, 2, -0.4, 0, 0, 2.2, 2],           // Shear -x
            [3, 2, 0, 0.4, 0, 3, 3.2],            // Shear +y
            [3, 2, 0, -0.4, 0, 3, 0.8],           // Shear -y
            [3, 2, 0.4, 0.6, 0, 3.8, 3.8],        // Shear +x, +y, Quadrant I
            [-3, 2, 0.4, -1.5, 0, -2.2, 6.5],     // Shear +x, +y, Quadrant II
            [-3, -2, -1, -1.5, 0, -1, 2.5],       // Shear +x, +y, Quadrant III
            [3, -2, -1, 0.6, 0, 5, -0.2],         // Shear +x, +y, Quadrant IV
          ])(`Skew_With_Lambdas(%d, %d) by %d, %d should yield (%d, %d)`,
            (x, y, lambdaX, lambdaY, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

              const transformedCoordinate = CartesianCoordinate.Skew(coordinate, lambdaX, lambdaY);
              transformedCoordinate.Tolerance = Tolerance;
              expectedCoordinate.Tolerance = Tolerance;

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });

          it.each([
            [3, 2, 0.4, 0, 0, 3.8, 2],            // Shear +x
            [3, 2, -0.4, 0, 0, 2.2, 2],           // Shear -x
            [3, 2, 0, 0.4, 0, 3, 3.2],            // Shear +y
            [3, 2, 0, -0.4, 0, 3, 0.8],           // Shear -y
            [3, 2, 0.4, 0.6, 0, 3.8, 3.8],        // Shear +x, +y, Quadrant I
            [-3, 2, 0.4, -1.5, 0, -2.2, 6.5],     // Shear +x, +y, Quadrant II
            [-3, -2, -1, -1.5, 0, -1, 2.5],       // Shear +x, +y, Quadrant III
            [3, -2, -1, 0.6, 0, 5, -0.2],         // Shear +x, +y, Quadrant IV
          ])('Skew_With_Lambda_Object(%d, %d) by %d, %d should yield (%d, %d)',
            (x, y, lambdaX, lambdaY, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

              const transformedCoordinate = CartesianCoordinate.Skew(coordinate, lambdaX, lambdaY);
              transformedCoordinate.Tolerance = Tolerance;
              expectedCoordinate.Tolerance = Tolerance;

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });
        });

        describe('#SkewWithinBox', () => {
          it.each([
            [3, 2, 0, 0, 5, 5, 0, 1, 0, -1, -3, 2, 3.8, 2],               // Mirror about y-axis to Quadrant II
            [3, 2, 0, 0, 5, 5, 0, -1, 0, 1, -3, 2, 3.8, 2],              // Mirror about y-axis to Quadrant II, reversed line
            [3, 2, 0, 0, 5, 5, 0, 0, 0, 2, -3, 2, 3.8, 2],               // Mirror about y-axis to Quadrant II, vertical line
            [3, 2, 0, 0, 5, 5, 1, 0, -1, 0, -2, -3, -2.2, 6.5],          // Mirror about x-axis to Quadrant IV
            [3, 2, 0, 0, 5, 5, -1, 0, 1, 0, -2, -3, 2.2, 6.5],           // Mirror about x-axis to Quadrant IV, reversed line
            [3, 2, 0, 0, 5, 5, 1, 1, 0, 0, 0, 0, 2, 3],                  // Mirror about 45 deg sloped line about shape center
            [3, 2, 0, 0, 5, 5, -1, -1, 0, 0, 0, 0, 2, 3],                // Mirror about 45 deg sloped line about shape center, reversed line
            [3, 2, 0, 0, 5, 5, -1, 1, 0, 0, 0, 0, -2, -3],               // Mirror about 45 deg sloped line to quadrant III
            [3, 2, 0, 0, 5, 5, 1, -1, 0, 0, 0, 0, -2, -3],               // Mirror about 45 deg sloped line to quadrant III, reversed line
            [3, 2, 0, 0, 5, 5, 0, 0, 2, 2, -3, -3, 4.33333333333333, 2], // Bounding box as skew box
            [3, 2, 0, 0, 5, 5, 0, 2, 0, 0, -3, -3, 3, 4],               // Bounding box as skew box
          ])(`SkewWithinBox(%d, %d) by (%d, %d) should yield (%d, %d)`,
            (x, y, stationaryPointX, stationaryPointY, skewingPointX, skewingPointY, magnitudeX, magnitudeY, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);
              const stationaryReferencePoint = new CartesianCoordinate(stationaryPointX, stationaryPointY);
              const skewingReferencePoint = new CartesianCoordinate(skewingPointX, skewingPointY);
              const magnitude = CartesianOffset.FromOffsets(magnitudeX, magnitudeY);

              const transformedCoordinate = CartesianCoordinate.SkewWithinBox(coordinate, stationaryReferencePoint, skewingReferencePoint, magnitude);
              transformedCoordinate.Tolerance = Tolerance;
              expectedCoordinate.Tolerance = Tolerance;

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });
        });
      });

      describe('Mirror', () => {
        describe('#MirrorAboutAxisX', () => {
          it.each([
            [3, 2, 3, -2],        // Mirror about x-axis to Quadrant IV
            [-3, -2, -3, 2],      // Mirror about x-axis to Quadrant IV, reversed line
          ])(`MirrorAboutAxisX(%d, %d) should yield (%d, %d)`,
            (x, y, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

              const transformedCoordinate = CartesianCoordinate.MirrorAboutAxisX(coordinate);

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });
        });

        describe('#MirrorAboutAxisY', () => {
          it.each([
            [3, 2, -3, 2],        // Mirror about y-axis to Quadrant II
            [-3, -2, 3, -2],      // Mirror about y-axis to Quadrant II, reversed line
          ])(`MirrorAboutAxisY(%d, %d) should yield (%d, %d)`,
            (x, y, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

              const transformedCoordinate = CartesianCoordinate.MirrorAboutAxisY(coordinate);

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });
        });

        describe('#MirrorAboutLine', () => {
          it.each([
            [3, 2, 0, 1, 0, -1, -3, 2],             // Mirror about y-axis to Quadrant II
            [3, 2, 0, 1, 0, -1, -3, 2],             // Mirror about y-axis to Quadrant II, reversed line
            [3, 2, 1, 0, -1, 0, 3, -2],             // Mirror about x-axis to Quadrant IV
            [3, 2, 1, 0, -1, 0, 3, -2],             // Mirror about x-axis to Quadrant IV, reversed line
            [3, 2, 0, 1, 1, 1, 2, 3],               // Mirror about 45 deg sloped line about shape center
            [3, 2, 0, 1, 1, 1, 2, 3],               // Mirror about 45 deg sloped line about shape center, reversed line
            [3, 2, 0, 1, -1, 1, -2, -3],            // Mirror about 45 deg sloped line to quadrant III
            [3, 2, 0, 1, -1, 1, -2, -3],            // Mirror about 45 deg sloped line to quadrant III, reversed line
          ])(`MirrorAboutLine coordinate (%d, %d) about (%d, %d), (%d, %d) should yield (%d, %d)`,
            (x, y, lineX1, lineY1, lineX2, lineY2, expectedX, expectedY) => {
              const coordinate = new CartesianCoordinate(x, y);
              const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);
              const lineOfReflection = new LinearCurve(new CartesianCoordinate(lineX1, lineY1), new CartesianCoordinate(lineX2, lineY2));

              const transformedCoordinate = CartesianCoordinate.MirrorAboutLine(coordinate, lineOfReflection);

              expect(transformedCoordinate).toEqual(expectedCoordinate);
            });
        });
      });
    });

  });
});
