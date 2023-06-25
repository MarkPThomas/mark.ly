import { Heap } from './Heap';

export class MaxHeap extends Heap {
  constructor(size: number | null = null) {
    super(size);
  }

  protected shouldSwap(parentIndex: number, childIndex: number) {
    return this.nodes[parentIndex] < this.nodes[childIndex];
  }
}