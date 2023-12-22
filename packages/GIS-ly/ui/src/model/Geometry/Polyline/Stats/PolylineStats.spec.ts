import { Polyline, SegmentNode, VertexNode } from '../Polyline';
import { Segment } from '../Segment';
import { Vertex, IVertexProperties } from '../Vertex';
import { PolylineStats } from './PolylineStats';

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

describe('##PoylineStats', () => {
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
    it('should initialize a new object from vertices', () => {
      const firstVertex = new VertexNode(new TestVertex(1));
      const lastVertex = new VertexNode(new TestVertex(2));

      const stats = PolylineStats.fromVertices(firstVertex, lastVertex);

      expect(stats.isDirty()).toBeTruthy();
    });

    it('should initialize a new object from a polyline', () => {
      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      const stats = PolylineStats.fromPolyline(polyline);

      expect(stats.isDirty()).toBeTruthy();
    });
  });

  describe('#setDirty', () => {
    it('should set object to dirty if initialized with vertices', () => {
      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const firstVertex = new VertexNode(vertices[0]);
      const lastVertex = new VertexNode(vertices[vertices.length - 1]);

      const stats = PolylineStats.fromVertices(firstVertex, lastVertex);

      expect(stats.isDirty()).toBeTruthy();

      stats.addStats();

      expect(stats.isDirty()).toBeFalsy();

      stats.setDirty();

      expect(stats.isDirty()).toBeTruthy();
    });

    it('do nothing if initialized with polyline', () => {
      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      const stats = PolylineStats.fromPolyline(polyline);

      expect(stats.isDirty()).toBeTruthy();

      stats.addStats();

      expect(stats.isDirty()).toBeFalsy();

      stats.setDirty();

      expect(stats.isDirty()).toBeFalsy();
    });
  });

  describe('#addStats', () => {
    describe('with first/last vertices', () => {
      let firstVertex: VertexNode<TestVertex, Segment>;
      let lastVertex: VertexNode<TestVertex, Segment>;

      beforeEach(() => {
        const vertices: TestVertex[] = [
          new TestVertex(1),
          new TestVertex(2),
          new TestVertex(3),
          new TestVertex(4),
        ];

        firstVertex = new VertexNode(vertices[0]);
        lastVertex = new VertexNode(vertices[vertices.length - 1]);
      });

      it('should do nothing for a stats object with no first vertex', () => {
        const stats = PolylineStats.fromVertices(null, lastVertex);

        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(-1);

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeTruthy();
      });

      it('should explicitly add stats & reset dirty flag', () => {
        const stats = PolylineStats.fromVertices(firstVertex, lastVertex);

        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(-1);

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeFalsy();
      });
    });

    describe('with Polyline', () => {
      let polyline: Polyline<TestVertex, Segment>;

      beforeEach(() => {
        const vertices: TestVertex[] = [
          new TestVertex(1),
          new TestVertex(2),
          new TestVertex(3),
          new TestVertex(4),
        ];

        polyline = new Polyline<TestVertex, Segment>(vertices);
      });

      it('should do nothing for a stats object with no polyline', () => {
        const stats = PolylineStats.fromPolyline(null);

        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.hasPolyline()).toBeFalsy();

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeTruthy();
        expect(stats.polylineVersion).toEqual(-1);
      });

      it('should explicitly add stats & reset dirty flag', () => {
        const stats = PolylineStats.fromPolyline(polyline);

        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.hasPolyline()).toBeTruthy();

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(0);
      });
    });
  });

  describe('#stats property', () => {
    let polyline: Polyline<TestVertex, Segment>;
    let firstVertex: VertexNode<TestVertex, Segment>;
    let lastVertex: VertexNode<TestVertex, Segment>;

    beforeEach(() => {
      const vertices: TestVertex[] = [
        new TestVertex(1),
        new TestVertex(2),
        new TestVertex(3),
        new TestVertex(4),
      ];

      polyline = new Polyline<TestVertex, Segment>(vertices);

      const lengths = [1, 2, 3];
      addSegmentLengths(lengths, polyline);

      firstVertex = polyline.firstVertex;
      lastVertex = polyline.lastVertex;
    });

    describe('with first/last vertices', () => {
      const remove2ndVertex = () => {
        const vertexRemove = polyline.firstVertex.next as VertexNode<TestVertex, Segment>;
        polyline.removeAt(vertexRemove);
        const lengths = [1, 3];
        addSegmentLengths(lengths, polyline);
      }

      it('should do nothing & return undefined for a stats object with no first vertex', () => {
        const stats = PolylineStats.fromVertices(null, lastVertex);

        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(-1);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeTruthy();

        expect(result).toBeUndefined();
      });

      it('should lazy load stats & reset dirty flag', () => {
        const stats = PolylineStats.fromVertices(firstVertex, lastVertex);

        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(-1);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

        expect(result).toEqual({
          length: 6
        });
      });

      it('should skip nodes not meeting callback criteria provided', () => {
        const isLengthConsidered = (length: number) => length > 1;
        const stats = PolylineStats.fromVertices(
          firstVertex,
          lastVertex,
          { isLengthConsidered }
        );

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

        expect(result).toEqual({
          length: 5
        });
      });

      it('should return updated stats when middle vertex is changed & stats reset to dirty', () => {
        const stats = PolylineStats.fromVertices(firstVertex, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

        expect(result).toEqual({
          length: 6
        });

        // Nodes between start/end are changed here
        remove2ndVertex();

        const resultModifed = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

        expect(resultModifed).toEqual({
          length: 6
        });

        stats.setDirty();

        expect(stats.isDirty()).toBeTruthy();

        const resultModifedSetDirty = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

        expect(resultModifedSetDirty).toEqual({
          length: 4
        });
      });
    });

    describe('with polyline', () => {
      it('should do nothing & return undefined for a stats object with no polyline', () => {
        const stats = PolylineStats.fromPolyline(null);

        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeTruthy();
        expect(stats.polylineVersion).toEqual(-1);

        expect(result).toBeUndefined();
      });

      it('should lazy load stats, sync polyline versions & reset dirty flag', () => {
        const stats = PolylineStats.fromPolyline(polyline);

        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.hasPolyline()).toBeTruthy();
        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(0);

        expect(result).toEqual({
          length: 6
        });
      });

      describe('Updating Stats After Polyline Modification', () => {
        let polyline: Polyline<TestVertex, Segment>;

        beforeEach(() => {
          const vertices: TestVertex[] = [
            new TestVertex(1),
            new TestVertex(2),
            new TestVertex(3),
            new TestVertex(4),
            new TestVertex(5),
          ];

          polyline = new Polyline<TestVertex, Segment>(vertices);

          const lengths = [1, 2, 3, 4];
          addSegmentLengths(lengths, polyline);
        });

        describe('Remove Vertices', () => {
          const removeFirstVertex = () => {
            polyline.trimBefore(polyline.firstVertex.next as VertexNode<TestVertex, Segment>);
            const lengths = [2, 3, 4];
            addSegmentLengths(lengths, polyline);
          }

          const removeLastVertex = () => {
            polyline.trimAfter(polyline.lastVertex.prev as VertexNode<TestVertex, Segment>);
            const lengths = [1, 2, 3];
            addSegmentLengths(lengths, polyline);
          }

          const remove2ndVertex = () => {
            const vertexRemove = polyline.firstVertex.next as VertexNode<TestVertex, Segment>;
            polyline.removeAt(vertexRemove);
            const lengths = [1, 3, 4];
            addSegmentLengths(lengths, polyline);
          }

          it('should return updated stats & sync polyline versions when start vertex is removed', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(0);

            // Modify polyine
            removeFirstVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(1);

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(1);
            expect(polyline.version).toEqual(1);

            expect(resultModifed).toEqual({
              length: 9
            });
          });

          it('should return updated stats & sync polyline versions when end vertex is removed', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });
            expect(stats.polylineVersion).toEqual(0);

            // Modify polyine
            removeLastVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(1);

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(1);
            expect(polyline.version).toEqual(1);

            expect(resultModifed).toEqual({
              length: 6
            });
          });

          it('should return updated stats & sync polyline versions when middle vertex is removed', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });
            expect(stats.polylineVersion).toEqual(0);

            // Modify polyine
            remove2ndVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(1);

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(1);
            expect(polyline.version).toEqual(1);

            expect(resultModifed).toEqual({
              length: 8
            });
          });
        });

        describe('Add Vertices', () => {
          const insertFirstVertex = () => {
            const insertedVertex = new TestVertex(10);
            polyline.prepend(insertedVertex);

            const lengths = [5, 1, 2, 3, 4];
            addSegmentLengths(lengths, polyline);
          }

          const insertLastVertex = () => {
            const insertedVertex = new TestVertex(10);
            polyline.append(insertedVertex);

            const lengths = [1, 2, 3, 4, 5];
            addSegmentLengths(lengths, polyline);
          }

          const insertVertex = () => {
            const vertexAfter = polyline.firstVertex.next as VertexNode<TestVertex, Segment>;
            const insertedVertex = new TestVertex(10);
            polyline.insertAfter(vertexAfter, insertedVertex);

            const lengths = [1, 3, 4, 3, 4];
            addSegmentLengths(lengths, polyline);
          }

          it('should return updated stats & sync polyline versions when start vertex is inserted', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });
            expect(stats.polylineVersion).toEqual(0);

            // Modify polyine
            insertFirstVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(3);    // 1

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(3);
            expect(polyline.version).toEqual(3);  // 1

            expect(resultModifed).toEqual({
              length: 15
            });
          });

          it('should return updated stats & sync polyline versions when end vertex is inserted', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });
            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(0);

            // Modify polyine
            insertLastVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(3); // 1

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(3);
            expect(polyline.version).toEqual(3); // 1

            expect(resultModifed).toEqual({
              length: 15
            });
          });

          it('should return updated stats & sync polyline versions when middle vertex is inserted', () => {
            const stats = PolylineStats.fromPolyline(polyline);

            expect(stats.hasPolyline()).toBeTruthy();

            expect(stats.polylineVersion).toEqual(-1);
            expect(polyline.version).toEqual(0);

            const result = stats.stats;
            expect(result).toEqual({
              length: 10
            });

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(0);

            // Modify polyine
            insertVertex();

            expect(stats.polylineVersion).toEqual(0);
            expect(polyline.version).toEqual(4); // 1

            const resultModifed = stats.stats;

            expect(stats.polylineVersion).toEqual(4);
            expect(polyline.version).toEqual(4); // 1

            expect(resultModifed).toEqual({
              length: 15
            });
          });
        });
      });
    });
  });
});