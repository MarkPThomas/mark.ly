import { Time } from './Time';

describe('###Time', () => {
  describe('##Seconds', () => {
    describe('#toHours', () => {
      it('should convert a number in seconds to hours', () => {
        const hours = Time.Seconds.toHours(12345);
        expect(Math.abs(hours)).toBeCloseTo(3.43, 2);
      });
    });

    describe('#toMinutes', () => {
      it('should convert a number in seconds to minutes', () => {
        const minutes = Time.Seconds.toMinutes(90);
        expect(Math.abs(minutes)).toBeCloseTo(1.5, 1);
      });
    });
  });

  describe('##Minutes', () => {
    describe('#toSeconds', () => {
      it('should convert a number in minutes to seconds', () => {
        const seconds = Time.Minutes.toSeconds(2);
        expect(Math.abs(seconds)).toBeCloseTo(120, 0);
      });
    });

    describe('#toHours', () => {
      it('should convert a number in minutes to hours', () => {
        const hours = Time.Minutes.toHours(90);
        expect(Math.abs(hours)).toBeCloseTo(1.5, 1);
      });
    });
  });

  describe('##Hours', () => {
    describe('#toSeconds', () => {
      it('should convert a number in hours to seconds', () => {
        const seconds = Time.Hours.toSeconds(3.43);
        expect(Math.abs(seconds)).toBeCloseTo(12348, 0);
      });
    });

    describe('#toMinutes', () => {
      it('should convert a number in hours to minutes', () => {
        const minutes = Time.Hours.toMinutes(2);
        expect(Math.abs(minutes)).toBeCloseTo(120, 0);
      });
    });
  });
});