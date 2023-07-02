import { Heap } from './Heap';

export class MinHeap extends Heap {
  constructor(size: number | null = null) {
    super(size);
  }

  protected shouldSwap(swapIndex: number, targetIndex: number) {
    return this.nodes[swapIndex] > this.nodes[targetIndex];
  }
}