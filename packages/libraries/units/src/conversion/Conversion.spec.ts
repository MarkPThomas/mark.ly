import { Conversion } from "./Conversion";
import { IUnits, eAngle, eLength, eTime } from "./baseUnits";

describe('##Conversion', () => {
  describe('#convertAngularSpeed', () => {
    it('should convert from Radians/Second to Degrees/Minute', () => {
      const radiansPerSecond = 1;

      const fromUnits = {
        angle: eAngle.radians,
        time: eTime.seconds
      }

      const toUnits = {
        angle: eAngle.degrees,
        time: eTime.minutes
      }

      const converter = new Conversion(toUnits as IUnits);

      const result = converter.convertAngularSpeed(radiansPerSecond, fromUnits as IUnits);

      expect(result).toBeCloseTo(3437.75, 2);
    });
  });

  describe('#convertSpeed', () => {
    it('should convert from Meters/Second to Miles/Hour', () => {
      const metersPerSecond = 1;

      const fromUnits = {
        length: eLength.meters,
        time: eTime.seconds
      }

      const toUnits = {
        length: eLength.miles,
        time: eTime.hours
      }

      const converter = new Conversion(toUnits as IUnits);

      const result = converter.convertSpeed(metersPerSecond, fromUnits as IUnits);

      expect(result).toBeCloseTo(2.23694, 5);
    });
  });

  describe('#convertLength', () => {
    it('should convert from Meters to Feet', () => {
      const meters = 1;

      const fromUnits = {
        length: eLength.meters
      }

      const toUnits = {
        length: eLength.feet
      }

      const converter = new Conversion(toUnits as IUnits);

      const result = converter.convertLength(meters, fromUnits as IUnits);

      expect(result).toBeCloseTo(3.28084, 5);
    });
  });

  describe('#convertTime', () => {
    it('should convert from Seconds to Minutes', () => {
      const seconds = 120;

      const fromUnits = {
        time: eTime.seconds
      }

      const toUnits = {
        time: eTime.minutes
      }

      const converter = new Conversion(toUnits as IUnits);

      const result = converter.convertTime(seconds, fromUnits as IUnits);

      expect(result).toBeCloseTo(2, 1);
    });
  });

  describe('#convertAngle', () => {
    it('should convert from Radians to Degrees', () => {
      const radians = Math.PI / 2;

      const fromUnits = {
        angle: eAngle.radians
      }

      const toUnits = {
        angle: eAngle.degrees
      }

      const converter = new Conversion(toUnits as IUnits);

      const result = converter.convertAngle(radians, fromUnits as IUnits);

      expect(result).toBeCloseTo(90, 1);
    });
  });
});