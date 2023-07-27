import { MaxHeap } from './HeapMax';

describe('##MaxHeap', () => {
  describe('#size', () => {
    it('should return 0 for a freshly initialized structure without data', () => {
      const maxHeap = new MaxHeap<number>();
      expect(maxHeap.size()).toEqual(0);
    });

    it('should return the number of nodes in the data structure', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 6, 5, 4]);

      expect(maxHeap.size()).toEqual(6);

      maxHeap.insert(7);

      expect(maxHeap.size()).toEqual(7);
    });

    it('should max out at the size limit set', () => {
      const maxHeap = new MaxHeap<number>(3);
      maxHeap.build([1, 2, 3, 6, 5, 4]);

      expect(maxHeap.size()).toEqual(3);

      maxHeap.insert(7);

      expect(maxHeap.size()).toEqual(3);
    });
  });

  describe('#toArray', () => {
    it('should return an empty array for an empty heap', () => {
      const maxHeap = new MaxHeap<number>();

      expect(maxHeap.toArray()).toEqual([]);
    });

    it('should return an array of the nodes ordered in a breadth-first-search order', () => {
      const maxHeap = new MaxHeap<number>();
      const heapArray = [5, -1, 3, 9, 0, 6, -10, 50];

      maxHeap.build(heapArray)

      expect(maxHeap.toArray()).toEqual([50, 9, 6, 5, 0, 3, -10, -1]);
    });

  });

  describe('#poll', () => {
    it('should return null for an empty heap', () => {
      const maxHeap = new MaxHeap<number>();

      expect(maxHeap.poll()).toBeNull();
    });

    it('should return root node', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 4, 5, 6]);

      expect(maxHeap.poll()).toEqual(6);
    });

    it('should not alter the root node when returning it\'s value', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 7, 5, 4]);

      expect(maxHeap.size()).toEqual(6);

      expect(maxHeap.poll()).toEqual(7);
      expect(maxHeap.size()).toEqual(6);
      expect(maxHeap.poll()).toEqual(7);
    });
  });

  describe('#build', () => {
    it('should construct a Max Heap where root node is first value given', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([5, 1, 2]);

      expect(maxHeap.size()).toEqual(3);
      expect(maxHeap.poll()).toEqual(5);
    });

    it('should construct a Max Heap where root node is last value given', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 5]);

      expect(maxHeap.size()).toEqual(3);
      expect(maxHeap.poll()).toEqual(5);
    });

    it('should construct a Max Heap where root node is middle value given', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 5, 2]);

      expect(maxHeap.size()).toEqual(3);
      expect(maxHeap.poll()).toEqual(5);
    });

    it('should construct a Max Heap of a size no greater than the size limit set', () => {
      const maxHeap = new MaxHeap<number>(3);
      maxHeap.build([1, 2, 3, 6, 5, 4]);

      expect(maxHeap.size()).toEqual(3);
      expect(maxHeap.poll()).toEqual(6);
    });

    it('should replace the Max Heap with a new one if called a second time', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 5]);

      expect(maxHeap.size()).toEqual(3);
      expect(maxHeap.poll()).toEqual(5);

      maxHeap.build([6, 7, 9, 8]);

      expect(maxHeap.size()).toEqual(4);
      expect(maxHeap.poll()).toEqual(9);
    });

    it('should create an empty Max Heap if an empty array is provided', () => {
      const maxHeap = new MaxHeap<number>(3);
      maxHeap.build([1, 2, 3, 6, 5, 4]);

      expect(maxHeap.size()).toEqual(3);

      maxHeap.build([]);

      expect(maxHeap.size()).toEqual(0);
    });
  });

  describe('#insert', () => {
    it('should insert a node to an empty heap such that it ends up as the root', () => {
      const maxHeap = new MaxHeap<number>();

      maxHeap.insert(10);

      expect(maxHeap.size()).toEqual(1);
      expect(maxHeap.poll()).toEqual(10);
    });

    it('should insert a max node such that it ends up as the root', () => {
      const maxHeap = new MaxHeap<number>();

      maxHeap.build([1, 2, 3]);
      expect(maxHeap.poll()).toEqual(3);

      maxHeap.insert(10);
      expect(maxHeap.poll()).toEqual(10);
    });

    it('should increase the size of a heap that is not full', () => {
      const maxHeap = new MaxHeap<number>();

      maxHeap.build([1, 2, 3]);
      expect(maxHeap.size()).toEqual(3);

      maxHeap.insert(10);
      expect(maxHeap.size()).toEqual(4);
    });

    it('should insert node while not increasing size of a full heap', () => {
      const maxHeap = new MaxHeap<number>(3);

      maxHeap.build([1, 2, 3]);
      expect(maxHeap.size()).toEqual(3);

      maxHeap.insert(10);
      expect(maxHeap.size()).toEqual(3);

    });

    it('should heapify such that the node ends up in the appropriate position', () => {
      const maxHeap = new MaxHeap<number>();

      maxHeap.build([1, 2, 5]);

      maxHeap.insert(3);

      expect(maxHeap.toArray()).toEqual([5, 3, 1, 2])
    });

    it('should insert min node to a full heap such that heapifying leaves it out', () => {
      const maxHeap = new MaxHeap<number>(3);

      maxHeap.build([1, 2, 3]);

      maxHeap.insert(-1);

      expect(maxHeap.toArray()).toEqual([3, 2, 1])
    });
  });

  describe('#deleteRoot', () => {
    it('should do nothing to an empty heap and return null', () => {
      const maxHeap = new MaxHeap<number>();
      const result = maxHeap.deleteRoot();

      expect(result).toBeNull();
    });

    it('should remove the root node from the root position', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 7, 6, 4]);

      const originalRootValue = maxHeap.poll();
      const result = maxHeap.deleteRoot();

      expect(result).toEqual(originalRootValue);
      expect(maxHeap.poll()).not.toEqual(originalRootValue);
    });

    it('should reduce the size of the heap', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 7, 6, 4]);

      expect(maxHeap.size()).toEqual(6);

      maxHeap.deleteRoot();

      expect(maxHeap.size()).toEqual(5);
    });

    it('should heapify the heap after deletion', () => {
      const maxHeap = new MaxHeap<number>();
      maxHeap.build([1, 2, 3, 7, 6, 4]);

      expect(maxHeap.poll()).toEqual(7);

      maxHeap.deleteRoot();

      expect(maxHeap.poll()).toEqual(6);
    });
  });
})