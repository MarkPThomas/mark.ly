import { Node } from './LinkedListNodes';

export interface ILinkedList<N extends Node<V>, V> {
  prepend(valueOrNode: V | N): void;
  append(valueOrNode: V | N): void;
  find(valueOrNode: V | N): N | null;
  remove(valueOrNode: V | N): N | null;
  move(valueOrNode: V | N, spaces: number): boolean;

  prependMany(items: V[] | ILinkedList<N, V>): void;
  appendMany(items: V[] | ILinkedList<N, V>): void;

  getHead(): N | null;
  removeHead(): N | null;
  moveToHead(valueOrNode: V | N): boolean;

  getTail(): N | null;
  removeTail(): N | null;
  moveToTail(valueOrNode: V | N): boolean;

  size(): number;
  toArray(): V[] | any[];
  setMatchCB(callBack: (a: V, b: V) => boolean): void;
  reverse(): void;
  // sort
}

export abstract class LinkedList<N extends Node<V>, V> implements ILinkedList<N, V> {
  protected length: number = 0;
  protected head: N | null = null;
  protected tail: N | null = null;
  protected callBack: ((a: V, b: V) => boolean) | undefined = undefined;

  constructor(items: V[] | null = null) {
    if (items !== null) {
      this.fromArray(items);
    }
  }

  find(
    valueOrNode: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ) {
    let node = this.head;
    while (node) {
      if (this.areEqual(valueOrNode, node, cb)) {
        return node;
      }
      node = node.next as N;
    }
    return null;
  }

  getHead() {
    return this.head ?? null;
  }

  getTail() {
    return this.tail ?? null;
  }

  moveToHead(valueOrNode: V | N) {
    if (this.remove(valueOrNode) !== null) {
      this.prepend(valueOrNode);
      return true;
    }
    return false;
  }

  moveToTail(valueOrNode: V | N) {
    if (this.remove(valueOrNode) !== null) {
      this.append(valueOrNode);
      return true;
    }
    return false;
  }

  prependMany(items: V[] | LinkedList<N, V>) {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      for (let i = itemsAsArray.length - 1; 0 <= i; i--) {
        this.prepend(itemsAsArray[i]);
      }
    } else {
      const itemsAsList = items as LinkedList<N, V>;
      if (!this.head) {
        this.head = itemsAsList.head;
        this.tail = itemsAsList.tail;
      } else if (itemsAsList.tail) {
        itemsAsList.tail.next = this.head;
        this.head = itemsAsList.head;
      }
    }
  }

  appendMany(items: V[] | LinkedList<N, V>) {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      itemsAsArray.forEach((item) => {
        this.append(item);
      });
    } else {
      const itemsAsList = items as LinkedList<N, V>;
      if (!this.tail) {
        this.head = itemsAsList.head;
        this.tail = itemsAsList.tail;
      } else if (itemsAsList.tail) {
        this.tail.next = itemsAsList.head;
        this.tail = itemsAsList.tail;
      }
    }
  }

  size() {
    return this.length;
  }

  toArray() {
    const output = [];
    let node = this.head;
    while (node) {
      const propsVals = node.toObject();
      if (Object.keys(propsVals).length === 1 && propsVals.hasOwnProperty('val')) {
        output.push(propsVals.val);
      } else {
        output.push(propsVals);
      }

      node = node.next as N;
    }

    return output;
  }

  setMatchCB(callBack: (a: V, b: V) => boolean) {
    this.callBack = callBack;
  }

  protected getNode(valueOrNode: V | Node<V>) {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof Node)
      ? valueOrNode as Node<V>
      : new Node(valueOrNode as V);
  }

  protected areEqual(
    valueOrNode: V | Node<V>,
    node: Node<V>,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined) {

    if (cb === undefined) {
      cb = this.callBack;
    } else if (cb === null) {
      cb = undefined;
    }

    return ((!(valueOrNode instanceof Node) && node.equals(valueOrNode as V, cb))
      || node.val === (valueOrNode as Node<V>).val)
  }

  protected fromArray(items: V[]) {
    for (let i = items.length - 1; 0 <= i; i--) {
      this.prepend(items[i]);
    }
  }

  abstract prepend(valueOrNode: V | N): void;
  abstract append(valueOrNode: V | N): void;

  abstract remove(valueOrNode: V | N): N | null;
  abstract removeHead(): N | null;
  abstract removeTail(): N | null;

  abstract move(valueOrNode: V | N, spaces: number): boolean;

  abstract reverse(): void;
}

export { Node };