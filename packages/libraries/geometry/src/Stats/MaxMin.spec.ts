import { NodeDouble } from '@markporterthomas/data-structures';

import { IVertexProperties, Vertex } from '../Polyline';
import { MaxMin } from './MaxMin';

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

describe('##MaxMin', () => {
  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);
    });

    it('should take an optional callback that filters what values are added/removed', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number > 4;

      const maxMin = new MaxMin(getProperty, isConsidered);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);
    });

    it('should take an optional tolerance that handles comparison cases', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number > 4;
      const tolerance = 0.1;

      const maxMin = new MaxMin(getProperty, isConsidered, tolerance);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);
    });
  });

  describe('#add', () => {
    it('should do nothing if no node is provided', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      maxMin.add(null);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);
    });

    it('should add the new min & see it reflected in object properties', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      const vertex1 = new TestVertex(1);
      const node1 = new NodeDouble<TestVertex>(vertex1);

      maxMin.add(node1);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);

      const vertex2 = new TestVertex(-1);
      const node2 = new NodeDouble<TestVertex>(vertex2);

      maxMin.add(node2);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);

      const vertex3 = new TestVertex(-2);
      const node3 = new NodeDouble<TestVertex>(vertex3);

      maxMin.add(node3);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-2);
      expect(maxMin.min.nodes.length).toEqual(1);
    });

    it('should add the new max & see it reflected in object properties', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      const vertex1 = new TestVertex(1);
      const node1 = new NodeDouble<TestVertex>(vertex1);

      maxMin.add(node1);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);

      const vertex2 = new TestVertex(2);
      const node2 = new NodeDouble<TestVertex>(vertex2);

      maxMin.add(node2);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);

      const vertex3 = new TestVertex(3);
      const node3 = new NodeDouble<TestVertex>(vertex3);

      maxMin.add(node3);

      expect(maxMin.max.value).toEqual(3);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);
    });

    it('should not add mid-range values', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      const vertexMin = new TestVertex(-1);
      const nodeMin = new NodeDouble<TestVertex>(vertexMin);
      maxMin.add(nodeMin);

      const vertexMax = new TestVertex(2);
      const nodeMax = new NodeDouble<TestVertex>(vertexMax);
      maxMin.add(nodeMax);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);

      const vertexMid = new TestVertex(1);
      const nodeMid = new NodeDouble<TestVertex>(vertexMid);
      maxMin.add(nodeMid);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);
    });

    it('should change the number of nodes associated with the max/min as values change, redundant values are added', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const maxMin = new MaxMin(getProperty);

      const vertex1 = new TestVertex(1);
      const node1 = new NodeDouble<TestVertex>(vertex1);
      maxMin.add(node1);

      const vertexMin = new TestVertex(-1);
      const nodeMin = new NodeDouble<TestVertex>(vertexMin);
      maxMin.add(nodeMin);

      const vertexMax = new TestVertex(2);
      const nodeMax = new NodeDouble<TestVertex>(vertexMax);
      maxMin.add(nodeMax);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);

      maxMin.add(nodeMin);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(2);

      maxMin.add(nodeMax);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(2);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(2);

      const vertexNewMax = new TestVertex(3);
      const nodeNewMax = new NodeDouble<TestVertex>(vertexNewMax);
      maxMin.add(nodeNewMax);

      expect(maxMin.max.value).toEqual(3);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(2);


      const vertexNewMin = new TestVertex(-2);
      const nodeNewMin = new NodeDouble<TestVertex>(vertexNewMin);
      maxMin.add(nodeNewMin);

      expect(maxMin.max.value).toEqual(3);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-2);
      expect(maxMin.min.nodes.length).toEqual(1);
    });

    it('should add max/min based on tolerance for equality comparison', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const tolerance = 0.1;
      const maxMin = new MaxMin(getProperty, null, tolerance);

      const vertexMin = new TestVertex(-1);
      const nodeMin = new NodeDouble<TestVertex>(vertexMin);
      maxMin.add(nodeMin);

      const vertexMax = new TestVertex(2);
      const nodeMax = new NodeDouble<TestVertex>(vertexMax);
      maxMin.add(nodeMax);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);

      // Add just outisde tolerance, under max/min, no effect
      const vertexOutTolUnderMax = new TestVertex(vertexMax.valNum - 1.1 * tolerance);
      const nodeOutTolUnderMax = new NodeDouble<TestVertex>(vertexOutTolUnderMax);
      maxMin.add(nodeOutTolUnderMax); // Consider +/- values...

      const vertexOutTolUnderMin = new TestVertex(vertexMin.valNum + 1.1 * tolerance);
      const nodeOutTolUnderMin = new NodeDouble<TestVertex>(vertexOutTolUnderMin);
      maxMin.add(nodeOutTolUnderMin);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(1);

      // Add just within tolerance, under max/min, no effect
      const vertexInTolUnderMax = new TestVertex(vertexMax.valNum - 0.9 * tolerance);
      const nodeInTolUnderMax = new NodeDouble<TestVertex>(vertexInTolUnderMax);
      maxMin.add(nodeInTolUnderMax); // Consider +/- values...

      const vertexInTolUnderMin = new TestVertex(vertexMin.valNum + 0.9 * tolerance);
      const nodeInTolUnderMin = new NodeDouble<TestVertex>(vertexInTolUnderMin);
      maxMin.add(nodeInTolUnderMin);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(2);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(2);

      // Add just within tolerance, over max/min, val unchanged, node added
      const vertexInTolOverMax = new TestVertex(vertexMax.valNum + 0.9 * tolerance);
      const nodeInTolOverMax = new NodeDouble<TestVertex>(vertexInTolOverMax);
      maxMin.add(nodeInTolOverMax);

      const vertexInTolOverMin = new TestVertex(vertexMin.valNum - 0.9 * tolerance);
      const nodeInTolOverMin = new NodeDouble<TestVertex>(vertexInTolOverMin);
      maxMin.add(nodeInTolOverMin);

      expect(maxMin.max.value).toEqual(2);
      expect(maxMin.max.nodes.length).toEqual(3);
      expect(maxMin.min.value).toEqual(-1);
      expect(maxMin.min.nodes.length).toEqual(3);

      // Add just over tolerance, over max/min, val & node changed
      const vertexOverTolOverMax = new TestVertex(vertexMax.valNum + 1.1 * tolerance);
      const nodeOverTolOverMax = new NodeDouble<TestVertex>(vertexOverTolOverMax);
      maxMin.add(nodeOverTolOverMax);

      const vertexOverTolOverMin = new TestVertex(vertexMin.valNum - 1.1 * tolerance);
      const nodeOverTolOverMin = new NodeDouble<TestVertex>(vertexOverTolOverMin);
      maxMin.add(nodeOverTolOverMin);

      expect(maxMin.max.value).toEqual(vertexMax.valNum + 1.1 * tolerance);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(vertexMin.valNum - 1.1 * tolerance);
      expect(maxMin.min.nodes.length).toEqual(1);
    });

    it('should not add the min if it is screened out by the initialized callback', () => {
      const getProperty = (val: TestVertex) => val.valNum;
      const isConsidered = (number: number) => number >= 1;
      const tolerance = 0.1;
      const maxMin = new MaxMin(getProperty, isConsidered, tolerance);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);

      const vertex = new TestVertex(0.5);
      const node = new NodeDouble<TestVertex>(vertex);

      maxMin.add(node);

      expect(maxMin.max.value).toEqual(0);
      expect(maxMin.max.nodes.length).toEqual(0);
      expect(maxMin.min.value).toEqual(0);
      expect(maxMin.min.nodes.length).toEqual(0);

      const vertex1 = new TestVertex(1);
      const node1 = new NodeDouble<TestVertex>(vertex1);

      maxMin.add(node1);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);

      maxMin.add(node);

      expect(maxMin.max.value).toEqual(1);
      expect(maxMin.max.nodes.length).toEqual(1);
      expect(maxMin.min.value).toEqual(1);
      expect(maxMin.min.nodes.length).toEqual(1);
    });
  });
});