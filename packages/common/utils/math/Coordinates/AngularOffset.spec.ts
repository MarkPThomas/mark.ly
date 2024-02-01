import { AngularOffset } from './AngularOffset';
import { CartesianCoordinate } from './CartesianCoordinate';
import { Angle } from './Angle';
import { Numbers } from '../Numbers';

describe('AngularOffset', () => {
  const Tolerance = 0.00001;

  describe('Initialization', () => {
    it('should initialize with default tolerance', () => {
      const angle1 = new Angle(1);
      const angle2 = new Angle(3);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      expect(offset.I.Radians).toBe(angle1.Radians);
      expect(offset.J.Radians).toBe(angle2.Radians);
      expect(offset.Tolerance).toBeCloseTo(0, 6);
    });

    it('should initialize with custom tolerance', () => {
      const angle1 = new Angle(1);
      const angle2 = new Angle(3);
      const tolerance = 0.5;
      const offset = AngularOffset.fromAngles(angle1, angle2, tolerance);

      expect(offset.I.Radians).toBe(angle1.Radians);
      expect(offset.J.Radians).toBe(angle2.Radians);
      expect(offset.Tolerance).toBeCloseTo(tolerance, 6);
    });

    it('should initialize with offsets', () => {
      const tolerance = 0.5;
      const offset = AngularOffset.fromDeltaRadians(2, tolerance);

      expect(offset.I.Radians).toBeCloseTo(0, 6);
      expect(offset.J.Radians).toBeCloseTo(2, 6);
      expect(offset.Tolerance).toBeCloseTo(tolerance, 6);
    });
  });

  describe('CreateFromPoints', () => {
    it.each([
      [1, 2, 0, 1, -1, 2, 90], // 90 deg rotated
      [4, 2, 3, 2, 3, 4, 90], // 90 deg aligned
      [4, 2, 3, 2, 5, 4, 135], // acute deg aligned
      [5, 4, 3, 2, 3, 4, 135], // acute deg rotated
      [4, 2, 3, 2, 2, 3, 45], // obtuse deg aligned
      [4, 3, 3, 2, 1, 2, 45], // obtuse deg rotated
    ])('should create Angular Offset formed by 3 Points', (
      x1, y1, x2, y2, x3, y3, expectedAngleDegrees
    ) => {
      const point1 = new CartesianCoordinate(x1, y1);
      const point2 = new CartesianCoordinate(x2, y2);
      const point3 = new CartesianCoordinate(x3, y3);
      const offset = AngularOffset.fromPoints(point1, point2, point3);

      expect(offset.ToAngle().Degrees).toBeCloseTo(expectedAngleDegrees, 6);
    });
  });

  describe('Conversion', () => {
    it('should return Angle of Offset', () => {
      const angle1 = new Angle(Math.PI / 2);
      const angle2 = new Angle(Math.PI / 4);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      const angleFromOffset = offset.ToAngle();
      expect(angleFromOffset.Radians).toBeCloseTo(-Math.PI / 4, 6);
    });
  });

  describe('ToString', () => {
    it('should return overridden value', () => {
      const offset = AngularOffset.fromAngles(new Angle(0.1), new Angle(0.5));

      expect(offset.toString()).toBe('MPT.Math.Coordinates.AngularOffset - Radians_i: 0.1 - Radians_j: 0.5');
    });
  });

  describe('Delta', () => {
    it('should return Angle of rotation difference', () => {
      const angle1 = new Angle(Math.PI / 2);
      const angle2 = new Angle(Math.PI / 4);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      const angleFromOffset = offset.Delta();
      expect(angleFromOffset.Radians).toBeCloseTo(-Math.PI / 4, 6);
    });
  });

  describe('LengthChord', () => {
    it.each([
      [0, 0],
      [Math.PI / 2, Math.sqrt(2)],
      [-Math.PI / 2, -Math.sqrt(2)],
    ])('should return straight line distance between offset points of unit radius', (
      angleRadians, expectedResult
    ) => {
      const angle1 = new Angle(0);
      const angle2 = new Angle(angleRadians);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      expect(offset.LengthChord()).toBeCloseTo(expectedResult, 6);
    });

    it.each([
      [0, 0, 0],
      [Math.PI / 2, 1, Math.sqrt(2)],
      [-Math.PI / 2, 1, -Math.sqrt(2)],
      [0, 3, 0],
      [Math.PI / 2, 3, 3 * Math.sqrt(2)],
      [-Math.PI / 2, 3, -3 * Math.sqrt(2)],
      [0, -3, 0],
      [Math.PI / 2, -3, -3 * Math.sqrt(2)],
      [-Math.PI / 2, -3, 3 * Math.sqrt(2)],
    ])('should return straight line distance between offset points of specified radius', (
      angleRadians, radius, expectedResult
    ) => {
      const angle1 = new Angle(0);
      const angle2 = new Angle(angleRadians);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      expect(offset.LengthChord(radius)).toBeCloseTo(expectedResult, 6);
    });
  });

  describe('LengthArc', () => {
    it.each([
      [0, 0],
      [Math.PI / 2, Math.PI / 2],
      [-Math.PI / 2, -Math.PI / 2],
    ])('should return curve line distance between offset points of unit radius', (
      angleRadians, expectedResult
    ) => {
      const angle1 = new Angle(0);
      const angle2 = new Angle(angleRadians);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      expect(offset.LengthArc()).toBeCloseTo(expectedResult, 6);
    });

    it.each([
      [0, 0, 0],
      [Math.PI / 2, 1, Math.PI / 2],
      [-Math.PI / 2, 1, -Math.PI / 2],
      [0, 3, 0],
      [Math.PI / 2, 3, 3 * Math.PI / 2],
      [-Math.PI / 2, 3, -3 * Math.PI / 2],
      [0, -3, 0],
      [Math.PI / 2, -3, -3 * Math.PI / 2],
      [-Math.PI / 2, -3, 3 * Math.PI / 2],
    ])('should return curve line distance between offset points of specified radius', (
      angleRadians, radius, expectedResult
    ) => {
      const angle1 = new Angle(0);
      const angle2 = new Angle(angleRadians);
      const offset = AngularOffset.fromAngles(angle1, angle2);

      expect(offset.LengthArc(radius)).toBeCloseTo(expectedResult, 6);
    });
  });

  describe('Operators: Equals & IEquatable', () => {
    it('should return true for objects with identical angles', () => {
      const angleRadians = Math.PI / 4;
      const tolerance = 0.0002;
      const offset1 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians), tolerance);
      const offset2 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians), tolerance);

      expect(offset1.equals(offset2)).toBe(true);
    });

    it('should return false for objects with differing angles', () => {
      const angleRadians = Math.PI / 4;
      const tolerance = 0.0002;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians), tolerance);
      const offsetDiff = AngularOffset.fromAngles(new Angle(), new Angle(Math.PI / 2), tolerance);

      expect(offset.equals(offsetDiff)).toBe(false);

      const offsetDiffT = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians), 0.001);
      expect(offset.equals(offsetDiffT)).toBe(true);
    });

    it('should return true for not equals objects with differing angles', () => {
      const angleRadians = Math.PI / 4;
      const angleRadiansDiff = Math.PI / 2;
      const tolerance = 0.0002;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians), tolerance);
      const angleDiff = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansDiff), tolerance);

      expect(!offset.equals(angleDiff)).toBe(true);
    });
  });

  describe('Operators: Comparison & IComparable', () => {
    it('should compare to an AngularOffset with equal angles', () => {
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(Math.PI / 2));
      const angleEqual = AngularOffset.fromAngles(new Angle(), new Angle(Math.PI / 2));

      expect(offset.compareTo(angleEqual)).toBe(0);
    });

    it('should compare to a Double with equal angles', () => {
      const angleEqual = Math.PI / 2;
      const offset = AngularOffset.fromAngles(new Angle(0), new Angle(angleEqual));

      expect(offset.compareToRadians(angleEqual)).toBe(0);
    });

    it('should check if an AngularOffset is greater than', () => {
      const angleRadiansEqual = Math.PI / 2;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));
      const angleEqual = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));

      const angleRadiansGreater = Math.PI;
      const angleGreater = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansGreater));

      const angleRadiansLesser = Math.PI / 4;
      const angleLesser = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansLesser));

      expect(offset.isGreaterThan(angleEqual)).toBe(false);
      expect(offset.isGreaterThan(angleGreater)).toBe(false);
      expect(offset.isGreaterThan(angleLesser)).toBe(true);
    });

    it('should check if an AngularOffset is lesser than', () => {
      const angleRadiansEqual = Math.PI / 2;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));
      const angleEqual = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));

      const angleRadiansGreater = Math.PI;
      const angleGreater = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansGreater));

      const angleRadiansLesser = Math.PI / 4;
      const angleLesser = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansLesser));

      expect(offset.isLessThan(angleEqual)).toBe(false);
      expect(offset.isLessThan(angleGreater)).toBe(true);
      expect(offset.isLessThan(angleLesser)).toBe(false);
    });

    it('should check if an AngularOffset is greater than or equal to', () => {
      const angleRadiansEqual = Math.PI / 2;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));
      const angleEqual = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));

      const angleRadiansGreater = Math.PI;
      const angleGreater = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansGreater));

      const angleRadiansLesser = Math.PI / 4;
      const angleLesser = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansLesser));

      expect(offset.isGreaterThanOrEqualTo(angleEqual)).toBe(true);
      expect(offset.isGreaterThanOrEqualTo(angleGreater)).toBe(false);
      expect(offset.isGreaterThanOrEqualTo(angleLesser)).toBe(true);
    });

    it('should check if an AngularOffset is lesser than or equal to', () => {
      const angleRadiansEqual = Math.PI / 2;
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));
      const angleEqual = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansEqual));

      const angleRadiansGreater = Math.PI;
      const angleGreater = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansGreater));

      const angleRadiansLesser = Math.PI / 4;
      const angleLesser = AngularOffset.fromAngles(new Angle(), new Angle(angleRadiansLesser));

      expect(offset.isLessThanOrEqualTo(angleEqual)).toBe(true);
      expect(offset.isLessThanOrEqualTo(angleGreater)).toBe(true);
      expect(offset.isLessThanOrEqualTo(angleLesser)).toBe(false);
    });
  });

  describe('Operators: Combining', () => {
    test.each([
      [0, 0, 0],
      [Math.PI / 4, Math.PI / 2, -(1 / 4) * Math.PI],
      [-Math.PI / 4, Math.PI / 2, -(3 / 4) * Math.PI],
      [Math.PI / 4, -Math.PI / 2, (3 / 4) * Math.PI],
      [-Math.PI / 4, -Math.PI / 2, (1 / 4) * Math.PI],
      [Math.PI / 2, Math.PI / 4, (1 / 4) * Math.PI],
      [-Math.PI / 2, Math.PI / 4, -(3 / 4) * Math.PI],
      [Math.PI / 2, -Math.PI / 4, (3 / 4) * Math.PI],
      [-Math.PI / 2, -Math.PI / 4, -(1 / 4) * Math.PI],
    ])('SubtractOverride returns difference of coordinates', (angleRadians1, angleRadians2, angleResult) => {
      const offset1 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians1));
      const offset2 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians2));

      const offset3 = offset1.subtractBy(offset2);

      expect(offset3.Delta().Radians).toBeCloseTo(angleResult, 5);
    });

    test.each([
      [0, 0, 0],
      [Math.PI / 4, Math.PI / 2, (3 / 4) * Math.PI],
      [-Math.PI / 4, Math.PI / 2, Math.PI / 4],
      [Math.PI / 4, -Math.PI / 2, -Math.PI / 4],
      [-Math.PI / 4, -Math.PI / 2, -(3 / 4) * Math.PI],
    ])('AddOverride returns combined coordinates', (angleRadians1, angleRadians2, angleResult) => {
      const offset1 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians1));
      const offset2 = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians2));

      const offset3 = offset1.addTo(offset2);

      expect(offset3.Delta().Radians).toBeCloseTo(angleResult, 5);
    });

    test.each([
      [0, 0, 0],
      [Math.PI / 4, 2, Math.PI / 2],
      [-Math.PI / 4, 2, -Math.PI / 2],
      [Math.PI / 4, -2, -Math.PI / 2],
      [-Math.PI / 4, -2, Math.PI / 2],
    ])('MultiplyOverride multiplies coordinate by a scaling factor', (angleRadians, factor, scaledAngle) => {
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians));

      const offsetNew1 = offset.multiplyBy(factor);

      expect(offsetNew1.Delta().Radians).toBeCloseTo(scaledAngle, 5);
    });

    test.each([
      [0, Math.PI / 2, 0],
      [Math.PI / 4, Math.PI / 4, 1],
      [Math.PI / 4, Math.PI / 2, 0.5],
      [-Math.PI / 4, Math.PI / 2, -0.5],
      [Math.PI / 4, -Math.PI / 2, -0.5],
      [-Math.PI / 4, -Math.PI / 2, 0.5],
    ])('DivideOverride divides coordinate by a scaling factor', (angleRadians, factor, scaledAngle) => {
      const offset = AngularOffset.fromAngles(new Angle(), new Angle(angleRadians));

      const offsetNew = offset.divideBy(factor);

      expect(offsetNew.Delta().Radians).toBeCloseTo(scaledAngle, 5);
    });

    it('DivideOverride throws exception when dividing by zero', () => {
      const offset = AngularOffset.fromAngles(new Angle(1), new Angle(2));

      expect(() => { offset.divideBy(0); }).toThrow();
    });
  });
});