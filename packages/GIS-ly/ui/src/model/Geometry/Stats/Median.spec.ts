import { NodeDouble } from '../../../../../../common/utils/dataStructures';
import { IVertexProperties, Vertex } from '../Polyline';
import { Median } from './Median';

class TestVertex extends Vertex {
  valNum: number;
  constructor(val: number) {
    super();
    this.valNum = val;
  }

  clone(): Vertex {
    throw new Error('Method not implemented.');
  }
  equals(item: IVertexProperties): boolean {
    throw new Error('Method not implemented.');
  }
}

describe('##Median', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty, isConsidered);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should do nothing if no node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      median.add(null);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);
    });

    it('should add the value', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(3));

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);

      median.add(node1);

      expect(median.count).toEqual(1);
      expect(median.median.value).toEqual(1);
      expect(median.median.nodes.length).toEqual(1);

      median.add(node2);

      expect(median.count).toEqual(2);
      expect(median.median.value).toEqual(1.5);
      expect(median.median.nodes.length).toEqual(2);

      median.add(node3);

      expect(median.count).toEqual(3);
      expect(median.median.value).toEqual(2);
      expect(median.median.nodes.length).toEqual(1);
    });

    it('should not add the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 1;

      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty, isConsidered);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(3));

      median.add(node1);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);

      median.add(node2);

      expect(median.count).toEqual(1);
      expect(median.median.value).toEqual(2);

      median.add(node3);

      expect(median.count).toEqual(2);
      expect(median.median.value).toEqual(2.5);

      median.add(node1);

      expect(median.count).toEqual(2);
      expect(median.median.value).toEqual(2.5);
    });
  });

  describe('#remove', () => {
    it('should do nothing if no node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(3));

      median.add(node1);
      median.add(node2);
      median.add(node3);

      expect(median.count).toEqual(3);

      median.remove(null);

      expect(median.count).toEqual(3);
    });

    it('should do nothing if the node provided had not been added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(3));
      const nodeNotAdded = new NodeDouble<TestVertex>(new TestVertex(4));

      median.add(node1);
      median.add(node2);
      median.add(node3);

      expect(median.count).toEqual(3);
      expect(median.median.value).toEqual(2);
      expect(median.median.nodes.length).toEqual(1);

      median.remove(nodeNotAdded);

      expect(median.count).toEqual(3);
      expect(median.median.value).toEqual(2);
      expect(median.median.nodes.length).toEqual(1);
    });

    it('should remove the value', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(4));

      median.add(node1);
      median.add(node2);
      median.add(node3);

      expect(median.count).toEqual(3);
      expect(median.median.value).toEqual(2);
      expect(median.median.nodes.length).toEqual(1);

      median.remove(node2);

      expect(median.count).toEqual(2);
      expect(median.median.value).toEqual(2.5);
      expect(median.median.nodes.length).toEqual(2);

      median.remove(node1);

      expect(median.count).toEqual(1);
      expect(median.median.value).toEqual(4);
      expect(median.median.nodes.length).toEqual(1);

      median.remove(node3);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);

      median.remove(node3);

      expect(median.count).toEqual(0);
      expect(median.median.value).toEqual(0);
      expect(median.median.nodes.length).toEqual(0);
    });
  });

  describe('#calculate', () => {
    it('should return 0 if no values have been added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const result = median.calculate();

      expect(result.value).toEqual(0);
      expect(result.nodes.length).toEqual(0);
    });

    it('should return the median value & containing node for a single item', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));

      median.add(node1);

      const result = median.calculate();

      expect(result.value).toEqual(1);
      expect(result.nodes.length).toEqual(1);
    });

    it('should return the median value & 2 containing nodes used to derive the value for an even number of items', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(2));

      median.add(node1);
      median.add(node2);

      const result = median.calculate();

      expect(result.value).toEqual(1.5);
      expect(result.nodes.length).toEqual(2);
    });

    it('should return the median value & containing node for an odd number of items', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const median = new Median(getProperty);

      const node1 = new NodeDouble<TestVertex>(new TestVertex(2));
      const node2 = new NodeDouble<TestVertex>(new TestVertex(1));
      const node3 = new NodeDouble<TestVertex>(new TestVertex(4));

      median.add(node1);
      median.add(node2);
      median.add(node3);

      const result = median.calculate();

      expect(result.value).toEqual(2);
      expect(result.nodes.length).toEqual(1);
    });
  });
});