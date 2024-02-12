import { TimeStamp } from './TimeStamp';

describe('##TimeStamp', () => {
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should instantiate a new class with the provided timestamp', () => {
        const time = '2023-07-04T17:22:15Z';
        const timestamp = new TimeStamp(time);

        expect(timestamp.time).toEqual(time);
      })
    })
  })

  describe('Static Methods', () => {
    describe('#calcIntervalSec', () => {
      it('should return 0 for two empty timestamps', () => {
        const interval = TimeStamp.calcIntervalSec('', '');

        expect(interval).toEqual(0);
      });

      it('should return undefined for one empty timestamp', () => {
        const interval1 = TimeStamp.calcIntervalSec('2023-07-04T17:22:15Z', '');

        expect(interval1).toBeUndefined();

        const interval2 = TimeStamp.calcIntervalSec('', '2023-07-04T17:22:15Z');

        expect(interval2).toBeUndefined();
      });

      it('should return undefined for any ill-formed timestamp', () => {
        const interval1 = TimeStamp.calcIntervalSec('2023-07-04T17:22:15Z', 'Foo');

        expect(interval1).toBeUndefined();

        const interval2 = TimeStamp.calcIntervalSec('Foo', '2023-07-04T17:22:15Z');

        expect(interval2).toBeUndefined();
      });

      it('should return a positive number of time moving forward in milliseconds', () => {
        const interval = TimeStamp.calcIntervalSec('2023-07-04T17:22:15Z', '2023-07-04T17:22:35Z');

        expect(interval).toEqual(20);
      });

      it('should return a negative number of time moving backward in milliseconds', () => {
        const interval = TimeStamp.calcIntervalSec('2023-07-04T17:22:35Z', '2023-07-04T17:22:15Z');

        expect(interval).toEqual(-20);
      });
    });
  })
})
