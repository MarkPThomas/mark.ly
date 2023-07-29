import { MinHeap } from './HeapMin';

describe('##MinHeap', () => {
  describe('#build', () => {
    it('should construct a Min Heap where root node is first value given', () => {
      const minHeap = new MinHeap<number>();
      minHeap.build([1, 5, 2]);

      expect(minHeap.size()).toEqual(3);
      expect(minHeap.poll()).toEqual(1);
    });

    it('should construct a Min Heap where root node is last value given', () => {
      const minHeap = new MinHeap<number>();
      minHeap.build([5, 2, 1]);

      expect(minHeap.size()).toEqual(3);
      expect(minHeap.poll()).toEqual(1);
    });

    it('should construct a Min Heap where root node is middle value given', () => {
      const minHeap = new MinHeap<number>();
      minHeap.build([5, 1, 2]);

      expect(minHeap.size()).toEqual(3);
      expect(minHeap.poll()).toEqual(1);
    });

    it('should create a heap of custom objects by the comparison callback provided', () => {
      type Location = { distance: number, name: string }
      const maxHeap = new MinHeap<Location>();

      const cb = (a: Location, b: Location) => a.distance - b.distance;
      maxHeap.setComparisonCB(cb);

      const locations: Location[] = [
        { distance: 1, name: 'cerca' },
        { distance: 5, name: 'foo' },
        { distance: 2, name: 'bar' },
        { distance: 32, name: 'far' },
        { distance: 2.2, name: 'finisterre' }
      ];

      maxHeap.build(locations);
      expect(maxHeap.toArray()).toEqual([
        { distance: 1, name: 'cerca' },
        { distance: 2.2, name: 'finisterre' },
        { distance: 2, name: 'bar' },
        { distance: 32, name: 'far' },
        { distance: 5, name: 'foo' }
      ]);
    });
  });

  describe('#insert', () => {
    it('should insert a min node such that it ends up as the root', () => {
      const minHeap = new MinHeap<number>();

      minHeap.build([1, 2, 3]);
      expect(minHeap.poll()).toEqual(1);

      minHeap.insert(-1);
      expect(minHeap.poll()).toEqual(-1);
    });

    it('should heapify such that the node ends up in the appropriate position', () => {
      const minHeap = new MinHeap<number>();

      minHeap.build([1, 3, 5]);

      minHeap.insert(-1);

      expect(minHeap.toArray()).toEqual([-1, 1, 5, 3])
    });

    it(`should heapify custom objects by the comparison callback provided such that
      the object ends up in the appropriate position`, () => {
      type Location = { distance: number, name: string }
      const minHeap = new MinHeap<Location>();

      const cb = (a: Location, b: Location) => a.distance - b.distance;
      minHeap.setComparisonCB(cb);

      const locations: Location[] = [
        { distance: 1, name: 'cerca' },
        { distance: 5, name: 'foo' },
        { distance: 2, name: 'bar' },
        { distance: 32, name: 'far' },
        { distance: 2.2, name: 'finisterre' }
      ];

      minHeap.build(locations);
      minHeap.insert({ distance: 1.5, name: 'swapper' });

      expect(minHeap.toArray()).toEqual([
        { distance: 1, name: 'cerca' },
        { distance: 2.2, name: 'finisterre' },
        { distance: 1.5, name: 'swapper' },
        { distance: 32, name: 'far' },
        { distance: 5, name: 'foo' },
        { distance: 2, name: 'bar' }
      ]);
    });
  });
})