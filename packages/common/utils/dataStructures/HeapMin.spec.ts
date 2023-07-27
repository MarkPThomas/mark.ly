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
  });
})