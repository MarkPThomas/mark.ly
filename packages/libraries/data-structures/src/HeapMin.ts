import { Heap } from './Heap';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @class MinHeap
 * @typedef {MinHeap}
 * @template T
 * @extends {Heap<T>}
 */
export class MinHeap<T> extends Heap<T> {
  /**
 * Creates an instance of MinHeap.
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @constructor
 * @param {(number | null)} [size=null]
 */
  constructor(size: number | null = null) {
    super(size);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {number} swapIndex
 * @param {number} targetIndex
 * @returns {boolean}
 */
  protected shouldSwap(swapIndex: number, targetIndex: number) {
    return this.isGreaterThan(this.nodes[swapIndex], this.nodes[targetIndex]);
  }
}