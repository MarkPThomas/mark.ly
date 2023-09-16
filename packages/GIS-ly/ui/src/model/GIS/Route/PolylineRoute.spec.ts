import { PolylineRoute } from "./PolylineRoute";
import { RoutePoint } from "./RoutePoint";

describe('##PolylineRoute', () => {
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
});