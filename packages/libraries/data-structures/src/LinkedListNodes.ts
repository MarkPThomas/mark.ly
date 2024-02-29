import { ICloneable, IEquatable } from "@markpthomas/common-libraries/interfaces";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @interface INode
 * @typedef {INode}
 * @template V
 * @extends {ICloneable<INode<V>>}
 */
export interface INode<V> extends ICloneable<INode<V>> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {V}
 */
  val: V;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {(INode<V> | null)}
 */
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

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @class Node
 * @typedef {Node}
 * @template V
 * @implements {INode<V>}
 */
export class Node<V> implements INode<V>{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {V}
 */
  val: V;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {(Node<V> | null)}
 */
  next: Node<V> | null = null;

  /**
 * Creates an instance of Node.
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @constructor
 * @param {V} value
 */
  constructor(value: V) {
    this.val = value;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @param {V} value
 * @param {((a: V, b: V) => boolean) | undefined} [cb=undefined]
 * @returns {boolean}
 */
  equals(value: V, cb: ((a: V, b: V) => boolean) | undefined = undefined): boolean {
    if (cb) {
      return cb(this.val, value);
    } else {
      return this.val === value;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {*}
 */
  toObject(): any {
    return {
      val: this.val
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {Node<V>}
 */
  clone(): Node<V> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<V>).clone();
    }

    return new Node(val);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {number}
 */
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


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @interface INodeKeyVal
 * @typedef {INodeKeyVal}
 * @template K
 * @template V
 * @extends {INode<V>}
 */
export interface INodeKeyVal<K, V> extends INode<V> {
  /**
   * Unique key by which the value of the node can be referenced.
   *
   * @type {K}
   * @memberof INodeKeyVal
   */
  key: K;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @class NodeKeyVal
 * @typedef {NodeKeyVal}
 * @template K
 * @template V
 * @extends {Node<V>}
 * @implements {INodeKeyVal<K, V>}
 */
export class NodeKeyVal<K, V> extends Node<V> implements INodeKeyVal<K, V> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {K}
 */
  key: K;

  /**
 * Creates an instance of NodeKeyVal.
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @constructor
 * @param {K} key
 * @param {V} val
 */
  constructor(key: K, val: V) {
    super(val);
    this.key = key;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {*}
 */
  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      key: this.key
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {NodeKeyVal<K, V>}
 */
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


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @export
 * @interface INodeDouble
 * @typedef {INodeDouble}
 * @template V
 * @extends {INode<V>}
 */
export interface INodeDouble<V> extends INode<V> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @type {(NodeDouble<V> | null)}
 */
  prev: NodeDouble<V> | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:23 PM
 *
 * @returns {boolean}
 */
  removeNode(): boolean;
  /**
   * Returns the length from the current node to the first linked node.
   *
   * @return {*}  null
   * @memberof INode
   */
  lengthPrev(): number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @class NodeDouble
 * @typedef {NodeDouble}
 * @template V
 * @extends {Node<V>}
 * @implements {INodeDouble<V>}
 */
export class NodeDouble<V> extends Node<V> implements INodeDouble<V>{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @type {(NodeDouble<V> | null)}
 */
  prev: NodeDouble<V> | null = null;

  /**
 * Creates an instance of NodeDouble.
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @constructor
 * @param {V} value
 */
  constructor(value: V) {
    super(value);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {boolean}
 */
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



  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {number}
 */
  lengthPrev(): number {
    let count = 0;
    let currNode: NodeDouble<V> = this;
    while (currNode) {
      count++;
      currNode = currNode.prev as NodeDouble<V>;
    }
    return count;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {NodeDouble<V>}
 */
  clone(): NodeDouble<V> {
    let val = this.val;
    if (val && typeof val === "object" && 'clone' in val) {
      val = (val as unknown as ICloneable<V>).clone();
    }

    return new NodeDouble(val);
  }
}


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @interface INodeDoubleKeyVal
 * @typedef {INodeDoubleKeyVal}
 * @template K
 * @template V
 * @extends {INodeDouble<V>}
 */
export interface INodeDoubleKeyVal<K, V> extends INodeDouble<V> {
  /**
   * Unique key by which the value of the node can be referenced.
   *
   * @type {K}
   * @memberof INodeDoubleKeyVal
   */
  key: K;
}
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @class NodeDoubleKeyVal
 * @typedef {NodeDoubleKeyVal}
 * @template K
 * @template V
 * @extends {NodeDouble<V>}
 * @implements {INodeDoubleKeyVal<K, V>}
 */
export class NodeDoubleKeyVal<K, V> extends NodeDouble<V> implements INodeDoubleKeyVal<K, V>{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @type {K}
 */
  key: K;

  /**
 * Creates an instance of NodeDoubleKeyVal.
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @constructor
 * @param {K} key
 * @param {V} val
 */
  constructor(key: K, val: V) {
    super(val);
    this.key = key;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {*}
 */
  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      key: this.key
    }
  }
}