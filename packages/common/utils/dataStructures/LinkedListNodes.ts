import { ICloneable, IEquatable } from "../../interfaces";

export interface INode<V> extends ICloneable<INode<V>> {
  val: V;
  next: INode<V> | null;
  /**
   * Determines if the current node is equal to the provided value.
   *
   * @param {V} value Value may be a primitive or a more complex object.
   * @param {(((a: V, b: V) => boolean) | undefined)} cb Callback by which equality is determined.
   *
   * If undefined and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean}
   * @memberof INode
   */
  equals(value: V, cb: ((a: V, b: V) => boolean) | undefined): boolean;

  /**
   * Returns an object with specified properties and values that represent the node.
   * Base case includes only val.
   *
   * @return {*}  {*}
   * @memberof INode
   */
  toObject(): any;

  /**
   * Returns the length from the current node to the last linked node.
   *
   * @return {*}  null
   * @memberof INode
   */
  lengthNext(): number;
}

export class Node<V> implements INode<V>{
  val: V;
  next: Node<V> | null = null;

  constructor(value: V) {
    this.val = value;
  }

  equals(value: V, cb: ((a: V, b: V) => boolean) | undefined = undefined): boolean {
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

  clone(): Node<V> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<V>).clone();
    }

    return new Node(val);
  }

  lengthNext(): number {
    let count = 0;
    let currNode: Node<V> = this;
    while (currNode) {
      count++;
      currNode = currNode.next as Node<V>;
    }
    return count;
  }
}


export interface INodeKeyVal<K, V> extends INode<V> {
  /**
   * Unique key by which the value of the node can be referenced.
   *
   * @type {K}
   * @memberof INodeKeyVal
   */
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

  clone(): NodeKeyVal<K, V> {
    let key = this.key;
    if (key && typeof key === "object" && 'clone' in key) {
      key = (key as unknown as ICloneable<K>).clone();
    }

    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<V>).clone();
    }

    return new NodeKeyVal<K, V>(key, val);
  }
}


export interface INodeDouble<V> extends INode<V> {
  prev: NodeDouble<V> | null;
  removeNode(): boolean;
  /**
   * Returns the length from the current node to the first linked node.
   *
   * @return {*}  null
   * @memberof INode
   */
  lengthPrev(): number;
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



  lengthPrev(): number {
    let count = 0;
    let currNode: NodeDouble<V> = this;
    while (currNode) {
      count++;
      currNode = currNode.prev as NodeDouble<V>;
    }
    return count;
  }


  clone(): NodeDouble<V> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<V>).clone();
    }

    return new NodeDouble(val);
  }
}


export interface INodeDoubleKeyVal<K, V> extends INodeDouble<V> {
  /**
   * Unique key by which the value of the node can be referenced.
   *
   * @type {K}
   * @memberof INodeDoubleKeyVal
   */
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