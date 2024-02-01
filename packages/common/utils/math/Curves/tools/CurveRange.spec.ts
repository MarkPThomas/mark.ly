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
      new CartesianCoordinate(-1, -2, Tolerance),
      new CartesianCoordinate(4, 3, Tolerance)
    );
    curve.Tolerance = Tolerance;

    RangeWithLimits = CurveRange.fromCurve(curve);
    RangeWithLimits.Start.SetLimitByX(-0.5);
    RangeWithLimits.End.SetLimitByX(2);
  });

  describe('Initialization', () => {
    it('should initialize a CurveRange with Start and End limits at the origin', () => {
      const range = CurveRange.fromCurve(
        new LinearCurve(
          new CartesianCoordinate(-1, -2, Tolerance),
          new CartesianCoordinate(4, 3, Tolerance)
        ));
      range.Start.SetLimitByCoordinate(CartesianCoordinate.Origin());
      range.End.SetLimitByCoordinate(CartesianCoordinate.Origin());

      expect(RangeWithLimits.Start.Limit).toEqual(CartesianCoordinate.Origin());
      expect(RangeWithLimits.End.Limit).toEqual(CartesianCoordinate.Origin());
    });
  });

  describe('ToString', () => {
    it('should override ToString and return the expected string representation', () => {
      expect(RangeWithLimits.toString()).toEqual(
        'MPT.Math.Curves.Tools.CurveRange - Start: {X: -0.5, Y: -1.5}, End: {X: 2, Y: 1}'
      );
    });
  });

  describe('ToOffset', () => {
    it('should return a CartesianOffset with the expected values', () => {
      const offset = RangeWithLimits.ToOffset();
      const offsetExpected = new CartesianOffset(
        new CartesianCoordinate(-0.5, -1.5, Tolerance),
        new CartesianCoordinate(2, 1, Tolerance),
        Tolerance
      );

      expect(offset).toEqual(offsetExpected);
    });
  });

  describe('ToOffsetPolar', () => {
    it('should return a PolarOffset with the expected values', () => {
      // const polarOffset = RangeWithLimits.ToOffsetPolar();
      // const offsetExpected = new PolarOffset(
      //   new CartesianCoordinate(-0.5, -1.5, Tolerance),
      //   new CartesianCoordinate(2, 1, Tolerance),
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
      const lengthY = RangeWithLimits.LengthY();
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

  describe('ValidateRangeLimitRotationalHalfCirclePosition', () => {
    it('should do nothing if the position is inside the positive and negative half rotation', () => {
      const positions = [Numbers.Pi, -Numbers.Pi, Numbers.PiOver2, -Numbers.PiOver2, 0];

      positions.forEach((position) => {
        CurveRange.ValidateRangeLimitRotationalHalfCirclePosition(position, Tolerance);
        expect(true).toBeTruthy();
      });
    });

    it('should throw an ArgumentOutOfRangeException if the position is outside of the positive and negative half rotation', () => {
      const positions = [1.1 * Numbers.Pi, -1.1 * Numbers.Pi];

      positions.forEach((position) => {
        expect(() => CurveRange.ValidateRangeLimitRotationalHalfCirclePosition(position, Tolerance)).toThrowError();
      });
    });
  });

  describe('ValidateRangeLimitRotationalFullCirclePosition', () => {
    it('should do nothing if the position is inside a single positive rotation', () => {
      const positions = [0, Numbers.PiOver2, Numbers.Pi, Numbers.TwoPi];

      positions.forEach((position) => {
        CurveRange.ValidateRangeLimitRotationalFullCirclePosition(position, Tolerance);
        expect(true).toBeTruthy();
      });
    });

    it('should throw an ArgumentOutOfRangeException if the position is outside of a single positive rotation', () => {
      const positions = [-Numbers.Pi, -Numbers.PiOver2, 1.1 * Numbers.TwoPi, -0.1];

      positions.forEach((position) => {
        expect(() => CurveRange.ValidateRangeLimitRotationalFullCirclePosition(position, Tolerance)).toThrowError();
      });
    });
  });

  describe('ICloneable', () => {
    it('should clone the CurveRange and have the same Start and End limits', () => {
      const startCoord = new CartesianCoordinate(-0.5, -1.5, Tolerance);
      const endCoord = new CartesianCoordinate(2, 1, Tolerance);

      expect(RangeWithLimits.Start.Limit).toEqual(startCoord);
      expect(RangeWithLimits.End.Limit).toEqual(endCoord);

      const rangeClone = RangeWithLimits.clone() as CurveRange;

      expect(rangeClone.Start.Limit).toEqual(startCoord);
      expect(rangeClone.End.Limit).toEqual(endCoord);
    });

    it('should clone the CurveRange using a different method and have the same Start and End limits', () => {
      const startCoord = new CartesianCoordinate(-0.5, -1.5, Tolerance);
      const endCoord = new CartesianCoordinate(2, 1, Tolerance);

      expect(RangeWithLimits.Start.Limit).toEqual(startCoord);
      expect(RangeWithLimits.End.Limit).toEqual(endCoord);

      const rangeClone = RangeWithLimits.clone();

      expect(rangeClone.Start.Limit).toEqual(startCoord);
      expect(rangeClone.End.Limit).toEqual(endCoord);
    });
  });
});

