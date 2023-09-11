import { EqualityCallback, EqualityCallbackOptions, ILinkedList, LinkedList as LinkedListBase } from './LinkedList';
import { NodeDouble } from './LinkedListNodes';
import { ILinkedListSingle, LinkedListSingle } from './LinkedListSingle';

export interface ILinkedListDouble<N extends NodeDouble<V>, V> extends ILinkedList<N, V> {
  toLinkedListSingle(): LinkedListSingle<V>;
}

export class LinkedList<N extends NodeDouble<V>, V>
  extends LinkedListBase<N, V>
  implements ILinkedListDouble<N, V> {

  // === Single Item Operations ===
  prepend(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);

    node.next = this._head;
    if (this._head) {
      this._head.prev = node;
    } else {
      this._tail = node as N;
    }
    this._head = node as N;
    this._length++;
  }

  append(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);

    node.prev = this._tail;
    if (this._tail) {
      this._tail.next = node;
    } else {
      this._head = node as N;
    }
    this._tail = node as N;
    this._length++;
  }

  move(
    valueOrNode: V | N,
    spaces: number,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    if (!spaces || this._length < 2) {
      return false;
    }

    // Find matching node
    let currNode = this._head as N;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        if ((currNode === this._head && spaces < 0)
          || (currNode === this._tail && spaces > 0)) {
          // Node cannot be moved, abort before altering list
          return false;
        }

        // Save matched node
        const nodeMove = currNode;

        // Attach neighboring nodes around matched node
        if (!prevNode) {
          if (currNode.next) {
            // head of multi-node
            this._head = currNode.next as N;
            this._head.prev = null;
          }
        } else {
          prevNode.next = currNode.next;
          if (currNode.next) {
            // mid of multi-node
            (currNode.next as N).prev = prevNode as N;
          } else {
            // tail of multi-node
            this._tail = prevNode;
            this._tail.next = null;
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
          this._head = nodeMove;
        }

        nodeMove.next = currNode;
        if (currNode) {
          currNode.prev = nodeMove;
        } else {
          // Inserted at tail
          this._tail = nodeMove;
        }

        return true;
      }
      prevNode = currNode;
      currNode = currNode.next as N;
    }

    return false;
  }

  protected insertBeforeNode(existingNode: N, insertNode: N) {
    const priorExistingNode = existingNode.prev;

    if (priorExistingNode) {
      priorExistingNode.next = insertNode;
      insertNode.prev = priorExistingNode;

      existingNode.prev = insertNode;
      insertNode.next = existingNode;

      this._length++;
    } else {
      this.prepend(insertNode);
    }
  }

  protected insertAfterNode(existingNode: N, insertNode: N) {
    const nextExistingNode = existingNode.next;

    if (nextExistingNode) {
      (nextExistingNode as N).prev = insertNode;
      insertNode.next = nextExistingNode;

      existingNode.next = insertNode;
      insertNode.prev = existingNode;

      this._length++;
    } else {
      this.append(insertNode);
    }
  }

  splitAt(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ] {
    const leftList = new LinkedList<N, V>();
    const rightList = new LinkedList<N, V>();

    const result = this.splitAtBase(leftList, rightList, valueOrNode, cb);

    return [result[0] as LinkedList<N, V>, result[1] as LinkedList<N, V>]
  }


  // === Head Operations ===
  removeHead() {
    const removedHead: N | null = this._head;
    if (removedHead) {
      const nextHead = removedHead.next as N;
      removedHead.next = null;
      if (nextHead) {
        (nextHead as N).prev = null;
      }
      this._head = nextHead;
      if (this._head === null) {
        this._tail = null;
      }
      this._length--;
    }
    return removedHead;
  }


  // === Tail Operations ===
  getTail() {
    return this._tail ?? null;
  }

  removeTail() {
    const removedTail: N | null = this._tail;
    if (removedTail) {
      const previousTail = removedTail.prev;
      removedTail.prev = null;
      if (previousTail) {
        previousTail.next = null;
      }
      this._tail = previousTail as N;
      if (this._tail === null) {
        this._head = null;
      }
      this._length--;
    }
    return removedTail;
  }


  // === 'Many' Operations ===
  protected prependList(items: ILinkedList<N, V>): void {
    if (!this._head) {
      this.replaceList(items);
    } else if (items.tail) {
      this._head.prev = items.tail;
      items.tail.next = this._head;

      this._head = items.head;

      this._length += items.size();
    }
  }

  protected appendList(items: ILinkedList<N, V>): void {
    if (!this._tail) {
      this.replaceList(items);
    } else if (items.head) {
      (items.head as N).prev = this._tail;
      this._tail.next = items.head;

      this._tail = items.tail;

      this._length += items.size();
    }
  }

  protected insertListBefore(refNode: N, items: ILinkedList<N, V>): void {
    if (refNode.prev && items.head && items.tail) {
      items.head.prev = refNode.prev;
      items.tail.next = refNode;

      refNode.prev.next = items.head;
      refNode.prev = items.tail;

      this._length += items.size();
    } else {
      this.prependList(items);
    }
  }

  protected insertListAfter(refNode: N, items: ILinkedList<N, V>): void {
    if (refNode.next && items.head && items.tail) {
      items.head.prev = refNode;
      items.tail.next = refNode.next;

      (refNode.next as N).prev = items.tail;
      refNode.next = items.head;
      this._length += items.size();
    } else {
      this.appendList(items);
    }
  }


  // === Any Operations ===
  protected removeFirstOrAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined,
    firstOnly: boolean = true
  ): N[] {
    const removedNodes: N[] = [];

    let currNode = this._head;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        const removeNode = currNode;
        currNode = currNode.next as N;

        if (prevNode) {
          prevNode.next = removeNode.next;
          if (removeNode.next) {
            (removeNode.next as N).prev = prevNode;
          } else {
            this._tail = prevNode;
          }
        } else {
          this._head = removeNode.next as N;
          if (this._head) {
            this._head.prev = null;
          } else {
            this._tail = null;
          }
        }
        removeNode.next = null;
        removeNode.prev = null;

        this._length--;

        removedNodes.push(removeNode);
        if (firstOnly) {
          return removedNodes;
        }
      } else {
        prevNode = currNode;
        currNode = currNode.next as N;
      }
    }

    return removedNodes;
  }


  // === Range Operations ===
  splitBetween(
    valueOrNodeStart: V | N,
    valueOrNodeEnd: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ] {
    const leftList = new LinkedList<N, V>();
    const rightList = new LinkedList<N, V>();

    const result = this.splitBetweenBase(leftList, rightList, valueOrNodeStart, valueOrNodeEnd, cb);

    return [result[0] as LinkedList<N, V>, result[1] as LinkedList<N, V>]
  }


  // === Misc Operations ===
  reverse(): void {
    let prevNode = null;
    let currNode = this._head;

    while (currNode) {
      const tempNode = currNode.next as N;
      currNode.next = prevNode;
      if (prevNode) {
        prevNode.prev = currNode;
      }

      prevNode = currNode;
      currNode = tempNode;
    }
    this._head = prevNode;
  }

  toLinkedListSingle(): LinkedListSingle<V> {
    const linkedList = new LinkedListSingle<V>();
    let currNode = this._head;
    while (currNode) {
      linkedList.append(currNode.val);
      currNode = currNode.next as N;
    }

    return linkedList;
  }


  // === Commonly Used Protected ===
  protected getNode(valueOrNode: V | N): N {
    return this.isNodeDouble(valueOrNode)
      ? valueOrNode as N
      : new NodeDouble(valueOrNode as V) as N;
  }

  protected isNodeDouble(valueOrNode: V | N): boolean {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof NodeDouble);
  }

  static fromHead<N extends NodeDouble<V>, V>(head: N): LinkedList<N, V> {
    const linkedList = new LinkedList<N, V>();
    linkedList._head = head;

    let currNode = head;
    let count = head ? 1 : 0;
    while (currNode && currNode.next) {
      count++;
      currNode = currNode.next as N;
    }

    linkedList._length = count;
    linkedList._tail = currNode;

    return linkedList;
  }
}

export class LinkedListDouble<V> extends LinkedList<NodeDouble<V>, V> {

}

export { NodeDouble };