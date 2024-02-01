import { Angle } from "./Angle";
import { CartesianCoordinate } from './CartesianCoordinate';
import { Vector } from "../Vectors/Vector";

describe("Angle", () => {
  let Tolerance: number;

  beforeAll(() => {
    Tolerance = 0.00001;
  });

  describe("Initialization", () => {
    it.each([
      [0, 0],
      [0.785398, 0.7854],
      [1.570796, 1.5708],
      [2.356194, 2.35619],
      [3.14159265, 3.14159265],
      [3.926991, -2.35619],
      [4.712389, -1.5708],
      [5.497787, -0.7854],
      [6.283185, 0],
      [10.995574, -1.5708],
      [12.566371, 0],
      [31.415927, 0],
      [-0.785398, -0.7854],
      [-1.570796, -1.5708],
      [-2.356194, -2.35619],
      [-3.141593, 3.14159],
      [-3.926991, 2.35619],
      [-4.712389, 1.5708],
      [-5.497787, 0.7854],
      [-6.283185, 0],
      [-10.995574, 1.5708],
      [-12.566371, 0],
      [-31.415927, 0],
    ])("should initialize angle with default tolerance", (radians, expectedResult) => {
      const angle = new Angle(radians);

      expect(angle.Radians).toBeCloseTo(expectedResult, Tolerance);
      expect(angle.Tolerance).toBeCloseTo(0, Tolerance);

      // Check modified properties
      const expectedClockwiseRadians = -expectedResult;
      expect(angle.ClockwiseRadians).toBeCloseTo(expectedClockwiseRadians, Tolerance);

      const expectedDegrees = Angle.RadiansToDegrees(expectedResult);
      expect(angle.Degrees).toBeCloseTo(expectedDegrees, 0.0005);

      const expectedClockwiseDegrees = Angle.RadiansToDegrees(-expectedResult);
      expect(angle.ClockwiseDegrees).toBeCloseTo(expectedClockwiseDegrees, 0.0005);

      expect(angle.RadiansRaw).toBeCloseTo(radians, Tolerance);
      expect(angle.DegreesRaw).toBeCloseTo(radians * (180 / Math.PI), Tolerance);
    });

    it("should initialize angle with custom tolerance", () => {
      const radians = Math.PI / 4;
      const tolerance = 0.0002;
      const angle = new Angle(radians, tolerance);

      expect(angle.Radians).toBeCloseTo(radians, Tolerance);
      expect(angle.Tolerance).toBeCloseTo(tolerance, Tolerance);
    });
  });

  describe("Methods", () => {
    describe('#toString', () => {
      it("should return overridden string representation", () => {
        const angle = new Angle(0.5);
        expect(angle.toString()).toBe("MPT.Math.Coordinates.Angle - Radians: 0.5");
      });
    });

    describe('#getDirectionVector', () => {
      it.each([
        [0, 1, 0],
        [0.785398, 0.707107, 0.707107],
        [1.570796, 0, 1],
        [2.356194, -0.707107, 0.707107],
        [3.141593, -1, 0],
        [3.926991, -0.707107, -0.707107],
        [4.712389, 0, -1],
        [5.497787, 0.707107, -0.707107],
        [6.283185, 1, 0],
      ])("should return direction vector of angle", (angleRadians, expectedXComponent, expectedYComponent) => {
        const angle = new Angle(angleRadians);
        const vector = angle.GetDirectionVector();

        expect(vector.Xcomponent).toBeCloseTo(expectedXComponent, Tolerance);
        expect(vector.Ycomponent).toBeCloseTo(expectedYComponent, Tolerance);
      });
    });

    describe('#rotateVector', () => {
      it.each([
        [1, 1, 0, 1, 1],
        [1, 1, 0.785398, 0, 1.414214],
        [1, 1, 1.570796, -1, 1],
        [1, 1, 2.356194, -1.414214, 0],
        [1, 1, 3.141593, -1, -1],
        [1, 1, 3.926991, 0, -1.414214],
        [1, 1, 4.712389, 1, -1],
        [1, 1, 5.497787, 1.414214, 0],
        [1, 1, 6.283185, 1, 1],
      ])("should return rotated vector by angle",
        (xComponent, yComponent, angleRadians, expectedXComponent, expectedYComponent) => {
          const angle = new Angle(angleRadians);
          const vector = Vector.fromMagnitudesAtLocation(xComponent, yComponent);

          const vectorRotated = angle.RotateVector(vector);

          expect(vectorRotated.Xcomponent).toBeCloseTo(expectedXComponent, Tolerance);
          expect(vectorRotated.Ycomponent).toBeCloseTo(expectedYComponent, Tolerance);
        });
    });
  });

  describe('Combining Methods', () => {
    describe('#addTo', () => {
      it.each([
        [0, 0, 0],
        [Math.PI / 4, Math.PI / 2, (3 / 4) * Math.PI],
        [-Math.PI / 4, Math.PI / 2, Math.PI / 4],
        [Math.PI / 4, -Math.PI / 2, -Math.PI / 4],
        [-Math.PI / 4, -Math.PI / 2, -(3 / 4) * Math.PI],
      ])('AddOverride returns combined coordinates',
        (angleRadians1, angleRadians2, angleResult) => {
          const angle1 = new Angle(angleRadians1);
          const angle2 = new Angle(angleRadians2);

          const angle3 = angle1.addTo(angle2);

          expect(angle3.Radians).toBeCloseTo(angleResult, Tolerance);
        });
    });

    describe('#subtractBy', () => {
      it.each([
        [0, 0, 0],
        [Math.PI / 4, Math.PI / 2, -(1 / 4) * Math.PI],
        [-Math.PI / 4, Math.PI / 2, -(3 / 4) * Math.PI],
        [Math.PI / 4, -Math.PI / 2, (3 / 4) * Math.PI],
        [-Math.PI / 4, -Math.PI / 2, (1 / 4) * Math.PI],
        [Math.PI / 2, Math.PI / 4, (1 / 4) * Math.PI],
        [-Math.PI / 2, Math.PI / 4, -(3 / 4) * Math.PI],
        [Math.PI / 2, -Math.PI / 4, (3 / 4) * Math.PI],
        [-Math.PI / 2, -Math.PI / 4, -(1 / 4) * Math.PI],
      ])('SubtractOverride returns the difference of coordinates',
        (angleRadians1, angleRadians2, angleResult) => {
          const angle1 = new Angle(angleRadians1);
          const angle2 = new Angle(angleRadians2);

          const angle3 = angle1.subtractBy(angle2);

          expect(angle3.Radians).toBeCloseTo(angleResult, Tolerance);
        });
    });

    describe('#multiplyBy', () => {
      it.each([
        [0, 0, 0],
        [Math.PI / 4, 2, Math.PI / 2],
        [-Math.PI / 4, 2, -Math.PI / 2],
        [Math.PI / 4, -2, -Math.PI / 2],
        [-Math.PI / 4, -2, Math.PI / 2],
      ])('MultiplyOverride multiplies coordinate by a scaling factor',
        (angleRadians, factor, scaledAngle) => {
          const angle = new Angle(angleRadians);

          const angleNew1 = angle.multiplyBy(factor);

          expect(angleNew1.Radians).toBeCloseTo(scaledAngle, Tolerance);
        });
    });

    describe('#divideBy', () => {
      it.each([
        [0, Math.PI / 2, 0],
        [Math.PI / 4, Math.PI / 4, 1],
        [Math.PI / 4, Math.PI / 2, 0.5],
        [-Math.PI / 4, Math.PI / 2, -0.5],
        [Math.PI / 4, -Math.PI / 2, -0.5],
        [-Math.PI / 4, -Math.PI / 2, 0.5],
      ])('DivideOverride divides coordinate by a scaling factor',
        (angleRadians, factor, scaledAngle) => {
          const angle = new Angle(angleRadians);

          const angleNew = angle.divideBy(factor);

          expect(angleNew.Radians).toBeCloseTo(scaledAngle, Tolerance);
        });

      it('DivideOverride throws an exception when dividing by zero', () => {
        const angle = new Angle(2);
        expect(() => { angle.divideBy(0); }).toThrow();
      });
    });

  });

  describe("Methods: Static", () => {
    describe('#createFromRadian', () => {
      it("should create angle from specified radians and tolerance", () => {
        const radians = Math.PI / 4;
        const tolerance = 0.0002;

        const angle = Angle.CreateFromRadian(radians, tolerance);

        expect(angle.Radians).toBeCloseTo(radians, Tolerance);
        expect(angle.Tolerance).toBeCloseTo(tolerance, Tolerance);
      });
    });

    describe('#createFromDegree', () => {
      it("should create angle from specified degrees and tolerance", () => {
        const degrees = 30;
        const tolerance = 0.0002;

        const angle = Angle.CreateFromDegree(degrees, tolerance);

        expect(angle.Degrees).toBeCloseTo(degrees, Tolerance);
        expect(angle.Tolerance).toBeCloseTo(tolerance, Tolerance);
      });
    });

    describe('#createFromVector', () => {
      it("should create angle from specified vector and tolerance", () => {
        const vector = Vector.fromMagnitudesAtLocation(2, 3);
        const expectedAngle = vector.Angle();
        const tolerance = 0.0002;

        const angle = Angle.CreateFromVector(vector, tolerance);

        expect(angle.Radians).toBeCloseTo(expectedAngle.Radians, Tolerance);
        expect(angle.Tolerance).toBeCloseTo(tolerance, Tolerance);
      });
    });

    describe('#createFromPoint', () => {
      it('should create an angle from origin to a specified point', () => {
        const point = new CartesianCoordinate(2, 3);
        const expectedAngle = Math.atan(3 / 2);

        const angle = Angle.CreateFromPoint(point);

        expect(angle.Radians).toBeCloseTo(expectedAngle, Tolerance);
      });
    });

    describe('#radiansToDegrees', () => {
      it.each([
        [0, 0],
        [0.7853982, 45],
        [1.5707963, 90],
        [2.3561945, 135],
        [3.1415927, 180],
        [3.9269908, 225],
        [4.712389, 270],
        [5.4977871, 315],
        [0.5235988, 30],
        [1.0471976, 60],
        [-0.7853982, -45],
        [-1.5707963, -90],
        [-2.3561945, -135],
        [-3.1415927, -180],
        [-3.9269908, -225],
        [-4.712389, -270],
        [-5.4977871, -315],
        [-0.5235988, -30],
        [-1.0471976, -60],
      ])(
        'should convert radians %.6f to degrees %d',
        (radians, expectedResult) => {
          const result = Angle.RadiansToDegrees(radians);

          expect(result).toBeCloseTo(
            expectedResult,
            Tolerance
          );
        }
      );
    });

    describe('#degreesToRadians', () => {
      it.each([
        [0, 0],
        [45, 0.7854],
        [90, 1.5708],
        [135, 2.35619],
        [180, 3.14159],
        [225, 3.92699],
        [270, 4.71239],
        [315, 5.49779],
        [30, 0.5236],
        [60, 1.0472],
        [-45, -0.7854],
        [-90, -1.5708],
        [-135, -2.35619],
        [-180, -3.14159],
        [-225, -3.92699],
        [-270, -4.71239],
        [-315, -5.49779],
        [-30, -0.5236],
        [-60, -1.0472],
      ])(`should convert degrees %d to radians %.6f`,
        (degrees, expectedResult) => {
          const result = Angle.DegreesToRadians(degrees);

          expect(result).toBeCloseTo(
            expectedResult,
            Tolerance
          );
        }
      );
    });

    describe('#asDegrees', () => {
      it.each([
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 90],
        [-1, 0, 180],
        [0, -1, 270],
        [1, 1, 45],
        [-1, 1, 135],
        [-1, -1, 225],
        [1, -1, 315],
        [2, 1, 26.56505],
        [1, 2, 63.43495],
      ])(`should calculate degrees as %.2f for coordinates (%.2f, %.2f)`,
        (x, y, expectedResult) => {
          const coordinate = new CartesianCoordinate(x, y);

          const result = Angle.AsDegreesFromCoordinate(coordinate);

          expect(result).toBeCloseTo(expectedResult, Tolerance);
        }
      );
    });

    describe('#asRadians', () => {
      it.each([
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, Math.PI / 2],
        [-1, 0, Math.PI],
        [0, -1, (3 * Math.PI) / 2],
        [1, 1, Math.PI / 4],
        [-1, 1, (3 * Math.PI) / 4],
        [-1, -1, (5 * Math.PI) / 4],
        [1, -1, (7 * Math.PI) / 4],
        [2, 1, 0.463648],
        [1, 2, 1.107149],
      ])(`should calculate radians as %.6f for coordinates (%.2f, %.2f)`,
        (x, y, expectedResult) => {
          const coordinate = new CartesianCoordinate(x, y);

          const result = Angle.AsRadiansFromCoordinate(coordinate);

          expect(result).toBeCloseTo(expectedResult, Tolerance);
        }
      );
    });

    describe('#wrapAngleWithinPositiveNegativePi', () => {
      it.each([
        [0, 0],
        [0.785398, 0.7854],
        [1.570796, 1.5708],
        [2.356194, 2.35619],
        [3.14159265, 3.14159265],
        [3.926991, -2.35619],
        [4.712389, -1.5708],
        [5.497787, -0.7854],
        [6.283185, 0],
        [10.995574, -1.5708],
        [12.566371, 0],
        [31.415927, 0],
        [-0.785398, -0.7854],
        [-1.570796, -1.5708],
        [-2.356194, -2.35619],
        [-3.141593, 3.14159],
        [-3.926991, 2.35619],
        [-4.712389, 1.5708],
        [-5.497787, 0.7854],
        [-6.283185, 0],
        [-10.995574, 1.5708],
        [-12.566371, 0],
        [-31.415927, 0],
        [1.2345E-7, 0],
        [1.437821381955473E-07, 0],
        [-1.2345E-7, 6.2831851837300006],
        [-1.437821381955473E-07, 6.283185163397448],
        [-0.5, 5.783185],
        [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
        [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
      ])(`should wrap radians %.6f within positive/negative PI as %.6f`,
        (radians, expectedResult) => {
          const result = Angle.WrapAngleWithinPositiveNegativePi(radians);

          expect(result).toBeCloseTo(expectedResult, Tolerance);
        }
      );
    });

    describe('#wrapAngleWithinTwoPi', () => {
      it.each([
        [0, 0],
        [0.7853982, 0.7854],
        [1.5707963, 1.5708],
        [2.3561945, 2.35619],
        [3.1415927, 3.14159],
        [3.9269908, 3.92699],
        [4.712389, 4.71239],
        [5.4977871, 5.49779],
        [6.2831853, 0],
        [10.9955743, 4.71239],
        [12.5663706, 0],
        [31.4159265, 0],
        [-0.7853982, 5.49779],
        [-1.5707963, 4.71239],
        [-2.3561945, 3.92699],
        [-3.1415927, 3.14159],
        [-3.9269908, 2.35619],
        [-4.712389, 1.5708],
        [-5.4977871, 0.7854],
        [-6.2831853, 0],
        [-10.9955743, 1.5708],
        [-12.5663706, 0],
        [-31.4159265, 0],
        [1.2345E-7, 0],
        [1.437821381955473E-07, 0],
        [-1.2345E-7, 0],
        [-1.437821381955473E-07, 0],
      ])(`should wrap radians %.6f within 2*PI as %.6f`,
        (radians, expectedResult) => {
          const result = Angle.WrapAngleWithinTwoPi(radians);

          expect(result).toBeCloseTo(expectedResult, Tolerance);
        }
      );

      it.each([
        [0, 0],
        [0.7853982, 0.7854],
        [1.5707963, 1.5708],
        [2.3561945, 2.35619],
        [3.1415927, 3.14159],
        [3.9269908, 3.92699],
        [4.712389, 4.71239],
        [5.4977871, 5.49779],
        [6.2831853, 0],
        [10.9955743, 4.71239],
        [12.5663706, 0],
        [31.4159265, 0],
        [-0.7853982, 5.49779],
        [-1.5707963, 4.71239],
        [-2.3561945, 3.92699],
        [-3.1415927, 3.14159],
        [-3.9269908, 2.35619],
        [-4.712389, 1.5708],
        [-5.4977871, 0.7854],
        [-6.2831853, 0],
        [-10.9955743, 1.5708],
        [-12.5663706, 0],
        [-31.4159265, 0],
        [1.2345E-7, 0],
        [1.437821381955473E-07, 0],
        [-1.2345E-7, 0],
        [-1.437821381955473E-07, 0],
      ])(`should wrap radians %.6f within 2*PI with tolerances as %.6f`,
        (radians, expectedResult) => {
          const result = Angle.WrapAngleWithinTwoPi(radians, Tolerance);

          expect(result).toBeCloseTo(expectedResult, Tolerance);
        }
      );
    });

    describe('#offsetFrom', () => {
      it.each([
        [0, 0],
        [2, 1],
        [-1, -2],
      ])(`should return offset coordinate for (%.6f, %.6f)`,
        (radiansI, radiansJ) => {
          const angle1 = new Angle(radiansJ);
          const angle2 = new Angle(radiansI);

          const offset = angle1.OffsetFrom(angle2);

          expect(offset.I.Radians).toBeCloseTo(radiansI, Tolerance);
          expect(offset.J.Radians).toBeCloseTo(radiansJ, Tolerance);
        });
    });

    describe('#origin', () => {
      it('should return an angle aligned with the origin axis', () => {
        const angle = Angle.Origin();
        expect(angle.Degrees).toBe(0);
      });
    });
  });

  describe('Equality & Comparison', () => {
    describe('#equals', () => {
      it('should be equal for angles with identical coordinates', () => {
        const angleRadians = Math.PI / 4;
        const tolerance = 0.0002;
        const angle1 = new Angle(angleRadians, tolerance);
        const angle2 = new Angle(angleRadians, tolerance);

        expect(angle1.equals(angle2)).toBe(true);
      });

      it('should not be equal for angles with differing coordinates', () => {
        const angleRadians = Math.PI / 4;
        const tolerance = 0.0002;
        const angle = new Angle(angleRadians, tolerance);
        const angleDiff = new Angle(Math.PI / 2, tolerance);

        expect(angle.equals(angleDiff)).not.toBe(true);
      });
    });

    describe('#compareTo', () => {
      it('should compare Angle to another Angle', () => {
        const angle = new Angle(Math.PI / 2);

        const angleEqual = new Angle(Math.PI / 2);
        expect(angle.compareTo(angleEqual)).toBe(0);

        const angleGreater = new Angle(Math.PI);
        expect(angle.compareTo(angleGreater)).toBe(-1);

        const angleLesser = new Angle(Math.PI / 4);
        expect(angle.compareTo(angleLesser)).toBe(1);
      });

      it('should compare Angle to radians', () => {
        const angle = new Angle(Math.PI / 2);

        const angleEqual = Math.PI / 2;
        expect(angle.CompareToRadians(angleEqual)).toBe(0);

        const angleGreater = Math.PI;
        expect(angle.CompareToRadians(angleGreater)).toBe(-1);

        const angleLesser = Math.PI / 4;
        expect(angle.CompareToRadians(angleLesser)).toBe(1);
      });
    });

    describe('#isGreaterThan', () => {
      it('should check if Angle is greater than another Angle using GreaterThanOverride', () => {
        const angleRadiansEqual = Math.PI / 2;
        const angle = new Angle(angleRadiansEqual);
        const angleEqual = new Angle(angleRadiansEqual);

        expect(angle.isGreaterThan(angleEqual)).toBe(false);

        const angleRadiansGreater = Math.PI;
        const angleGreater = new Angle(angleRadiansGreater);

        expect(angle.isGreaterThan(angleGreater)).toBe(false);

        const angleRadiansLesser = Math.PI / 4;
        const angleLesser = new Angle(angleRadiansLesser);

        expect(angle.isGreaterThan(angleLesser)).toBe(true);
      });
    });

    describe('#isLessThan', () => {
      it('should check if Angle is lesser than another Angle using LesserThanOverride', () => {
        const angleRadiansEqual = Math.PI / 2;
        const angle = new Angle(angleRadiansEqual);
        const angleEqual = new Angle(angleRadiansEqual);

        expect(angle.isLessThan(angleEqual)).toBe(false);

        const angleRadiansGreater = Math.PI;
        const angleGreater = new Angle(angleRadiansGreater);

        expect(angle.isLessThan(angleGreater)).toBe(true);

        const angleRadiansLesser = Math.PI / 4;
        const angleLesser = new Angle(angleRadiansLesser);

        expect(angle.isLessThan(angleLesser)).toBe(false);
      });
    });

    describe('#isGreaterThanOrEqualTo', () => {
      it('should check if Angle is greater than or equal to another Angle using GreaterThanOrEqualToOverride', () => {
        const angleRadiansEqual = Math.PI / 2;
        const angle = new Angle(angleRadiansEqual);
        const angleEqual = new Angle(angleRadiansEqual);

        expect(angle.isGreaterThanOrEqualTo(angleEqual)).toBe(true);

        const angleRadiansGreater = Math.PI;
        const angleGreater = new Angle(angleRadiansGreater);

        expect(angle.isGreaterThanOrEqualTo(angleGreater)).toBe(false);

        const angleRadiansLesser = Math.PI / 4;
        const angleLesser = new Angle(angleRadiansLesser);

        expect(angle.isGreaterThanOrEqualTo(angleLesser)).toBe(true);
      });
    });

    describe('#isLessThanOrEqualTo', () => {
      it('should check if Angle is lesser than or equal to another Angle using LesserThanOrEqualToOverride', () => {
        const angleRadiansEqual = Math.PI / 2;
        const angle = new Angle(angleRadiansEqual);
        const angleEqual = new Angle(angleRadiansEqual);

        expect(angle.isLessThanOrEqualTo(angleEqual)).toBe(true);

        const angleRadiansGreater = Math.PI;
        const angleGreater = new Angle(angleRadiansGreater);

        expect(angle.isLessThanOrEqualTo(angleGreater)).toBe(true);

        const angleRadiansLesser = Math.PI / 4;
        const angleLesser = new Angle(angleRadiansLesser);

        expect(angle.isLessThanOrEqualTo(angleLesser)).toBe(false);
      });
    });
  });
});