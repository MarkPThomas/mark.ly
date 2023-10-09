import {
  VertexNode,
  EvaluatorArgs,
  IPolylineSize,
  Polyline,
  SegmentNode
} from "./Polyline";
import { Segment } from "./Segment";
import { IVertexProperties, Vertex } from "./Vertex";

type TestVertex = [number, number] & Vertex;

class TestSegment extends Segment {
  val: number;
  constructor(val: number) {
    super();
    this.val = val;
  }
  equals(item: IVertexProperties): boolean {
    throw new Error("Method not implemented.");
  }
}


describe('##PolyLine', () => {
  const sizeOf = (start: VertexNode<TestVertex, TestSegment>): number => {
    let count = 0;

    let currNode = start;
    while (currNode) {
      count++;
      currNode = currNode.next as VertexNode<TestVertex, TestSegment>;
    }

    return count;
  }

  let coordinates: TestVertex[];
  beforeEach(() => {
    coordinates = [
      [45, -110] as TestVertex,
      [60, -109] as TestVertex,
      [47, -108] as TestVertex,
    ];
  });

  // TODO: Create & test RangeCopy, Equals?, Clone?
  describe('Creation', () => {
    describe('#constructor', () => {
      it(`with a single vertex, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const vertex = [45, -110] as TestVertex;

        const polyline = new Polyline([vertex]);

        const expectedSize: IPolylineSize = {
          vertices: 1,
          segments: 0
        };

        expect(polyline.size()).toEqual(expectedSize);
      });

      it(`with a single node vertex, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const nodeVertex = new VertexNode<TestVertex, TestSegment>(coordinates[0]);

        const polyline = new Polyline(nodeVertex);

        const expectedSize: IPolylineSize = {
          vertices: 1,
          segments: 0
        };

        expect(polyline.size()).toEqual(expectedSize);
      });

      it(`with an array of vertices, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const polyline = new Polyline<TestVertex, TestSegment>(coordinates);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);

        // Check vertex references

        // First vertex
        expect(polyline.firstVertex.prev).toBeNull();
        expect(polyline.firstVertex.next.equals(coordinates[1]));
        expect(polyline.firstVertex.prevSeg).toBeNull();
        expect(polyline.firstVertex.nextSeg).toEqual(polyline.firstSegment);

        // First segment
        expect(polyline.firstSegment.prev).toBeNull();
        expect(polyline.firstSegment.next).toEqual((polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).nextSeg);
        expect(polyline.firstSegment.prevVert).toEqual(polyline.firstVertex);
        expect(polyline.firstSegment.nextVert).toEqual(polyline.firstVertex.next);

        // Last vertex
        expect(polyline.lastVertex.next).toBeNull();
        expect(polyline.lastVertex.prev.equals(coordinates[coordinates.length - 2]));
        expect(polyline.lastVertex.nextSeg).toBeNull();
        expect(polyline.lastVertex.prevSeg).toEqual(polyline.lastSegment);

        // Last segment
        expect(polyline.lastSegment.next).toBeNull();
        expect(polyline.lastSegment.prev).toEqual((polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>).prevSeg);
        expect(polyline.lastSegment.nextVert).toEqual(polyline.lastVertex);
        expect(polyline.lastSegment.prevVert).toEqual(polyline.lastVertex.prev);
      });

      it(`with an array of node vertices, should initialize an object of coordinates linked with segments,
      each represented in separate yet connected linked lists`, () => {
        const nodeVertices = coordinates.map((coordinate) => new VertexNode<TestVertex, TestSegment>(coordinate));

        const polyline = new Polyline<TestVertex, TestSegment>(nodeVertices);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);

        // Check vertex references

        // First vertex
        expect(polyline.firstVertex.prev).toBeNull();
        expect(polyline.firstVertex.next.equals(coordinates[1]));
        expect(polyline.firstVertex.prevSeg).toBeNull();
        expect(polyline.firstVertex.nextSeg).toEqual(polyline.firstSegment);

        // First segment
        expect(polyline.firstSegment.prev).toBeNull();
        expect(polyline.firstSegment.next).toEqual((polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).nextSeg);
        expect(polyline.firstSegment.prevVert).toEqual(polyline.firstVertex);
        expect(polyline.firstSegment.nextVert).toEqual(polyline.firstVertex.next);

        // Last vertex
        expect(polyline.lastVertex.next).toBeNull();
        expect(polyline.lastVertex.prev.equals(coordinates[coordinates.length - 2]));
        expect(polyline.lastVertex.nextSeg).toBeNull();
        expect(polyline.lastVertex.prevSeg).toEqual(polyline.lastSegment);

        // Last segment
        expect(polyline.lastSegment.next).toBeNull();
        expect(polyline.lastSegment.prev).toEqual((polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>).prevSeg);
        expect(polyline.lastSegment.nextVert).toEqual(polyline.lastVertex);
        expect(polyline.lastSegment.prevVert).toEqual(polyline.lastVertex.prev);
      });

      it(`with a node vertex as the head of a linked set of nodes, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const nodeVertices = coordinates.map((coordinate) => new VertexNode<TestVertex, TestSegment>(coordinate));
        for (let i = 1; i < nodeVertices.length; i++) {
          if (nodeVertices[i - 1]) {
            nodeVertices[i].prev = nodeVertices[i - 1];
            nodeVertices[i - 1].next = nodeVertices[i];
          }
        }

        const polyline = new Polyline(nodeVertices[0]);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);

        // Check vertex references

        // First vertex
        expect(polyline.firstVertex.prev).toBeNull();
        expect(polyline.firstVertex.next.equals(coordinates[1]));
        expect(polyline.firstVertex.prevSeg).toBeNull();
        expect(polyline.firstVertex.nextSeg).toEqual(polyline.firstSegment);

        // First segment
        expect(polyline.firstSegment.prev).toBeNull();
        expect(polyline.firstSegment.next).toEqual((polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).nextSeg);
        expect(polyline.firstSegment.prevVert).toEqual(polyline.firstVertex);
        expect(polyline.firstSegment.nextVert).toEqual(polyline.firstVertex.next);

        // Last vertex
        expect(polyline.lastVertex.next).toBeNull();
        expect(polyline.lastVertex.prev.equals(coordinates[coordinates.length - 2]));
        expect(polyline.lastVertex.nextSeg).toBeNull();
        expect(polyline.lastVertex.prevSeg).toEqual(polyline.lastSegment);

        // Last segment
        expect(polyline.lastSegment.next).toBeNull();
        expect(polyline.lastSegment.prev).toEqual((polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>).prevSeg);
        expect(polyline.lastSegment.nextVert).toEqual(polyline.lastVertex);
        expect(polyline.lastSegment.prevVert).toEqual(polyline.lastVertex.prev);
      });

      it(`with a node vertex as the tail of a linked set of nodes, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const nodeVertices = coordinates.map((coordinate) => new VertexNode<TestVertex, TestSegment>(coordinate));
        for (let i = 1; i < nodeVertices.length; i++) {
          if (nodeVertices[i - 1]) {
            nodeVertices[i].prev = nodeVertices[i - 1];
            nodeVertices[i - 1].next = nodeVertices[i];
          }
        }

        const polyline = new Polyline(nodeVertices[nodeVertices.length - 1]);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);

        // Check vertex references

        // First vertex
        expect(polyline.firstVertex.prev).toBeNull();
        expect(polyline.firstVertex.next.equals(coordinates[1]));
        expect(polyline.firstVertex.prevSeg).toBeNull();
        expect(polyline.firstVertex.nextSeg).toEqual(polyline.firstSegment);

        // First segment
        expect(polyline.firstSegment.prev).toBeNull();
        expect(polyline.firstSegment.next).toEqual((polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).nextSeg);
        expect(polyline.firstSegment.prevVert).toEqual(polyline.firstVertex);
        expect(polyline.firstSegment.nextVert).toEqual(polyline.firstVertex.next);

        // Last vertex
        expect(polyline.lastVertex.next).toBeNull();
        expect(polyline.lastVertex.prev.equals(coordinates[coordinates.length - 2]));
        expect(polyline.lastVertex.nextSeg).toBeNull();
        expect(polyline.lastVertex.prevSeg).toEqual(polyline.lastSegment);

        // Last segment
        expect(polyline.lastSegment.next).toBeNull();
        expect(polyline.lastSegment.prev).toEqual((polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>).prevSeg);
        expect(polyline.lastSegment.nextVert).toEqual(polyline.lastVertex);
        expect(polyline.lastSegment.prevVert).toEqual(polyline.lastVertex.prev);
      });

      it(`with a node vertex as the middle of a linked set of nodes, should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const nodeVertices = coordinates.map((coordinate) => new VertexNode<TestVertex, TestSegment>(coordinate));
        for (let i = 1; i < nodeVertices.length; i++) {
          if (nodeVertices[i - 1]) {
            nodeVertices[i].prev = nodeVertices[i - 1];
            nodeVertices[i - 1].next = nodeVertices[i];
          }
        }

        const polyline = new Polyline(nodeVertices[1]);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);

        // Check vertex references

        // First vertex
        expect(polyline.firstVertex.prev).toBeNull();
        expect(polyline.firstVertex.next.equals(coordinates[1]));
        expect(polyline.firstVertex.prevSeg).toBeNull();
        expect(polyline.firstVertex.nextSeg).toEqual(polyline.firstSegment);

        // First segment
        expect(polyline.firstSegment.prev).toBeNull();
        expect(polyline.firstSegment.next).toEqual((polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).nextSeg);
        expect(polyline.firstSegment.prevVert).toEqual(polyline.firstVertex);
        expect(polyline.firstSegment.nextVert).toEqual(polyline.firstVertex.next);

        // Last vertex
        expect(polyline.lastVertex.next).toBeNull();
        expect(polyline.lastVertex.prev.equals(coordinates[coordinates.length - 2]));
        expect(polyline.lastVertex.nextSeg).toBeNull();
        expect(polyline.lastVertex.prevSeg).toEqual(polyline.lastSegment);

        // Last segment
        expect(polyline.lastSegment.next).toBeNull();
        expect(polyline.lastSegment.prev).toEqual((polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>).prevSeg);
        expect(polyline.lastSegment.nextVert).toEqual(polyline.lastVertex);
        expect(polyline.lastSegment.prevVert).toEqual(polyline.lastVertex.prev);
      });
    });

    describe('#cloneFromTo', () => {
      it('should return null for an empty polyline', () => {
        const polyline = new Polyline([]);

        const polylineCopy = polyline.cloneFromTo();

        expect(polylineCopy).toBeNull();
      });

      it('should copy the Polyline from the head to tail if no vertices are given', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline = new Polyline(coordinates);

        const polylineCopy = polyline.cloneFromTo();

        expect(polylineCopy.vertices()).toEqual([
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ]);

        expect(polylineCopy.firstVertex.val).toEqual(coordinates[0]);
        expect(polylineCopy.firstSegment.prevVert.val).toEqual(coordinates[0]);
        expect(polylineCopy.firstSegment.nextVert.val).toEqual(coordinates[1]);
        expect(polylineCopy.lastSegment.prevVert.val).toEqual(coordinates[4]);
        expect(polylineCopy.lastSegment.nextVert.val).toEqual(coordinates[5]);
        expect(polylineCopy.lastVertex.val).toEqual(coordinates[5]);
      });

      it('should copy the Polyline from the head to the end vertex if only the end vertex is given', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline = new Polyline(coordinates);

        const startVertex = null;
        const endVertex = polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>;
        const polylineCopy = polyline.cloneFromTo(startVertex, endVertex);

        expect(polylineCopy.vertices()).toEqual([
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex
        ]);
      });

      it('should copy the Polyline from the start vertex to the tail if only the start vertex is given', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline = new Polyline(coordinates);

        const startVertex = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
        const polylineCopy = polyline.cloneFromTo(startVertex);

        expect(polylineCopy.vertices()).toEqual([
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ]);
      });

      it('should copy the Polyline from the start vertex to the end vertex', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline = new Polyline(coordinates);

        const startVertex = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
        const endVertex = polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>;
        const polylineCopy = polyline.cloneFromTo(startVertex, endVertex);

        expect(polylineCopy.vertices()).toEqual([
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
        ]);

        expect(polylineCopy.firstVertex.val).toEqual(coordinates[1]);
        expect(polylineCopy.firstSegment.prevVert.val).toEqual(coordinates[1]);
        expect(polylineCopy.firstSegment.nextVert.val).toEqual(coordinates[2]);
        expect(polylineCopy.lastSegment.prevVert.val).toEqual(coordinates[3]);
        expect(polylineCopy.lastSegment.nextVert.val).toEqual(coordinates[4]);
        expect(polylineCopy.lastVertex.val).toEqual(coordinates[4]);
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      it('should clone the Polyline', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline = new Polyline(coordinates);

        const polylineClone = polyline.clone();

        expect(polyline.equals(polylineClone)).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Polylines with differing vertices', () => {
        const coordinates1 = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline1 = new Polyline(coordinates1);

        const coordinates2 = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [4, -120] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline2 = new Polyline(coordinates2);

        const result = polyline1.equals(polyline2);

        expect(result).toBeFalsy();
      });

      it('should return True for Polylines with identical vertices', () => {
        const coordinates = [
          [1, -110] as TestVertex,
          [2, -120] as TestVertex,
          [3, -130] as TestVertex,
          [4, -140] as TestVertex,
          [5, -150] as TestVertex,
          [6, -160] as TestVertex,
        ];
        const polyline1 = new Polyline(coordinates);
        const polyline2 = new Polyline(coordinates);

        const result = polyline1.equals(polyline2);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('Methods', () => {
    describe('#size', () => {
      it('should return the number of vertices and segments in the PolyLine', () => {
        const polyline = new Polyline(coordinates);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);
      });
    });

    describe('#vertices', () => {
      it('should return the Vertices in the PolyLine', () => {
        const polyline = new Polyline(coordinates);

        const result = polyline.vertices();

        expect(result[0]).toEqual(coordinates[0]);
        expect(result[1]).toEqual(coordinates[1]);
        expect(result[2]).toEqual(coordinates[2]);
      });
    });

    describe('#segments', () => {
      it('should return the Segments in the PolyLine', () => {
        const polyline = new Polyline(coordinates);

        const result = polyline.segments();

        expect(result.length).toEqual(2);
      });
    });
  });

  describe('Properties Methods', () => {
    describe('#addProperties', () => {
      it('should do nothing in this class. Behavior comes from overriding a protected method in derived polyline classes.', () => {
        const polyline = new Polyline(coordinates);

        polyline.addProperties();

        const segments = polyline.segments();

        expect(segments[1].length).toBeUndefined();
      });
    });
  });

  describe('Accessing Items', () => {
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      polyline = new Polyline(coordinates);
    });

    describe('#vertexNodesBy', () => {
      it('should return an empty array for no matches', () => {
        const nodes = polyline.vertexNodesBy(
          -1,
          (target: number, coord: VertexNode<TestVertex, Segment>) => coord.val[0] <= target
        );

        expect(nodes.length).toEqual(0);
      });

      it('should return all nodes that match the numerical target', () => {
        const nodes = polyline.vertexNodesBy(
          50,
          (target: number, coord: VertexNode<TestVertex, Segment>) => coord.val[0] <= target
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[0].val).toEqual([45, -110]);
        expect(nodes[1].val).toEqual([47, -108]);
      });

      it('should return all nodes that match all of the Evaluator Args targets', () => {
        const nodes = polyline.vertexNodesBy(
          {
            firstItem: 50,
            secondItem: -109
          },
          (target: EvaluatorArgs,
            coord: VertexNode<TestVertex, Segment>) =>
            coord.val[0] > parseInt(target.firstItem.toString())
            || coord.val[1] <= parseInt(target.secondItem.toString())
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[0].val).toEqual([45, -110]);
        expect(nodes[1].val).toEqual([60, -109]);
      });
    });

    describe('#vertexNodesByVertex', () => {
      it('should return an empty array for no matches', () => {
        const targetVertex = [-50, -666] as TestVertex;
        const nodes = polyline.vertexNodesByVertex(targetVertex);

        expect(nodes.length).toEqual(0);
      });

      it('should return all nodes that match the vertex value', () => {
        const targetVertex = coordinates[1];
        const nodes = polyline.vertexNodesByVertex(targetVertex);

        expect(nodes.length).toEqual(1);
        expect(nodes[0].val).toEqual(targetVertex);
      });
    });
  });

  describe('Manipulating Polyline', () => {
    // TODO: what should happen if end occurs before start for any range operations?
    // See: Replace -> should return 0 & do nothing when the start/end nodes are both found, but in reverse order.
    //    Remove returns 1 (2 spaces apart, but reversed)
    //    Insert returns 1 (for 3 items)
    //    Result is a polyline that only has the first item (origina & only item before the earlier occurring 'end' value)
    let polyline: Polyline<TestVertex, TestSegment>;

    beforeEach(() => {
      coordinates = [
        [1, -110] as TestVertex,
        [2, -120] as TestVertex,
        [3, -130] as TestVertex,
        [4, -140] as TestVertex,
        [5, -150] as TestVertex,
        [6, -160] as TestVertex,
      ];
      polyline = new Polyline(coordinates);

      // Add segment labels for easier testing/debugging
      let id = 1;
      let segmentNode = polyline.firstSegment;
      while (segmentNode) {
        segmentNode.val = new TestSegment(id);
        id++;
        segmentNode = segmentNode.next as SegmentNode<TestVertex, TestSegment>;
      }
    });

    describe('Trim', () => {
      describe('#trimBefore', () => {
        it('should do nothing and return null on an empty polyline', () => {
          polyline = new Polyline([]);

          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = new VertexNode<TestVertex, TestSegment>(coordinates[1]);

          const trimCount = polyline.trimBefore(vertex);

          expect(trimCount).toBeNull();
          expect(polyline.vertices().length).toEqual(0);
          expect(polyline.size().vertices).toEqual(0);
          expect(polyline.size().segments).toEqual(0);
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified vertex does not exist in the polyline', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = new VertexNode<TestVertex, TestSegment>([6, -10] as TestVertex);

          const trimCount = polyline.trimBefore(vertex);

          expect(trimCount).toBeNull();
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.size().vertices).toEqual(6);
          expect(polyline.size().segments).toEqual(5);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should trim off vertices & segments before the specified point & return the head of the trimmed portion', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const targetVertex = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const targetSeg = targetVertex.nextSeg;
          const trimmedVertexTail = targetVertex.prev as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentTail = targetSeg.prev as SegmentNode<TestVertex, TestSegment>;

          expect(targetVertex.prev).not.toBeNull();
          expect(targetVertex.prevSeg).not.toBeNull();
          expect(targetSeg.prev).not.toBeNull();
          expect(targetSeg.prevVert).not.toBeNull();


          const trimCount = polyline.trimBefore(targetVertex);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).not.toEqual(originalVertexHead);
          expect(polyline.firstSegment).not.toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(targetVertex.prev).toBeNull();
          expect(targetVertex.prevSeg).toBeNull();
          expect(targetSeg.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });
      });

      describe('#trimAfter', () => {
        it('should do nothing and return null on an empty polyline', () => {
          polyline = new Polyline([]);

          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = new VertexNode<TestVertex, TestSegment>(coordinates[1]);

          const trimCount = polyline.trimAfter(vertex);

          expect(trimCount).toBeNull();
          expect(polyline.vertices().length).toEqual(0);
          expect(polyline.size().vertices).toEqual(0);
          expect(polyline.size().segments).toEqual(0);
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified vertex does not exist in the polyline', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = new VertexNode<TestVertex, TestSegment>([6, -10] as TestVertex);

          const trimCount = polyline.trimAfter(vertex);

          expect(trimCount).toBeNull();
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.size().vertices).toEqual(6);
          expect(polyline.size().segments).toEqual(5);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should trim off vertices & segments after the specified point & return the head of the trimmed portion', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const targetVertex = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;
          const targetSeg = targetVertex.prevSeg;
          const trimmedVertexHead = targetVertex.next as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentHead = targetSeg.next as SegmentNode<TestVertex, TestSegment>;

          expect(targetVertex.next).not.toBeNull();
          expect(targetVertex.nextSeg).not.toBeNull();
          expect(targetSeg.next).not.toBeNull();
          expect(targetSeg.nextVert).not.toBeNull();


          const trimCount = polyline.trimAfter(targetVertex);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).not.toEqual(originalVertexTail);
          expect(polyline.lastSegment).not.toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex
          ]);

          expect(targetVertex.next).toBeNull();
          expect(targetVertex.nextSeg).toBeNull();
          expect(targetSeg.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });
      });

      describe('#trimTo', () => {
        it('should do nothing and return null on an empty polyline', () => {
          polyline = new Polyline([]);

          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>(coordinates[1]);
          const vertex2 = new VertexNode<TestVertex, TestSegment>(coordinates[3]);

          const trimCount = polyline.trimTo(vertex1, vertex2);

          expect(trimCount).toEqual([null, null]);
          expect(polyline.size().vertices).toEqual(0);
          expect(polyline.size().segments).toEqual(0);
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified vertex does not exist in the polyline', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([6, -10] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([-6, 10] as TestVertex);

          const trimCount = polyline.trimTo(vertex1, vertex2);

          expect(trimCount).toEqual([null, null]);
          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);
          expect(polyline.size().vertices).toEqual(6);
          expect(polyline.size().segments).toEqual(5);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should trim off vertices & segments before & after the specified start & end points & return the head of the 1st & 2nd trimmed portions', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          // Trim before state
          const vertex1 = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const segmentNext = vertex1.nextSeg;
          const trimmedVertexTail = vertex1.prev as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, TestSegment>;

          expect(vertex1.prev).not.toBeNull();
          expect(vertex1.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          // Trim after state
          const vertex2 = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;
          const segmentPrev = vertex2.prevSeg;
          const trimmedVertexHead = vertex2.next as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, TestSegment>;

          expect(vertex2.next).not.toBeNull();
          expect(vertex2.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();


          const trimCount = polyline.trimTo(vertex1, vertex2);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).not.toEqual(originalVertexHead);
          expect(polyline.firstSegment).not.toEqual(originalSegmentHead);
          expect(polyline.lastVertex).not.toEqual(originalVertexTail);
          expect(polyline.lastSegment).not.toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(2);
          expect(polyline.size().segments).toEqual(1);
          expect(polyline.vertices()).toEqual([
            [3, -130] as TestVertex,
            [4, -140] as TestVertex
          ]);

          // New Head
          expect(vertex1.prev).toBeNull();
          expect(vertex1.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();

          // New Tail
          expect(vertex2.next).toBeNull();
          expect(vertex2.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        it('should trim off vertices & segments before the specified start point if the end vertex is not specified', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, TestSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();


          const trimCount = polyline.trimTo(vertex, null);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).not.toEqual(originalVertexHead);
          expect(polyline.firstSegment).not.toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments before the specified start point if the end vertex is not found', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, TestSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          const vertexNotExist = new VertexNode<TestVertex, TestSegment>([-6, 10] as TestVertex);


          const trimCount = polyline.trimTo(vertex, vertexNotExist);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).not.toEqual(originalVertexHead);
          expect(polyline.firstSegment).not.toEqual(originalSegmentHead);
          expect(polyline.lastVertex).toEqual(originalVertexTail);
          expect(polyline.lastSegment).toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end point if the start vertex is not specified', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, TestSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();


          const trimCount = polyline.trimTo(null, vertex);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).not.toEqual(originalVertexTail);
          expect(polyline.lastSegment).not.toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex
          ]);

          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end point if the start vertex is not found', () => {
          const originalVertexHead = polyline.firstVertex;
          const originalSegmentHead = polyline.firstSegment;
          const originalVertexTail = polyline.lastVertex;
          const originalSegmentTail = polyline.lastSegment;

          const vertex = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<TestVertex, TestSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, TestSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const vertexNotExist = new VertexNode<TestVertex, TestSegment>([-6, 10] as TestVertex);


          const trimCount = polyline.trimTo(vertexNotExist, vertex);


          expect(trimCount).toBeTruthy();

          expect(polyline.firstVertex).toEqual(originalVertexHead);
          expect(polyline.firstSegment).toEqual(originalSegmentHead);
          expect(polyline.lastVertex).not.toEqual(originalVertexTail);
          expect(polyline.lastSegment).not.toEqual(originalSegmentTail);

          expect(polyline.size().vertices).toEqual(4);
          expect(polyline.size().segments).toEqual(3);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex
          ]);

          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });
      });
    });

    describe('Remove', () => {
      describe('#removeAt', () => {
        it('should do nothing & return null for an empty polyline', () => {
          polyline = new Polyline([]);

          const vertex = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);

          const result = polyline.removeAt(vertex);

          expect(result).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
        });

        it('should do nothing & return null for a vertex that does not exist in the polyline', () => {
          const vertex = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);

          const result = polyline.removeAt(vertex);

          expect(result).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);

        });

        it('should do nothing & return null for a null vertex', () => {
          const result = polyline.removeAt(null);

          expect(result).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should remove a vertex at the head & return the removed node', () => {
          const removedVertex = polyline.firstVertex;
          const removedSeg = polyline.firstSegment;

          const expectedHeadVertex = removedVertex.next;
          const expectedHeadSeg = removedSeg.next;

          const result = polyline.removeAt(removedVertex);

          expect(result).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 1);
          expect(polylineLength.segments).toEqual(coordinates.length - 2);
          expect(polyline.vertices()).toEqual([
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex,
          ]);

          expect(polyline.firstVertex).toEqual(expectedHeadVertex);
          expect(polyline.firstVertex.prev).toBeNull();
          expect(polyline.firstVertex.prevSeg).toBeNull();

          expect(polyline.firstSegment).toEqual(expectedHeadSeg);
          expect(polyline.firstSegment.prev).toBeNull();

          expect(removedVertex.prev).toBeNull();
          expect(removedVertex.next).toBeNull();
          expect(removedVertex.prevSeg).toBeNull();

          expect(removedSeg.prev).toBeNull();
          expect(removedSeg.next).toBeNull();
          expect(removedSeg.nextVert).toBeNull();
        });

        it('should remove a vertex at the lastVertex & return the removed node', () => {
          const removedVertex = polyline.lastVertex;
          const removedSeg = polyline.lastSegment;

          const expectedTailVertex = removedVertex.prev as VertexNode<TestVertex, TestSegment>;
          const expectedTailSeg = expectedTailVertex.prevSeg;

          const result = polyline.removeAt(removedVertex);

          expect(result).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 1);
          expect(polylineLength.segments).toEqual(coordinates.length - 2);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
          ]);

          expect(polyline.lastVertex).toEqual(expectedTailVertex);
          expect(polyline.lastVertex.next).toBeNull();
          expect(polyline.lastVertex.nextSeg).toBeNull();

          expect(polyline.lastSegment).toEqual(expectedTailSeg);
          expect(polyline.lastSegment.next).toBeNull();

          expect(removedVertex.prev).toBeNull();
          expect(removedVertex.next).toBeNull();
          expect(removedVertex.nextSeg).toBeNull();

          expect(removedSeg.prev).toBeNull();
          expect(removedSeg.next).toBeNull();
          expect(removedSeg.prevVert).toBeNull();
        });

        it('should remove the only remaining vertex & return the removed node', () => {
          coordinates = [
            [1, -110] as TestVertex
          ];
          polyline = new Polyline(coordinates);

          const vertex = polyline.firstVertex;

          const result = polyline.removeAt(vertex);

          expect(result).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
          expect(polyline.vertices()).toEqual([]);
        });

        it('should remove the specified vertex & one adjacent segment & return the removed node', () => {
          const removedVertex = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const removedSeg = removedVertex.nextSeg as SegmentNode<TestVertex, TestSegment>;

          const prevVertex = removedVertex.prev as VertexNode<TestVertex, TestSegment>;
          const nextVertex = removedVertex.next as VertexNode<TestVertex, TestSegment>;
          const prevSeg = removedSeg.prev as SegmentNode<TestVertex, TestSegment>;
          const nextSeg = removedSeg.next as SegmentNode<TestVertex, TestSegment>;


          const result = polyline.removeAt(removedVertex);

          expect(result).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 1);
          expect(polylineLength.segments).toEqual(coordinates.length - 2);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            // [3, -130] as TestVertex, // removed
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex,
          ]);

          expect(prevVertex.next).toEqual(nextVertex);
          expect(nextVertex.prev).toEqual(prevVertex);
          expect(prevVertex.nextSeg).toEqual(prevSeg);
          expect(nextVertex.prevSeg).toEqual(prevSeg);

          expect(prevSeg.nextVert).toEqual(nextVertex);
          expect(prevSeg.prevVert).toEqual(prevVertex);
          expect(prevSeg.next).toEqual(nextSeg);
          expect(nextSeg.prev).toEqual(prevSeg);

          expect(removedVertex.prev).toBeNull();
          expect(removedVertex.next).toBeNull();
          expect(removedVertex.prevSeg).toBeNull();

          expect(removedSeg.prev).toBeNull();
          expect(removedSeg.next).toBeNull();
          expect(removedSeg.nextVert).toBeNull();
        });
      });

      describe('#removeAtAny', () => {
        it('should do nothing for vertices provided for an empty polyline & return an empty array', () => {
          polyline = new Polyline([]);

          const vertex1 = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(0);

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
        });

        it('should do nothing for vertices provided that are not in the polyline & return an empty array', () => {
          const vertex1 = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(0);

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should remove the vertices provided & return an array of the nodes removed', () => {
          const vertex1 = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertex2 = polyline.firstVertex.next.next.next as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(2);

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 2);
          expect(polylineLength.segments).toEqual(coordinates.length - 2 - 1);

          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [3, -130] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should remove the vertices provided, ignoring ones that are not found in the polyline & return an array of the nodes removed', () => {
          const vertex1 = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertex2 = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeAtAny([vertex1, vertex2]);

          expect(removedVertices.length).toEqual(1);

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 1);
          expect(polylineLength.segments).toEqual(coordinates.length - 1 - 1);

          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });
      });

      describe('#removeBetween', () => {
        it('should do nothing & return null for an empty polyline', () => {
          polyline = new Polyline([]);

          const vetexStart = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertexEnd = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeBetween(vetexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
        });

        it(`should do nothing & return null for vertex range requested where neither start nor end are in the polyline`, () => {
          const vertexStart = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertexEnd = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should do nothing & return null for vertex range requested where the start & end are the same', () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = vertexStart;

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should do nothing & return null for vertex range requested where the start & end are adjacent', () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = vertexStart.next as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should remove up to the end vertex if the start vertex is not found', () => {
          const vertexStart = new VertexNode<TestVertex, TestSegment>(coordinates[1]);
          const vertexEnd = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 3);
          expect(polylineLength.segments).toEqual(coordinates.length - 3 - 1);
          expect(polyline.vertices()).toEqual([
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(polyline.firstVertex.equals(vertexEnd.val));
        });

        it('should remove up to the end vertex if the start vertex null', () => {
          const vertexEnd = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeBetween(null, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 3);
          expect(polylineLength.segments).toEqual(coordinates.length - 3 - 1);
          expect(polyline.vertices()).toEqual([
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should remove from the start vertex to the end of the polyline if the end vertex is not found', () => {
          const vertexStart = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = new VertexNode<TestVertex, TestSegment>(coordinates[2]);

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 3);
          expect(polylineLength.segments).toEqual(coordinates.length - 3 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
          ]);
        });

        it('should remove from the start vertex to the end of the polyline if the end vertex is null', () => {
          const vertexStart = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeBetween(vertexStart, null);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 3);
          expect(polylineLength.segments).toEqual(coordinates.length - 3 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
          ]);
        });

        it(`should remove all vertices & corresponding segments between the start and end vertices provided,
          & return the head of the removed range`, () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>;
          const segmentStart = vertexStart.nextSeg;
          const segmentEnd = vertexEnd.nextSeg;
          const removedVertexHead = vertexStart.next as VertexNode<TestVertex, TestSegment>;
          const removedSegmentTail = segmentEnd.prev as SegmentNode<TestVertex, TestSegment>;

          const removedVerticesCount = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVerticesCount).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 2);
          expect(polylineLength.segments).toEqual(coordinates.length - 2 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          // Check Node references
          expect(removedVertexHead.prev).toBeNull();
          expect(removedVertexHead.prevSeg).toBeNull();

          expect(removedSegmentTail.next).toBeNull();
          expect(removedSegmentTail.nextVert).toBeNull();

          expect(removedVertexHead.nextSeg.prev).toBeNull();
          expect(removedSegmentTail.prevVert.next).toBeNull();

          expect(vertexStart.next).toEqual(vertexEnd);
          expect(vertexEnd.prev).toEqual(vertexStart);

          expect(segmentStart.next).toEqual(segmentEnd);
          expect(segmentEnd.prev).toEqual(segmentStart);

          expect(segmentStart.nextVert).toEqual(vertexEnd);
          expect(vertexEnd.prevSeg).toEqual(segmentStart);
        });

        it(`should remove all vertices between the start vertex & end of the polyline
          if the end vertex specified corresponds with the end of the polyline`, () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;
          const segmentStart = vertexStart.nextSeg;
          const removedVertexHead = vertexStart.next as VertexNode<TestVertex, TestSegment>;
          const removedSegmentTail = polyline.lastSegment;

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 3);
          expect(polylineLength.segments).toEqual(coordinates.length - 3 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [6, -160] as TestVertex
          ]);

          // Check Node references
          expect(removedVertexHead.prev).toBeNull();
          expect(removedVertexHead.prevSeg).toBeNull();

          expect(removedSegmentTail.next).toBeNull();
          expect(removedSegmentTail.nextVert).toBeNull();

          expect(removedVertexHead.nextSeg.prev).toBeNull();
          expect(removedSegmentTail.prevVert.next).toBeNull();

          expect(vertexStart.next).toEqual(vertexEnd);
          expect(vertexEnd.prev).toEqual(vertexStart);
          expect(vertexEnd).toEqual(polyline.lastVertex);

          expect(segmentStart.next).toBeNull();
          expect(segmentStart).toEqual(polyline.lastSegment);

          expect(segmentStart.nextVert).toEqual(vertexEnd);
          expect(vertexEnd.prevSeg).toEqual(segmentStart);
        });

        it('should remove all vertices between the start & end of the polyline & all but one segment if specified', () => {
          const vertexStart = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;
          const segmentStart = vertexStart.nextSeg;
          const removedVertexHead = vertexStart.next as VertexNode<TestVertex, TestSegment>;
          const removedSegmentTail = polyline.lastSegment;

          const removedVertices = polyline.removeBetween(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(2);
          expect(polylineLength.segments).toEqual(1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [6, -160] as TestVertex
          ]);

          // Check Node references
          expect(removedVertexHead.prev).toBeNull();
          expect(removedVertexHead.prevSeg).toBeNull();

          expect(removedSegmentTail.next).toBeNull();
          expect(removedSegmentTail.nextVert).toBeNull();

          expect(removedVertexHead.nextSeg.prev).toBeNull();
          expect(removedSegmentTail.prevVert.next).toBeNull();

          expect(vertexStart.next).toEqual(vertexEnd);
          expect(vertexEnd.prev).toEqual(vertexStart);
          expect(vertexEnd).toEqual(polyline.lastVertex);

          expect(segmentStart.next).toBeNull();
          expect(segmentStart).toEqual(polyline.firstSegment);
          expect(segmentStart).toEqual(polyline.lastSegment);

          expect(segmentStart.nextVert).toEqual(vertexEnd);
          expect(vertexEnd.prevSeg).toEqual(segmentStart);
        });
      });

      describe('#removeFromTo', () => {
        it('should do nothing & return null for an empty polyline', () => {
          polyline = new Polyline([]);

          const vetexStart = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertexEnd = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeFromTo(vetexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
        });

        it('should do nothing & return null for when neither start nor end vertices are in the polyline', () => {
          const vertexStart = new VertexNode<TestVertex, TestSegment>([90, -208] as TestVertex);
          const vertexEnd = new VertexNode<TestVertex, TestSegment>([95, -208] as TestVertex);

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length);
          expect(polylineLength.segments).toEqual(coordinates.length - 1);
        });

        it('should remove a single vertex & return the removed vertex when the start & end vertices are the same', () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = vertexStart;

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();
          expect(removedVertices.next).toBeNull();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 1);
          expect(polylineLength.segments).toEqual(coordinates.length - 1 - 1);
        });

        it('should remove the entire list & the head of the removed range when start & end are the start/end of the polyline', () => {
          const vertexStart = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;

          const originalVerticesCount = polyline.size().vertices;

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          const removedCount = sizeOf(removedVertices);
          expect(removedCount).toEqual(originalVerticesCount);

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(0);
          expect(polylineLength.segments).toEqual(0);
        });

        it('should remove up to the end vertex if the start vertex is not found', () => {
          const vertexStart = new VertexNode<TestVertex, TestSegment>(coordinates[1]);
          const vertexEnd = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 4);
          expect(polylineLength.segments).toEqual(coordinates.length - 4 - 1);
          expect(polyline.vertices()).toEqual([
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(polyline.firstVertex.equals(vertexEnd.val));
        });

        it('should remove up to the end vertex if the start vertex null', () => {
          const vertexEnd = polyline.lastVertex.prev.prev as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeFromTo(null, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 4);
          expect(polylineLength.segments).toEqual(coordinates.length - 4 - 1);
          expect(polyline.vertices()).toEqual([
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should remove from the start vertex to the end of the polyline if the end vertex is not found', () => {
          const vertexStart = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = new VertexNode<TestVertex, TestSegment>(coordinates[2]);

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 4);
          expect(polylineLength.segments).toEqual(coordinates.length - 4 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
          ]);
        });

        it('should remove from the start vertex to the end of the polyline if the end vertex is null', () => {
          const vertexStart = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeFromTo(vertexStart, null);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 4);
          expect(polylineLength.segments).toEqual(coordinates.length - 4 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
          ]);
        });

        it(`should remove all vertices and corresponding segments between the start & end vertices provided
          & return the head of the removed range`, () => {
          const vertexStart = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const vertexEnd = polyline.lastVertex.prev as VertexNode<TestVertex, TestSegment>;

          const removedVertices = polyline.removeFromTo(vertexStart, vertexEnd);

          expect(removedVertices).toBeTruthy();

          const polylineLength = polyline.size();
          expect(polylineLength.vertices).toEqual(coordinates.length - 4);
          expect(polylineLength.segments).toEqual(coordinates.length - 4 - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });
      });
    });

    describe('Insert', () => {
      describe('#prepend', () => {
        it('should add a vertex as head & tail to an empty polyline', () => {
          const polyline = new Polyline<TestVertex, TestSegment>([]);

          const vertex = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);

          polyline.prepend(vertex);

          expect(polyline.size()).toEqual({
            vertices: 1,
            segments: 0
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([45, -110]);
        });

        it('should add a vertex at the beginning of a polyline', () => {
          expect(polyline.size().vertices).toEqual(6);

          const originalFirstVertex = polyline.firstVertex;
          const originalFirstSegment = polyline.firstSegment;

          const vertex = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);

          polyline.prepend(vertex);

          expect(polyline.size()).toEqual({
            vertices: 7,
            segments: 6
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([6, -160]);

          // Check vertex references
          expect(vertex.next).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prev).toEqual(vertex);

          expect(polyline.firstSegment.next).toEqual(originalFirstSegment);
          expect(originalFirstSegment.prev).toEqual(polyline.firstSegment);

          expect(vertex.nextSeg).toEqual(polyline.firstSegment);
          expect(polyline.firstSegment.prevVert).toEqual(vertex);
        });

        it('should add an array of vertices at the beginning of a polyline', () => {
          const originalFirstVertex = polyline.firstVertex;
          const originalFirstSegment = polyline.firstSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          const vertices = [vertex1, vertex2, vertex3];

          expect(polyline.size().vertices).toEqual(6);

          polyline.prepend(vertices);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([6, -160]);

          // Check vertex references
          // Vertices
          expect(vertex1.prev).toBeNull();
          expect(vertex1.next.val).toEqual(polyline.firstVertex.next.val);
          expect(vertex2.prev.val).toEqual(vertex1.val);
          expect(vertex2.next.val).toEqual(vertex3.val);
          expect(vertex3.prev.val).toEqual(vertex2.val);
          expect(vertex3.next.val).toEqual(originalFirstVertex.val);
          expect(originalFirstVertex.prev.val).toEqual(vertex3.val);

          // Segments
          expect(polyline.firstSegment.prev).toBeNull();
          expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
          expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

          // Vertex-Segments
          const secondSeg = polyline.firstSegment.next as SegmentNode<TestVertex, TestSegment>;
          const thirdSeg = originalFirstSegment.prev as SegmentNode<TestVertex, TestSegment>;

          expect(vertex1.prevSeg).toBeNull();

          expect(vertex1.nextSeg).toEqual(polyline.firstSegment);
          expect(polyline.firstSegment.prevVert).toEqual(vertex1);

          expect(polyline.firstSegment.nextVert).toEqual(vertex2);
          expect(vertex2.prevSeg).toEqual(polyline.firstSegment);

          expect(vertex2.nextSeg).toEqual(secondSeg);
          expect(secondSeg.prevVert).toEqual(vertex2);

          expect(secondSeg.nextVert).toEqual(vertex3);
          expect(vertex3.prevSeg).toEqual(secondSeg);

          expect(vertex3.nextSeg).toEqual(thirdSeg);
          expect(thirdSeg.prevVert).toEqual(vertex3);

          expect(thirdSeg.nextVert).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prevSeg).toEqual(thirdSeg);
        });

        it('should add a linked set of vertices with the head provided', () => {
          const originalFirstVertex = polyline.firstVertex;
          const originalFirstSegment = polyline.firstSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          vertex1.next = vertex2;
          vertex2.prev = vertex1;
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          vertex2.next = vertex3;
          vertex3.prev = vertex2;

          expect(polyline.size().vertices).toEqual(6);

          polyline.prepend(vertex1);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([6, -160]);

          // Check vertex references
          // Vertices
          expect(polyline.firstVertex.prev).toBeNull();
          expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

          // Segments
          expect(polyline.firstSegment.prev).toBeNull();
          expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
          expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

          // Vertex-Segments
          expect(vertex1.prevSeg).toBeNull();

          expect(vertex3.nextSeg.nextVert).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
        });

        it('should add a linked set of vertices with the tail provided', () => {
          const originalFirstVertex = polyline.firstVertex;
          const originalFirstSegment = polyline.firstSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          vertex1.next = vertex2;
          vertex2.prev = vertex1;
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          vertex2.next = vertex3;
          vertex3.prev = vertex2;

          expect(polyline.size().vertices).toEqual(6);

          polyline.prepend(vertex3);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([6, -160]);

          // Check vertex references
          // Vertices
          expect(polyline.firstVertex.prev).toBeNull();
          expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

          // Segments
          expect(polyline.firstSegment.prev).toBeNull();
          expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
          expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

          // Vertex-Segments
          expect(vertex1.prevSeg).toBeNull();

          expect(vertex3.nextSeg.nextVert).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
        });

        it('should add a polyline', () => {
          const originalFirstVertex = polyline.firstVertex;
          const originalFirstSegment = polyline.firstSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          const vertices = [vertex1, vertex2, vertex3];

          expect(polyline.size().vertices).toEqual(6);
          const addedPolyline = new Polyline<TestVertex, TestSegment>(vertices);

          polyline.prepend(addedPolyline);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([6, -160]);

          // Check vertex references
          // Vertices
          expect(polyline.firstVertex.prev).toBeNull();
          expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

          // Segments
          expect(polyline.firstSegment.prev).toBeNull();
          expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
          expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

          // Vertex-Segments
          expect(vertex1.prevSeg).toBeNull();

          expect(vertex3.nextSeg.nextVert).toEqual(originalFirstVertex);
          expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
        });
      });

      describe('#append', () => {
        it('should add a vertex as head & tail to an empty polyline', () => {
          const polyline = new Polyline<TestVertex, TestSegment>([]);

          const vertex = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          polyline.append(vertex);

          expect(polyline.size()).toEqual({
            vertices: 1,
            segments: 0
          });
          expect(polyline.firstVertex?.val).toEqual([45, -110]);
          expect(polyline.lastVertex?.val).toEqual([45, -110]);
        });

        it('should add a vertex at the end of a polyline', () => {
          const originalLastVertex = polyline.lastVertex;
          const originalLastSegment = polyline.lastSegment;

          expect(polyline.size().vertices).toEqual(6);

          const vertex = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);

          polyline.append(vertex);

          expect(polyline.size()).toEqual({
            vertices: 7,
            segments: 6
          });
          expect(polyline.firstVertex?.val).toEqual([1, -110]);
          expect(polyline.lastVertex?.val).toEqual([45, -110]);

          // Check vertex references
          expect(vertex.prev.val).toEqual(originalLastVertex.val);
          expect(originalLastVertex.next.val).toEqual(vertex.val);

          expect(polyline.lastSegment.prev).toEqual(originalLastSegment);
          expect(originalLastSegment.next).toEqual(polyline.lastSegment);

          expect(vertex.prevSeg).toEqual(polyline.lastSegment);
          expect(polyline.lastSegment.nextVert).toEqual(vertex);
        });

        it('should add an array of vertices at the end of a polyline', () => {
          const originalLastVertex = polyline.lastVertex;
          const originalLastSegment = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          const vertices = [vertex1, vertex2, vertex3];

          expect(polyline.size().vertices).toEqual(6);

          polyline.append(vertices);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([1, -110]);
          expect(polyline.lastVertex?.val).toEqual([55, -120]);

          // Check vertex references
          // Vertices
          expect(polyline.lastVertex.next).toBeNull();
          expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
          expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

          // Segments
          expect(polyline.lastSegment.next).toBeNull();
          expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
          expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

          // Vertex-Segments
          expect(vertex3.nextSeg).toBeNull();

          expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
          expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
        });

        it('should add a linked set of vertices with the head provided', () => {
          const originalLastVertex = polyline.lastVertex;
          const originalLastSegment = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          vertex1.next = vertex2;
          vertex2.prev = vertex1;
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          vertex2.next = vertex3;
          vertex3.prev = vertex2;

          expect(polyline.size().vertices).toEqual(6);

          polyline.append(vertex1);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([1, -110]);
          expect(polyline.lastVertex?.val).toEqual([55, -120]);

          // Check vertex references
          // Vertices
          expect(polyline.lastVertex.next).toBeNull();
          expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
          expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

          // Segments
          expect(polyline.lastSegment.next).toBeNull();
          expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
          expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

          // Vertex-Segments
          expect(vertex3.nextSeg).toBeNull();

          expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
          expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
        });

        it('should add a linked set of vertices with the tail provided', () => {
          const originalLastVertex = polyline.lastVertex;
          const originalLastSegment = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          vertex1.next = vertex2;
          vertex2.prev = vertex1;
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          vertex2.next = vertex3;
          vertex3.prev = vertex2;

          expect(polyline.size().vertices).toEqual(6);

          polyline.append(vertex3);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([1, -110]);
          expect(polyline.lastVertex?.val).toEqual([55, -120]);

          // Check vertex references
          // Vertices
          expect(polyline.lastVertex.next).toBeNull();
          expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
          expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

          // Segments
          expect(polyline.lastSegment.next).toBeNull();
          expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
          expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

          // Vertex-Segments
          expect(vertex3.nextSeg).toBeNull();

          expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
          expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
        });

        it('should add a polyline', () => {
          const originalLastVertex = polyline.lastVertex;
          const originalLastSegment = polyline.lastSegment;

          const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
          const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
          const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
          const vertices = [vertex1, vertex2, vertex3];

          expect(polyline.size().vertices).toEqual(6);
          const addedPolyline = new Polyline<TestVertex, TestSegment>(vertices);

          polyline.append(addedPolyline);

          expect(polyline.size()).toEqual({
            vertices: 9,
            segments: 8
          });
          expect(polyline.firstVertex?.val).toEqual([1, -110]);
          expect(polyline.lastVertex?.val).toEqual([55, -120]);

          // Check vertex references
          // Vertices
          expect(polyline.lastVertex.next).toBeNull();
          expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
          expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

          // Segments
          expect(polyline.lastSegment.next).toBeNull();
          expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
          expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

          // Vertex-Segments
          expect(vertex3.nextSeg).toBeNull();

          expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
          expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
        });
      });

      describe('#insertBefore', () => {
        it('should do nothing and return 0 on an empty polyline', () => {
          const polyline = new Polyline([]);

          const refVertexNode = new VertexNode<TestVertex, TestSegment>([2, -120] as TestVertex);
          const insertVertex = new VertexNode<TestVertex, TestSegment>([-1, 110] as TestVertex);

          const insertionSuccess = polyline.insertBefore(refVertexNode, insertVertex);

          expect(insertionSuccess).toBeFalsy();

          const polylineSize = polyline.size();
          expect(polylineSize.vertices).toEqual(0);
          expect(polylineSize.segments).toEqual(0);
        });

        it('should do nothing and return 0 if the reference value is not found', () => {
          const refVertexNode = new VertexNode<TestVertex, TestSegment>([-2, -120] as TestVertex);
          const insertVertex = new VertexNode<TestVertex, TestSegment>([-1, 110] as TestVertex);

          const insertionSuccess = polyline.insertBefore(refVertexNode, insertVertex);

          expect(insertionSuccess).toBeFalsy();

          const polylineSize = polyline.size();
          expect(polylineSize.vertices).toEqual(coordinates.length);
          expect(polylineSize.segments).toEqual(coordinates.length - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        describe('Vertex', () => {
          it('should insert the vertex before the reference and return true', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
            const valueInsert = [-1, 110] as TestVertex;
            const vertexInsert = new VertexNode<TestVertex, TestSegment>(valueInsert);

            const vertexBeforeInsert = refVertexNode.prev as VertexNode<TestVertex, TestSegment>;
            const vertexAfterInsert = refVertexNode;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const insertionSuccess = polyline.insertBefore(refVertexNode, vertexInsert);

            expect(insertionSuccess).toBeTruthy();


            const polylineSize = polyline.size();
            expect(polylineSize.vertices).toEqual(coordinates.length + 1);
            expect(polylineSize.segments).toEqual(coordinates.length - 1 + 1);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              valueInsert,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertexInsert.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertexInsert.val);

            expect(vertexInsert.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertexInsert.val);

            // Segments
            expect(segAfterInsert.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertexInsert.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertexInsert);

            expect(vertexInsert.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertexInsert);

            expect(vertexInsert.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertexInsert);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertexInsert.prevSeg);
            expect((vertexInsert.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it('should insert the vertex before the head as the new head of the polyline if the reference matches the head', () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalFirstSegment = polyline.firstSegment;

            const refVertexNode = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;
            const valueInsert = [-1, 110] as TestVertex;
            const vertexInsert = new VertexNode<TestVertex, TestSegment>(valueInsert);

            const insertionSuccess = polyline.insertBefore(refVertexNode, vertexInsert);

            expect(insertionSuccess).toBeTruthy();

            const polylineSize = polyline.size();
            expect(polylineSize.vertices).toEqual(coordinates.length + 1);
            expect(polylineSize.segments).toEqual(coordinates.length - 1 + 1);
            expect(polyline.vertices()).toEqual([
              valueInsert,
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);


            // Check vertex references
            expect(vertexInsert.next).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prev).toEqual(vertexInsert);

            expect(polyline.firstSegment.next).toEqual(originalFirstSegment);
            expect(originalFirstSegment.prev).toEqual(polyline.firstSegment);

            expect(vertexInsert.nextSeg).toEqual(polyline.firstSegment);
            expect(polyline.firstSegment.prevVert).toEqual(vertexInsert);
          });
        });

        describe('Array of Vertices', () => {
          it('should insert the provided linked list before the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode.prev as VertexNode<TestVertex, TestSegment>;
            const vertexAfterInsert = refVertexNode;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            const addedVertices = [vertex1, vertex2, vertex3];

            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, addedVertices, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided linked list before the head,
          with the first vertex as the new head of the list if the reference matches the head`, () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalFirstSegment = polyline.firstSegment;

            const refVertexNode = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            const addedVertices = [vertex1, vertex2, vertex3];
            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, addedVertices, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([45, -110]);
            expect(polyline.lastVertex?.val).toEqual([6, -160]);

            // Check vertex references
            // Vertices
            expect(polyline.firstVertex.prev).toBeNull();
            expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

            // Segments
            expect(polyline.firstSegment.prev).toBeNull();
            expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
            expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

            // Vertex-Segments
            expect(vertex1.prevSeg).toBeNull();

            expect(vertex3.nextSeg.nextVert).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
          });
        });

        describe('Linked Vertices', () => {
          it('should insert the provided linked list head before the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode.prev as VertexNode<TestVertex, TestSegment>;
            const vertexAfterInsert = refVertexNode;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, vertex1, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it('should insert the provided linked list tail before the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode.prev as VertexNode<TestVertex, TestSegment>;
            const vertexAfterInsert = refVertexNode;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, vertex3, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided linked list head before the head,
          with the first vertex as the new head of the list if the reference matches the head`, () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalFirstSegment = polyline.firstSegment;

            const refVertexNode = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, vertex1, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([45, -110]);
            expect(polyline.lastVertex?.val).toEqual([6, -160]);

            // Check vertex references
            // Vertices
            expect(polyline.firstVertex.prev).toBeNull();
            expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

            // Segments
            expect(polyline.firstSegment.prev).toBeNull();
            expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
            expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

            // Vertex-Segments
            expect(vertex1.prevSeg).toBeNull();

            expect(vertex3.nextSeg.nextVert).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
          });
        });

        describe('Polyline', () => {
          it('should insert the provided polyline before the reference and return the number of items inserted', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode.prev as VertexNode<TestVertex, TestSegment>;
            const vertexAfterInsert = refVertexNode;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertices = [
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex
            ];
            const addedPolyline = new Polyline<TestVertex, TestSegment>(vertices);
            const firstInsertVertex = addedPolyline.firstVertex;
            const lastInsertVertex = addedPolyline.lastVertex;
            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, addedPolyline, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(firstInsertVertex.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(firstInsertVertex.val);

            expect(lastInsertVertex.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(lastInsertVertex.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(firstInsertVertex.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(firstInsertVertex);

            expect(lastInsertVertex.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(lastInsertVertex);

            expect(lastInsertVertex.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(lastInsertVertex);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(lastInsertVertex.prevSeg);
            expect((lastInsertVertex.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided polyline before the head,
          with the first vertex as the new head of the polyline if the reference matches the head`, () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalFirstSegment = polyline.firstSegment;

            const refVertexNode = polyline.firstVertex as VertexNode<TestVertex, TestSegment>;
            const vertices = [
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex
            ];
            const addedValues = new Polyline<TestVertex, TestSegment>(vertices);
            const returnListCount = true;

            const result = polyline.insertBefore(refVertexNode, addedValues, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([45, -110]);
            expect(polyline.lastVertex?.val).toEqual([6, -160]);

            // Check vertex references
            // Vertices
            expect(polyline.firstVertex.prev).toBeNull();
            expect(polyline.firstVertex.next.next.next).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prev.prev.prev).toEqual(polyline.firstVertex);

            // Segments
            expect(polyline.firstSegment.prev).toBeNull();
            expect(polyline.firstSegment.next.next.next).toEqual(originalFirstSegment);
            expect(originalFirstSegment.prev.prev.prev).toEqual(polyline.firstSegment);

            // Vertex-Segments
            expect(addedValues.firstVertex.prevSeg).toBeNull();

            expect(addedValues.lastVertex.nextSeg.nextVert).toEqual(originalFirstVertex);
            expect(originalFirstVertex.prevSeg).toEqual(originalFirstSegment.prev);
          });
        });
      });

      describe('#insertAfter', () => {
        it('should do nothing and return 0 on an empty polyline', () => {
          const polyline = new Polyline([]);

          const refVertexNode = new VertexNode<TestVertex, TestSegment>([2, -120] as TestVertex);
          const insertVertex = new VertexNode<TestVertex, TestSegment>([-1, 110] as TestVertex);

          const insertionSuccess = polyline.insertAfter(refVertexNode, insertVertex);

          expect(insertionSuccess).toBeFalsy();

          const polylineSize = polyline.size();
          expect(polylineSize.vertices).toEqual(0);
          expect(polylineSize.segments).toEqual(0);
        });

        it('should do nothing and return 0 if the reference value is not found', () => {
          const refVertexNode = new VertexNode<TestVertex, TestSegment>([-2, -120] as TestVertex);
          const insertVertex = new VertexNode<TestVertex, TestSegment>([-1, 110] as TestVertex);

          const insertionSuccess = polyline.insertAfter(refVertexNode, insertVertex);

          expect(insertionSuccess).toBeFalsy();

          const polylineSize = polyline.size();
          expect(polylineSize.vertices).toEqual(coordinates.length);
          expect(polylineSize.segments).toEqual(coordinates.length - 1);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        describe('Vertex', () => {
          it('should insert the vertex after the reference and return true', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;
            const valueInsert = [-1, 110] as TestVertex;
            const vertexInsert = new VertexNode<TestVertex, TestSegment>(valueInsert);

            const vertexBeforeInsert = refVertexNode;
            const vertexAfterInsert = refVertexNode.next as VertexNode<TestVertex, TestSegment>;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const insertionSuccess = polyline.insertAfter(refVertexNode, vertexInsert);

            expect(insertionSuccess).toBeTruthy();

            const polylineSize = polyline.size();
            expect(polylineSize.vertices).toEqual(coordinates.length + 1);
            expect(polylineSize.segments).toEqual(coordinates.length - 1 + 1);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              valueInsert,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertexInsert.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertexInsert.val);

            expect(vertexInsert.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertexInsert.val);

            // Segments
            expect(segAfterInsert.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertexInsert.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertexInsert);

            expect(vertexInsert.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertexInsert);

            expect(vertexInsert.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertexInsert);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertexInsert.prevSeg);
            expect((vertexInsert.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it('should insert the vertex after the tail as the new tail of the polyline if the reference matches the tail', () => {
            const originalLastVertex = polyline.lastVertex;
            const originalLastSegment = polyline.lastSegment;

            const refVertexNode = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;
            const valueInsert = [-1, 110] as TestVertex;
            const vertexInsert = new VertexNode<TestVertex, TestSegment>(valueInsert);

            const insertionSuccess = polyline.insertAfter(refVertexNode, vertexInsert);

            expect(insertionSuccess).toBeTruthy();

            const polylineSize = polyline.size();
            expect(polylineSize.vertices).toEqual(coordinates.length + 1);
            expect(polylineSize.segments).toEqual(coordinates.length - 1 + 1);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex,
              valueInsert
            ]);

            // Check vertex references
            expect(vertexInsert.prev.val).toEqual(originalLastVertex.val);
            expect(originalLastVertex.next.val).toEqual(vertexInsert.val);

            expect(polyline.lastSegment.prev).toEqual(originalLastSegment);
            expect(originalLastSegment.next).toEqual(polyline.lastSegment);

            expect(vertexInsert.prevSeg).toEqual(polyline.lastSegment);
            expect(polyline.lastSegment.nextVert).toEqual(vertexInsert);
          });
        });

        describe('Array of Vertices', () => {
          it('should insert the provided linked list after the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode;
            const vertexAfterInsert = refVertexNode.next as VertexNode<TestVertex, TestSegment>;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            const addedVertices = [vertex1, vertex2, vertex3];

            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, addedVertices, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided linked list after the tail,
          with the first vertex as the new tail of the list if the reference matches the tail`, () => {
            const originalLastVertex = polyline.lastVertex;
            const originalLastSegment = polyline.lastSegment;

            const refVertexNode = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            const addedVertices = [vertex1, vertex2, vertex3];

            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, addedVertices, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([1, -110]);
            expect(polyline.lastVertex?.val).toEqual([55, -120]);

            // Check vertex references
            // Vertices
            expect(polyline.lastVertex.next).toBeNull();
            expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
            expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

            // Segments
            expect(polyline.lastSegment.next).toBeNull();
            expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
            expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

            // Vertex-Segments
            expect(vertex3.nextSeg).toBeNull();

            expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
            expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
          });
        });

        describe('Linked Vertices', () => {
          it('should insert the provided linked list head after the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode;
            const vertexAfterInsert = refVertexNode.next as VertexNode<TestVertex, TestSegment>;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, vertex1, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it('should insert the provided linked list tail after the reference and return the number of items inserted into the array', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode;
            const vertexAfterInsert = refVertexNode.next as VertexNode<TestVertex, TestSegment>;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, vertex3, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(vertex1.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(vertex1.val);

            expect(vertex3.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(vertex3.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(vertex1.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(vertex1);

            expect(vertex3.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(vertex3);

            expect(vertex3.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(vertex3);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(vertex3.prevSeg);
            expect((vertex3.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided linked list head after the tail,
          with the last vertex as the new tail of the list if the reference matches the tail`, () => {
            const originalLastVertex = polyline.lastVertex;
            const originalLastSegment = polyline.lastSegment;

            const refVertexNode = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;

            const vertex1 = new VertexNode<TestVertex, TestSegment>([45, -110] as TestVertex);
            const vertex2 = new VertexNode<TestVertex, TestSegment>([50, -115] as TestVertex);
            vertex1.next = vertex2;
            vertex2.prev = vertex1;
            const vertex3 = new VertexNode<TestVertex, TestSegment>([55, -120] as TestVertex);
            vertex2.next = vertex3;
            vertex3.prev = vertex2;

            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, vertex1, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([1, -110]);
            expect(polyline.lastVertex?.val).toEqual([55, -120]);

            // Check vertex references
            // Vertices
            expect(polyline.lastVertex.next).toBeNull();
            expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
            expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

            // Segments
            expect(polyline.lastSegment.next).toBeNull();
            expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
            expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

            // Vertex-Segments
            expect(vertex3.nextSeg).toBeNull();

            expect(vertex1.prevSeg.prevVert).toEqual(originalLastVertex);
            expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
          });
        });

        describe('Polyline', () => {
          it('should insert the provided polyline after the reference and return the number of items inserted', () => {
            const refVertexNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const vertexBeforeInsert = refVertexNode;
            const vertexAfterInsert = refVertexNode.next as VertexNode<TestVertex, TestSegment>;
            const segBeforeInsert = vertexBeforeInsert.nextSeg;
            const segAfterInsert = vertexAfterInsert.nextSeg;

            const vertices = [
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex
            ];
            const addedPolyline = new Polyline<TestVertex, TestSegment>(vertices);
            const firstInsertVertex = addedPolyline.firstVertex;
            const lastInsertVertex = addedPolyline.lastVertex;
            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, addedPolyline, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex
            ]);

            // Check vertex references
            // Vertices
            expect(firstInsertVertex.prev.val).toEqual(vertexBeforeInsert.val);
            expect(vertexBeforeInsert.next.val).toEqual(firstInsertVertex.val);

            expect(lastInsertVertex.next.val).toEqual(vertexAfterInsert.val);
            expect(vertexAfterInsert.prev.val).toEqual(lastInsertVertex.val);

            // Segments
            expect(segAfterInsert.prev.prev.prev.prev).toEqual(segBeforeInsert);
            expect(segBeforeInsert.next.next.next.next).toEqual(segAfterInsert);

            // Vertex-Segments
            expect(firstInsertVertex.prevSeg).toEqual(segBeforeInsert);
            expect(segBeforeInsert.nextVert).toEqual(firstInsertVertex);

            expect(lastInsertVertex.nextSeg.nextVert).toEqual(vertexAfterInsert);
            expect(vertexAfterInsert.prevSeg.prevVert).toEqual(lastInsertVertex);

            expect(lastInsertVertex.nextSeg.next).toEqual(segAfterInsert);
            expect((segAfterInsert.prev as SegmentNode<TestVertex, TestSegment>).prevVert).toEqual(lastInsertVertex);

            expect(vertexAfterInsert.prevSeg.prev).toEqual(lastInsertVertex.prevSeg);
            expect((lastInsertVertex.prevSeg.next as SegmentNode<TestVertex, TestSegment>).nextVert).toEqual(vertexAfterInsert);
          });

          it(`should insert the provided polyline after the tail,
          with the last vertex as the new tail of the polyline if the reference matches the tail`, () => {
            const originalLastVertex = polyline.lastVertex;
            const originalLastSegment = polyline.lastSegment;

            const refVertexNode = polyline.lastVertex as VertexNode<TestVertex, TestSegment>;
            const vertices = [
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex
            ];
            const addedValues = new Polyline<TestVertex, TestSegment>(vertices);
            const returnListCount = true;

            const result = polyline.insertAfter(refVertexNode, addedValues, returnListCount);

            expect(result).toEqual(3);
            expect(polyline.vertices()).toEqual([
              [1, -110] as TestVertex,
              [2, -120] as TestVertex,
              [3, -130] as TestVertex,
              [4, -140] as TestVertex,
              [5, -150] as TestVertex,
              [6, -160] as TestVertex,
              [45, -110] as TestVertex,
              [50, -115] as TestVertex,
              [55, -120] as TestVertex,
            ]);

            expect(polyline.size()).toEqual({
              vertices: 9,
              segments: 8
            });
            expect(polyline.firstVertex?.val).toEqual([1, -110]);
            expect(polyline.lastVertex?.val).toEqual([55, -120]);

            // Check vertex references
            // Vertices
            expect(polyline.lastVertex.next).toBeNull();
            expect(polyline.lastVertex.prev.prev.prev).toEqual(originalLastVertex);
            expect(originalLastVertex.next.next.next).toEqual(polyline.lastVertex);

            // Segments
            expect(polyline.lastSegment.next).toBeNull();
            expect(polyline.lastSegment.prev.prev.prev).toEqual(originalLastSegment);
            expect(originalLastSegment.next.next.next).toEqual(polyline.lastSegment);

            // Vertex-Segments
            expect(addedValues.lastVertex.nextSeg).toBeNull();

            expect(addedValues.firstVertex.prevSeg.prevVert).toEqual(originalLastVertex);
            expect(originalLastVertex.nextSeg).toEqual(originalLastSegment.next);
          });
        });
      });
    });

    describe('Replace', () => {
      // NOTE: replace 'At' and 'From/To' methods both call the 'Between' function with equivalent inputs.
      //  Tests are consolidated to reflect this.

      const getTailNode = (vertex: VertexNode<TestVertex, Segment>) => {
        let tempNode: VertexNode<TestVertex, Segment>;
        while (vertex) {
          tempNode = vertex;
          vertex = vertex.next as VertexNode<TestVertex, Segment>;
        }

        return tempNode;
      }

      const getVertexNode = (val: [number, number]) => {
        return polyline.vertexNodesBy(
          val,
          (val: [number, number],
            node: VertexNode<TestVertex, TestSegment>) => node.val.toString() === val.toString()
        )[0];
      };

      it('should return null & do nothing if the polyline is empty', () => {
        const startNode = getVertexNode(coordinates[0]);
        const endNode = getVertexNode(coordinates[3]);

        polyline = new Polyline([]);
        const initialLength = polyline.size();

        const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
        const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
        const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceBetween(startNode, endNode, nodes);

        expect(result).toBeNull();

        const resultingLength = polyline.size();
        expect(resultingLength.vertices).toEqual(initialLength.vertices);
        expect(resultingLength.segments).toEqual(initialLength.segments);
      });

      // it('should return 0 & do nothing when the start/end nodes are both found, but in reverse order', () => {
      //   const initialLength = polyline.size();

      //   const startNode = getVertexNode(coordinates[4]);
      //   const endNode = getVertexNode(coordinates[1]);

      //   const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
      //   const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
      //   const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
      //   const nodes = [node1, node2, node3];

      //   const result = polyline.replaceBetween(startNode, endNode, nodes);

      //   expect(result).toEqual(0);

      //   const resultingLength = polyline.size();
      //   expect(resultingLength.vertices).toEqual(initialLength.vertices);
      //   expect(resultingLength.segments).toEqual(initialLength.segments);
      // });

      // Just check that this correctly calls replaceVerticesBetween
      // replaceVertexAt(vertexTarget: VertexNode<TVertex, TSegment>, vertexReplacement: VertexNode<TVertex, TSegment>): boolean;
      describe('#replaceAt', () => {
        it('should return null & do nothing if the target node is not specified', () => {
          const initialLength = polyline.size();

          const targetNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceAt(targetNode, nodes);

          expect(result).toBeNull();

          const resultingLength = polyline.size();
          expect(resultingLength.vertices).toEqual(initialLength.vertices);
          expect(resultingLength.segments).toEqual(initialLength.segments);
        });

        it('should return the # of vertices inserted, the removed vertex, & replace the target vertex with the new vertices provided', () => {
          const initialLength = polyline.size();

          // Insert after first segment, over second segment
          const targetNode = getVertexNode(coordinates[2]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceAt(targetNode, nodes);

          expect(result.inserted).toBeTruthy();
          expect(result.removed).toEqual(targetNode);

          const removedCount = sizeOf(result.removed);
          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            // [3, -130] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should return the # of vertices inserted, the removed vertex, & replace the target head vertex with the new vertices provided', () => {
          const initialLength = polyline.size();

          // Insert after first segment, over second segment
          const targetNode = getVertexNode(coordinates[0]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceAt(targetNode, nodes);

          expect(result.inserted).toBeTruthy();
          expect(result.removed).toEqual(targetNode);

          const removedCount = sizeOf(result.removed);
          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.firstVertex).toEqual(node1);
          expect(polyline.vertices()).toEqual([
            // [1, -110] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should return the # of vertices inserted, the removed vertex, & replace the target tail vertex with the new vertices provided', () => {
          const initialLength = polyline.size();

          // Insert after first segment, over second segment
          const targetNode = getVertexNode(coordinates[coordinates.length - 1]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceAt(targetNode, nodes);

          expect(result.inserted).toBeTruthy();
          expect(result.removed).toEqual(targetNode);

          const removedCount = sizeOf(result.removed);
          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.lastVertex).toEqual(node3);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            // [6, -160] as TestVertex
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
          ]);
        });
      });

      // Main set of tests
      describe('#replaceBetween', () => {
        it('should return null & do nothing if the start & end nodes are both unspecified', () => {
          const initialLength = polyline.size();

          const startNode = null;
          const endNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result).toBeNull();

          const resultingLength = polyline.size();
          expect(resultingLength.vertices).toEqual(initialLength.vertices);
          expect(resultingLength.segments).toEqual(initialLength.segments);
        });

        it('should return null & do nothing when the start/end nodes are the same node', () => {
          const initialLength = polyline.size();

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const startNode = getVertexNode(coordinates[2]);
          const endNode = getVertexNode(coordinates[2]);

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result).toBeNull();

          const resultingLength = polyline.size();
          expect(resultingLength.vertices).toEqual(initialLength.vertices);
          expect(resultingLength.segments).toEqual(initialLength.segments);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it('should return the head of the removed nodes range & only remove nodes in the start/end range if no nodes are provided to insert', () => {
          const startNode = getVertexNode(coordinates[0]);
          const endNode = getVertexNode(coordinates[3]);

          const initialLength = polyline.size();

          const result = polyline.replaceBetween(startNode, endNode, []);

          expect(result.inserted).toEqual(0);
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + result.inserted - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + result.inserted - removedCount);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            // [2, -120] as TestVertex,
            // [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it(`should return # of nodes inserted & only insert the nodes at the head of track
          if only an end vertex is provided & it is at the head of the track.`, () => {
          const initialLength = polyline.size();
          const initialHead = polyline.firstVertex;

          const startNode = null;
          const endNode = getVertexNode(coordinates[0]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(0);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.firstVertex.equals(node1.val)).toBeTruthy();
          expect(polyline.vertices()).toEqual([
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(node3.next.val).toEqual(endNode.val);

          expect(node1).toEqual(polyline.firstVertex);
          expect(node1.prev).toBeNull();
          expect(node1.next).toEqual(node2);

          expect(node3.prev).toEqual(node2);
          expect(node3.next).toEqual(initialHead);
          expect(initialHead.prev).toEqual(node3);
        });

        it(`should return # of nodes inserted & only insert the nodes at the tail of track
         if only a start vertex is provided & it is at the tail of the track`, () => {
          const initialLength = polyline.size();
          const initialHead = polyline.firstVertex;
          const initialTail = getTailNode(initialHead);

          const startNode = getVertexNode(coordinates[coordinates.length - 1]);
          const endNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(0);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.firstVertex.equals(initialHead.val)).toBeTruthy();
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
          ]);

          expect(node1.prev.val).toEqual(startNode.val);

          expect(node1).not.toEqual(polyline.firstVertex);
          expect(node1).toEqual(initialTail.next);
          expect(node1.prev).toEqual(initialTail);
          expect(node1.next).toEqual(node2);

          expect(node3.prev).toEqual(node2);
          expect(node3.next).toBeNull();
        });

        it(`should return # of nodes inserted & only insert nodes in the start/end range if the nodes provided are adjacent`, () => {
          const initialLength = polyline.size();
          const initialHead = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const initialTail = initialHead.next as VertexNode<TestVertex, TestSegment>;

          // Insert after first segment, over second segment
          const startNode = getVertexNode(coordinates[1]);
          const endNode = getVertexNode(coordinates[2]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(0);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(node1.prev.val).toEqual(startNode.val);
          expect(node3.next.val).toEqual(endNode.val);

          expect(node1).not.toEqual(polyline.firstVertex);
          expect(node1).toEqual(initialHead.next);
          expect(node1.prev).toEqual(initialHead);
          expect(node1.next).toEqual(node2);

          expect(node3.prev).toEqual(node2);
          expect(node3.next).toEqual(initialTail);
          expect(initialTail.prev).toEqual(node3);
        });

        it(`should return # of nodes inserted, head of the removed range, & replace the nodes from the head of track to the end vertex
          if only an end vertex is provided.`, () => {
          const initialLength = polyline.size();

          const startNode = null;
          const endNode = getVertexNode(coordinates[2]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.firstVertex.equals(node1.val)).toBeTruthy();
          expect(polyline.vertices()).toEqual([
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            // [1, -110] as TestVertex,
            // [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it(`should return # of nodes inserted, head of the removed range, & replace the nodes to the tail of track from the start vertex
          if only a start vertex is provided`, () => {
          const initialLength = polyline.size();

          const startNode = getVertexNode(coordinates[coordinates.length - 1 - 2]);
          const endNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.lastVertex.equals(node3.val)).toBeTruthy();
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            // [5, -150] as TestVertex,
            // [6, -160] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
          ]);
        });

        it(`should return # of nodes inserted, head of the removed range,
         insert the nodes between the two specified start/end nodes in the track,
         & remove the original set of nodes between these same two nodes`, () => {
          const initialLength = polyline.size();
          const initialHead = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;
          const initialTail = initialHead?.next?.next?.next as VertexNode<TestVertex, TestSegment>;

          // Insert after first segment, over second segment
          const startNode = getVertexNode(coordinates[1]);
          const endNode = getVertexNode(coordinates[4]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceBetween(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            // [3, -130] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            // [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);

          expect(node1.prev.val).toEqual(startNode.val);
          expect(node3.next.val).toEqual(endNode.val);

          expect(node1).not.toEqual(polyline.firstVertex);
          expect(node1).toEqual(initialHead.next);
          expect(node1.prev).toEqual(initialHead);
          expect(node1.next).toEqual(node2);

          expect(node3.prev).toEqual(node2);
          expect(node3.next).toEqual(initialTail);
          expect(initialTail.prev).toEqual(node3);
        });
      });

      describe('#replaceFromTo', () => {
        it('should return null & do nothing if the start & end nodes are both unspecified', () => {
          const initialLength = polyline.size();

          const startNode = null;
          const endNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceFromTo(startNode, endNode, nodes);

          expect(result).toBeNull();

          const resultingLength = polyline.size();
          expect(resultingLength.vertices).toEqual(initialLength.vertices);
          expect(resultingLength.segments).toEqual(initialLength.segments);
        });

        it(`should replace the entire polyline if the start/end nodes provided correspond to the head/tail nodes of the polyline`, () => {
          const initialLength = polyline.size();
          const startNode = getVertexNode(coordinates[0]);
          const endNode = getVertexNode(coordinates[coordinates.length - 1]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceFromTo(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(6);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + result.inserted - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + result.inserted - removedCount);
          expect(polyline.firstVertex.equals(node1.val)).toBeTruthy();
          expect(polyline.lastVertex.equals(node3.val)).toBeTruthy();
          expect(polyline.vertices()).toEqual([
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex
          ]);
        });

        it(`should return # nodes inserted, head of the removed range
          & replace the start node through the end node if the start & end nodes are found in order`, () => {
          const initialLength = polyline.size();

          const startNode = getVertexNode(coordinates[1]);
          const endNode = getVertexNode(coordinates[4]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceFromTo(startNode, endNode, nodes);

          expect(result.inserted).toBeTruthy();
          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(4);

          expect(polyline.size().vertices).toEqual(initialLength.vertices + 3 - removedCount);
          expect(polyline.size().segments).toEqual(initialLength.segments + 3 - removedCount);
          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            // [2, -120] as TestVertex,
            // [3, -130] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            // [4, -140] as TestVertex,
            // [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it(`should replace the first Point in the Route & return a truthy number of Points inserted
        if only an end Point is provided and the end Point is at the start of the Route`, () => {
          const initialLength = polyline.size();
          const initialHead = polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>;

          const startNode = null;
          const endNode = getVertexNode(coordinates[0]);

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceFromTo(startNode, endNode, nodes);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polyline.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polyline.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(polyline.firstVertex.val).toEqual(node1.val);
          expect(initialHead.prev.val).toEqual(node3.val);

          expect(polyline.vertices()).toEqual([
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
            // [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            [6, -160] as TestVertex
          ]);
        });

        it(`should replace the last Point in the route & return a truthy number of Points inserted
        if only a start Point is provided & the starty Node is at the end of the Route`, () => {
          const initialLength = polyline.size();
          const initialTail = polyline.lastVertex.prev;

          const startNode = getVertexNode(coordinates[coordinates.length - 1]);
          const endNode = null;

          const node1 = new VertexNode<TestVertex, TestSegment>([99, 140] as TestVertex);
          const node2 = new VertexNode<TestVertex, TestSegment>([666, 69] as TestVertex);
          const node3 = new VertexNode<TestVertex, TestSegment>([420, 171] as TestVertex);
          const nodes = [node1, node2, node3];

          const result = polyline.replaceFromTo(startNode, endNode, nodes);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polyline.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polyline.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialTail.next.val).toEqual(node1.val);
          expect(polyline.lastVertex.val).toEqual(node3.val);

          expect(polyline.vertices()).toEqual([
            [1, -110] as TestVertex,
            [2, -120] as TestVertex,
            [3, -130] as TestVertex,
            [4, -140] as TestVertex,
            [5, -150] as TestVertex,
            // [6, -160] as TestVertex,
            [99, 140] as TestVertex,
            [666, 69] as TestVertex,
            [420, 171] as TestVertex,
          ]);
        });
      });
    });

    describe('Split', () => {
      // NOTE: Each subsequent method tested calls the prior method with equivalent inputs.
      //  Tests are consolidated to reflect this.

      it('should return only the original polyline & do nothing on an empty polyline', () => {
        polyline = new Polyline([]);
        const originalSize = polyline.size();

        const markerNode = new VertexNode<TestVertex, TestSegment>([-5, -50] as TestVertex);

        const result = polyline.splitBy(markerNode);

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(polyline);

        const resultSize = polyline.size();
        expect(originalSize.vertices).toEqual(resultSize.vertices);
        expect(originalSize.segments).toEqual(resultSize.segments);
      });

      it('should return only the original polyline & do nothing on a polyline with one vertex', () => {
        polyline = new Polyline([coordinates[1]]);
        const originalSize = polyline.size();

        const markerNode = new VertexNode<TestVertex, TestSegment>(coordinates[1]);

        const result = polyline.splitBy(markerNode);

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(polyline);

        const resultSize = polyline.size();
        expect(originalSize.vertices).toEqual(resultSize.vertices);
        expect(originalSize.segments).toEqual(resultSize.segments);
      });

      it('should return only the original polyline & do nothing on a polyline with 2 vertices', () => {
        polyline = new Polyline([coordinates[1], coordinates[2]]);
        const originalSize = polyline.size();

        const markerNode = new VertexNode<TestVertex, TestSegment>(coordinates[2]);

        const result = polyline.splitBy(markerNode);

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(polyline);

        const resultSize = polyline.size();
        expect(originalSize.vertices).toEqual(resultSize.vertices);
        expect(originalSize.segments).toEqual(resultSize.segments);
      });

      describe('#splitBy', () => {
        describe('Vertex', () => {
          it('should return only the original polyline & do nothing if the supplied vertex is null or undefined', () => {
            const originalSize = polyline.size();

            const result = polyline.splitBy(null);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(polyline);

            const resultSize = polyline.size();
            expect(originalSize.vertices).toEqual(resultSize.vertices);
            expect(originalSize.segments).toEqual(resultSize.segments);
          });

          it('should return only the original polyline & do nothing if the supplied vertex is not found', () => {
            const originalSize = polyline.size();

            const result = polyline.splitBy([-5, -50] as TestVertex);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(polyline);

            const resultSize = polyline.size();
            expect(originalSize.vertices).toEqual(resultSize.vertices);
            expect(originalSize.segments).toEqual(resultSize.segments);
          });

          it('should return only the original polyline & do nothing if the vertex is at the head of the polyline', () => {
            const originalSize = polyline.size();

            const markerNode = polyline.firstVertex;

            const result = polyline.splitBy(markerNode);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(polyline);

            const resultSize = polyline.size();
            expect(originalSize.vertices).toEqual(resultSize.vertices);
            expect(originalSize.segments).toEqual(resultSize.segments);
          });

          it('should return only the original polyline & do nothing if the vertex is at the tail of the polyline', () => {
            const originalSize = polyline.size();

            const markerNode = polyline.lastVertex;

            const result = polyline.splitBy(markerNode);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(polyline);

            const resultSize = polyline.size();
            expect(originalSize.vertices).toEqual(resultSize.vertices);
            expect(originalSize.segments).toEqual(resultSize.segments);
          });

          it('should return two polylines split at the vertex, modifying the original polyline, with a referenced vertex node', () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalLastVertex = polyline.lastVertex;

            // const markerNode = (polyline.firstVertex.next as VertexNode<TestVertex, TestSegment>).next as VertexNode<TestVertex, TestSegment>;
            const markerNode = polyline.firstVertex.next.next as VertexNode<TestVertex, TestSegment>;

            const segPrevAtSplit = markerNode.prevSeg;
            const segNextAtSplit = markerNode.nextSeg;

            const result = polyline.splitBy(markerNode);

            expect(result.length).toEqual(2);

            // Check expected nodes/values
            expect(result[0].size()).toEqual({
              vertices: 3,
              segments: 2
            });
            expect(result[0].firstVertex).toEqual(originalFirstVertex);
            expect(result[0].lastSegment).toEqual(segPrevAtSplit);
            expect(result[0].lastVertex.equals(markerNode.val)).toBeTruthy();

            expect(result[1].size()).toEqual({
              vertices: 4,
              segments: 3
            });
            expect(result[1].firstVertex.equals(markerNode.val)).toBeTruthy();
            expect(result[1].firstSegment).toEqual(segNextAtSplit);
            expect(result[1].lastVertex).toEqual(originalLastVertex);

            // Check connections break at split
            expect(result[0].lastVertex.next).toBeNull();
            expect(result[1].firstVertex.prev).toBeNull();

            expect(result[0].lastVertex.nextSeg).toBeNull();
            expect(result[1].firstVertex.prevSeg).toBeNull();

            expect(result[0].lastSegment.next).toBeNull();
            expect(result[1].firstSegment.prev).toBeNull();
          });

          it('should return two polylines split at the vertex, modifying the original polyline, with a vertex value', () => {
            const originalFirstVertex = polyline.firstVertex;
            const originalLastVertex = polyline.lastVertex;

            const markerVertex = coordinates[2];

            const markerNode = polyline.vertexNodesByVertex(markerVertex)[0];
            const segPrevAtSplit = markerNode.prevSeg;
            const segNextAtSplit = markerNode.nextSeg;

            const result = polyline.splitBy(markerVertex);

            expect(result.length).toEqual(2);

            // Check expected nodes/values
            expect(result[0].size()).toEqual({
              vertices: 3,
              segments: 2
            });
            expect(result[0].firstVertex).toEqual(originalFirstVertex);
            expect(result[0].lastSegment).toEqual(segPrevAtSplit);
            expect(result[0].lastVertex.equals(markerNode.val)).toBeTruthy();

            expect(result[1].size()).toEqual({
              vertices: 4,
              segments: 3
            });
            expect(result[1].firstVertex.equals(markerNode.val)).toBeTruthy();
            expect(result[1].firstSegment).toEqual(segNextAtSplit);
            expect(result[1].lastVertex).toEqual(originalLastVertex);

            // Check connections break at split
            expect(result[0].lastVertex.next).toBeNull();
            expect(result[1].firstVertex.prev).toBeNull();

            expect(result[0].lastVertex.nextSeg).toBeNull();
            expect(result[1].firstVertex.prevSeg).toBeNull();

            expect(result[0].lastSegment.next).toBeNull();
            expect(result[1].firstSegment.prev).toBeNull();
          });
        });

        // TODO: Determine if Sub-Polyline splitting is even needed vs. just start/end nodes supplied to other methods
        // describe('SubPolyline', () => {
        //   it('should return only the original polyline & do nothing if the provided polyline is empty', () => {
        //     const originalSize = polyline.size();

        //     const markerPolyline = new Polyline<TestVertex, TestSegment>([]);

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(1);
        //     expect(result[0]).toEqual(polyline);

        //     const resultSize = polyline.size();
        //     expect(originalSize.vertices).toEqual(resultSize.vertices);
        //     expect(originalSize.segments).toEqual(resultSize.segments);
        //   });

        //   it('should return only the original polyline & do nothing if the provided polyline only has one vertex', () => {
        //     const originalSize = polyline.size();

        //     const markerPolyline = new Polyline<TestVertex, TestSegment>([coordinates[1]]);

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(1);
        //     expect(result[0]).toEqual(polyline);

        //     const resultSize = polyline.size();
        //     expect(originalSize.vertices).toEqual(resultSize.vertices);
        //     expect(originalSize.segments).toEqual(resultSize.segments);
        //   });

        //   it(`should return only the original polyline & do nothing
        //   if the start of the provided polyline is not present in the polyline`, () => {
        //     const originalSize = polyline.size();

        //     const subCoordinates = coordinates.slice(2, 5);
        //     subCoordinates.unshift([-60, -600] as TestVertex);
        //     const markerPolyline = new Polyline<TestVertex, TestSegment>(subCoordinates);

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(1);
        //     expect(result[0]).toEqual(polyline);

        //     const resultSize = polyline.size();
        //     expect(originalSize.vertices).toEqual(resultSize.vertices);
        //     expect(originalSize.segments).toEqual(resultSize.segments);
        //   });

        //   it(`should return only the original polyline & do nothing
        //   if the end of the provided polyline is not present in the polyline`, () => {
        //     const originalSize = polyline.size();

        //     const subCoordinates = coordinates.slice(2, 5);
        //     subCoordinates.push([-60, -600] as TestVertex);
        //     const markerPolyline = new Polyline<TestVertex, TestSegment>(subCoordinates);

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(1);
        //     expect(result[0]).toEqual(polyline);

        //     const resultSize = polyline.size();
        //     expect(originalSize.vertices).toEqual(resultSize.vertices);
        //     expect(originalSize.segments).toEqual(resultSize.segments);
        //   });

        //   it(`should return 2 polylines split at the sub-polyline tail vertex, modifying the original polyline,
        //     if a sub-polyline head coincides with the polyline head`, () => {
        //     const subCoordinates = coordinates.slice(0, 5);
        //     const markerPolyline = new Polyline<TestVertex, TestSegment>(subCoordinates);

        //     const originalFirstVertex = polyline.firstVertex;
        //     const originalLastVertex = polyline.lastVertex;

        //     const expectedMarkerNode = markerPolyline.lastVertex;
        //     const expectedMarkerActual = polyline.vertexNodesByVertex(subCoordinates[subCoordinates.length - 1])[0];

        //     const segPrevAtSplit = expectedMarkerActual.prevSeg;
        //     const segNextAtSplit = expectedMarkerActual.nextSeg;

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(2);

        //     // Check expected nodes/values
        //     expect(result[0].size()).toEqual({
        //       vertices: 5,
        //       segments: 4
        //     });
        //     expect(result[0].firstVertex).toEqual(originalFirstVertex);
        //     expect(result[0].lastSegment).toEqual(segPrevAtSplit);
        //     expect(result[0].lastVertex.equals(expectedMarkerNode.val)).toBeTruthy();

        //     expect(result[1].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });
        //     expect(result[1].firstVertex.equals(expectedMarkerNode.val)).toBeTruthy();
        //     expect(result[1].firstSegment).toEqual(segNextAtSplit);
        //     expect(result[1].lastVertex).toEqual(originalLastVertex);

        //     // Check connections break at split
        //     expect(result[0].lastVertex.next).toBeNull();
        //     expect(result[1].firstVertex.prev).toBeNull();

        //     expect(result[0].lastVertex.nextSeg).toBeNull();
        //     expect(result[1].firstVertex.prevSeg).toBeNull();

        //     expect(result[0].lastSegment.next).toBeNull();
        //     expect(result[1].firstSegment.prev).toBeNull();
        //   });

        //   it(`should return 2 polylines split at the sub-polyline head vertex, modifying the original polyline,
        //   if a sub-polyline tail coincides with the polyline tail`, () => {
        //     const subCoordinates = coordinates.slice(1);
        //     const markerPolyline = new Polyline<TestVertex, TestSegment>(subCoordinates);

        //     const originalFirstVertex = polyline.firstVertex;
        //     const originalLastVertex = polyline.lastVertex;

        //     const expectedMarkerNode = markerPolyline.firstVertex;
        //     const expectedMarkerActual = polyline.vertexNodesByVertex(subCoordinates[0])[0];

        //     const segPrevAtSplit = expectedMarkerActual.prevSeg;
        //     const segNextAtSplit = expectedMarkerActual.nextSeg;

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(2);

        //     // Check expected nodes/values
        //     expect(result[0].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });
        //     expect(result[0].firstVertex).toEqual(originalFirstVertex);
        //     expect(result[0].lastSegment).toEqual(segPrevAtSplit);
        //     expect(result[0].lastVertex.equals(expectedMarkerNode.val)).toBeTruthy();

        //     expect(result[1].size()).toEqual({
        //       vertices: 5,
        //       segments: 4
        //     });
        //     expect(result[1].firstVertex.equals(expectedMarkerNode.val)).toBeTruthy();
        //     expect(result[1].firstSegment).toEqual(segNextAtSplit);
        //     expect(result[1].lastVertex).toEqual(originalLastVertex);

        //     // Check connections break at split
        //     expect(result[0].lastVertex.next).toBeNull();
        //     expect(result[1].firstVertex.prev).toBeNull();

        //     expect(result[0].lastVertex.nextSeg).toBeNull();
        //     expect(result[1].firstVertex.prevSeg).toBeNull();

        //     expect(result[0].lastSegment.next).toBeNull();
        //     expect(result[1].firstSegment.prev).toBeNull();
        //   });

        //   it('should return 3 polylines split at the start & end of the provided polyline', () => {
        //     const subCoordinates = coordinates.slice(1, 5);
        //     const markerPolyline = new Polyline<TestVertex, TestSegment>(subCoordinates);

        //     const originalFirstVertex = polyline.firstVertex;
        //     const originalLastVertex = polyline.lastVertex;

        //     const expectedMarkerNode1 = markerPolyline.firstVertex;
        //     const expectedMarkerActual1 = polyline.vertexNodesByVertex(expectedMarkerNode1.val)[0];
        //     const segPrevAtSplit1 = expectedMarkerActual1.prevSeg;
        //     const segNextAtSplit1 = expectedMarkerActual1.nextSeg;

        //     const expectedMarkerNode2 = markerPolyline.lastVertex;
        //     const expectedMarkerActual2 = polyline.vertexNodesByVertex(expectedMarkerNode2.val)[0];
        //     const segPrevAtSplit2 = expectedMarkerActual2.prevSeg;
        //     const segNextAtSplit2 = expectedMarkerActual2.nextSeg;

        //     const result = polyline.splitBy(markerPolyline);

        //     expect(result.length).toEqual(3);

        //     // Check expected nodes/values
        //     expect(result[0].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });
        //     expect(result[0].firstVertex).toEqual(originalFirstVertex);
        //     expect(result[0].lastSegment).toEqual(segPrevAtSplit1);
        //     expect(result[0].lastVertex.equals(expectedMarkerNode1.val)).toBeTruthy();

        //     expect(result[1].size()).toEqual({
        //       vertices: 3,
        //       segments: 2
        //     });
        //     expect(result[1].firstVertex.equals(expectedMarkerNode1.val)).toBeTruthy();
        //     expect(result[1].firstSegment).toEqual(segNextAtSplit1);
        //     expect(result[1].lastSegment).toEqual(segPrevAtSplit2);
        //     expect(result[1].lastVertex.equals(expectedMarkerNode2.val)).toBeTruthy();

        //     expect(result[2].size()).toEqual({
        //       vertices: 3,
        //       segments: 2
        //     });
        //     expect(result[2].firstVertex.equals(expectedMarkerNode2.val)).toBeTruthy();
        //     expect(result[2].firstSegment).toEqual(segNextAtSplit2);
        //     expect(result[2].lastVertex).toEqual(originalLastVertex);
        //   });
        // });
      });

      describe('#splitByMany', () => {
        describe('Vertices', () => {
          it('should return only the original polyline & do nothing if no vertices to split on are provided', () => {
            const originalSize = polyline.size();

            const markerVertices: VertexNode<TestVertex, TestSegment>[] = [];

            const result = polyline.splitByMany(markerVertices);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(polyline);

            const resultSize = polyline.size();
            expect(originalSize.vertices).toEqual(resultSize.vertices);
            expect(originalSize.segments).toEqual(resultSize.segments);
          });

          it('should skip splitting on vertices that are the same', () => {
            const markerVertices: TestVertex[] = [
              coordinates[2],
              coordinates[2],
            ];

            const result = polyline.splitByMany(markerVertices);

            expect(result.length).toEqual(2);

            expect(result[0].size()).toEqual({
              vertices: 3,
              segments: 2
            });

            expect(result[1].size()).toEqual({
              vertices: 4,
              segments: 3
            });
          });

          it('should return polylines split at each valid vertex', () => {
            const markerVertices: TestVertex[] = [
              coordinates[1],
              coordinates[3],
            ];

            const result = polyline.splitByMany(markerVertices);

            expect(result.length).toEqual(3);

            expect(result[0].size()).toEqual({
              vertices: 2,
              segments: 1
            });

            expect(result[1].size()).toEqual({
              vertices: 3,
              segments: 2
            });

            expect(result[2].size()).toEqual({
              vertices: 3,
              segments: 2
            });
          });
        });

        // TODO: Determine if Sub-Polyline splitting is even needed vs. just start/end nodes supplied to other methods
        // describe('SubPolylines', () => {
        //   it('should return only the original polyline & do nothing if no sub-polylines to split on are provided', () => {
        //     const originalSize = polyline.size();

        //     const markerPolylines: Polyline<TestVertex, TestSegment>[] = [];

        //     const result = polyline.splitByMany(markerPolylines);

        //     expect(result.length).toEqual(1);
        //     expect(result[0]).toEqual(polyline);

        //     const resultSize = polyline.size();
        //     expect(originalSize.vertices).toEqual(resultSize.vertices);
        //     expect(originalSize.segments).toEqual(resultSize.segments);
        //   });

        //   it('should skip splitting on sub-polylines that are the same', () => {
        //     const markerVertices: TestVertex[] = [
        //       coordinates[1],
        //       coordinates[2],
        //       coordinates[3],
        //     ];

        //     const markerPolylines: Polyline<TestVertex, TestSegment>[] = [
        //       new Polyline(markerVertices),
        //       new Polyline(markerVertices),
        //     ];

        //     const result = polyline.splitByMany(markerPolylines);

        //     expect(result.length).toEqual(3);

        //     expect(result[0].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });

        //     expect(result[1].size()).toEqual({
        //       vertices: 3,
        //       segments: 2
        //     });

        //     expect(result[2].size()).toEqual({
        //       vertices: 3,
        //       segments: 2
        //     });
        //   });

        //   it('should return polylines split at each valid sub-polyline', () => {
        //     const markerPolylines: Polyline<TestVertex, TestSegment>[] = [
        //       new Polyline([
        //         coordinates[1],
        //         coordinates[2],
        //         coordinates[3],
        //       ]),
        //       new Polyline([
        //         coordinates[4],
        //         coordinates[5],
        //       ]),
        //     ];

        //     const result = polyline.splitByMany(markerPolylines);

        //     expect(result.length).toEqual(4);

        //     expect(result[0].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });

        //     expect(result[1].size()).toEqual({
        //       vertices: 3,
        //       segments: 2
        //     });

        //     expect(result[2].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });

        //     expect(result[3].size()).toEqual({
        //       vertices: 2,
        //       segments: 1
        //     });
        //   });
        // });
      });
    });
  });
});
