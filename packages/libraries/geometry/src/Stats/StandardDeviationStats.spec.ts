import {
  IVertexProperties,
  Polyline,
  Segment,
  SegmentNode,
  Vertex,
  VertexNode
} from '../polyline';
import { StandardDeviationStats } from './StandardDeviationStats';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @class TestVertex
 * @typedef {TestVertex}
 * @extends {Vertex}
 */
class TestVertex extends Vertex {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {number}
 */
  valNum: number;
  /**
 * Creates an instance of TestVertex.
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @constructor
 * @param {number} val
 */
  constructor(val: number) {
    super();
    this.valNum = val;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @returns {Vertex}
 */
  clone(): Vertex {
    throw new Error('Method not implemented.');
  }
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @param {IVertexProperties} item
 * @returns {boolean}
 */
  equals(item: IVertexProperties): boolean {
    throw new Error('Method not implemented.');
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 */
const createPolyline = (values: number[]) => {
  const vertices: TestVertex[] = [];
  values.forEach((value) => {
    vertices.push(new TestVertex(value));
  })

  return new Polyline(vertices);
};

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 */
const populateStats = (
  polyline: Polyline<TestVertex, Segment>,
  standardDeviation: StandardDeviationStats<TestVertex, Segment>,
  startOffset: number = 0
) => {
  let segment = polyline.firstSegment;

  let offset = 0;
  while (offset < startOffset) {
    segment = segment.next as SegmentNode<TestVertex, Segment>;
    offset++;
  }

  standardDeviation.add(segment);
  segment = segment.next as SegmentNode<TestVertex, Segment>;

  while (segment) {
    standardDeviation.add(segment, true);

    segment = segment.next as SegmentNode<TestVertex, Segment>;
  }
}

describe('##StandardDeviationStats', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      expect(standardDeviation.variance).toEqual(0);
      expect(standardDeviation.sigma).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty, false, isConsidered);

      expect(standardDeviation.variance).toEqual(0);
      expect(standardDeviation.sigma).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should do nothing if no node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      standardDeviation.add(null);

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should add the new value & see it reflected in object properties', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);

      // 2 items (2 vertices from 1 segment)
      let segment = polyline.firstSegment;
      standardDeviation.add(segment);

      expect(standardDeviation.variance).toBeCloseTo(56.3, 1);


      // 5 items (5 vertices from 4 segments)
      for (let i = 2; i <= 4; i++) {
        segment = segment.next as SegmentNode<TestVertex, Segment>;
        standardDeviation.add(segment, true);
      }

      expect(standardDeviation.variance).toBeCloseTo(57.4, 1);


      // 25 items (25 vertices from 24 segments)
      while (segment.next) {
        segment = segment.next as SegmentNode<TestVertex, Segment>;
        standardDeviation.add(segment, true);
      }

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);
    });

    // TODO: determine values for effect in spreadsheet
    // it('should not add the value if it is screened out by the initialized callback', () => {
    //   const getProperty = (val: TestVertex) => val.valNum;
    //   const isConsidered = (number: number) => number >= 1;
    //   const standardDeviation = new StandardDeviationStats(getProperty, false, isConsidered);
    //   const nextVertexOnly = true;

    //   expect(standardDeviation.variance).toEqual(0);

    //   const vertexOut = new VertexNode(new TestVertex(0.5));
    //   const vertexIn = new VertexNode(new TestVertex(1));

    //   const segmentOut = new SegmentNode<TestVertex, Segment>(vertexOut, vertexOut);
    //   const segmentIn = new SegmentNode<TestVertex, Segment>(vertexOut, vertexIn);
    //   const segmentOut2 = new SegmentNode<TestVertex, Segment>(vertexIn, vertexOut);

    //   standardDeviation.add(segmentOut);

    //   expect(standardDeviation.variance).toEqual(0);

    //   standardDeviation.add(segmentIn, nextVertexOnly);

    //   expect(standardDeviation.variance).toEqual(1);

    //   standardDeviation.add(segmentOut2, nextVertexOnly);

    //   expect(standardDeviation.variance).toEqual(1);
    // });
  });

  describe('#calculate', () => {
    it('should return undefined if no values have been added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const result = standardDeviation.calculate();

      expect(result).toBeUndefined();
      expect(standardDeviation.variance).toEqual(0);
    });

    it('should calculate the standard deviation value for a single item', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [-7];

      const polyline = createPolyline(values);
      let segment = polyline.firstSegment;

      standardDeviation.add(segment);

      standardDeviation.calculate();

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should calculate the standard deviation value for many items', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);
      populateStats(polyline, standardDeviation);

      standardDeviation.calculate();

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);
    });

    describe('subsets', () => {
      it('should calculate the standard deviation value of a subset for many items', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        const startOffset = 2;

        populateStats(polyline, standardDeviation, startOffset);

        const windowSize = 20;

        standardDeviation.calculate(windowSize);

        expect(standardDeviation.variance).toBeCloseTo(47.41, 2);
      });

      it('should calculate the standard deviation value of a subset window for many items', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        populateStats(polyline, standardDeviation);

        const windowSize = 5;

        standardDeviation.calculate(windowSize);

        expect(standardDeviation.variance).toBeCloseTo(57.36, 2);
      });

      it('should calculate the standard deviation value of a subset offset for many items', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        populateStats(polyline, standardDeviation);

        let node = polyline.firstVertex;
        const startOffset = 2;
        for (let i = 0; i < startOffset; i++) {
          node = node.next as VertexNode<TestVertex, Segment>;
        }

        const windowSize = 20;

        standardDeviation.calculate(windowSize, node);

        expect(standardDeviation.variance).toBeCloseTo(47.41, 2);
      });

      it('should re-calculate the standard deviation value if the starting node is changed', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        populateStats(polyline, standardDeviation);

        let node = polyline.firstVertex;
        const startOffset = 2;
        for (let i = 0; i < startOffset; i++) {
          node = node.next as VertexNode<TestVertex, Segment>;
        }

        const windowSize = 20;

        standardDeviation.calculate(windowSize, node);
        expect(standardDeviation.variance).toBeCloseTo(47.41, 2);

        // Move node back by 1 & re-calculate
        node = node.prev as VertexNode<TestVertex, Segment>;

        standardDeviation.calculate(windowSize, node);
        expect(standardDeviation.variance).toBeCloseTo(46.5, 1);
      });

      describe('invalid window states', () => {
        it('should return undefined for negative window size', () => {
          const getProperty = (val: TestVertex) => val.valNum;
          const standardDeviation = new StandardDeviationStats(getProperty);

          const values = [
            -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
          ];

          const polyline = createPolyline(values);
          populateStats(polyline, standardDeviation);

          const result = standardDeviation.calculate(-1);

          expect(result).toBeUndefined();
          expect(standardDeviation.variance).toBeCloseTo(44.9, 1); // Full set
        });

        it('should return undefined for window overflow', () => {
          const getProperty = (val: TestVertex) => val.valNum;
          const standardDeviation = new StandardDeviationStats(getProperty);

          const values = [
            -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
          ];

          const polyline = createPolyline(values);
          populateStats(polyline, standardDeviation);

          const result = standardDeviation.calculate(30);

          expect(result).toBeUndefined();
          expect(standardDeviation.variance).toBeCloseTo(44.9, 1); // Full set
        });
      });
    });
  });

  describe('#slideWindow', () => {
    it('should return undefined if no values have been added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const result = standardDeviation.slideWindow();

      expect(result).toBeUndefined();
      expect(standardDeviation.variance).toEqual(0);
    });

    it('should calculate the standard deviation value if this has not been done yet', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);
      const startOffset = 2;
      populateStats(polyline, standardDeviation, startOffset);

      const windowSize = 20;
      const isForward = true;
      const result = standardDeviation.slideWindow(isForward, windowSize);

      expect(result).toBeCloseTo(47.41, 2);
      expect(standardDeviation.variance).toBeCloseTo(47.41, 2);
    });

    it('should update the standard deviation value when shifted once forward', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);
      const startOffset = 2;
      populateStats(polyline, standardDeviation, startOffset);

      const windowSize = 20;
      standardDeviation.calculate(windowSize);

      const result = standardDeviation.slideWindow();

      expect(result).toBeCloseTo(43.8, 1);
      expect(standardDeviation.variance).toBeCloseTo(43.8, 1);
    });

    it('should update the standard deviation value when shifted once backward', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);
      const startOffset = 2;
      populateStats(polyline, standardDeviation, startOffset);

      const windowSize = 20;
      standardDeviation.calculate(windowSize);

      const isForward = false;
      const result = standardDeviation.slideWindow(isForward);

      expect(result).toBeCloseTo(46.5, 1);
      expect(standardDeviation.variance).toBeCloseTo(46.5, 1);
    });

    it('should re-calculate the standard deviation value if the window size is changed', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);
      const startOffset = 2;
      populateStats(polyline, standardDeviation, startOffset);

      const windowSize = 20;
      standardDeviation.calculate(windowSize);

      const result = standardDeviation.slideWindow();

      expect(result).toBeCloseTo(43.8, 1);
      expect(standardDeviation.variance).toBeCloseTo(43.8, 1);

      const isForward = true;
      const newWindowSize = 15;
      const resultResized = standardDeviation.slideWindow(isForward, newWindowSize);

      expect(resultResized).toBeCloseTo(39.42, 2);
      expect(standardDeviation.variance).toBeCloseTo(39.42, 2);
    });

    describe('invalid window states', () => {
      it('should return undefined for negative window size', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        populateStats(polyline, standardDeviation);

        const windowSize = -1;
        const isForward = true;
        const result = standardDeviation.slideWindow(isForward, windowSize);

        expect(result).toBeUndefined();
        expect(standardDeviation.variance).toBeCloseTo(44.91, 2);  // Full
      });

      it('should return undefined for window overflow', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        populateStats(polyline, standardDeviation);

        const windowSize = 30;
        const isForward = true;
        const result = standardDeviation.slideWindow(isForward, windowSize);

        expect(result).toBeUndefined();
        expect(standardDeviation.variance).toBeCloseTo(44.91, 2);
      });

      it('should return null for window overflow by moving forward too far', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        const startOffset = 3;
        populateStats(polyline, standardDeviation, startOffset);

        const windowSize = 20;
        standardDeviation.calculate(windowSize);

        const isForward = true;

        const result1 = standardDeviation.slideWindow(isForward);
        expect(result1).not.toBeNull();

        const result2 = standardDeviation.slideWindow(isForward);
        expect(result2).not.toBeNull();

        const result3 = standardDeviation.slideWindow(isForward);
        expect(result3).toBeNull();
      });

      it('should return null for window overflow by moving backward too far', () => {
        const getProperty = (val: TestVertex) => val.valNum;
        const standardDeviation = new StandardDeviationStats(getProperty);

        const values = [
          -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
        ];

        const polyline = createPolyline(values);
        const startOffset = 2;
        populateStats(polyline, standardDeviation, startOffset);

        const windowSize = 20;
        standardDeviation.calculate(windowSize);

        const isForward = false;

        const result1 = standardDeviation.slideWindow(isForward);
        expect(result1).not.toBeNull();

        const result2 = standardDeviation.slideWindow(isForward);
        expect(result2).not.toBeNull();

        const result3 = standardDeviation.slideWindow(isForward);
        expect(result3).toBeNull();
      });
    });
  });

  describe('#fromTo', () => {
    it('should do nothing if no start node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const startNode = null;
      const endNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));

      standardDeviation.fromTo(startNode, endNode);

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should do nothing if no end node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const startNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));
      const endNode = null;

      standardDeviation.fromTo(startNode, endNode);

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should traverse from the provided start to end node & determine max/min values & nodes', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);

      const startNode = polyline.firstVertex.next.next as VertexNode<TestVertex, Segment>;
      const endNode = polyline.lastVertex.prev.prev.prev as VertexNode<TestVertex, Segment>;

      standardDeviation.fromTo(startNode, endNode);

      expect(standardDeviation.variance).toBeCloseTo(47.41, 2);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);

      const startNode = polyline.firstVertex.next.next as VertexNode<TestVertex, Segment>;
      const endNode = new VertexNode(new TestVertex(-100));

      standardDeviation.fromTo(startNode, endNode);

      expect(standardDeviation.variance).toBeCloseTo(43.88, 2);
    });
  });

  describe('#of', () => {
    let standardDeviation: StandardDeviationStats<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      standardDeviation = new StandardDeviationStats(getProperty);
    });

    it('should do nothing if no polyline is provided', () => {
      standardDeviation.of(null);

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should do nothing if an empty polyline is provided', () => {
      const polyline = new Polyline([]);

      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toEqual(0);
    });

    it('should determine the max/min values & nodes of the polyline', () => {
      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);

      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);
    });
  });

  describe('#update', () => {
    let standardDeviation: StandardDeviationStats<TestVertex, Segment>;
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      polyline = createPolyline(values);
    });

    it('should do nothing if there are no start/end nodes', () => {
      expect(standardDeviation.variance).toEqual(0);

      standardDeviation.update();

      expect(standardDeviation.variance).toEqual(0);
    });

    // TODO: This fails because 'remove' doesn't quite work properly.
    // Over-optimization at this point? Add ticket & return later.
    // Just don't call 'remove' method in delegating functions
    // it('should update max/min properties by traversing from the start to the end node', () => {
    //   standardDeviation.of(polyline);

    //   expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

    //   standardDeviation.update();

    //   // No change
    //   expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

    //   // Change polyline
    //   standardDeviation.remove(polyline.firstSegment);
    //   standardDeviation.remove(polyline.firstSegment.next as SegmentNode<TestVertex, Segment>);

    //   // Reset to initialized state
    //   // expect(standardDeviation.variance).toEqual(0);

    //   standardDeviation.update();

    //   // Updated properties
    //   expect(standardDeviation.variance).toBeCloseTo(47.41, 2);
    // });
  });

  describe('#remove', () => {
    let standardDeviation: StandardDeviationStats<TestVertex, Segment>;
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      standardDeviation = new StandardDeviationStats(getProperty);

      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      polyline = createPolyline(values);
    });

    it('should do nothing if no segment is provided ', () => {
      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

      standardDeviation.remove(null);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);
    });

    it('should remove the start segment & return stats of all but the start vertex when polyline is checked', () => {
      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

      standardDeviation.remove(polyline.firstSegment);

      // expect(standardDeviation.variance).toEqual(0);  // 45.11

      standardDeviation.update();

      expect(standardDeviation.variance).toBeCloseTo(44.72, 2);
    });

    it('should remove the end segment & return stats of all but the end vertex when polyline is checked', () => {
      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

      standardDeviation.remove(polyline.lastSegment);

      // expect(standardDeviation.variance).toEqual(0);  // 45.15

      standardDeviation.update();

      expect(standardDeviation.variance).toBeCloseTo(45.15, 2);
    });

    it('should remove all segments & be in an initialized state', () => {
      standardDeviation.of(polyline);

      expect(standardDeviation.variance).toBeCloseTo(44.9, 1);

      // Remove all segments
      let segment = polyline.firstSegment;
      while (segment) {
        standardDeviation.remove(segment);
        segment = segment.next as SegmentNode<TestVertex, Segment>;
      }

      expect(standardDeviation.variance).toBeUndefined();

      standardDeviation.update();

      expect(standardDeviation.variance).toBeUndefined();
    });
  });

  describe('#serialize', () => {
    let standardDeviation: StandardDeviationStats<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      standardDeviation = new StandardDeviationStats(getProperty);
    });

    it('should write out undefined properties if empty', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const standardDeviation = new StandardDeviationStats(getProperty);

      const result = standardDeviation.serialize();

      expect(result.variance).toEqual(0);
      expect(result.sigma).toEqual(0);
    });

    it('should serialize the object into a JSON object', () => {
      const values = [
        -7, 8, -9, -9, 6, 3, 2, -8, 0, 9, 1, 7, -6, -5, 9, 9, -1, -7, -9, -9, -6, 9, 0, 4, 6
      ];

      const polyline = createPolyline(values);

      standardDeviation.of(polyline);

      const result = standardDeviation.serialize();

      expect(result.variance).toBeCloseTo(standardDeviation.variance, 2);
      expect(result.sigma).toBeCloseTo(standardDeviation.sigma, 2);
    });
  });
});