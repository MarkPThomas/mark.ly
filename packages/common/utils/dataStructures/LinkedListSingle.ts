import { LinkedList as LinkedListBase, Node as NodeSingle } from './LinkedList';
import { LinkedListDouble } from './LinkedListDouble';

export class LinkedList<N extends NodeSingle<V>, V> extends LinkedListBase<N, V> {
  prepend(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);
    node.next = this.head;
    if (node.next === null) {
      this.tail = node as N;
    }
    this.head = node as N;
    this.length++;
  }

  append(valueOrNode: V | N) {
    const node = this.getNode(valueOrNode);
    let currNode = this.head;
    while (currNode && currNode.next) {
      currNode = currNode.next as N;
    }
    if (currNode) {
      currNode.next = node;
    } else {
      this.head = node as N;
    }
    this.tail = node as N;
    this.length++;
  }

  remove(
    valueOrNode: V | N,
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
          this.head = currNode.next as N;
          if (!this.head) {
            this.tail = null;
          }
        }
        this.length--;

        return currNode;
      }
      prevNode = currNode;
      currNode = currNode.next as N;
    }

    return null;
  }

  removeHead() {
    const removedHead: N | null = this.head;
    if (removedHead) {
      let nextHead = removedHead.next;
      if (!removedHead.next) {
        this.tail = null;
      }
      removedHead.next = null;
      this.head = nextHead as N;
      this.length--;
    }
    return removedHead as N;
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
      node = node.next as N;
    }
    if (prevNode) {
      prevNode.next = null;
      this.tail = prevNode;
    }
    this.length--;
    return node;
  }

  move(
    valueOrNode: V | N,
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
          this.head = currNode.next as N;
        }

        if (spaces > 0) {
          prevNode = currNode;
          currNode = currNode.next as N;
        } else {
          prevNode = null;
          currNode = this.head;
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
        if (this.head === currNode) {
          this.head = nodeMove;
        }

        return true;
      }
      prevNode = currNode;
      currNode = currNode.next as N;
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
      currNode = tempNode as N;
    }
    this.head = prevNode;
  }

  splitAt(
    valueOrNode: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): [LinkedList<N, V> | undefined, LinkedList<N, V> | undefined] {
    const leftList = new LinkedList<N, V>();
    const rightList = new LinkedList<N, V>();

    const result = this.splitAtBase(leftList, rightList, valueOrNode, cb);

    return [result[0] as LinkedList<N, V>, result[1] as LinkedList<N, V>]
  }

  splitBetween(
    valueOrNodeStart: V | N,
    valueOrNodeEnd: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): [LinkedList<N, V> | undefined, LinkedList<N, V> | undefined] {
    const leftList = new LinkedList<N, V>();
    const rightList = new LinkedList<N, V>();

    const result = this.splitBetweenBase(leftList, rightList, valueOrNodeStart, valueOrNodeEnd, cb);

    return [result[0] as LinkedList<N, V>, result[1] as LinkedList<N, V>]
  }

  toLinkedListDouble() {
    const linkedList = new LinkedListDouble<V>();
    let currNode = this.head;
    while (currNode) {
      linkedList.append(currNode.val);
      currNode = currNode.next as N;
    }

    return linkedList;
  }
}

export class LinkedListSingle<V> extends LinkedList<NodeSingle<V>, V> {

}

export { NodeSingle };