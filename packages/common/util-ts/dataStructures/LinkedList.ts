export interface ILinkedList<N extends Node<N, K>, K> {
  prepend(key: K): void;
  prependNode(node: N): void;
  append(key: K): void;
  appendNode(node: N): void;

  find(key: K): N | null;

  remove(key: K): N | null;
  removeNode(node: N): N | null;
  removeHead(): N | null;
  removeTail(): N | null;

  moveToHead(node: N): void;
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
  protected head: N | null;

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


  moveToHead(node: N) {
    this.removeNode(node);
    this.prependNode(node);
  }

  size() {
    return this.length;
  }

  abstract prepend(key: K): void;
  abstract prependNode(node: N): void;
  abstract append(key: K): void;
  abstract appendNode(node: N): void;

  abstract remove(key: K): N | null;
  abstract removeNode(node: N): N | null;
  abstract removeHead(): N | null;
  abstract removeTail(): N | null;
}