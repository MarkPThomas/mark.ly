import { VertexNode } from '../../../../Geometry/Polyline';
import { PolylineRoute } from '../PolylineRoute';
import { RouteSegment } from '../RouteSegment';
import { RoutePoint } from '../RoutePoint';
import { RouteStats } from './RouteStats';

describe('##RouteStats', () => {
  const longMultiplier = 0.0005;

  const createRoute = (heights: number[]): PolylineRoute<RoutePoint, RouteSegment> => {
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
    it('should initialize a new object from Points', () => {
      const firstPoint = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1, 2, 3));
      const lastVertex = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(2, 3, 4));

      const stats = RouteStats.fromRoutePoints(firstPoint, lastVertex);

      expect(stats.isDirty).toBeTruthy();
    });

    it('should initialize a new object from a polyline', () => {
      const vertices: RoutePoint[] = [
        new RoutePoint(1, 2, 3),
        new RoutePoint(2, 3, 4),
        new RoutePoint(3, 4, 5),
        new RoutePoint(4, 5, 6),
      ];

      const polyline = new PolylineRoute<RoutePoint, RouteSegment>(vertices);

      const stats = RouteStats.fromRoute(polyline);

      expect(stats.isDirty).toBeTruthy();
    });
  });

  describe('#setDirty', () => {
    it('should set object to dirty', () => {
      const vertices: RoutePoint[] = [
        new RoutePoint(1, 2, 3),
        new RoutePoint(2, 3, 4),
        new RoutePoint(3, 4, 5),
        new RoutePoint(4, 5, 6),
      ];


      const firstVertex = new VertexNode<RoutePoint, RouteSegment>(vertices[0]);
      const lastVertex = new VertexNode<RoutePoint, RouteSegment>(vertices[vertices.length - 1]);

      const stats = RouteStats.fromRoutePoints(firstVertex, lastVertex);

      expect(stats.isDirty).toBeTruthy();

      stats.addStats();

      expect(stats.isDirty).toBeFalsy();

      stats.setDirty();

      expect(stats.isDirty).toBeTruthy();
    });
  });

  describe('#addStats', () => {
    let vertices: RoutePoint[];
    beforeEach(() => {
      vertices = [
        new RoutePoint(1, 2, 3),
        new RoutePoint(2, 3, 4),
        new RoutePoint(3, 4, 5),
        new RoutePoint(4, 5, 6),
      ];
    });

    describe('with first/last vertices', () => {
      let firstVertex: VertexNode<RoutePoint, RouteSegment>;
      let lastVertex: VertexNode<RoutePoint, RouteSegment>;

      beforeEach(() => {
        firstVertex = new VertexNode(vertices[0]);
        lastVertex = new VertexNode(vertices[vertices.length - 1]);
      });

      it('should do nothing for a stats object with no first vertex', () => {
        const stats = RouteStats.fromRoutePoints(null, lastVertex);

        expect(stats.isDirty).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty).toBeTruthy();
      });

      it('should explicitly add stats & reset dirty flag', () => {
        const stats = RouteStats.fromRoutePoints(firstVertex, lastVertex);

        expect(stats.isDirty).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty).toBeFalsy();
      });
    });

    describe('with Polyline', () => {
      let polyline: PolylineRoute<RoutePoint, RouteSegment>;

      beforeEach(() => {
        polyline = new PolylineRoute<RoutePoint, RouteSegment>(vertices);
      });

      it('should do nothing for a stats object with no polyline', () => {
        const stats = RouteStats.fromRoute(null);

        expect(stats.isDirty).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty).toBeTruthy();
      });

      // it('should explicitly add stats & reset dirty flag', () => {
      //   const stats = RouteStats.fromRoute(polyline);

      //   expect(stats.isDirty).toBeTruthy();

      //   stats.addStats();

      //   expect(stats.isDirty).toBeFalsy();
      // });
    });
  });

  describe('#stats property', () => {
    let polyline: PolylineRoute<RoutePoint, RouteSegment>;
    let firstVertex: VertexNode<RoutePoint, RouteSegment>;
    let lastVertex: VertexNode<RoutePoint, RouteSegment>;

    beforeEach(() => {
      polyline = createRoute(heights);

      firstVertex = polyline.firstVertex;
      lastVertex = polyline.lastVertex;
    });

    describe('with first/last vertices', () => {
      it('should do nothing & return undefined for a stats object with no first vertex', () => {
        const stats = RouteStats.fromRoutePoints(null, lastVertex);

        expect(stats.isDirty).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty).toBeTruthy();

        expect(result).toBeUndefined();
      });

      it('should lazy load stats & reset dirty flag', () => {
        const stats = RouteStats.fromRoutePoints(firstVertex, lastVertex);

        expect(stats.isDirty).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty).toBeFalsy();

        // Polyline-based stats
        expect(result.length).toBeCloseTo(389.18, 2);

        // Route Stats
        expect(result.height.net).toBeCloseTo(-8.3, 2);
        expect(result.height.gain).toBeCloseTo(7.3, 2);
        expect(result.height.loss).toBeCloseTo(-15.6, 2);
        expect(result.height.max.value).toBeCloseTo(3.9, 2);
        expect(result.height.min.value).toBeCloseTo(-8.3, 2);

        expect(result.slope.avg).toBeCloseTo(-0.02, 2);
        expect(result.slope.downhill.avg).toBeCloseTo(-0.07, 2);
        expect(result.slope.downhill.max.value).toBeCloseTo(-0.15, 2);
        expect(result.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(result.slope.uphill.max.value).toBeCloseTo(0.09, 2);
      });

      // it('should skip nodes not meeting callback criteria provided', () => {
      //   const isLengthConsidered = (length: number) => length > 1;
      //   const stats = RouteStats.fromRoutePoints(
      //     firstVertex,
      //     lastVertex,
      //     { isLengthConsidered }
      //   );

      //   expect(stats.isDirty).toBeTruthy();

      //   const result = stats.stats;

      //   expect(stats.isDirty).toBeFalsy();

      //   expect(result).toEqual({
      //     length: 5
      //   });
      // });

      it('should return updated stats when middle vertex is changed & stats reset to dirty', () => {
        const stats = RouteStats.fromRoutePoints(firstVertex, lastVertex);

        expect(stats.isDirty).toBeTruthy();

        const initialResult = stats.stats;

        expect(stats.isDirty).toBeFalsy();

        // Polyline-based stats
        expect(initialResult.length).toBeCloseTo(389.18, 2);

        // Route Stats
        expect(initialResult.height.net).toBeCloseTo(-8.3, 2);
        expect(initialResult.height.gain).toBeCloseTo(7.3, 2);
        expect(initialResult.height.loss).toBeCloseTo(-15.6, 2);
        expect(initialResult.height.max.value).toBeCloseTo(3.9, 2);
        expect(initialResult.height.min.value).toBeCloseTo(-8.3, 2);

        expect(initialResult.slope.avg).toBeCloseTo(-0.02, 2);
        expect(initialResult.slope.downhill.avg).toBeCloseTo(-0.07, 2);
        expect(initialResult.slope.downhill.max.value).toBeCloseTo(-0.15, 2);
        expect(initialResult.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(initialResult.slope.uphill.max.value).toBeCloseTo(0.09, 2);

        // Insert node
        const vertexBeforeRemove = polyline.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
        const vertexAfterRemove = vertexBeforeRemove.next;

        const longitudeRemove = 0.5 * (vertexBeforeRemove.val.lng + vertexAfterRemove.val.lng);
        const latitudeRemove = 45;
        const elevationRemove = 30000;
        const pointToRemove = new RoutePoint(latitudeRemove, longitudeRemove);
        pointToRemove.elevation = elevationRemove;

        polyline.insertAfter(vertexBeforeRemove, pointToRemove);
        const vertexToRemove = vertexBeforeRemove.next as VertexNode<RoutePoint, RouteSegment>;

        expect(stats.isDirty).toBeFalsy();

        const insertResultDirty = stats.stats;

        // State should be unchanged from original polyine
        // Polyline-based stats
        expect(insertResultDirty.length).toBeCloseTo(initialResult.length, 2);

        // Route Stats
        expect(insertResultDirty.height.net).toBeCloseTo(initialResult.height.net, 2);
        expect(insertResultDirty.height.gain).toBeCloseTo(initialResult.height.gain, 2);
        expect(insertResultDirty.height.loss).toBeCloseTo(initialResult.height.loss, 2);
        expect(insertResultDirty.height.max.value).toBeCloseTo(initialResult.height.max.value, 2);
        expect(insertResultDirty.height.min.value).toBeCloseTo(initialResult.height.min.value, 2);

        expect(insertResultDirty.slope.avg).toBeCloseTo(initialResult.slope.avg, 2);
        expect(insertResultDirty.slope.downhill.avg).toBeCloseTo(initialResult.slope.downhill.avg, 2);
        expect(insertResultDirty.slope.downhill.max.value).toBeCloseTo(initialResult.slope.downhill.max.value, 2);
        expect(insertResultDirty.slope.uphill.avg).toBeCloseTo(initialResult.slope.uphill.avg, 2);
        expect(insertResultDirty.slope.uphill.max.value).toBeCloseTo(initialResult.slope.uphill.max.value, 2);

        // Manually reset state
        expect(stats.isDirty).toBeFalsy();

        stats.setDirty();

        expect(stats.isDirty).toBeTruthy();

        const insertResult = stats.stats;

        // Polyline-based stats
        expect(insertResult.length).toBeCloseTo(10007876.98, 2);

        // Route Stats
        expect(insertResult.height.net).toBeCloseTo(-8.3, 2);
        expect(insertResult.height.gain).toBeCloseTo(30005.6, 2);
        expect(insertResult.height.loss).toBeCloseTo(-30013.9, 2);
        expect(insertResult.height.max.value).toBeCloseTo(30000, 2);
        expect(insertResult.height.min.value).toBeCloseTo(-8.3, 2);

        expect(insertResult.slope.avg).toBeCloseTo(-8e-7, 7);
        expect(insertResult.slope.downhill.avg).toBeCloseTo(-0.006, 3);
        expect(insertResult.slope.downhill.max.value).toBeCloseTo(-0.148, 3);
        expect(insertResult.slope.uphill.avg).toBeCloseTo(0.006, 3);
        expect(insertResult.slope.uphill.max.value).toBeCloseTo(0.09, 3);

        // Remove node
        polyline.removeAt(vertexToRemove);

        const removedResultDirty = stats.stats;

        // Polyline-based stats
        expect(removedResultDirty.length).toBeCloseTo(10007876.98, 2);

        // Route Stats
        expect(removedResultDirty.height.net).toBeCloseTo(-8.3, 2);
        expect(removedResultDirty.height.gain).toBeCloseTo(30005.6, 2);
        expect(removedResultDirty.height.loss).toBeCloseTo(-30013.9, 2);
        expect(removedResultDirty.height.max.value).toBeCloseTo(30000, 2);
        expect(removedResultDirty.height.min.value).toBeCloseTo(-8.3, 2);

        expect(removedResultDirty.slope.avg).toBeCloseTo(-8e-7, 7);
        expect(removedResultDirty.slope.downhill.avg).toBeCloseTo(-0.006, 3);
        expect(removedResultDirty.slope.downhill.max.value).toBeCloseTo(-0.148, 3);
        expect(removedResultDirty.slope.uphill.avg).toBeCloseTo(0.006, 3);
        expect(removedResultDirty.slope.uphill.max.value).toBeCloseTo(0.09, 3);

        // Manually reset state
        expect(stats.isDirty).toBeFalsy();

        stats.setDirty();

        expect(stats.isDirty).toBeTruthy();

        const removedResult = stats.stats;

        expect(stats.isDirty).toBeFalsy();

        // State should be back to original polyine
        // Polyline-based stats
        expect(removedResult.length).toBeCloseTo(initialResult.length, 2);

        // Route Stats
        expect(removedResult.height.net).toBeCloseTo(initialResult.height.net, 2);
        expect(removedResult.height.gain).toBeCloseTo(initialResult.height.gain, 2);
        expect(removedResult.height.loss).toBeCloseTo(initialResult.height.loss, 2);
        expect(removedResult.height.max.value).toBeCloseTo(initialResult.height.max.value, 2);
        expect(removedResult.height.min.value).toBeCloseTo(initialResult.height.min.value, 2);

        expect(removedResult.slope.avg).toBeCloseTo(initialResult.slope.avg, 2);
        expect(removedResult.slope.downhill.avg).toBeCloseTo(initialResult.slope.downhill.avg, 2);
        expect(removedResult.slope.downhill.max.value).toBeCloseTo(initialResult.slope.downhill.max.value, 2);
        expect(removedResult.slope.uphill.avg).toBeCloseTo(initialResult.slope.uphill.avg, 2);
        expect(removedResult.slope.uphill.max.value).toBeCloseTo(initialResult.slope.uphill.max.value, 2);
      });
    });

    describe('with polyline', () => {
      it('should do nothing & return undefined for a stats object with no polyline', () => {
        const stats = RouteStats.fromRoute(null);

        expect(stats.isDirty).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty).toBeTruthy();

        expect(result).toBeUndefined();
      });

      it('should lazy load stats & reset dirty flag', () => {
        const stats = RouteStats.fromRoute(polyline);

        expect(stats.isDirty).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty).toBeFalsy();

        // Polyline-based stats
        expect(result.length).toBeCloseTo(389.18, 2);

        // Route Stats
        expect(result.height.net).toBeCloseTo(-8.3, 2);
        expect(result.height.gain).toBeCloseTo(7.3, 2);
        expect(result.height.loss).toBeCloseTo(-15.6, 2);
        expect(result.height.max.value).toBeCloseTo(3.9, 2);
        expect(result.height.min.value).toBeCloseTo(-8.3, 2);

        expect(result.slope.avg).toBeCloseTo(-0.02, 2);
        expect(result.slope.downhill.avg).toBeCloseTo(-0.07, 2);
        expect(result.slope.downhill.max.value).toBeCloseTo(-0.15, 2);
        expect(result.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(result.slope.uphill.max.value).toBeCloseTo(0.09, 2);
      });

      // TODO: Tests for modification of polyline should be in Polyline class as that depends on coordination with that object.
      // Or - consider polylines marking themselves as dirty, with these objects reading that?
      // Or - consider polylines not having these stats classes at all. Just versions, which stats classes can read. Preferred...

      // TODO: Tickets for:
      //  v0 ?
      // 1. Stats options object to selectively turn off particular stats of category (e.g. standard deviations of height)
      // 2. Polyline version, incremented by Insert/Remove/Clone/Split actions
      //  v1 ?
      // 3. Async options for stats - as a whole? Or individual properties? Maybe consider when adding standard deviation
      // 4. Async options for polylineStats?
      // 5. Finish isIncluded callbacks, with associated property to use so that, say,
      //    lengths are only included for segments steeper than a certain length. Test these as well - currently not tested.
    });
  });
});