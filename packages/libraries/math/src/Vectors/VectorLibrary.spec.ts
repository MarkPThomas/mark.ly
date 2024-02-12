import { VectorLibrary } from './VectorLibrary';

describe('Vector Library Tests', () => {
  const Tolerance = 0.00001;

  describe('2D Vectors', () => {
    it.each`
      x1     | y1     | x2     | y2     | expectedResult
      ${0}   | ${0}   | ${1}   | ${0}   | ${1}
      ${0}   | ${0}   | ${0}   | ${1}   | ${1}
      ${0}   | ${0}   | ${1}   | ${1}   | ${1.414214}
      ${1}   | ${1}   | ${2}   | ${2}   | ${1.414214}
      ${-1}  | ${1}   | ${-2}  | ${2}   | ${1.414214}
      ${-1}  | ${-1}  | ${-2}  | ${-2}  | ${1.414214}
      ${1}   | ${-1}  | ${2}   | ${-2}  | ${1.414214}
    `('should calculate Magnitude($x1, $y1, $x2, $y2) as $expectedResult', ({ x1, y1, x2, y2, expectedResult }) => {
      const xComponent = x2 - x1;
      const yComponent = y2 - y1;
      expect(VectorLibrary.Magnitude(xComponent, yComponent)).toBeCloseTo(expectedResult, Tolerance);
    });

    it('should throw ArgumentException for Zero Magnitude', () => {
      expect(() => VectorLibrary.Magnitude(0, 0)).toThrow();
    });

    it.each`
      x1     | y1     | x2     | y2     | expectedResult
      ${0}   | ${0}   | ${0}   | ${0}   | ${0}
      ${1}   | ${0}   | ${1}   | ${0}   | ${1}
      ${1}   | ${1}   | ${1}   | ${1}   | ${2}
      ${1}   | ${2}   | ${3}   | ${4}   | ${11}
      ${-1}  | ${-2}  | ${-3}  | ${-4}  | ${11}
      ${1}   | ${-2}  | ${3}   | ${4}   | ${-5}
      ${1.1} | ${-2.2} | ${3.3} | ${4.4} | ${-6.05}
    `('should calculate DotProduct($x1, $y1, $x2, $y2) as $expectedResult', ({ x1, y1, x2, y2, expectedResult }) => {
      expect(VectorLibrary.DotProduct(x1, y1, x2, y2)).toBeCloseTo(expectedResult, Tolerance);
    });

    it.each`
      x1     | y1     | x2     | y2     | expectedResult
      ${0}   | ${0}   | ${0}   | ${0}   | ${0}
      ${1}   | ${0}   | ${1}   | ${0}   | ${0}
      ${1}   | ${1}   | ${1}   | ${1}   | ${0}
      ${1}   | ${2}   | ${3}   | ${4}   | ${-2}
      ${-1}  | ${-2}  | ${-3}  | ${-4}  | ${-2}
      ${1}   | ${-2}  | ${3}   | ${4}   | ${10}
      ${1.1} | ${-2.2} | ${3.3} | ${4.4} | ${12.1}
    `('should calculate CrossProduct($x1, $y1, $x2, $y2) as $expectedResult', ({ x1, y1, x2, y2, expectedResult }) => {
      expect(VectorLibrary.CrossProduct(x1, y1, x2, y2)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('3D Vectors', () => {
    it.each`
      x1     | y1     | z1     | x2     | y2     | z2     | expectedResult
      ${0}   | ${0}   | ${0}   | ${1}   | ${0}   | ${0}   | ${1}
      ${0}   | ${0}   | ${0}   | ${0}   | ${1}   | ${0}   | ${1}
      ${0}   | ${0}   | ${0}   | ${1}   | ${1}   | ${0}   | ${1.414214}
      ${1}   | ${1}   | ${0}   | ${2}   | ${2}   | ${0}   | ${1.414214}
      ${-1}  | ${1}   | ${0}   | ${-2}  | ${2}   | ${0}   | ${1.414214}
      ${-1}  | ${-1}  | ${0}   | ${-2}  | ${-2}  | ${0}   | ${1.414214}
      ${1}   | ${-1}  | ${0}   | ${2}   | ${-2}  | ${0}   | ${1.414214}
      ${1}   | ${0}   | ${1}   | ${2}   | ${0}   | ${2}   | ${1.414214}
      ${0}   | ${1}   | ${1}   | ${0}   | ${2}   | ${2}   | ${1.414214}
      ${1}   | ${1}   | ${1}   | ${2}   | ${2}   | ${2}   | ${1.732051}
    `('should calculate Magnitude3D($x1, $y1, $z1, $x2, $y2, $z2) as $expectedResult', ({ x1, y1, z1, x2, y2, z2, expectedResult }) => {
      const xComponent = x2 - x1;
      const yComponent = y2 - y1;
      const zComponent = z2 - z1;
      expect(VectorLibrary.Magnitude3D(xComponent, yComponent, zComponent)).toBeCloseTo(expectedResult, Tolerance);
    });

    it('should throw ArgumentException for Zero Magnitude', () => {
      expect(() => VectorLibrary.Magnitude3D(0, 0, 0)).toThrow();
    });

    it.each`
      x1     | y1     | z1     | x2     | y2     | z2     | expectedResult
      ${0}   | ${0}   | ${0}   | ${0}   | ${0}   | ${0}   | ${0}
      ${1}   | ${2}   | ${3}   | ${4}   | ${5}   | ${6}   | ${32}
      ${1}   | ${2}   | ${3}   | ${-4}  | ${-5}  | ${-6}  | ${-32}
      ${-1}  | ${-2}  | ${-3}  | ${4}   | ${5}   | ${6}   | ${-32}
      ${-1}  | ${-2}  | ${-3}  | ${-4}  | ${-5}  | ${-6}  | ${32}
      ${-1.1}| ${-2.2}| ${-3.3}| ${-4.4}| ${-5.5}| ${-6.6}| ${38.72}
    `('should calculate DotProduct3D($x1, $y1, $z1, $x2, $y2, $z2) as $expectedResult', ({ x1, y1, z1, x2, y2, z2, expectedResult }) => {
      expect(VectorLibrary.DotProduct3D(x1, y1, z1, x2, y2, z2)).toBeCloseTo(expectedResult, Tolerance);
    });

    it.each`
      x1     | y1     | z1     | x2     | y2     | z2     | xExpected | yExpected | zExpected
      ${0}   | ${0}   | ${0}   | ${0}   | ${0}   | ${0}   | ${0}      | ${0}      | ${0}
      ${1}   | ${2}   | ${3}   | ${4}   | ${5}   | ${6}   | ${-3}     | ${6}      | ${-3}
      ${1}   | ${2}   | ${3}   | ${-4}  | ${-5}  | ${-6}  | ${3}      | ${-6}     | ${3}
      ${-1}  | ${-2}  | ${-3}  | ${4}   | ${5}   | ${6}   | ${3}      | ${-6}     | ${3}
      ${-1}  | ${-2}  | ${-3}  | ${-4}  | ${-5}  | ${-6}  | ${-3}     | ${6}      | ${-3}
      ${1}   | ${-2}  | ${3}   | ${-4}  | ${5}   | ${-6}  | ${-3}     | ${-6}     | ${-3}
      ${7.7} | ${-2.2}| ${-3.3}| ${-4.4}| ${-5.5}| ${-6.6}| ${-3.63}  | ${36.3}   | ${32.67}
    `('should calculate CrossProduct3D($x1, $y1, $z1, $x2, $y2, $z2) as $xExpected, $yExpected, $zExpected',
      ({ x1, y1, z1, x2, y2, z2, xExpected, yExpected, zExpected }) => {
        const result = VectorLibrary.CrossProduct3D(x1, y1, z1, x2, y2, z2);
        expect(result[0]).toBeCloseTo(xExpected, Tolerance);
        expect(result[1]).toBeCloseTo(yExpected, Tolerance);
        expect(result[2]).toBeCloseTo(zExpected, Tolerance);
      });
  });
});
