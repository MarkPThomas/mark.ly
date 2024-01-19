import { Time } from './Time';

describe('###Time', () => {
  describe('##Seconds', () => {
    describe('#toMinutes', () => {
      it('should convert a number in seconds to minutes', () => {
        const minutes = Time.Seconds.toMinutes(90);
        expect(Math.abs(minutes)).toBeCloseTo(1.5, 1);
      });
    });

    describe('#toHours', () => {
      it('should convert a number in seconds to hours', () => {
        const hours = Time.Seconds.toHours(12345);
        expect(Math.abs(hours)).toBeCloseTo(3.43, 2);
      });
    });

    describe('#toDays', () => {
      it('should convert a number in seconds to days', () => {
        const days = Time.Seconds.toDays(86400);
        expect(Math.abs(days)).toBeCloseTo(1, 0);
      });
    });

    describe('#toWeeks', () => {
      it('should convert a number in seconds to weeks', () => {
        const weeks = Time.Seconds.toWeeks(604800);
        expect(Math.abs(weeks)).toBeCloseTo(1, 0);
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

    describe('#toDays', () => {
      it('should convert a number in minutes to days', () => {
        const days = Time.Minutes.toDays(1440);
        expect(Math.abs(days)).toBeCloseTo(1, 0);
      });
    });

    describe('#toWeeks', () => {
      it('should convert a number in minutes to weeks', () => {
        const weeks = Time.Minutes.toWeeks(10080);
        expect(Math.abs(weeks)).toBeCloseTo(1, 0);
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

    describe('#toDays', () => {
      it('should convert a number in hours to days', () => {
        const days = Time.Hours.toDays(24);
        expect(Math.abs(days)).toBeCloseTo(1, 0);
      });
    });

    describe('#toWeeks', () => {
      it('should convert a number in hours to weeks', () => {
        const weeks = Time.Hours.toWeeks(168);
        expect(Math.abs(weeks)).toBeCloseTo(1, 0);
      });
    });
  });

  describe('##Days', () => {
    describe('#toSeconds', () => {
      it('should convert a number in days to seconds', () => {
        const seconds = Time.Days.toSeconds(3);
        expect(Math.abs(seconds)).toBeCloseTo(259200, 0);
      });
    });

    describe('#toMinutes', () => {
      it('should convert a number in days to minutes', () => {
        const minutes = Time.Days.toMinutes(3);
        expect(Math.abs(minutes)).toBeCloseTo(4320, 0);
      });
    });

    describe('#toHours', () => {
      it('should convert a number in days to hours', () => {
        const hours = Time.Days.toHours(3);
        expect(Math.abs(hours)).toBeCloseTo(72, 0);
      });
    });

    describe('#toWeeks', () => {
      it('should convert a number in days to weeks', () => {
        const weeks = Time.Days.toWeeks(14);
        expect(Math.abs(weeks)).toBeCloseTo(2, 0);
      });
    });
  });

  describe('##Weeks', () => {
    describe('#toSeconds', () => {
      it('should convert a number in weeks to seconds', () => {
        const seconds = Time.Weeks.toSeconds(1);
        expect(Math.abs(seconds)).toBeCloseTo(604800, 0);
      });
    });

    describe('#toMinutes', () => {
      it('should convert a number in weeks to minutes', () => {
        const minutes = Time.Weeks.toMinutes(1);
        expect(Math.abs(minutes)).toBeCloseTo(10080, 0);
      });
    });

    describe('#toHours', () => {
      it('should convert a number in weeks to hours', () => {
        const minutes = Time.Weeks.toHours(1);
        expect(Math.abs(minutes)).toBeCloseTo(168, 0);
      });
    });

    describe('#toDays', () => {
      it('should convert a number in weeks to days', () => {
        const minutes = Time.Weeks.toDays(1);
        expect(Math.abs(minutes)).toBeCloseTo(7, 0);
      });
    });
  });
});