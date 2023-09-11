import { CartesianCoordinate } from './CartesianCoordinate'; // Import your CartesianCoordinate class
import { ICoordinate } from './ICoordinate'; // Import your ICoordinate interface

describe('CartesianCoordinate', () => {
  let Tolerance: number = 0.00001;

  class TestCoordinate implements ICoordinate {
    Tolerance: number;

    constructor() {
      this.Tolerance = Tolerance;
    }

    Equals(other: ICoordinate): boolean {
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
    describe('ToString', () => {
      it('should return overridden string value', () => {
        const coordinate = new CartesianCoordinate(1, 2);

        expect(coordinate.toString()).toBe('CartesianCoordinate - X: 1, Y: 2');
      });
    });

    describe('DotProduct', () => {
      it.each([
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 2],
        [1, 2, 3, 4, 11],
        [-1, -2, -3, -4, 11],
        [1, -2, 3, 4, -5],
      ])('should calculate dot product correctly', (x1, y1, x2, y2, expectedResult) => {
        const coordinate1 = new CartesianCoordinate(x1, y1);
        const coordinate2 = new CartesianCoordinate(x2, y2);

        const result = coordinate1.DotProduct(coordinate2);

        expect(result).toBe(expectedResult);
      });
    });

    describe('CrossProduct', () => {
      it.each([
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 2, 3, 4, -2],
        [-1, -2, -3, -4, -2],
        [1, -2, 3, 4, 10],
      ])('should return %p for coordinates (%p, %p) and (%p, %p)', (expectedResult, x1, y1, x2, y2) => {
        const result = CartesianCoordinate.CrossProduct(x1, y1, x2, y2);
        expect(result).toBe(expectedResult);
      });
    });

    describe('OffsetFrom', () => {
      it.each([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 1, -2, -1, 2, 1, -2, -1],
        [-1, -2, 3, 4, -1, -2, 3, 4],
      ])('should calculate the correct offset for coordinates (%p, %p) and (%p, %p)', (xi, yi, xj, yj, expectedI_X, expectedI_Y, expectedJ_X, expectedJ_Y) => {
        const coordinate1 = new CartesianCoordinate(xj, yj);
        const coordinate2 = new CartesianCoordinate(xi, yi);
        const offset: CartesianOffset = coordinate1.OffsetFrom(coordinate2);

        expect(offset.I.X).toBe(expectedI_X);
        expect(offset.I.Y).toBe(expectedI_Y);
        expect(offset.J.X).toBe(expectedJ_X);
        expect(offset.J.Y).toBe(expectedJ_Y);
      });
    });

    describe('OffsetCoordinate', () => {
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
      ])('should handle offset for coordinates (%p, %p), displacement (%p, %p)', (x, y, distance, rotationDegrees, expectedX, expectedY) => {
        const coordinate = new CartesianCoordinate(x, y);
        const rotation = Angle.CreateFromDegree(rotationDegrees);
        const offsetCoordinate = coordinate.OffsetCoordinate(distance, rotation);
        const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

        expect(offsetCoordinate).toEqual(expectedCoordinate);
      });
    });

    describe('DistanceFromOrigin', () => {
      it.each([
        [2, 3, 3.605551275463989],
        [-2, 3, 3.605551275463989],
        [-2, -3, 3.605551275463989],
        [2, -3, 3.605551275463989],
        [0, 0, 0],
      ])('should calculate the distance from the origin for coordinates (%p, %p)', (x, y, expectedDistance) => {
        const coordinate = new CartesianCoordinate(x, y);
        const distance = coordinate.DistanceFromOrigin();
        expect(distance).toBeCloseTo(expectedDistance, 6); // Adjust with your tolerance value
      });
    });
  });

  describe('Static', () => {
    describe('Origin (Static)', () => {
      it('should return a Cartesian Coordinate at the origin', () => {
        const coordinate = CartesianCoordinate.Origin();
        const expectedCoordinate = new CartesianCoordinate(0, 0);

        expect(coordinate).toEqual(expectedCoordinate);
      });
    });

    describe('OffsetCoordinate (Static)', () => {
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
      ])(
        'should return the expected offset coordinate',
        (x, y, distance, rotationDegrees, expectedX, expectedY) => {
          const coordinate = new CartesianCoordinate(x, y, Tolerance);
          const rotation = Angle.CreateFromDegree(rotationDegrees);
          const offsetCoordinate = CartesianCoordinate.OffsetCoordinate(coordinate, distance, rotation);
          const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY, Tolerance);

          expect(offsetCoordinate).toEqual(expectedCoordinate);
        }
      );
    });
  });

  describe('Methods: Static / ITransform', () => {
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
    ])('Rotate(%d, %d) by %f radians should yield (%f, %f)', (x, y, angleRadians, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const cartesianCoordinate = CartesianCoordinate.Rotate(coordinate, angleRadians);

      expect(cartesianCoordinate.X).toBeCloseTo(expectedX, Tolerance);
      expect(cartesianCoordinate.Y).toBeCloseTo(expectedY, Tolerance);
    });

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
    ])('RotateAboutPoint(%d, %d, %d, %d, %f) should yield (%f, %f)', (x, y, centerX, centerY, angleRadians, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const centerOfRotation = new CartesianCoordinate(centerX, centerY);
      const cartesianCoordinate = CartesianCoordinate.RotateAboutPoint(coordinate, centerOfRotation, angleRadians);

      expect(cartesianCoordinate.X).toBeCloseTo(expectedX, Tolerance);
      expect(cartesianCoordinate.Y).toBeCloseTo(expectedY, Tolerance);
    });

    it.each([
      [3, 2, 2, 6, 4],        // Default - larger, Quadrant I
      [3, 2, 0.5, 1.5, 1],    // Smaller
      [3, 2, -2, -6, -4],     // Negative
      [3, 2, 0, 0, 0],        // 0
      [-3, 2, 2, -6, 4],      // Default in Quadrant II
      [-3, -2, 2, -6, -4],    // Default in Quadrant III
      [3, -2, 2, 6, -4],      // Default in Quadrant IV
    ])('Scale(%d, %d) by %d should yield (%d, %d)', (x, y, scale, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

      const transformedCoordinate = CartesianCoordinate.Scale(coordinate, scale);

      expect(transformedCoordinate.X).toBeCloseTo(expectedCoordinate.X, Tolerance);
      expect(transformedCoordinate.Y).toBeCloseTo(expectedCoordinate.Y, Tolerance);
    });

    // Test cases for the ScaleFromPoint method
    it.each([
      [3, 2, 2, 6, 4],        // Default - larger, Quadrant I
      [3, 2, 0.5, 1.5, 1],    // Smaller
      [3, 2, -2, -6, -4],     // Negative
      [3, 2, 0, 0, 0],        // 0
      [-3, 2, 2, -6, 4],      // Default in Quadrant II
      [-3, -2, 2, -6, -4],    // Default in Quadrant III
      [3, -2, 2, 6, -4],      // Default in Quadrant IV
    ])('ScaleFromPoint(%d, %d) by %d should yield (%d, %d)', (x, y, scale, expectedX, expectedY) => {
      const referencePoint = new CartesianCoordinate(2, -3);
      const coordinate = new CartesianCoordinate(x, y).Add(referencePoint);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY).Add(referencePoint);

      const transformedCoordinate = CartesianCoordinate.ScaleFromPoint(coordinate, referencePoint, scale);

      expect(transformedCoordinate.X).toBeCloseTo(expectedCoordinate.X, Tolerance);
      expect(transformedCoordinate.Y).toBeCloseTo(expectedCoordinate.Y, Tolerance);
    });

    // Test cases for the Skew method with lambdas
    it.each([
      [3, 2, 0.4, 0, 0, 3.8, 2],            // Shear +x
      [3, 2, -0.4, 0, 0, 2.2, 2],           // Shear -x
      [3, 2, 0, 0.4, 0, 3, 3.2],            // Shear +y
      [3, 2, 0, -0.4, 0, 3, 0.8],           // Shear -y
      [3, 2, 0.4, 0.6, 0, 3.8, 3.8],        // Shear +x, +y, Quadrant I
      [-3, 2, 0.4, -1.5, 0, -2.2, 6.5],     // Shear +x, +y, Quadrant II
      [-3, -2, -1, -1.5, 0, -1, 2.5],       // Shear +x, +y, Quadrant III
      [3, -2, -1, 0.6, 0, 5, -0.2],         // Shear +x, +y, Quadrant IV
    ])('Skew_With_Lambdas(%d, %d) by %d, %d should yield (%d, %d)', (x, y, lambdaX, lambdaY, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

      const transformedCoordinate = CartesianCoordinate.Skew(coordinate, lambdaX, lambdaY);
      transformedCoordinate.Tolerance = Tolerance;
      expectedCoordinate.Tolerance = Tolerance;

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });

    // Test cases for the Skew method with lambda objects
    it.each([
      [3, 2, 0.4, 0, 0, 3.8, 2],            // Shear +x
      [3, 2, -0.4, 0, 0, 2.2, 2],           // Shear -x
      [3, 2, 0, 0.4, 0, 3, 3.2],            // Shear +y
      [3, 2, 0, -0.4, 0, 3, 0.8],           // Shear -y
      [3, 2, 0.4, 0.6, 0, 3.8, 3.8],        // Shear +x, +y, Quadrant I
      [-3, 2, 0.4, -1.5, 0, -2.2, 6.5],     // Shear +x, +y, Quadrant II
      [-3, -2, -1, -1.5, 0, -1, 2.5],       // Shear +x, +y, Quadrant III
      [3, -2, -1, 0.6, 0, 5, -0.2],         // Shear +x, +y, Quadrant IV
    ])('Skew_With_Lambda_Object(%d, %d) by %d, %d should yield (%d, %d)', (x, y, lambdaX, lambdaY, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);
      const magnitude = new CartesianOffset(lambdaX, lambdaY);

      const transformedCoordinate = CartesianCoordinate.Skew(coordinate, magnitude);
      transformedCoordinate.Tolerance = Tolerance;
      expectedCoordinate.Tolerance = Tolerance;

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });

    // Test cases for the SkewWithinBox method
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
    ])('SkewWithinBox(%d, %d) by (%d, %d) should yield (%d, %d)', (x, y, stationaryPointX, stationaryPointY, skewingPointX, skewingPointY, magnitudeX, magnitudeY, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);
      const stationaryReferencePoint = new CartesianCoordinate(stationaryPointX, stationaryPointY);
      const skewingReferencePoint = new CartesianCoordinate(skewingPointX, skewingPointY);
      const magnitude = new CartesianOffset(magnitudeX, magnitudeY);

      const transformedCoordinate = CartesianCoordinate.SkewWithinBox(coordinate, stationaryReferencePoint, skewingReferencePoint, magnitude);
      transformedCoordinate.Tolerance = Tolerance;
      expectedCoordinate.Tolerance = Tolerance;

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });

    // Test cases for the MirrorAboutAxisX method
    it.each([
      [3, 2, 3, -2],        // Mirror about x-axis to Quadrant IV
      [-3, -2, -3, 2],      // Mirror about x-axis to Quadrant IV, reversed line
    ])('MirrorAboutAxisX(%d, %d) should yield (%d, %d)', (x, y, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

      const transformedCoordinate = CartesianCoordinate.MirrorAboutAxisX(coordinate);

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });

    // Test cases for the MirrorAboutAxisY method
    it.each([
      [3, 2, -3, 2],        // Mirror about y-axis to Quadrant II
      [-3, -2, 3, -2],      // Mirror about y-axis to Quadrant II, reversed line
    ])('MirrorAboutAxisY(%d, %d) should yield (%d, %d)', (x, y, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);

      const transformedCoordinate = CartesianCoordinate.MirrorAboutAxisY(coordinate);

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });

    // Test cases for the MirrorAboutLine method
    it.each([
      [3, 2, 0, 1, 0, -1, -3, 2],             // Mirror about y-axis to Quadrant II
      [3, 2, 0, 1, 0, -1, -3, 2],             // Mirror about y-axis to Quadrant II, reversed line
      [3, 2, 1, 0, -1, 0, 3, -2],             // Mirror about x-axis to Quadrant IV
      [3, 2, 1, 0, -1, 0, 3, -2],             // Mirror about x-axis to Quadrant IV, reversed line
      [3, 2, 0, 1, 1, 1, 2, 3],               // Mirror about 45 deg sloped line about shape center
      [3, 2, 0, 1, 1, 1, 2, 3],               // Mirror about 45 deg sloped line about shape center, reversed line
      [3, 2, 0, 1, -1, 1, -2, -3],            // Mirror about 45 deg sloped line to quadrant III
      [3, 2, 0, 1, -1, 1, -2, -3],            // Mirror about 45 deg sloped line to quadrant III, reversed line
    ])('MirrorAboutLine(%d, %d) about (%d, %d), (%d, %d) should yield (%d, %d)', (x, y, lineX1, lineY1, lineX2, lineY2, expectedX, expectedY) => {
      const coordinate = new CartesianCoordinate(x, y);
      const expectedCoordinate = new CartesianCoordinate(expectedX, expectedY);
      const lineOfReflection = new LinearCurve(new CartesianCoordinate(lineX1, lineY1), new CartesianCoordinate(lineX2, lineY2));

      const transformedCoordinate = CartesianCoordinate.MirrorAboutLine(coordinate, lineOfReflection);

      expect(transformedCoordinate).toEqual(expectedCoordinate);
    });
  });

  describe('Conversion Methods', () => {
    it('should convert Cartesian Coordinate to Polar Coordinate', () => {
      // Arrange
      const cartesian = new CartesianCoordinate(1, 1.73205081, Tolerance);
      const polar = cartesian.toPolar();
      const polarExpected = new PolarCoordinate(2, Angle.createFromDegree(60), Tolerance);

      // Assert
      expect(polar).toEqual(polarExpected);
    });
  });

  describe('Equals & IEquatable Operators', () => {
    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.3} | ${-2}  | ${true}
        ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${false}
        ${5.3} | ${-2}  | ${5.3} | ${0}   | ${false}
        ${5.3} | ${-2}  | ${5.3} | ${-2}  | ${true}
        ${5.3} | ${-2}  | ${"obj"} | ${"obj"} | ${false}
    `('should return $expectedResult for identical coordinates', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate1 = new CartesianCoordinate(x1, y1, tolerance);
      const coordinate2 = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinate1.equals(coordinate2)).toBe(expectedResult);
      expect(coordinate1.equals(coordinate2 as unknown as ICoordinate)).toBe(expectedResult);
      expect(coordinate1.isEqual(coordinate2)).toBe(expectedResult);
    });

    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${false}
        ${5.3} | ${-2}  | ${5.3} | ${0}   | ${false}
        ${5.3} | ${-2}  | ${5.3} | ${-2}  | ${true}
        ${5.3} | ${-2}  | ${"obj"} | ${"obj"} | ${false}
    `('should return $expectedResult for differing coordinates', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate = new CartesianCoordinate(x1, y1, tolerance);
      const coordinateDiffX = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinate.isEqual(coordinateDiffX)).toBe(expectedResult);
      expect(coordinateDiffX.isEqual(coordinate)).toBe(expectedResult);
      expect(coordinate.equals(coordinateDiffX as unknown as ICoordinate)).toBe(expectedResult);
      expect(coordinateDiffX.equals(coordinate as unknown as ICoordinate)).toBe(expectedResult);
    });

    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${true}
    `('should return $expectedResult for differing coordinates using != operator', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate = new CartesianCoordinate(x1, y1, tolerance);
      const coordinateDiffX = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinateDiffX).not.toEqual(coordinate);
      expect(coordinate).not.toEqual(coordinateDiffX);
    });

    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${true}
    `('should return $expectedResult for differing coordinates using == operator', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate = new CartesianCoordinate(x1, y1, tolerance);
      const coordinateDiffX = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinateDiffX).not.toBe(coordinate);
      expect(coordinate).not.toBe(coordinateDiffX);
    });

    it('should return false when comparing with an incompatible coordinate as an object', () => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate = new CartesianCoordinate(1, 2, tolerance);
      const iCoordinate = new TestCoordinate();

      // Act & Assert
      expect(coordinate.equals(iCoordinate as unknown as ICoordinate)).toBe(false);
    });
  });

  describe('Hashcode', () => {
    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.3} | ${-2}  | ${true}
    `('should match hashcode for identical coordinates', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate1 = new CartesianCoordinate(x1, y1, tolerance);
      const coordinate2 = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinate1.hashCode()).toBe(coordinate2.hashCode());
    });

    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${5.3} | ${-2}  | ${5.2} | ${-2}  | ${false}
    `('should differ in hashcode for differing coordinates', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const coordinate1 = new CartesianCoordinate(x1, y1, tolerance);
      const coordinate2 = new CartesianCoordinate(x2, y2, tolerance);

      // Act & Assert
      expect(coordinate1.hashCode()).not.toBe(coordinate2.hashCode());
    });
  });

  describe('ICoordinate Operators for Cartesian Coordinate', () => {
    it.each`
        x1     | y1     | x2     | y2     | expectedResult
        ${1}   | ${2}   | ${1}   | ${2}   | ${true}
        ${1}   | ${2}   | ${3}   | ${4}   | ${false}
    `('should return $expectedResult when comparing CartesianCoordinate and ICoordinate', ({ x1, y1, x2, y2, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const cartesianCoordinate = new CartesianCoordinate(x1, y1, tolerance);
      const iCoordinate = new CartesianCoordinate(x2, y2, tolerance) as unknown as ICoordinate;

      // Act & Assert
      expect(cartesianCoordinate.isEqual(iCoordinate)).toBe(expectedResult);
    });

    it('should return false when comparing CartesianCoordinate and incompatible ICoordinate as object', () => {
      // Arrange
      const tolerance = 0.0002;
      const cartesianCoordinate = new CartesianCoordinate(1, 2, tolerance);
      const iCoordinate = new TestCoordinate();

      // Act & Assert
      expect(cartesianCoordinate.isEqual(iCoordinate)).toBe(false);
    });
  });

  describe('ICoordinate Operators for Polar Coordinate', () => {
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
    `('should return $expectedResult when comparing CartesianCoordinate and PolarCoordinate', ({ x, y, radius, azimuth, expectedResult }) => {
      // Arrange
      const tolerance = 0.0002;
      const cartesianCoordinate = new CartesianCoordinate(x, y, tolerance);
      const polarCoordinate = new PolarCoordinate(radius, azimuth, tolerance) as unknown as ICoordinate;

      // Act & Assert
      expect(cartesianCoordinate.isEqual(polarCoordinate)).toBe(expectedResult);
    });
  });

  describe('Combining Operators', () => {
    it.each`
        x1     | y1     | x2     | y2     | xResult | yResult
        ${0}   | ${0}   | ${0}   | ${0}   | ${0}    | ${0}
        ${1}   | ${2}   | ${3}   | ${4}   | ${-2}   | ${-2}
        ${1}   | ${2}   | ${-1}  | ${-2}  | ${0}    | ${0}
        ${1}   | ${-2}  | ${-2}  | ${4}   | ${3}    | ${-6}
        ${-3}  | ${2}   | ${-2}  | ${-4}  | ${-1}   | ${6}
        ${-3}  | ${2}   | ${-3}  | ${2}   | ${0}    | ${0}
    `('should subtract coordinates correctly', ({ x1, y1, x2, y2, xResult, yResult }) => {
      // Arrange
      const coordinate1 = new CartesianCoordinate(x1, y1);
      const coordinate2 = new CartesianCoordinate(x2, y2);

      // Act
      const coordinate3 = coordinate1.subtract(coordinate2);

      // Assert
      expect(coordinate3.getX()).toBe(xResult);
      expect(coordinate3.getY()).toBe(yResult);
    });

    it.each`
        x1     | y1     | x2     | y2     | xResult | yResult
        ${0}   | ${0}   | ${0}   | ${0}   | ${0}    | ${0}
        ${1}   | ${2}   | ${3}   | ${4}   | ${4}    | ${6}
        ${1}   | ${2}   | ${-1}  | ${-2}  | ${0}    | ${0}
        ${1}   | ${-2}  | ${-2}  | ${4}   | ${-1}   | ${2}
        ${-1}  | ${2}   | ${-2}  | ${-4}  | ${-3}   | ${-2}
        ${-1}  | ${2}   | ${2}   | ${-4}  | ${1}    | ${-2}
    `('should add coordinates correctly', ({ x1, y1, x2, y2, xResult, yResult }) => {
      // Arrange
      const coordinate1 = new CartesianCoordinate(x1, y1);
      const coordinate2 = new CartesianCoordinate(x2, y2);

      // Act
      const coordinate3 = coordinate1.add(coordinate2);

      // Assert
      expect(coordinate3.getX()).toBe(xResult);
      expect(coordinate3.getY()).toBe(yResult);
    });

    it.each`
        x     | y     | factor | scaledX | scaledY
        ${0}  | ${0}  | ${0}   | ${0}    | ${0}
        ${2}  | ${3}  | ${2}   | ${4}    | ${6}
        ${2}  | ${3}  | ${-1}  | ${-2}   | ${-3}
        ${2}  | ${3}  | ${3.2} | ${6.4}  | ${9.6}
        ${2}  | ${3}  | ${-1.2}| ${-1.44}| ${-2.88}
    `('should multiply coordinates correctly', ({ x, y, factor, scaledX, scaledY }) => {
      // Arrange
      const coordinate = new CartesianCoordinate(x, y);

      // Act
      const coordinateNew = coordinate.multiply(factor);

      // Assert
      expect(coordinateNew.getX()).toBeCloseTo(scaledX, 4);
      expect(coordinateNew.getY()).toBeCloseTo(scaledY, 4);
    });

    it('should throw an exception when dividing by zero', () => {
      // Arrange
      const coordinate = new CartesianCoordinate(2, -3);

      // Act & Assert
      expect(() => coordinate.divide(0)).toThrowError(DivideByZeroException);
    });

    it.each`
        x     | y     | factor | scaledX | scaledY
        ${2}  | ${3}  | ${2}   | ${1}    | ${1.5}
        ${2}  | ${3}  | ${-1}  | ${-2}   | ${-3}
        ${2}  | ${3}  | ${2}   | ${1}    | ${1.5}
        ${2}  | ${3}  | ${3.2} | ${0.625}| ${0.9375}
        ${2}  | ${3}  | ${-1.2}| ${-1.666667}| ${-2.5}
        ${2.2}| ${3.1}| ${5.4} | ${0.407407}| ${0.574074}
    `('should divide coordinates correctly', ({ x, y, factor, scaledX, scaledY }) => {
      // Arrange
      const coordinate = new CartesianCoordinate(x, y);

      // Act
      const coordinateNew = coordinate.divide(factor);

      // Assert
      expect(coordinateNew.getX()).toBeCloseTo(scaledX, 6);
      expect(coordinateNew.getY()).toBeCloseTo(scaledY, 6);
    });
  });

  describe('Conversion Operators', () => {
    it('should implicitly convert Cartesian to Polar coordinates', () => {
      // Arrange
      const tolerance = 0.0002;
      const cartesian = new CartesianCoordinate(1, 1.73205081, tolerance);
      const polar: PolarCoordinate = cartesian;
      const polarExpected = new PolarCoordinate(2, Angle.CreateFromDegree(60), tolerance);

      // Act & Assert
      expect(polar).toEqual(polarExpected);
    });
  });
});
