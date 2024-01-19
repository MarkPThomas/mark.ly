import { Angle } from './Angle';

describe('###Angle', () => {

  describe('##Radians', () => {
    describe('#toDegrees', () => {
      it('should convert a number in radians to degrees', () => {
        const degrees = Angle.Radians.toDegrees(Math.PI / 2);
        expect(Math.abs(degrees)).toBeCloseTo(90, 1);
      });
    });

    describe('#toPercent', () => {
      it('should convert a number in radians to percent', () => {
        const percent = Angle.Radians.toPercent(Math.PI / 4);
        expect(Math.abs(percent)).toBeCloseTo(100);
      });
    });
  });

  describe('##Degrees', () => {
    describe('#toRadians', () => {
      it('should convert a number in degrees to radians', () => {
        const radians = Angle.Degrees.toRadians(180);
        expect(Math.abs(radians)).toBeCloseTo(Math.PI);
      });
    });

    describe('#toPercent', () => {
      it('should convert a number in degrees to percent', () => {
        const percent = Angle.Degrees.toPercent(45);
        expect(Math.abs(percent)).toBeCloseTo(100);
      });
    });
  });

  describe('##Percent', () => {
    describe('#toDegrees', () => {
      it('should convert a number in percent to degrees', () => {
        const degrees = Angle.Percent.toDegrees(100);
        expect(Math.abs(degrees)).toBeCloseTo(45);
      })
    });

    describe('#toRadians', () => {
      it('should convert a number in percent to radians', () => {
        const radians = Angle.Percent.toRadians(100);
        expect(Math.abs(radians)).toBeCloseTo(Math.PI / 4);
      })
    });
  });
});