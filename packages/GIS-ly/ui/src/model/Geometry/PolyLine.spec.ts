import { CoordinateNode, EvaluatorArgs, IPolylineSize, Polyline } from "./Polyline";
import { Segment } from "./Segment";
import { IVertexProperties, Vertex } from "./Vertex";

type TestVertex = [number, number] & Vertex;

class TestVertexNode extends Vertex {
  clone(): Vertex {
    throw new Error("Method not implemented.");
  }
  equals(item: IVertexProperties): boolean {
    throw new Error("Method not implemented.");
  }
}

describe('##PolyLine', () => {
  let coordinates: TestVertex[];
  beforeEach(() => {
    coordinates = [
      [45, -110] as TestVertex,
      [60, -109] as TestVertex,
      [47, -108] as TestVertex,
    ];
  });

  describe('Creation', () => {
    describe('#constructor', () => {
      it(`should initialize an object of coordinates linked with segments,
        each represented in separate yet connected linked lists`, () => {
        const polyline = new Polyline(coordinates);

        const expectedSize: IPolylineSize = {
          vertices: 3,
          segments: 2
        };

        expect(polyline.size()).toEqual(expectedSize);
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
        expect(segments[1].angle).toBeUndefined();
      });
    });
  });

  describe('Accessing Items', () => {
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      polyline = new Polyline(coordinates);
    });

    describe('#getNodes', () => {
      it('should return an empty array for no matches', () => {
        const nodes = polyline.getNodes(
          -1,
          (target: number, coord: CoordinateNode<TestVertex, Segment>) => coord.val[0] <= target
        );

        expect(nodes.length).toEqual(0);
      });

      it('should return all nodes that match the numerical target', () => {
        const nodes = polyline.getNodes(
          50,
          (target: number, coord: CoordinateNode<TestVertex, Segment>) => coord.val[0] <= target
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[0].val).toEqual([45, -110]);
        expect(nodes[1].val).toEqual([47, -108]);
      });

      it('should return all nodes that match all of the Evaluator Args targets', () => {
        const nodes = polyline.getNodes(
          {
            firstItem: 50,
            secondItem: -109
          },
          (target: EvaluatorArgs,
            coord: CoordinateNode<TestVertex, Segment>) =>
            coord.val[0] > parseInt(target.firstItem.toString())
            || coord.val[1] <= parseInt(target.secondItem.toString())
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[0].val).toEqual([45, -110]);
        expect(nodes[1].val).toEqual([60, -109]);
      });
    });
  });

  describe('Manipulating Polyline', () => {
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      polyline = new Polyline(coordinates);
    });

    describe('#removeNodes', () => {
      it('should do nothing for nodes provided that are not in the track and return a count of 0', () => {
        const node1 = new CoordinateNode<TestVertex, Segment>([90, -208] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([95, -208] as TestVertex);

        const nodes = polyline.removeNodes([node1, node2]);

        expect(nodes).toEqual(0);

        const polylineLength = polyline.size();
        expect(polylineLength.vertices).toEqual(coordinates.length);
        expect(polylineLength.segments).toEqual(coordinates.length - 1);
      });

      it('should remove the nodes provided and return a count for the number removed', () => {
        const node1 = new CoordinateNode<TestVertex, Segment>(coordinates[1]);
        const node2 = new CoordinateNode<TestVertex, Segment>(coordinates[2]);

        const nodes = polyline.removeNodes([node1, node2]);

        expect(nodes).toEqual(2);

        const polylineLength = polyline.size();
        expect(polylineLength.vertices).toEqual(coordinates.length - 2);
        expect(polylineLength.segments).toEqual(coordinates.length - 2 - 1);
      });

      it('should remove the nodes provided, ignoring ones that are not found in the track and return a count for the number removed', () => {
        const node1 = new CoordinateNode<TestVertex, Segment>(coordinates[1]);
        const node2 = new CoordinateNode<TestVertex, Segment>([95, -208] as TestVertex);

        const nodes = polyline.removeNodes([node1, node2]);

        expect(nodes).toEqual(1);

        const polylineLength = polyline.size();
        expect(polylineLength.vertices).toEqual(coordinates.length - 1);
        expect(polylineLength.segments).toEqual(coordinates.length - 1 - 1);
      });
    });

    describe('#insertNodesBefore', () => {
      // TODO: Test
    });

    describe('#insertNodesAfter', () => {
      // TODO: Test
    });

    describe('#replaceNodesBetween', () => {
      beforeEach(() => {
        coordinates = [
          [45, -110] as TestVertex,
          [60, -109] as TestVertex,
          [47, -108] as TestVertex,
          [49, -110] as TestVertex,
          [57, -101] as TestVertex,
          [53, -107] as TestVertex,
        ];
      });

      const getNodeAtCount = (node: CoordinateNode<TestVertex, Segment>, count: number) => {
        while (node) {
          node = node.next as CoordinateNode<TestVertex, Segment>;
          count--;
        }

        return node;
      };

      const getTailNode = (node: CoordinateNode<TestVertex, Segment>) => {
        let tempNode: CoordinateNode<TestVertex, Segment>;
        while (node) {
          tempNode = node;
          node = node.next as CoordinateNode<TestVertex, Segment>;
        }

        return tempNode;
      }

      it('should do nothing if the head & tail nodes are both unspecified', () => {
        const initialLength = polyline.size();

        const startNode = null;
        const endNode = null;

        const node1 = new CoordinateNode<TestVertex, Segment>([99, 140] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([666, 69] as TestVertex);
        const node3 = new CoordinateNode<TestVertex, Segment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(0);
        expect(polyline.size()).toEqual(initialLength);
      });

      it('should only remove nodes in the start/end range if no nodes are provided to insert and return 0', () => {
        const startNode = new CoordinateNode<TestVertex, Segment>(coordinates[0]);
        const endNode = new CoordinateNode<TestVertex, Segment>(coordinates[3]);

        const initialLength = polyline.size();

        const result = polyline.replaceNodesBetween(startNode, endNode, []);

        expect(result).toEqual(2);
        expect(polyline.size().vertices).toEqual(initialLength.vertices - 2);
        expect(polyline.size().segments).toEqual(initialLength.segments - 2);
      });

      it(`should insert the nodes at the head of track and return the number of nodes inserted
        if only a tail node is provided and tail node is at the head of the track, `, () => {
        const initialLength = polyline.size();
        const initialHead = polyline.firstPoint;

        // Use current tail node - by value to also test matching
        const startNode = null;
        const endNode = new CoordinateNode<TestVertex, Segment>(coordinates[0]);

        const node1 = new CoordinateNode<TestVertex, Segment>([99, 140] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([666, 69] as TestVertex);
        const node3 = new CoordinateNode<TestVertex, Segment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polyline.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polyline.size().segments).toEqual(initialLength.segments + result);
        expect(polyline.firstPoint.equals(node1.val)).toBeTruthy();

        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).toEqual(polyline.firstPoint);
        expect(node1.prev).toBeNull();
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialHead);
        expect(initialHead.prev).toEqual(node3);
      });

      it(`should insert the nodes at the tail of track and return the number of nodes inserted
        if only a head node is provided and head node is at the tail of the track`, () => {
        const initialLength = polyline.size();
        const initialHead = polyline.firstPoint;
        const initialTail = getTailNode(initialHead);

        // Use current last node - by value to also test matching
        const startNode = new CoordinateNode<TestVertex, Segment>(coordinates[coordinates.length - 1]);
        const endNode = null;

        const node1 = new CoordinateNode<TestVertex, Segment>([99, 140] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([666, 69] as TestVertex);
        const node3 = new CoordinateNode<TestVertex, Segment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polyline.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polyline.size().segments).toEqual(initialLength.segments + result);
        expect(polyline.firstPoint.equals(initialHead.val)).toBeTruthy();

        expect(node1.prev.val).toEqual(startNode.val);

        expect(node1).not.toEqual(polyline.firstPoint);
        expect(node1).toEqual(initialTail.next);
        expect(node1.prev).toEqual(initialTail);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toBeNull();
      });

      it(`should insert the nodes between the two specified tail/head nodes in the track
        and return the number of nodes inserted when the head/tail nodes are adjacent`, () => {
        const initialLength = polyline.size();
        const initialHead = polyline.firstPoint.next as CoordinateNode<TestVertex, Segment>;
        const initialTail = initialHead.next as CoordinateNode<TestVertex, Segment>;

        // Insert after first segment, over second segment
        const startNode = new CoordinateNode<TestVertex, Segment>(coordinates[1]);
        const endNode = new CoordinateNode<TestVertex, Segment>(coordinates[2]);

        const node1 = new CoordinateNode<TestVertex, Segment>([99, 140] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([666, 69] as TestVertex);
        const node3 = new CoordinateNode<TestVertex, Segment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polyline.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polyline.size().segments).toEqual(initialLength.segments + result);

        expect(node1.prev.val).toEqual(startNode.val);
        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).not.toEqual(polyline.firstPoint);
        expect(node1).toEqual(initialHead.next);
        expect(node1.prev).toEqual(initialHead);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialTail);
        expect(initialTail.prev).toEqual(node3);
      });

      it(`should insert the nodes between the two specified tail/head nodes in the track,
        remove the original set of nodes between these same two points,
        and return the number of nodes inserted+removed when the head/tail nodes are not adjacent`, () => {
        const initialLength = polyline.size();
        const initialHead = polyline.firstPoint.next as CoordinateNode<TestVertex, Segment>;
        const initialTail = initialHead?.next?.next?.next as CoordinateNode<TestVertex, Segment>;

        // Insert after first segment, over second segment
        const startNode = new CoordinateNode<TestVertex, Segment>(coordinates[1]);
        const endNode = new CoordinateNode<TestVertex, Segment>(coordinates[4]);

        const node1 = new CoordinateNode<TestVertex, Segment>([99, 140] as TestVertex);
        const node2 = new CoordinateNode<TestVertex, Segment>([666, 69] as TestVertex);
        const node3 = new CoordinateNode<TestVertex, Segment>([420, 171] as TestVertex);
        const nodes = [node1, node2, node3];

        const result = polyline.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(5); // 3 inserted, 2 removed
        expect(polyline.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
        expect(polyline.size().segments).toEqual(initialLength.segments + 1);
        expect(node1.prev.val).toEqual(startNode.val);
        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).not.toEqual(polyline.firstPoint);
        expect(node1).toEqual(initialHead.next);
        expect(node1.prev).toEqual(initialHead);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialTail);
        expect(initialTail.prev).toEqual(node3);
      });
    });

    describe('#replaceNodesFromTo', () => {
      // TODO: Test
    });

    describe('#splitAtNode', () => {
      it('should ', () => {
        // TODO: Test
      });
    });
  });
});
