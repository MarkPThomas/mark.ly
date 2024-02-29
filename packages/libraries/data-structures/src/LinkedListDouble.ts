import { ICloneable } from '@markpthomas/common-libraries/interfaces';
import {
  EqualityCallbackOptions,
  ILinkedList,
  LinkedList as LinkedListBase
} from './LinkedList';
import { NodeDouble } from './LinkedListNodes';
import { LinkedListSingle } from './LinkedListSingle';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @interface ILinkedListDouble
 * @typedef {ILinkedListDouble}
 * @template {NodeDouble<V>} N
 * @template V
 * @extends {ILinkedList<N, V>}
 */
export interface ILinkedListDouble<N extends NodeDouble<V>, V>
  extends ILinkedList<N, V> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {LinkedListSingle<V>}
 */
  toLinkedListSingle(): LinkedListSingle<V>;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @class LinkedList
 * @typedef {LinkedList}
 * @template {NodeDouble<V>} N
 * @template V
 * @extends {LinkedListBase<N, V>}
 * @implements {ILinkedListDouble<N, V>}
 * @implements {ICloneable<LinkedList<N, V>>}
 */
export class LinkedList<N extends NodeDouble<V>, V>
  extends LinkedListBase<N, V>
  implements
  ILinkedListDouble<N, V>,
  ICloneable<LinkedList<N, V>>
{
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {LinkedList<N, V>}
 */
  clone(): LinkedList<N, V> {
    const linkedList = new LinkedList<N, V>(this.toArray());
    return linkedList as LinkedList<N, V>;
  }

  // === Single Item Operations ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 */
  prepend(valueOrNode: V | N) {
    const node = this.getAsNode(valueOrNode);
    const { nodeHead, nodeTail } = this.getHeadAndTail(node);

    nodeTail.next = this._head;
    if (this._head) {
      this._head.prev = nodeTail;
    } else {
      this._tail = nodeTail as N;
    }
    this._head = nodeHead;

    this._lengthDirty = true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 */
  append(valueOrNode: V | N) {
    const node = this.getAsNode(valueOrNode);
    const { nodeHead, nodeTail } = this.getHeadAndTail(node);

    nodeHead.prev = this._tail;
    if (this._tail) {
      this._tail.next = nodeHead;
    } else {
      this._head = nodeHead as N;
    }
    this._tail = nodeTail;

    this._lengthDirty = true;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} node
 * @returns {{ nodeHead: N; nodeTail: N; }\}
 */
  protected getHeadAndTail(node: N) {
    let nodeHead: N = node;
    let nodeTail: N = node;

    if (node.next && !node.prev) {
      // head of a list, get tail
      while (nodeTail.next) {
        nodeTail = nodeTail.next as N;
      }
    } else if (node.prev && !node.next) {
      // tail of a list, get head
      while (nodeHead.prev) {
        nodeHead = nodeHead.prev as N;
      }
    }

    return { nodeHead, nodeTail };
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 * @param {number} spaces
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @returns {boolean}
 */
  move(
    valueOrNode: V | N,
    spaces: number,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    if (!spaces || this.sizeUnderTwo()) {
      return false;
    }

    const node = this.getExistingNode(valueOrNode, cb)?.node;

    if (node) {
      return this.moveNode(node, spaces);
    } else {
      return false;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} currNode
 * @param {number} spaces
 * @returns {boolean}
 */
  protected moveNode(
    currNode: N,
    spaces: number
  ) {
    if ((currNode === this._head && spaces < 0)
      || (currNode === this._tail && spaces > 0)
      || (currNode.next === null && currNode.prev === null)) {
      // Node cannot be moved, abort before altering list
      return false;
    }

    let prevNode = currNode.prev;

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
        this._tail = prevNode as N;
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
        prevNode = prevNode.prev as N;
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} existingNode
 * @param {N} insertNode
 */
  protected insertBeforeNode(existingNode: N, insertNode: N) {
    const priorExistingNode = existingNode.prev;

    if (priorExistingNode) {
      priorExistingNode.next = insertNode;
      insertNode.prev = priorExistingNode;

      existingNode.prev = insertNode;
      insertNode.next = existingNode;

      this._lengthDirty = true;
    } else {
      this.prepend(insertNode);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} existingNode
 * @param {N} insertNode
 */
  protected insertAfterNode(existingNode: N, insertNode: N) {
    const nextExistingNode = existingNode.next;

    if (nextExistingNode) {
      (nextExistingNode as N).prev = insertNode;
      insertNode.next = nextExistingNode;

      existingNode.next = insertNode;
      insertNode.prev = existingNode;

      this._lengthDirty = true;
    } else {
      this.append(insertNode);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @returns {[
 *       LinkedList<N, V> | null,
 *       LinkedList<N, V> | null
 *     ]}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {N}
 */
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

      this._lengthDirty = true;
    }
    return removedHead;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @returns {(N | null)}
 */
  trimHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    let trimmedHead: N | null = null;
    const node = this.getExistingNode(valueOrNode, cb)?.node;

    if (node && node.prev) {
      trimmedHead = this._head as N;
      this._head = node;

      if (node.prev) {
        node.prev.next = null;
        node.prev = null;
      }

      this._lengthDirty = true;

      return trimmedHead;
    }
    return trimmedHead;
  }


  // === Tail Operations ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {N}
 */
  getTail() {
    return this._tail ?? null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {N}
 */
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

      this._lengthDirty = true;
    }
    return removedTail;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNode
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @returns {(N | null)}
 */
  trimTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    let trimmedHead: N | null = null;
    const node = this.getExistingNode(valueOrNode, cb)?.node;

    if (node && node.next) {
      trimmedHead = node.next as N;
      this._tail = node;

      if (node.next) {
        (node.next as N).prev = null;
        node.next = null;
      }

      this._lengthDirty = true;

      return trimmedHead;
    }
    return trimmedHead;
  }


  // === 'Many' Operations ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {ILinkedList<N, V>} items
 */
  protected prependList(items: ILinkedList<N, V>): void {
    if (!this._head) {
      this.replaceList(items);
    } else if (items.tail) {
      this._head.prev = items.tail;
      items.tail.next = this._head;

      this._head = items.head;

      this._lengthDirty = true;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {ILinkedList<N, V>} items
 */
  protected appendList(items: ILinkedList<N, V>): void {
    if (!this._tail) {
      this.replaceList(items);
    } else if (items.head) {
      (items.head as N).prev = this._tail;
      this._tail.next = items.head;

      this._tail = items.tail;

      this._lengthDirty = true;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} refNode
 * @param {ILinkedList<N, V>} items
 */
  protected insertListBefore(refNode: N, items: ILinkedList<N, V>): void {
    if (refNode.prev && items.head && items.tail) {
      items.head.prev = refNode.prev;
      items.tail.next = refNode;

      refNode.prev.next = items.head;
      refNode.prev = items.tail;

      this._lengthDirty = true;
    } else {
      this.prependList(items);
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {N} refNode
 * @param {ILinkedList<N, V>} items
 */
  protected insertListAfter(refNode: N, items: ILinkedList<N, V>): void {
    if (refNode.next && items.head && items.tail) {
      items.head.prev = refNode;
      items.tail.next = refNode.next;

      (refNode.next as N).prev = items.tail;
      refNode.next = items.head;

      this._lengthDirty = true;
    } else {
      this.appendList(items);
    }
  }


  // === Any Operations ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {V} value
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @param {boolean} [firstOnly=true]
 * @returns {{ nodes: N[], indices: number[] }\}
 */
  protected removeFirstOrAny(
    value: V,
    cb: EqualityCallbackOptions<V> = undefined,
    firstOnly: boolean = true
  ): { nodes: N[], indices: number[] } {
    const removedNodes: N[] = [];
    const indices: number[] = [];

    let count = 0;
    let currNode = this._head;
    let prevNode = null;
    while (currNode) {
      if (this.areEqual(value, currNode, cb)) {
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

        this._lengthDirty = true;

        removedNodes.push(removeNode);
        indices.push(count);
        if (firstOnly) {
          return { nodes: removedNodes, indices };
        }
      } else {
        prevNode = currNode;
        currNode = currNode.next as N;
      }
      count++;
    }

    return { nodes: removedNodes, indices };
  }


  // === Range Operations ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {(N | null)} startNode
 * @param {(N | null)} endNode
 * @returns {(N | null)}
 */
  protected removeFromToNodes(startNode: N | null, endNode: N | null): N | null {
    const lastTail = startNode?.prev as N;
    const nextHead = endNode?.next as N;
    const result = super.removeFromToNodes(startNode, endNode);

    if (result) {
      result.prev = null;
      if (nextHead) {
        nextHead.prev = lastTail;
      }
    }

    return result;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @param {(V | N)} valueOrNodeStart
 * @param {(V | N)} valueOrNodeEnd
 * @param {EqualityCallbackOptions<V>} [cb=undefined]
 * @returns {[
 *       LinkedList<N, V> | null,
 *       LinkedList<N, V> | null
 *     ]}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @returns {LinkedListSingle<V>}
 */
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
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {(V | N)} valueOrNode
 * @returns {N}
 */
  protected getAsNode(valueOrNode: V | N): N {
    return this.isNodeDouble(valueOrNode)
      ? valueOrNode as N
      : new NodeDouble(valueOrNode as V) as N;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @protected
 * @param {(V | N)} valueOrNode
 * @returns {boolean}
 */
  protected isNodeDouble(valueOrNode: V | N): boolean {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof NodeDouble);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @static
 * @template {NodeDouble<V>} N
 * @template V
 * @param {N} head
 * @param {?N} [tail]
 * @returns {LinkedList<N, V>}
 */
  static fromHead<N extends NodeDouble<V>, V>(head: N, tail?: N): LinkedList<N, V> {
    const linkedList = new LinkedList<N, V>();
    linkedList._head = head;

    if (tail) {
      linkedList._tail = tail;
      linkedList._lengthDirty = true;
    } else {
      let count = head ? 1 : 0;

      let currNode = head;
      while (currNode && currNode.next) {
        count++;
        currNode = currNode.next as N;
      }

      linkedList._tail = currNode;
      linkedList._length = count;
    }

    return linkedList;
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:33:22 PM
 *
 * @export
 * @class LinkedListDouble
 * @typedef {LinkedListDouble}
 * @template V
 * @extends {LinkedList<NodeDouble<V>, V>}
 */
export class LinkedListDouble<V> extends LinkedList<NodeDouble<V>, V> {

}

export { NodeDouble };