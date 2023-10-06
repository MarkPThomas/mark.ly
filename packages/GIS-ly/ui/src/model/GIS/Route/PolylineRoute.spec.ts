import { VertexNode, SegmentNode } from "../../Geometry/Polyline";
import { GeoJsonManager } from "../GeoJsonManager";
import { PolylineRoute } from "./PolylineRoute";
import { RoutePoint } from "./RoutePoint";
import { RouteSegment } from "./RouteSegment";

describe('##PolylineRoute', () => {
  const sizeOf = (start: VertexNode<RoutePoint, RouteSegment>): number => {
    let count = 0;

    let currNode = start;
    while (currNode) {
      count++;
      currNode = currNode.next as VertexNode<RoutePoint, RouteSegment>;
    }

    return count;
  }

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
              [99.0, -1.0, 200],
              [103.5, 2.5, 300],
              [103.0, 3.0, 400],
              [104.75, 3.75, 500],
              [105.0, 5.0, 600],
            ]
          },
        }
      ],
    }
  });

  describe('Creation', () => {
    describe('#constructor', () => {
      let routePoints: RoutePoint[];

      beforeEach(() => {
        const coord1 = new RoutePoint(-8.957287, -77.777452);
        const coord2 = new RoutePoint(-8.957069, -77.777400);
        const coord3 = new RoutePoint(-8.956936, -77.777381);
        const coord4 = new RoutePoint(-8.956758, -77.777211);

        routePoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should create a new PolyLineRoute object from the provided RoutePoints', () => {
        const polylineRoute = new PolylineRoute(routePoints);

        expect(polylineRoute.firstVertex.val).toEqual(routePoints[0]);
        expect(polylineRoute.firstVertex.nextSeg).toEqual(polylineRoute.firstSegment);
        expect(polylineRoute.firstSegment.prevVert.val).toEqual(routePoints[0]);
        expect(polylineRoute.firstSegment.nextVert.val).toEqual(routePoints[1]);
      });
    });

    describe('Duplication', () => {
      let routePoints: RoutePoint[];
      let polylineRoute: PolylineRoute<RoutePoint, RouteSegment>;

      beforeEach(() => {
        const coord1 = new RoutePoint(-8.957287, -77.777452);
        const coord2 = new RoutePoint(-8.957069, -77.777400);
        const coord3 = new RoutePoint(-8.956936, -77.777381);
        const coord4 = new RoutePoint(-8.956758, -77.777211);
        const coord5 = new RoutePoint(-8.956768, -77.777311);
        const coord6 = new RoutePoint(-8.956778, -77.777411);

        routePoints = [
          coord1,
          coord2,
          coord3,
          coord4,
          coord5,
          coord6
        ];
        polylineRoute = new PolylineRoute(routePoints);
      });

      describe('#cloneFromToPoints', () => {
        beforeEach(() => {
          // Add properties to have more to track for point/segment copying
          polylineRoute.addProperties();
        });

        it('should return null for an empty Route', () => {
          const polyline = new PolylineRoute([]);

          const polylineCopy = polyline.cloneFromToPoints();

          expect(polylineCopy).toBeNull();
        });

        it('should return null if the start Point does not exist in the Route', () => {
          const nonExistingPoint = new RoutePoint(8.957287, 77.777452);

          const polylineCopy = polylineRoute.cloneFromToPoints(nonExistingPoint, routePoints[2]);

          expect(polylineCopy).toBeNull();
        });

        it('should return null if the end Point does not exist in the Route', () => {
          const nonExistingPoint = new RoutePoint(8.957287, 77.777452);

          const polylineCopy = polylineRoute.cloneFromToPoints(routePoints[2], nonExistingPoint);

          expect(polylineCopy).toBeNull();
        });

        it('should copy the Route from the head to tail if no Points are given', () => {
          const polylineCopy = polylineRoute.cloneFromToPoints();

          expect(polylineCopy.size()).toEqual({
            vertices: 6,
            segments: 5
          });
          expect(polylineCopy.firstVertex.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.prevVert.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.nextVert.val.equals(routePoints[1])).toBeTruthy();
          expect(polylineCopy.lastSegment.prevVert.val.equals(routePoints[4])).toBeTruthy();
          expect(polylineCopy.lastSegment.nextVert.val.equals(routePoints[5])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.equals(routePoints[5])).toBeTruthy();
        });

        it('should copy the Route from the head to the end Point if only the end Point is given', () => {
          const polylineCopy = polylineRoute.cloneFromToPoints(null, routePoints[2]);

          expect(polylineCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineCopy.firstVertex.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.prevVert.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.nextVert.val.equals(routePoints[1])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.lastVertex.val.lng).toEqual(routePoints[2].lng);
        });

        it('should copy the Route from the start Point to the tail if only the start Point is given', () => {
          const polylineCopy = polylineRoute.cloneFromToPoints(routePoints[2]);

          expect(polylineCopy.size()).toEqual({
            vertices: 4,
            segments: 3
          });
          expect(polylineCopy.firstVertex.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.firstVertex.val.lng).toEqual(routePoints[2].lng);
          expect(polylineCopy.firstSegment.prevVert.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.firstSegment.prevVert.val.lng).toEqual(routePoints[2].lng);
          expect(polylineCopy.firstSegment.nextVert.val.equals(routePoints[3])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.equals(routePoints[5])).toBeTruthy();
        });

        // TODO: Currently assumed that lat/long are not unique, allowing a route to revisit the same lat/lng
        //   This will not clone correctly as it will always use the first occurrence.
        //   Determine how/whether this can/should be supported, e.g. by having arguments that specify which # occurrence is to be chosen?
        //  Make associated test if enabled.

        it('should copy the Route from the start Point to the end Point', () => {
          const startPoint = routePoints[2];
          const endPoint = routePoints[4];

          const polylineCopy = polylineRoute.cloneFromToPoints(startPoint, endPoint);

          expect(polylineCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineCopy.firstVertex.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.firstVertex.val.lng).toEqual(routePoints[2].lng);
          expect(polylineCopy.firstSegment.prevVert.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.firstSegment.prevVert.val.lng).toEqual(routePoints[2].lng);
          expect(polylineCopy.firstSegment.nextVert.val.equals(routePoints[3])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.lat).toEqual(routePoints[4].lat);
          expect(polylineCopy.lastVertex.val.lng).toEqual(routePoints[4].lng);
        });

        it('should copy the Route by value rather than by reference', () => {
          const startPoint = routePoints[0];
          const endPoint = routePoints[2];

          const polylineCopy = polylineRoute.cloneFromToPoints(startPoint, endPoint);

          expect(polylineCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineCopy.firstVertex.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.prevVert.val.equals(routePoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.nextVert.val.equals(routePoints[1])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.lat).toEqual(routePoints[2].lat);
          expect(polylineCopy.lastVertex.val.lng).toEqual(routePoints[2].lng);

          // Make original polylineRoute different to ensure copy is by value and not by reference
          let node = polylineRoute.firstVertex;

          const coord1New = new RoutePoint(-9, -77.777452);
          node.val = coord1New;
          node = node.next as VertexNode<RoutePoint, RouteSegment>;

          const coord2New = new RoutePoint(-8, -77.777400);
          node.val = coord2New;
          node = node.next as VertexNode<RoutePoint, RouteSegment>;

          const coord3New = new RoutePoint(-7, -77.777381);
          node.val = coord3New;
          node = node.next as VertexNode<RoutePoint, RouteSegment>;

          expect(polylineRoute.firstSegment.prevVert.val.equals(coord1New)).toBeTruthy();
          expect(polylineRoute.firstSegment.nextVert.val.equals(coord2New)).toBeTruthy();
          expect(polylineCopy.firstVertex.val.equals(polylineRoute.firstVertex.val)).toBeFalsy();
          expect(polylineCopy.lastVertex.val.equals(polylineRoute.lastVertex.val)).toBeFalsy();
        });

        it(`should update the 2nd-order properties of the first and last Point of the copied Route`, () => {
          const vertex1 = polylineRoute.vertexNodesByVertex(routePoints[2])[0];
          const vertex2 = polylineRoute.vertexNodesByVertex(routePoints[4])[0];

          expect(vertex1.val.path.rotation).toBeCloseTo(-0.6161, 4);
          expect(vertex2.val.path.rotation).toBeCloseTo(0.0000037, 7);

          const startPoint = routePoints[2];
          const endPoint = routePoints[4];

          const polylineCopy = polylineRoute.cloneFromToPoints(startPoint, endPoint);

          expect(polylineCopy.firstVertex.val.path.rotation).toBeNull();
          expect(polylineCopy.lastVertex.val.path.rotation).toBeNull();
        });
      });
    });
  });

  describe('Common Interfaces', () => {
    let routePoints: RoutePoint[];
    let polylineRoute: PolylineRoute<RoutePoint, RouteSegment>;

    beforeEach(() => {
      const coord1 = new RoutePoint(-8.957287, -77.777452);
      const coord2 = new RoutePoint(-8.957069, -77.777400);
      const coord3 = new RoutePoint(-8.956936, -77.777381);
      const coord4 = new RoutePoint(-8.956758, -77.777211);
      const coord5 = new RoutePoint(-8.956768, -77.777311);
      const coord6 = new RoutePoint(-8.956778, -77.777411);

      routePoints = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5,
        coord6
      ];
      polylineRoute = new PolylineRoute(routePoints);
    });

    describe('#clone', () => {
      it('should clone the Route Polyline', () => {
        const polylineClone = polylineRoute.clone();

        expect(polylineClone.equals(polylineRoute)).not.toBeTruthy();

        expect(polylineClone.size()).toEqual({
          vertices: 6,
          segments: 5
        });
        expect(polylineClone.firstVertex.val.equals(routePoints[0])).toBeTruthy();
        expect(polylineClone.firstSegment.prevVert.val.equals(routePoints[0])).toBeTruthy();
        expect(polylineClone.firstSegment.nextVert.val.equals(routePoints[1])).toBeTruthy();
        expect(polylineClone.lastSegment.prevVert.val.equals(routePoints[4])).toBeTruthy();
        expect(polylineClone.lastSegment.nextVert.val.equals(routePoints[5])).toBeTruthy();
        expect(polylineClone.lastVertex.val.equals(routePoints[5])).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Route Polylines with differing RoutePoints', () => {
        const polyline1 = new PolylineRoute(routePoints);

        const routePointsDifferent = [
          new RoutePoint(-8.957287, -77.777452),
          new RoutePoint(-8.957069, -77.777400),
          new RoutePoint(-8.956936, -77.777381),
          new RoutePoint(-8.956658, -77.777111), // Only differs by lat/long
          new RoutePoint(-8.956768, -77.777311),
          new RoutePoint(-8.956778, -77.777411)
        ];
        const polyline2 = new PolylineRoute(routePointsDifferent);

        const result = polyline1.equals(polyline2);

        expect(result).toBeFalsy();
      });

      it('should return True for Route Polylines with identical RoutePoints', () => {
        const polyline1 = new PolylineRoute(routePoints);
        const polyline2 = new PolylineRoute(routePoints);

        const result = polyline1.equals(polyline2);

        expect(result).toBeTruthy();
      });
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

    // Use mocks
    describe('#addElevationsFromApi', () => {
      it('should ', () => {

      });
    });
  });

  describe('Query Methods', () => {
    let routePoints: RoutePoint[];
    let polylineRoute: PolylineRoute<RoutePoint, RouteSegment>;

    beforeEach(() => {
      const coord1 = new RoutePoint(-8.957287, -77.777452);
      const coord2 = new RoutePoint(-8.957069, -77.777400);
      const coord3 = new RoutePoint(-8.956936, -77.777381);
      const coord4 = new RoutePoint(-8.956758, -77.777211);
      const coord5 = new RoutePoint(-8.956768, -77.777311);
      const coord6 = new RoutePoint(-8.956778, -77.777411);

      routePoints = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5,
        coord6
      ];
      polylineRoute = new PolylineRoute(routePoints);
    });

    describe('#vertexNodesByPoint', () => {
      it('should return an empty array if null is given for the vertex', () => {
        const nodes = polylineRoute.vertexNodesByPoint(null);

        expect(nodes.length).toEqual(0);
      });

      it('should return an empty array if the given vertex is not found', () => {
        const nonExistingVertex = new RoutePoint(-1, 2);
        const nodes = polylineRoute.vertexNodesByPoint(nonExistingVertex);

        expect(nodes.length).toEqual(0);
      });

      it('should return the vertex nodes corresponding to vertices matching on values', () => {
        const existingVertex = routePoints[2];
        const nodes = polylineRoute.vertexNodesByPoint(existingVertex);

        expect(nodes.length).toEqual(1);
        expect(nodes[0].equals(routePoints[2])).toBeTruthy();
      });
    });

    // TODO: Test
    describe('#isPolylineRoute', () => {

    });
  });

  describe('Manipulating Route', () => {
    let routePoints: RoutePoint[];
    let polylineRoute: PolylineRoute<RoutePoint, RouteSegment>;

    beforeEach(() => {
      const positions = lineStringRoute.features[0].geometry.coords;
      routePoints = GeoJsonManager.PositionsToRoutePoints(positions);
      polylineRoute = new PolylineRoute(routePoints);
    });

    describe('Trim', () => {
      let point1: RoutePoint;
      let point2: RoutePoint;

      beforeEach(() => {
        routePoints = [
          new RoutePoint(39.74007868370209, -105.0076261841355, 0),
          new RoutePoint(39.74005097339472, -104.9998123858178, 0),
          new RoutePoint(39.73055300708892, -104.9990802128465, 0),
          new RoutePoint(39.73993779411854, -104.9985377946692, 0),
          new RoutePoint(39.73991441833991, -104.9917491337653, 0),
          new RoutePoint(39.739914418342, -104.99174913377, 0)
        ];
        routePoints[0].elevation = 1000;
        routePoints[1].elevation = 2000;
        routePoints[2].elevation = 1500;
        routePoints[3].elevation = 1600;
        routePoints[4].elevation = 5000;
        routePoints[5].elevation = 4000;

        polylineRoute = new PolylineRoute(routePoints);
        polylineRoute.addProperties();
        polylineRoute.addElevationProperties();


        point1 = routePoints[2];
        point2 = routePoints[3];
      });

      describe('#trimBeforePoint', () => {
        it('should do nothing and return null on an empty Route', () => {
          polylineRoute = new PolylineRoute([]);

          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;


          const trimmedPoint = polylineRoute.trimBeforePoint(point1);

          expect(trimmedPoint).toBeNull();
          expect(polylineRoute.size().vertices).toEqual(0);
          expect(polylineRoute.size().segments).toEqual(0);
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified Point does not exist in the Route', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const nonExistingPoint = new RoutePoint(-39.74007868370209, 105.0076261841355, 0);
          const trimmedPoint = polylineRoute.trimBeforePoint(nonExistingPoint);

          expect(trimmedPoint).toBeNull();
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.size().vertices).toEqual(6);
          expect(polylineRoute.size().segments).toEqual(5);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();
        });

        it('should trim off vertices & segments before the specified Point & return the head vertex node of the trimmed portion', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point1)[0];
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          const trimmedPoint = polylineRoute.trimBeforePoint(point1);

          expect(trimmedPoint).toEqual(originalVertexHead);

          expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();

          // New Head
          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it(`should update the 2nd-order properties of the start Point after trimming`, () => {
          const vertex = polylineRoute.vertexNodesByPoint(point1)[0];

          expect(vertex.val.path.rotation).toBeCloseTo(3.038, 3);

          polylineRoute.trimBeforePoint(point1);

          expect(vertex.val.path.rotation).toBeNull();
        });
      });

      describe('#trimAfterPoint', () => {
        it('should do nothing and return null on an empty Route', () => {
          polylineRoute = new PolylineRoute([]);

          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;


          const trimmedPoint = polylineRoute.trimAfterPoint(point2);

          expect(trimmedPoint).toBeNull();
          expect(polylineRoute.size().vertices).toEqual(0);
          expect(polylineRoute.size().segments).toEqual(0);
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified Point does not exist in the Route', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const nonExistingPoint = new RoutePoint(-39.74007868370209, 105.0076261841355, 0);
          const trimmedPoint = polylineRoute.trimAfterPoint(nonExistingPoint);

          expect(trimmedPoint).toBeNull();
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.size().vertices).toEqual(6);
          expect(polylineRoute.size().segments).toEqual(5);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();
        });

        it(`should trim off vertices & segments after the specified Point & return the head vertex node of the trimmed portion`, () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point2)[0];
          const vertexTrimmed = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const trimmedPoint = polylineRoute.trimAfterPoint(point2);

          expect(trimmedPoint).toEqual(vertexTrimmed);

          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1 - 2])).toBeTruthy();

          // New Tail
          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        it(`should update the 2nd-order properties of the end Point after trimming`, () => {
          const vertex = polylineRoute.vertexNodesByPoint(point2)[0];

          expect(vertex.val.path.rotation).toBeCloseTo(-1.531, 3);

          polylineRoute.trimAfterPoint(point2);

          expect(vertex.val.path.rotation).toBeNull();
        });
      });

      describe('#trimToPoints', () => {
        it('should do nothing and return a null tuple on an empty Route', () => {
          polylineRoute = new PolylineRoute([]);

          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const trimmedPoints = polylineRoute.trimToPoints(point1, point2);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineRoute.size().vertices).toEqual(0);
          expect(polylineRoute.size().segments).toEqual(0);
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.vertices()).toEqual([]);
        });

        it('should do nothing and return a null tuple when the specified Point does not exist in the Route', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const nonExistingPoint1 = new RoutePoint(-39.74007868370209, 105.0076261841355, 0);
          const nonExistingPoint2 = new RoutePoint(40.74007868370209, 105.0076261841355, 0);
          const trimmedPoints = polylineRoute.trimToPoints(nonExistingPoint1, nonExistingPoint2);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);
          expect(polylineRoute.size().vertices).toEqual(6);
          expect(polylineRoute.size().segments).toEqual(5);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();
        });

        it(`should trim off vertices & segments before & after the specified start & end Points
          & return the head vertex node of each of the trimmed portions`, () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          // Trim before state
          const vertex1 = polylineRoute.vertexNodesByPoint(point1)[0];
          const trimmed1 = polylineRoute.firstVertex;
          const segmentNext = vertex1.nextSeg;
          const trimmedVertexTail = vertex1.prev as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex1.prev).not.toBeNull();
          expect(vertex1.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          // Derived Properties
          expect(vertex1.val.path.rotation).toBeCloseTo(3.038, 3);

          // Trim after state
          const vertex2 = polylineRoute.vertexNodesByPoint(point2)[0];
          const trimmed2 = vertex2.next;
          const segmentPrev = vertex2.prevSeg;
          const trimmedVertexHead = vertex2.next as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex2.next).not.toBeNull();
          expect(vertex2.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          // Derived Properties
          expect(vertex2.val.path.rotation).toBeCloseTo(-1.531, 3);


          const trimmedPoints = polylineRoute.trimToPoints(point1, point2);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(2);
          expect(polylineRoute.size().segments).toEqual(1);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1 - 2])).toBeTruthy();

          // New Head
          expect(vertex1.prev).toBeNull();
          expect(vertex1.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();

          // Derived Properties
          expect(vertex1.val.path.rotation).toBeNull();


          // New Tail
          expect(vertex2.next).toBeNull();
          expect(vertex2.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();

          // Derived Properties
          expect(vertex2.val.path.rotation).toBeNull();
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not specified', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point1)[0];
          const trimmed1 = polylineRoute.firstVertex;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();


          const trimmedPoints = polylineRoute.trimToPoints(point1, null);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not found', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point1)[0];
          const trimmed1 = polylineRoute.firstVertex;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          const nonExistingPoint = new RoutePoint(-39.74007868370209, 105.0076261841355, 0);
          const trimmedPoints = polylineRoute.trimToPoints(point1, nonExistingPoint);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          expect(polylineRoute.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1])).toBeTruthy();

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not specified', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point2)[0];
          const trimmed2 = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const trimmedPoints = polylineRoute.trimToPoints(null, point2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1 - 2])).toBeTruthy();

          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not found', () => {
          const originalVertexHead = polylineRoute.firstVertex;
          const originalSegmentHead = polylineRoute.firstSegment;
          const originalVertexTail = polylineRoute.lastVertex;
          const originalSegmentTail = polylineRoute.lastSegment;

          const vertex = polylineRoute.vertexNodesByPoint(point2)[0];
          const trimmed2 = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<RoutePoint, RouteSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<RoutePoint, RouteSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();


          const nonExistingPoint = new RoutePoint(-39.74007868370209, 105.0076261841355, 0);
          const trimmedPoints = polylineRoute.trimToPoints(nonExistingPoint, point2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineRoute.firstVertex).toEqual(originalVertexHead);
          expect(polylineRoute.firstSegment).toEqual(originalSegmentHead);
          expect(polylineRoute.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineRoute.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineRoute.size().vertices).toEqual(4);
          expect(polylineRoute.size().segments).toEqual(3);

          const vertices = polylineRoute.vertices();
          expect(vertices[0].equals(routePoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(routePoints[routePoints.length - 1 - 2])).toBeTruthy();

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
      describe('#removeAtPoint', () => {
        it('should do nothing & return null for an empty Route', () => {
          const existingPoint = routePoints[0];
          const polylineRoute = new PolylineRoute([]);

          const pointRemoved = polylineRoute.removeAtPoint(existingPoint);

          expect(pointRemoved).toBeNull();

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(0);
          expect(polylineTrackLength.segments).toEqual(0);
        });

        it('should do nothing & return null for a Point provided that is not in the Route', () => {
          const nonExistingPoint = new RoutePoint(-1, -2, undefined);

          const pointRemoved = polylineRoute.removeAtPoint(nonExistingPoint);

          expect(pointRemoved).toBeNull();

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(routePoints.length);
          expect(polylineTrackLength.segments).toEqual(routePoints.length - 1);
        });

        it('should remove & return the valid Point provided', () => {
          const existingPoint = routePoints[1];

          const pointRemoved = polylineRoute.removeAtPoint(existingPoint);
          expect(pointRemoved.equals(existingPoint)).toBeTruthy();

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(routePoints.length - 1);
          expect(polylineTrackLength.segments).toEqual(routePoints.length - 1 - 1);
        });

        it(`should update the segment property spanning over the removed Point`, () => {
          const existingPoint = routePoints[1];

          const removedVertexNode = polylineRoute.vertexNodesByVertex(existingPoint)[0];
          const prevSegmentNode = removedVertexNode.prevSeg;
          expect(prevSegmentNode.val.angle).toBeCloseTo(-2.3562, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'S',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(157249.4, 1);

          polylineRoute.removeAtPoint(existingPoint);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6202, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(200, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(478166.9, 1);
        });

        it(`should update the 2nd-order properties of the Points just before and just after the removed Point`, () => {
          polylineRoute.addProperties();
          const existingPoint = routePoints[2];

          const removedVertexNode = polylineRoute.vertexNodesByVertex(existingPoint)[0];
          const prevVertexNode = removedVertexNode.prev;
          expect(prevVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          const nextVertexNode = removedVertexNode.next;
          expect(nextVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          polylineRoute.removeAtPoint(existingPoint);

          expect(prevVertexNode.val.path.rotation).toBeCloseTo(3.1417, 4);
          expect(nextVertexNode.val.path.rotation).toBeCloseTo(-0.3801, 4);
        });
      });

      describe('#removeAtAnyPoint', () => {
        it('should do nothing & return null for Points provided that are not in the Route', () => {
          const nonExistingPoint = new RoutePoint(-1, -2, undefined);

          const pointsRemoved = polylineRoute.removeAtAnyPoint([nonExistingPoint]);

          expect(pointsRemoved.length).toEqual(0);

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(routePoints.length);
          expect(polylineTrackLength.segments).toEqual(routePoints.length - 1);
        });

        it('should remove the Points provided & return the Points removed', () => {
          const point1 = routePoints[0];
          const point2 = routePoints[3];

          const pointsRemoved = polylineRoute.removeAtAnyPoint([point1, point2]);

          expect(pointsRemoved.length).toEqual(2);
          expect(pointsRemoved[0].equals(point1)).toBeTruthy();
          expect(pointsRemoved[1].equals(point2)).toBeTruthy();

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(routePoints.length - 2);
          expect(polylineTrackLength.segments).toEqual(routePoints.length - 2 - 1);
        });

        it(`should remove the valid Points provided, ignoring ones that are not found in the Route,
        & return the actual Points removed`, () => {
          const point1 = routePoints[0];
          const point2 = new RoutePoint(-1, -2, undefined);
          const point3 = routePoints[3];

          const pointsRemoved = polylineRoute.removeAtAnyPoint([point1, point2, point3]);

          expect(pointsRemoved.length).toEqual(2);
          expect(pointsRemoved[0].equals(point1)).toBeTruthy();
          expect(pointsRemoved[1].equals(point3)).toBeTruthy();

          const polylineTrackLength = polylineRoute.size();
          expect(polylineTrackLength.vertices).toEqual(routePoints.length - 2);
          expect(polylineTrackLength.segments).toEqual(routePoints.length - 2 - 1);
        });
      });

      describe('#removeBetweenPoints', () => {
        it('should do nothing & return null if the head & tail Points are both unspecified', () => {
          const initialLength = polylineRoute.size();

          const startPoint = null;
          const endPoint = null;

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null if only a tail Point is provided & tail Point is at the head of the Route`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = null;
          const endPoint = routePoints[0];

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null if only a head Point is provided & head Point is at the tail of the Route`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[routePoints.length - 1];
          const endPoint = null;

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null when the head/tail Points are the same`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[1];

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null when the head/tail Points are adjacent`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[2];

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are not adjacent`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const removedPointsHead = polylineRoute.removeBetweenPoints(startPoint, endPoint);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(2);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - 2);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - 2);
        });

        it(`should update the segment property spanning over the removed Points`, () => {
          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const startVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0];
          const prevSegmentNode = startVertexNode.nextSeg;
          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6905, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(300, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(829032.4, 1);
        });

        it(`should update the 2nd-order properties of the Points just before and just after the removed Points`, () => {
          polylineRoute.addProperties();
          const startPoint = routePoints[2];
          const endPoint = routePoints[4];

          const priorStartVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0];
          expect(priorStartVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);
          const priorEndVertexNode = polylineRoute.vertexNodesByVertex(endPoint)[0];
          expect(priorEndVertexNode.val.path.rotation).toBeCloseTo(0.9684, 4);

          polylineRoute.removeBetweenPoints(startPoint, endPoint);

          expect(priorStartVertexNode.val.path.rotation).toBeCloseTo(0.1248, 4);
          expect(priorEndVertexNode.val.path.rotation).toBeCloseTo(0.5879, 4);
        });
      });

      describe('#removeFromToPoints', () => {
        it('should do nothing & return null if the head & tail Points are both unspecified', () => {
          const initialLength = polylineRoute.size();

          const startPoint = null;
          const endPoint = null;

          const removedPointsHead = polylineRoute.removeFromToPoints(startPoint, endPoint);

          expect(removedPointsHead).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should remove and return the Point when the head/tail Points are the same`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[1];

          const removedPointsHead = polylineRoute.removeFromToPoints(startPoint, endPoint);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(1);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are adjacent`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[2];

          const removedPointsHead = polylineRoute.removeFromToPoints(startPoint, endPoint);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(2);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are not adjacent`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const removedPointsHead = polylineRoute.removeFromToPoints(startPoint, endPoint);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(4);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });
      });
    });

    describe('Insert', () => {
      describe('#prependPoint', () => {
        it(`should insert the Point at the head of the Route & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex;

          const point = new RoutePoint(1.1, 101.5, 200);

          const insertedCount = polylineRoute.prependPoints(point);

          expect(insertedCount).toEqual(1);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(polylineRoute.firstVertex.val).toEqual(point);
          expect(point).toEqual(polylineRoute.firstVertex.val);
          expect(initialHead.prev.val).toEqual(point);
        });

        it(`should insert the Points at the head of the Route & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const insertedCount = polylineRoute.prependPoints(points);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineRoute.firstVertex.val).toEqual(point1);
          expect(point1).toEqual(polylineRoute.firstVertex.val);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should insert the Points at the head of the Route & return the number of Points inserted if requested`, () => {
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineRoute.prependPoints(points, returnListCount);

          expect(insertedCount).toEqual(3);
        });

        it(`should update the 2nd-order properties of the Point just after the prepended Points`, () => {
          polylineRoute.addProperties();
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const startVertexNode = polylineRoute.firstVertex;
          expect(startVertexNode.val.path.rotation).toBeNull();

          polylineRoute.prependPoints(points);
          expect(startVertexNode.val.path.rotation).toBeCloseTo(0.6017, 4);
        });
      });

      describe('#prependRoute', () => {
        it(`should insert the provided Route at the head of the Route & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const insertedCount = polylineRoute.prependRoute(insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineRoute.firstVertex.val).toEqual(point1);
          expect(point1).toEqual(polylineRoute.firstVertex.val);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should insert the provided Route at the head of the Route & return the number of Points inserted if requested`, () => {
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const returnListCount = true;

          const insertedCount = polylineRoute.prependRoute(insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
        });

        it(`should update the 2nd-order properties of the last Point of the prepended Route and first Point of the original Route`, () => {
          polylineRoute.addProperties();
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const startVertexNode = polylineRoute.firstVertex;
          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(startVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          polylineRoute.prependRoute(insertedRoute);

          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(-2.9779, 4);
          expect(startVertexNode.val.path.rotation).toBeCloseTo(0.6017, 4);
        });
      });

      describe('#appendPoint', () => {
        it(`should insert the Point at the tail of track & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialTail = polylineRoute.lastVertex;

          const point = new RoutePoint(1.3, 107, 240);

          const insertedCount = polylineRoute.appendPoints(point);

          expect(insertedCount).toEqual(1);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(polylineRoute.lastVertex.val).toEqual(point);
          expect(point).toEqual(polylineRoute.lastVertex.val);
          expect(initialTail.next.val).toEqual(point);
        });

        it(`should insert the Points at the tail of track & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialTail = polylineRoute.lastVertex;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const insertedCount = polylineRoute.appendPoints(points);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineRoute.lastVertex.val).toEqual(point3);
          expect(point1).toEqual(initialTail.next.val);
        });

        it(`should insert the Points at the tail of track & return the number of Points inserted if requested`, () => {
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineRoute.appendPoints(points, returnListCount);

          expect(insertedCount).toEqual(3);
        });

        it(`should update the 2nd-order properties of the Point just before the appended Points`, () => {
          polylineRoute.addProperties();
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const endVertexNode = polylineRoute.lastVertex;
          expect(endVertexNode.val.path.rotation).toBeNull()

          polylineRoute.appendPoints(points);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-3.6741, 4);
        });
      });

      describe('#appendRoute', () => {
        it(`should insert the provided Route at the tail of the Route & return 1`, () => {
          const initialLength = polylineRoute.size();
          const initialTail = polylineRoute.lastVertex;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const insertedCount = polylineRoute.appendRoute(insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineRoute.lastVertex.val).toEqual(point3);
          expect(point1).toEqual(initialTail.next.val);
        });

        it(`should insert the provided Route at the tail of the Route & return the number of Points inserted if requested`, () => {
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const returnListCount = true;

          const insertedCount = polylineRoute.appendRoute(insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
        });

        it(`should update the 2nd-order properties of the last Point of the prepended Route and first Point of the original Route`, () => {
          polylineRoute.addProperties();
          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const endVertexNode = polylineRoute.lastVertex;
          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(endVertexNode.val.path.rotation).toBeNull();
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          polylineRoute.appendRoute(insertedRoute);

          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(2.4977, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-3.6741, 4);
        });
      });

      describe('#insertBeforePoint', () => {
        it(`should do nothing & return 0 if the specified target Point does not exist in the Route`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = new RoutePoint(-1, -2, undefined);
          const insertionPoint = new RoutePoint(1.1, 101.5, 200);

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertionPoint);

          expect(insertedCount).toEqual(0);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments);
        });

        it(`should insert the Point before the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalPrevTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[1])[0];

          const insertionPoint = new RoutePoint(1.1, 101.5, 200);

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertionPoint);

          expect(insertedCount).toEqual(1);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(originalPrevTargetPointNode.next.val).toEqual(insertionPoint);
          expect(targetPointNode.prev.val).toEqual(insertionPoint);
        });

        it(`should insert the Points before the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalPrevTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[1])[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(originalPrevTargetPointNode.next.val).toEqual(point1);
          expect(targetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Points before the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should insert the Route before the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalPrevTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[1])[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(originalPrevTargetPointNode.next.val).toEqual(point1);
          expect(targetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Route before the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const returnListCount = true;

          const insertedCount = polylineRoute.insertBeforePoint(targetPoint, insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          polylineRoute.addProperties();
          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 205);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const targetVertex = polylineRoute.vertexNodesByVertex(targetPoint)[0];
          const startVertexNode = targetVertex.prev as VertexNode<RoutePoint, RouteSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          polylineRoute.insertBeforePoint(targetPoint, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineRoute.addProperties();
          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const targetVertex = polylineRoute.vertexNodesByVertex(targetPoint)[0];
          const startVertexNode = targetVertex.prev as VertexNode<RoutePoint, RouteSegment>;
          const insertStartVertexNode = insertedRoute.firstVertex;
          const insertEndVertexNode = insertedRoute.lastVertex;
          const endVertexNode = targetVertex;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);

          polylineRoute.insertBeforePoint(targetPoint, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7912, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-0.4555, 4);
        });
      });

      describe('#insertAfterPoint', () => {
        it(`should do nothing & return 0 if the specified target Point does not exist in the Route`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = new RoutePoint(-1, -2, undefined);
          const insertionPoint = new RoutePoint(1.1, 101.5, 200);

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertionPoint);

          expect(insertedCount).toEqual(0);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments);
        });

        it(`should insert the Point after the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalNextTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[3])[0];

          const insertionPoint = new RoutePoint(1.1, 101.5, 200);

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertionPoint);

          expect(insertedCount).toEqual(1);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(targetPointNode.next.val).toEqual(insertionPoint);
          expect(originalNextTargetPointNode.prev.val).toEqual(insertionPoint);
        });

        it(`should insert the Points after the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalNextTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[3])[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(targetPointNode.next.val).toEqual(point1);
          expect(originalNextTargetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Points after the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should insert the Route after the specified target Point & return 1`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];
          const targetPointNode = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const originalNextTargetPointNode = polylineRoute.vertexNodesByPoint(routePoints[3])[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(targetPointNode.next.val).toEqual(point1);
          expect(originalNextTargetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Route after the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const returnListCount = true;

          const insertedCount = polylineRoute.insertAfterPoint(targetPoint, insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          polylineRoute.addProperties();
          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const targetVertex = polylineRoute.vertexNodesByVertex(targetPoint)[0];
          const startVertexNode = targetVertex as VertexNode<RoutePoint, RouteSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(2.3557, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(78581.3, 1);

          polylineRoute.insertAfterPoint(targetPoint, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(-2.5304, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'S',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(-100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(271367.0, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineRoute.addProperties();
          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const targetVertex = polylineRoute.vertexNodesByVertex(targetPoint)[0];
          const startVertexNode = targetVertex as VertexNode<RoutePoint, RouteSegment>;
          const insertStartVertexNode = insertedRoute.firstVertex;
          const insertEndVertexNode = insertedRoute.lastVertex;
          const endVertexNode = targetVertex.next;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          polylineRoute.insertAfterPoint(targetPoint, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(-3.1915, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(2.7279, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);
        });
      });
    });

    describe('Replace', () => {
      it('should do nothing & return null if Route is empty', () => {
        polylineRoute = new PolylineRoute([]);
        const targetPoint = routePoints[2];;

        const point1 = new RoutePoint(1.1, 101.5, 200);
        const point2 = new RoutePoint(1.2, 102, 210);
        const point3 = new RoutePoint(1.3, 107, 240);
        const points = [point1, point2, point3];

        const result = polylineRoute.replaceAtPoint(targetPoint, points);

        expect(result).toBeNull();
        expect(polylineRoute.size().vertices).toEqual(0);
        expect(polylineRoute.size().segments).toEqual(0);
      });

      describe('#replaceAtPoint', () => {
        it('should do nothing & return null if the target Point is not specified', () => {
          const initialLength = polylineRoute.size();

          const targetPoint = null;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceAtPoint(targetPoint, points);

          expect(result).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it('should do nothing & return null if the target Point does not exist in the Route', () => {
          const initialLength = polylineRoute.size();

          const targetPoint = new RoutePoint(-1, -2, undefined);

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceAtPoint(targetPoint, points);

          expect(result).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should replace the specified Point with the provided Point
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are the same`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[2])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[2])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const targetPoint = routePoints[2];

          const point = new RoutePoint(1.1, 101.5, 200);

          const result = polylineRoute.replaceAtPoint(targetPoint, point);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 1);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 1);

          expect(initialHead.next.val).toEqual(point);
          expect(initialTail.prev.val).toEqual(point);
        });

        it(`should replace the specified target Point in the Route with the provided Points
         & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[2])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[2])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceAtPoint(targetPoint, points);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the specified target Point in the Route with the provided Route
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are the same`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[2])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[2])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const result = polylineRoute.replaceAtPoint(targetPoint, insertedRoute);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          polylineRoute.addProperties();

          const startPoint = routePoints[1];
          const targetPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 205);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const startVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0] as VertexNode<RoutePoint, RouteSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          polylineRoute.replaceAtPoint(targetPoint, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the remaining Points just before & just after the inserted Points`, () => {
          polylineRoute.addProperties();

          const startPoint = routePoints[1];
          const targetPoint = routePoints[2];
          const endPoint = routePoints[3];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const startVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0] as VertexNode<RoutePoint, RouteSegment>;
          const insertStartVertexNode = insertedRoute.firstVertex;
          const insertEndVertexNode = insertedRoute.lastVertex;
          const endVertexNode = polylineRoute.vertexNodesByVertex(endPoint)[0] as VertexNode<RoutePoint, RouteSegment>;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          polylineRoute.replaceAtPoint(targetPoint, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);
        });
      });

      describe('#replaceBetweenPoints', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = polylineRoute.size();

          const startPoint = null;
          const endPoint = null;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it('should do nothing & return null if the start/end Points are the same', () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[2];
          const endPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startPoint = routePoints[0];
          const endPoint = routePoints[3];

          const initialLength = polylineRoute.size();

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, []);

          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - 2);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - 2);
        });

        it(`should insert the Points at the start of the Route & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Route, `, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex;

          const startPoint = null;
          const endPoint = routePoints[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result.removed).toBeNull();
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineRoute.firstVertex.val).toEqual(point1);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should insert the Points at the end of the Route and return a truthy number of Points inserted
          if only a start Point is provided and the start Point is at the end of the Route`, () => {
          const initialLength = polylineRoute.size();
          const initialTail = polylineRoute.lastVertex;

          const startPoint = routePoints[routePoints.length - 1];
          const endPoint = null;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result.removed).toBeNull();
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(initialTail.next.val).toEqual(point1);
          expect(polylineRoute.lastVertex.val).toEqual(point3);
        });

        it(`should insert the Points between the specified start/end Points in the Route
          & return a truthy number of points inserted when the start/end Points are adjacent`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
          const initialTail = initialHead.next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[1];
          const endPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the Points between the specified start/end Points in the Route,
          remove the original set of Points between these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are not adjacent`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
          const initialTail = initialHead?.next?.next?.next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Route between the specified start/end Points in the Route,
          remove the original set of Points between these same two Points,
          & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;
          const initialTail = initialHead?.next?.next?.next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, insertedRoute);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const result = polylineRoute.replaceBetweenPoints(startPoint, endPoint, points, returnListCount);

          // 3 inserted, 2 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(2);
          expect(result.inserted).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + result.inserted);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + result.inserted);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          polylineRoute.addProperties();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 205);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const startVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0] as VertexNode<RoutePoint, RouteSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          polylineRoute.replaceBetweenPoints(startPoint, endPoint, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineRoute.addProperties();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const startVertexNode = polylineRoute.vertexNodesByVertex(startPoint)[0] as VertexNode<RoutePoint, RouteSegment>;
          const insertStartVertexNode = insertedRoute.firstVertex;
          const insertEndVertexNode = insertedRoute.lastVertex;
          const endVertexNode = polylineRoute.vertexNodesByVertex(endPoint)[0] as VertexNode<RoutePoint, RouteSegment>;

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeNull();
          expect(insertEndVertexNode.val.path.rotation).toBeNull();
          expect(endVertexNode.val.path.rotation).toBeCloseTo(0.9684, 4);

          polylineRoute.replaceBetweenPoints(startPoint, endPoint, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);
          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);
          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.2935, 4);
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-0.9397, 4);
        });
      });

      describe('#replaceFromToPoints', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = polylineRoute.size();

          const startPoint = null;
          const endPoint = null;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points);

          expect(result).toBeNull();
          expect(polylineRoute.size()).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startPoint = routePoints[0];
          const endPoint = routePoints[3];

          const initialLength = polylineRoute.size();

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, []);

          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(4);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removedCount);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removedCount);
        });

        it(`should replace the first Point in the Route & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Route, `, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.firstVertex.next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = null;
          const endPoint = routePoints[0];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(polylineRoute.firstVertex.val).toEqual(point1);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should replace the last Point in the route & return a truthy number of Points inserted
          if only a start Point is provided & the starty Node is at the end of the Route`, () => {
          const initialLength = polylineRoute.size();
          const initialTail = polylineRoute.lastVertex.prev;

          const startPoint = routePoints[routePoints.length - 1];
          const endPoint = null;

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialTail.next.val).toEqual(point1);
          expect(polylineRoute.lastVertex.val).toEqual(point3);
        });

        it(`should insert the provided Points at the specified start/end Point in the Route,
        remove the Point & return the head of the removed range & a truthy number of Points inserted
        when the start/end Points are the same`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[2])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[2])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[2];
          const endPoint = routePoints[2];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Points between the specified start/end Points in the Route,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the head/tail Points are adjacent`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[2])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[3])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[2];
          const endPoint = routePoints[3];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineRoute.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Route between the specified start/end Points in the Route,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineRoute.size();
          const initialHead = polylineRoute.vertexNodesByPoint(routePoints[1])[0].prev;
          const initialTail = polylineRoute.vertexNodesByPoint(routePoints[4])[0].next as VertexNode<RoutePoint, RouteSegment>;

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineRoute(points);

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, insertedRoute);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - 1); // 3 inserted - 4 removed
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const initialLength = polylineRoute.size();

          const startPoint = routePoints[1];
          const endPoint = routePoints[4];

          const point1 = new RoutePoint(1.1, 101.5, 200);
          const point2 = new RoutePoint(1.2, 102, 210);
          const point3 = new RoutePoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const result = polylineRoute.replaceFromToPoints(startPoint, endPoint, points, returnListCount);

          // 3 inserted, 2 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(4);
          expect(result.inserted).toEqual(3);
          expect(polylineRoute.size().vertices).toEqual(initialLength.vertices - removed + result.inserted);
          expect(polylineRoute.size().segments).toEqual(initialLength.segments - removed + result.inserted);
        });
      });
    });

    describe('Split', () => {
      it('should do nothing and return an empty array if the Route is empty', () => {
        polylineRoute = new PolylineRoute([]);

        const targetPoint = routePoints[3];

        const splitRoutes = polylineRoute.splitByPoint(targetPoint);

        expect(splitRoutes.length).toEqual(1);
        const firstRouteSize = splitRoutes[0].size();
        expect(firstRouteSize.vertices).toEqual(0);
        expect(firstRouteSize.segments).toEqual(0);
      });

      describe('#splitByPoint', () => {
        it(`should do nothing & return the original Route if the specified Point doesn't exist in the Route`, () => {
          const initialSize = polylineRoute.size()

          const targetPoint = new RoutePoint(-1, -2, undefined);

          const splitRoutes = polylineRoute.splitByPoint(targetPoint);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it(`should do nothing & return the original Route if the specified Point is the start of the Route`, () => {
          const initialSize = polylineRoute.size()

          const targetPoint = routePoints[0];

          const splitRoutes = polylineRoute.splitByPoint(targetPoint);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it(`should do nothing & return the original Route if the specified Point is the end of the Route`, () => {
          const initialSize = polylineRoute.size()

          const targetPoint = routePoints[routePoints.length - 1];

          const splitRoutes = polylineRoute.splitByPoint(targetPoint);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it('should split the Route and return each split Route', () => {
          const initialSize = polylineRoute.size()
          const initialHeadVertex = polylineRoute.firstVertex;
          const initialHeadSegment = polylineRoute.firstSegment;
          const initialTailVertex = polylineRoute.lastVertex;
          const initialTailSegment = polylineRoute.lastSegment;

          const targetPoint = routePoints[3];
          const initialSplitVertex = polylineRoute.vertexNodesByPoint(targetPoint)[0];
          const initialSplitPrevVertex = initialSplitVertex.prev;
          const initialSplitPrevSegment = initialSplitVertex.prevSeg;
          const initialSplitNextVertex = initialSplitVertex.next;
          const initialSplitNextSegment = initialSplitVertex.nextSeg;

          const splitRoutes = polylineRoute.splitByPoint(targetPoint);

          expect(splitRoutes.length).toEqual(2);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices - 2);
          expect(firstRouteSize.segments).toEqual(initialSize.segments - 2);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(initialSize.vertices - 3);
          expect(secondRouteSize.segments).toEqual(initialSize.segments - 3);

          expect(initialHeadVertex).toEqual(splitRoutes[0].firstVertex);
          expect(initialHeadSegment).toEqual(splitRoutes[0].firstSegment);

          expect(initialTailVertex).toEqual(splitRoutes[1].lastVertex);
          expect(initialTailSegment).toEqual(splitRoutes[1].lastSegment);

          expect(initialSplitVertex).toEqual(splitRoutes[0].lastVertex);
          expect(initialSplitVertex).not.toEqual(splitRoutes[1].firstVertex);
          expect(initialSplitVertex.val).toEqual(splitRoutes[1].firstVertex.val);

          expect(initialSplitPrevVertex).toEqual(splitRoutes[0].lastVertex.prev);
          expect(initialSplitPrevSegment).toEqual(splitRoutes[0].lastVertex.prevSeg);

          expect(initialSplitNextVertex).toEqual(splitRoutes[1].firstVertex.next);
          expect(initialSplitNextSegment).toEqual(splitRoutes[1].firstVertex.nextSeg);
        });

        it(`should update the 2nd-order properties of the last Point of the first split Route, and the first Point of the second split Route`, () => {
          polylineRoute.addProperties();
          const targetPoint = routePoints[3];

          const vertex = polylineRoute.vertexNodesByVertex(routePoints[3])[0];
          expect(vertex.val.path.rotation).toBeCloseTo(-1.9503, 4);

          const splitRoutes = polylineRoute.splitByPoint(targetPoint);

          expect(splitRoutes[0].lastVertex.val.path.rotation).toBeNull();
          expect(splitRoutes[1].firstVertex.val.path.rotation).toBeNull();
        });
      });

      describe('#splitByPoints', () => {
        it(`should do nothing & return one entry of the original Route if the specified Points don't exist in the Route`, () => {
          const initialSize = polylineRoute.size()

          const targetPoint1 = new RoutePoint(-1, -2, undefined);
          const targetPoint2 = new RoutePoint(-2, -3, undefined);
          const targetPoint3 = new RoutePoint(-3, -4, undefined);
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitRoutes = polylineRoute.splitByPoints(targetPoints);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it('should split the Route and return all sub-Routes demarcated by the provided Points', () => {
          const targetPoint1 = routePoints[2];
          const targetPoint2 = routePoints[3];
          const targetPoints = [targetPoint1, targetPoint2];

          const splitRoutes = polylineRoute.splitByPoints(targetPoints);

          expect(splitRoutes.length).toEqual(3);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(3);
          expect(firstRouteSize.segments).toEqual(2);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(2);
          expect(secondRouteSize.segments).toEqual(1);

          const thirdRouteSize = splitRoutes[2].size();
          expect(thirdRouteSize.vertices).toEqual(3);
          expect(thirdRouteSize.segments).toEqual(2);
        });

        it('should split the Route and return all sub-Routes demarcated by the provided Points, ignoring invalid Points', () => {
          const targetPoint1 = routePoints[2];
          const targetPoint2 = new RoutePoint(-2, -3, undefined);
          const targetPoint3 = routePoints[4];
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitRoutes = polylineRoute.splitByPoints(targetPoints);

          expect(splitRoutes.length).toEqual(3);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(3);
          expect(firstRouteSize.segments).toEqual(2);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(3);
          expect(secondRouteSize.segments).toEqual(2);

          const thirdRouteSize = splitRoutes[2].size();
          expect(thirdRouteSize.vertices).toEqual(2);
          expect(thirdRouteSize.segments).toEqual(1);
        });

        it('should not split the Route more than once by duplicate Points', () => {
          const targetPoint1 = routePoints[3];
          const targetPoint2 = routePoints[3];
          const targetPoints = [targetPoint1, targetPoint2];

          const splitRoutes = polylineRoute.splitByPoints(targetPoints);

          expect(splitRoutes.length).toEqual(2);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(4);
          expect(firstRouteSize.segments).toEqual(3);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(3);
          expect(secondRouteSize.segments).toEqual(2);
        });

        it(`should update the 2nd-order properties of the first and last Point of the middle split Route`, () => {
          polylineRoute.addProperties();
          const targetPoint1 = routePoints[2];
          const targetPoint2 = routePoints[4];
          const targetPoints = [targetPoint1, targetPoint2];

          const vertex1 = polylineRoute.vertexNodesByVertex(targetPoint1)[0];
          const vertex2 = polylineRoute.vertexNodesByVertex(targetPoint2)[0];

          expect(vertex1.val.path.rotation).toBeCloseTo(1.6946, 4);
          expect(vertex2.val.path.rotation).toBeCloseTo(0.9684, 4);

          const splitRoutes = polylineRoute.splitByPoints(targetPoints);

          expect(splitRoutes.length).toEqual(3);

          expect(splitRoutes[0].firstVertex.val.path.rotation).toBeNull();
          expect(splitRoutes[0].lastVertex.val.path.rotation).toBeNull();

          expect(splitRoutes[1].firstVertex.val.path.rotation).toBeNull();
          expect(splitRoutes[1].lastVertex.val.path.rotation).toBeNull();

          expect(splitRoutes[2].firstVertex.val.path.rotation).toBeNull();
          expect(splitRoutes[2].lastVertex.val.path.rotation).toBeNull();
        });
      });

      // TODO: After methods are built out for later ticket
      describe('#splitByRoute', () => {
        // Empty Route

        // Determine whether Route must only match at start/end or at every Point, or consider different naming?
        // VVVVVV
        // Target doesn't exist
        // Target is at start
        // Target is at end
        // ^^^^^^

        // Valid Route
      });

      describe('#splitByRoutes', () => {
        // Invalid Route
        // Valid Route
        // Mixed valid/invalid Routes
      });
    });
  });
});