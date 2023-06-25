export abstract class Heap {
  protected nodes: number[];
  protected maxSize: number | null;

  constructor(size: number | null = null) {
    this.nodes = [];
    this.maxSize = size;
  }

  poll() {
    return this.nodes[0];
  }

  size() {
    return this.nodes.length;
  }

  build(nums: number[]) {
    this.nodes = nums;
    for (let i = Math.floor(this.nodes.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  insert(val: number) {
    const targetIndex = this.nodes.push(val);
    this.heapifyUp(targetIndex);
    if (this.maxSize && this.nodes.length > this.maxSize) {
      this.nodes.pop();
    }
  }

  deleteRoot() {
    this.swap(0, this.nodes.length - 1);
    this.nodes.pop();
    this.heapifyDown(0);
  }

  protected heapifyUp(targetIndex: number) {
    let parentIndex = Math.floor((targetIndex - 1) / 2);
    if (parentIndex < 0 || !this.shouldSwap(parentIndex, targetIndex)) {
      return;
    }
    this.swap(parentIndex, targetIndex);
    this.heapifyUp(parentIndex);
  }

  protected heapifyDown(targetIndex: number) {
    let swapIndex = targetIndex;
    swapIndex = this.getSwapIndex(targetIndex, swapIndex, 1);
    swapIndex = this.getSwapIndex(targetIndex, swapIndex, 2);
    if (swapIndex === targetIndex) {
      return;
    }
    this.swap(targetIndex, swapIndex);
    this.heapifyDown(swapIndex);
  }

  protected getSwapIndex(parentIndex: number, swapIndex: number, child: number) {
    const childIndex = 2 * parentIndex + child;
    return childIndex < this.nodes.length && this.shouldSwap(parentIndex, childIndex)
      ? childIndex : swapIndex;
  }

  protected abstract shouldSwap(parentIndex: number, childIndex: number): boolean;

  protected swap(index1: number, index2: number) {
    const temp = this.nodes[index1];
    this.nodes[index1] = this.nodes[index2];
    this.nodes[index2] = temp;
  }
}