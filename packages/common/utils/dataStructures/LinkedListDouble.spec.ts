import { LinkedList, LinkedListDouble, NodeDouble } from './LinkedListDouble';
import { LinkedList as LinkedListSingle } from './LinkedListSingle';
import { NodeDoubleKeyVal } from './LinkedListNodes';

describe('##LinkedListDoubleDouble', () => {
  describe('Auxilliary', () => {
    describe('#constructor', () => {
      it('should initialize an empty list if no arguments are provided', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
      });

      it('should initialize a linked list from an argument of an array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
      });
    });

    describe('#size', () => {
      it('should return 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);
      });

      it('should return the size of the linked list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);
      });

      it('should return the updated size of the linked list after appending a value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.append(6);

        expect(linkedList.size()).toEqual(6);

      });

      it('should return the updated size of the linked list after prepending a value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.prepend(7);

        expect(linkedList.size()).toEqual(6);

      });

      it('should return the updated size of the linked list after removing a value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.remove(3);

        expect(linkedList.size()).toEqual(4);
      });

      it('should return the updated size of the linked list after appending a node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const node = new NodeDouble<number>(6);

        linkedList.append(node);

        expect(linkedList.size()).toEqual(6);
      });

      it('should return the updated size of the linked list after prepending a node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const node = new NodeDouble<number>(6);

        linkedList.prepend(node);

        expect(linkedList.size()).toEqual(6);
      });

      it('should return the updated size of the linked list after removing a node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const node = new NodeDouble<number>(3);

        linkedList.remove(node);

        expect(linkedList.size()).toEqual(4);
      });

      it('should return the updated size of the linked list after removing a head node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.removeHead();

        expect(linkedList.size()).toEqual(4);
      });

      it('should return the updated size of the linked list after removing a tail node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.removeTail();

        expect(linkedList.size()).toEqual(4);
      });
    });

    describe('#toArray', () => {
      it('should return an empty array for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.toArray()).toEqual([]);
      });

      it('should return an array of nodes in the list in order of the linked list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual(values);
      });
    });

    describe('#reverse', () => {
      it('should do nothing for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        linkedList.reverse();

        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing to a list of a single element', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        linkedList.reverse();

        expect(linkedList.toArray()).toEqual([3]);
      });

      it('should reverse a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        linkedList.reverse();

        expect(linkedList.toArray()).toEqual([5, 4, 3, 2, 1]);
      });

      it('should return the same list if reversed twice', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        linkedList.reverse();
        linkedList.reverse();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('#toLinkedListSingle', () => {
      it('should convert the linked list to a doubly linked list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const result = linkedList.toLinkedListSingle();
        expect(result).toBeInstanceOf(LinkedListSingle);
        expect(result.head).not.toHaveProperty('prev');
        expect(result.toArray()).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('#splitAt', () => {
      it('should return two lists split at the specified number', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitAt(3);

        const resultsLeft = results[0]?.toArray();
        expect(resultsLeft).toEqual([1, 2, 3]);

        const resultsRight = results[1]?.toArray();
        expect(resultsRight).toEqual([3, 4, 5]);
      });

      it('should return an empty list for when the split value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitAt(3.5);

        expect(results[0]).toBeUndefined();
        expect(results[1]).toBeUndefined();
      });

      it('should return a single node for the first list if split on the first node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitAt(1);

        const resultsLeft = results[0]?.toArray();
        expect(resultsLeft).toEqual([1]);

        const resultsRight = results[1]?.toArray();
        expect(resultsRight).toEqual([1, 2, 3, 4, 5]);
      });

      it('should return a single node for the second list if split on the last node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitAt(5);

        const resultsLeft = results[0]?.toArray();
        expect(resultsLeft).toEqual([1, 2, 3, 4, 5]);

        const resultsRight = results[1]?.toArray();
        expect(resultsRight).toEqual([5]);
      });
    });

    describe('#splitBetween', () => {
      it('should return two lists split at the specified number when both values are the same', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(3, 3);

        const resultsLeft = results[0]?.toArray();
        expect(resultsLeft).toEqual([1, 2, 3]);

        const resultsRight = results[1]?.toArray();
        expect(resultsRight).toEqual([3, 4, 5]);
      });

      it('should return an empty list for when neither split value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(3.5, 4.5);

        expect(results[0]).toBeUndefined();
        expect(results[1]).toBeUndefined();
      });

      it('should return the right side of the list as the second list if only the ending value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(-1, 3);

        expect(results[0]).toBeUndefined();

        const resultsLeft = results[1]?.toArray();
        expect(resultsLeft).toEqual([3, 4, 5]);

      });

      it('should return the left side of the list as the first list if only the starting value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(3, 10);

        const resultsRight = results[0]?.toArray();
        expect(resultsRight).toEqual([1, 2, 3]);

        expect(results[1]).toBeUndefined();
      });

      it('should return two lists split at two separate points, missing the nodes in between', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(2, 4);

        const resultsLeft = results[0]?.toArray();
        expect(resultsLeft).toEqual([1, 2]);

        const resultsRight = results[1]?.toArray();
        expect(resultsRight).toEqual([4, 5]);
      });
    });
  });

  describe('Values', () => {
    describe('#find', () => {
      it('should return null on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.find(1)).toBeNull();
      });

      it('should return null if value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.find(-1)).toBeNull();
      });

      it('should return the node with the value that is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const node = new NodeDouble(3);
        expect(linkedList.find(3)?.val).toEqual(node.val);
      });

      it('should return the node with the matching object reference that is found', () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        expect(linkedList.find(demo2)?.val).toEqual(demo2);
      });

      it(`should return the node with the matching object reference that is found when a
        default equality callback has been specified`, () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        const cb = (a: demo, b: demo) => a.foo === b.foo;
        linkedList.setEqualityCB(cb);

        expect(linkedList.find(demo2, null)?.val).toEqual(demo2);
      });

      it('should return the node that matches by the default equality callback provided for a value object', () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        const cb = (a: demo, b: demo) => a.foo === b.foo;
        linkedList.setEqualityCB(cb);

        expect(linkedList.find({ foo: 'B', bar: 4 })?.val).toEqual({ foo: 'B', bar: 2 });
      });

      it('should return the node that matches by the override equality callback provided for a value object', () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        const cb = (a: demo, b: demo) => a.foo === b.foo;

        expect(linkedList.find({ foo: 'B', bar: 4 }, cb)?.val).toEqual({ foo: 'B', bar: 2 });
      });
    });

    describe('#prepend', () => {
      it('should add a value as head & tail to an empty list', () => {
        const linkedList = new LinkedListDouble<number>();
        linkedList.prepend(5);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.head?.val).toEqual(5);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should add a node as head & tail to an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const node = new NodeDouble<number>(5);
        linkedList.prepend(node);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.head?.val).toEqual(5);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should add a value at the beginning of a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.prepend(6);

        expect(linkedList.size()).toEqual(6);
        expect(linkedList.head?.val).toEqual(6);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should add a node at the beginning of a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const node = new NodeDouble<number>(6);
        linkedList.prepend(node);

        expect(linkedList.size()).toEqual(6);
        expect(linkedList.head?.val).toEqual(6);
        expect(linkedList.tail?.val).toEqual(5);
      });
    });

    describe('#append', () => {
      it('should add a value as head & tail to an empty list', () => {
        const linkedList = new LinkedListDouble<number>();
        linkedList.append(5);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.head?.val).toEqual(5);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should add a node as head & tail to an empty list', () => {
        const linkedList = new LinkedListDouble<number>();
        const node = new NodeDouble<number>(5);

        linkedList.append(node);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.head?.val).toEqual(5);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should add a value at the end of a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.append(6);

        expect(linkedList.size()).toEqual(6);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(6);
      });

      it('should add a node at the end of a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const node = new NodeDouble<number>(6);
        linkedList.append(node);

        expect(linkedList.size()).toEqual(6);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(6);
      });
    });

    describe('#remove', () => {
      it('should do nothing removing a value on an empty list & return null', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);
        expect(linkedList.remove(-1)).toBeNull();
        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing removing a node on an empty list & return null', () => {
        const linkedList = new LinkedListDouble<number>();
        const node = new NodeDouble<number>(6);

        expect(linkedList.size()).toEqual(0);
        expect(linkedList.remove(node)).toBeNull();
        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing on a list where the value is not found & return null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);
        expect(linkedList.remove(-1)).toBeNull();
        expect(linkedList.size()).toEqual(5);
      });

      it('should do nothing on a list where the node is not found & return null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble<number>(6);

        expect(linkedList.size()).toEqual(5);
        expect(linkedList.remove(node)).toBeNull();
        expect(linkedList.size()).toEqual(5);
      });

      it('should remove the sole node from a list where the value is found & return the removed node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.remove(3)?.val).toEqual(3);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove the sole node from a list where the node is found & return the removed node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble<number>(3);

        expect(linkedList.size()).toEqual(1);
        expect(linkedList.remove(node)?.val).toEqual(3);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove the head of a list that matches the specified value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.remove(1)?.val).toEqual(1);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });


      it('should remove the head of a list that matches the specified node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(1);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.remove(node)?.val).toEqual(1);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should remove the tail of a list that matches the specified value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.remove(5)?.val).toEqual(5);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should remove the tail of a list that matches the specified node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(5);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.remove(node)?.val).toEqual(5);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should remove the node from a list where the value is found & return the removed node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);
        expect(linkedList.remove(3)?.val).toEqual(3);
        expect(linkedList.size()).toEqual(4);
      });

      it('should remove the node from a list where the node is found & return the removed node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble<number>(3);

        expect(linkedList.size()).toEqual(5);
        expect(linkedList.remove(node)?.val).toEqual(3);
        expect(linkedList.size()).toEqual(4);
      });

      it('should remove the last remaining node in a list that matches the specified value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.remove(1);
        expect(linkedList.size()).toEqual(4);

        linkedList.remove(2);
        expect(linkedList.size()).toEqual(3);

        linkedList.remove(3);
        expect(linkedList.size()).toEqual(2);

        linkedList.remove(4);
        expect(linkedList.size()).toEqual(1);

        linkedList.remove(5);
        expect(linkedList.size()).toEqual(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
      });

      it('should remove the last remaining node in a list that matches the specified node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.remove(new NodeDouble<number>(3));
        expect(linkedList.size()).toEqual(4);
        linkedList.remove(new NodeDouble<number>(2));
        expect(linkedList.size()).toEqual(3);
        linkedList.remove(new NodeDouble<number>(4));
        expect(linkedList.size()).toEqual(2);
        linkedList.remove(new NodeDouble<number>(5));
        expect(linkedList.size()).toEqual(1);
        linkedList.remove(new NodeDouble<number>(1));
        expect(linkedList.size()).toEqual(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();

        linkedList.remove(new NodeDouble<number>(1));
        expect(linkedList.size()).toEqual(0);
      });
    });

    describe('#move', () => {
      it('should do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.tail).toBeNull();
        expect(linkedList.toArray()).toEqual([]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, 1)).toBeFalsy();

        expect(linkedList.tail).toBeNull();
        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing on a list where the node is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(-3);
        expect(linkedList.move(node, 1)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should do nothing on a list of a single node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, 1)).toBeFalsy();

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);
      });

      it('should do nothing if moving 0 steps', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(-3);
        expect(linkedList.move(node, 0)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should move a found node forward by the positive number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, 1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([1, 2, 4, 3, 5]);
      });

      it('should move a found node forward by at most the end of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, 4)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([1, 2, 4, 5, 3]);
      });

      it('should move a head node forward by the positive number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(1);
        expect(linkedList.move(node, 1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([2, 1, 3, 4, 5]);
      });

      it('should move a found node backward by the negative number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, -1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([1, 3, 2, 4, 5]);
      });

      it('should move a found node backward by at most the beginning of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.move(node, -4)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([3, 1, 2, 4, 5]);
      });

      it('should move a tail node backward by the negative number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(5);
        expect(linkedList.move(node, -1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 4]);
      });

      it('should reverse a list of 2 items when the first item is specified to move forward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = new NodeDouble<number>(1);
        expect(linkedList.move(node, 1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([2, 1]);
      });

      it('should reverse a list of 2 items when the last item is specified to move backward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = new NodeDouble<number>(2);
        expect(linkedList.move(node, -1)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([2, 1]);
      });

      it('should do nothing in a list of 2 items when the first item is specified to move backward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = new NodeDouble<number>(1);
        expect(linkedList.move(node, -1)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2]);
      });

      it('should do nothing in a list of 2 items when the last item is specified to move forward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = new NodeDouble<number>(2);
        expect(linkedList.move(node, 1)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2]);
      });
    });

    describe('#prependMany', () => {
      it('should do nothing for an empty array provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [];
        linkedList.prependMany(addedValues);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from an array for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues = [6, 7, 8, 9, 10];
        linkedList.prependMany(addedValues);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should prepend array values to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = [6, 7, 8, 9, 10];
        linkedList.prependMany(addedValues);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
      });

      it('should do nothing for an empty list provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>();
        linkedList.prependMany(addedList);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from a list for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        linkedList.prependMany(addedList);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should prepend a list to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        linkedList.prependMany(addedList);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
      });
    });

    describe('#appendMany', () => {
      it('should do nothing for an empty array provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [];
        linkedList.appendMany(addedValues);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from an array for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues = [6, 7, 8, 9, 10];
        linkedList.appendMany(addedValues);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should append array values to an existing vvvvvvvvlist', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = [6, 7, 8, 9, 10];
        linkedList.appendMany(addedValues);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should do nothing for an empty list provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>();
        linkedList.appendMany(addedList);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from a list for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        linkedList.appendMany(addedList);

        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should append a list to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        linkedList.appendMany(addedList);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });
  });

  describe('Head', () => {
    describe('#head', () => {
      it('should return null for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.head).toBeNull();
      });

      it('should return the head of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
      });
    });

    describe('#removeHead', () => {
      it('should return null on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.removeHead()).toBeNull();
      });

      it('should remove and return the sole node in a list', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.removeHead()?.val).toEqual(3);
      });

      it('should remove & return the head in a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.removeHead()?.val).toEqual(1);
      });

      it('should remove the last remaining node in a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.removeHead();
        expect(linkedList.size()).toEqual(4);
        linkedList.removeHead();
        expect(linkedList.size()).toEqual(3);
        linkedList.removeHead();
        expect(linkedList.size()).toEqual(2);
        linkedList.removeHead();
        expect(linkedList.size()).toEqual(1);
        linkedList.removeHead();
        expect(linkedList.size()).toEqual(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();

        linkedList.removeHead();
        expect(linkedList.size()).toEqual(0);
      })
    });

    describe('#moveToHead', () => {
      it('should do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.head).toBeNull();

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToHead(node)).toBeFalsy();

        expect(linkedList.head).toBeNull();
      });

      it('should do nothing on a list where the node is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(-3);
        expect(linkedList.moveToHead(node)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should do nothing on a list of a single node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToHead(node)).toBeTruthy();

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);
      });

      it('should move a found node to the head of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToHead(node)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([3, 1, 2, 4, 5]);
      });

      it('should move a tail node to the head of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(5);
        expect(linkedList.moveToHead(node)).toBeTruthy();

        expect(linkedList.head?.val).toEqual(5);
        expect(linkedList.tail?.val).toEqual(4);
        expect(linkedList.toArray()).toEqual([5, 1, 2, 3, 4]);
      });
    });
  });

  describe('Tail', () => {
    describe('#tail', () => {
      it('should return null for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.tail).toBeNull();
      });

      it('should return the tail of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.tail?.val).toEqual(5);
      });
    });

    describe('#removeTail', () => {
      it('should return null on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.removeTail()).toBeNull();
      });

      it('should remove and return the sole node in a list', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.removeTail()?.val).toEqual(3);
      });

      it('should remove & return the tail in a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.removeTail()?.val).toEqual(5);
      });

      it('should remove the last remaining node in a list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        linkedList.removeTail();
        expect(linkedList.size()).toEqual(4);
        linkedList.removeTail();
        expect(linkedList.size()).toEqual(3);
        linkedList.removeTail();
        expect(linkedList.size()).toEqual(2);
        linkedList.removeTail();
        expect(linkedList.size()).toEqual(1);
        linkedList.removeTail();
        expect(linkedList.size()).toEqual(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();

        linkedList.removeTail();
        expect(linkedList.size()).toEqual(0);
      })
    });

    describe('#moveToTail', () => {
      it('should do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.head).toBeNull();

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToTail(node)).toBeFalsy();

        expect(linkedList.head).toBeNull();
      });

      it('should do nothing on a list where the node is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(-3);
        expect(linkedList.moveToTail(node)).toBeFalsy();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should do nothing on a list of a single node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToTail(node)).toBeTruthy();

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);
      });

      it('should move a found node to the tail of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(3);
        expect(linkedList.moveToTail(node)).toBeTruthy();

        expect(linkedList.toArray()).toEqual([1, 2, 4, 5, 3]);
      });

      it('should move a head node to the tail of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = new NodeDouble<number>(1);
        expect(linkedList.moveToTail(node)).toBeTruthy();

        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(1);
        expect(linkedList.toArray()).toEqual([2, 3, 4, 5, 1]);
      });
    });
  });
});

describe('##LinkedList', () => {
  it('should create a singly linked list of a derived node', () => {
    const linkedList = new LinkedList<NodeDoubleKeyVal<number, string>, string>();
    linkedList.append(new NodeDoubleKeyVal(0, 'A'));
    linkedList.append(new NodeDoubleKeyVal(1, 'B'));
    linkedList.append(new NodeDoubleKeyVal(2, 'C'));

    expect(linkedList.toArray()).toEqual(
      [
        { key: 0, val: 'A' },
        { key: 1, val: 'B' },
        { key: 2, val: 'C' },
      ]);
  });
});