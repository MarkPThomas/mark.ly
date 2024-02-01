import { TrigonometryLibrary } from './TrigonometryLibrary';
describe('TrigonometryLibrary', () => {
  const Tolerance = 0.00001;

  // TODO: Test multiples of n*pi

  describe('Sin', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${0}
      ${45}   | ${0.707107}
      ${90}   | ${1}
      ${135}  | ${0.707107}
      ${180}  | ${0}
      ${225}  | ${-0.707107}
      ${270}  | ${-1}
      ${315}  | ${-0.707107}
      ${360}  | ${0}
      ${30}   | ${0.5}
      ${60}   | ${0.866025}
      ${-45}  | ${-0.707107}
      ${-90}  | ${-1}
      ${-135} | ${-0.707107}
      ${-180} | ${0}
      ${-225} | ${0.707107}
      ${-270} | ${1}
      ${-315} | ${0.707107}
      ${-360} | ${0}
    `('should calculate sin($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Sin(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Cos', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${1}
      ${45}   | ${0.707107}
      ${90}   | ${0}
      ${135}  | ${-0.707107}
      ${180}  | ${-1}
      ${225}  | ${-0.707107}
      ${270}  | ${0}
      ${315}  | ${0.707107}
      ${360}  | ${1}
      ${30}   | ${0.866025}
      ${60}   | ${0.5}
      ${-45}  | ${0.707107}
      ${-90}  | ${0}
      ${-135} | ${-0.707107}
      ${-180} | ${-1}
      ${-225} | ${-0.707107}
      ${-270} | ${0}
      ${-315} | ${0.707107}
      ${-360} | ${1}
    `('should calculate cos($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Cos(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Tan', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${0}
      ${45}   | ${1}
      ${90}   | ${Infinity}
      ${135}  | ${-1}
      ${180}  | ${0}
      ${225}  | ${1}
      ${270}  | ${Infinity}
      ${315}  | ${-1}
      ${360}  | ${0}
      ${30}   | ${0.57735}
      ${60}   | ${1.73205}
      ${-45}  | ${-1}
      ${-90}  | ${-Infinity}
      ${-135} | ${1}
      ${-180} | ${0}
      ${-225} | ${-1}
      ${-270} | ${-Infinity}
      ${-315} | ${1}
      ${-360} | ${0}
    `('should calculate tan($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Tan(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('ArcSin', () => {
    it.each`
      ratio     | expectedResult
      ${1}      | ${1.570796}
      ${0.707107}| ${0.785398}
      ${0}      | ${0}
      ${-0.707107}| ${-0.785398}
      ${-1}     | ${-1.570796}
      ${0.447214}| ${0.463648}
      ${0.894427}| ${1.107149}
    `('should calculate ArcSin($ratio) as $expectedResult', ({ ratio, expectedResult }) => {
      expect(TrigonometryLibrary.ArcSin(ratio)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('ArcCos', () => {
    it.each`
      ratio     | expectedResult
      ${1}      | ${0}
      ${-0.707107}| ${2.356194}
      ${-1}     | ${3.141593}
      ${0}      | ${1.570796}
      ${0.707107}| ${0.785398}
      ${0.894427}| ${0.463648}
      ${0.447214}| ${1.107149}
    `('should calculate ArcCos($ratio) as $expectedResult', ({ ratio, expectedResult }) => {
      expect(TrigonometryLibrary.ArcCos(ratio)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('ArcTan', () => {
    it.each`
      ratio     | expectedResult
      ${1}      | ${0.785398}
      ${-1}     | ${-0.785398}
      ${0.5}    | ${0.463648}
      ${2}      | ${1.107149}
    `('should calculate ArcTan($ratio) as $expectedResult', ({ ratio, expectedResult }) => {
      expect(TrigonometryLibrary.ArcTan(ratio)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Sec', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${1}
      ${45}   | ${1.414214}
      ${90}   | ${Infinity}
      ${135}  | ${-1.414214}
      ${180}  | ${-1}
      ${225}  | ${-1.414214}
      ${270}  | ${-Infinity}
      ${315}  | ${1.414214}
      ${360}  | ${1}
      ${30}   | ${1.154701}
      ${60}   | ${2}
      ${-45}  | ${1.414214}
      ${-90}  | ${Infinity}
      ${-135} | ${-1.414214}
      ${-180} | ${-1}
      ${-225} | ${-1.414214}
      ${-270} | ${-Infinity}
      ${-315} | ${1.414214}
      ${-360} | ${1}
    `('should calculate Sec($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Sec(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Csc', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${Infinity}
      ${45}   | ${1.414214}
      ${90}   | ${1}
      ${135}  | ${1.414214}
      ${180}  | ${Infinity}
      ${225}  | ${-1.414214}
      ${270}  | ${-1}
      ${315}  | ${-1.414214}
      ${360}  | ${-Infinity}
      ${30}   | ${1.732051}
      ${60}   | ${0.57735}
      ${-45}  | ${-1}
      ${-90}  | ${-1}
      ${-135} | ${-1}
      ${-180} | ${-Infinity}
      ${-225} | ${1.414214}
      ${-270} | ${1}
      ${-315} | ${1.414214}
      ${-360} | ${Infinity}
    `('should calculate Csc($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Csc(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Cot', () => {
    it.each`
      degrees | expectedResult
      ${0}    | ${Infinity}
      ${45}   | ${1}
      ${90}   | ${0}
      ${135}  | ${-1}
      ${180}  | ${-Infinity}
      ${225}  | ${1}
      ${270}  | ${0}
      ${315}  | ${-1}
      ${360}  | ${-Infinity}
      ${30}   | ${1.732051}
      ${60}   | ${0.57735}
      ${-45}  | ${-1}
      ${-90}  | ${0}
      ${-135} | ${1}
      ${-180} | ${Infinity}
      ${-225} | ${-1}
      ${-270} | ${0}
      ${-315} | ${1}
      ${-360} | ${Infinity}
    `('should calculate Cot($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
      const radians = (degrees * Math.PI) / 180;
      expect(TrigonometryLibrary.Cot(radians)).toBeCloseTo(expectedResult, Tolerance);
    });
  });

  describe('Hyperbolics', () => {
    describe('SinH', () => {
      it.each`
        degrees | expectedResult
        ${0}    | ${0}
        ${45}   | ${0.868671}
        ${90}   | ${2.301299}
        ${135}  | ${5.227972}
        ${180}  | ${11.548739}
        ${225}  | ${25.367158}
        ${270}  | ${55.654398}
        ${315}  | ${122.073484}
        ${360}  | ${267.744894}
        ${30}   | ${0.547853}
        ${60}   | ${1.249367}
        ${-45}  | ${-0.868671}
        ${-90}  | ${-2.301299}
        ${-135} | ${-5.227972}
        ${-180} | ${-11.548739}
        ${-225} | ${-25.367158}
        ${-270} | ${-55.654398}
        ${-315} | ${-122.073484}
        ${-360} | ${-267.744894}
      `('should calculate SinH($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
        const radians = (degrees * Math.PI) / 180;
        expect(TrigonometryLibrary.SinH(radians)).toBeCloseTo(expectedResult, Tolerance);
      });
    });

    describe('CosH', () => {
      it.each`
        degrees | expectedResult
        ${0}    | ${1}
        ${45}   | ${1.324609}
        ${90}   | ${2.509178}
        ${135}  | ${5.322752}
        ${180}  | ${11.591953}
        ${225}  | ${25.386861}
        ${270}  | ${55.663381}
        ${315}  | ${122.077579}
        ${360}  | ${267.746761}
        ${30}   | ${1.140238}
        ${60}   | ${1.600287}
        ${-45}  | ${1.324609}
        ${-90}  | ${2.509178}
        ${-135} | ${5.322752}
        ${-180} | ${11.591953}
        ${-225} | ${25.386861}
        ${-270} | ${55.663381}
        ${-315} | ${122.077579}
        ${-360} | ${267.746761}
      `('should calculate CosH($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
        const radians = (degrees * Math.PI) / 180;
        expect(TrigonometryLibrary.CosH(radians)).toBeCloseTo(expectedResult, Tolerance);
      });
    });

    describe('TanH', () => {
      it.each`
        degrees | expectedResult
        ${0}    | ${0}
        ${45}   | ${0.655794}
        ${90}   | ${0.917152}
        ${135}  | ${0.982193}
        ${180}  | ${0.996272}
        ${225}  | ${0.999224}
        ${270}  | ${0.999839}
        ${315}  | ${0.999966}
        ${360}  | ${0.999993}
        ${30}   | ${0.480473}
        ${60}   | ${0.780714}
        ${-45}  | ${-0.655794}
        ${-90}  | ${-0.917152}
        ${-135} | ${-0.982193}
        ${-180} | ${-0.996272}
        ${-225} | ${-0.999224}
        ${-270} | ${-0.999839}
        ${-315} | ${-0.999966}
        ${-360} | ${-0.999993}
      `('should calculate TanH($degrees) as $expectedResult', ({ degrees, expectedResult }) => {
        const radians = (degrees * Math.PI) / 180;
        expect(TrigonometryLibrary.TanH(radians)).toBeCloseTo(expectedResult, Tolerance);
      });
    });
  });
});
