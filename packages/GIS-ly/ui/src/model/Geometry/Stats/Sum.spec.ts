import { Sum } from './Sum';

describe('##Sum', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const sum = new Sum();

      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const sum = new Sum(isConsidered);

      expect(sum.count).toEqual(0);
      expect(sum.value).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should add the value', () => {
      const sum = new Sum();

      sum.add(1);

      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(1);

      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);
    });

    it('should not add the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 4;

      const sum = new Sum(isConsidered);

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
      const sum = new Sum();
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
      const sum = new Sum();
      sum.add(1);
      sum.add(2);

      expect(sum.count).toEqual(2);
      expect(sum.value).toEqual(3);

      sum.remove(1.5);
      expect(sum.count).toEqual(1);
      expect(sum.value).toEqual(1.5);
    });

    it('should not remove the value if the current value count is 0', () => {
      const sum = new Sum();
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

      const sum = new Sum(isConsidered);
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

  describe('#average', () => {
    it('should return the average of the constant values provided', () => {
      const sum = new Sum();
      sum.add(1);
      sum.add(1);

      const result = sum.average();

      expect(result).toEqual(1);
    });

    it('should return the average of the differing values provided', () => {
      const sum = new Sum();
      sum.add(1);
      sum.add(2);

      const result = sum.average();

      expect(result).toEqual(1.5);
    });

    it('should return 0 if no values were provided', () => {
      const sum = new Sum();

      const result = sum.average();

      expect(result).toEqual(0);
    });
  });
});