import { Heap } from './Heap';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @class MaxHeap
 * @typedef {MaxHeap}
 * @template T
 * @extends {Heap<T>}
 */
export class MaxHeap<T> extends Heap<T> {
  /**
 * Creates an instance of MaxHeap.
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @constructor
 * @param {(number | null)} [size=null]
 */
  constructor(size: number | null = null) {
    super(size);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @protected
 * @param {number} swapIndex
 * @param {number} targetIndex
 * @returns {boolean}
 */
  protected shouldSwap(swapIndex: number, targetIndex: number) {
    return this.isLessThan(this.nodes[swapIndex], this.nodes[targetIndex]);
  }
}