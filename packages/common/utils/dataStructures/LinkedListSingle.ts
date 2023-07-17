import { LinkedList as LinkedListBase, Node as NodeBase } from './LinkedList';

export class Node<K> extends NodeBase<Node<K>, K> {
  constructor(key: K) {
    super(key);
  }
}

export class LinkedList<K> extends LinkedListBase<Node<K>, K> {
  getTail() {
    let node = this.head;
    while (node && node.next) {
      node = node.next;
    }

    return node ?? null;
  }

  prepend(key: K) {
    const node = new Node(key);
    this.prependNode(node);
  }

  prependNode(node: Node<K>) {
    node.next = this.head;
    this.head = node;
    this.length++;
  }

  append(key: K) {
    const node = new Node(key);
    this.appendNode(node);
  }

  appendNode(node: Node<K>) {
    let currNode = this.head;
    while (currNode && currNode.next) {
      currNode = currNode.next;
    }
    if (currNode) {
      currNode.next = node;
    } else {
      this.head = node;
    }
    this.length++;
  }

  remove(key: K) {
    let currNode = this.head;
    let prevNode = null;
    while (currNode) {
      if (currNode.key === key) {
        if (prevNode) {
          prevNode.next = currNode.next;
        } else {
          this.head = null;
        }
        this.length--;

        return currNode;
      }
      prevNode = currNode;
      currNode = currNode.next;
    }

    return null;
  }

  removeNode(node: Node<K>) {
    return this.remove(node.key);
  }

  removeHead() {
    const removedHead: Node<K> | null = this.head;
    if (removedHead) {
      let nextHead = removedHead.next;
      removedHead.next = null;
      this.head = nextHead;
      this.length--;
    }
    return removedHead;
  }

  removeTail() {
    let node = this.head;
    let prevNode = null;
    while (node) {
      prevNode = node;
      node = node.next;
    }
    if (prevNode) {
      prevNode.next = null;
    }
    this.length--;
    return prevNode;
  }
}