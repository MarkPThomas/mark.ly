import { Length } from './Length';

describe('###Length', () => {

  describe('##Feet', () => {
    describe('#toMeters', () => {
      it('should convert a number in feet to meters', () => {
        const meters = Length.Feet.toMeters(13250);
        expect(Math.abs(meters - 4038.6)).toBeLessThanOrEqual(0.1);
      });
    });

    describe('#toMiles', () => {
      it('should convert a number in feet to miles', () => {
        const miles = Length.Feet.toMiles(13250);
        expect(Math.abs(miles - 2.51)).toBeLessThanOrEqual(0.01);
      });
    });
  });

  describe('##Miles', () => {
    describe('#toFeet', () => {
      it('should convert a number in miles to feet', () => {
        const feet = Length.Miles.toFeet(2.51);
        expect(Math.abs(feet - 13252.8)).toBeLessThanOrEqual(0.1);
      });
    });

    describe('#toKilometers', () => {
      it('should convert a number in miles to kilometers', () => {
        const kilometers = Length.Miles.toKilometers(2.51);
        expect(Math.abs(kilometers - 4.04)).toBeLessThanOrEqual(0.01);
      });
    });
  });

  describe('##Meters', () => {
    describe('#toFeet', () => {
      it('should convert a number in meters to feet', () => {
        const feet = Length.Meters.toFeet(2.5);
        expect(Math.abs(feet - 8.2021)).toBeLessThanOrEqual(0.0001);
      })
    });
  });

  describe('##Kilometers', () => {
    describe('#toMiles', () => {
      it('should convert a number in kilometers to miles', () => {
        const miles = Length.Kilometers.toMiles(4.04);
        expect(Math.abs(miles - 2.51)).toBeLessThanOrEqual(0.1);
      });
    });
  });
});