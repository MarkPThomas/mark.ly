describe('#MaxHeap', () => {
  describe('poll', () => {
    it('should return undefined for an empty heap', () => {
      expect()
    });

    it('should return root node', () => {
      expect()
    });

    it('should not alter the root node when returning it\'s value', () => {
      expect()
    });
  });

  describe('size', () => {
    it('should return 0 for a freshly initialized structure without data', () => {
      expect()
    });

    it('should return the number of nodes in the data structure', () => {
      expect()
    });

    it('should max out at the size limit set', () => {
      expect()
    });
  });

  describe('build', () => {
    it('should construct a Max Heap', () => {
      expect()
    });

    it('should construct a Max Heap of a size no greater than the size limit set', () => {
      expect()
    });

    it('should replace the Max Heap with a new one if called a second time', () => {
      expect()
    });

    it('should create an empty Max Heap if an empty array is provided', () => {
      expect()
    });
  });

  describe('insert', () => {
    it('should insert a node to an empty heap such that it ends up as the root', () => {
      expect()
    });

    it('should insert a max node such that it ends up as the root', () => {
      expect()
    });

    it('should increase the size of a heap that is not full', () => {
      expect()
    });

    it('should insert node while not inceasing size of a full heap', () => {
      expect()
    });

    it('should heapify such that the node ends up in the appropriate position', () => {
      expect()
    });

    it('should insert min node to a full heap such that heapifying leaves it out', () => {
      expect()
    });
  });

  describe('deleteRoot', () => {
    it('should do nothing to an empty heap', () => {
      expect()
    });

    it('should remove the root node from the root position', () => {
      expect()
    });

    it('should reduce the size of the heap', () => {
      expect()
    });

    it('should heapify the heap after deletion', () => {
      expect()
    });
  });
})