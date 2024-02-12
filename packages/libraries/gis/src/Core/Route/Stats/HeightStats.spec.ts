import { SegmentNode, VertexNode } from '@MPT/geometry';

import { PolylineRoute } from '../PolylineRoute';
import { RoutePoint } from '../RoutePoint';
import { RouteSegment } from '../RouteSegment';
import { HeightStats } from './HeightStats';

describe('##HeightStats', () => {

  const createSegments = (heights: number[]) => {
    const segmentNodes: SegmentNode<RoutePoint, RouteSegment>[] = [];

    if (heights.length) {
      const angle = 0;
      const lat = 0;
      let long = 0;

      let vertexI = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, long));
      vertexI.val.elevation = elevationInitial;
      let vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];

      let segment = new RouteSegment(lat, angle, null, heights[0]);
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
        vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];
        segment = new RouteSegment(lat, angle, null, heights[i]);

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
      const lat = 0;
      let long = 0;

      let vertexI = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, long));
      vertexI.val.elevation = elevationInitial;
      let vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];
      route = new PolylineRoute([vertexI, vertexJ]);

      for (let i = 1; i < heights.length; i++) {
        vertexI = vertexJ;
        vertexJ = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(lat, ++long));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];

        route.append(vertexJ);
      }
    } else {
      route = new PolylineRoute([]);
    }

    route.addElevationProperties();

    return route;
  };

  const elevationInitial = 0.5;
  const heights = [1, -3, -0.5, 6, 0.5, -7, -4];

  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const heightStats = new HeightStats();

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });

    it('should take an optional callback that filters what height values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const heightStats = new HeightStats(isConsidered);

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });
  });

  describe('#add', () => {
    let segments: SegmentNode<RoutePoint, RouteSegment>[];
    beforeEach(() => {
      segments = createSegments(heights);
    });

    it('should add the height property', () => {
      const heightStats = new HeightStats();

      heightStats.add(segments[0]); // 1

      expect(heightStats.gain).toEqual(1);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.net).toEqual(1);
      expect(heightStats.max.value).toEqual(1.5);
      expect(heightStats.min.value).toEqual(0.5);

      heightStats.add(segments[1]); // -3

      expect(heightStats.gain).toEqual(1);
      expect(heightStats.loss).toEqual(-3);
      expect(heightStats.net).toEqual(-2);
      expect(heightStats.max.value).toEqual(1.5);
      expect(heightStats.min.value).toEqual(-1.5);

      heightStats.add(segments[2]); // -0.5

      expect(heightStats.gain).toEqual(1);
      expect(heightStats.loss).toEqual(-3.5);
      expect(heightStats.net).toEqual(-2.5);
      expect(heightStats.max.value).toEqual(1.5);
      expect(heightStats.min.value).toEqual(-2);

      heightStats.add(segments[3]); //6

      expect(heightStats.gain).toEqual(7);
      expect(heightStats.loss).toEqual(-3.5);
      expect(heightStats.net).toEqual(3.5);
      expect(heightStats.max.value).toEqual(4);
      expect(heightStats.min.value).toEqual(-2);

      heightStats.add(segments[4]); // 0.5

      expect(heightStats.gain).toEqual(7.5);
      expect(heightStats.loss).toEqual(-3.5);
      expect(heightStats.net).toEqual(4);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-2);

      heightStats.add(segments[5]);  // -7

      expect(heightStats.gain).toEqual(7.5);
      expect(heightStats.loss).toEqual(-10.5);
      expect(heightStats.net).toEqual(-3);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-2.5);

      heightStats.add(segments[6]);   // -4

      expect(heightStats.gain).toEqual(7.5);
      expect(heightStats.loss).toEqual(-14.5);
      expect(heightStats.net).toEqual(-7);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-6.5);
    });

    it('should not add the the height property if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => Math.abs(number) > 0.5;
      const heightStats = new HeightStats(isConsidered);

      heightStats.add(segments[0]); // 1

      // expect(heightStats.gain).toEqual(1);
      // expect(heightStats.loss).toEqual(0);
      // expect(heightStats.net).toEqual(1);
      // // expect(heightStats.max.value).toEqual(1.5);
      // // expect(heightStats.min.value).toEqual(0.5);

      // heightStats.add(segments[1]); // -3

      // expect(heightStats.gain).toEqual(1);
      // expect(heightStats.loss).toEqual(-3);
      // expect(heightStats.net).toEqual(-2);
      // // expect(heightStats.max.value).toEqual(1.5);
      // // expect(heightStats.min.value).toEqual(-1.5);

      // heightStats.add(segments[2]); // -0.5

      // expect(heightStats.gain).toEqual(1);
      // expect(heightStats.loss).toEqual(-3);
      // expect(heightStats.net).toEqual(-2);
      // // expect(heightStats.max.value).toEqual(1.5);
      // // expect(heightStats.min.value).toEqual(-1.5);

      // heightStats.add(segments[3]); // 6

      // expect(heightStats.gain).toEqual(7);
      // expect(heightStats.loss).toEqual(-3);
      // expect(heightStats.net).toEqual(4);
      // // expect(heightStats.max.value).toEqual(1.5);
      // // expect(heightStats.min.value).toEqual(-1.5);

      // heightStats.add(segments[4]); // 0.5

      // expect(heightStats.gain).toEqual(7);
      // expect(heightStats.loss).toEqual(-3);
      // expect(heightStats.net).toEqual(4);
      // // expect(heightStats.max.value).toEqual(4.5);
      // // expect(heightStats.min.value).toEqual(-1.5);

      // heightStats.add(segments[5]);  // -7

      // expect(heightStats.gain).toEqual(7);
      // expect(heightStats.loss).toEqual(-10);
      // expect(heightStats.net).toEqual(-3);
      // // expect(heightStats.max.value).toEqual(4.5);
      // // expect(heightStats.min.value).toEqual(-2.5);

      // heightStats.add(segments[6]);   // -4

      // expect(heightStats.gain).toEqual(7);
      // expect(heightStats.loss).toEqual(-14);
      // expect(heightStats.net).toEqual(-7);
      // // expect(heightStats.max.value).toEqual(4.5);
      // // expect(heightStats.min.value).toEqual(-6.5);
    });
  });

  describe('#fromTo', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    beforeEach(() => {
      route = createRoute(heights);
    });

    it('should do nothing if no start node is provided', () => {

      const heightStats = new HeightStats();

      const startNode = null;
      const endNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(5, 6));

      heightStats.fromTo(startNode, endNode);

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });

    it('should do nothing if no end node is provided', () => {
      const heightStats = new HeightStats();

      const startNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(5, 6));
      const endNode = null;

      heightStats.fromTo(startNode, endNode);

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });

    it('should traverse from the provided start to end node & determine the height properties', () => {
      const heightStats = new HeightStats();

      const startNode = route.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
      const endNode = route.lastVertex.prev as VertexNode<RoutePoint, RouteSegment>;

      heightStats.fromTo(startNode, endNode);

      expect(heightStats.gain).toEqual(6.5);
      expect(heightStats.loss).toEqual(-10.5);
      expect(heightStats.net).toEqual(-4);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-2.5);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const heightStats = new HeightStats();

      const startNode = route.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
      const endNode = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1, 2));

      heightStats.fromTo(startNode, endNode);

      expect(heightStats.gain).toEqual(6.5);
      expect(heightStats.loss).toEqual(-14.5);
      expect(heightStats.net).toEqual(-8);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-6.5);
    });
  });

  describe('#of', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    let heightStats: HeightStats;

    beforeEach(() => {
      heightStats = new HeightStats();
      route = createRoute(heights);
    });

    it('should do nothing if no route is provided', () => {
      heightStats.of(null);

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });

    it('should do nothing if an empty route is provided', () => {
      const route = new PolylineRoute([]);

      heightStats.of(route);

      expect(heightStats.gain).toEqual(0);
      expect(heightStats.loss).toEqual(0);
      expect(heightStats.max.value).toEqual(0);
      expect(heightStats.min.value).toEqual(0);
      expect(heightStats.net).toEqual(0);
    });

    it('should determine the height properties of the route', () => {
      const heightStats = new HeightStats();

      heightStats.of(route);

      expect(heightStats.gain).toEqual(7.5);
      expect(heightStats.loss).toEqual(-14.5);
      expect(heightStats.net).toEqual(-7);
      expect(heightStats.max.value).toEqual(4.5);
      expect(heightStats.min.value).toEqual(-6.5);
    });
  });

  // describe('#remove', () => {
  //   let route: PolylineRoute<RoutePoint, RouteSegment>;

  //   beforeEach(() => {
  //     route = createRoute(heights);
  //   });

  //   it('should remove the value', () => {
  //     const heightStats = new HeightStats();
  //     heightStats.of(route);

  //     expect(heightStats.gain).toEqual(3.5);
  //     expect(heightStats.loss).toEqual(-8.5);
  //     expect(heightStats.max.value).toEqual(elevationInitial + 2);
  //     expect(heightStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightStats.net).toEqual(-4 - elevationInitial);

  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);

  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);
  //     expect(heightStats.net).toEqual(0);
  //   });

  //   it('should remove any value, even if not added', () => {

  //     const heightStats = new HeightStats();
  //     heightStats.of(route);

  //     expect(heightStats.gain).toEqual(3.5);
  //     expect(heightStats.loss).toEqual(-8.5);
  //     expect(heightStats.max.value).toEqual(elevationInitial + 2);
  //     expect(heightStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightStats.net).toEqual(-4 - elevationInitial);

  //     heightStats.remove(createSegment(1.5));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);
  //   });

  //   it('should not remove the value if the current value count is 0', () => {
  //     const heightStats = new HeightStats();
  //     heightStats.of(route);

  //     expect(heightStats.gain).toEqual(3.5);
  //     expect(heightStats.loss).toEqual(-8.5);
  //     expect(heightStats.max.value).toEqual(elevationInitial + 2);
  //     expect(heightStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightStats.net).toEqual(-4 - elevationInitial);

  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);

  //     // Note: There can be remaining values once count is at 0, since any value can be removed
  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);

  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);
  //   });

  //   it('should not remove the value if it is screened out by the initialized callback', () => {
  //     const isConsidered = (number: number) => Math.abs(number) > 0.5;
  //     const heightStats = new HeightStats(isConsidered);
  //     heightStats.of(route);

  //     expect(heightStats.gain).toEqual(3.5);
  //     expect(heightStats.loss).toEqual(-8.5);
  //     expect(heightStats.max.value).toEqual(elevationInitial + 2);
  //     expect(heightStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightStats.net).toEqual(-4 - elevationInitial);

  //     heightStats.remove(createSegment(1));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);

  //     heightStats.remove(createSegment(5));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);

  //     heightStats.remove(createSegment(6));
  //     expect(heightStats.gain).toEqual(0);
  //     expect(heightStats.loss).toEqual(0);
  //     expect(heightStats.max.value).toEqual(0);
  //     expect(heightStats.min.value).toEqual(0);
  //     expect(heightStats.net).toEqual(0);
  //   });
  // });

  describe('#serialize', () => {
    let route: PolylineRoute<RoutePoint, RouteSegment>;
    let heightStats: HeightStats;

    beforeEach(() => {
      heightStats = new HeightStats();
      route = createRoute(heights);
    });

    it('should write out empty properties if empty', () => {
      const heightStats = new HeightStats();

      const result = heightStats.serialize();

      expect(result.gain).toEqual(0);
      expect(result.loss).toEqual(0);
      expect(result.max.value).toEqual(0);
      expect(result.min.value).toEqual(0);
      expect(result.net).toEqual(0);
    });

    it('should serialize the object into a JSON object', () => {
      heightStats.of(route);

      const result = heightStats.serialize();

      expect(result.gain).toEqual(7.5);
      expect(result.loss).toEqual(-14.5);
      expect(result.net).toEqual(-7);
      expect(result.max.value).toEqual(4.5);
      expect(result.min.value).toEqual(-6.5);
    });
  });
});