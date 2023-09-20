import {
  LinkedList,
  LinkedListDouble,
  NodeDouble
} from './LinkedListDouble';
import { LinkedList as LinkedListSingle } from './LinkedListSingle';
import { NodeDoubleKeyVal } from './LinkedListNodes';

// TODO: Add tests for when valueOrNode is null or undefined. Decide how this should be handled

describe('##LinkedListDouble', () => {
  describe('Creation', () => {
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

    describe('#fromHead', () => {
      it('should initialize a linked list from a provided head node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const linkedListFromHead = LinkedListSingle.fromHead(linkedList.head as NodeDouble<number>)

        expect(linkedListFromHead.size()).toEqual(5);
        expect(linkedListFromHead.head?.val).toEqual(1);
        expect(linkedListFromHead.tail?.val).toEqual(5);
      });

      it('should initialize a linked list from provided head & tail nodes', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const linkedListFromHead = LinkedListSingle.fromHead(linkedList.head as NodeDouble<number>, linkedList.tail as NodeDouble<number>)

        expect(linkedListFromHead.size()).toEqual(5);
        expect(linkedListFromHead.head?.val).toEqual(1);
        expect(linkedListFromHead.tail?.val).toEqual(5);
      });
    });
  });


  describe('Single Item Operations', () => {
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
        expect(linkedList.find(3)?.node.val).toEqual(node.val);
      });

      it('should return the node with the matching object reference that is found', () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        expect(linkedList.find(demo2)?.node.val).toEqual(demo2);
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

        expect(linkedList.find(demo2, null)?.node.val).toEqual(demo2);
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

        expect(linkedList.find({ foo: 'B', bar: 4 })?.node.val).toEqual({ foo: 'B', bar: 2 });
      });

      it('should return the node that matches by the override equality callback provided for a value object', () => {
        type demo = { foo: string, bar: number }
        const demo1: demo = { foo: 'A', bar: 1 };
        const demo2: demo = { foo: 'B', bar: 2 };
        const demo3: demo = { foo: 'C', bar: 3 };
        const values: demo[] = [demo1, demo2, demo3];
        const linkedList = new LinkedListDouble<demo>(values);

        const cb = (a: demo, b: demo) => a.foo === b.foo;

        expect(linkedList.find({ foo: 'B', bar: 4 }, cb)?.node.val).toEqual({ foo: 'B', bar: 2 });
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

    describe('#replace', () => {
      it('should do nothing and return null on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.toArray()).toEqual([]);

        const replacedNode = linkedList.replace(3, 10);
        expect(replacedNode).toBeNull();

        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing and return null if the target is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const replacedNode = linkedList.replace(-3, 10);
        expect(replacedNode).toBeNull();

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should replace the target node with the new value provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const replacedNode = linkedList.replace(3, 10)?.node;
        expect(replacedNode?.val).toEqual(3);

        expect(linkedList.toArray()).toEqual([1, 2, 10, 4, 5]);
      });

      it('should replace the target head node with the new value provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const replacedNode = linkedList.replace(1, 10)?.node;
        expect(replacedNode?.val).toEqual(1);

        expect(linkedList.head?.val).toEqual(10);
        expect(linkedList.toArray()).toEqual([10, 2, 3, 4, 5]);
      });

      it('should replace the target tail node with the new value provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const replacedNode = linkedList.replace(5, 10)?.node;
        expect(replacedNode?.val).toEqual(5);

        expect(linkedList.tail?.val).toEqual(10);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 10]);
      });
    });

    describe('#remove', () => {
      it('should do nothing removing a value on an empty list & return null', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);

        const result = linkedList.remove(-1);

        expect(result).toBeNull();
        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing removing a node on an empty list & return null', () => {
        const linkedList = new LinkedListDouble<number>();
        const node = new NodeDouble<number>(6);

        expect(linkedList.size()).toEqual(0);

        const result = linkedList.remove(node);

        expect(result).toBeNull();

        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing on a list where the value is not found & return null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const result = linkedList.remove(-1);

        expect(result).toBeNull();
        expect(linkedList.size()).toEqual(5);
      });

      it('should do nothing on a list where the node is not found & return null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble<number>(6);

        expect(linkedList.size()).toEqual(5);

        const result = linkedList.remove(node);

        expect(result).toBeNull();
        expect(linkedList.size()).toEqual(5);
      });

      it('should remove the sole node from a list where the value is found & return the removed node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(1);

        const removedNode = linkedList.remove(3)?.node;

        expect(removedNode?.val).toEqual(3);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove the sole node from a list where the node is found & return the removed node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble<number>(3);

        expect(linkedList.size()).toEqual(1);

        const removedNode = linkedList.remove(node)?.node;

        expect(removedNode?.val).toEqual(3);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove the head of a list that matches the specified value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);

        const removedNode = linkedList.remove(1)?.node;

        expect(removedNode?.val).toEqual(1);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should remove the head of a list that matches the specified node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(1);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);

        const removedNode = linkedList.remove(node)?.node;

        expect(removedNode?.val).toEqual(1);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should remove the tail of a list that matches the specified value', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);

        const removedNode = linkedList.remove(5)?.node;

        expect(removedNode?.val).toEqual(5);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should remove the tail of a list that matches the specified node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(5);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);

        const removedNode = linkedList.remove(node)?.node;

        expect(removedNode?.val).toEqual(5);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should remove the node from a list where the value is found & return the removed node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.size()).toEqual(5);

        const removedNode = linkedList.remove(3)?.node;

        expect(removedNode?.val).toEqual(3);
        expect(linkedList.size()).toEqual(4);
      });

      it('should remove the node from a list where the node is found & return the removed node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const targetNode = new NodeDouble<number>(3);

        const prevNode = linkedList.find(2)!.node;
        const nextNode = linkedList.find(4)!.node;

        expect(linkedList.size()).toEqual(5);

        const removedNode = linkedList.remove(targetNode)?.node;

        expect(removedNode?.val).toEqual(3);
        expect(linkedList.size()).toEqual(4);

        expect(removedNode!.next).toBeNull();
        expect(removedNode!.prev).toBeNull();

        expect(prevNode.next).toEqual(nextNode);
        expect(nextNode.prev).toEqual(prevNode);
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

    describe('#trim', () => {
      it('should return null & do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;
        const originalTail = linkedList.tail;

        const trimmedHeads = linkedList.trim(2, 4);

        expect(trimmedHeads).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
        expect(originalTail).toEqual(linkedList.tail);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
      });

      it('should return null & do nothing on an empty list with a provided node', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;
        const originalTail = linkedList.tail;

        const trimmedHead = linkedList.trim(new NodeDouble(2), new NodeDouble(4));

        expect(trimmedHead).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
        expect(originalTail).toEqual(linkedList.tail);
      });

      it('should return null & do nothing if neither of the provided values exists in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;
        const originalTail = linkedList.tail;

        const trimmedHeads = linkedList.trim(-2, -4);

        expect(trimmedHeads).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
        expect(originalTail).toEqual(linkedList.tail);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should return the original head & trim to the found start value if the provided start value exists in the list but the end value does not', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(2, -4)!;

        expect(headOfTrimmedHead).toEqual(originalHead);
        expect(headOfTrimmedTail).toBeNull();
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should return the original head & trim to the found start value if the provided start value exists in the list but the end value is specified as null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(2, null)!;

        expect(headOfTrimmedHead).toEqual(originalHead);
        expect(headOfTrimmedTail).toBeNull();
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(5);
      });

      it('should return the the node after the found end value & trim after the found end value if the provided end value exists in the list but the start value does not', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const targetNode = linkedList.find(4)?.node;
        const nodeAfterTarget = targetNode!.next;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(-2, 4)!;

        expect(headOfTrimmedHead).toBeNull();
        expect(headOfTrimmedTail).toEqual(nodeAfterTarget);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.tail).toEqual(targetNode);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should return the the node after the found end value & trim after the found end value if the provided end value exists in the list but the start value is specified as null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const targetNode = linkedList.find(4)?.node;
        const nodeAfterTarget = targetNode!.next;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(null, 4)!;

        expect(headOfTrimmedHead).toBeNull();
        expect(headOfTrimmedTail).toEqual(nodeAfterTarget);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.tail).toEqual(targetNode);
        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should return the original head & node after the found end valye & trim to the found start value and after the found end value if the provided values both exist in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;
        const targetNode = linkedList.find(4)?.node;
        const nodeAfterTarget = targetNode!.next;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(2, 4)!;

        expect(headOfTrimmedHead).toEqual(originalHead);
        expect(headOfTrimmedTail).toEqual(nodeAfterTarget);
        expect(linkedList.size()).toEqual(3);
        expect(linkedList.head?.val).toEqual(2);
        expect(linkedList.tail?.val).toEqual(4);
      });

      it('should return the original head & trim to the found start value if the provided start value exists in the list but, after the end value that also exists in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;

        const { headOfTrimmedHead, headOfTrimmedTail } = linkedList.trim(4, 2)!;

        expect(headOfTrimmedHead).toEqual(originalHead);
        expect(headOfTrimmedTail).toBeNull();
        expect(linkedList.size()).toEqual(2);
        expect(linkedList.head?.val).toEqual(4);
        expect(linkedList.tail?.val).toEqual(5);
      });
    });

    describe('#move', () => {
      it('should do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.tail).toBeNull();
        expect(linkedList.toArray()).toEqual([]);

        const result = linkedList.move(3, 1);

        expect(result).toBeFalsy();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing on a list where the node is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const result = linkedList.move(-3, 1);

        expect(result).toBeFalsy();
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should do nothing on a list of a single node', () => {
        const values = [3];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, 1);

        expect(result).toBeFalsy();
        expect(linkedList.head?.val).toEqual(3);
        expect(linkedList.tail?.val).toEqual(3);
        expect(linkedList.toArray()).toEqual([3]);
      });

      it('should do nothing if moving 0 steps', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, 0);

        expect(result).toBeFalsy();
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should move a found node forward by the positive number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, 1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([1, 2, 4, 3, 5]);
      });

      it('should move a found node forward by at most the end of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, 4);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([1, 2, 4, 5, 3]);
      });

      it('should move a head node forward by the positive number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(1)!.node;

        const result = linkedList.move(node, 1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([2, 1, 3, 4, 5]);
      });

      it('should move a found node backward by the negative number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, -1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([1, 3, 2, 4, 5]);
      });

      it('should move a found node backward by at most the beginning of the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(3)!.node;

        const result = linkedList.move(node, -4);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([3, 1, 2, 4, 5]);
      });

      it('should move a tail node backward by the negative number of positions specified', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

        const node = linkedList.find(5)!.node;

        const result = linkedList.move(node, -1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 4]);
      });

      it('should reverse a list of 2 items when the first item is specified to move forward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = linkedList.find(1)!.node;

        const result = linkedList.move(node, 1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([2, 1]);
      });

      it('should reverse a list of 2 items when the last item is specified to move backward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = linkedList.find(2)!.node;

        const result = linkedList.move(node, -1);

        expect(result).toBeTruthy();
        expect(linkedList.toArray()).toEqual([2, 1]);
      });

      it('should do nothing in a list of 2 items when the first item is specified to move backward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = linkedList.find(1)!.node;

        const result = linkedList.move(node, -1);

        expect(result).toBeFalsy();
        expect(linkedList.toArray()).toEqual([1, 2]);
      });

      it('should do nothing in a list of 2 items when the last item is specified to move forward', () => {
        const values = [1, 2];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.toArray()).toEqual([1, 2]);

        const node = linkedList.find(2)!.node;

        const result = linkedList.move(node, 1);

        expect(result).toBeFalsy();
        expect(linkedList.toArray()).toEqual([1, 2]);
      });
    });

    describe('#insertBefore', () => {
      it('should do nothing and return false on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);

        const insertionSuccess = linkedList.insertBefore(3, 10);
        expect(insertionSuccess).toBeFalsy();

        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing and return false if the reference value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertBefore(-3, 10);
        expect(insertionSuccess).toBeFalsy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should insert the value before the reference and return true', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertBefore(3, 10);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 10, 3, 4, 5]);
      });

      it('should insert the node before the reference and return true', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(10);

        const prevNode = linkedList.find(2)!.node;
        const nextNode = prevNode.next as NodeDouble<number>;

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertBefore(3, node);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 10, 3, 4, 5]);

        expect(prevNode.next).toEqual(node);
        expect(node.prev).toEqual(prevNode);
        expect(node.next).toEqual(nextNode);
        expect(nextNode!.prev).toEqual(node);
      });

      it('should insert the value before the head as the new head of the list if the reference matches the head', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertBefore(1, 10);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(10);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([10, 1, 2, 3, 4, 5]);
      });

      it('should insert the node before the head as the new head of the list if the reference matches the head', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(10);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertBefore(1, node);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(10);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([10, 1, 2, 3, 4, 5]);
      });
    });

    describe('#insertAfter', () => {
      it('should do nothing and return false on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        expect(linkedList.size()).toEqual(0);

        const insertionSuccess = linkedList.insertAfter(3, 10);
        expect(insertionSuccess).toBeFalsy();

        expect(linkedList.size()).toEqual(0);
      });

      it('should do nothing and return false if the reference value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertAfter(-3, 10);
        expect(insertionSuccess).toBeFalsy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should insert the value after the reference and return true', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertAfter(3, 10);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 10, 4, 5]);
      });

      it('should insert the node after the reference and return true', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(10);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const prevNode = linkedList.find(3)!.node;
        const nextNode = prevNode.next as NodeDouble<number>;

        const insertionSuccess = linkedList.insertAfter(3, node);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 10, 4, 5]);

        expect(prevNode.next).toEqual(node);
        expect(node.prev).toEqual(prevNode);
        expect(node.next).toEqual(nextNode);
        expect(nextNode.prev).toEqual(node);
      });

      it('should insert the value after the tail as the new tail of the list if the reference matches the tail', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertAfter(5, 10);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(10);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 10]);
      });

      it('should insert the node after the tail as the new tail of the list if the reference matches the tail', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);
        const node = new NodeDouble(10);

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(5);
        expect(linkedList.size()).toEqual(5);

        const insertionSuccess = linkedList.insertAfter(5, node);
        expect(insertionSuccess).toBeTruthy();

        expect(linkedList.head?.val).toEqual(1);
        expect(linkedList.tail?.val).toEqual(10);
        expect(linkedList.size()).toEqual(6);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 10]);
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

        expect(results[0]).toBeNull();
        expect(results[1]).toBeNull();
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
  });


  describe('Head Operations', () => {
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

    describe('#trimHead', () => {
      it('should return null & do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;

        const trimmedHead = linkedList.trimHead(2);

        expect(trimmedHead).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
      });

      it('should return null & do nothing on an empty list with a provided node', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;

        const trimmedHead = linkedList.trimHead(new NodeDouble(2));

        expect(trimmedHead).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
      });

      it('should return null & do nothing if the provided value does not exist in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalSize = linkedList.size();
        const originalHead = linkedList.head;

        const trimmedHead = linkedList.trimHead(-2);

        expect(trimmedHead).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalHead).toEqual(linkedList.head);
      });

      it('should return the original head & trim to the found value if the provided value exists in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;

        const trimmedHead = linkedList.trimHead(2);

        expect(trimmedHead).toEqual(originalHead);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.head?.val).toEqual(2);
      });

      it('should return the original head & trim to the existing node if the provided node exists in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalHead = linkedList.head;

        const targetNode = linkedList.find(2)!.node;
        expect(targetNode.prev).not.toBeNull();

        const trimmedHead = linkedList.trimHead(targetNode!);

        expect(trimmedHead).toEqual(originalHead);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.head).toEqual(targetNode);
        expect(targetNode.prev).toBeNull();
      });
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


  describe('Tail Operations', () => {
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
      });
    });

    describe('#trimTail', () => {
      it('should return null & do nothing on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalTail = linkedList.tail;

        const trimmedTail = linkedList.trimTail(2);

        expect(trimmedTail).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalTail).toEqual(linkedList.tail);
      });

      it('should return null & do nothing on an empty list with a provided node', () => {
        const linkedList = new LinkedListDouble<number>();

        const originalSize = linkedList.size();
        const originalTail = linkedList.tail;

        const trimmedHead = linkedList.trimTail(new NodeDouble(2));

        expect(trimmedHead).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalTail).toEqual(linkedList.tail);
      });

      it('should return null & do nothing if the provided value does not exist in the list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const originalSize = linkedList.size();
        const originalTail = linkedList.tail;

        const trimmedTail = linkedList.trimTail(-2);

        expect(trimmedTail).toBeNull();
        expect(originalSize).toEqual(linkedList.size());
        expect(originalTail).toEqual(linkedList.tail);
      });

      it('should return the the node after the found value & trim after the found value if the provided value exists in the list', () => {
        const values = [1, 2, 3, 4, 5, 6];
        const linkedList = new LinkedListDouble<number>(values);

        const targetNode = linkedList.find(4)?.node;
        const nodeAfterTarget = targetNode!.next;

        const trimmedTailHead = linkedList.trimTail(4);

        expect(trimmedTailHead).toEqual(nodeAfterTarget);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.tail).toEqual(targetNode);
      });

      it('should return the node after the existing node & trim after the existing node if the provided node exists in the list', () => {
        const values = [1, 2, 3, 4, 5, 6];
        const linkedList = new LinkedListDouble<number>(values);

        const targetNode = linkedList.find(4)!.node;
        expect(targetNode.next).not.toBeNull();

        const nodeAfterTarget = targetNode!.next;

        const trimmedTailHead = linkedList.trimTail(targetNode!);

        expect(trimmedTailHead).toEqual(nodeAfterTarget);
        expect(linkedList.size()).toEqual(4);
        expect(linkedList.tail).toEqual(targetNode);
        expect(targetNode.next).toBeNull();
      });
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


  describe('"Many" Operations', () => {
    describe('#prependMany', () => {
      it('should do nothing for an empty array provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [];
        const returnListCount = true;

        const result = linkedList.prependMany(addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from an array for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues = [6, 7, 8, 9, 10];
        const returnListCount = true;

        const result = linkedList.prependMany(addedValues, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should prepend array values to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = [6, 7, 8, 9, 10];
        const returnListCount = true;

        const result = linkedList.prependMany(addedValues, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
      });

      it('should prepend array nodes to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes = [
          new NodeDouble(6),
          new NodeDouble(7),
          new NodeDouble(8),
          new NodeDouble(9),
          new NodeDouble(10)
        ];
        const returnListCount = true;

        const result = linkedList.prependMany(addedNodes, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
      });

      it('should do nothing for an empty list provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>();
        const returnListCount = true;

        const result = linkedList.prependMany(addedList, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from a list for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        const returnListCount = true;

        const result = linkedList.prependMany(addedList, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should prepend a list to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        const returnListCount = true;

        const result = linkedList.prependMany(addedList, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
      });
    });

    describe('#appendMany', () => {
      it('should do nothing for an empty array provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [];
        const returnListCount = true;

        const result = linkedList.appendMany(addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from an array for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues = [6, 7, 8, 9, 10];
        const returnListCount = true;

        const result = linkedList.appendMany(addedValues, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should append array values to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = [6, 7, 8, 9, 10];
        const returnListCount = true;

        const result = linkedList.appendMany(addedValues, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should append array nodes to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes = [
          new NodeDouble(6),
          new NodeDouble(7),
          new NodeDouble(8),
          new NodeDouble(9),
          new NodeDouble(10)
        ];
        const returnListCount = true;

        const result = linkedList.appendMany(addedNodes, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should do nothing for an empty list provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>();
        const returnListCount = true;

        const result = linkedList.appendMany(addedList, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should generate a new list from a list for an existing empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        const returnListCount = true;

        const result = linkedList.appendMany(addedList, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([6, 7, 8, 9, 10]);
      });

      it('should append a list to an existing list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedList = new LinkedListDouble<number>([6, 7, 8, 9, 10]);
        const returnListCount = true;

        const result = linkedList.appendMany(addedList, returnListCount);

        expect(result).toEqual(5);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    describe('#insertManyBefore', () => {
      it('should do nothing and return 0 on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues: number[] = [1, 2, 3];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(3, addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing and return 0 if the reference value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(-3, addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should insert the provided array value items before the reference and return the number of items inserted into the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(3, addedValues, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 10, 9, 8, 3, 4, 5]);
      });

      it('should insert the provided array node items before the reference and return the number of items inserted into the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes: NodeDouble<number>[] = [
          new NodeDouble(10),
          new NodeDouble(9),
          new NodeDouble(8)];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(3, addedNodes, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 10, 9, 8, 3, 4, 5]);
      });

      it('should insert the provided array value items before the head, with the first item as the new head of the list if the reference matches the head', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(1, addedValues, returnListCount);

        expect(linkedList.head?.val).toEqual(10);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([10, 9, 8, 1, 2, 3, 4, 5]);
      });

      it('should insert the provided array node items before the head, with the first item as the new head of the list if the reference matches the head', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes: NodeDouble<number>[] = [
          new NodeDouble(10),
          new NodeDouble(9),
          new NodeDouble(8)];
        const returnListCount = true;

        const result = linkedList.insertManyBefore(1, addedNodes, returnListCount);

        expect(linkedList.head?.val).toEqual(10);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([10, 9, 8, 1, 2, 3, 4, 5]);
      });

      it('should insert the provided linked list before the reference and return the number of items inserted into the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = new LinkedListDouble<number>([10, 9, 8]);
        const returnListCount = true;

        const result = linkedList.insertManyBefore(3, addedValues, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 10, 9, 8, 3, 4, 5]);
      });

      it('should insert the provided linked list before the head, with the first node as the new head of the list if the reference matches the head', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = new LinkedListDouble<number>([10, 9, 8]);
        const returnListCount = true;

        const result = linkedList.insertManyBefore(1, addedValues, returnListCount);

        expect(linkedList.head?.val).toEqual(10);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([10, 9, 8, 1, 2, 3, 4, 5]);
      });
    });

    describe('#insertManyAfter', () => {
      it('should do nothing and return 0 on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const addedValues: number[] = [1, 2, 3];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(3, addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([]);
      });

      it('should do nothing and return 0 if the reference value is not found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(-3, addedValues, returnListCount);

        expect(result).toEqual(0);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);
      });

      it('should insert the provided array value items after the reference and return the number of items inserted into the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(3, addedValues, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 10, 9, 8, 4, 5]);
      });

      it('should insert the provided array node items after the reference and return the number of items inserted into the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes: NodeDouble<number>[] = [
          new NodeDouble(10),
          new NodeDouble(9),
          new NodeDouble(8)];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(3, addedNodes, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 10, 9, 8, 4, 5]);
      });

      it('should insert the provided array value items after the tail, with the last item as the new tail of the list if the reference matches the tail', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues: number[] = [10, 9, 8];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(5, addedValues, returnListCount);

        expect(linkedList.tail?.val).toEqual(8);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 10, 9, 8]);
      });

      it('should insert the provided array node items after the tail, with the last item as the new tail of the list if the reference matches the tail', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedNodes: NodeDouble<number>[] = [
          new NodeDouble(10),
          new NodeDouble(9),
          new NodeDouble(8)];
        const returnListCount = true;

        const result = linkedList.insertManyAfter(5, addedNodes, returnListCount);

        expect(linkedList.tail?.val).toEqual(8);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 10, 9, 8]);
      });

      it('should insert the provided linked list after the reference and return the number of items in the array', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = new LinkedListDouble<number>([10, 9, 8]);
        const returnListCount = true;

        const result = linkedList.insertManyAfter(3, addedValues, returnListCount);

        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 10, 9, 8, 4, 5]);
      });

      it('should insert the provided linked list after the tail, with the last node as the new tail of the list if the reference matches the tail', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const addedValues = new LinkedListDouble<number>([10, 9, 8]);
        const returnListCount = true;

        const result = linkedList.insertManyAfter(5, addedValues, returnListCount);

        expect(linkedList.tail?.val).toEqual(8);
        expect(result).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 10, 9, 8]);
      });
    });
  });


  describe('"Any" Operations', () => {
    describe('#findAny', () => {
      it('should return an empty array on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const nodes = linkedList.findAny(4)?.nodes;

        expect(nodes.length).toEqual(0);
      });

      it('should return an empty array on a list where the value is not found', () => {
        const values = [4, 1, 4, 2, 4];
        const linkedList = new LinkedListDouble<number>(values);

        const nodes = linkedList.findAny(-4)?.nodes;

        expect(nodes.length).toEqual(0);
      });


      it('should return an array of nodes that match the provided value in multiple locations in the list', () => {
        const values = [4, 1, 4, 2, 4];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.findAny(4);

        expect(nodes.length).toEqual(3);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([0, 2, 4]);
      });
    });

    describe('#removeAny', () => {
      it('should return an empty array on an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const nodes = linkedList.removeAny(4)?.nodes;

        expect(nodes.length).toEqual(0);
      });

      it('should return an empty array on a list where the value is not found', () => {
        const values = [4, 1, 4, 2, 4];
        const linkedList = new LinkedListDouble<number>(values);

        const nodes = linkedList.removeAny(-4)?.nodes;

        expect(nodes.length).toEqual(0);
      });

      it('should return an array of removed nodes that match the provided value in multiple locations in the list', () => {
        const values = [1, 4, 2, 4, 3, 4, 5, 4, 6, 4, 7];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(5);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([1, 3, 5, 7, 9]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
      });

      it(`should return an array of removed nodes that match the provided value
         in multiple locations in the list that are adjacent matches`, () => {
        const values = [1, 2, 3, 4, 4, 4, 5, 6, 7];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(3);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([3, 4, 5]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
      });

      it('should return an array of removed nodes that match the provided value at the head', () => {
        const values = [4, 1, 2, 3, 5, 6, 7];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(1);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([0]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
        expect(linkedList.head?.val).toEqual(1);
      });

      it('should return an array of removed nodes that match the provided value at the head, with multiple adjacent head matches', () => {
        const values = [4, 4, 4, 1, 2, 3, 5, 6, 7];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(3);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([0, 1, 2]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
        expect(linkedList.head?.val).toEqual(1);
      });

      it('should return an array of removed nodes that match the provided value at the tail', () => {
        const values = [1, 2, 3, 5, 6, 7, 4];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(1);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([6]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
        expect(linkedList.tail?.val).toEqual(7);
      });

      it('should return an array of removed nodes that match the provided value at the tail, with multiple adjacent head matches', () => {
        const values = [1, 2, 3, 5, 6, 7, 4, 4, 4];
        const linkedList = new LinkedListDouble<number>(values);

        const { nodes, indices } = linkedList.removeAny(4);

        expect(nodes.length).toEqual(3);
        expect(nodes[0].val).toEqual(4);
        expect(indices).toEqual([6, 7, 8]);

        expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7]);
        expect(linkedList.tail?.val).toEqual(7);
      });
    });
  });


  describe('Range Operations', () => {
    describe('#findRangeBetween', () => {
      it('should return null nodes and a length of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const result = linkedList.findRangeBetween(2, 4);

        expect(result.startNode).toBeNull();
        expect(result.endNode).toBeNull();
        expect(result.length).toEqual(0);
      });

      describe('Neither start value nor end value are found', () => {
        it('should return null nodes and a length of 0', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(-2, -4);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });
      });

      describe('End value not found', () => {
        it('should return the next node after the head node, null for the end node, & length of the list minus 1 if the start value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(1, 12);

          expect(result.startNode?.val).toEqual(2);
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(linkedList.size() - 1);
        });

        it('should return null nodes and a length of 0 if the start value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(9, 12);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it('should return the next node after the start node, null for the end node, & a length of the number of nodes from after the start value to the end for a start value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(4, 12);

          expect(result.startNode?.val).toEqual(5);
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(5);
        });
      });

      describe('Start value not found', () => {
        it('should return null nodes and a length of 0 if the end value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(-3, 1);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it(`should return null for the start node,
          the last node just before the tail of the list for the end node,
          & length of the list minus 1 if the end value is found at the tail`, () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(-3, 9);

          expect(result.startNode).toBeNull();
          expect(result.endNode?.val).toEqual(8);
          expect(result.length).toEqual(linkedList.size() - 1);
        });

        it(`should return null for the start node,
          the last node just before the end node,
          & a length of the end node position minus 1 for an end value found anywhere in the middle`, () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(-3, 5);

          expect(result.startNode).toBeNull();
          expect(result.endNode?.val).toEqual(4);
          expect(result.length).toEqual(4);
        });
      });

      describe('Start and End values are both found', () => {
        it('should return null nodes and a length of 0 if the end value is found before the start value', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(6, 4);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it('should return null nodes and a length of 0 if the start and end values are the same', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(4, 4);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it('should return null nodes and a length of 0 if the start and end values are adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeBetween(4, 5);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it(`should return the next node after the start node,
         last node before the end node, and length of the number of nodes between
         and excluding the start and end nodes`, () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result1 = linkedList.findRangeBetween(4, 6);

          expect(result1.startNode?.val).toEqual(5);
          expect(result1.endNode?.val).toEqual(5);
          expect(result1.length).toEqual(1);

          const resultMany = linkedList.findRangeBetween(2, 7);

          expect(resultMany.startNode?.val).toEqual(3);
          expect(resultMany.endNode?.val).toEqual(6);
          expect(resultMany.length).toEqual(4);
        });
      });

      // TODO: Work out how to test this. CANNOT seem to provide null arguments, as intended,
      //    yet higher up a calling tree, null can somehow be accepted.
      // Same with removeBetween with null+head as end, or start as tail+null resulting in no
      //    insertions, but prepend/append.
      // describe('Search values given as null', () => {
      //   it(`should return the start node and count from there to found end node
      //     when start node is given as null`, () => {
      //   });

      //   it(`should return the end node and count to there from the found start node
      //     when end node is given as null`, () => {

      //   });

      //   it(`should return the start node, end node, and count of the list length
      //     when start & end nodes are given as null`, () => {

      //   });
      // });
    });

    describe('#findRangeFromTo', () => {
      it('should return null nodes and a length of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const result = linkedList.findRangeFromTo(2, 4);

        expect(result.startNode).toBeNull();
        expect(result.endNode).toBeNull();
        expect(result.length).toEqual(0);
      });

      describe('Neither start value nor end value are found', () => {
        it('should return null nodes and a length of 0', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(-2, -4);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });
      });

      describe('End value not found', () => {
        it('should return head and tail of the list and length of the list if the start value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(1, 12);

          expect(result.startNode?.val).toEqual(1);
          expect(result.endNode?.val).toEqual(9);
          expect(result.length).toEqual(linkedList.size());
        });

        it('should return the tail as nodes and a length of 1 if the start value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(9, 12);

          expect(result.startNode?.val).toEqual(9);
          expect(result.endNode?.val).toEqual(9);
          expect(result.length).toEqual(1);
        });

        it('should return the start node, tail node, and a length of the list minus the start node position for a start value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(4, 12);

          expect(result.startNode?.val).toEqual(4);
          expect(result.endNode?.val).toEqual(9);
          expect(result.length).toEqual(6);
        });
      });

      describe('Start value not found', () => {
        it('should return the head as nodes and a length of 1 if the end value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(-3, 1);

          expect(result.startNode?.val).toEqual(1);
          expect(result.endNode?.val).toEqual(1);
          expect(result.length).toEqual(1);
        });

        it('should return head and tail of the list and length of the list if the end value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(-3, 9);

          expect(result.startNode?.val).toEqual(1);
          expect(result.endNode?.val).toEqual(9);
          expect(result.length).toEqual(linkedList.size());
        });

        it('should return the head node, end node, and a length of the end node position for an end value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(-3, 5);

          expect(result.startNode?.val).toEqual(1);
          expect(result.endNode?.val).toEqual(5);
          expect(result.length).toEqual(5);
        });
      });

      describe('Start and End values are both found', () => {
        it('should return null nodes and a length of 0 if the end value is found before the start value', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(6, 4);

          expect(result.startNode).toBeNull();
          expect(result.endNode).toBeNull();
          expect(result.length).toEqual(0);
        });

        it('should return the matching value as nodes and a length of 1 if the start and end values are the same', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(4, 4);

          expect(result.startNode?.val).toEqual(4);
          expect(result.endNode?.val).toEqual(4);
          expect(result.length).toEqual(1);
        });

        it('should return the start node, end node, and length of 2 if the start and end values are adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(4, 5);

          expect(result.startNode?.val).toEqual(4);
          expect(result.endNode?.val).toEqual(5);
          expect(result.length).toEqual(2);
        });

        it('should return the start node, end node, and length of the number of nodes between and including the start and end nodes', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const result = linkedList.findRangeFromTo(4, 7);

          expect(result.startNode?.val).toEqual(4);
          expect(result.endNode?.val).toEqual(7);
          expect(result.length).toEqual(4);
        });
      });
    });

    describe('#removeBetween', () => {
      it('should do nothing & return a null removed head node and a removal count of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();
        const returnListCount = true;

        const result = linkedList.removeBetween(2, 4, returnListCount);

        expect(result.head).toBeNull();
        expect(result.count).toEqual(0);

        expect(linkedList.size()).toEqual(0);
      });

      describe('Neither start value nor end value are found', () => {
        it('should do nothing & return a null removed head node and a removal count of 0', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(-2, -4, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });
      });

      describe('End value not found', () => {
        it('should remove nodes from the next node after the list head through the list end, if the start value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(1, 12, returnListCount);

          expect(result.head?.val).toEqual(2);
          expect(result.count).toEqual(8);

          expect(linkedList.toArray()).toEqual([1]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(1);
        });

        it('should do nothing if the start value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(9, 12, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });

        it('should remove nodes from the next node after the start node through the list end, for a start value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(4, 12, returnListCount);

          expect(result.head?.val).toEqual(5);
          expect(result.count).toEqual(5);

          expect(linkedList.toArray()).toEqual([1, 2, 3, 4]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(4);
        });
      });

      describe('Start value not found', () => {
        it('should do nothing if the end value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(-3, 1, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });

        it('should remove nodes from the head through the last node just before the tail of the list if the end value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(-3, 9, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(8);

          expect(linkedList.toArray()).toEqual([9]);
          expect(linkedList.head?.val).toEqual(9);
          expect(linkedList.tail?.val).toEqual(9);
        });

        it('should remove nodes from the head node through the last node just before the end node, for an end value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(-3, 5, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(4);

          expect(linkedList.toArray()).toEqual([5, 6, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(5);
          expect(linkedList.tail?.val).toEqual(9);
        });
      });

      describe('Start and End values are both found', () => {
        it('should do nothing if the end value is found before the start value', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(6, 4, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });

        it('should do nothing if the start and end values are the same', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(4, 4, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });

        it('should do nothing if the start and end values are adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeBetween(4, 5, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });

        it(`should remove nodes from the next node after the start node
      through the last node before the end node,
      if the start and end values are found in order, non-adjacent`, () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const startNode = linkedList.find(2)!.node;
          const endNode = linkedList.find(7)!.node;
          const removedHead = linkedList.find(3)!.node;
          const removedTail = linkedList.find(6)!.node;

          const result = linkedList.removeBetween(2, 7, returnListCount);

          expect(result.head?.val).toEqual(3);
          expect(result.count).toEqual(4);

          expect(linkedList.toArray()).toEqual([1, 2, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(9);

          expect(removedHead.prev).toBeNull();
          expect(removedTail.next).toBeNull();

          expect(startNode.next).toEqual(endNode);
          expect(endNode.prev).toEqual(startNode);
        });
      });
    });

    describe('#removeFromTo', () => {
      it('should do nothing & return a null removed head node and a removal count of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();
        const returnListCount = true;

        const result = linkedList.removeFromTo(2, 4, returnListCount);

        expect(result.head).toBeNull();
        expect(result.count).toEqual(0);

        expect(linkedList.size()).toEqual(0);
      });

      describe('Neither start value nor end value are found', () => {
        it('should do nothing & return a null removed head node and a removal count of 0', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(-2, -4, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);

          expect(linkedList.size()).toEqual(9);
        });
      });

      describe('End value not found', () => {
        it('should remove all nodes in the list if the start value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(1, 12, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(9);

          expect(linkedList.size()).toEqual(0);
        });

        it('should remove the tail node if the start value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(9, 12, returnListCount);

          expect(result.head?.val).toEqual(9);
          expect(result.count).toEqual(1);

          expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(8);
        });

        it('should remove nodes from the start node through the tail node for a start value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(4, 12, returnListCount);

          expect(result.head?.val).toEqual(4);
          expect(result.count).toEqual(6);

          expect(linkedList.toArray()).toEqual([1, 2, 3]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(3);
        });
      });

      describe('Start value not found', () => {
        it('should remove the head node if the end value is found at the head', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(-3, 1, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(1);

          expect(linkedList.toArray()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(2);
          expect(linkedList.tail?.val).toEqual(9);
        });

        it('should remove all nodes in the list if the end value is found at the tail', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(-3, 9, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(9);

          expect(linkedList.size()).toEqual(0);
        });

        it('should remove the head node through the end node for an end value found anywhere in the middle', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(-3, 5, returnListCount);

          expect(result.head?.val).toEqual(1);
          expect(result.count).toEqual(5);

          expect(linkedList.toArray()).toEqual([6, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(6);
          expect(linkedList.tail?.val).toEqual(9);
        });
      });

      describe('Start and End values are both found', () => {
        it('should do nothing if the end value is found before the start value', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(6, 4, returnListCount);

          expect(result.head).toBeNull();
          expect(result.count).toEqual(0);
        });

        it('should remove the matching value node if the start and end values are the same', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(4, 4, returnListCount);

          expect(result.head?.val).toEqual(4);
          expect(result.count).toEqual(1);

          expect(linkedList.toArray()).toEqual([1, 2, 3, 5, 6, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(9);
        });

        it('should remove the start node through the end node if the start and end values are adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const result = linkedList.removeFromTo(4, 5, returnListCount);

          expect(result.head?.val).toEqual(4);
          expect(result.count).toEqual(2);

          expect(linkedList.toArray()).toEqual([1, 2, 3, 6, 7, 8, 9]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(9);
        });

        it('should remove the start node through the end node if the start and end values are found in order, non-adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);
          const returnListCount = true;

          const startNode = linkedList.find(3)!.node;
          const endNode = linkedList.find(8)!.node;
          const removedHead = linkedList.find(4)!.node;
          const removedTail = linkedList.find(7)!.node;

          const result = linkedList.removeFromTo(4, 7, returnListCount);

          expect(result.head?.val).toEqual(4);
          expect(result.count).toEqual(4);

          expect(linkedList.toArray()).toEqual([1, 2, 3, 8, 9]);
          expect(linkedList.head?.val).toEqual(1);
          expect(linkedList.tail?.val).toEqual(9);

          expect(removedHead.prev).toBeNull();
          expect(removedTail.next).toBeNull();

          expect(startNode.next).toEqual(endNode);
          expect(endNode.prev).toEqual(startNode);
        });
      });
    });

    describe('#replaceBetween', () => {
      it('should return null nodes and a length of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const newValues = [101, 102, 103];
        const returnListCount = true;

        const result = linkedList.replaceBetween(2, 4, newValues, returnListCount);

        expect(result.insertedCount).toEqual(0);
        expect(result.removedCount).toEqual(0);
        expect(result.removedHead).toBeNull();

        expect(linkedList.toArray()).toEqual([]);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove nodes within the specified range when no replacement items are provided', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const linkedList = new LinkedListDouble<number>(values);

        const newValues: number[] = [];
        const returnListCount = true;

        const result = linkedList.replaceBetween(3, 12, newValues, returnListCount);

        expect(result.insertedCount).toEqual(0);
        expect(result.removedCount).toEqual(6);
        expect(result.removedHead?.val).toEqual(4);

        expect(linkedList.toArray()).toEqual([1, 2, 3]);
        expect(linkedList.size()).toEqual(3);
      });

      describe('with an array of values', () => {
        describe('Neither start value nor end value are found', () => {
          it('should do nothing & return a null removed head, a removal count of 0 and an insertion count of 0', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(-2, -4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });
        });

        describe('End value not found', () => {
          it('should replace nodes from the next node after the list head through the list end, if the start value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(1, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(8);
            expect(result.removedHead?.val).toEqual(2);

            expect(linkedList.toArray()).toEqual([1, 101, 102, 103]);
            expect(linkedList.size()).toEqual(4);
          });

          it('should only append if the start value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(9, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 101, 102, 103]);
            expect(linkedList.size()).toEqual(12);
          });

          it('should replace nodes from the next node after the start node through the list end, for a start value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(5);
            expect(result.removedHead?.val).toEqual(5);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 101, 102, 103]);
            expect(linkedList.size()).toEqual(7);
          });
        });

        describe('Start value not found', () => {
          it('should only prepend if the end value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 1, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([101, 102, 103, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(12);
          });

          it('should replace nodes from the head through the last node just before the tail of the list if the end value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 9, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(8);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 9]);
            expect(linkedList.size()).toEqual(4);
          });

          it('should replace nodes from the head node through the last node just before the end node, for an end value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(4);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(8);
          });
        });

        describe('Start and End values are both found', () => {
          it('should do nothing if the end value is found before the start value', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(6, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should do nothing if the start and end values are the same', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should only insert items if the start and end values are adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(12);
          });

          it(`should replace nodes from the next node after the start node
            through the last node before the end node,
            if the start and end values are found in order, non-adjacent`, () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceBetween(2, 7, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(4);
            expect(result.removedHead?.val).toEqual(3);

            expect(linkedList.toArray()).toEqual([1, 2, 101, 102, 103, 7, 8, 9]);
            expect(linkedList.size()).toEqual(8);
          });
        });
      });

      describe('with an array of nodes', () => {
        it(`should replace nodes from the next node after the start node
        through the last node before the end node,
        if the start and end values are found in order, non-adjacent`, () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const newNodes = [
            new NodeDouble(101),
            new NodeDouble(102),
            new NodeDouble(103)
          ];
          const returnListCount = true;

          const result = linkedList.replaceBetween(2, 7, newNodes, returnListCount);

          expect(result.insertedCount).toEqual(3);
          expect(result.removedCount).toEqual(4);
          expect(result.removedHead?.val).toEqual(3);

          expect(linkedList.toArray()).toEqual([1, 2, 101, 102, 103, 7, 8, 9]);
          expect(linkedList.size()).toEqual(8);
        });
      });

      describe('with a linked list of values', () => {
        describe('Neither start value nor end value are found', () => {
          it('should do nothing & return a null removed head, a removal count of 0 and an insertion count of 0', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(-2, -4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });
        });

        describe('End value not found', () => {
          it('should replace nodes from the next node after the list head through the list end, if the start value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(1, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(8);
            expect(result.removedHead?.val).toEqual(2);

            expect(linkedList.toArray()).toEqual([1, 101, 102, 103]);
            expect(linkedList.size()).toEqual(4);
          });

          it('should only append if the start value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(9, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 101, 102, 103]);
            expect(linkedList.size()).toEqual(12);
          });

          it('should replace nodes from the next node after the start node through the list end, for a start value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(5);
            expect(result.removedHead?.val).toEqual(5);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 101, 102, 103]);
            expect(linkedList.size()).toEqual(7);
          });
        });

        describe('Start value not found', () => {
          it('should only prepend if the end value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 1, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([101, 102, 103, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(12);
          });

          it('should replace nodes from the head through the last node just before the tail of the list if the end value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 9, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(8);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 9]);
            expect(linkedList.size()).toEqual(4);
          });

          it('should replace nodes from the head node through the last node just before the end node, for an end value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(-3, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(4);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(8);
          });
        });

        describe('Start and End values are both found', () => {
          it('should do nothing if the end value is found before the start value', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(6, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should do nothing if the start and end values are the same', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should only insert items if the start and end values are adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(4, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(12);
          });

          it(`should replace nodes from the next node after the start node
            through the last node before the end node,
            if the start and end values are found in order, non-adjacent`, () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceBetween(2, 7, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(4);
            expect(result.removedHead?.val).toEqual(3);

            expect(linkedList.toArray()).toEqual([1, 2, 101, 102, 103, 7, 8, 9]);
            expect(linkedList.size()).toEqual(8);
          });
        });
      });
    });

    describe('#replaceFromTo', () => {
      it('should return null nodes and a length of 0 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const newValues = [101, 102, 103];
        const returnListCount = true;

        const result = linkedList.replaceFromTo(2, 4, newValues, returnListCount);

        expect(result.insertedCount).toEqual(0);
        expect(result.removedCount).toEqual(0);
        expect(result.removedHead).toBeNull();

        expect(linkedList.toArray()).toEqual([]);
        expect(linkedList.size()).toEqual(0);
      });

      it('should remove nodes within the specified range when no replacement items are provided', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const linkedList = new LinkedListDouble<number>(values);

        const newValues: number[] = [];
        const returnListCount = true;

        const result = linkedList.replaceFromTo(3, 12, newValues, returnListCount);

        expect(result.insertedCount).toEqual(0);
        expect(result.removedCount).toEqual(7);
        expect(result.removedHead?.val).toEqual(3);

        expect(linkedList.toArray()).toEqual([1, 2]);
        expect(linkedList.size()).toEqual(2);
      });

      describe('with an array of values', () => {
        describe('Neither start value nor end value are found', () => {
          it('should do nothing & return a null removed head, a removal count of 0 and an insertion count of 0', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-2, -4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });
        });

        describe('End value not found', () => {
          it('should replace all nodes in the list if the start value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(1, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(9);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103]);
            expect(linkedList.size()).toEqual(3);
          });

          it('should replace the tail node if the start value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(9, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(9);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 101, 102, 103]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace nodes from the start node through the tail node for a start value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(6);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103]);
            expect(linkedList.size()).toEqual(6);
          });
        });

        describe('Start value not found', () => {
          it('should replace the head node if the end value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 1, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace all nodes in the list if the end value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 9, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(9);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103]);
            expect(linkedList.size()).toEqual(3);
          });

          it('should replace the head node through the end node for an end value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(5);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(7);
          });
        });

        describe('Start and End values are both found', () => {
          it('should do nothing if the end value is found before the start value', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(6, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should replace the matching value node if the start and end values are the same', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace the start node through the end node if the start and end values are adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(2);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(10);
          });

          it('should replace the start node through the end node if the start and end values are found in order, non-adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = [101, 102, 103];
            const returnListCount = true;

            const result = linkedList.replaceFromTo(2, 7, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(6);
            expect(result.removedHead?.val).toEqual(2);

            expect(linkedList.toArray()).toEqual([1, 101, 102, 103, 8, 9]);
            expect(linkedList.size()).toEqual(6);
          });
        });
      });

      describe('with an array of nodes', () => {
        it('should replace the start node through the end node if the start and end values are found in order, non-adjacent', () => {
          const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const linkedList = new LinkedListDouble<number>(values);

          const newNodes = [
            new NodeDouble(101),
            new NodeDouble(102),
            new NodeDouble(103)
          ];
          const returnListCount = true;

          const result = linkedList.replaceFromTo(2, 7, newNodes);

          expect(result.insertedCount).toEqual(3);
          expect(result.removedCount).toEqual(6);
          expect(result.removedHead?.val).toEqual(2);

          expect(linkedList.toArray()).toEqual([1, 101, 102, 103, 8, 9]);
          expect(linkedList.size()).toEqual(6);
        });
      });

      describe('with a linked list of values', () => {
        describe('Neither start value nor end value are found', () => {
          it('should do nothing & return a null removed head, a removal count of 0 and an insertion count of 0', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-2, -4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });
        });

        describe('End value not found', () => {
          it('should replace all nodes in the list if the start value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(1, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(9);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103]);
            expect(linkedList.size()).toEqual(3);
          });

          it('should replace the tail node if the start value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(9, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(9);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 101, 102, 103]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace nodes from the start node through the tail node for a start value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 12, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(6);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103]);
            expect(linkedList.size()).toEqual(6);
          });
        });

        describe('Start value not found', () => {
          it('should replace the head node if the end value is found at the head', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 1, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace all nodes in the list if the end value is found at the tail', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 9, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(9);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103]);
            expect(linkedList.size()).toEqual(3);
          });

          it('should replace the head node through the end node for an end value found anywhere in the middle', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(-3, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(5);
            expect(result.removedHead?.val).toEqual(1);

            expect(linkedList.toArray()).toEqual([101, 102, 103, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(7);
          });
        });

        describe('Start and End values are both found', () => {
          it('should do nothing if the end value is found before the start value', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(6, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(0);
            expect(result.removedCount).toEqual(0);
            expect(result.removedHead).toBeNull();

            expect(linkedList.toArray()).toEqual(values);
            expect(linkedList.size()).toEqual(9);
          });

          it('should replace the matching value node if the start and end values are the same', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 4, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(1);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103, 5, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(11);
          });

          it('should replace the start node through the end node if the start and end values are adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(4, 5, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(2);
            expect(result.removedHead?.val).toEqual(4);

            expect(linkedList.toArray()).toEqual([1, 2, 3, 101, 102, 103, 6, 7, 8, 9]);
            expect(linkedList.size()).toEqual(10);
          });

          it('should replace the start node through the end node if the start and end values are found in order, non-adjacent', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const linkedList = new LinkedListDouble<number>(values);

            const newValues = new LinkedListDouble<number>([101, 102, 103]);
            const returnListCount = true;

            const result = linkedList.replaceFromTo(2, 7, newValues, returnListCount);

            expect(result.insertedCount).toEqual(3);
            expect(result.removedCount).toEqual(6);
            expect(result.removedHead?.val).toEqual(2);

            expect(linkedList.toArray()).toEqual([1, 101, 102, 103, 8, 9]);
            expect(linkedList.size()).toEqual(6);
          });
        });
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

        expect(results[0]).toBeNull();
        expect(results[1]).toBeNull();
      });

      it('should return the right side of the list as the second list if only the ending value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(-1, 3);

        expect(results[0]).toBeNull();

        const resultsLeft = results[1]?.toArray();
        expect(resultsLeft).toEqual([3, 4, 5]);

      });

      it('should return the left side of the list as the first list if only the starting value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const results = linkedList.splitBetween(3, 10);

        const resultsRight = results[0]?.toArray();
        expect(resultsRight).toEqual([1, 2, 3]);

        expect(results[1]).toBeNull();
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


  describe('Misc Operations', () => {
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

    describe('#sizeFromTo', () => {
      it('should return -1 for an empty list', () => {
        const linkedList = new LinkedListDouble<number>();

        const startNode = new NodeDouble(-1);
        const endNode = new NodeDouble(-2);

        const countResult = linkedList.sizeFromTo(startNode, endNode)

        expect(countResult).toEqual(-1);
      });

      it('should return -1 if neither provided value is found', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const startNode = new NodeDouble(-1);
        const endNode = new NodeDouble(-2);

        const countResult = linkedList.sizeFromTo(startNode, endNode);

        expect(countResult).toEqual(-1);
      });

      it('should return -1 if the provided start node is located after the provided end node', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const startNode = new NodeDouble(4);
        const endNode = new NodeDouble(2);

        const countResult = linkedList.sizeFromTo(startNode, endNode);

        expect(countResult).toEqual(-1);
      });

      it('should return the length of the list if only null nodes are provided', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const countResult = linkedList.sizeFromTo(null, null);

        expect(countResult).toEqual(5);
      });

      it('should return the number of nodes up to and including the second provided node if the first provided node is null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const endNode = linkedList.find(4)?.node;

        const countResult = linkedList.sizeFromTo(null, endNode!);

        expect(countResult).toEqual(4);
      });

      it('should return the number of nodes after and including the first provided node if the second provided node is null', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const startNode = linkedList.find(2)?.node;

        const countResult = linkedList.sizeFromTo(startNode!, null);

        expect(countResult).toEqual(4);
      });

      it('should return the number of nodes between and including the provided nodes', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const startNode = linkedList.find(2)?.node;
        const endNode = linkedList.find(4)?.node;

        const countResult = linkedList.sizeFromTo(startNode!, endNode!);

        expect(countResult).toEqual(3);
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

    // TODO: Add tests
    describe('#setEqualityCB', () => {
      it('should match based on equal node values', () => {
        // findAny, number valye
      });

      it('should match based on nodes with references to the same value object', () => {
        // findAny, object value
      });

      it('should match based on callback that matches based on a partial set of value properties, for nodes with values referencing different objects', () => {
        // findAny, object value with partial matches, CB that finds partial matches to be equal
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

    // // TODO: Implement & test
    // describe('#orderBy', () => {
    //   it('should ', () => {

    //   });

    //   it('should ', () => {

    //   });
    // });

    describe('#toLinkedListDouble', () => {
      it('should convert the linked list to a doubly linked list', () => {
        const values = [1, 2, 3, 4, 5];
        const linkedList = new LinkedListDouble<number>(values);

        const result = linkedList.toLinkedListSingle();
        expect(result).toBeInstanceOf(LinkedListSingle);
        expect(result.head).not.toHaveProperty('prev');
        expect(result.toArray()).toEqual([1, 2, 3, 4, 5]);
      });
    });
  });

  // TODO: Add tests. See #find, possibly extract those tests.
  describe('Matching Operations', () => {
    // Do one for each function using CB in each of the following cases
    describe('Default Cases', () => {
      // Do not set default, do not specify CB at method
    });

    describe('List Default Suppression Cases', () => {
      // Set default, Specify null at method
    });

    describe('List Default Cases', () => {
      // Set default, Do not specify CB at method
    });

    describe('Function Specified Cases', () => {
      // Specify CB at method
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