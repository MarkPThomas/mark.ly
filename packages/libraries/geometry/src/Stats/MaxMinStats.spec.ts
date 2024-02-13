import {
  IVertexProperties,
  Polyline,
  Segment,
  SegmentNode,
  Vertex,
  VertexNode
} from '../Polyline';
import { MaxMinStats } from './MaxMinStats';

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

describe('##MaxMinStats', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number > 4;

      const maxMin = new MaxMinStats(getProperty, false, isConsidered);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should take an optional tolerance that handles comparison cases', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number > 4;
      const tolerance = 0.1;

      const maxMin = new MaxMinStats(getProperty, false, isConsidered, tolerance);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });
  });

  describe('#add', () => {
    let vertexStart: VertexNode<TestVertex, Segment>;
    let vertexMin1: VertexNode<TestVertex, Segment>;
    let vertexMin2: VertexNode<TestVertex, Segment>;
    let vertexMax1: VertexNode<TestVertex, Segment>;
    let vertexMax2: VertexNode<TestVertex, Segment>;

    beforeEach(() => {
      vertexStart = new VertexNode(new TestVertex(1));

      vertexMin1 = new VertexNode(new TestVertex(-1));
      vertexMin2 = new VertexNode(new TestVertex(-2));

      vertexMax1 = new VertexNode(new TestVertex(2));
      vertexMax2 = new VertexNode(new TestVertex(3));
    });

    it('should do nothing if no node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      maxMin.add(null);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should add the new min & see it reflected in object properties', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      const segment1 = new SegmentNode<TestVertex, Segment>(vertexStart, vertexMin1);
      const segment2 = new SegmentNode<TestVertex, Segment>(vertexMin1, vertexMin2);

      maxMin.add(segment1);

      expect(maxMin.range.max.value).toEqual(1);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.add(segment2);

      expect(maxMin.range.max.value).toEqual(1);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-2);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should add the new max & see it reflected in object properties', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      const segment1 = new SegmentNode<TestVertex, Segment>(vertexStart, vertexMax1);
      const segment2 = new SegmentNode<TestVertex, Segment>(vertexMax1, vertexMax2);

      maxMin.add(segment1);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.add(segment2);

      expect(maxMin.range.max.value).toEqual(3);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(1);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should not add mid-range values', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);
      const nextVertexOnly = true;

      const vertexMid = new VertexNode(new TestVertex(1));

      const segment1 = new SegmentNode<TestVertex, Segment>(vertexMin1, vertexMax1);
      const segmentMid = new SegmentNode<TestVertex, Segment>(vertexMax1, vertexMid);

      maxMin.add(segment1);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);
      maxMin.add(segmentMid, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should change the number of nodes associated with the max/min as values change, redundant values are added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);
      const nextVertexOnly = true;

      const segmentMin1 = new SegmentNode<TestVertex, Segment>(vertexStart, vertexMin1);
      const segmentMax1 = new SegmentNode<TestVertex, Segment>(vertexMin1, vertexMax1);
      const segmentMin2 = new SegmentNode<TestVertex, Segment>(vertexMax1, vertexMin1);
      const segmentMax2 = new SegmentNode<TestVertex, Segment>(vertexMin1, vertexMax1);
      const segmentNewMax = new SegmentNode<TestVertex, Segment>(vertexMax1, vertexMax2);
      const segmentNewMin = new SegmentNode<TestVertex, Segment>(vertexMax2, vertexMin2);

      maxMin.add(segmentMin1);
      maxMin.add(segmentMax1, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.add(segmentMin2, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(2);

      maxMin.add(segmentMax2, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(2);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(2);

      maxMin.add(segmentNewMax, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(3);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(2);

      maxMin.add(segmentNewMin, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(3);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-2);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should add max/min based on tolerance for equality comparison', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, null, tolerance);
      const nextVertexOnly = true;

      const vertexOutTolUnderMax = new VertexNode(new TestVertex(vertexMax1.val.valNum - 1.1 * tolerance));
      const vertexOutTolUnderMin = new VertexNode(new TestVertex(vertexMin1.val.valNum + 1.1 * tolerance));
      const vertexInTolUnderMax = new VertexNode(new TestVertex(vertexMax1.val.valNum - 0.9 * tolerance));
      const vertexInTolUnderMin = new VertexNode(new TestVertex(vertexMin1.val.valNum + 0.9 * tolerance));
      const vertexInTolOverMax = new VertexNode(new TestVertex(vertexMax1.val.valNum + 0.9 * tolerance));
      const vertexInTolOverMin = new VertexNode(new TestVertex(vertexMin1.val.valNum - 0.9 * tolerance));
      const vertexOverTolOverMax = new VertexNode(new TestVertex(vertexMax1.val.valNum + 1.1 * tolerance));
      const vertexOverTolOverMin = new VertexNode(new TestVertex(vertexMin1.val.valNum - 1.1 * tolerance));

      const segmentMin = new SegmentNode<TestVertex, Segment>(vertexStart, vertexMin1);
      const segmentMax = new SegmentNode<TestVertex, Segment>(vertexMin1, vertexMax1);
      const segmentOutTolUnderMax = new SegmentNode<TestVertex, Segment>(vertexMax1, vertexOutTolUnderMax);
      const segmentOutTolUnderMin = new SegmentNode<TestVertex, Segment>(vertexOutTolUnderMax, vertexOutTolUnderMin);
      const segmentInTolUnderMax = new SegmentNode<TestVertex, Segment>(vertexOutTolUnderMin, vertexInTolUnderMax);
      const segmentInTolUnderMin = new SegmentNode<TestVertex, Segment>(vertexInTolUnderMax, vertexInTolUnderMin);
      const segmentInTolOverMax = new SegmentNode<TestVertex, Segment>(vertexInTolUnderMin, vertexInTolOverMax);
      const segmentInTolOverMin = new SegmentNode<TestVertex, Segment>(vertexInTolOverMax, vertexInTolOverMin);
      const segmentOverTolOverMax = new SegmentNode<TestVertex, Segment>(vertexInTolOverMin, vertexOverTolOverMax);
      const segmentOverTolOverMin = new SegmentNode<TestVertex, Segment>(vertexOverTolOverMax, vertexOverTolOverMin);

      maxMin.add(segmentMin);
      maxMin.add(segmentMax, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      // Add just outisde tolerance, under max/min, no effect
      maxMin.add(segmentOutTolUnderMax, nextVertexOnly); // Consider +/- values...
      maxMin.add(segmentOutTolUnderMin, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      // Add just within tolerance, under max/min, no effect
      maxMin.add(segmentInTolUnderMax, nextVertexOnly); // Consider +/- values...
      maxMin.add(segmentInTolUnderMin, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(2);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(2);

      // Add just within tolerance, over max/min, val unchanged, node added
      maxMin.add(segmentInTolOverMax, nextVertexOnly);
      maxMin.add(segmentInTolOverMin, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(2);
      expect(maxMin.range.max.nodes.length).toEqual(3);
      expect(maxMin.range.min.value).toEqual(-1);
      expect(maxMin.range.min.nodes.length).toEqual(3);

      // Add just over tolerance, over max/min, val & node changed
      maxMin.add(segmentOverTolOverMax, nextVertexOnly);
      maxMin.add(segmentOverTolOverMin, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(vertexMax1.val.valNum + 1.1 * tolerance);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin1.val.valNum - 1.1 * tolerance);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should not add the min if it is screened out by the initialized callback', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number >= 1;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, isConsidered, tolerance);
      const nextVertexOnly = true;

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      const vertexOut = new VertexNode(new TestVertex(0.5));
      const vertexIn = new VertexNode(new TestVertex(1));

      const segmentOut = new SegmentNode<TestVertex, Segment>(vertexOut, vertexOut);
      const segmentIn = new SegmentNode<TestVertex, Segment>(vertexOut, vertexIn);
      const segmentOut2 = new SegmentNode<TestVertex, Segment>(vertexIn, vertexOut);

      maxMin.add(segmentOut);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.add(segmentIn, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(1);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(1);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.add(segmentOut2, nextVertexOnly);

      expect(maxMin.range.max.value).toEqual(1);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(1);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });
  });

  describe('#fromTo', () => {
    it('should do nothing if no start node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      const startNode = null;
      const endNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));

      maxMin.fromTo(startNode, endNode);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should do nothing if no end node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      const startNode = new VertexNode<TestVertex, Segment>(new TestVertex(5));
      const endNode = null;

      maxMin.fromTo(startNode, endNode);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should traverse from the provided start to end node & determine max/min values & nodes', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      const vertexStart = new TestVertex(1);
      const vertexMin1 = new TestVertex(-1);
      const vertexMin2 = new TestVertex(-2);
      const vertexMax1 = new TestVertex(2);
      const vertexMax2 = new TestVertex(3);
      const vertexOutTolUnderMax = new TestVertex(vertexMax1.valNum - 1.1 * tolerance);
      const vertexOutTolUnderMin = new TestVertex(vertexMin1.valNum + 1.1 * tolerance);
      const vertexInTolUnderMax = new TestVertex(vertexMax1.valNum - 0.9 * tolerance);
      const vertexInTolUnderMin = new TestVertex(vertexMin1.valNum + 0.9 * tolerance);
      const vertexInTolOverMax = new TestVertex(vertexMax1.valNum + 0.9 * tolerance);
      const vertexInTolOverMin = new TestVertex(vertexMin1.valNum - 0.9 * tolerance);
      const vertexOverTolOverMax = new TestVertex(vertexMax1.valNum + 1.1 * tolerance);
      const vertexOverTolOverMin = new TestVertex(vertexMin1.valNum - 1.1 * tolerance);

      const vertices: TestVertex[] = [
        vertexStart,
        vertexMin1,
        vertexMax1,
        vertexMax2,
        vertexOutTolUnderMax,
        vertexOutTolUnderMax,
        vertexOutTolUnderMin,
        vertexInTolUnderMax,
        vertexInTolUnderMin,
        vertexInTolOverMax,
        vertexInTolOverMin,
        vertexInTolOverMin,
        vertexOverTolOverMax,
        vertexOverTolOverMin,
        vertexMin2
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);
      const startNode = polyline.firstVertex;
      const endNode = polyline.lastVertex.prev as VertexNode<TestVertex, Segment>;

      maxMin.fromTo(startNode, endNode);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin1.valNum - 1.1 * tolerance);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      const vertexStart = new TestVertex(1);
      const vertexMin1 = new TestVertex(-1);
      const vertexMin2 = new TestVertex(-2);
      const vertexMax1 = new TestVertex(2);
      const vertexMax2 = new TestVertex(3);
      const vertexOutTolUnderMax = new TestVertex(vertexMax1.valNum - 1.1 * tolerance);
      const vertexOutTolUnderMin = new TestVertex(vertexMin1.valNum + 1.1 * tolerance);
      const vertexInTolUnderMax = new TestVertex(vertexMax1.valNum - 0.9 * tolerance);
      const vertexInTolUnderMin = new TestVertex(vertexMin1.valNum + 0.9 * tolerance);
      const vertexInTolOverMax = new TestVertex(vertexMax1.valNum + 0.9 * tolerance);
      const vertexInTolOverMin = new TestVertex(vertexMin1.valNum - 0.9 * tolerance);
      const vertexOverTolOverMax = new TestVertex(vertexMax1.valNum + 1.1 * tolerance);
      const vertexOverTolOverMin = new TestVertex(vertexMin1.valNum - 1.1 * tolerance);

      const vertices: TestVertex[] = [
        vertexStart,
        vertexMin1,
        vertexMax1,
        vertexMax2,
        vertexOutTolUnderMax,
        vertexOutTolUnderMax,
        vertexOutTolUnderMin,
        vertexInTolUnderMax,
        vertexInTolUnderMin,
        vertexInTolOverMax,
        vertexInTolOverMin,
        vertexInTolOverMin,
        vertexOverTolOverMax,
        vertexOverTolOverMin,
        vertexMin2
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      const startNode = polyline.firstVertex;
      const endNode = new VertexNode(new TestVertex(-100));

      maxMin.fromTo(startNode, endNode);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });
  });

  describe('#of', () => {
    let maxMin: MaxMinStats<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      maxMin = new MaxMinStats(getProperty);
    });

    it('should do nothing if no polyline is provided', () => {
      maxMin.of(null);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should do nothing if an empty polyline is provided', () => {
      const polyline = new Polyline([]);

      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should determine the max/min values & nodes of the polyline', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      const vertexStart = new TestVertex(1);
      const vertexMin1 = new TestVertex(-1);
      const vertexMin2 = new TestVertex(-2);
      const vertexMax1 = new TestVertex(2);
      const vertexMax2 = new TestVertex(3);
      const vertexOutTolUnderMax = new TestVertex(vertexMax1.valNum - 1.1 * tolerance);
      const vertexOutTolUnderMin = new TestVertex(vertexMin1.valNum + 1.1 * tolerance);
      const vertexInTolUnderMax = new TestVertex(vertexMax1.valNum - 0.9 * tolerance);
      const vertexInTolUnderMin = new TestVertex(vertexMin1.valNum + 0.9 * tolerance);
      const vertexInTolOverMax = new TestVertex(vertexMax1.valNum + 0.9 * tolerance);
      const vertexInTolOverMin = new TestVertex(vertexMin1.valNum - 0.9 * tolerance);
      const vertexOverTolOverMax = new TestVertex(vertexMax1.valNum + 1.1 * tolerance);
      const vertexOverTolOverMin = new TestVertex(vertexMin1.valNum - 1.1 * tolerance);

      const vertices: TestVertex[] = [
        vertexStart,
        vertexMin1,
        vertexMax1,
        vertexMax2,
        vertexOutTolUnderMax,
        vertexOutTolUnderMax,
        vertexOutTolUnderMin,
        vertexInTolUnderMax,
        vertexInTolUnderMin,
        vertexInTolOverMax,
        vertexInTolOverMin,
        vertexInTolOverMin,
        vertexOverTolOverMax,
        vertexOverTolOverMin,
        vertexMin2,
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });
  });

  describe('#update', () => {
    let vertexMin1: TestVertex;
    let vertexMin2: TestVertex;
    let vertexMax1: TestVertex;
    let vertexMax2: TestVertex;

    let maxMin: MaxMinStats<TestVertex, Segment>;
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      vertexMin1 = new TestVertex(-1);
      vertexMin2 = new TestVertex(-2);
      vertexMax1 = new TestVertex(2);
      vertexMax2 = new TestVertex(3);

      const vertices: TestVertex[] = [
        vertexMax2,
        vertexMin1,
        vertexMax1,
        vertexMin2,
      ];

      polyline = new Polyline<TestVertex, Segment>(vertices);
    });

    it('should do nothing if there are no start/end nodes', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });

    it('should update max/min properties by traversing from the start to the end node', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.update();

      // No change
      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(polyline.firstSegment);

      // Reset to initialized state
      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      // Updated properties
      expect(maxMin.range.max.value).toEqual(vertexMax1.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });
  });

  describe('#remove', () => {
    let vertexMin1: TestVertex;
    let vertexMin2: TestVertex;
    let vertexMax1: TestVertex;
    let vertexMax2: TestVertex;

    let maxMin: MaxMinStats<TestVertex, Segment>;
    let polyline: Polyline<TestVertex, Segment>;

    beforeEach(() => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      vertexMin1 = new TestVertex(-1);
      vertexMin2 = new TestVertex(-2);
      vertexMax1 = new TestVertex(2);
      vertexMax2 = new TestVertex(3);

      const vertices: TestVertex[] = [
        vertexMax2,
        vertexMin1,
        vertexMax1,
        vertexMin2,
      ];

      polyline = new Polyline<TestVertex, Segment>(vertices);
    });

    it('should do nothing if no segment is provided ', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(null);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should do nothing & return stats of all vertices vertex when polyline is checked if the segment provided has no vertex in the polyline', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(
        new SegmentNode(
          new VertexNode(new TestVertex(100)),
          new VertexNode(new TestVertex(200))
        )
      );

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should remove the start segment & return stats of all but the start vertex when polyline is checked', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(polyline.firstSegment);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      expect(maxMin.range.max.value).toEqual(vertexMax1.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should remove the end segment & return stats of all but the end vertex when polyline is checked', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(polyline.lastSegment);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin1.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);
    });

    it('should remove the last segment & be in an initialized state', () => {
      maxMin.of(polyline);

      expect(maxMin.range.max.value).toEqual(vertexMax2.valNum);
      expect(maxMin.range.max.nodes.length).toEqual(1);
      expect(maxMin.range.min.value).toEqual(vertexMin2.valNum);
      expect(maxMin.range.min.nodes.length).toEqual(1);

      maxMin.remove(polyline.firstSegment);
      maxMin.remove(polyline.firstSegment.next as SegmentNode<TestVertex, Segment>);
      maxMin.remove(polyline.lastSegment);

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);

      maxMin.update();

      expect(maxMin.range.max.value).toEqual(0);
      expect(maxMin.range.max.nodes.length).toEqual(0);
      expect(maxMin.range.min.value).toEqual(0);
      expect(maxMin.range.min.nodes.length).toEqual(0);
    });
  });

  describe('#serialize', () => {
    it('should write out undefined properties if empty', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMinStats(getProperty);

      const result = maxMin.serialize();

      expect(result).toEqual(MaxMinStats.empty());
    });

    it('should serialize the object into a JSON object', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMinStats(getProperty, false, null, tolerance);

      const vertexStart = new TestVertex(1);
      const vertexMin1 = new TestVertex(-1);
      const vertexMin2 = new TestVertex(-2);
      const vertexMax1 = new TestVertex(2);
      const vertexMax2 = new TestVertex(3);
      const vertexOutTolUnderMax = new TestVertex(vertexMax1.valNum - 1.1 * tolerance);
      const vertexOutTolUnderMin = new TestVertex(vertexMin1.valNum + 1.1 * tolerance);
      const vertexInTolUnderMax = new TestVertex(vertexMax1.valNum - 0.9 * tolerance);
      const vertexInTolUnderMin = new TestVertex(vertexMin1.valNum + 0.9 * tolerance);
      const vertexInTolOverMax = new TestVertex(vertexMax1.valNum + 0.9 * tolerance);
      const vertexInTolOverMin = new TestVertex(vertexMin1.valNum - 0.9 * tolerance);
      const vertexOverTolOverMax = new TestVertex(vertexMax1.valNum + 1.1 * tolerance);
      const vertexOverTolOverMin = new TestVertex(vertexMin1.valNum - 1.1 * tolerance);

      const vertices: TestVertex[] = [
        vertexStart,
        vertexMin1,
        vertexMax1,
        vertexMax2,
        vertexOutTolUnderMax,
        vertexOutTolUnderMax,
        vertexOutTolUnderMin,
        vertexInTolUnderMax,
        vertexInTolUnderMin,
        vertexInTolOverMax,
        vertexInTolOverMin,
        vertexInTolOverMin,
        vertexOverTolOverMax,
        vertexOverTolOverMin,
        vertexMin2,
      ];

      const polyline = new Polyline<TestVertex, Segment>(vertices);

      maxMin.of(polyline);

      const result = maxMin.serialize();

      expect(result.max.value).toEqual(maxMin.range.max.value);
      expect(result.max.nodes.length).toEqual(maxMin.range.max.nodes.length);
      expect(result.min.value).toEqual(maxMin.range.min.value);
      expect(result.min.nodes.length).toEqual(maxMin.range.min.nodes.length);
    });
  });
});