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
  ): { node: N, index: number } | null;
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
  ): { node: N, index: number } | null;
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
  ): { node: N, index: number } | null;

  /**
   * Trims the linked list to the provided head & tail targets.
   *
   * These targets may be null or undefined as a convenient means of calling the appropriate trim function
   * automatically out of the 3 valid cases (no start, no end, start & end both valid).
   *
   * @param {(V | N | null)} startValueOrNode
   * @param {(V | N | null)} endValueOrNode
   * @param {EqualityCallbackOptions<V>} [cb]
   * @return {*}  {boolean}
   * @memberof ILinkedList
   */
  trim(
    startValueOrNode?: V | N | null,
    endValueOrNode?: V | N | null,
    cb?: EqualityCallbackOptions<V>
  ): {
    headOfTrimmedHead: N | null,
    headOfTrimmedTail: N | null
  } | null;


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

  trimHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;
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

  trimTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;
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
  prependMany(
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount?: boolean,
  ): number;
  /**
   * Add an array of values or nodes to the end of the list, maintaining array order.
   *
   * @param {(V[] | ILinkedList<N, V>)} items If an array of values is supplied, a nodes will be created to contain them.
   * @memberof ILinkedList
   */
  appendMany(
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount?: boolean,
  ): number;
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
    returnListCount?: boolean,
    cb?: EqualityCallbackOptions<V>
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
    returnListCount?: boolean,
    cb?: EqualityCallbackOptions<V>
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
  ): { nodes: N[], indices: number[] };
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
  ): { nodes: N[], indices: number[] };

  // === Range Operations ===
  /**
   * Range is defined by the start node, end node, and count of total nodes within the range.
   * The start/end of the range is exclusive of the provided start and end values or nodes.
   *
   * @param {(V | N)} startValue Value or node indicating the start of the range.
   * If not found while the end is, this is taken to be the head of the list.
   * @param {(V | N)} endValue Value or node indicating the end of the range.
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
    startValue: V,
    endValue: V,
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
   * @param {(V | N)} startValue Value or node indicating the start of the range.
   * If not found while the end is, this is taken to be the head of the list.
   * @param {(V | N)} endValue Value or node indicating the end of the range.
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
    startValue: V,
    endValue: V,
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
    returnListCount: boolean,
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
    returnListCount: boolean,
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
    returnListCount?: boolean,
    cb?: EqualityCallbackOptions<V>
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
    returnListCount?: boolean,
    cb?: EqualityCallbackOptions<V>
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
  sizeFromTo(start: N | null, end: N | null): number;
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
  protected _lengthDirty: boolean = false;

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
  ): { node: N, index: number } | null {
    const results = this.findFirstOrAny(valueOrNode, cb, true);

    return results.nodes.length ? { node: results.nodes[0], index: results.indices[0] } : null;
  }

  abstract prepend(valueOrNode: V | N): void;
  abstract append(valueOrNode: V | N): void;

  replace(
    targetValueOrNode: V | N,
    replaceValueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): { node: N, index: number } | null {
    const targetNode = this.getExistingNode(targetValueOrNode, cb)?.node;

    if (targetNode && this.insertAfter(targetNode, replaceValueOrNode, cb)) {
      return this.remove(targetNode, cb);
    }
    return null;
  }

  protected replaceList(items: ILinkedList<N, V>): void {
    this._head = items.head;
    this._tail = items.tail;

    this._lengthDirty = true;
  }

  remove(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): { node: N, index: number } | null {
    const node = this.getAsNode(valueOrNode);
    const results = this.removeFirstOrAny(node.val, cb, true);

    return results.nodes.length ? { node: results.nodes[0], index: results.indices[0] } : null;
  }

  trim(
    startValueOrNode: V | N | null,
    endValueOrNode: V | N | null,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    headOfTrimmedHead: N | null,
    headOfTrimmedTail: N | null
  } | null {
    let headOfTrimmedHead: N | null = null;
    if (!this.isNullOrUndefined(startValueOrNode)) {
      headOfTrimmedHead = this.trimHead(startValueOrNode!, cb);
    }

    let headOfTrimmedTail: N | null = null;
    if (!this.isNullOrUndefined(endValueOrNode)) {
      headOfTrimmedTail = this.trimTail(endValueOrNode!, cb);
    }

    return headOfTrimmedHead || headOfTrimmedTail
      ? { headOfTrimmedHead, headOfTrimmedTail }
      : null;
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
    const refNode = this.find(refValueOrNode, cb)?.node;
    if (!refNode) {
      return false;
    }

    const insertNode = this.getAsNode(insertValueOrNode) as N;
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
    const refNode = this.find(refValueOrNode, cb)?.node;
    if (!refNode) {
      return false;
    }

    const insertNode = this.getAsNode(insertValueOrNode) as N;
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

  abstract trimHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;

  moveToHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const node = this.remove(valueOrNode, cb)?.node;
    if (node) {
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

  abstract trimTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>
  ): N | null;

  moveToTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    const node = this.remove(valueOrNode, cb)?.node;
    if (node) {
      this.append(node);
      return true;
    }
    return false;
  }


  // === 'Many' Operations ===
  prependMany(
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount: boolean = false,
  ): number {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      for (let i = itemsAsArray.length - 1; 0 <= i; i--) {
        this.prepend(itemsAsArray[i]);
      }
      return items.length;
    } else {
      this.prependList(items);
      return returnListCount ? items.size() : 1;
    }
  }

  protected abstract prependList(items: ILinkedList<N, V>): void;

  appendMany(
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount: boolean = false,
  ): number {
    if (Array.isArray(items)) {
      const itemsAsArray = items as V[];
      itemsAsArray.forEach((item) => {
        this.append(item);
      });
      return items.length;
    } else {
      this.appendList(items);
      return returnListCount ? items.size() : 1;
    }
  }

  protected abstract appendList(items: ILinkedList<N, V>): void;

  insertManyBefore(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): number {
    const refNode = this.getExistingNode(refValueOrNode, cb)?.node;
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
      if (returnListCount) {
        count = items.size();
      }
    }
    return count;
  }

  protected abstract insertListBefore(refNode: N, items: ILinkedList<N, V>): void;


  insertManyAfter(
    refValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): number {
    const refNode = this.getExistingNode(refValueOrNode, cb)?.node;
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
      if (returnListCount) {
        count = items.size();
      }
    }
    return count;
  }

  protected abstract insertListAfter(refNode: N, items: ILinkedList<N, V>): void;

  // === Any Operations ===
  findAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): { nodes: N[], indices: number[] } {
    return this.findFirstOrAny(valueOrNode, cb, false);
  }

  protected findFirstOrAny(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V>,
    firstOnly: boolean = true
  ): { nodes: N[], indices: number[] } {
    const nodes = [];
    const indices = [];
    let count = 0;
    let node = this._head;
    while (node) {
      if (this.areEqual(valueOrNode, node, cb)) {
        nodes.push(node);
        indices.push(count);
        if (firstOnly) {
          return { nodes, indices };
        }
      }
      count++;
      node = node.next as N;
    }
    return { nodes, indices };
  }

  removeAny(
    value: V,
    cb: EqualityCallbackOptions<V> = undefined
  ): { nodes: N[], indices: number[] } {
    return this.removeFirstOrAny(value, cb, false);
  }

  protected abstract removeFirstOrAny(
    value: V,
    cb: EqualityCallbackOptions<V>,
    firstOnly: boolean
  ): { nodes: N[], indices: number[] };


  // === Range Operations ===
  findRangeBetween(
    startValue: V,
    endValue: V,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    return this.findRange(startValue, endValue, false, cb);
  }

  findRangeFromTo(
    startValue: V,
    endValue: V,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    return this.findRange(startValue, endValue, true, cb);
  }


  protected findRange(
    startValue: V,
    endValue: V,
    inclusive: boolean,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    startNode: N | null,
    endNode: N | null,
    length: number
  } {
    const nodesAndCounts = this.findNodesAndCounts(startValue, endValue, cb);

    let startNodeCount = nodesAndCounts.startNodeCount;
    let endNodeCount = nodesAndCounts.endNodeCount;

    // Update counts to account for certain edge cases
    if (!this.isNullOrUndefined(startValue) && !nodesAndCounts.startNode) {
      // Start node not found
      startNodeCount = inclusive ? 1 : 0;
    } else if (
      !this.isNullOrUndefined(endValue)
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
      const startNodeNext = nodesAndCounts.startNode ? nodesAndCounts.startNode.next as N : null;
      const endNodePrev = nodesAndCounts.endNode ? nodesAndCounts.endNodePrev : null;
      return {
        startNode: startNodeNext,
        endNode: endNodePrev,
        length: nodeSeparation
      };
    }
  }

  protected findNodesAndCounts(
    startValue: V,
    endValue: V,
    cb: EqualityCallbackOptions<V> = undefined
  ) {
    let startNode: N | null = null;
    let startNodeCount = 0;

    let endNode: N | null = null;
    let endNodeCount = 0;

    // Correction handling either of these as null
    if (this.isNullOrUndefined(startValue)) {
      startNode = this._head;
    }
    if (this.isNullOrUndefined(endValue)) {
      endNode = this._tail;
    }

    let currNode = this._head;
    let prevNode = null;
    while (currNode) {
      if (!startNode) {
        startNodeCount++;
        if (this.areEqual(startValue, currNode, cb)) {
          startNode = currNode;
        }
      }

      if (!endNode) {
        endNodeCount++;
        if (this.areEqual(endValue, currNode, cb)) {
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
    if (this.isNullOrUndefined(startValue)) {
      startNode = null;
      startNodeCount = 0;
    }
    if (this.isNullOrUndefined(endValue)) {
      endNode = null;
      endNodeCount = this.size();
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
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    count: number,
    head: N | null
  } {
    let startNode: N | null;
    let endNode: N | null;
    let length = -1;

    if (this.isNode(startValueOrNode) && this.isNode(endValueOrNode)) {
      startNode = (this.getExistingNode(startValueOrNode)?.node as N)?.next as N;
      endNode = this.getPriorNode(this.getExistingNode(endValueOrNode)?.node as N) as N;
      if (startNode || endNode && returnListCount) {
        length = this.sizeFromTo(startNode, endNode);
      }
    } else {
      const {
        startNode: startNodeRange,
        endNode: endNodeRange,
        length: lengthRange } = this.findRangeBetween(startValueOrNode as V, endValueOrNode as V, cb);

      startNode = startNodeRange as N;
      endNode = endNodeRange as N;
      length = lengthRange;
    }

    const removedHead = this.removeFromToNodes(startNode, endNode);

    if (removedHead) {
      this._lengthDirty = true;
    }

    return {
      count: removedHead ? length : 0,
      head: removedHead
    }
  }


  removeFromTo(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    count: number,
    head: N | null
  } {
    let startNode: N | null;
    let endNode: N | null;
    let length = -1;

    if (this.isNode(startValueOrNode) && this.isNode(endValueOrNode)) {
      startNode = this.getExistingNode(startValueOrNode)?.node ?? null;
      endNode = this.getExistingNode(endValueOrNode)?.node ?? null;
      if (startNode || endNode && returnListCount) {
        length = this.sizeFromTo(startNode, endNode);
      }
    } else {
      const {
        startNode: startNodeRange,
        endNode: endNodeRange,
        length: lengthRange } = this.findRangeFromTo(startValueOrNode as V, endValueOrNode as V, cb);

      startNode = startNodeRange as N;
      endNode = endNodeRange as N;
      length = lengthRange;
    }
    const removedHead = this.removeFromToNodes(startNode, endNode);

    if (removedHead) {
      this._lengthDirty = true;
    }

    return {
      count: removedHead ? length : 0,
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


  protected matchesHead(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    return !this.isNullOrUndefined(this._head as N)
      && !this.isNullOrUndefined(valueOrNode)
      && this.areEqual(valueOrNode, this._head as N, cb)
  }

  protected matchesTail(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): boolean {
    return !this.isNullOrUndefined(this._tail as N)
      && !this.isNullOrUndefined(valueOrNode)
      && this.areEqual(valueOrNode, this._tail as N, cb)
  }

  replaceBetween(
    startValueOrNode: V | N,
    endValueOrNode: V | N,
    items: V[] | N[] | ILinkedList<N, V>,
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  } {
    const initialHead = this._head as N;
    let removedNodes = this.removeBetween(startValueOrNode, endValueOrNode, returnListCount, cb);

    let insertedCount: number;
    if (removedNodes.head === null) {
      // No nodes removed
      if (this.matchesHead(endValueOrNode)) {
        insertedCount = this.prependMany(items, returnListCount);
      } else if (this.matchesTail(startValueOrNode)) {
        insertedCount = this.appendMany(items, returnListCount);
      } else if (!this.isNullOrUndefined(startValueOrNode) && !this.isNullOrUndefined(endValueOrNode)) {
        const startNode = this.getExistingNode(startValueOrNode)?.node;
        const startNodeNext = startNode?.next as N;

        if (startNode && startNodeNext && this.areEqual(endValueOrNode, startNodeNext, cb)) {
          // Target nodes are adjacent. Just insert in between.
          insertedCount = this.insertManyAfter(startNode, items, returnListCount, cb);
        } else {
          insertedCount = 0;
        }
      } else {
        insertedCount = 0;
      }
    } else if (this.areEqual(initialHead, removedNodes.head, cb)) {
      // head was removed
      insertedCount = this.prependMany(items, returnListCount);
    } else {
      const insertRefNode = this.getExistingNode(startValueOrNode)?.node;
      insertedCount = this.insertManyAfter(insertRefNode!, items, returnListCount, cb);
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
    returnListCount: boolean = false,
    cb: EqualityCallbackOptions<V> = undefined
  ): {
    insertedCount: number,
    removedCount: number,
    removedHead: N | null
  } {
    const initialHead = this._head as N;
    const initialTail = this._tail as N;
    const insertRefNode = this.getPriorNode(startValueOrNode, cb) as N;

    let removedNodes = this.removeFromTo(startValueOrNode, endValueOrNode, returnListCount, cb);

    let insertedCount: number;
    if (removedNodes.head === null) {
      insertedCount = 0;
    } else {

      if (removedNodes.head === initialHead && this._tail === null) {
        // Entire list was removed
        insertedCount = this.appendMany(items, returnListCount);
      } else if (initialHead === removedNodes.head) {
        // head was removed
        insertedCount = this.prependMany(items, returnListCount);
      } else if (initialTail !== this._tail) {
        // tail was removed
        insertedCount = this.appendMany(items, returnListCount);
      } else {
        insertedCount = this.insertManyAfter(insertRefNode, items, returnListCount, cb);
      }
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
        if (rightList.head === null && this.areEqual(valueOrNodeStart, currNode, cb)) {
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
    if (this._lengthDirty) {
      let count = this.sizeFromTo(null, null);

      this._length = count;
      this._lengthDirty = false;
    }

    return this._length;
  }

  sizeFromTo(start: N | null, end: N | null): number {
    let count = 0;

    let currNode = start ?? this._head;
    let targetNode = end ?? this._tail;

    while (currNode) {
      count++;
      if (currNode === targetNode) {
        break;
      } else {
        currNode = currNode.next as N;
      }
    }
    return currNode === targetNode ? count : -1;
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

  /**
   * Returns the value or node as a node if it exists in the list, or null otherwise.
   *
   * If argument is already a node, it is returned appropriately cast and assumed to already be in the list. Index is null in this case.
   *
   * If the argument is a value, the list will be searched to find the matching node to be returned.
   *
   * @protected
   * @param {(V | N)} valueOrNode
   * @param {EqualityCallbackOptions<V>} [cb=undefined]
   * @return {*}  {({ node: N, index: number | null } | null)}
   * @memberof LinkedList
   */
  protected getExistingNode(
    valueOrNode: V | N,
    cb: EqualityCallbackOptions<V> = undefined
  ): { node: N, index: number | null } | null {
    return this.isNode(valueOrNode) ? { node: valueOrNode as N, index: null } : this.find(valueOrNode, cb)
  }

  /**
   * Returns the value or node as a node.
   *
   * If argument is already a node, it is returned appropriately cast.
   *
   * If the argument is a value, it will be added to a newly instantiated node.
   *
   * @protected
   * @abstract
   * @param {(V | N)} valueOrNode
   * @return {*}  {N}
   * @memberof LinkedList
   */
  protected abstract getAsNode(valueOrNode: V | N): N;

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

  protected sizeUnderTwo() {
    let count = 0;
    let node = this._head;
    while (node && count < 2) {
      count++;
      node = node.next as N;
    }
    return count < 2;
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

    // if (this.isNullOrUndefined(valueOrNode) || this.isNullOrUndefined(node)) {
    //   console.log('areEqual aborted. valueOrNode, or node, are null or undefined')
    //   return false;
    // }

    return ((!(valueOrNode instanceof Node) && node.equals(valueOrNode as V, cb))
      || node.val === (valueOrNode as Node<V>).val)
  }

  protected isNode(valueOrNode: V | N): boolean {
    return valueOrNode instanceof Node;
  }

  protected isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }
}

export { Node };