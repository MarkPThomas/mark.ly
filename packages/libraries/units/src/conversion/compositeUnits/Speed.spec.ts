import { Speed } from './Speed';

describe('##Speed', () => {
  describe('from meters per second', () => {
    describe('#metersPerSecondToKph', () => {
      it('should convert a number in meters per second to kilometers per hour', () => {
        const kph = Speed.MetersPerSecond.toKph(2.7);

        expect(kph).toBeCloseTo(9.7, 1);
      });
    });

    describe('#metersPerSecondToMph', () => {
      it('should convert a number in meters per second to miles per hour', () => {
        const mph = Speed.MetersPerSecond.toMph(2.2352);

        expect(mph).toBeCloseTo(5, 4);
      });
    });

    describe('#metersPerSecondToFeetPerSecond', () => {
      it('should convert a number in meters per second to feet per second', () => {
        const fps = Speed.MetersPerSecond.toFeetPerSecond(5);

        expect(fps).toBeCloseTo(16.4, 1);
      });
    });

    describe('#metersPerSecondToFeetPerHour', () => {
      it('should convert a number in meters per second to feet per hour', () => {
        const fph = Speed.MetersPerSecond.toFeetPerHour(0.0846667);

        expect(fph).toBeCloseTo(1000, 1);
      });
    });

  });

  describe('from feet per second', () => {
    describe('#feetPerSecondToMetersPerSecond', () => {
      it('should convert a number in feet per second to meters per second', () => {
        const fps = Speed.FeetPerSecond.toMetersPerSecond(16.4);

        expect(fps).toBeCloseTo(5, 1);
      });
    });
  });

  describe('from feet per hour', () => {
    describe('#feetPerHourToMetersPerSecond', () => {
      it('should convert a number in feet per hour to meters per second', () => {
        const mps = Speed.FeetPerHour.toMetersPerSecond(1000);

        expect(mps).toBeCloseTo(0.0847, 4);
      });
    });
  });

  describe('from kilometers per hour', () => {
    describe('#kphToMetersPerSecond', () => {
      it('should convert a number in kilometers per hour to meters per second', () => {
        const mps = Speed.KilometersPerHour.toMetersPerSecond(9.7);

        expect(mps).toBeCloseTo(2.7, 1);
      });
    });

    describe('#kphToMph', () => {
      it('should convert a number in kilometers per hour to miles per hour', () => {
        const mph = Speed.KilometersPerHour.toMph(100);

        expect(mph).toBeCloseTo(62.1, 1);
      });
    });
  });

  describe('from miles per hour', () => {
    describe('#mphToMetersPerSecond', () => {
      it('should convert a number in miles per hour to meters per second', () => {
        const mps = Speed.MilesPerHour.toMetersPerSecond(5);

        expect(mps).toBeCloseTo(2.2352, 4);
      });
    });

    describe('#mphToKph', () => {
      it('should convert a number in miles per hour to kilometers per hour', () => {
        const kph = Speed.MilesPerHour.toKph(62.1371);

        expect(kph).toBeCloseTo(100.0, 1);
      });
    });

  });
});