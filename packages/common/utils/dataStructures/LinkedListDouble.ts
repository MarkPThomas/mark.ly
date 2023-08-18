import { LinkedList as LinkedListBase } from './LinkedList';
import { NodeDouble } from './LinkedListNodes';
import { LinkedListSingle } from './LinkedListSingle';

export class LinkedList<N extends NodeDouble<V>, V> extends LinkedListBase<N, V> {
  constructor(items: V[] | null = null) {
    super();
    if (items !== null) {
      this.fromArray(items);
    }
  }

  getTail() {
    return this.tail ?? null;
  }

  prepend(valueOrNode: V | N) {
    const node = this.getNodeDouble(valueOrNode);

    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node as N;
    }
    this.head = node as N;
    this.length++;
  }

  append(valueOrNode: V | N) {
    const node = this.getNodeDouble(valueOrNode);

    node.prev = this.tail;
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node as N;
    }
    this.tail = node as N;
    this.length++;
  }

  insertBefore(existingNode: N, valueOrNode: V | N) {
    const node = this.getNodeDouble(valueOrNode);
    const priorExistingNode = existingNode.prev;

    if (priorExistingNode) {
      priorExistingNode.next = node;
      node.prev = priorExistingNode;

      existingNode.prev = node;
      node.next = existingNode;

      this.length++;
    } else {
      this.prepend(valueOrNode);
    }
  }

  insertAfter(existingNode: N, valueOrNode: V | N) {
    const node = this.getNodeDouble(valueOrNode);
    const nextExistingNode = existingNode.next;

    if (nextExistingNode) {
      (nextExistingNode as NodeDouble<V>).prev = node;
      node.next = nextExistingNode;

      existingNode.next = node;
      node.prev = existingNode;

      this.length++;
    } else {
      this.append(valueOrNode);
    }
  }

  remove(
    valueOrNode: V | N,
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

    if (this.isNodeDouble(valueOrNode) && (valueOrNode as N).removeNode()) {
      this.length--;
      return valueOrNode as N;
    } else {
      let currNode = this.head;
      while (currNode) {
        if (this.areEqual(valueOrNode, currNode, cb)) {
          currNode.removeNode();
          this.length--;

          return currNode;
        }
        currNode = currNode.next as N;
      }
    }

    return null;
  }

  removeHead() {
    const removedHead: N | null = this.head;
    if (removedHead) {
      const nextHead = removedHead.next as N;
      removedHead.next = null;
      if (nextHead) {
        (nextHead as N).prev = null;
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
    const removedTail: N | null = this.tail;
    if (removedTail) {
      const previousTail = removedTail.prev;
      removedTail.prev = null;
      if (previousTail) {
        previousTail.next = null;
      }
      this.tail = previousTail as N;
      if (this.tail === null) {
        this.head = null;
      }
      this.length--;
    }
    return removedTail;
  }

  move(
    valueOrNode: V | N,
    spaces: number,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): boolean {
    if (!spaces || this.length < 2) {
      return false;
    }

    // Find matching node
    let currNode = this.head as N;
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
            this.head = currNode.next as N;
            this.head.prev = null;
          }
        } else {
          prevNode.next = currNode.next;
          if (currNode.next) {
            // mid of multi-node
            (currNode.next as N).prev = prevNode as N;
          } else {
            // tail of multi-node
            this.tail = prevNode;
            this.tail.next = null;
          }
        }

        if (spaces > 0 && currNode.next) {
          // Moving node forward
          currNode = currNode.next as N
          while (currNode && spaces) {
            prevNode = currNode;
            currNode = currNode.next as N;
            spaces--;
          }
        } else if (spaces < 0 && prevNode) {
          // Moving node backward
          currNode = currNode.next as N;
          while (prevNode && spaces) {
            currNode = prevNode as N;
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
      currNode = currNode.next as N;
    }

    return false;
  }

  reverse(): void {
    let prevNode = null;
    let currNode = this.head;

    while (currNode) {
      const tempNode = currNode.next as N;
      currNode.next = prevNode;
      if (prevNode) {
        prevNode.prev = currNode;
      }

      prevNode = currNode;
      currNode = tempNode;
    }
    this.head = prevNode;
  }

  toLinkedListSingle() {
    const linkedList = new LinkedListSingle<V>();
    let currNode = this.head;
    while (currNode) {
      linkedList.append(currNode.val);
      currNode = currNode.next as N;
    }

    return linkedList;
  }

  protected getNodeDouble(valueOrNode: V | N) {
    return (this.isNodeDouble(valueOrNode))
      ? valueOrNode as N
      : new NodeDouble(valueOrNode as V);
  }

  protected isNodeDouble(valueOrNode: V | N) {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof NodeDouble);
  }
}

export class LinkedListDouble<V> extends LinkedList<NodeDouble<V>, V> {

}

export { NodeDouble };