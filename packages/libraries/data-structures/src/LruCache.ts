import { LinkedListDouble } from './LinkedListDouble';
import { NodeDoubleKeyVal } from './LinkedListNodes';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @typedef {LruCacheOutput}
 * @template K
 * @template V
 */
export type LruCacheOutput<K, V> = { key: K, value: V }[];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @class LruCache
 * @typedef {LruCache}
 * @template K
 * @template V
 */
export class LruCache<K, V> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {*}
 */
  private capacity;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {number}
 */
  private count = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {*}
 */
  private cache = new Map<K, NodeDoubleKeyVal<K, V>>();
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {LinkedListDouble<V>}
 */
  private list: LinkedListDouble<V> = new LinkedListDouble<V>();

  /**
 * Creates an instance of LruCache.
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @constructor
 * @param {number} [capacity=0]
 */
  constructor(capacity: number = 0) {
    this.capacity = capacity;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {*}
 */
  limit() {
    return this.capacity;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {number}
 */
  size() {
    return this.count;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {LruCacheOutput<K, V>}
 */
  toArray(): LruCacheOutput<K, V> {
    return this.list.toArray();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @param {K} key
 * @returns {V}
 */
  get(key: K) {
    const node: NodeDoubleKeyVal<K, V> | undefined = this.cache.get(key);
    if (node) {
      this.list.moveToHead(node);
      return node.val;
    }
    return null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @param {K} key
 * @param {*} val
 */
  put(key: K, val: any) {
    let node: NodeDoubleKeyVal<K, V> | undefined = this.cache.get(key);
    if (node) {
      node.val = val;
      this.list.moveToHead(node);
    } else {
      node = new NodeDoubleKeyVal(key, val);
      this.cache.set(key, node);
      this.list.prepend(node);
      this.count++;
      if (this.capacity > 0 && this.count > this.capacity) {
        const tail = this.list.removeTail() as NodeDoubleKeyVal<K, V>;
        this.cache.delete(tail.key);
        this.count--;
      }
    }
  }
}