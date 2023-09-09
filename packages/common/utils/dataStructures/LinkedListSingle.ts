import {
  EqualityCallbackOptions,
  ILinkedList,
  LinkedList as LinkedListBase,
  Node as NodeSingle
} from './LinkedList';
import { LinkedListDouble, ILinkedListDouble, NodeDouble } from './LinkedListDouble';

export interface ILinkedListSingle<N extends NodeSingle<V>, V> extends ILinkedList<N, V> {
  toLinkedListDouble(): LinkedListDouble<V>;
}

export class LinkedList<N extends NodeSingle<V>, V>
  extends LinkedListBase<N, V>
  implements ILinkedListSingle<N, V> {


  // === Single Item Operations ===
  prepend(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);
    node.next = this._head;
    this._head = node as N;

    if (this._tail === null) {
      this._tail = node as N;
    }

    this._length++;
  }

  append(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);
    let currNode = this._head;
    while (currNode && currNode.next) {
      currNode = currNode.next as N;
    }
    if (currNode) {
      currNode.next = node;
    } else {
      this._head = node as N;
    }
    this._tail = node as N;
    this._length++;
  }

  move(
    valueOrNode: V | N,
    spaces: number,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): boolean {
    if (!spaces || this._length < 2) {
      return false;
    }

    let currNode = this._head;
    let prevNode = null;
    let count = 1;
    while (currNode) {
      if (this.areEqual(valueOrNode, currNode, cb)) {
        const nodeMove = currNode;
        if ((this._head === nodeMove && spaces < 0
          || nodeMove.next === null && spaces > 0)) {
          return true;
        }
        if (prevNode) {
          prevNode.next = currNode.next;
        } else if (currNode.next) {
          this._head = currNode.next as N;
        }

        if (spaces > 0) {
          prevNode = currNode;
          currNode = currNode.next as N;
        } else {
          prevNode = null;
          currNode = this._head;
          spaces = Math.max(0, count + spaces - 1);
        }

        while (currNode && spaces) {
          prevNode = currNode;
          currNode = currNode.next as N;
          spaces--;
        }

        if (prevNode) {
          prevNode.next = nodeMove;
        }
        nodeMove.next = currNode;
        if (this._head === currNode) {
          this._head = nodeMove;
        }

        return true;
      }
      prevNode = currNode;
      currNode = currNode.next as N;
      count++;
    }

    return false;
  }

  protected insertBeforeNode(refNode: N, insertNode: N): void {
    const priorRefNode = this.getPriorNode(refNode, null);

    if (priorRefNode) {
      priorRefNode.next = insertNode;
      insertNode.next = refNode;

      this._length++;
    } else {
      this.prepend(insertNode);
    }
  }

  protected insertAfterNode(refNode: N, insertNode: N): void {
    const nextExistingNode = refNode.next;

    if (nextExistingNode) {
      insertNode.next = nextExistingNode;

      refNode.next = insertNode;

      this._length++;
    } else {
      this.append(insertNode);
    }
  }

  splitAt(
    valueOrNode: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
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
      let nextHead = removedHead.next;
      if (!removedHead.next) {
        this._tail = null;
      }
      removedHead.next = null;
      this._head = nextHead as N;
      this._length--;
    }
    return removedHead as N;
  }


  // === Tail Operations ===
  removeTail() {
    let node = this._head;
    if (!node) {
      return node;
    }

    if (!node.next) {
      this._head = null;
      this._tail = null;
      this._length--;
      return node;
    }

    let prevNode = null;
    while (node.next) {
      prevNode = node;
      node = node.next as N;
    }
    if (prevNode) {
      prevNode.next = null;
      this._tail = prevNode;
    }
    this._length--;
    return node;
  }


  // === 'Many' Operations ===
  protected prependList(items: ILinkedList<N, V>): void {
    if (!this._head) {
      this.replaceList(items);
    } else if (items.tail) {
      items.tail.next = this._head;
      this._head = items.head;

      this._length += items.size();
    }
  }

  protected appendList(items: ILinkedList<N, V>): void {
    if (!this._tail) {
      this.replaceList(items);
    } else if (items.head) {
      this._tail.next = items.head;
      this._tail = items.tail;

      this._length += items.size();
    }
  }

  protected insertListBefore(refNode: N, items: ILinkedList<N, V>): void {
    const priorRefNode = this.getPriorNode(refNode, null);

    if (priorRefNode && items.tail) {
      priorRefNode.next = items.head;
      items.tail.next = refNode;

      this._length += items.size();
    } else {
      this.prependList(items);
    }
  }

  protected insertListAfter(refNode: N, items: ILinkedList<N, V>): void {
    if (refNode.next && items.tail) {
      items.tail.next = refNode.next;
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
          if (!removeNode.next) {
            this._tail = prevNode;
          }
        } else {
          this._head = removeNode.next as N;
          if (!this._head) {
            this._tail = null;
          }
        }
        removeNode.next = null;

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
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
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
      const tempNode = currNode.next;
      currNode.next = prevNode;

      prevNode = currNode;
      currNode = tempNode as N;
    }
    this._head = prevNode;
  }

  toLinkedListDouble(): LinkedListDouble<V> {
    const linkedList = new LinkedListDouble<V>();
    let currNode = this._head;
    while (currNode) {
      linkedList.append(currNode.val);
      currNode = currNode.next as N;
    }

    return linkedList;
  }


  // === Commonly Used Protected ===
  protected getNode(valueOrNode: V | N): N {
    return this.isNodeSingle(valueOrNode)
      ? valueOrNode as N
      : new NodeSingle(valueOrNode as V) as N;
  }

  protected isNodeSingle(valueOrNode: V | N): boolean {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof NodeSingle);
  }
}

export class LinkedListSingle<V> extends LinkedList<NodeSingle<V>, V> {

}

export { NodeSingle };