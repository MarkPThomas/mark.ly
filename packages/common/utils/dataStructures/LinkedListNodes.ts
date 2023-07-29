export interface INode<V> {
  val: V;
  next: INode<V> | null;
  equals(value: V, cb: ((a: V, b: V) => boolean) | undefined): boolean;
  toObject(): any;
}
export class Node<V> implements INode<V>{
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

  toObject(): any {
    return {
      val: this.val
    }
  }
}


export interface INodeKeyVal<K, V> extends INode<V> {
  key: K;
}

export class NodeKeyVal<K, V> extends Node<V> implements INodeKeyVal<K, V> {
  key: K;

  constructor(key: K, val: V) {
    super(val);
    this.key = key;
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      key: this.key
    }
  }
}


export interface INodeDouble<V> extends INode<V> {
  prev: NodeDouble<V> | null;
  removeNode(): boolean;
}

export class NodeDouble<V> extends Node<V> implements INodeDouble<V>{
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


export interface INodeDoubleKeyVal<K, V> extends INodeDouble<V> {
  key: K;
}
export class NodeDoubleKeyVal<K, V> extends NodeDouble<V> implements INodeDoubleKeyVal<K, V>{
  key: K;

  constructor(key: K, val: V) {
    super(val);
    this.key = key;
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      key: this.key
    }
  }
}