import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../../Coordinates/CartesianOffset";
import { Numbers } from "../../Numbers";
import { LinearCurve } from "../LinearCurve";
import { CurveRange } from "./CurveRange";


describe('ICloneable', () => {
  const Tolerance = 0.00001;
  let RangeWithLimits: CurveRange;

  beforeEach(() => {
    const curve = new LinearCurve(
      CartesianCoordinate.fromXY(-1, -2, Tolerance),
      CartesianCoordinate.fromXY(4, 3, Tolerance)
    );
    curve.Tolerance = Tolerance;

    RangeWithLimits = CurveRange.fromCurve(curve);
    RangeWithLimits.start.SetLimitByX(-0.5);
    RangeWithLimits.end.SetLimitByX(2);
  });

  describe('Initialization', () => {
    it('should initialize a CurveRange with start and end limits at the origin', () => {
      const range = CurveRange.fromCurve(
        new LinearCurve(
          CartesianCoordinate.fromXY(-1, -2, Tolerance),
          CartesianCoordinate.fromXY(4, 3, Tolerance)
        ));
      range.start.SetLimitByCoordinate(CartesianCoordinate.atOrigin());
      range.end.SetLimitByCoordinate(CartesianCoordinate.atOrigin());

      expect(RangeWithLimits.start.Limit).toEqual(CartesianCoordinate.atOrigin());
      expect(RangeWithLimits.end.Limit).toEqual(CartesianCoordinate.atOrigin());
    });
  });

  describe('ToString', () => {
    it('should override ToString and return the expected string representation', () => {
      expect(RangeWithLimits.toString()).toEqual(
        'MPT.Math.Curves.Tools.CurveRange - start: {X: -0.5, Y: -1.5}, end: {X: 2, Y: 1}'
      );
    });
  });

  describe('ToOffset', () => {
    it('should return a CartesianOffset with the expected values', () => {
      const offset = RangeWithLimits.toOffset();
      const offsetExpected = CartesianOffset.fromCoordinates(
        CartesianCoordinate.fromXY(-0.5, -1.5, Tolerance),
        CartesianCoordinate.fromXY(2, 1, Tolerance),
        Tolerance
      );

      expect(offset).toEqual(offsetExpected);
    });
  });

  describe('ToOffsetPolar', () => {
    it('should return a PolarOffset with the expected values', () => {
      // const polarOffset = RangeWithLimits.ToOffsetPolar();
      // const offsetExpected = new PolarOffset(
      //   CartesianCoordinate.fromXY(-0.5, -1.5, Tolerance),
      //   CartesianCoordinate.fromXY(2, 1, Tolerance),
      //   Tolerance
      // );

      // expect(polarOffset).toEqual(offsetExpected);
    });
  });

  describe('LengthLinear', () => {
    it('should return the expected linear length', () => {
      const lengthLinear = RangeWithLimits.LengthLinear();
      const expectedLength = 3.535534;

      expect(lengthLinear).toBeCloseTo(expectedLength, 5);
    });
  });

  describe('LengthX', () => {
    it('should return the expected X length', () => {
      const lengthX = RangeWithLimits.LengthX();
      const expectedLength = 2.5;

      expect(lengthX).toBeCloseTo(expectedLength, 5);
    });
  });

  describe('LengthY', () => {
    it('should return the expected Y length', () => {
      const lengthY = RangeWithLimits.lengthY();
      const expectedLength = 2.5;

      expect(lengthY).toBeCloseTo(expectedLength, 5);
    });
  });

  describe('LengthRadius', () => {
    it('should return the expected radius length', () => {
      // const lengthRadius = RangeWithLimits.LengthRadius();
      // const expectedLength = 0.654929;

      // expect(lengthRadius).toBeCloseTo(expectedLength, 5);
    });
  });

  describe('LengthRotation', () => {
    it('should return the expected rotation length in degrees', () => {
      // const lengthRotation = RangeWithLimits.LengthRotation();
      // const expectedLengthDegrees = 135;

      // expect(lengthRotation.degrees).toBeCloseTo(expectedLengthDegrees, 5);
    });
  });

  describe('LengthRotationRadians', () => {
    it('should return the expected rotation length in radians', () => {
      // const lengthRotationRadians = RangeWithLimits.LengthRotationRadians();
      // const expectedLengthRadians = 3 * Numbers.PiOver4;

      // expect(lengthRotationRadians).toBeCloseTo(expectedLengthRadians, 5);
    });
  });

  describe('LengthRotationDegrees', () => {
    it('should return the expected rotation length in degrees', () => {
      // const lengthRotationDegrees = RangeWithLimits.LengthRotationDegrees();
      // const expectedLengthDegrees = 135;

      // expect(lengthRotationDegrees).toBeCloseTo(expectedLengthDegrees, 5);
    });
  });

  describe('validateRangeLimitRotationalHalfCirclePosition', () => {
    it('should do nothing if the position is inside the positive and negative half rotation', () => {
      const positions = [Numbers.Pi, -Numbers.Pi, Numbers.PiOver2, -Numbers.PiOver2, 0];

      positions.forEach((position) => {
        CurveRange.validateRangeLimitRotationalHalfCirclePosition(position, Tolerance);
        expect(true).toBeTruthy();
      });
    });

    it('should throw an ArgumentOutOfRangeException if the position is outside of the positive and negative half rotation', () => {
      const positions = [1.1 * Numbers.Pi, -1.1 * Numbers.Pi];

      positions.forEach((position) => {
        expect(() => CurveRange.validateRangeLimitRotationalHalfCirclePosition(position, Tolerance)).toThrowError();
      });
    });
  });

  describe('ValidateRangeLimitRotationalFullCirclePosition', () => {
    it('should do nothing if the position is inside a single positive rotation', () => {
      const positions = [0, Numbers.PiOver2, Numbers.Pi, Numbers.TwoPi];

      positions.forEach((position) => {
        CurveRange.validateRangeLimitRotationalFullCirclePosition(position, Tolerance);
        expect(true).toBeTruthy();
      });
    });

    it('should throw an ArgumentOutOfRangeException if the position is outside of a single positive rotation', () => {
      const positions = [-Numbers.Pi, -Numbers.PiOver2, 1.1 * Numbers.TwoPi, -0.1];

      positions.forEach((position) => {
        expect(() => CurveRange.validateRangeLimitRotationalFullCirclePosition(position, Tolerance)).toThrowError();
      });
    });
  });

  describe('ICloneable', () => {
    it('should clone the CurveRange and have the same start and end limits', () => {
      const startCoord = CartesianCoordinate.fromXY(-0.5, -1.5, Tolerance);
      const endCoord = CartesianCoordinate.fromXY(2, 1, Tolerance);

      expect(RangeWithLimits.start.Limit).toEqual(startCoord);
      expect(RangeWithLimits.end.Limit).toEqual(endCoord);

      const rangeClone = RangeWithLimits.clone() as CurveRange;

      expect(rangeClone.start.Limit).toEqual(startCoord);
      expect(rangeClone.end.Limit).toEqual(endCoord);
    });

    it('should clone the CurveRange using a different method and have the same start and end limits', () => {
      const startCoord = CartesianCoordinate.fromXY(-0.5, -1.5, Tolerance);
      const endCoord = CartesianCoordinate.fromXY(2, 1, Tolerance);

      expect(RangeWithLimits.start.Limit).toEqual(startCoord);
      expect(RangeWithLimits.end.Limit).toEqual(endCoord);

      const rangeClone = RangeWithLimits.clone();

      expect(rangeClone.start.Limit).toEqual(startCoord);
      expect(rangeClone.end.Limit).toEqual(endCoord);
    });
  });
});

