import { LinkedListDouble, NodeDouble } from './LinkedListDouble';

class NodeDoubleKeyVal<K> extends NodeDouble<K> {
  val: any;

  constructor(key: K, val: any) {
    super(key);
    this.val = val;
  }
}

export class LfuCache<K> {
  private capacity: number;
  private countMap: Map<K, number> = new Map<K, number>();
  private valueMap: Map<K, NodeDoubleKeyVal<K>> = new Map<K, NodeDoubleKeyVal<K>>();
  private countMapSorted: Map<number, LinkedListDouble<K>> = new Map<number, LinkedListDouble<K>>();

  constructor(capacity: number = 0) {
    this.capacity = capacity;
  }

  limit() {
    return this.capacity;
  }

  size() {
    return this.countMap.size;
  }

  toArray(): [number, any][] {
    const entries: [number, any][] = [];
    this.countMapSorted.forEach((items, count) => {
      entries.push([count, items.toArray()]);
    })
    return entries;
  }

  get(key: K) {
    if (!this.valueMap.has(key) || !this.countMap.has(key)) {
      return null;
    }

    const nodeToUse: NodeDoubleKeyVal<K> = this.valueMap.get(key)!;
    const count: number = this.countMap.get(key)!;

    this.countMapSorted.get(count)!.removeNode(nodeToUse);
    this.removeCountMapEntryListIfEmpty(count);
    this.countMap.delete(key);

    const newCount = count + 1;
    this.countMap.set(key, newCount);
    this.addToCountMapSorted(newCount, nodeToUse);

    return nodeToUse.val;
  }

  put(key: K, val: any) {
    if (this.capacity === 0) {
      return;
    }

    const node = new NodeDoubleKeyVal(key, val);
    if (this.valueMap.has(key)) {
      const nodeToUse: NodeDoubleKeyVal<K> = this.valueMap.get(key)!;
      const count: number = this.countMap.get(key)!;

      this.countMapSorted.get(count)!.removeNode(nodeToUse);
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
        const evictNode = this.countMapSorted.get(lowestCountKey)!.removeHead() as NodeDoubleKeyVal<K>;
        const evictKey = evictNode.val;
        this.removeCountMapEntryListIfEmpty(lowestCountKey);
        this.countMap.delete(evictKey);
        this.valueMap.delete(evictKey);
      }
      this.valueMap.set(key, node);
      this.countMap.set(key, 1);
      this.addToCountMapSorted(1, node);
    }
  }

  private addToCountMapSorted(key: number, node: NodeDoubleKeyVal<K>) {
    if (this.countMapSorted.has(key)) {
      this.countMapSorted.get(key)!.appendNode(node);
    } else {
      const linkedList = new LinkedListDouble<K>();
      linkedList.appendNode(node);
      this.countMapSorted.set(key, linkedList);
    }
  }

  private removeCountMapEntryListIfEmpty(count: number) {
    if (this.countMapSorted.get(count)!.size() === 0) {
      this.countMapSorted.delete(count);
    }
  }
}