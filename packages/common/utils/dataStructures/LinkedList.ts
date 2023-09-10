import { Node } from './LinkedListNodes';

// TODO: Not used yet. Consider if to be used, & flesh out documentation better.
/**
 * If a node is supplied, object reference pointers determine a match.
 *
 * If a value is supplied, node values will be compared to determine a match.
 *
 * In either case, matches may be overridden by the equality callback provided, or otherwise the list default equality callback.
 *
 * @template V A value of the list value type.
 * @template N A node of the list node type.
 */
export type VorN<V, N> = V | N;

/**
 * A function that determines equality.
 * The return value should be a boolean that indicates equality.
 *
 * @param {V} a The first element for comparison. Will never be `undefined`.
 * @param {V} b The second element for comparison. Will never be `undefined`.
 */
export type EqualityCallback<V> = (a: V, b: V) => boolean;
/**
 * Callback options by which a match of nodes is to be determined.
 * Overrides the default callback, if any, set by {@link setEqualityCB}.
 *
 * If `undefined`/not provided, the default callback assigned to the linked list will be used.
 *
 * If specified as `null`, reference equality `===` will be used even if the linked list has a default callback assigned.
 */
export type EqualityCallbackOptions<V> = EqualityCallback<V> | undefined | null;
/**
 * A function that defines the sort order.
 * The return value should be a number whose sign indicates the relative order of the two elements:
 *
 * * Negative if a is less than b
 *
 * * Positive if a is greater than b
 *
 * * Zero if they are equal
 *
 * @param {V} a The first element for comparison. Will never be `undefined`.
 * @param {V} b The second element for comparison. Will never be `undefined`.
 *
 */
export type ComparisonCallback<V> = (a: V, b: V) => number;

// /**
//  * The number of items successfully inserted & the number of nodes removed in the process.
//  *
//  * @interface IReplaceBetween
//  */
// interface IReplaceBetween {
//   inserted: number,
//   removed: number,
// }

// TODO: Do the following the same with the cb parameter.
// TODO: Create ValueOrNode type with documentation and the following (+ remove from documentation here):
// If a node is supplied, object reference pointers determine a match.
//    *
// * If a value is supplied, node values will be compared to determine a match.
// * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.

/**
 *
 *
 * @export
 * @interface ILinkedList
 * @template { Node<V> } N
 * @template V
 */
export interface ILinkedList<N extends Node<V>, V> {
  // === Single Item Operations ===
  /**
   * Finds and returns the first value or node with a matching value in the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {EqualityCallbackOptions<V>} cb Function by which a match of nodes is to be determined.
   * Overrides the default callback, if any, set by {@link setEqualityCB}.
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  find(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;
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
   * Replaces and returns the first value or node with a matching value in the list.
   *
   * @param {(V | N)} targetValueOrNode
   * @param {(V | N)} replaceValueOrNode
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb
   * @return {*}  {boolean}
   * @memberof ILinkedList
   */
  replace(
    targetValueOrNode: V | N,
    replaceValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;
  /**
   * Removes and returns the first value or node with a matching value in the list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {(N | null)} The node removed.
   * @memberof ILinkedList
   */
  remove(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;
  /**
   * Moves the node or node with a matching value in the list the specified number of steps in the specified direction.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {number} spaces The number of nodes to move the node. + = forward/next. - = backward/prev.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  move(
    valueOrNode: V | N,
    spaces: number,
    cb: EqualityCallbackOptions<V>
  ): boolean;
  /**
   * Inserts the provided value or node just before the referenced value or node.
   *
   * @param {(V | N)} refValueOrNode The reference value or node before which the provided value or node is to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} insertValueOrNode The provided value or node to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean} True if insertion was successful. False otherwise.
   * @memberof ILinkedList
   */
  insertBefore(
    refValueOrNode: V | N,
    insertValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): boolean;
  /**
   * Inserts the provided value or node just after the referenced value or node.
   *
   * @param {(V | N)} refValueOrNode The reference value or node after which the provided value or node is to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} insertValueOrNode The provided value or node to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean} True if insertion was successful. False otherwise.
   * @memberof ILinkedList
   */
  insertAfter(
    refValueOrNode: V | N,
    insertValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): boolean;
  /**
   * Return two new lists split at the specified value or node.
   *
   * The node specified is duplicated such that it becomes the end node of the first list, and start node of the second list.
   *
   * @param {(V | N)} valueOrNode If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {[ILinkedList<N, V>, ILinkedList<N, V>]} Returns an empty array if no value or node match is found.
   * @memberof ILinkedList
   */
  splitAt(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ];


  // === Head Operations ===
  /**
   * Returns the head node.
   *
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  head: N | null;
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
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  moveToHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): boolean;


  // === Tail Operations ===
  /**
   * Returns the tail node.
   *
   * @return {*}  {(N | null)}
   * @memberof ILinkedList
   */
  tail: N | null;
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
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {boolean} True if the node was found and moved. False otherwise.
   * @memberof ILinkedList
   */
  moveToTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): boolean;


  // === 'Many' Operations ===
  /**
   * Add an array of values or nodes to the beginning of the list, maintaining array order.
   *
   * @param {(V[] | ILinkedList<N, V>)} items If an array of values is supplied, a nodes will be created to contain them.
   * @memberof ILinkedList
   */
  prependMany(items: V[] | N[] | ILinkedList<N, V>): number;
  /**
   * Add an array of values or nodes to the end of the list, maintaining array order.
   *
   * @param {(V[] | ILinkedList<N, V>)} items If an array of values is supplied, a nodes will be created to contain them.
   * @memberof ILinkedList
   */
  appendMany(items: V[] | N[] | ILinkedList<N, V>): number;
  /**
   * Inserts the provided value or node just before the referenced value or node.
   *
   * @param {(V | N)} refValueOrNode The reference value or node before which the provided value or node is to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V[] | ILinkedList<N, V>)} items Items to be inserted.
   * If an array of values is supplied, a nodes will be created to contain them.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {number} The number of items successfully inserted.
   * @memberof ILinkedList
   */
  insertManyBefore(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V>
  ): number;
  /**
   * Inserts the provided value or node just after the referenced value or node.
   *
   * @param {(V | N)} refValueOrNode The reference value or node after which the provided value or node is to be inserted.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V[] | ILinkedList<N, V>)} items Items to be inserted.
   * If an array of values is supplied, a nodes will be created to contain them.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {number} The number of items successfully inserted.
   * @memberof ILinkedList
   */
  insertManyAfter(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V>
  ): number;

  // === Any Operations ===
  /**
   * Finds and returns any nodes that match the provided matching criteria.
   * @param {(V | N)} valueOrNode
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * @return {*}  {N} The nodes found.
   * @memberof ILinkedList
   */
  findAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N[];
  /**
   * Removes and returns any nodes that match the provided matching criteria.
   * @param {(V | N)} valueOrNode
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * @return {*}  {N} The nodes removed.
   * @memberof ILinkedList
   */
  removeAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N[];

  // === Range Operations ===
  /**
   * Range is defined by the start node, end node, and count of total nodes within the range.
   * The start/end of the range is exclusive of the provided start and end values or nodes.
   *
   * @param {(V | N)} startValueOrNode Value or node indicating the start of the range.
   * If not found while the end is, this is taken to be the head of the list.
   * @param {(V | N)} endValueOrNode Value or node indicating the end of the range.
   * If not found while the start is, this is taken to be the tail of the list.
    * @param {EqualityCallbackOptions<V>} cb
   * @return {*}  {({
   *     startNode: N | null,
   *     endNode: N | null,
   *     length: number
   *   })}
   * @memberof ILinkedList
   */
  findRangeBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  };
  /**
   * Range is defined by the start node, end node, and count of total nodes within the range.
   * The start/end of the range is inclusive of the provided start and end values or nodes.
   *
   * @param {(V | N)} startValueOrNode Value or node indicating the start of the range.
   * If not found while the end is, this is taken to be the head of the list.
   * @param {(V | N)} endValueOrNode Value or node indicating the end of the range.
   * If not found while the start is, this is taken to be the tail of the list.
   * @param {EqualityCallbackOptions<V>} cb
   * @return {*}  {({
   *     startNode: N | null,
   *     endNode: N | null,
   *     length: number
   *   })}
   * @memberof ILinkedList
   */
  findRangeFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  };
  /**
   * Removes all nodes between the provided values or nodes. Provided values or nodes are retained.
   *
   * @param {(V | N)} startValueOrNode The reference value or node after which nodes will be removed.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} endValueOrNode The reference value or node before which nodes will be removed.
   * If a value is supplied, a node will be created to contain it.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb
   * @return {*}  {({ startNode: N, endNode: N } | null)} The nodes remaining at the start & end of the removal.
   *
   * Returns null if operation failed.
   * @memberof ILinkedList
   */
  removeBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): {
    count: number,
    head: N | null
  };
  /**
   * Removes all nodes from the start value or node to the end value or node.
   * These provided values or nodes will also be removed.
   *
   * @param {(V | N)} startValueOrNode The reference value or node from which nodes will be removed.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} endValueOrNode The reference value or node to which nodes will be removed.
   * If a value is supplied, a node will be created to contain it.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb
   * @return {*}  {({ startNode: N, endNode: N } | null)} The nodes remaining at the start & end of the removal.
   *
   * Returns null if operation failed.
   * @memberof ILinkedList
   */
  removeFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): {
    count: number,
    head: N | null
  };
  /**
   * Replaces items between the start and end values or nodes with the provided items. Provided values or nodes are retained.
   *
   * @param {(V | N)} startValueOrNode The reference value or node after which the items will be replaced.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} endValueOrNode The reference value or node before which the items will be replaced.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V[] | ILinkedList<N, V>)} items
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {({ inserted: number, removed: number } | null)}
   * The number of items successfully inserted & the number of nodes removed in the process.
   *
   * Returns null if operation failed.
   * @memberof ILinkedList
   */
  replaceBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V>
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  };
  /**
   * Replaces all nodes from the start value or node to the end value or node.
   * These provided values or nodes will also be replaced.
   *
   * @param {(V | N)} startValueOrNode The reference value or node after which the items will be replaced.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V | N)} endValueOrNode The reference value or node before which the items will be replaced.
   * If a value is supplied, a node will be created to contain it.
   * @param {(V[] | ILinkedList<N, V>)} items
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {*}  {({ inserted: number, removed: number } | null)}
   * The number of items successfully inserted & the number of nodes removed in the process.
   *
   * Returns null if operation failed.
   * @memberof ILinkedList
   */
  replaceFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V>
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  };
  /**
   * Returns two new lists split at the specified starting and ending values or nodes.
   *
   * Unless the start and end value or node are the same, these nodes will end up in separate lists,
   * and all nodes in between will be not be included in either returned list.
   *
   * @param {(V | N)} startValueOrNode Value or node that determines the end of the first list returned.
   *
   * If a node is supplied, object reference pointers determine a match.
   *
   * If a value is supplied, node values will be compared to determine a match.
   * Comparison defaults to {@link IEquatable} comparison if supplied, else compares with === or an overridden default comparison callback.
   * @param {(V | N)} endValueOrNode Value or node that determines the start of the second list returned.
   *
   * Matching criteria is the same as for {@link valueOrNodeStart}.
   * @param {(((a: V, b: V) => boolean) | undefined | null)} cb Comparison callback by which a match of nodes is to be determined.
   * Overrides the override default callback, if any, set by {@link setEqualityCB}.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
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
  splitBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ];

  // === Misc Operations ===
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
   * If not set, reference equality === will be used.
   *
   * @param {(a: V, b: V) => boolean} callBack
   * @memberof ILinkedList
   */
  setEqualityCB(callBack: EqualityCallback<V>): void;
  /**
   * Reverses the list in place.
   *
   * @memberof ILinkedList
   */
  reverse(): void;
  // TODO: Implement
  // /**
  //  * Orders the nodes in the list by the provided value criteria.
  //  *
  //  * @param {((a: V, b: V) => number)} cb
  //  * @memberof ILinkedList
  //  */
  // orderBy(cb: ComparisonCallback<V>): void;
}

export abstract class LinkedList<N extends Node<V>, V> implements ILinkedList<N, V> {
  protected _length: number = 0;
  protected _head: N | null = null;
  protected _tail: N | null = null;
  protected callBack: EqualityCallback<V> | undefined = undefined;

  constructor(items: V[] | null = null) {
    if (items !== null) {
      this.prependFromArray(items);
    }
  }

  protected prependFromArray(items: V[]) {
    for (let i = items.length - 1; 0 <= i; i--) {
      this.prepend(items[i]);
    }
  }

  // === Single Item Operations ===
  find(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    const nodes = this.findFirstOrAny(valueOrNode, cb, true)[0];

    return nodes ?? null;
  }

  abstract prepend(valueOrNode: V | N): void;
  abstract append(valueOrNode: V | N): void;

  replace(
    targetValueOrNode: V | N,
    replaceValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    const targetNode = this.find(targetValueOrNode, cb);

    if (targetNode && this.insertAfter(targetNode, replaceValueOrNode, cb)) {
      return this.remove(targetNode, cb);
    }
    return null;
  }

  protected replaceList(items: ILinkedList<N, V>): void {
    this._head = items.head;
    this._tail = items.tail;
    this._length = items.size();
  }

  remove(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    const nodes = this.removeFirstOrAny(valueOrNode, cb, true)[0];

    return nodes ?? null;
  }

  abstract move(
    valueOrNode: V | N,
    spaces: number,
    cb: EqualityCallbackOptions<V>
  ): boolean;

  insertBefore(
    refValueOrNode: V | N,
    insertValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const refNode = this.find(refValueOrNode, cb);
    if (!refNode) {
      return false;
    }

    const insertNode = this.getNode(insertValueOrNode) as N;
    this.insertBeforeNode(refNode, insertNode);
    return true;
  }

  protected abstract insertBeforeNode(
    existingNode: N,
    insertNode: N
  ): void;


  insertAfter(
    refValueOrNode: V | N,
    insertValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const refNode = this.find(refValueOrNode, cb);
    if (!refNode) {
      return false;
    }

    const insertNode = this.getNode(insertValueOrNode) as N;
    this.insertAfterNode(refNode, insertNode);
    return true;
  }

  protected abstract insertAfterNode(
    existingNode: N,
    insertNode: N
  ): void;


  abstract splitAt(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ];

  protected splitAtBase(
    leftList: ILinkedList<N, V>,
    rightList: ILinkedList<N, V>,
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): [
      ILinkedList<N, V> | null,
      ILinkedList<N, V> | null
    ] {
    let currentList = leftList;

    let itemFound = false;

    let currNode = this._head as N;
    while (currNode) {
      currentList.append(currNode.val);
      if (this.areEqual(valueOrNode, currNode, cb)) {
        itemFound = true;
        currentList = rightList;
        currentList.append(currNode.clone().val);
      }

      currNode = currNode.next as N;
    }

    return itemFound ? [leftList, rightList] : [null, null];
  }


  // === Head Operations ===
  get head(): N | null {
    return this._head ?? null;
  }

  abstract removeHead(): N | null;

  moveToHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const node = this.remove(valueOrNode, cb);
    if (node !== null) {
      this.prepend(node);
      return true;
    }
    return false;
  }


  // === Tail Operations ===
  get tail(): N | null {
    return this._tail ?? null;
  }

  abstract removeTail(): N | null;

  moveToTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const node = this.remove(valueOrNode, cb);
    if (node !== null) {
      this.append(node);
      return true;
    }
    return false;
  }


  // === 'Many' Operations ===
  prependMany(items: V[] | N[] | ILinkedList<N, V>): number {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      for (let i = itemsAsArray.length - 1; 0 <= i; i--) {
        this.prepend(itemsAsArray[i]);
      }
      return items.length;
    } else {
      this.prependList(items);
      return items.size();
    }
  }

  protected abstract prependList(items: ILinkedList<N, V>): void;

  appendMany(items: V[] | N[] | ILinkedList<N, V>): number {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      itemsAsArray.forEach((item) => {
        this.append(item);
      });
      return items.length;
    } else {
      this.appendList(items);
      return items.size();
    }
  }

  protected abstract appendList(items: ILinkedList<N, V>): void;

  insertManyBefore(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V> = undefined
  ): number {
    const refNode = this.find(refValueOrNode, cb);
    if (!refNode) {
      // TODO: In any case of this refNode find pattern, determine a better way to report errors.
      console.log('Reference value or node not found', refValueOrNode);
      return 0;
    }

    let count = 0;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        if (this.insertBefore(refNode, item)) {
          count++;
        }
      });
    } else {
      this.insertListBefore(refNode, items);
      count = items.size();
    }
    return count;
  }

  protected abstract insertListBefore(refNode: N, items: ILinkedList<N, V>): void;


  insertManyAfter(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V> = undefined
  ): number {
    const refNode = this.find(refValueOrNode, cb);
    if (!refNode) {
      return 0;
    }

    let count = 0;
    if (Array.isArray(items)) {
      for (let i = items.length - 1; 0 <= i; i--) {
        const item = items[i];
        if (this.insertAfter(refNode, item)) {
          count++;
        }
      }
    } else {
      this.insertListAfter(refNode, items);
      count = items.size();
    }
    return count;
  }

  protected abstract insertListAfter(refNode: N, items: ILinkedList<N, V>): void;

  // === Any Operations ===
  findAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N[] {
    return this.findFirstOrAny(valueOrNode, cb, false);
  }

  protected findFirstOrAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>,
    firstOnly: boolean = true
  ): N[] {
    const nodes = [];
    let node = this._head;
    while (node) {
      if (this.areEqual(valueOrNode, node, cb)) {
        nodes.push(node);
        if (firstOnly) {
          return nodes;
        }
      }
      node = node.next as N;
    }
    return nodes;
  }

  removeAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N[] {
    return this.removeFirstOrAny(valueOrNode, cb, false);
  }

  protected abstract removeFirstOrAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>,
    firstOnly: boolean
  ): N[];


  // === Range Operations ===
  findRangeBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    return this.findRange(startValueOrNode, endValueOrNode, false, cb);
  }

  findRangeFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    return this.findRange(startValueOrNode, endValueOrNode, true, cb);
  }


  protected findRange(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    inclusive: boolean,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    const nodesAndCounts = this.findNodesAndCounts(startValueOrNode, endValueOrNode, cb);

    let startNodeCount = nodesAndCounts.startNodeCount;
    let endNodeCount = nodesAndCounts.endNodeCount;

    // Update counts to account for certain edge cases
    if (this.isSpecified(startValueOrNode) && !nodesAndCounts.startNode) {
      // Start node not found
      startNodeCount = inclusive ? 1 : 0;
    } else if (
      this.isSpecified(endValueOrNode)
      && endNodeCount >= startNodeCount
      && !inclusive
      && !nodesAndCounts.endNode
    ) {
      // End node not found, end node not found, for exclusive case
      endNodeCount++;
    }
    let nodeSeparation = endNodeCount - startNodeCount + (inclusive ? 1 : -1);

    if (nodeSeparation <= 0 || (!nodesAndCounts.startNode && !nodesAndCounts.endNode)) {
      return {
        startNode: null,
        endNode: null,
        length: 0
      };
    }

    if (inclusive) {
      const startNode = nodesAndCounts.startNode ?? this._head;
      const endNode = nodesAndCounts.endNode ?? this._tail;
      return {
        startNode,
        endNode,
        length: nodeSeparation
      };
    } else {
      const startNodeNext = nodesAndCounts.startNode ? nodesAndCounts.startNode.next as N : null; //this._head;
      const endNodePrev = nodesAndCounts.endNode ? nodesAndCounts.endNodePrev : null; // ?? this._tail;
      return {
        startNode: startNodeNext,
        endNode: endNodePrev,
        length: nodeSeparation
      };
    }
  }

  protected findNodesAndCounts(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ) {
    let startNode: N | null = null;
    let startNodeCount = 0;

    let endNode: N | null = null;
    let endNodeCount = 0;

    // Correction handling either of these as null
    if (!this.isSpecified(startValueOrNode)) {
      startNode = this._head;
    }
    if (!this.isSpecified(endValueOrNode)) {
      endNode = this._tail;
    }

    let currNode = this._head;
    let prevNode = null;
    while (currNode) {
      if (!startNode) {
        startNodeCount++;
        if (this.areEqual(startValueOrNode, currNode, cb)) {
          startNode = currNode;
        }
      }

      if (!endNode) {
        endNodeCount++;
        if (this.areEqual(endValueOrNode, currNode, cb)) {
          endNode = currNode;
        }
      }

      if (startNode && endNode) {
        break;
      }

      if (!endNode) {
        prevNode = currNode;
      }
      currNode = currNode.next as N;
    }

    // Correction handling either of these as null
    if (!this.isSpecified(startValueOrNode)) {
      startNode = null;
      startNodeCount = 0;
    }
    if (!this.isSpecified(endValueOrNode)) {
      endNode = null;
      endNodeCount = this._length;
    }

    return {
      startNode,
      startNodeCount,
      endNode,
      endNodeCount,
      endNodePrev: prevNode
    }
  }


  removeBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    count: number,
    head: N | null
  } {
    const { startNode, endNode, length } = this.findRangeBetween(startValueOrNode, endValueOrNode, cb);
    const removedHead = this.removeFromToNodes(startNode, endNode);

    if (removedHead) {
      this._length -= length;
    }

    return {
      count: length,
      head: removedHead
    }
  }


  removeFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    count: number,
    head: N | null
  } {
    const { startNode, endNode, length } = this.findRangeFromTo(startValueOrNode, endValueOrNode, cb);
    const removedHead = this.removeFromToNodes(startNode, endNode);

    if (removedHead) {
      this._length -= length;
    }

    return {
      count: length,
      head: removedHead
    }
  }

  protected removeFromToNodes(startNode: N | null, endNode: N | null): N | null {
    if (!startNode && !endNode) {
      return null;
    } else if (startNode && endNode) {
      // remove as normal
      const startNodePrev = this.getPriorNode(startNode!, null);
      if (!startNodePrev && !endNode.next) {
        // At head & tail. Remove entire list
        this._head = null;
        this._tail = null;
      } else if (!startNodePrev) {
        // Starting at head
        this._head = endNode.next as N;
        endNode.next = null;
      } else if (!endNode.next) {
        // Ending at tail
        this._tail = startNodePrev;
        startNodePrev.next = null;
      } else {
        startNodePrev.next = endNode.next;
        endNode.next = null;
      }
      return startNode;
    } else if (endNode) {
      // Remove from head to end node
      if (!endNode.next) {
        // Ending at tail. Remove entire list
        this._head = null;
        this._tail = null;
      } else {
        startNode = this._head;
        this._head = endNode.next as N;
        endNode.next = null;
      }
      return startNode;
    } else {
      // Remove from start node to tail
      const startNodePrev = this.getPriorNode(startNode!, null);
      if (!startNodePrev) {
        // Starting at head. Remove entire list
        this._head = null;
        this._tail = null;
      } else {
        this._tail = startNodePrev;
        startNodePrev.next = null;
      }
      return startNode;
    }
  }


  protected isSpecified(valueOrNode: V | N): boolean {
    return valueOrNode !== undefined && valueOrNode !== null;
  }

  protected matchesHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    return this.isSpecified(this._head as N)
      && this.isSpecified(valueOrNode)
      && this.areEqual(valueOrNode, this._head as N, cb)
  }

  protected matchesTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    return this.isSpecified(this._tail as N)
      && this.isSpecified(valueOrNode)
      && this.areEqual(valueOrNode, this._tail as N, cb)
  }

  replaceBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  } {
    const initialHead = this._head as N;
    let removedNodes = this.removeBetween(startValueOrNode, endValueOrNode, cb);

    let insertedCount: number;
    if (removedNodes.head === null) {
      // No nodes removed
      if (this.matchesHead(endValueOrNode)) {
        insertedCount = this.prependMany(items);
      } else if (this.matchesTail(startValueOrNode)) {
        insertedCount = this.appendMany(items);
      } else if (this.isSpecified(startValueOrNode) && this.isSpecified(endValueOrNode)) {
        const startNode = this.find(startValueOrNode);
        const startNodeNext = startNode?.next as N;

        if (startNode && startNodeNext && this.areEqual(endValueOrNode, startNodeNext, cb)) {
          // Target nodes are adjacent. Just insert in between.
          insertedCount = this.insertManyAfter(startNode, items, cb);
        } else {
          insertedCount = 0;
        }
      } else {
        insertedCount = 0;
      }
    } else if (this.areEqual(initialHead, removedNodes.head, cb)) {
      // head was removed
      insertedCount = this.prependMany(items);
    } else {
      const insertRefNode = this.getNode(startValueOrNode);
      insertedCount = this.insertManyAfter(insertRefNode, items, cb);
    }


    return {
      insertedCount,
      removedCount: removedNodes.count,
      removedHead: removedNodes.head
    };
  }

  replaceFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  } {
    const initialHead = this._head as N;
    const initialTail = this._tail as N;
    const initialLength = this._length;
    const insertRefNode = this.getPriorNode(startValueOrNode, cb) as N;

    let removedNodes = this.removeFromTo(startValueOrNode, endValueOrNode, cb);

    let insertedCount: number;
    if (removedNodes.head === null) {
      insertedCount = 0;
    } else
      if (removedNodes.count === initialLength) {
        // Entire list was removed
        insertedCount = this.appendMany(items);
      } else if (this.areEqual(initialHead, removedNodes.head, cb)) {
        // head was removed
        insertedCount = this.prependMany(items);
      } else if (!this.areEqual(initialTail, this._tail as N, cb)) {
        // tail was removed
        insertedCount = this.appendMany(items);
      } else {
        insertedCount = this.insertManyAfter(insertRefNode, items, cb);
      }

    return {
      insertedCount,
      removedCount: removedNodes.count,
      removedHead: removedNodes.head
    };
  }


  abstract splitBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): [
      LinkedList<N, V> | null,
      LinkedList<N, V> | null
    ];

  protected splitBetweenBase(
    leftList: ILinkedList<N, V>,
    rightList: ILinkedList<N, V>,
    valueOrNodeStart: V | N,
    valueOrNodeEnd: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): [
      ILinkedList<N, V> | null,
      ILinkedList<N, V> | null
    ] {
    let startItemFound = false;
    let endItemFound = false;

    let currNode = this._head as N;
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
        ? [leftList, null]
        : endItemFound
          ? [null, rightList]
          : [null, null];
  }


  // === Misc Operations ===
  size() {
    return this._length;
  }

  toArray() {
    const output = [];
    let node = this._head;
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

  setEqualityCB(callBack: EqualityCallback<V>) {
    this.callBack = callBack;
  }

  abstract reverse(): void;


  // === Commonly Used Protected ===
  protected abstract getNode(valueOrNode: V | N): N;

  protected getPriorNode(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): N | null {
    let node = this._head;
    let prevNode = null;
    while (node) {
      if (this.areEqual(valueOrNode, node, cb)) {
        return prevNode;
      }
      prevNode = node;
      node = node.next as N;
    }
    return null;
  }

  /**
   *
   *
   * @protected
   * @param {(V | Node<V>)} valueOrNode
   * @param {Node<V>} node
   * @param {(((a: V, b: V) => boolean) | undefined | null)} [cb=undefined] Callback by which node equality is determined.
   *
   * If undefined/not provided, the default callback assigned to the linked list will be used.
   *
   * If specified as null, or if the linked list has no default callback assigned,
   *  and if the value is a complex object, reference equality === will be used.
   * @return {boolean}
   * @memberof LinkedList
   */
  protected areEqual(
    valueOrNode: V | Node<V>,
    node: Node<V>,
    cb: EqualityCallbackOptions<V> = undefined): boolean {

    if (cb === undefined) {
      cb = this.callBack;
    } else if (cb === null) {
      cb = undefined;
    }

    return ((!(valueOrNode instanceof Node) && node.equals(valueOrNode as V, cb))
      || node.val === (valueOrNode as Node<V>).val)
  }
}

export { Node };