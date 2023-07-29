import { LinkedList as LinkedListBase, Node } from './LinkedList';

export class LinkedList<V> extends LinkedListBase<Node<V>, V> {
  prepend(valueOrNode: V | Node<V>) {
    const node = this.getNode(valueOrNode);
    node.next = this.head;
    if (node.next === null) {
      this.tail = node;
    }
    this.head = node;
    this.length++;
  }

  append(valueOrNode: V | Node<V>) {
    const node = this.getNode(valueOrNode);
    let currNode = this.head;
    while (currNode && currNode.next) {
      currNode = currNode.next;
    }
    if (currNode) {
      currNode.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.length++;
  }

  remove(
    valueOrNode: V | Node<V>,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ) {
    let currNode = this.head;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        if (prevNode) {
          prevNode.next = currNode.next;
          if (!currNode.next) {
            this.tail = prevNode;
          }
        } else {
          this.head = currNode.next;
          if (!this.head) {
            this.tail = null;
          }
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
      if (!removedHead.next) {
        this.tail = null;
      }
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
      this.tail = null;
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
      this.tail = prevNode;
    }
    this.length--;
    return node;
  }

  move(
    valueOrNode: V | Node<V>,
    spaces: number,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): boolean {
    if (!spaces || this.length < 2) {
      return false;
    }

    let currNode = this.head;
    let prevNode = null;
    let count = 1;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        const nodeMove = currNode;
        if ((this.head === nodeMove && spaces < 0
          || nodeMove.next === null && spaces > 0)) {
          return true;
        }
        if (prevNode) {
          prevNode.next = currNode.next;
        } else if (currNode.next) {
          this.head = currNode.next;
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