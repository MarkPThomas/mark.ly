import { LinkedList as LinkedListBase, Node } from './LinkedList';
import { NodeDouble } from './LinkedListNodes';

export class LinkedListDouble<V> extends LinkedListBase<NodeDouble<V>, V> {
  constructor(items: V[] | null = null) {
    super();
    if (items !== null) {
      this.fromArray(items);
    }
  }

  getTail() {
    return this.tail ?? null;
  }

  prepend(valueOrNode: V | NodeDouble<V>) {
    const node = this.getNodeDouble(valueOrNode);

    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }
    this.head = node;
    this.length++;
  }

  append(valueOrNode: V | NodeDouble<V>) {
    const node = this.getNodeDouble(valueOrNode);

    node.prev = this.tail;
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.length++;
  }

  remove(
    valueOrNode: V | NodeDouble<V>,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ) {
    const value = this.isNodeDouble(valueOrNode)
      ? (valueOrNode as NodeDouble<V>).val
      : valueOrNode as V;

    if (this.head && this.head.val === value) {
      return this.removeHead();
    }
    if (this.tail && this.tail.val === value) {
      return this.removeTail();
    }

    if (this.isNodeDouble(valueOrNode) && (valueOrNode as NodeDouble<V>).removeNode()) {
      this.length--;
      return valueOrNode as NodeDouble<V>;
    } else {
      let currNode = this.head;
      while (currNode) {
        if (this.areEqual(valueOrNode, currNode, cb)) {
          currNode.removeNode();
          this.length--;

          return currNode;
        }
        currNode = currNode.next as NodeDouble<V>;
      }
    }

    return null;
  }

  removeHead() {
    const removedHead: NodeDouble<V> | null = this.head;
    if (removedHead) {
      const nextHead = removedHead.next as NodeDouble<V>;
      removedHead.next = null;
      if (nextHead) {
        (nextHead as NodeDouble<V>).prev = null;
      }
      this.head = nextHead;
      if (this.head === null) {
        this.tail = null;
      }
      this.length--;
    }
    return removedHead;
  }

  removeTail() {
    const removedTail: NodeDouble<V> | null = this.tail;
    if (removedTail) {
      const previousTail = removedTail.prev;
      removedTail.prev = null;
      if (previousTail) {
        previousTail.next = null;
      }
      this.tail = previousTail;
      if (this.tail === null) {
        this.head = null;
      }
      this.length--;
    }
    return removedTail;
  }

  move(
    valueOrNode: V | NodeDouble<V>,
    spaces: number,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): boolean {
    if (!spaces || this.length < 2) {
      return false;
    }

    // Find matching node
    let currNode = this.head as NodeDouble<V>;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        if ((currNode === this.head && spaces < 0)
          || (currNode === this.tail && spaces > 0)) {
          // Node cannot be moved, abort before altering list
          return false;
        }

        // Save matched node
        const nodeMove = currNode;

        // Attach neighboring nodes around matched node
        if (!prevNode) {
          if (currNode.next) {
            // head of multi-node
            this.head = currNode.next as NodeDouble<V>;
            this.head.prev = null;
          }
        } else {
          prevNode.next = currNode.next;
          if (currNode.next) {
            // mid of multi-node
            (currNode.next as NodeDouble<V>).prev = prevNode as NodeDouble<V>;
          } else {
            // tail of multi-node
            this.tail = prevNode;
            this.tail.next = null;
          }
        }

        if (spaces > 0 && currNode.next) {
          // Moving node forward
          currNode = currNode.next as NodeDouble<V>;
          while (currNode && spaces) {
            prevNode = currNode;
            currNode = currNode.next as NodeDouble<V>;
            spaces--;
          }
        } else if (spaces < 0 && prevNode) {
          // Moving node backward
          currNode = currNode.next as NodeDouble<V>;
          while (prevNode && spaces) {
            currNode = prevNode;
            prevNode = prevNode.prev;
            spaces++;
          }
        }

        // Insert matched node at new position
        nodeMove.prev = prevNode;
        if (prevNode) {
          prevNode.next = nodeMove;
        } else {
          // Inserted at head
          this.head = nodeMove;
        }

        nodeMove.next = currNode;
        if (currNode) {
          currNode.prev = nodeMove;
        } else {
          // Inserted at tail
          this.tail = nodeMove;
        }

        return true;
      }
      prevNode = currNode;
      currNode = currNode.next as NodeDouble<V>;
    }

    return false;
  }

  reverse(): void {
    let prevNode = null;
    let currNode = this.head;

    while (currNode) {
      const tempNode = currNode.next as NodeDouble<V>;
      currNode.next = prevNode;
      if (prevNode) {
        prevNode.prev = currNode;
      }

      prevNode = currNode;
      currNode = tempNode;
    }
    this.head = prevNode;
  }

  protected getNodeDouble(valueOrNode: V | NodeDouble<V>) {
    return (this.isNodeDouble(valueOrNode))
      ? valueOrNode as NodeDouble<V>
      : new NodeDouble(valueOrNode as V);
  }

  protected isNodeDouble(valueOrNode: V | NodeDouble<V>) {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof NodeDouble);
  }
}

export { NodeDouble };