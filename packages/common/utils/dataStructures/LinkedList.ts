export interface ILinkedList<N extends Node<N, K>, K> {
  prepend(key: K): void;
  prependNode(node: N): void;
  append(key: K): void;
  appendNode(node: N): void;

  find(key: K): N | null;
  getHead(): N | null;
  getTail(): N | null;

  remove(key: K): N | null;
  removeNode(node: N): N | null;
  removeHead(): N | null;
  removeTail(): N | null;

  moveToHead(node: N): boolean;

  size(): number;
  toArray(): Node<N, K>[];
}

export abstract class Node<N, K> {
  key: K;
  next: N | null;

  constructor(key: K) {
    this.key = key;
  }
}

export abstract class LinkedList<N extends Node<N, K>, K> implements ILinkedList<N, K> {
  protected length: number = 0;
  protected head: N | null = null;

  constructor(items: any[] | null = null) {
    if (items !== null) {
      for (let i = items.length - 1; 0 <= i; i--) {
        this.prepend(items[i]);
      }
    }
  }

  find(key: K) {
    let node: N | null = this.head;
    while (node) {
      if (node.key === key) {
        return node;
      }
      node = node.next;
    }
    return node;
  }

  getHead() {
    return this.head ?? null;
  }

  moveToHead(node: N) {
    if (this.removeNode(node) !== null) {
      this.prependNode(node);
      return true;
    }
    return false;
  }

  size() {
    return this.length;
  }

  toArray() {
    // TODO: Work out generating unique keys from values & returning arrays of the values
    const output = [];
    let node = this.head;
    while (node) {
      output.push(node);
      node = node.next;
    }

    return output;
  }

  abstract prepend(key: K): void;
  abstract prependNode(node: N): void;
  abstract append(key: K): void;
  abstract appendNode(node: N): void;

  abstract getTail(): N | null;

  abstract remove(key: K): N | null;
  abstract removeNode(node: N): N | null;
  abstract removeHead(): N | null;
  abstract removeTail(): N | null;
}