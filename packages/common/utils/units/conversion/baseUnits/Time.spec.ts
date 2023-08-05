import { Time } from './Time';

describe('##Time', () => {
  describe('#secondsToHours', () => {
    it('should convert a number in seconds to hours', () => {
      const hours = Time.secondsToHours(12345);
      expect(Math.abs(hours - 3.43)).toBeLessThanOrEqual(0.01);
    });
  });

  describe('#hoursToSeconds', () => {
    it('should convert a number in hours to seconds', () => {
      const seconds = Time.hoursToSeconds(3.43);
      expect(Math.abs(seconds - 12348)).toBeLessThanOrEqual(0.1);
    });
  });
});