/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @interface IHeap
 * @typedef {IHeap}
 * @template T
 */
export interface IHeap<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {(T | null)}
 */
  poll(): T | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {T[]} nums
 */
  build(nums: T[]): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {T} val
 */
  insert(val: T): void;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {(T | null)}
 */
  deleteRoot(): T | null;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {number}
 */
  size(): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {(T[] | null)}
 */
  toArray(): T[] | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(a: T, b: T) => number} callBack
 */
  setComparisonCB(callBack: (a: T, b: T) => number): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @abstract
 * @class Heap
 * @typedef {Heap}
 * @template T
 * @implements {IHeap<T>}
 */
export abstract class Heap<T> implements IHeap<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @type {T[]}
 */
  protected nodes: T[];
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @type {(number | null)}
 */
  protected maxSize: number | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @type {((a: T, b: T) => number) | undefined}
 */
  protected callBack: ((a: T, b: T) => number) | undefined = undefined;

  /**
 * Creates an instance of Heap.
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @constructor
 * @param {(number | null)} [size=null]
 */
  constructor(size: number | null = null) {
    this.nodes = [];
    this.maxSize = size;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {*}
 */
  poll() {
    return this.nodes[0] ?? null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {*}
 */
  size() {
    return this.nodes.length;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {{}\}
 */
  toArray() {
    return [...this.nodes];
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {T[]} nums
 */
  build(nums: T[]) {
    this.nodes = [...nums];
    for (let i = Math.floor(this.nodes.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }

    if (this.maxSize && this.nodes.length > this.maxSize) {
      this.nodes = this.nodes.slice(0, this.maxSize);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {T} val
 */
  insert(val: T) {
    const targetIndex = this.nodes.push(val) - 1;
    this.heapifyUp(targetIndex);
    if (this.maxSize && this.nodes.length > this.maxSize) {
      this.nodes.pop();
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {*}
 */
  deleteRoot() {
    this.swap(0, this.nodes.length - 1);
    const root = this.nodes.pop();
    this.heapifyDown(0);

    return root ?? null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(a: T, b: T) => number} callBack
 */
  setComparisonCB(callBack: (a: T, b: T) => number): void {
    this.callBack = callBack;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {number} targetIndex
 */
  protected heapifyUp(targetIndex: number) {
    let parentIndex = Math.floor((targetIndex - 1) / 2);
    if (parentIndex < 0 || !this.shouldSwap(parentIndex, targetIndex)) {
      return;
    }
    this.swap(parentIndex, targetIndex);
    this.heapifyUp(parentIndex);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {number} targetIndex
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {number} parentIndex
 * @param {number} swapIndex
 * @param {number} child
 * @returns {number}
 */
  protected getSwapIndex(parentIndex: number, swapIndex: number, child: number) {
    const childIndex = 2 * parentIndex + child;
    return childIndex < this.nodes.length && this.shouldSwap(swapIndex, childIndex)
      ? childIndex : swapIndex;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @abstract
 * @param {number} swapIndex
 * @param {number} targetIndex
 * @returns {boolean}
 */
  protected abstract shouldSwap(swapIndex: number, targetIndex: number): boolean;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {number} index1
 * @param {number} index2
 */
  protected swap(index1: number, index2: number) {
    const temp = this.nodes[index1];
    this.nodes[index1] = this.nodes[index2];
    this.nodes[index2] = temp;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {T} a
 * @param {T} b
 * @returns {boolean}
 */
  protected isLessThan(a: T, b: T) {
    return this.callBack ? this.callBack(a, b) < 0 : a < b;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:21 PM
 *
 * @protected
 * @param {T} a
 * @param {T} b
 * @returns {boolean}
 */
  protected isGreaterThan(a: T, b: T) {
    return this.callBack ? this.callBack(a, b) > 0 : a > b;
  }
}