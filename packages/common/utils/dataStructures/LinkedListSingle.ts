import { LinkedList as LinkedListBase, Node } from './LinkedList';

export class LinkedList<V> extends LinkedListBase<Node<V>, V> {
  getTail() {
    let node = this.head;
    while (node && node.next) {
      node = node.next;
    }

    return node ?? null;
  }

  prepend(valueOrNode: V | Node<V>) {
    const node = valueOrNode instanceof Node<V> ? valueOrNode as Node<V> : new Node(valueOrNode as V);

    node.next = this.head;
    this.head = node;
    this.length++;
  }

  append(valueOrNode: V | Node<V>) {
    const node = valueOrNode instanceof Node<V> ? valueOrNode as Node<V> : new Node(valueOrNode as V);

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

  remove(
    valueOrNode: V | Node<V>,
    cb: ((a: V, b: V) => boolean) | undefined = undefined
  ) {
    let currNode = this.head;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        if (prevNode) {
          prevNode.next = currNode.next;
        } else {
          this.head = currNode.next;
        }
        this.length--;

        return currNode;
      }
      prevNode = currNode;
      currNode = currNode.next;
    }

    return null;
  }

  removeHead() {
    const removedHead: Node<V> | null = this.head;
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
    if (!node) {
      return node;
    }

    if (!node.next) {
      this.head = null;
      this.length--;
      return node;
    }

    let prevNode = null;
    while (node.next) {
      prevNode = node;
      node = node.next;
    }
    if (prevNode) {
      prevNode.next = null;
    }
    this.length--;
    return node;
  }

  move(
    valueOrNode: V | Node<V>,
    spaces: number,
    cb: ((a: V, b: V) => boolean) | undefined = undefined
  ): boolean {
    if (!spaces) {
      return false;
    }

    let currNode = this.head;
    let prevNode = null;
    let count = 1;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        const nodeMove = currNode;
        if (prevNode) {
          prevNode.next = currNode.next;
        } else if (currNode.next) {
          this.head = currNode.next;
        } else {
          return false;
        }

        if (spaces > 0) {
          prevNode = currNode;
          currNode = currNode.next;
        } else {
          prevNode = null;
          currNode = this.head;
          spaces = Math.max(0, count + spaces - 1);
        }

        while (currNode && spaces) {
          prevNode = currNode;
          currNode = currNode.next;
          spaces--;
        }

        if (prevNode) {
          prevNode.next = nodeMove;
        }
        nodeMove.next = currNode;
        if (this.head === currNode) {
          this.head = nodeMove;
        }

        return true;
      }
      prevNode = currNode;
      currNode = currNode.next;
      count++;
    }

    return false;
  }

  reverse(): void {
    let prevNode = null;
    let currNode = this.head;

    while (currNode) {
      const tempNode = currNode.next;
      currNode.next = prevNode;

      prevNode = currNode;
      currNode = tempNode;
    }
    this.head = prevNode;
  }
}

export { Node };