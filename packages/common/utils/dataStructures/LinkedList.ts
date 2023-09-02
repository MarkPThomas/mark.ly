import { Node } from './LinkedListNodes';

export interface ILinkedList<N extends Node<V>, V> {
  /**
   * Add value or node to the beginning of the list.
   *
   * @param {(V | N)} valueOrNode If a value is supplied, a node will be created to contain it.
   * @memberof ILinkedList
   */
  prepend(valueOrNode: V | N): void;
  /**
   * Add value or node to the end of the list.
   *
   * @param {(V | N)} valueOrNode If a value is supplied, a node will be created to contain it.
   * @memberof ILinkedList
   */
  append(valueOrNode: V | N): void;
  /**
   * Finds and returns the node or node with a matching value in the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  find(valueOrNode: V | N): N | null;
  /**
   * Removes and returns the node or node with a matching value in the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @return {*}  {(N | null)} The node removed.
   * @memberof ILinkedList
   */
  remove(valueOrNode: V | N): N | null;
  /**
   * Moves the node or node with a matching value in the list the specified number of steps in the specified direction.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {number} spaces The number of nodes to move the node. + = forward/next. - = backward/prev.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  move(valueOrNode: V | N, spaces: number): boolean;

  /**
   * Add an array of values or nodes to the beginning of the list, maintaining array order.
   *
   * @param {(V[] | ILinkedList<N, V>)} items If an array of values is supplied, a nodes will be created to contain them.
   * @memberof ILinkedList
   */
  prependMany(items: V[] | ILinkedList<N, V>): void;
  /**
   * Add an array of values or nodes to the end of the list, maintaining array order.
   *
   * @param {(V[] | ILinkedList<N, V>)} items If an array of values is supplied, a nodes will be created to contain them.
   * @memberof ILinkedList
   */
  appendMany(items: V[] | ILinkedList<N, V>): void;

  /**
   * Returns the head node.
   *
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  getHead(): N | null;
  /**
   * Removes and returns the current head node, and resets it to the next node if available.
   *
   * @return {*}  {(N | null)} The head node removed.
   * @memberof ILinkedList
   */
  removeHead(): N | null;
  /**
   * Moves the node or node with a matching value in the list to the head of the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  moveToHead(valueOrNode: V | N): boolean;

  /**
   * Returns the tail node.
   *
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  getTail(): N | null;
  /**
   * Removes and returns the current tail node, and resets it to the next previous node if available.
   *
   * @return {*}  {(N | null)} The tail removed.
   * @memberof ILinkedList
   */
  removeTail(): N | null;
  /**
   * Moves the node or node with a matching value in the list to the tail of the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  moveToTail(valueOrNode: V | N): boolean;

  /**
   * Returns the number of nodes in the list.
   *
   * @return {*}  {number}
   * @memberof ILinkedList
   */
  size(): number;
  /**
   * Creates an array of values contained in the list nodes, in the order of the nodes in the list.
   *
   * @return {*}  {(V[] | any[])}
   * @memberof ILinkedList
   */
  toArray(): V[] | any[];
  /**
   * Sets an override default callback for determining a value match for any operation on the list that requires finding a match.
   *
   * If not set, === will be used unless the value implements {@link IEquatable}.
   *
   * @param {(a: V, b: V) => boolean} callBack
   * @memberof ILinkedList
   */
  setMatchCB(callBack: (a: V, b: V) => boolean): void;
  /**
   * Reverses the list in place.
   *
   * @memberof ILinkedList
   */
  reverse(): void;
  /**
   * Return two new lists split at the specified value or node.
   *
   * The node specified is duplicated such that it becomes the end node of the first list, and start node of the second list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @return {*}  {[ILinkedList<N, V>, ILinkedList<N, V>]} Returns an empty array if no value or node match is found.
   * @memberof ILinkedList
   */
  splitAt(valueOrNode: V | N): [ILinkedList<N, V> | undefined, ILinkedList<N, V> | undefined];
  /**
   * Returns two new lists split at the specified starting and ending values or nodes.
   *
   * Unless the start and end value or node are the same, these nodes will end up in separate lists,
   * and all nodes in between will be not be included in either returned list.
   *
   * @param {(V | N)} valueOrNodeStart Value or node that determines the end of the first list returned.
   *
   * If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {(V | N)} valueOrNodeEnd Value or node that determines the start of the second list returned.
   *
   * Matching criteria is the same as for {@link valueOrNodeStart}.
   * @return {*}  {[ILinkedList<N, V>, ILinkedList<N, V>]}
   *
   * If only the start value or node is found, only the first list is returned, up to the start value or node.
   *
   * If only the end value or node is found, only the second list is returned, up to the end value or node.
   * The first array index will be empty as a placeholder.
   *
   * Returns an empty array if no value or node match is found for either value or node.
   * @memberof ILinkedList
   */
  splitBetween(valueOrNodeStart: V | N, valueOrNodeEnd: V | N): [ILinkedList<N, V> | undefined, ILinkedList<N, V> | undefined];
}

export abstract class LinkedList<N extends Node<V>, V> implements ILinkedList<N, V> {
  protected length: number = 0;
  protected head: N | null = null;
  protected tail: N | null = null;
  protected callBack: ((a: V, b: V) => boolean) | undefined = undefined;

  constructor(items: V[] | null = null) {
    if (items !== null) {
      this.fromArray(items);
    }
  }

  fromHeadTail(head: N, tail: N) {
    this.head = head;

    this.tail = tail;
    this.tail.next = null;
  }

  find(
    valueOrNode: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ) {
    let node = this.head;
    while (node) {
      if (this.areEqual(valueOrNode, node, cb)) {
        return node;
      }
      node = node.next as N;
    }
    return null;
  }

  getHead() {
    return this.head ?? null;
  }

  getTail() {
    return this.tail ?? null;
  }

  moveToHead(valueOrNode: V | N) {
    if (this.remove(valueOrNode) !== null) {
      this.prepend(valueOrNode);
      return true;
    }
    return false;
  }

  moveToTail(valueOrNode: V | N) {
    if (this.remove(valueOrNode) !== null) {
      this.append(valueOrNode);
      return true;
    }
    return false;
  }

  prependMany(items: V[] | LinkedList<N, V>) {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      for (let i = itemsAsArray.length - 1; 0 <= i; i--) {
        this.prepend(itemsAsArray[i]);
      }
    } else {
      const itemsAsList = items as LinkedList<N, V>;
      if (!this.head) {
        this.head = itemsAsList.head;
        this.tail = itemsAsList.tail;
      } else if (itemsAsList.tail) {
        itemsAsList.tail.next = this.head;
        this.head = itemsAsList.head;
      }
    }
  }

  appendMany(items: V[] | LinkedList<N, V>) {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      itemsAsArray.forEach((item) => {
        this.append(item);
      });
    } else {
      const itemsAsList = items as LinkedList<N, V>;
      if (!this.tail) {
        this.head = itemsAsList.head;
        this.tail = itemsAsList.tail;
      } else if (itemsAsList.tail) {
        this.tail.next = itemsAsList.head;
        this.tail = itemsAsList.tail;
      }
    }
  }

  size() {
    return this.length;
  }

  toArray() {
    const output = [];
    let node = this.head;
    while (node) {
      const propsVals = node.toObject();
      if (Object.keys(propsVals).length === 1 && propsVals.hasOwnProperty('val')) {
        output.push(propsVals.val);
      } else {
        output.push(propsVals);
      }

      node = node.next as N;
    }

    return output;
  }

  setMatchCB(callBack: (a: V, b: V) => boolean) {
    this.callBack = callBack;
  }

  protected getNode(valueOrNode: V | Node<V>) {
    return (typeof valueOrNode === 'object' && valueOrNode instanceof Node)
      ? valueOrNode as Node<V>
      : new Node(valueOrNode as V);
  }

  protected areEqual(
    valueOrNode: V | Node<V>,
    node: Node<V>,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined) {

    if (cb === undefined) {
      cb = this.callBack;
    } else if (cb === null) {
      cb = undefined;
    }

    return ((!(valueOrNode instanceof Node) && node.equals(valueOrNode as V, cb))
      || node.val === (valueOrNode as Node<V>).val)
  }

  protected fromArray(items: V[]) {
    for (let i = items.length - 1; 0 <= i; i--) {
      this.prepend(items[i]);
    }
  }

  protected splitAtBase(
    leftList: LinkedList<N, V>,
    rightList: LinkedList<N, V>,
    valueOrNode: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): [LinkedList<N, V> | undefined, LinkedList<N, V> | undefined] {
    let currentList = leftList;

    let itemFound = false;

    let currNode = this.head as N;
    while (currNode) {
      currentList.append(currNode.val);
      if (this.areEqual(valueOrNode, currNode, cb)) {
        itemFound = true;
        currentList = rightList;
        currentList.append(currNode.clone().val);
      }

      currNode = currNode.next as N;
    }

    return itemFound ? [leftList, rightList] : [undefined, undefined];
  }

  protected splitBetweenBase(
    leftList: LinkedList<N, V>,
    rightList: LinkedList<N, V>,
    valueOrNodeStart: V | N,
    valueOrNodeEnd: V | N,
    cb: ((a: V, b: V) => boolean) | undefined | null = undefined
  ): [LinkedList<N, V> | undefined, LinkedList<N, V> | undefined] {
    let startItemFound = false;
    let endItemFound = false;

    let currNode = this.head as N;
    while (currNode) {
      if (!startItemFound) {
        leftList.append(currNode.val);
      }

      if (this.areEqual(valueOrNodeStart, currNode, cb)) {
        startItemFound = true;
      }

      if (this.areEqual(valueOrNodeEnd, currNode, cb)) {
        endItemFound = true;
      }

      if (endItemFound) {
        if (rightList.size() === 0 && this.areEqual(valueOrNodeStart, currNode, cb)) {
          rightList.append(currNode.clone().val);
        } else {
          rightList.append(currNode.val);
        }
      }

      currNode = currNode.next as N;
    }

    return startItemFound && endItemFound
      ? [leftList, rightList] :
      startItemFound
        ? [leftList, undefined]
        : endItemFound
          ? [undefined, rightList]
          : [undefined, undefined];
  }

  abstract prepend(valueOrNode: V | N): void;
  abstract append(valueOrNode: V | N): void;

  abstract remove(valueOrNode: V | N): N | null;
  abstract removeHead(): N | null;
  abstract removeTail(): N | null;

  abstract move(valueOrNode: V | N, spaces: number): boolean;

  abstract reverse(): void;
  abstract splitAt(valueOrNode: V | N): [ILinkedList<N, V> | undefined, ILinkedList<N, V> | undefined];
  abstract splitBetween(valueOrNodeStart: V | N, valueOrNodeEnd: V | N): [ILinkedList<N, V> | undefined, ILinkedList<N, V> | undefined];
}

export { Node };