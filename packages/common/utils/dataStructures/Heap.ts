export interface IHeap<T> {
  poll(): T | null;
  build(nums: T[]): void;
  insert(val: T): void;
  deleteRoot(): T | null;

  size(): number;
  toArray(): T[] | null;
  // setComparisonCB(callback: (a: K, b: K) => boolean): void;
}

export abstract class Heap<T> implements IHeap<T> {
  protected nodes: T[];
  protected maxSize: number | null;

  constructor(size: number | null = null) {
    this.nodes = [];
    this.maxSize = size;
  }

  poll() {
    return this.nodes[0] ?? null;
  }

  size() {
    return this.nodes.length;
  }

  toArray() {
    return [...this.nodes];
  }

  build(nums: T[]) {
    this.nodes = [...nums];
    for (let i = Math.floor(this.nodes.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }

    if (this.maxSize && this.nodes.length > this.maxSize) {
      this.nodes = this.nodes.slice(0, this.maxSize);
    }
  }

  insert(val: T) {
    const targetIndex = this.nodes.push(val) - 1;
    this.heapifyUp(targetIndex);
    if (this.maxSize && this.nodes.length > this.maxSize) {
      this.nodes.pop();
    }
  }

  deleteRoot() {
    this.swap(0, this.nodes.length - 1);
    const root = this.nodes.pop();
    this.heapifyDown(0);

    return root ?? null;
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
    return childIndex < this.nodes.length && this.shouldSwap(swapIndex, childIndex)
      ? childIndex : swapIndex;
  }

  protected abstract shouldSwap(swapIndex: number, targetIndex: number): boolean;

  protected swap(index1: number, index2: number) {
    const temp = this.nodes[index1];
    this.nodes[index1] = this.nodes[index2];
    this.nodes[index2] = temp;
  }
}