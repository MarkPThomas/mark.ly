import { LfuCache } from './LfuCache';

describe('##LfuCache', () => {
  describe('#constructor', () => {
    it('should initialize the object with a capacity of 0 if not specified', () => {
      const cache = new LfuCache<number, any>();

      expect(cache.limit()).toEqual(0);
    });

    it('should initialize the object with the set capacity', () => {
      const cache = new LfuCache<number, any>(5);

      expect(cache.limit()).toEqual(5);
    });
  });

  describe('#limit', () => {
    it('should return 0 for an object with no capacity set', () => {
      const cache = new LfuCache<number, any>();

      expect(cache.limit()).toEqual(0);
    });

    it('should return the limit equal to the capacity set', () => {
      const cache = new LfuCache<number, any>(5);

      expect(cache.limit()).toEqual(5);
    });
  });

  describe('#size', () => {
    it('should return the current size of the cache', () => {
      const cache = new LfuCache<number, any>(5);

      expect(cache.size()).toEqual(0);

      cache.put(0, 'A');
      expect(cache.size()).toEqual(1);

      cache.put(1, 'A');
      expect(cache.size()).toEqual(2);
    });

    it('should max out at the limit specified for the cache', () => {
      const cache = new LfuCache<number, any>(3);

      expect(cache.size()).toEqual(0);

      cache.put(0, 'A');
      expect(cache.size()).toEqual(1);

      cache.put(1, 'A');
      expect(cache.size()).toEqual(2);

      cache.put(2, 'A');
      expect(cache.size()).toEqual(3);

      cache.put(3, 'A');
      expect(cache.size()).toEqual(3);
    });

    it('should not max out if capacty is not set (i.e. limit = 0)', () => {
      const cache = new LfuCache<number, any>();

      expect(cache.size()).toEqual(0);

      cache.put(0, 'A');
      expect(cache.size()).toEqual(1);

      cache.put(1, 'A');
      expect(cache.size()).toEqual(2);

      cache.put(2, 'A');
      expect(cache.size()).toEqual(3);

      cache.put(3, 'A');
      expect(cache.size()).toEqual(4);
    });
  });

  describe('#toArray', () => {
    it('should return an empty array for an empty cache', () => {
      const cache = new LfuCache<number, any>();

      expect(cache.toArray()).toEqual([]);
    });

    it('should return an array items in the current order present in the cache', () => {
      const cache = new LfuCache<number, any>();
      const values = ['A', 'B', 'C', 'D', 'E'];
      values.forEach((value, index) => {
        cache.put(index, value);
      })

      expect(cache.toArray()).toEqual([[1, ['E', 'D', 'C', 'B', 'A']]]);

      cache.get(2);

      expect(cache.toArray()).toEqual([[1, ['E', 'D', 'B', 'A']], [2, ['C']]]);
    });
  });

  describe('#get', () => {
    it('should return null for an empty cache', () => {

    });

    it('should return null if the item was never present in the cache', () => {

    });

    it('should return the item if it is present & increment its use count', () => {

      // TODO: Add comparison of array output for validating use count
    });

    it('should return null if the item was added & then later removed due to capacity constraints', () => {

    });
  });

  describe('#put', () => {
    it('should add a new item to the cache & increment its use count', () => {

      // TODO: Add comparison of array output for validating use count
    });

    it('should remove the least frequently used item if cache is full & adding a new item', () => {

    });

    it(`should remove the least recently used item of the least frequently used items in the
      event of a frequency tie, if cache is full & adding a new item`, () => {

    });

    it('should update an existing item to the cache & increment its use count', () => {

      // TODO: Add comparison of array output for validating use count
    });
  });
});