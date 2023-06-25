import { Heap } from './Heap';

export class MinHeap extends Heap {
  constructor(size: number | null = null) {
    super(size);
  }

  protected shouldSwap(parentIndex: number, childIndex: number) {
    return this.nodes[parentIndex] > this.nodes[childIndex];
  }
}