import { Node, NodeDouble, NodeKeyVal, NodeDoubleKeyVal } from './LinkedListNodes';

describe('##Node', () => {
  describe('#constructor', () => {
    it('should have a value assigned at initialization and expected defaults', () => {
      const node = new Node(5);
      expect(node.val).toEqual(5);
      expect(node.next).toBeNull();
    });

    it('should link to another node with a "next" assignment', () => {
      const node = new Node(5);
      const nodeNext = new Node(6);
      node.next = nodeNext;

      expect(node.next.val).toEqual(6);
    });
  });

  describe('#equals', () => {
    it('should return true for two equal values', () => {
      const node = new Node(5);

      expect(node.equals(5)).toBeTruthy();
    });

    it('should return false for two unequal values', () => {
      const node = new Node(5);

      expect(node.equals(4)).toBeFalsy();
    });

    it('should return true for two references to the same object', () => {
      const valueObject = {
        name: "foo",
        age: 32
      };
      const node = new Node(valueObject);

      expect(node.equals(valueObject)).toBeTruthy();
    });

    it('should return false for two references to different objects, even if properties are equal', () => {
      const valueObject1 = {
        name: "foo",
        age: 32
      };
      const node = new Node(valueObject1);

      const valueObject2 = { ...valueObject1 };

      expect(node.equals(valueObject2)).toBeFalsy();
    });

    it(`should return true result of equality callback provided for two references to different
      objects of equal properties`, () => {
      type demo = { name: string, age: number, other: any }
      const valueObject1: demo = {
        name: "foo",
        age: 32,
        other: [1]
      };
      const node = new Node(valueObject1);

      const valueObject2: demo = {
        ...valueObject1,
        other: { b: "A" }
      };

      const equalsCB = (a: demo, b: demo) => a.name === b.name && a.age === b.age;

      expect(node.equals(valueObject1, equalsCB)).toBeTruthy();
    });

    it(`should return false result of equality callback provided for two references to different
      objects of different properties`, () => {
      type demo = { name: string, age: number }
      const valueObject1: demo = {
        name: "foo",
        age: 32
      };
      const node = new Node(valueObject1);

      const valueObject2: demo = {
        name: "bar",
        age: 32
      };

      const equalsCB = (a: demo, b: demo) => a.name === b.name && a.age === b.age;

      expect(node.equals(valueObject2, equalsCB)).toBeFalsy();
    });
  });

  describe('#toObject', () => {
    it('should return a key:value object of select properties meant to represent the node', () => {
      const node = new Node(5)

      expect(node.toObject()).toEqual({ val: 5 });
    })
  });
});

describe('##NodeKeyVal', () => {
  describe('#constructor', () => {
    it('should have a key and value assigned at initialization and expected defaults', () => {
      const node = new NodeKeyVal("A", 5);
      expect(node.key).toEqual("A");
      expect(node.val).toEqual(5);
      expect(node.next).toBeNull();
    });
  });

  describe('#toObject', () => {
    it('should return a key:value object of select properties meant to represent the node', () => {
      const node = new NodeDoubleKeyVal(3, 'A')

      expect(node.toObject()).toEqual({ val: 'A', key: 3 });
    });
  });
});

describe('##NodeDouble', () => {
  describe('#constructor', () => {
    it('should have a value assigned at initialization and expected defaults', () => {
      const node = new NodeDouble(5);
      expect(node.val).toEqual(5);
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });

    it('should link to another node with a "next" assignment', () => {
      const node = new NodeDouble(5);
      const nodeNext = new NodeDouble(6);
      node.next = nodeNext;

      expect(node.next.val).toEqual(6);
    });

    it('should link to another node with a "prev" assignment', () => {
      const node = new NodeDouble(5);
      const nodePrev = new NodeDouble(4);
      node.prev = nodePrev;

      expect(node.prev.val).toEqual(4);
    });
  });

  describe('#removeNode', () => {
    it('should do nothing for a node with no "next/prev" links', () => {
      const node = new NodeDouble(5);

      expect(node.removeNode()).toBeFalsy();
    });

    it('should disconnect node from "next" assignment', () => {
      const node = new NodeDouble(5);

      const nodeNext = new NodeDouble(6);
      node.next = nodeNext;

      expect(node.removeNode()).toBeTruthy();
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });

    it('should disconnect node from "prev" assignments', () => {
      const node = new NodeDouble(5);

      const nodePrev = new NodeDouble(4);
      node.prev = nodePrev;

      expect(node.removeNode()).toBeTruthy();
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });

    it('should disconnect node from "next/prev" assignments', () => {
      const node = new NodeDouble(5);

      const nodeNext = new NodeDouble(6);
      node.next = nodeNext;

      const nodePrev = new NodeDouble(4);
      node.prev = nodePrev;

      expect(node.removeNode()).toBeTruthy();
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });

    it('should link "next" to null if only link', () => {
      const node = new NodeDouble(5);

      const nodeNext = new NodeDouble(6);
      node.next = nodeNext;

      node.removeNode();

      expect(nodeNext.prev).toBeNull();
    });


    it('should link "prev" to null if only link', () => {
      const node = new NodeDouble(5);

      const nodePrev = new NodeDouble(4);
      node.prev = nodePrev;

      node.removeNode();

      expect(nodePrev.next).toBeNull();
    });


    it('should link "next" & "prev" nodes together if both present', () => {
      const node = new NodeDouble(5);

      const nodeNext = new NodeDouble(6);
      node.next = nodeNext;
      nodeNext.prev = node;

      const nodePrev = new NodeDouble(4);
      node.prev = nodePrev;
      nodePrev.next = node;

      expect(node.removeNode()).toBeTruthy();
      expect(nodeNext.prev).toEqual(nodePrev);
      expect(nodePrev.next).toEqual(nodeNext);
    });
  });

  describe('#toObject', () => {
    it('should return a key:value object of select properties meant to represent the node', () => {
      const node = new Node(5)

      expect(node.toObject()).toEqual({ val: 5 });
    })
  });
});

describe('##NodeDoubleKeyVal', () => {
  describe('#constructor', () => {
    it('should have a key and value assigned at initialization and expected defaults', () => {
      const node = new NodeDoubleKeyVal("A", 5);
      expect(node.key).toEqual("A");
      expect(node.val).toEqual(5);
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });
  });

  describe('#toObject', () => {
    it('should return a key:value object of select properties meant to represent the node', () => {
      const node = new NodeDoubleKeyVal(3, 'A')

      expect(node.toObject()).toEqual({ val: 'A', key: 3 });
    });
  });
});