import { Heap } from './Heap';

export class MaxHeap<T> extends Heap<T> {
  constructor(size: number | null = null) {
    super(size);
  }

  protected shouldSwap(swapIndex: number, targetIndex: number) {
    return this.isLessThan(this.nodes[swapIndex], this.nodes[targetIndex]);
  }
}