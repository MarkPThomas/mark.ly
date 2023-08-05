import { Speed } from './Speed';

describe('##Speed', () => {
  describe('#metersPerSecondToKph', () => {
    it('should convert a number in meters per second to kilometers per hour', () => {
      const mps = Speed.metersPerSecondToKph(2.7);
      expect(Math.abs(mps - 9.7)).toBeLessThanOrEqual(0.1);
    });

    it('should convert a number in kilometers per hour to meters per second', () => {
      const mps = Speed.kphToMetersPerSecond(9.7);
      expect(Math.abs(mps - 2.7)).toBeLessThanOrEqual(0.1);
    });
  });

  describe('#kphToMph', () => {
    it('should convert a number in kilometers per hour to miles per hour', () => {
      const mph = Speed.kphToMph(100);
      expect(Math.abs(mph - 62.1)).toBeLessThanOrEqual(0.1);
    });
  });

  describe('#mphToKph', () => {
    it('should convert a number in miles per hour to kilometers per hour', () => {
      const kph = Speed.mphToKph(62.1);
      expect(Math.abs(kph - 100.0)).toBeLessThanOrEqual(0.1);
    });
  });
});