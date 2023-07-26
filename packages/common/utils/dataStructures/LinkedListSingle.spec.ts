import { LinkedList, Node } from './LinkedListSingle';

describe('##LinkedListSingle', () => {
  describe('#constructor', () => {
    it('should initialize an empty list if no arguments are provided', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.size()).toEqual(0);
      expect(linkedList.getHead()).toBeNull();
      expect(linkedList.getTail()).toBeNull();
    })

    it('should initialize a linked list from an argument of an array', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);
      expect(linkedList.getHead()?.key).toEqual(1);
      expect(linkedList.getTail()?.key).toEqual(5);
    })
  });

  describe('#size', () => {
    it('should return 0 for an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.size()).toEqual(0);
    });

    it('should return the size of the linked list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);
    });

    it('should return the updated size of the linked list after appending a key', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.append(6);

      expect(linkedList.size()).toEqual(6);

    });

    it('should return the updated size of the linked list after prepending a key', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.prepend(7);

      expect(linkedList.size()).toEqual(6);

    });

    it('should return the updated size of the linked list after removing a key', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.remove(3);

      expect(linkedList.size()).toEqual(4);
    });

    it('should return the updated size of the linked list after appending a node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      const node = new Node<number>(6);

      linkedList.appendNode(node);

      expect(linkedList.size()).toEqual(6);
    });

    it('should return the updated size of the linked list after prepending a node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      const node = new Node<number>(6);

      linkedList.prependNode(node);

      expect(linkedList.size()).toEqual(6);
    });

    it('should return the updated size of the linked list after removing a node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      const node = new Node<number>(3);

      linkedList.removeNode(node);

      expect(linkedList.size()).toEqual(4);
    });

    it('should return the updated size of the linked list after removing a head node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.removeHead();

      expect(linkedList.size()).toEqual(4);
    });

    it('should return the updated size of the linked list after removing a tail node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.removeTail();

      expect(linkedList.size()).toEqual(4);
    });
  });

  describe('#getHead', () => {
    it('should return null for an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.getHead()).toBeNull();
    });

    it('should return the head of the list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()?.key).toEqual(1);
    });
  });

  describe('#getTail', () => {
    it('should return null for an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.getTail()).toBeNull();
    });

    it('should return the tail of the list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getTail()?.key).toEqual(5);
    });
  });

  describe('#toArray', () => {
    it('should return an empty array for an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.toArray()).toEqual([]);
    });

    it('should return an array of nodes in the list in order of the linked list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.toArray()).toEqual(values);
    });
  });

  describe('#prepend', () => {
    it('should add a key as head & tail to an empty list', () => {
      const linkedList = new LinkedList<number>();
      linkedList.prepend(5);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.getHead()?.key).toEqual(5);
      expect(linkedList.getTail()?.key).toEqual(5);
    });

    it('should add a key at the beginning of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.prepend(6);

      expect(linkedList.size()).toEqual(6);
      expect(linkedList.getHead()?.key).toEqual(6);
      expect(linkedList.getTail()?.key).toEqual(5);
    });
  });

  describe('#prependNode', () => {
    it('should add a node as head & tail to an empty list', () => {
      const linkedList = new LinkedList<number>();

      const node = new Node<number>(5);
      linkedList.prependNode(node);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.getHead()?.key).toEqual(5);
      expect(linkedList.getTail()?.key).toEqual(5);
    });

    it('should add a node at the beginning of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      const node = new Node<number>(6);
      linkedList.prependNode(node);

      expect(linkedList.size()).toEqual(6);
      expect(linkedList.getHead()?.key).toEqual(6);
      expect(linkedList.getTail()?.key).toEqual(5);
    });
  });

  describe('#append', () => {
    it('should add a key as head & tail to an empty list', () => {
      const linkedList = new LinkedList<number>();
      linkedList.append(5);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.getHead()?.key).toEqual(5);
      expect(linkedList.getTail()?.key).toEqual(5);
    });

    it('should add a key at the end of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.append(6);

      expect(linkedList.size()).toEqual(6);
      expect(linkedList.getHead()?.key).toEqual(1);
      expect(linkedList.getTail()?.key).toEqual(6);
    });
  });

  describe('#appendNode', () => {
    it('should add a node as head & tail to an empty list', () => {
      const linkedList = new LinkedList<number>();
      const node = new Node<number>(5);

      linkedList.appendNode(node);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.getHead()?.key).toEqual(5);
      expect(linkedList.getTail()?.key).toEqual(5);
    });

    it('should add a node at the end of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      const node = new Node<number>(6);
      linkedList.appendNode(node);

      expect(linkedList.size()).toEqual(6);
      expect(linkedList.getHead()?.key).toEqual(1);
      expect(linkedList.getTail()?.key).toEqual(6);

    });
  });

  describe('#find', () => {
    it('should return null on an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.find(1)).toBeNull();
    });

    it('should return null if key is not found', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.find(-1)).toBeNull();
    });

    it('should return the node with the key that is found', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      const node = new Node(3);
      expect(linkedList.find(3)).toEqual(node);
    });
  });

  describe('#remove', () => {
    it('should do nothing on an empty list & return null', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.size()).toEqual(0);
      expect(linkedList.remove(-1)).toBeNull();
      expect(linkedList.size()).toEqual(0);
    });

    it('should do nothing on a list where the key is not found & retun null', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(0);
      expect(linkedList.remove(-1)).toBeNull();
      expect(linkedList.size()).toEqual(0);
    });

    it('should remove the sole node from a list where the key is found & return the removed node', () => {
      const values = [3];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.remove(3)).toEqual(3);
      expect(linkedList.size()).toEqual(0);
    });

    it('should remove the head of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(5);
      expect(linkedList.remove(1)).toEqual(1);
      expect(linkedList.getHead()).toEqual(2);
      expect(linkedList.getTail()).toEqual(5);
    });

    it('should remove the tail of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(5);
      expect(linkedList.remove(5)).toEqual(1);
      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(4);
    });

    it('should remove the node from a list where the key is found & return the removed node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);
      expect(linkedList.remove(3)).toEqual(3);
      expect(linkedList.size()).toEqual(4);
    });

    it('should remove the last remaining node in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

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
      expect(linkedList.getHead()).toBeNull();
      expect(linkedList.getTail()).toBeNull();
    });
  });

  describe('#removeNode', () => {
    it('should do nothing on an empty list & return null', () => {
      const linkedList = new LinkedList<number>();
      const node = new Node<number>(6);

      expect(linkedList.size()).toEqual(0);
      expect(linkedList.removeNode(node)).toBeNull();
      expect(linkedList.size()).toEqual(0);
    });

    it('should do nothing on a list where the key is not found & retun null', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);
      const node = new Node<number>(6);

      expect(linkedList.size()).toEqual(0);
      expect(linkedList.removeNode(node)).toBeNull();
      expect(linkedList.size()).toEqual(0);
    });

    it('should remove the sole node from a list where the key is found & return the removed node', () => {
      const values = [3];
      const linkedList = new LinkedList<number>(values);
      const node = new Node<number>(3);

      expect(linkedList.size()).toEqual(1);
      expect(linkedList.removeNode(node)).toEqual(3);
      expect(linkedList.size()).toEqual(0);
    });

    it('should remove the head of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);
      const node = new Node(1);

      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(5);
      expect(linkedList.removeNode(node)).toEqual(1);
      expect(linkedList.getHead()).toEqual(2);
      expect(linkedList.getTail()).toEqual(5);
    });

    it('should remove the tail of a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);
      const node = new Node(5);

      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(5);
      expect(linkedList.removeNode(node)).toEqual(1);
      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(4);
    });

    it('should remove the node from a list where the key is found & return the removed node', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);
      const node = new Node<number>(3);

      expect(linkedList.size()).toEqual(5);
      expect(linkedList.removeNode(node)).toEqual(3);
      expect(linkedList.size()).toEqual(4);
    });

    it('should remove the last remaining node in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);

      linkedList.removeNode(new Node<number>(3));
      expect(linkedList.size()).toEqual(4);
      linkedList.removeNode(new Node<number>(2));
      expect(linkedList.size()).toEqual(3);
      linkedList.removeNode(new Node<number>(4));
      expect(linkedList.size()).toEqual(2);
      linkedList.removeNode(new Node<number>(5));
      expect(linkedList.size()).toEqual(1);
      linkedList.removeNode(new Node<number>(1));
      expect(linkedList.size()).toEqual(0);
      expect(linkedList.getHead()).toBeNull();
      expect(linkedList.getTail()).toBeNull();

      linkedList.removeNode(new Node<number>(1));
      expect(linkedList.size()).toEqual(0);
    });
  });

  describe('#removeHead', () => {
    it('should return null on an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.removeHead()).toBeNull();
    });

    it('should remove and return the sole node in a list', () => {
      const values = [3];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.removeHead()).toEqual(3);
    });

    it('should remove & return the head in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.removeHead()).toEqual(1);
    });

    it('should remove the last remaining node in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

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
      expect(linkedList.getHead()).toBeNull();
      expect(linkedList.getTail()).toBeNull();

      linkedList.removeHead();
      expect(linkedList.size()).toEqual(0);
    })
  });

  describe('#removeTail', () => {
    it('should return null on an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.removeTail()).toBeNull();
    });

    it('should remove and return the sole node in a list', () => {
      const values = [3];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.removeTail()).toEqual(3);
    });

    it('should remove & return the tail in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.removeTail()).toEqual(5);
    });

    it('should remove the last remaining node in a list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

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
      expect(linkedList.getHead()).toBeNull();
      expect(linkedList.getTail()).toBeNull();

      linkedList.removeTail();
      expect(linkedList.size()).toEqual(0);
    })
  });

  describe('#moveToHead', () => {
    it('should do nothing on an empty list', () => {
      const linkedList = new LinkedList<number>();

      expect(linkedList.getHead()).toBeNull();

      const node = new Node<number>(3);
      expect(linkedList.moveToHead(node)).toBeFalsy();

      expect(linkedList.getHead()).toBeNull();
    });

    it('should do nothing on a list where the node is not found', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(1);
      // TODO: Change this to compare array output for total list state

      const node = new Node<number>(3);
      expect(linkedList.moveToHead(node)).toBeFalsy();

      expect(linkedList.getHead()).toEqual(1);
      // TODO: Change this to compare array output for total list state
    });

    it('should do nothing on a list of a single node', () => {
      const values = [3];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(3);
      expect(linkedList.getTail()).toEqual(3);
      // TODO: Change this to compare array output for total list state

      const node = new Node<number>(3);
      expect(linkedList.moveToHead(node)).toBeFalsy();

      expect(linkedList.getHead()).toEqual(3);
      expect(linkedList.getTail()).toEqual(3);
      // TODO: Change this to compare array output for total list state
    });

    it('should move a found node to the head of the list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(1);
      // TODO: Change this to compare array output for total list state

      const node = new Node<number>(3);
      expect(linkedList.moveToHead(node)).toBeTruthy();

      expect(linkedList.getHead()).toEqual(3);
      // TODO: Change this to compare array output for total list state
    });

    it('should move a tail node to the head of the list', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.getHead()).toEqual(1);
      expect(linkedList.getTail()).toEqual(5);
      // TODO: Change this to compare array output for total list state

      const node = new Node<number>(5);
      expect(linkedList.moveToHead(node)).toBeTruthy();

      expect(linkedList.getHead()).toEqual(5);
      expect(linkedList.getTail()).toEqual(4);
      // TODO: Change this to compare array output for total list state
    });
  });
});