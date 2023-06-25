import { LinkedListDouble, NodeDouble } from './LinkedListDouble';

class NodeDoubleKeyVal<K> extends NodeDouble<K> {
  val: any;

  constructor(key: K, val: any) {
    super(key);
    this.val = val;
  }
}

export class LruCache<K> {
  private capacity = 0;
  private count = 0;
  private cache = new Map<K, NodeDoubleKeyVal<K>>();
  private list: LinkedListDouble<K>;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K) {
    const node: NodeDoubleKeyVal<K> | undefined = this.cache.get(key);
    if (node) {
      this.list.moveToHead(node);
      return node;
    }
    return -1;
  }

  put(key: K, val: any) {
    let node: NodeDoubleKeyVal<K> | undefined = this.cache.get(key);
    if (node) {
      node.val = val;
      this.list.moveToHead(node);
    } else {
      node = new NodeDoubleKeyVal(key, val);
      this.cache.set(key, node);
      this.list.prependNode(node);
      this.count++;
      if (this.count > this.capacity) {
        const tail = this.list.removeTail() as NodeDoubleKeyVal<K>;
        this.cache.delete(tail.key);
        this.count--;
      }
    }
  }
}