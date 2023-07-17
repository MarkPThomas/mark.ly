import { LinkedList as LinkedListBase, Node as NodeBase } from './LinkedList';

export class NodeDouble<K> extends NodeBase<NodeDouble<K>, K> {
  prev: NodeDouble<K> | null;

  constructor(key: K) {
    super(key);
  }

  removeNode() {
    let isRemoved = false;
    if (this.prev) {
      this.prev.next = this.next;
      isRemoved = true;
    }

    if (this.next) {
      this.next.prev = this.prev;
      isRemoved = true;
    }
    return isRemoved;
  }
}

export class LinkedListDouble<K> extends LinkedListBase<NodeDouble<K>, K> {
  private tail: NodeDouble<K> | null;

  getTail() {
    return this.tail ?? null;
  }

  prepend(key: K) {
    const node = new NodeDouble(key);
    this.prependNode(node);
  }

  prependNode(node: NodeDouble<K>) {
    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }
    this.head = node;
    this.length++;
  }

  append(val: K) {
    const node = new NodeDouble(val);
    this.appendNode(node);
  }

  appendNode(node: NodeDouble<K>) {
    node.prev = this.tail;
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.length++;
  }

  remove(key: K) {
    if (this.head && key === this.head.key) {
      return this.removeHead();
    }
    if (this.tail && key === this.tail.key) {
      return this.removeTail();
    }

    let node = this.head;
    while (node) {
      if (node.key === key) {
        return this.removeNode(node);
      }
      node = node.next;
    }

    return null;
  }

  removeNode(node: NodeDouble<K>) {
    if (this.head && node.key === this.head.key) {
      return this.removeHead();
    }
    if (this.tail && node.key === this.tail.key) {
      return this.removeTail();
    }

    if (node.removeNode()) {
      this.length--;
      return node;
    } else {
      return null;
    }
  }

  removeHead() {
    const removedHead: NodeDouble<K> | null = this.head;
    if (removedHead) {
      const nextHead = removedHead.next;
      removedHead.next = null;
      if (nextHead) {
        nextHead.prev = null;
      }
      this.head = nextHead;
      this.length--;
    }
    return removedHead;
  }

  removeTail() {
    const removedTail = this.tail;
    if (removedTail) {
      const previousTail = removedTail.prev;
      removedTail.prev = null;
      if (previousTail) {
        previousTail.next = null;
      }
      this.tail = previousTail;
      this.length--;
    }
    return removedTail;
  }
}