import { SumMean } from './SumMean';

describe('##SumMean', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const sum = new SumMean();

      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const sum = new SumMean(isConsidered);

      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should add the value', () => {
      const sum = new SumMean();

      sum.add(1);

      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(1);

      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);
    });

    it('should not add the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 4;

      const sum = new SumMean(isConsidered);

      sum.add(1);

      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);

      sum.add(5);

      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(5);

      sum.add(4);

      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(5);
    });
  });

  describe('#remove', () => {
    it('should remove the value', () => {
      const sum = new SumMean();
      sum.add(1);
      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);

      sum.remove(1);
      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(2);

      sum.remove(1);
      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(1);
    });

    it('should remove any value, even if not added', () => {
      const sum = new SumMean();
      sum.add(1);
      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);

      sum.remove(1.5);
      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(1.5);
    });

    it('should not remove the value if the current value count is 0', () => {
      const sum = new SumMean();
      sum.add(1);
      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);

      sum.remove(1);
      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(2);

      // Note: There can be remaining values once count is at 0, since any value can be removed
      sum.remove(1);
      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(1);

      sum.remove(1);
      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(1);
    });

    it('should not remove the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 4;

      const sum = new SumMean(isConsidered);
      sum.add(5);
      sum.add(6);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(11);

      sum.remove(1);
      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(11);

      sum.remove(5);
      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(6);

      sum.remove(6);
      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);
    });
  });

  describe('#mean', () => {
    it('should return the mean of the constant values provided', () => {
      const sum = new SumMean();
      sum.add(1);
      sum.add(1);

      const result = sum.mean();

      expect(result).toEqual(1);
    });

    it('should return the mean of the differing values provided', () => {
      const sum = new SumMean();
      sum.add(1);
      sum.add(2);

      const result = sum.mean();

      expect(result).toEqual(1.5);
    });

    it('should return 0 if no values were provided', () => {
      const sum = new SumMean();

      const result = sum.mean();

      expect(result).toEqual(0);
    });

    it('should return the mean of the total set of values provided at each add stage', () => {
      const sum = new SumMean();

      expect(sum.mean()).toEqual(0);

      sum.add(1);

      expect(sum.mean()).toEqual(1);

      sum.add(2);

      expect(sum.mean()).toEqual(1.5);

      sum.add(3);

      expect(sum.mean()).toEqual(2);

      sum.add(-2);

      expect(sum.mean()).toEqual(1);
    });

    it('should return the mean of the total set of values provided at each remove stage', () => {
      const sum = new SumMean();

      sum.add(1);
      sum.add(2);
      sum.add(5);

      expect(sum.mean()).toBeCloseTo(8 / 3, 3);

      sum.remove(2);

      expect(sum.mean()).toEqual(3);
    });
  });
});