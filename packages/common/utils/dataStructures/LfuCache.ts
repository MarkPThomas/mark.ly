import { LinkedListDouble } from './LinkedListDouble';
import { NodeDoubleKeyVal } from './LinkedListNodes';

export type LfuCacheOutput<K, V> = { useCount: number, items: { key: K, value: V }[] };

export class LfuCache<K, V> {
  private capacity: number;
  private countMap: Map<K, number> = new Map<K, number>();
  private valueMap: Map<K, NodeDoubleKeyVal<K, V>> = new Map<K, NodeDoubleKeyVal<K, V>>();
  private countMapSorted: Map<number, LinkedListDouble<V>> = new Map<number, LinkedListDouble<V>>();

  constructor(capacity: number = 0) {
    this.capacity = capacity;
  }

  limit() {
    return this.capacity;
  }

  size() {
    return this.countMap.size;
  }

  toArray(): LfuCacheOutput<K, V>[] {
    const entries: LfuCacheOutput<K, V>[] = [];
    this.countMapSorted.forEach((items, count) => {
      entries.push({ useCount: count, items: items.toArray() });
    })

    return entries.sort((a: LfuCacheOutput<K, V>, b: LfuCacheOutput<K, V>) => a.useCount - b.useCount);
  }

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

  private addToCountMapSorted(key: number, node: NodeDoubleKeyVal<K, V>) {
    if (this.countMapSorted.has(key)) {
      this.countMapSorted.get(key)!.prepend(node);
    } else {
      const linkedList = new LinkedListDouble<V>();
      linkedList.prepend(node);
      this.countMapSorted.set(key, linkedList);
    }
  }

  private removeCountMapEntryListIfEmpty(count: number) {
    if (this.countMapSorted.get(count)!.size() === 0) {
      this.countMapSorted.delete(count);
    }
  }
}