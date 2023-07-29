import { LruCache } from './LruCache';

describe('##LruCache', () => {
  describe('#constructor', () => {
    it('should initialize the object with a capacity of 0 if not specified', () => {
      const cache = new LruCache<number, any>();

      expect(cache.limit()).toEqual(0);
    });

    it('should initialize the object with the set capacity', () => {
      const cache = new LruCache<number, any>(5);

      expect(cache.limit()).toEqual(5);
    });
  });

  describe('#limit', () => {
    it('should return 0 for an object with no capacity set', () => {
      const cache = new LruCache<number, any>();

      expect(cache.limit()).toEqual(0);
    });

    it('should return the limit equal to the capacity set', () => {
      const cache = new LruCache<number, any>(5);

      expect(cache.limit()).toEqual(5);
    });
  });

  describe('#size', () => {
    it('should return the current size of the cache', () => {
      const cache = new LruCache<number, any>(5);

      expect(cache.size()).toEqual(0);

      cache.put(0, 'A');
      expect(cache.size()).toEqual(1);

      cache.put(1, 'A');
      expect(cache.size()).toEqual(2);
    });

    it('should max out at the limit specified for the cache', () => {
      const cache = new LruCache<number, any>(3);

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
      const cache = new LruCache<number, any>();

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
      const cache = new LruCache<number, any>();

      expect(cache.toArray()).toEqual([]);
    });

    it('should return an array items in the current order present in the cache', () => {
      const cache = new LruCache<number, any>();
      const values = ['A', 'B', 'C', 'D', 'E'];
      values.forEach((value, index) => {
        cache.put(index, value);
      })

      expect(cache.toArray()).toEqual(['E', 'D', 'C', 'B', 'A']);

      cache.get(2);

      expect(cache.toArray()).toEqual(['C', 'E', 'D', 'B', 'A']);
    });
  });

  describe('#get', () => {
    it('should return null for an empty cache', () => {
      const cache = new LruCache<number, any>();
      expect(cache.get(0)).toBeNull();
    });

    it('should return null if the item was never present in the cache', () => {
      const cache = new LruCache<number, any>();
      cache.put(0, 'A');
      cache.put(2, 'B');
      cache.put(4, 'C');

      expect(cache.get(1)).toBeNull();
    });

    it('should return the item if it is present & set it to the most recently used', () => {
      const cache = new LruCache<number, any>();
      cache.put(0, 'A');
      cache.put(2, 'B');
      cache.put(4, 'C');

      expect(cache.get(2)).toEqual('B');
      // TODO: Add comparison of array output for validating most recently used
    });

    it('should return null if the item was added & then later removed due to capacity constraints', () => {
      const cache = new LruCache<number, any>(3);
      cache.put(0, 'A');
      cache.put(2, 'B');
      cache.put(4, 'C');

      // TODO: Add comparison of array output for validating most recently used
      expect(cache.get(2)).toEqual('B');
      expect(cache.get(0)).toEqual('A');
      expect(cache.get(4)).toEqual('C');

      cache.put(1, 'D');

      // TODO: Add comparison of array output for validating most recently used
      expect(cache.get(2)).toBeNull();
    });
  });

  describe('#put', () => {
    it('should add a new item to the cache & set it to the most recently used', () => {
      const cache = new LruCache<number, any>();

      cache.put(0, 'A');
      // TODO: Replace with comparison of array output for validating most recently used
      expect(cache.get(0)).toEqual('A');

      cache.put(1, 'B');
      // TODO: Replace with comparison of array output for validating most recently used
      expect(cache.get(1)).toEqual('B');

      cache.put(2, 'C');
      // TODO: Replace with comparison of array output for validating most recently used
      expect(cache.get(2)).toEqual('C');
    });

    it('should remove the least recently used item if cache is full & adding a new item', () => {
      const cache = new LruCache<number, any>(3);
      cache.put(0, 'A');
      cache.put(1, 'B');
      cache.put(2, 'C');
      // TODO: Add comparison of array output for validating state

      cache.put(3, 'D');
      // TODO: Add comparison of array output for validating state
      expect(cache.get(0)).toBeNull();
    });

    it('should update an existing item to the cache & set it to the most recently used', () => {
      const cache = new LruCache<number, any>();
      cache.put(0, 'A');
      cache.put(1, 'B');
      cache.put(2, 'C');

      cache.put(1, 'Updated')
      // TODO: Replace with comparison of array output for validating most recently used
      expect(cache.get(1)).toEqual('Updated');
    });
  });
});