export class Node<V> {
  val: V;
  next: Node<V> | null = null;

  constructor(value: V) {
    this.val = value;
  }

  equals(value: V, cb: ((a: V, b: V) => boolean) | undefined = undefined) {
    if (cb) {
      return cb(this.val, value);
    } else {
      return this.val === value;
    }
  }
}

export class NodeDouble<V> extends Node<V> {
  prev: NodeDouble<V> | null = null;

  constructor(value: V) {
    super(value);
  }

  removeNode() {
    let isRemoved = false;
    const tempPrev = this.prev;
    if (this.prev) {
      this.prev.next = this.next;
      this.prev = null;
      isRemoved = true;
    }

    if (this.next) {
      (this.next as NodeDouble<V>).prev = tempPrev;
      this.next = null;
      isRemoved = true;
    }
    return isRemoved;
  }
}

export class NodeDoubleKeyVal<K, V> extends NodeDouble<V> {
  key: K;

  constructor(key: K, val: V) {
    super(val);
    this.key = key;
  }
}