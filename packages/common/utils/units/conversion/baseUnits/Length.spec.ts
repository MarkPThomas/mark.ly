import { Length } from './Length';

describe('###Length', () => {

  describe('##Feet', () => {
    describe('#toMeters', () => {
      it('should convert a number in feet to meters', () => {
        const meters = Length.Feet.toMeters(13250);
        expect(Math.abs(meters)).toBeCloseTo(4038.6, 1);
      });
    });

    describe('#toMiles', () => {
      it('should convert a number in feet to miles', () => {
        const miles = Length.Feet.toMiles(13250);
        expect(Math.abs(miles)).toBeCloseTo(2.51, 2);
      });
    });
  });

  describe('##Miles', () => {
    describe('#toFeet', () => {
      it('should convert a number in miles to feet', () => {
        const feet = Length.Miles.toFeet(2.51);
        expect(Math.abs(feet)).toBeCloseTo(13252.8, 1);
      });
    });

    describe('#toKilometers', () => {
      it('should convert a number in miles to kilometers', () => {
        const kilometers = Length.Miles.toKilometers(2.51);
        expect(Math.abs(kilometers)).toBeCloseTo(4.04, 2);
      });
    });
  });

  describe('##Meters', () => {
    describe('#toFeet', () => {
      it('should convert a number in meters to feet', () => {
        const feet = Length.Meters.toFeet(2.5);
        expect(Math.abs(feet)).toBeCloseTo(8.2021, 4);
      })
    });
  });

  describe('##Kilometers', () => {
    describe('#toMiles', () => {
      it('should convert a number in kilometers to miles', () => {
        const miles = Length.Kilometers.toMiles(4.04);
        expect(Math.abs(miles)).toBeCloseTo(2.51, 2);
      });
    });
  });
});