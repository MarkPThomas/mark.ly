import { LinkedList } from './LinkedListSingle';

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

    it('should return the updated size of the linked list after adding a key', () => {
      const values = [1, 2, 3, 4, 5];
      const linkedList = new LinkedList<number>(values);

      expect(linkedList.size()).toEqual(5);
    });

    it('should return the updated size of the linked list after removing a key', () => {

    });

    it('should return the updated size of the linked list after adding a node', () => {

    });

    it('should return the updated size of the linked list after removing a node', () => {

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

    });
  });

  describe('#prependNode', () => {
    it('should add a node as head & tail to an empty list', () => {

    });

    it('should add a node at the beginning of a list', () => {

    });
  });

  describe('#append', () => {
    it('should add a key as head & tail to an empty list', () => {

    });

    it('should add a key at the end of a list', () => {

    });
  });

  describe('#appendNode', () => {
    it('should add a node as head & tail to an empty list', () => {

    });

    it('should add a node at the end of a list', () => {

    });
  });

  describe('#find', () => {
    it('should return null on an empty list', () => {

    });

    it('should return null if key is not found', () => {

    });

    it('should return the node with the key that is found', () => {

    });
  });

  describe('#remove', () => {
    it('should do nothing on an empty list & return null', () => {

    });

    it('should do nothing on a list where the key is not found & retun null', () => {

    });

    it('should remove the sole node from a list where the key is found & return the removed node', () => {

    });

    it('should remove the node from a list where the key is found & return the removed node', () => {

    });
  });

  describe('#removeNode', () => {
    it('should do nothing on an empty list & return null', () => {

    });

    it('should do nothing on a list where the key is not found & retun null', () => {

    });

    it('should remove the sole node from a list where the key is found & return the removed node', () => {

    });

    it('should remove the node from a list where the key is found & return the removed node', () => {

    });
  });

  describe('#removeHead', () => {
    it('should return null on an empty list', () => {

    });

    it('should remove and return the sole node in a list', () => {

    });
    it('should remove & return the head in a list', () => {

    });
  });

  describe('#removeTail', () => {
    it('should return null on an empty list', () => {

    });

    it('should remove and return the sole node in a list', () => {

    });
    it('should remove & return the tail in a list', () => {

    });
  });

  describe('#moveToHead', () => {
    it('should do nothing on an empty list', () => {

    });

    it('should do nothing on a list where the node is not found', () => {

    });

    it('should do nothing on a list of a single node', () => {

    });

    it('should move a found node to the head of the list', () => {

    });
  });
});