import { GeometryLibrary } from './your-module'; // Replace with the actual import path for your GeometryLibrary module

describe('Geometry Library Tests', () => {
  const Tolerance = 0.00001;

  describe('Parametric Representations', () => {
    it.each`
      xPrime  | yPrime  | expected
      ${2}    | ${0}    | ${0}
      ${2}    | ${4}    | ${2}
      ${-2}   | ${4}    | ${-2}
      ${2}    | ${-4}   | ${-2}
      ${-2}   | ${-4}   | ${2}
    `('should calculate SlopeParametric($xPrime, $yPrime) as $expected', ({ xPrime, yPrime, expected }) => {
      const result = GeometryLibrary.SlopeParametric(xPrime, yPrime);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      xPrime  | yPrime
      ${0}    | ${0}
      ${0}    | ${2}
    `('should throw DivideByZeroException when calculating SlopeParametric($xPrime, $yPrime)', ({ xPrime, yPrime }) => {
      expect(() => GeometryLibrary.SlopeParametric(xPrime, yPrime)).toThrow(DivideByZeroException);
    });

    it.each`
      xPrime        | yPrime        | xPrimeDouble  | yPrimeDouble  | expected
      ${2}          | ${0}          | ${0}          | ${0}          | ${0}
      ${0}          | ${2}          | ${0}          | ${0}          | ${0}
      ${2}          | ${4}          | ${0}          | ${0}          | ${0}
      ${2}          | ${4}          | ${2}          | ${0}          | ${-0.089443}
      ${2}          | ${4}          | ${0}          | ${2}          | ${0.044721}
      ${0}          | ${4}          | ${0}          | ${2}          | ${0}
      ${2}          | ${0}          | ${2}          | ${0}          | ${0}
      ${2}          | ${3}          | ${4}          | ${5}          | ${-0.042669}
      ${-2}         | ${3}          | ${-4}         | ${5}          | ${0.042669}
      ${2}          | ${-3}         | ${4}          | ${-5}         | ${0.042669}
    `('should calculate CurvatureParametric($xPrime, $yPrime, $xPrimeDouble, $yPrimeDouble) as $expected', ({ xPrime, yPrime, xPrimeDouble, yPrimeDouble, expected }) => {
      const result = GeometryLibrary.CurvatureParametric(xPrime, yPrime, xPrimeDouble, yPrimeDouble);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      xPrime        | yPrime        | xPrimeDouble  | yPrimeDouble
      ${0}          | ${0}          | ${0}          | ${0}
    `('should throw DivideByZeroException when calculating CurvatureParametric($xPrime, $yPrime, $xPrimeDouble, $yPrimeDouble)', ({ xPrime, yPrime, xPrimeDouble, yPrimeDouble }) => {
      expect(() => GeometryLibrary.CurvatureParametric(xPrime, yPrime, xPrimeDouble, yPrimeDouble)).toThrow(DivideByZeroException);
    });
  });

  describe('Graph of a Function', () => {
    it.each`
      yPrime  | expected
      ${0}    | ${0}
      ${2}    | ${2}
      ${-2}   | ${-2}
    `('should calculate SlopeGraph($yPrime) as $expected', ({ yPrime, expected }) => {
      const result = GeometryLibrary.SlopeGraph(yPrime);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      yPrime        | yPrimeDouble | expected
      ${0}          | ${0}         | ${0}
      ${2}          | ${0}         | ${0}
      ${0}          | ${2}         | ${2}
      ${2}          | ${4}         | ${0.357771}
      ${-2}         | ${4}         | ${0.357771}
      ${2}          | ${-4}        | ${-0.357771}
      ${-2}         | ${-4}        | ${-0.357771}
    `('should calculate CurvatureGraph($yPrime, $yPrimeDouble) as $expected', ({ yPrime, yPrimeDouble, expected }) => {
      const result = GeometryLibrary.CurvatureGraph(yPrime, yPrimeDouble);
      expect(result).toBeCloseTo(expected, Tolerance);
    });
  });

  describe('Polar Coordinates', () => {
    it.each`
      thetaRadians | radius | radiusPrime | expected
      ${0}         | ${0}   | ${2}        | ${0}
      ${0}         | ${1}   | ${2}        | ${0.5}
      ${2}         | ${3}   | ${4}        | ${-0.543827}
      ${-2}        | ${3}   | ${4}        | ${-4.594759}
      ${2}         | ${-3}  | ${-4}       | ${-0.543827}
    `('should calculate SlopePolar($thetaRadians, $radius, $radiusPrime) as $expected', ({ thetaRadians, radius, radiusPrime, expected }) => {
      const result = GeometryLibrary.SlopePolar(thetaRadians, radius, radiusPrime);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      thetaRadians | radius | radiusPrime
      ${0}         | ${0}   | ${0}
      ${0}         | ${0}   | ${2}
    `('should throw DivideByZeroException when calculating SlopePolar($thetaRadians, $radius, $radiusPrime)', ({ thetaRadians, radius, radiusPrime }) => {
      expect(() => GeometryLibrary.SlopePolar(thetaRadians, radius, radiusPrime)).toThrow(DivideByZeroException);
    });

    it.each`
      radius | radiusPrime | radiusPrimeDouble | expected
      ${2}   | ${0}        | ${0}              | ${0.5}
      ${0}   | ${2}        | ${3}              | ${1}
      ${2}   | ${3}        | ${4}              | ${0.298685}
      ${-2}  | ${3}        | ${4}              | ${0.640039}
      ${2}   | ${-3}       | ${4}              | ${0.298685}
      ${2}   | ${3}        | ${-4}             | ${0.640039}
    `('should calculate CurvaturePolar($radius, $radiusPrime, $radiusPrimeDouble) as $expected', ({ radius, radiusPrime, radiusPrimeDouble, expected }) => {
      const result = GeometryLibrary.CurvaturePolar(radius, radiusPrime, radiusPrimeDouble);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      radius | radiusPrime | radiusPrimeDouble
      ${0}   | ${0}        | ${0}
      ${0}   | ${0}        | ${2}
    `('should throw DivideByZeroException when calculating CurvaturePolar($radius, $radiusPrime, $radiusPrimeDouble)', ({ radius, radiusPrime, radiusPrimeDouble }) => {
      expect(() => GeometryLibrary.CurvaturePolar(radius, radiusPrime, radiusPrimeDouble)).toThrow(DivideByZeroException);
    });
  });

  describe('Implicit Curves', () => {
    it.each`
      Fx     | Fy     | expected
      ${0}   | ${2}   | ${0}
      ${2}   | ${4}   | ${-0.5}
      ${-2}  | ${4}   | ${0.5}
      ${2}   | ${-4}  | ${0.5}
      ${-2}  | ${-4}  | ${-0.5}
    `('should calculate SlopeImplicit($Fx, $Fy) as $expected', ({ Fx, Fy, expected }) => {
      const result = GeometryLibrary.SlopeImplicit(Fx, Fy);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      Fx     | Fy
      ${0}   | ${0}
      ${2}   | ${0}
    `('should throw DivideByZeroException when calculating SlopeImplicit($Fx, $Fy)', ({ Fx, Fy }) => {
      expect(() => GeometryLibrary.SlopeImplicit(Fx, Fy)).toThrow(DivideByZeroException);
    });

    it.each`
      Fx     | Fy     | Fxx   | Fxy   | Fyy   | expected
      ${2}   | ${0}   | ${0}  | ${0}  | ${0}  | ${0}
      ${0}   | ${2}   | ${4}  | ${5}  | ${6}  | ${0.768046}
      ${2}   | ${3}   | ${4}  | ${5}  | ${6}  | ${1.280077}
      ${-2}  | ${3}   | ${4}  | ${5}  | ${6}  | ${0.512031}
      ${2}   | ${3}   | ${4}  | ${5}  | ${6}  | ${0}
      ${2}   | ${6}   | ${4}  | ${3}  | ${2}  | ${0.316228}
    `('should calculate CurvatureImplicit($Fx, $Fy, $Fxx, $Fxy, $Fyy) as $expected', ({ Fx, Fy, Fxx, Fxy, Fyy, expected }) => {
      const result = GeometryLibrary.CurvatureImplicit(Fx, Fy, Fxx, Fxy, Fyy);
      expect(result).toBeCloseTo(expected, Tolerance);
    });

    it.each`
      Fx     | Fy     | Fxx   | Fxy   | Fyy
      ${0}   | ${0}   | ${0}  | ${0}  | ${0}
      ${0}   | ${0}   | ${4}  | ${5}  | ${6}
    `('should throw DivideByZeroException when calculating CurvatureImplicit($Fx, $Fy, $Fxx, $Fxy, $Fyy)', ({ Fx, Fy, Fxx, Fxy, Fyy }) => {
      expect(() => GeometryLibrary.CurvatureImplicit(Fx, Fy, Fxx, Fxy, Fyy)).toThrow(DivideByZeroException);
    });
  });
});
