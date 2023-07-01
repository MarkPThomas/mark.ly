import { MaxHeap } from './HeapMax';

describe('#MaxHeap', () => {
  describe('poll', () => {
    it('should return undefined for an empty heap', () => {
      const maxHeap = new MaxHeap();
      expect(maxHeap.poll()).toBeNull();
    });

    it('should return root node', () => {

    });

    it('should not alter the root node when returning it\'s value', () => {

    });
  });

  describe('size', () => {
    it('should return 0 for a freshly initialized structure without data', () => {

    });

    it('should return the number of nodes in the data structure', () => {

    });

    it('should max out at the size limit set', () => {

    });
  });

  describe('build', () => {
    it('should construct a Max Heap', () => {

    });

    it('should construct a Max Heap of a size no greater than the size limit set', () => {

    });

    it('should replace the Max Heap with a new one if called a second time', () => {

    });

    it('should create an empty Max Heap if an empty array is provided', () => {

    });
  });

  describe('insert', () => {
    it('should insert a node to an empty heap such that it ends up as the root', () => {

    });

    it('should insert a max node such that it ends up as the root', () => {

    });

    it('should increase the size of a heap that is not full', () => {

    });

    it('should insert node while not inceasing size of a full heap', () => {

    });

    it('should heapify such that the node ends up in the appropriate position', () => {

    });

    it('should insert min node to a full heap such that heapifying leaves it out', () => {

    });
  });

  describe('deleteRoot', () => {
    it('should do nothing to an empty heap', () => {

    });

    it('should remove the root node from the root position', () => {

    });

    it('should reduce the size of the heap', () => {

    });

    it('should heapify the heap after deletion', () => {

    });
  });
})