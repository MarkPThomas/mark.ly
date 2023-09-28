import { VertexNode, SegmentNode } from "../../Geometry/Polyline";
import { Segment } from "../../Geometry/Segment";
import { GeoJsonManager } from "../GeoJsonManager";
import { ITrackPropertyProperties } from "../Track/TrackProperty";
import { PolylineRoute } from "./PolylineRoute";
import { RoutePoint } from "./RoutePoint";
import { RouteSegment } from "./RouteSegment";

describe('##PolylineRoute', () => {
  let lineStringRoute;
  beforeEach(() => {
    lineStringRoute = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coords: [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600],
            ]
          },
        }
      ],
    }
  });


  // TODO: Test
  describe('Creation', () => {
    describe('#constructor', () => {
      it('should ', () => {

      });
    });
  });

  // TODO: Test
  describe('Duplication', () => {
    describe('#copyRangeByPoints', () => {
      it('should ', () => {

      });
    });
  });

  // TODO: Test
  describe('Common Interfaces', () => {
    describe('#clone', () => {
      // TODO: Test
    });
  });

  describe('Properties Methods', () => {
    describe('#addProperties', () => {
      let routePoints: RoutePoint[];

      beforeEach(() => {
        const coord1 = new RoutePoint(-8.957287, -77.777452);
        // heading 48.3
        // segment1 length = 24.9 m
        // segment1 angle = 1.339 rad = 76.7 deg
        // segment1 direction = N, E

        const coord2 = new RoutePoint(-8.957069, -77.777400);
        // heading 13.3
        // rotation =
        // segment2 length = 14.9 m
        // segment2 angle = 1.431 rad = 82.0 deg
        // segment2 direction = N, E

        const coord3 = new RoutePoint(-8.956936, -77.777381);
        // heading 8.2
        // segment3 length = 27.2 m
        // segment3 angle = 0.815 rad = 46.7 deg
        // segment3 direction = N, E

        const coord4 = new RoutePoint(-8.956758, -77.777211);
        // heading 43.3

        routePoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should add derived properties to segments', () => {
        const polylineRoute = new PolylineRoute(routePoints);

        polylineRoute.addProperties();

        const segments = polylineRoute.segments();

        expect(segments[1].length - 14.935).toBeLessThanOrEqual(0.001);
        expect(segments[1].angle - 1.431).toBeLessThanOrEqual(0.001);
        expect(segments[1].direction).toEqual({ lat: 'N', lng: 'E' });
      });

      it('should add derived properties to coordinates', () => {
        const polylineRoute = new PolylineRoute(routePoints);

        polylineRoute.addProperties();

        const coords = polylineRoute.vertices();

        // Check middle node
        expect(coords[1]._path.rotation - 0.092).toBeLessThanOrEqual(0.001);

        // Check start node
        expect(coords[0]._path?.rotation).toBeNull();

        // Check end node
        expect(coords[coords.length - 1]._path?.rotation).toBeNull();
      });
    });

    describe('#addElevations', () => {
      it('should do nothing for elevations of non-matching lat/long', () => {
        const coords = [
          new RoutePoint(39.74007868370209, -105.0076261841355, 0),
          new RoutePoint(39.74005097339472, -104.9998123858178, 0),
          new RoutePoint(39.73055300708892, -104.9990802128465, 0),
          new RoutePoint(39.73993779411854, -104.9985377946692, 0),
          new RoutePoint(39.73991441833991, -104.9917491337653, 0)
        ];

        const polylineRoute = new PolylineRoute(coords);
        polylineRoute.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 1, lng: 2 }), 1000);
        elevations.set(JSON.stringify({ lat: 3, lng: 4 }), 2000);
        elevations.set(JSON.stringify({ lat: 5, lng: 6 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);
        elevations.set(JSON.stringify({ lat: 9, lng: 10 }), 5000);

        polylineRoute.addElevations(elevations);

        const routeCoords = polylineRoute.vertices();

        expect(routeCoords.length).toEqual(5);

        expect(routeCoords[0]).not.toHaveProperty('elevation');
        expect(routeCoords[1]).not.toHaveProperty('elevation');
        expect(routeCoords[2]).not.toHaveProperty('elevation');
        expect(routeCoords[3]).not.toHaveProperty('elevation');
        expect(routeCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add elevation properties and derived data for matching lat/long', () => {
        const coords = [
          new RoutePoint(39.74007868370209, -105.0076261841355, 0),
          new RoutePoint(39.74005097339472, -104.9998123858178, 0),
          new RoutePoint(39.73055300708892, -104.9990802128465, 0),
          new RoutePoint(39.73993779411854, -104.9985377946692, 0), // Intentional mismatch
          new RoutePoint(39.73991441833991, -104.9917491337653, 0),
          new RoutePoint(39.739914418342, -104.99174913377, 0)
        ];

        const polylineRoute = new PolylineRoute(coords);
        polylineRoute.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 39.74007868370209, lng: -105.0076261841355 }), 1000);
        elevations.set(JSON.stringify({ lat: 39.74005097339472, lng: -104.9998123858178 }), 2000);
        elevations.set(JSON.stringify({ lat: 39.73055300708892, lng: -104.9990802128465 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);                                         // Intentional mismatch
        elevations.set(JSON.stringify({ lat: 39.73991441833991, lng: -104.9917491337653 }), 5000);
        elevations.set(JSON.stringify({ lat: 39.739914418342, lng: -104.99174913377 }), 4000);

        polylineRoute.addElevations(elevations);

        const routeCoords = polylineRoute.vertices();
        const routeSegs = polylineRoute.segments();

        expect(routeCoords.length).toEqual(6);
        expect(routeSegs.length).toEqual(5);

        expect(routeCoords[0].elevation).toEqual(1000);
        expect(routeCoords[0]).toHaveProperty('path');

        expect(routeSegs[0].height - 1000).toBeLessThanOrEqual(0.1);

        expect(routeCoords[1].elevation).toEqual(2000);
        expect(routeCoords[1]).toHaveProperty('path');

        expect(routeSegs[1].height + 500).toBeLessThanOrEqual(0.1);

        expect(routeCoords[2].elevation).toEqual(1500);
        expect(routeCoords[2]).toHaveProperty('path');

        expect(routeSegs[2].height).toBeUndefined();

        expect(routeCoords[3].elevation).toBeUndefined();

        expect(routeSegs[3].height).toBeUndefined();

        expect(routeCoords[4].elevation).toEqual(5000);
        expect(routeCoords[4]).toHaveProperty('path');

        expect(routeSegs[4].height + 1000).toBeLessThanOrEqual(0.1);

        expect(routeCoords[5].elevation).toEqual(4000);
        expect(routeCoords[5]).toHaveProperty('path');
      });
    });

    describe('#addElevationProperties', () => {
      it('should do nothing if nodes do not have elevations', () => {
        const coords = [
          new RoutePoint(39.74007868370209, -105.0076261841355, 0),
          new RoutePoint(39.74005097339472, -104.9998123858178, 0),
          new RoutePoint(39.73055300708892, -104.9990802128465, 0),
          new RoutePoint(39.73993779411854, -104.9985377946692, 0),
          new RoutePoint(39.73991441833991, -104.9917491337653, 0)
        ];

        const polylineRoute = new PolylineRoute(coords);
        polylineRoute.addProperties();
        polylineRoute.addElevationProperties();

        const routeCoords = polylineRoute.vertices();

        expect(routeCoords.length).toEqual(5);

        expect(routeCoords[0]).not.toHaveProperty('elevation');
        expect(routeCoords[1]).not.toHaveProperty('elevation');
        expect(routeCoords[2]).not.toHaveProperty('elevation');
        expect(routeCoords[3]).not.toHaveProperty('elevation');
        expect(routeCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add derived data from elevations already set for TrackPoints', () => {
        const coords = [
          new RoutePoint(39.74007868370209, -105.0076261841355, 0),
          new RoutePoint(39.74005097339472, -104.9998123858178, 0),
          new RoutePoint(39.73055300708892, -104.9990802128465, 0),
          new RoutePoint(39.73993779411854, -104.9985377946692, 0), // Intentional mismatch
          new RoutePoint(39.73991441833991, -104.9917491337653, 0),
          new RoutePoint(39.739914418342, -104.99174913377, 0)
        ];
        coords[0].elevation = 1000;
        coords[1].elevation = 2000;
        coords[2].elevation = 1500;
        coords[4].elevation = 5000;
        coords[5].elevation = 4000;

        const polylineRoute = new PolylineRoute(coords);
        polylineRoute.addProperties();

        polylineRoute.addElevationProperties();

        const routeCoords = polylineRoute.vertices();
        const routeSegs = polylineRoute.segments();

        expect(routeCoords.length).toEqual(6);
        expect(routeSegs.length).toEqual(5);

        expect(routeCoords[0].elevation).toEqual(1000);
        expect(routeCoords[0]).toHaveProperty('path');

        expect(routeSegs[0].height - 1000).toBeLessThanOrEqual(0.1);

        expect(routeCoords[1].elevation).toEqual(2000);
        expect(routeCoords[1]).toHaveProperty('path');

        expect(routeSegs[1].height + 500).toBeLessThanOrEqual(0.1);

        expect(routeCoords[2]).toHaveProperty('elevation');
        expect(routeCoords[2].elevation).toEqual(1500);
        expect(routeCoords[2]).toHaveProperty('path');

        expect(routeSegs[2].height).toBeUndefined();

        expect(routeCoords[3]).not.toHaveProperty('elevation');

        expect(routeSegs[3].height).toBeUndefined();

        expect(routeCoords[4].elevation).toEqual(5000);
        expect(routeCoords[4]).toHaveProperty('path');

        expect(routeSegs[4].height + 1000).toBeLessThanOrEqual(0.1);

        expect(routeCoords[5].elevation).toEqual(4000);
        expect(routeCoords[5]).toHaveProperty('path');
      });
    });

    describe('#addElevationsFromApi', () => {
      it('should ', () => {

      });
    });
  });

  // TODO: Placeholder for future tests
  // describe('Manipulating PolylineRoute', () => {
  //   let routePoints: RoutePoint[];
  //   let polylineRoute: PolylineRoute<RoutePoint, RouteSegment>;

  //   beforeEach(() => {
  //     const positions = lineStringRoute.features[0].geometry.coords;
  //     const times = (lineStringRoute.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];
  //     routePoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
  //     polylineRoute = new PolylineRoute(routePoints);
  //   });

  //   describe('Trim', () => {
  //     describe('#trimBeforeVertex', () => {
  //       it('should do nothing and return 0 on an empty polylineRoute', () => {
  //         polylineRoute = new PolylineRoute([]);

  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = new VertexNode<RoutePoint, RouteSegment>(coords[1]);

  //         const trimCount = polylineRoute.trimBefore(vertex);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.size().vertices).toEqual(0);
  //         expect(polylineRoute.size().segments).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.vertices()).toEqual([]);
  //       });

  //       it('should do nothing and return 0 when the specified vertex does not exist in the polylineRoute', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = new VertexNode<RoutePoint, RouteSegment>([6, -10] as TestVertex);

  //         const trimCount = polylineRoute.trimBefore(vertex);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.size().vertices).toEqual(6);
  //         expect(polylineRoute.size().segments).toEqual(5);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);
  //       });

  //       it('should trim off vertices & segments before the specified point and return the a positive number to indicate success', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentNext = vertex.nextSeg;
  //         const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.prev).not.toBeNull();
  //         expect(vertex.prevSeg).not.toBeNull();
  //         expect(segmentNext.prev).not.toBeNull();
  //         expect(segmentNext.prevVert).not.toBeNull();


  //         const trimCount = polylineRoute.trimBefore(vertex);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);

  //         expect(vertex.prev).toBeNull();
  //         expect(vertex.prevSeg).toBeNull();
  //         expect(segmentNext.prev).toBeNull();

  //         expect(trimmedVertexTail.next).toBeNull();
  //         expect(trimmedSegmentTail.next).toBeNull();
  //         expect(trimmedSegmentTail.nextVert).toBeNull();
  //       });

  //       it('should return the number of vertices if requested', () => {
  //         const vertex = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const returnListCount = true;

  //         const trimCount = polylineRoute.trimBefore(vertex, returnListCount);

  //         expect(trimCount).toEqual(2);
  //       });
  //     });

  //     describe('#trimAfterVertex', () => {
  //       it('should do nothing and return 0 on an empty polylineRoute', () => {
  //         polylineRoute = new PolylineRoute([]);

  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = new VertexNode<RoutePoint, RouteSegment>(coords[1]);

  //         const trimCount = polylineRoute.trimAfter(vertex);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.size().vertices).toEqual(0);
  //         expect(polylineRoute.size().segments).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.vertices()).toEqual([]);
  //       });

  //       it('should do nothing and return 0 when the specified vertex does not exist in the polylineRoute', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = new VertexNode<RoutePoint, RouteSegment>([6, -10] as TestVertex);

  //         const trimCount = polylineRoute.trimAfter(vertex);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.size().vertices).toEqual(6);
  //         expect(polylineRoute.size().segments).toEqual(5);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);
  //       });

  //       it('should trim off vertices & segments after the specified point and return the a positive number to indicate success', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentPrev = vertex.prevSeg;
  //         const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.next).not.toBeNull();
  //         expect(vertex.nextSeg).not.toBeNull();
  //         expect(segmentPrev.next).not.toBeNull();
  //         expect(segmentPrev.nextVert).not.toBeNull();


  //         const trimCount = polylineRoute.trimAfter(vertex);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex
  //         ]);

  //         expect(vertex.next).toBeNull();
  //         expect(vertex.nextSeg).toBeNull();
  //         expect(segmentPrev.next).toBeNull();

  //         expect(trimmedVertexHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prevVert).toBeNull();
  //       });

  //       it('should return the number of vertices if requested', () => {
  //         const vertex = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const returnListCount = true;

  //         const trimCount = polylineRoute.trimAfter(vertex, returnListCount);

  //         expect(trimCount).toEqual(2);
  //       });
  //     });

  //     describe('#trimToVertices', () => {
  //       it('should do nothing and return 0 on an empty polylineRoute', () => {
  //         polylineRoute = new PolylineRoute([]);

  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex1 = new VertexNode<RoutePoint, RouteSegment>(coords[1]);
  //         const vertex2 = new VertexNode<RoutePoint, RouteSegment>(coords[3]);

  //         const trimCount = polylineRoute.trimTo(vertex1, vertex2);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.size().vertices).toEqual(0);
  //         expect(polylineRoute.size().segments).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.vertices()).toEqual([]);
  //       });

  //       it('should do nothing and return 0 when the specified vertex does not exist in the polylineRoute', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex1 = new VertexNode<RoutePoint, RouteSegment>([6, -10] as TestVertex);
  //         const vertex2 = new VertexNode<RoutePoint, RouteSegment>([-6, 10] as TestVertex);

  //         const trimCount = polylineRoute.trimTo(vertex1, vertex2);

  //         expect(trimCount).toEqual(0);
  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
  //         expect(polylineRoute.size().vertices).toEqual(6);
  //         expect(polylineRoute.size().segments).toEqual(5);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);
  //       });

  //       it('should trim off vertices & segments before & after the specified start & end point sand return the a positive number to indicate success', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         // Trim before state
  //         const vertex1 = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentNext = vertex1.nextSeg;
  //         const trimmedVertexTail = vertex1.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, Segment>;

  //         expect(vertex1.prev).not.toBeNull();
  //         expect(vertex1.prevSeg).not.toBeNull();
  //         expect(segmentNext.prev).not.toBeNull();
  //         expect(segmentNext.prevVert).not.toBeNull();

  //         // Trim after state
  //         const vertex2 = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentPrev = vertex2.prevSeg;
  //         const trimmedVertexHead = vertex2.next as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, Segment>;

  //         expect(vertex2.next).not.toBeNull();
  //         expect(vertex2.nextSeg).not.toBeNull();
  //         expect(segmentPrev.next).not.toBeNull();
  //         expect(segmentPrev.nextVert).not.toBeNull();


  //         const trimCount = polylineRoute.trimTo(vertex1, vertex2);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(2);
  //         expect(polylineRoute.size().segments).toEqual(1);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex
  //         ]);

  //         // New Head
  //         expect(vertex1.prev).toBeNull();
  //         expect(vertex1.prevSeg).toBeNull();
  //         expect(segmentNext.prev).toBeNull();

  //         expect(trimmedVertexTail.next).toBeNull();
  //         expect(trimmedSegmentTail.next).toBeNull();
  //         expect(trimmedSegmentTail.nextVert).toBeNull();

  //         // New Tail
  //         expect(vertex2.next).toBeNull();
  //         expect(vertex2.nextSeg).toBeNull();
  //         expect(segmentPrev.next).toBeNull();

  //         expect(trimmedVertexHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prevVert).toBeNull();
  //       });

  //       it('should trim off vertices & segments before the specified start point if the end vertex is not specified', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentNext = vertex.nextSeg;
  //         const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.prev).not.toBeNull();
  //         expect(vertex.prevSeg).not.toBeNull();
  //         expect(segmentNext.prev).not.toBeNull();
  //         expect(segmentNext.prevVert).not.toBeNull();


  //         const trimCount = polylineRoute.trimTo(vertex, null);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);

  //         expect(vertex.prev).toBeNull();
  //         expect(vertex.prevSeg).toBeNull();
  //         expect(segmentNext.prev).toBeNull();

  //         expect(trimmedVertexTail.next).toBeNull();
  //         expect(trimmedSegmentTail.next).toBeNull();
  //         expect(trimmedSegmentTail.nextVert).toBeNull();
  //       });

  //       it('should trim off vertices & segments before the specified start point if the end vertex is not found', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentNext = vertex.nextSeg;
  //         const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentTail = segmentNext.prev as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.prev).not.toBeNull();
  //         expect(vertex.prevSeg).not.toBeNull();
  //         expect(segmentNext.prev).not.toBeNull();
  //         expect(segmentNext.prevVert).not.toBeNull();

  //         const vertexNotExist = new VertexNode<RoutePoint, RouteSegment>([-6, 10] as TestVertex);


  //         const trimCount = polylineRoute.trimTo(vertex, vertexNotExist);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex,
  //           [5, -150] as TestVertex,
  //           [6, -160] as TestVertex
  //         ]);

  //         expect(vertex.prev).toBeNull();
  //         expect(vertex.prevSeg).toBeNull();
  //         expect(segmentNext.prev).toBeNull();

  //         expect(trimmedVertexTail.next).toBeNull();
  //         expect(trimmedSegmentTail.next).toBeNull();
  //         expect(trimmedSegmentTail.nextVert).toBeNull();
  //       });

  //       it('should trim off vertices & segments after the specified end point if the start vertex is not specified', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentPrev = vertex.prevSeg;
  //         const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.next).not.toBeNull();
  //         expect(vertex.nextSeg).not.toBeNull();
  //         expect(segmentPrev.next).not.toBeNull();
  //         expect(segmentPrev.nextVert).not.toBeNull();


  //         const trimCount = polylineRoute.trimTo(null, vertex);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex
  //         ]);

  //         expect(vertex.next).toBeNull();
  //         expect(vertex.nextSeg).toBeNull();
  //         expect(segmentPrev.next).toBeNull();

  //         expect(trimmedVertexHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prevVert).toBeNull();
  //       });

  //       it('should trim off vertices & segments after the specified end point if the start vertex is not found', () => {
  //         const originalVertexHead = polylineRoute.firstVertex;
  //         const originalSegmentHead = polylineRoute.firstSegment;
  //         const originalVertexTail = polylineRoute.lastVertex;
  //         const originalSegmentTail = polylineRoute.lastSegment;

  //         const vertex = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const segmentPrev = vertex.prevSeg;
  //         const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
  //         const trimmedSegmentHead = segmentPrev.next as SegmentNode<TestVertex, Segment>;

  //         expect(vertex.next).not.toBeNull();
  //         expect(vertex.nextSeg).not.toBeNull();
  //         expect(segmentPrev.next).not.toBeNull();
  //         expect(segmentPrev.nextVert).not.toBeNull();

  //         const vertexNotExist = new VertexNode<RoutePoint, RouteSegment>([-6, 10] as TestVertex);


  //         const trimCount = polylineRoute.trimTo(vertexNotExist, vertex);


  //         expect(trimCount).toBeTruthy();

  //         expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
  //         expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
  //         expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
  //         expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

  //         expect(polylineRoute.size().vertices).toEqual(4);
  //         expect(polylineRoute.size().segments).toEqual(3);
  //         expect(polylineRoute.vertices()).toEqual([
  //           [1, -110] as TestVertex,
  //           [2, -120] as TestVertex,
  //           [3, -130] as TestVertex,
  //           [4, -140] as TestVertex
  //         ]);

  //         expect(vertex.next).toBeNull();
  //         expect(vertex.nextSeg).toBeNull();
  //         expect(segmentPrev.next).toBeNull();

  //         expect(trimmedVertexHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prev).toBeNull();
  //         expect(trimmedSegmentHead.prevVert).toBeNull();
  //       });

  //       it('should return the number of vertices if requested', () => {
  //         const vertex1 = polylineRoute.firstVertex.next.next as VertexNode<RoutePoint, RouteSegment>;
  //         const vertex2 = polylineRoute.lastVertex.prev.prev as VertexNode<RoutePoint, RouteSegment>;
  //         const returnListCount = true;

  //         const trimCount = polylineRoute.trimTo(vertex1, vertex2, returnListCount);

  //         expect(trimCount).toEqual(4);
  //       });
  //     });
  //   });

  //   describe('Remove', () => {
  //     // // removeAtVertex(vertex: VertexNode<TVertex, TSegment>): boolean;
  //     // describe('#removeAtVertex', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });

  //     describe('#removeNodes', () => {
  //       it('should do nothing for nodes provided that are not in the track and return a count of 0', () => {
  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(-1, -2, undefined, '-1'));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1, 101, 200, '-2'));

  //         const nodes = polylineRoute.removeAtAny([node1, node2]);

  //         expect(nodes).toEqual(0);

  //         const polylineTrackLength = polylineRoute.size();
  //         expect(polylineTrackLength.vertices).toEqual(routePoints.length);
  //         expect(polylineTrackLength.segments).toEqual(routePoints.length - 1);
  //       });

  //       it('should remove the nodes provided and return a count for the number removed', () => {
  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(routePoints[0]);
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(routePoints[3]);

  //         const nodes = polylineRoute.removeAtAny([node1, node2]);

  //         expect(nodes).toEqual(2);

  //         const polylineTrackLength = polylineRoute.size();
  //         expect(polylineTrackLength.vertices).toEqual(routePoints.length - 2);
  //         expect(polylineTrackLength.segments).toEqual(routePoints.length - 2 - 1);
  //       });

  //       it('should remove the nodes provided, ignoring ones that are not found in the track and return a count for the number removed', () => {
  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(routePoints[0]);
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1, 101, 200, '-2'));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(routePoints[3]);

  //         const nodes = polylineRoute.removeAtAny([node1, node2, node3]);

  //         expect(nodes).toEqual(2);

  //         const polylineTrackLength = polylineRoute.size();
  //         expect(polylineTrackLength.vertices).toEqual(routePoints.length - 2);
  //         expect(polylineTrackLength.segments).toEqual(routePoints.length - 2 - 1);
  //       });
  //     });
  //     // describe('#removeVertices', () => {
  //     //   it('should do nothing for nodes provided that are not in the track and return a count of 0', () => {
  //     //     const node1 = new VertexNode<RoutePoint, RouteSegment>([90, -208] as TestVertex);
  //     //     const node2 = new VertexNode<RoutePoint, RouteSegment>([95, -208] as TestVertex);

  //     //     const nodes = polylineRoute.removeVertices([node1, node2]);

  //     //     expect(nodes).toEqual(0);

  //     //     const polylineLength = polylineRoute.size();
  //     //     expect(polylineLength.vertices).toEqual(coords.length);
  //     //     expect(polylineLength.segments).toEqual(coords.length - 1);
  //     //   });

  //     //   it('should remove the nodes provided and return a count for the number removed', () => {
  //     //     const node1 = new VertexNode<RoutePoint, RouteSegment>(coords[1]);
  //     //     const node2 = new VertexNode<RoutePoint, RouteSegment>(coords[2]);

  //     //     const nodes = polylineRoute.removeVertices([node1, node2]);

  //     //     expect(nodes).toEqual(2);

  //     //     const polylineLength = polylineRoute.size();
  //     //     expect(polylineLength.vertices).toEqual(coords.length - 2);
  //     //     expect(polylineLength.segments).toEqual(coords.length - 2 - 1);
  //     //   });

  //     //   it('should remove the nodes provided, ignoring ones that are not found in the track and return a count for the number removed', () => {
  //     //     const node1 = new VertexNode<RoutePoint, RouteSegment>(coords[1]);
  //     //     const node2 = new VertexNode<RoutePoint, RouteSegment>([95, -208] as TestVertex);

  //     //     const nodes = polylineRoute.removeVertices([node1, node2]);

  //     //     expect(nodes).toEqual(1);

  //     //     const polylineLength = polylineRoute.size();
  //     //     expect(polylineLength.vertices).toEqual(coords.length - 1);
  //     //     expect(polylineLength.segments).toEqual(coords.length - 1 - 1);
  //     //   });
  //     // });

  //     // // removeBetweenVertices(vertexStart: VertexNode<TVertex, TSegment>, vertexEnd: VertexNode<TVertex, TSegment>): number;
  //     // describe('#removeBetweenVertices', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });

  //     // // removeFromToVertices(vertexStart: VertexNode<TVertex, TSegment>, vertexEnd: VertexNode<TVertex, TSegment>): number;
  //     // describe('#removeFromToVertices', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });
  //   });

  //   describe('Insert', () => {
  //     // describe('Before', () => {
  //     //   // insertVertexBefore(vertexTarget: VertexNode<TVertex, TSegment>, vertexInsert: VertexNode<TVertex, TSegment>): boolean;
  //     //   describe('#insertVertexBefore', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });

  //     //   describe('#insertVerticesBefore', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });
  //     // });

  //     // describe('After', () => {
  //     //   // insertVertexAfter(vertexTarget: VertexNode<TVertex, TSegment>, vertexInsert: VertexNode<TVertex, TSegment>): boolean;
  //     //   describe('#insertVertexAfter', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });


  //     //   describe('#insertVerticesAfter', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });
  //     // });
  //   });

  //   describe('Replace', () => {
  //     // // replaceVertexAt(vertexTarget: VertexNode<TVertex, TSegment>, vertexReplacement: VertexNode<TVertex, TSegment>): boolean;
  //     // describe('#replaceVertexAt', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });


  //     describe('#replaceNodesBetween', () => {
  //       const getNodeAtCount = (node: VertexNode<RoutePoint, RouteSegment>, count: number) => {
  //         while (node) {
  //           node = node.next as VertexNode<RoutePoint, RouteSegment>;
  //           count--;
  //         }

  //         return node;
  //       };

  //       const getTailNode = (node: VertexNode<RoutePoint, RouteSegment>) => {
  //         let tempNode: VertexNode<RoutePoint, RouteSegment>;
  //         while (node) {
  //           tempNode = node;
  //           node = node.next as VertexNode<RoutePoint, RouteSegment>;
  //         }

  //         return tempNode;
  //       }

  //       it('should do nothing if the head & tail nodes are both unspecified', () => {
  //         const initialLength = polylineRoute.size();

  //         const startNode = null;
  //         const endNode = null;

  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.1, 101.5, 200));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.2, 102, 210));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.3, 107, 240));
  //         const nodes = [node1, node2, node3];

  //         const result = polylineRoute.replaceBetween(startNode, endNode, nodes);

  //         expect(result).toEqual(0);
  //         expect(polylineRoute.size()).toEqual(initialLength);
  //       });

  //       it('should only remove nodes in the start/end range if no nodes are provided to insert and return 0', () => {
  //         const startNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[0]);
  //         const endNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[3]);

  //         const initialLength = polylineRoute.size();

  //         const result = polylineRoute.replaceBetween(startNode, endNode, []);

  //         expect(result).toEqual(2);
  //         expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - 2);
  //         expect(polylineRoute.size().segments).toEqual(initialLength.segments - 2);
  //       });

  //       it(`should insert the nodes at the head of track and return the number of nodes inserted
  //         if only a tail node is provided and tail node is at the head of the track, `, () => {
  //         const initialLength = polylineRoute.size();
  //         const initialHead = polylineRoute.firstVertex;

  //         // Use current tail node - by value to also test matching
  //         const startNode = null;
  //         const endNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[0]);

  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.1, 101.5, 200));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.2, 102, 210));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.3, 107, 240));
  //         const nodes = [node1, node2, node3];

  //         const result = polylineRoute.replaceBetween(startNode, endNode, nodes);

  //         expect(result).toEqual(3); // 3 inserted
  //         expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //         expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);
  //         expect(polylineRoute.firstVertex.equals(node1.val)).toBeTruthy();

  //         expect(node3.next.val).toEqual(endNode.val);

  //         expect(node1).toEqual(polylineRoute.firstVertex);
  //         expect(node1.prev).toBeNull();
  //         expect(node1.next).toEqual(node2);

  //         expect(node3.prev).toEqual(node2);
  //         expect(node3.next).toEqual(initialHead);
  //         expect(initialHead.prev).toEqual(node3);
  //       });

  //       it(`should insert the nodes at the tail of track and return the number of nodes inserted
  //         if only a head node is provided and head node is at the tail of the track`, () => {
  //         const initialLength = polylineRoute.size();
  //         const initialHead = polylineRoute.firstVertex;
  //         const initialTail = getTailNode(initialHead);

  //         // Use current last node - by value to also test matching
  //         const startNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[routePoints.length - 1]);
  //         const endNode = null;

  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.1, 101.5, 200, '2.1'));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.2, 102, 210, '2.2'));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.3, 107, 240, '2.3'));
  //         const nodes = [node1, node2, node3];

  //         const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //         expect(result).toEqual(3); // 3 inserted
  //         expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //         expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);
  //         expect(polylineRoute.firstVertex.equals(initialHead.val)).toBeTruthy();

  //         expect(node1.prev.val).toEqual(startNode.val);

  //         expect(node1).not.toEqual(polylineRoute.firstVertex);
  //         expect(node1).toEqual(initialTail.next);
  //         expect(node1.prev).toEqual(initialTail);
  //         expect(node1.next).toEqual(node2);

  //         expect(node3.prev).toEqual(node2);
  //         expect(node3.next).toBeNull();
  //       });

  //       it(`should insert the nodes between the two specified tail/head nodes in the track
  //         and return the number of nodes inserted when the head/tail nodes are adjacent`, () => {
  //         const initialLength = polylineRoute.size();
  //         const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
  //         const initialTail = initialHead.next as VertexNode<RoutePoint, RouteSegment>;

  //         // Insert after first segment, over second segment
  //         const startNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[1]);
  //         const endNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[2]);

  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.1, 101.5, 200, '2.1'));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.2, 102, 210, '2.2'));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.3, 107, 240, '2.3'));
  //         const nodes = [node1, node2, node3];

  //         const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //         expect(result).toEqual(3); // 3 inserted
  //         expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //         expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);

  //         expect(node1.prev.val).toEqual(startNode.val);
  //         expect(node3.next.val).toEqual(endNode.val);

  //         expect(node1).not.toEqual(polylineRoute.firstVertex);
  //         expect(node1).toEqual(initialHead.next);
  //         expect(node1.prev).toEqual(initialHead);
  //         expect(node1.next).toEqual(node2);

  //         expect(node3.prev).toEqual(node2);
  //         expect(node3.next).toEqual(initialTail);
  //         expect(initialTail.prev).toEqual(node3);
  //       });

  //       it(`should insert the nodes between the two specified tail/head nodes in the track,
  //         remove the original set of nodes between these same two points,
  //         and return the number of nodes inserted+removed when the head/tail nodes are not adjacent`, () => {
  //         const initialLength = polylineRoute.size();
  //         const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
  //         const initialTail = initialHead?.next?.next?.next as VertexNode<RoutePoint, RouteSegment>;

  //         // Insert after first segment, over second segment
  //         const startNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[1]);
  //         const endNode = new VertexNode<RoutePoint, RouteSegment>(routePoints[4]);

  //         const node1 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.1, 101.5, 200, '2.1'));
  //         const node2 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.2, 102, 210, '2.2'));
  //         const node3 = new VertexNode<RoutePoint, RouteSegment>(new RoutePoint(1.3, 107, 240, '2.3'));
  //         const nodes = [node1, node2, node3];

  //         const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //         expect(result).toEqual(5); // 3 inserted, 2 removed
  //         expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
  //         expect(polylineRoute.size().segments).toEqual(initialLength.segments + 1);
  //         expect(node1.prev.val).toEqual(startNode.val);
  //         expect(node3.next.val).toEqual(endNode.val);

  //         expect(node1).not.toEqual(polylineRoute.firstVertex);
  //         expect(node1).toEqual(initialHead.next);
  //         expect(node1.prev).toEqual(initialHead);
  //         expect(node1.next).toEqual(node2);

  //         expect(node3.prev).toEqual(node2);
  //         expect(node3.next).toEqual(initialTail);
  //         expect(initialTail.prev).toEqual(node3);
  //       });
  //     });
  //     // describe('#replaceVerticesBetween', () => {
  //     //     beforeEach(() => {
  //     //       coords = [
  //     //         [45, -110] as TestVertex,
  //     //         [60, -109] as TestVertex,
  //     //         [47, -108] as TestVertex,
  //     //         [49, -110] as TestVertex,
  //     //         [57, -101] as TestVertex,
  //     //         [53, -107] as TestVertex,
  //     //       ];
  //     //     });

  //     //     const getNodeAtCount = (node: VertexNode<RoutePoint, RouteSegment>, count: number) => {
  //     //       while (node) {
  //     //         node = node.next as VertexNode<RoutePoint, RouteSegment>;
  //     //         count--;
  //     //       }

  //     //       return node;
  //     //     };

  //     //     const getTailNode = (node: VertexNode<RoutePoint, RouteSegment>) => {
  //     //       let tempNode: VertexNode<RoutePoint, RouteSegment>;
  //     //       while (node) {
  //     //         tempNode = node;
  //     //         node = node.next as VertexNode<RoutePoint, RouteSegment>;
  //     //       }

  //     //       return tempNode;
  //     //     }

  //     //     it('should do nothing if the head & tail nodes are both unspecified', () => {
  //     //       const initialLength = polylineRoute.size();

  //     //       const startNode = null;
  //     //       const endNode = null;

  //     //       const node1 = new VertexNode<RoutePoint, RouteSegment>([99, 140] as TestVertex);
  //     //       const node2 = new VertexNode<RoutePoint, RouteSegment>([666, 69] as TestVertex);
  //     //       const node3 = new VertexNode<RoutePoint, RouteSegment>([420, 171] as TestVertex);
  //     //       const nodes = [node1, node2, node3];

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //     //       expect(result).toEqual(0);
  //     //       expect(polylineRoute.size()).toEqual(initialLength);
  //     //     });

  //     //     it('should only remove nodes in the start/end range if no nodes are provided to insert and return 0', () => {
  //     //       const startNode = new VertexNode<RoutePoint, RouteSegment>(coords[0]);
  //     //       const endNode = new VertexNode<RoutePoint, RouteSegment>(coords[3]);

  //     //       const initialLength = polylineRoute.size();

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, []);

  //     //       expect(result).toEqual(2);
  //     //       expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - 2);
  //     //       expect(polylineRoute.size().segments).toEqual(initialLength.segments - 2);
  //     //     });

  //     //     it(`should insert the nodes at the head of track and return the number of nodes inserted
  //     // if only a tail node is provided and tail node is at the head of the track, `, () => {
  //     //       const initialLength = polylineRoute.size();
  //     //       const initialHead = polylineRoute.firstVertex;

  //     //       // Use current tail node - by value to also test matching
  //     //       const startNode = null;
  //     //       const endNode = new VertexNode<RoutePoint, RouteSegment>(coords[0]);

  //     //       const node1 = new VertexNode<RoutePoint, RouteSegment>([99, 140] as TestVertex);
  //     //       const node2 = new VertexNode<RoutePoint, RouteSegment>([666, 69] as TestVertex);
  //     //       const node3 = new VertexNode<RoutePoint, RouteSegment>([420, 171] as TestVertex);
  //     //       const nodes = [node1, node2, node3];

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //     //       expect(result).toEqual(3); // 3 inserted
  //     //       expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //     //       expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);
  //     //       expect(polylineRoute.firstVertex.equals(node1.val)).toBeTruthy();

  //     //       expect(node3.next.val).toEqual(endNode.val);

  //     //       expect(node1).toEqual(polylineRoute.firstVertex);
  //     //       expect(node1.prev).toBeNull();
  //     //       expect(node1.next).toEqual(node2);

  //     //       expect(node3.prev).toEqual(node2);
  //     //       expect(node3.next).toEqual(initialHead);
  //     //       expect(initialHead.prev).toEqual(node3);
  //     //     });

  //     //     it(`should insert the nodes at the tail of track and return the number of nodes inserted
  //     // if only a head node is provided and head node is at the tail of the track`, () => {
  //     //       const initialLength = polylineRoute.size();
  //     //       const initialHead = polylineRoute.firstVertex;
  //     //       const initialTail = getTailNode(initialHead);

  //     //       // Use current last node - by value to also test matching
  //     //       const startNode = new VertexNode<RoutePoint, RouteSegment>(coords[coords.length - 1]);
  //     //       const endNode = null;

  //     //       const node1 = new VertexNode<RoutePoint, RouteSegment>([99, 140] as TestVertex);
  //     //       const node2 = new VertexNode<RoutePoint, RouteSegment>([666, 69] as TestVertex);
  //     //       const node3 = new VertexNode<RoutePoint, RouteSegment>([420, 171] as TestVertex);
  //     //       const nodes = [node1, node2, node3];

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //     //       expect(result).toEqual(3); // 3 inserted
  //     //       expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //     //       expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);
  //     //       expect(polylineRoute.firstVertex.equals(initialHead.val)).toBeTruthy();

  //     //       expect(node1.prev.val).toEqual(startNode.val);

  //     //       expect(node1).not.toEqual(polylineRoute.firstVertex);
  //     //       expect(node1).toEqual(initialTail.next);
  //     //       expect(node1.prev).toEqual(initialTail);
  //     //       expect(node1.next).toEqual(node2);

  //     //       expect(node3.prev).toEqual(node2);
  //     //       expect(node3.next).toBeNull();
  //     //     });

  //     //     it(`should insert the nodes between the two specified tail/head nodes in the track
  //     // and return the number of nodes inserted when the head/tail nodes are adjacent`, () => {
  //     //       const initialLength = polylineRoute.size();
  //     //       const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
  //     //       const initialTail = initialHead.next as VertexNode<RoutePoint, RouteSegment>;

  //     //       // Insert after first segment, over second segment
  //     //       const startNode = new VertexNode<RoutePoint, RouteSegment>(coords[1]);
  //     //       const endNode = new VertexNode<RoutePoint, RouteSegment>(coords[2]);

  //     //       const node1 = new VertexNode<RoutePoint, RouteSegment>([99, 140] as TestVertex);
  //     //       const node2 = new VertexNode<RoutePoint, RouteSegment>([666, 69] as TestVertex);
  //     //       const node3 = new VertexNode<RoutePoint, RouteSegment>([420, 171] as TestVertex);
  //     //       const nodes = [node1, node2, node3];

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //     //       expect(result).toEqual(3); // 3 inserted
  //     //       expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
  //     //       expect(polylineRoute.size().segments).toEqual(initialLength.segments + result);

  //     //       expect(node1.prev.val).toEqual(startNode.val);
  //     //       expect(node3.next.val).toEqual(endNode.val);

  //     //       expect(node1).not.toEqual(polylineRoute.firstVertex);
  //     //       expect(node1).toEqual(initialHead.next);
  //     //       expect(node1.prev).toEqual(initialHead);
  //     //       expect(node1.next).toEqual(node2);

  //     //       expect(node3.prev).toEqual(node2);
  //     //       expect(node3.next).toEqual(initialTail);
  //     //       expect(initialTail.prev).toEqual(node3);
  //     //     });

  //     //     it(`should insert the nodes between the two specified tail/head nodes in the track,
  //     // remove the original set of nodes between these same two points,
  //     // and return the number of nodes inserted+removed when the head/tail nodes are not adjacent`, () => {
  //     //       const initialLength = polylineRoute.size();
  //     //       const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
  //     //       const initialTail = initialHead?.next?.next?.next as VertexNode<RoutePoint, RouteSegment>;

  //     //       // Insert after first segment, over second segment
  //     //       const startNode = new VertexNode<RoutePoint, RouteSegment>(coords[1]);
  //     //       const endNode = new VertexNode<RoutePoint, RouteSegment>(coords[4]);

  //     //       const node1 = new VertexNode<RoutePoint, RouteSegment>([99, 140] as TestVertex);
  //     //       const node2 = new VertexNode<RoutePoint, RouteSegment>([666, 69] as TestVertex);
  //     //       const node3 = new VertexNode<RoutePoint, RouteSegment>([420, 171] as TestVertex);
  //     //       const nodes = [node1, node2, node3];

  //     //       const result = polylineRoute.replaceVerticesBetween(startNode, endNode, nodes);

  //     //       expect(result).toEqual(5); // 3 inserted, 2 removed
  //     //       expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
  //     //       expect(polylineRoute.size().segments).toEqual(initialLength.segments + 1);
  //     //       expect(node1.prev.val).toEqual(startNode.val);
  //     //       expect(node3.next.val).toEqual(endNode.val);

  //     //       expect(node1).not.toEqual(polylineRoute.firstVertex);
  //     //       expect(node1).toEqual(initialHead.next);
  //     //       expect(node1.prev).toEqual(initialHead);
  //     //       expect(node1.next).toEqual(node2);

  //     //       expect(node3.prev).toEqual(node2);
  //     //       expect(node3.next).toEqual(initialTail);
  //     //       expect(initialTail.prev).toEqual(node3);
  //     //     });
  //     //   });

  //     //   describe('#replaceVerticesFromTo', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });
  //   });

  //   describe('Splice', () => {
  //     // // prependPolyline(polylineRoute: IPolyline<TVertex, TSegment>): IPolyline<TVertex, TSegment>;
  //     // describe('#prependPolyline', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });

  //     // // appendPolyline(polylineRoute: IPolyline<TVertex, TSegment>): IPolyline<TVertex, TSegment>;
  //     // describe('#appendPolyline', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });
  //   });

  //   describe('Split', () => {
  //     // // splitAtVertex(vertex: VertexNode<TVertex, TSegment>): [IPolyline<TVertex, TSegment>, IPolyline<TVertex, TSegment>];
  //     // describe('#splitAtVertex', () => {
  //     //   it('should ', () => {
  //     //     it('should ', () => {

  //     //     });

  //     //     it('should ', () => {

  //     //     });
  //     //   });
  //     // });

  //     // // splitByVertices(vertices: VertexNode<TVertex, TSegment>[]): IPolyline<TVertex, TSegment>[];
  //     // describe('#splitByVertices', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });



  //     // // splitAtSubPolyline(polylineRoute: IPolyline<TVertex, TSegment>): [IPolyline<TVertex, TSegment>, IPolyline<TVertex, TSegment>, IPolyline<TVertex, TSegment>];
  //     // describe('#splitAtSubPolyline', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });

  //     // // splitBySubPolylines(polylineRoute: IPolyline<TVertex, TSegment>[]): IPolyline<TVertex, TSegment>[];
  //     // describe('#splitBySubPolylines', () => {
  //     //   it('should ', () => {

  //     //   });

  //     //   it('should ', () => {

  //     //   });
  //     // });
  //   });
  // });
});