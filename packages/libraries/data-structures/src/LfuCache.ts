import { LinkedListDouble } from './LinkedListDouble';
import { NodeDoubleKeyVal } from './LinkedListNodes';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @typedef {LfuCacheOutput}
 * @template K
 * @template V
 */
export type LfuCacheOutput<K, V> = { useCount: number, items: { key: K, value: V }[] };

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @class LfuCache
 * @typedef {LfuCache}
 * @template K
 * @template V
 */
export class LfuCache<K, V> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {number}
 */
  private capacity: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {Map<K, number>}
 */
  private countMap: Map<K, number> = new Map<K, number>();
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {Map<K, NodeDoubleKeyVal<K, V>>}
 */
  private valueMap: Map<K, NodeDoubleKeyVal<K, V>> = new Map<K, NodeDoubleKeyVal<K, V>>();
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @type {Map<number, LinkedListDouble<V>>}
 */
  private countMapSorted: Map<number, LinkedListDouble<V>> = new Map<number, LinkedListDouble<V>>();

  /**
 * Creates an instance of LfuCache.
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
 * @returns {number}
 */
  limit() {
    return this.capacity;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {*}
 */
  size() {
    return this.countMap.size;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {LfuCacheOutput<K, V>[]}
 */
  toArray(): LfuCacheOutput<K, V>[] {
    const entries: LfuCacheOutput<K, V>[] = [];
    this.countMapSorted.forEach((items, count) => {
      entries.push({ useCount: count, items: items.toArray() });
    })

    return entries.sort((a: LfuCacheOutput<K, V>, b: LfuCacheOutput<K, V>) => a.useCount - b.useCount);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @param {K} key
 * @returns {V}
 */
  get(key: K) {
    if (!this.valueMap.has(key) || !this.countMap.has(key)) {
      return null;
    }

    const nodeToUse: NodeDoubleKeyVal<K, V> = this.valueMap.get(key)!;
    const count: number = this.countMap.get(key)!;

    this.countMapSorted.get(count)!.remove(nodeToUse);
    this.removeCountMapEntryListIfEmpty(count);
    this.countMap.delete(key);

    const newCount = count + 1;
    this.countMap.set(key, newCount);
    this.addToCountMapSorted(newCount, nodeToUse);

    return nodeToUse.val;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @param {K} key
 * @param {*} val
 */
  put(key: K, val: any) {
    const node = new NodeDoubleKeyVal(key, val);
    if (this.valueMap.has(key)) {
      const nodeToUse: NodeDoubleKeyVal<K, V> = this.valueMap.get(key)!;
      const count: number = this.countMap.get(key)!;

      this.countMapSorted.get(count)!.remove(nodeToUse);
      this.removeCountMapEntryListIfEmpty(count);
      this.valueMap.delete(key);
      this.countMap.delete(key);

      const newCount = count + 1;
      this.valueMap.set(key, node);
      this.countMap.set(key, newCount);
      this.addToCountMapSorted(newCount, node);
    } else {
      if (this.capacity > 0 && this.valueMap.size === this.capacity) {
        const lowestCountKey = [...this.countMapSorted.entries()].sort((a, b) => a[0] - b[0])[0][0];
        const evictNode = this.countMapSorted.get(lowestCountKey)!.removeTail() as NodeDoubleKeyVal<K, V>;
        const evictKey = evictNode.key;
        this.removeCountMapEntryListIfEmpty(lowestCountKey);
        this.countMap.delete(evictKey);
        this.valueMap.delete(evictKey);
      }
      this.valueMap.set(key, node);
      this.countMap.set(key, 1);
      this.addToCountMapSorted(1, node);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @param {number} key
 * @param {NodeDoubleKeyVal<K, V>} node
 */
  private addToCountMapSorted(key: number, node: NodeDoubleKeyVal<K, V>) {
    if (this.countMapSorted.has(key)) {
      this.countMapSorted.get(key)!.prepend(node);
    } else {
      const linkedList = new LinkedListDouble<V>();
      linkedList.prepend(node);
      this.countMapSorted.set(key, linkedList);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @private
 * @param {number} count
 */
  private removeCountMapEntryListIfEmpty(count: number) {
    if (this.countMapSorted.get(count)!.size() === 0) {
      this.countMapSorted.delete(count);
    }
  }
}