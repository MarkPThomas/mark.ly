import { metersToFeet, metersToFeetRound, feetToMeters, feetToMetersRound } from './Conversion';

describe('##Conversion', () => {
  describe('#metersToFeet', () => {
    it('should convert a number in meters to feet', () => {
      const feet = metersToFeet(2.5);
      expect(Math.abs(feet - 8.2021)).toBeLessThanOrEqual(0.0001);
    })
  });

  describe('#metersToFeetRound', () => {
    it('should convert a number in meters to feet, rounded to the specified decimal', () => {
      expect(metersToFeetRound(2.5, 4)).toEqual('8.2021');
    })
  });

  describe('#metersToFeetRound', () => {
    it('should convert a number in meters to feet, rounded to the nearest integer by default', () => {
      expect(metersToFeetRound(2.5)).toEqual('8');
    })
  });

  describe('#feetToMeters', () => {
    it('should convert a number in feet to meters', () => {
      const meters = feetToMeters(13250);
      expect(Math.abs(meters - 4038.6)).toBeLessThanOrEqual(0.1);
    })
  });

  describe('#feetToMetersRound', () => {
    it('should convert a number in feet to meters, rounded to the specified decimal', () => {
      expect(feetToMetersRound(13250, 1)).toEqual('4038.6');
    })
  });

  describe('#feetToMetersRound', () => {
    it('should convert a number in feet to meters, rounded to the nearest integer by default', () => {
      expect(feetToMetersRound(13250)).toEqual('4039');
    })
  });
})