import { SegmentNode, VertexNode } from '@MPT/geometry';

import { PolylineRoute } from '../PolylineRoute';
import { RoutePoint } from '../RoutePoint';
import { RouteSegment } from '../RouteSegment';
import { SlopeStats } from './SlopeStats';

describe('##SlopeStats', () => {
  const longMultiplier = 0.0005;
  const length = 55.7;

  const createSegments = (heights: number[]) => {
    const segmentNodes: SegmentNode<RoutePoint, RouteSegment>[] = [];

    if (heights.length) {
      const angle = 0;
      const lat = 0;
      let long = 0;

      let vertexI = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, long));
      vertexI.val.elevation = 0;
      let vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long * longMultiplier));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];

      let segment = new RouteSegment(length, angle, null, heights[0]);
      let segmentNode = new SegmentNode<RoutePoint, RouteSegment>(
        vertexI,
        vertexJ,
        segment
      );
      segmentNode.prevVert = vertexI;
      segmentNode.nextVert = vertexJ;

      segmentNodes.push(segmentNode);

      for (let i = 1; i < heights.length; i++) {
        vertexI = vertexJ;
        vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long * longMultiplier));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];
        segment = new RouteSegment(length, angle, null, heights[i]);

        const segmentNode = new SegmentNode<RoutePoint, RouteSegment>(
          vertexI,
          vertexJ,
          segment
        );
        segmentNode.prevVert = vertexI;
        segmentNode.nextVert = vertexJ;

        segmentNodes.push(segmentNode);
      }
    }

    return segmentNodes;
  }

  const createRoute = (heights: number[]) => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;

    if (heights.length) {
      let long = 0;
      const lat = 0;

      let vertexI = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, long));
      vertexI.val.elevation = 0;

      let vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long * longMultiplier));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];

      route = new PolylineRoute([vertexI, vertexJ]);

      for (let i = 1; i < heights.length; i++) {
        vertexI = vertexJ;
        vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long * longMultiplier));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];

        route.append(vertexJ);
      }
    } else {
      route = new PolylineRoute([]);
    }

    route.addElevationProperties();

    return route;
  };

  const heights = [1.7, -2.8, -0.6, 5, 0.6, -8.3, -3.9];

  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const slopeStats = new SlopeStats();

      expect(slopeStats.uphill.max.value).toBeCloseTo(0);
      expect(slopeStats.uphill.avg).toBeCloseTo(0);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0);
      expect(slopeStats.downhill.avg).toBeCloseTo(0);
      expect(slopeStats.avg).toBeCloseTo(0);
    });

    it('should take an optional callback that filters what height values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const slopeStats = new SlopeStats(isConsidered);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0);
      expect(slopeStats.uphill.avg).toBeCloseTo(0);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0);
      expect(slopeStats.downhill.avg).toBeCloseTo(0);
      expect(slopeStats.avg).toBeCloseTo(0);
    });
  });

  describe('#add', () => {
    let segments: SegmentNode<RoutePoint, RouteSegment>[];
    beforeEach(() => {
      segments = createSegments(heights);
    });

    it('should add the slope property', () => {
      const slopeStats = new SlopeStats();

      slopeStats.add(segments[0]); // 1.7

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.03, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.03, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0.03, 2);

      slopeStats.add(segments[1]); // -2.8

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.03, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.03, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.05, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.05, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.01, 2);

      slopeStats.add(segments[2]); // -0.6

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.03, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.03, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.05, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.03, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.01, 2);

      slopeStats.add(segments[3]); // 5

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.06, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.05, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.03, 2);
      expect(slopeStats.avg).toBeCloseTo(0.01, 2);

      slopeStats.add(segments[4]); // 0.6

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.04, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.05, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.03, 2);
      expect(slopeStats.avg).toBeCloseTo(0.01, 2);

      slopeStats.add(segments[5]);  // -8.3

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.04, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.01, 2);

      slopeStats.add(segments[6]);   // -3.9

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.04, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.02, 2);
    });

    it('should not add the the slope property if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => Math.abs(number) > 0.5;
      const slopeStats = new SlopeStats(isConsidered);

      slopeStats.add(segments[0]); // 1

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.03, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.03, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0.03, 2);

      slopeStats.add(segments[1]); // -3

      // Add updated results


      slopeStats.add(segments[2]); // 0.5

      // Add updated results


      slopeStats.add(segments[3]); // -0.5

      // Add updated results


      slopeStats.add(segments[4]); // 6

      // Add updated results


      slopeStats.add(segments[5]);  // -7

      // Add updated results


      slopeStats.add(segments[6]);   // -4

      // Add updated results

    });
  });

  describe('#fromTo', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    beforeEach(() => {
      route = createRoute(heights);
    });

    it('should do nothing if no start node is provided', () => {

      const slopeStats = new SlopeStats();

      const startNode = null;
      const endNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(5, 6));

      slopeStats.fromTo(startNode, endNode);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if no end node is provided', () => {
      const slopeStats = new SlopeStats();

      const startNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(5, 6));
      const endNode = null;

      slopeStats.fromTo(startNode, endNode);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0, 2);
    });

    it('should traverse from the provided start to end node & determine the slope properties', () => {
      const slopeStats = new SlopeStats();

      const startNode = route.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
      const endNode = route.lastVertex.prev as VertexNode<RoutePoint, RouteSegment>;

      slopeStats.fromTo(startNode, endNode);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.05, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.02, 2);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const slopeStats = new SlopeStats();

      const startNode = route.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
      const endNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1, 2));

      slopeStats.fromTo(startNode, endNode);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.05, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.03, 2);
    });
  });

  describe('#of', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    let slopeStats: SlopeStats;

    beforeEach(() => {
      slopeStats = new SlopeStats();
      route = createRoute(heights);
    });

    it('should do nothing if no route is provided', () => {
      slopeStats.of(null);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if an empty route is provided', () => {
      const route = new PolylineRoute([]);

      slopeStats.of(route);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(0, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(0, 2);
      expect(slopeStats.avg).toBeCloseTo(0, 2);
    });

    it('should determine the slope properties of the route', () => {
      const slopeStats = new SlopeStats();

      slopeStats.of(route);

      expect(slopeStats.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(slopeStats.uphill.avg).toBeCloseTo(0.04, 2);
      expect(slopeStats.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(slopeStats.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(slopeStats.avg).toBeCloseTo(-0.02, 2);
    });
  });

  // describe('#remove', () => {
  //   let route: PolylineRoute<RoutePoint, RouteSegment>;

  //   beforeEach(() => {
  //     route = createRoute(heights);
  //   });

  //   it('should remove the value', () => {
  //     const slopeStats = new SlopeStats();
  //     slopeStats.of(route);

  //     expect(slopeStats.avg).toBeCloseTo(3.5);
  //     expect(slopeStats.uphill).toEqual(-8.5);
  //     expect(slopeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(slopeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(slopeStats.net).toEqual(-4 - elevationInitial);

  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);

  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);
  //   });

  //   it('should remove any value, even if not added', () => {

  //     const slopeStats = new SlopeStats();
  //     slopeStats.of(route);

  //     expect(slopeStats.avg).toBeCloseTo(3.5);
  //     expect(slopeStats.uphill).toEqual(-8.5);
  //     expect(slopeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(slopeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(slopeStats.net).toEqual(-4 - elevationInitial);

  //     slopeStats.remove(createSegment(1.5));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);
  //   });

  //   it('should not remove the value if the current value count is 0', () => {
  //     const slopeStats = new SlopeStats();
  //     slopeStats.of(route);

  //     expect(slopeStats.avg).toBeCloseTo(3.5);
  //     expect(slopeStats.uphill).toEqual(-8.5);
  //     expect(slopeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(slopeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(slopeStats.net).toEqual(-4 - elevationInitial);

  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);

  //     // Note: There can be remaining values once count is at 0, since any value can be removed
  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);

  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);
  //   });

  //   it('should not remove the value if it is screened out by the initialized callback', () => {
  //     const isConsidered = (number: number) => Math.abs(number) > 0.5;
  //     const slopeStats = new SlopeStats(isConsidered);
  //     slopeStats.of(route);

  //     expect(slopeStats.avg).toBeCloseTo(3.5);
  //     expect(slopeStats.uphill).toEqual(-8.5);
  //     expect(slopeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(slopeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(slopeStats.net).toEqual(-4 - elevationInitial);

  //     slopeStats.remove(createSegment(1));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);

  //     slopeStats.remove(createSegment(5));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);

  //     slopeStats.remove(createSegment(6));
  //     expect(slopeStats.avg).toBeCloseTo(0);
  //     expect(slopeStats.uphill).toEqual(0);
  //     expect(slopeStats.downhill).toEqual(0);
  //     expect(slopeStats.min.value).toEqual(0);
  //     expect(slopeStats.net).toEqual(0);
  //   });
  // });

  describe('#serialize', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    let slopeStats: SlopeStats;

    beforeEach(() => {
      slopeStats = new SlopeStats();
      route = createRoute(heights);
    });

    it('should write out empty properties if empty', () => {
      const slopeStats = new SlopeStats();

      const result = slopeStats.serialize();

      expect(result.uphill.max.value).toBeCloseTo(0, 2);
      expect(result.uphill.avg).toBeCloseTo(0, 2);
      expect(result.downhill.min.value).toBeCloseTo(0, 2);
      expect(result.downhill.avg).toBeCloseTo(0, 2);
      expect(result.avg).toBeCloseTo(0, 2);
    });

    it('should serialize the object into a JSON object', () => {
      slopeStats.of(route);

      const result = slopeStats.serialize();

      expect(result.uphill.max.value).toBeCloseTo(0.09, 2);
      expect(result.uphill.avg).toBeCloseTo(0.04, 2);
      expect(result.downhill.min.value).toBeCloseTo(-0.15, 2);
      expect(result.downhill.avg).toBeCloseTo(-0.07, 2);
      expect(result.avg).toBeCloseTo(-0.02, 2);
    });
  });
});