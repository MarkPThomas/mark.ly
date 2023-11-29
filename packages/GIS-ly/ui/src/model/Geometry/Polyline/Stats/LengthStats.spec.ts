import { IVertexProperties, Polyline, Segment, SegmentNode, Vertex, VertexNode } from '../';
import { LengthStats } from './LengthStats';

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

describe('##LengthStats', () => {
  const createSegment = (length: number) => {
    const vertex1 = new VertexNode(new TestVertex(1));
    const vertex2 = new VertexNode(new TestVertex(2));
    const segment = new Segment(length);

    return new SegmentNode(
      vertex1,
      vertex2,
      segment
    );
  }

  const addSegmentLengths = (lengths: number[], polyline: Polyline<TestVertex, Segment>) => {
    let index = 0;
    let segNode = polyline.firstSegment;

    while (segNode && index < lengths.length) {
      segNode.val.length = lengths[index];
      index++;
      segNode = segNode.next as SegmentNode<TestVertex, Segment>;
    }
  }

  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const lengthStats = new LengthStats();

      expect(lengthStats.length).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const lengthStats = new LengthStats(isConsidered);

      expect(lengthStats.length).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should add the value', () => {
      const lengthStats = new LengthStats();
      lengthStats.add(createSegment(1));

      expect(lengthStats.length).toEqual(1);

      lengthStats.add(createSegment(2));

      expect(lengthStats.length).toEqual(3);
    });

    it('should not add the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 4;

      const lengthStats = new LengthStats(isConsidered);

      lengthStats.add(createSegment(1));

      expect(lengthStats.length).toEqual(0);

      lengthStats.add(createSegment(5));

      expect(lengthStats.length).toEqual(5);

      lengthStats.add(createSegment(4));

      expect(lengthStats.length).toEqual(5);
    });
  });

  describe('#fromTo', () => {
    it('should do nothing if no start node is provided', () => {

      const lengthStats = new LengthStats();

      const startNode = null;
      const endNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));

      lengthStats.fromTo(startNode, endNode);

      expect(lengthStats.length).toEqual(0);
    });

    it('should do nothing if no end node is provided', () => {
      const lengthStats = new LengthStats();

      const startNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));
      const endNode = null;

      lengthStats.fromTo(startNode, endNode);

      expect(lengthStats.length).toEqual(0);
    });

    it('should traverse from the provided start to end node & determine length', () => {
      const lengthStats = new LengthStats();

      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const lengths = [1, 2, 3];

      const polyline = new Polyline<TestVertex, Segment>(vertices);
      addSegmentLengths(lengths, polyline);

      const startNode = polyline.firstVertex;
      const endNode = polyline.lastVertex.prev as VertexNode<TestVertex, Segment>;

      lengthStats.fromTo(startNode, endNode);

      expect(lengthStats.length).toEqual(3);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const lengthStats = new LengthStats();

      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const lengths = [1, 2, 3];

      const polyline = new Polyline<TestVertex, Segment>(vertices);
      addSegmentLengths(lengths, polyline);

      const startNode = polyline.firstVertex;
      const endNode = new VertexNode(new TestVertex(-100));

      lengthStats.fromTo(startNode, endNode);

      expect(lengthStats.length).toEqual(6);
    });
  });

  describe('#of', () => {
    let lengthStats: LengthStats<TestVertex, Segment>;

    beforeEach(() => {
      lengthStats = new LengthStats();
    });

    it('should do nothing if no polyline is provided', () => {
      lengthStats.of(null);

      expect(lengthStats.length).toEqual(0);
    });

    it('should do nothing if an empty polyline is provided', () => {
      const polyline = new Polyline([]);

      lengthStats.of(polyline);

      expect(lengthStats.length).toEqual(0);
    });

    it('should determine the length of the polyline', () => {
      const lengthStats = new LengthStats();

      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const lengths = [1, 2, 3];

      const polyline = new Polyline<TestVertex, Segment>(vertices);
      addSegmentLengths(lengths, polyline);

      lengthStats.of(polyline);

      expect(lengthStats.length).toEqual(6);
    });
  });

  describe('#remove', () => {
    it('should remove the value', () => {
      const lengthStats = new LengthStats();
      lengthStats.add(createSegment(1));
      lengthStats.add(createSegment(2));

      expect(lengthStats.length).toEqual(3);

      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(2);

      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(1);
    });

    it('should remove any value, even if not added', () => {
      const lengthStats = new LengthStats();
      lengthStats.add(createSegment(1));
      lengthStats.add(createSegment(2));

      expect(lengthStats.length).toEqual(3);

      lengthStats.remove(createSegment(1.5));
      expect(lengthStats.length).toEqual(1.5);
    });

    it('should not remove the value if the current value count is 0', () => {
      const lengthStats = new LengthStats();
      lengthStats.add(createSegment(1));
      lengthStats.add(createSegment(2));

      expect(lengthStats.length).toEqual(3);

      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(2);

      // Note: There can be remaining values once count is at 0, since any value can be removed
      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(1);

      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(1);
    });

    it('should not remove the value if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => number > 4;

      const lengthStats = new LengthStats(isConsidered);
      lengthStats.add(createSegment(5));
      lengthStats.add(createSegment(6));

      expect(lengthStats.length).toEqual(11);

      lengthStats.remove(createSegment(1));
      expect(lengthStats.length).toEqual(11);

      lengthStats.remove(createSegment(5));
      expect(lengthStats.length).toEqual(6);

      lengthStats.remove(createSegment(6));
      expect(lengthStats.length).toEqual(0);
    });
  });

  describe('#serialize', () => {
    it('should write out empty properties if empty', () => {
      const maxMin = new LengthStats();

      const result = maxMin.serialize();

      expect(result.length).toEqual(0);
    });

    it('should serialize the object into a JSON object', () => {
      const maxMin = new LengthStats();

      const vertexStart = new TestVertex(1);
      const vertexMin1 = new TestVertex(-1);
      const vertexMin2 = new TestVertex(-2);
      const vertexMax1 = new TestVertex(2);
      const vertexMax2 = new TestVertex(3);
      const vertices: TestVertex[] = [
        vertexStart,
        vertexMin1,
        vertexMax1,
        vertexMax2,
        vertexMin2,
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      maxMin.of(polyline);

      const result = maxMin.serialize();

      expect(result.length).toEqual(maxMin.length);
    });
  });
});