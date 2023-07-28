import { LinkedListDouble } from './LinkedListDouble';
import { NodeDoubleKeyVal } from './LinkedListNodes';


export class LruCache<K, V> {
  private capacity;
  private count = 0;
  private cache = new Map<K, NodeDoubleKeyVal<K, V>>();
  private list: LinkedListDouble<V> = new LinkedListDouble<V>();

  constructor(capacity: number = 0) {
    this.capacity = capacity;
  }

  limit() {
    return this.capacity;
  }

  size() {
    return this.count;
  }

  toArray() {
    return this.list.toArray();
  }

  get(key: K) {
    const node: NodeDoubleKeyVal<K, V> | undefined = this.cache.get(key);
    if (node) {
      this.list.moveToHead(node);
      return node.val;
    }
    return null;
  }

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