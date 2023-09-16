import { CoordinateNode, EvaluatorArgs } from '../../Geometry/Polyline';
import { GeoJsonManager } from '../GeoJsonManager';

import { TrackPoint } from './TrackPoint';
import { ITrackPropertyProperties } from './TrackProperty';
import { TrackSegment } from './TrackSegment';

import { PolylineTrack } from './PolylineTrack';

describe('##PolylineTrack', () => {
  let lineStringTrack;
  beforeEach(() => {
    lineStringTrack = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [100.0, 0.0, 100],
              [101.0, 1.0, 200],
              [102.0, 2.0, 300],
              [103.0, 3.0, 400],
              [104.0, 4.0, 500],
              [105.0, 5.0, 600],
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
              ]
            }
          },
        }
      ],
    }
  });

  describe('Creation', () => {
    describe('#constructor', () => {
      let trackPoints: TrackPoint[];

      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:08Z';

        trackPoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should create a new PolyLine object from the provided TrackPoints', () => {
        const polylineTrack = new PolylineTrack(trackPoints);

        expect(polylineTrack.firstPoint.val).toEqual(trackPoints[0]);
        expect(polylineTrack.firstPoint.nextSeg).toEqual(polylineTrack.firstSegment);
        expect(polylineTrack.firstSegment.prevCoord.val).toEqual(trackPoints[0]);
        expect(polylineTrack.firstSegment.nextCoord.val).toEqual(trackPoints[1]);
      });
    });

    describe('Duplication', () => {
      let trackPoints: TrackPoint[];
      let polylineTrack: PolylineTrack;
      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:50Z';

        const coord5 = new TrackPoint(-8.956758, -77.777211);
        coord5.timestamp = '2023-07-04T17:24:08Z';

        const coord6 = new TrackPoint(-8.956758, -77.777211);
        coord6.timestamp = '2023-07-04T17:24:28Z';

        trackPoints = [
          coord1,
          coord2,
          coord3,
          coord4,
          coord5,
          coord6
        ];
        polylineTrack = new PolylineTrack(trackPoints);
      });

      describe('#copyRange', () => {
        // Consider moving this down to Polyline?
      });

      describe('#copyRangeByTimestamp', () => {
        beforeEach(() => {
          // Add properties to have more to track for point/segment copying
          polylineTrack.addProperties();
        });

        it('should do nothing with an empty track', () => {
          const startTime = '2023-07-04T17:22:00Z';
          const endTime = trackPoints[2].timestamp;

          const emptyPolylineTrack = new PolylineTrack([]);
          const polylineTrackCopy = emptyPolylineTrack.copyRangeByTimestamp(startTime, endTime);

          expect(polylineTrackCopy).toBeNull();
        });

        it('should copy from the beginning of the track if the start time does not exist in the track', () => {
          const startTime = '2023-07-04T17:22:00Z';
          const endTime = trackPoints[2].timestamp;

          const polylineTrackCopy = polylineTrack.copyRangeByTimestamp(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstPoint.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevCoord.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextCoord.val.equals(trackPoints[1])).toBeTruthy();
          expect(polylineTrackCopy.lastPoint.val.equals(trackPoints[2])).toBeTruthy();
        });

        it('should copy to the end of the track if the end time does not exist in the track', () => {
          const startTime = trackPoints[2].timestamp;
          const endTime = '2023-07-04T17:25:28Z';

          const polylineTrackCopy = polylineTrack.copyRangeByTimestamp(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 4,
            segments: 3
          });
          expect(polylineTrackCopy.firstPoint.val.equals(trackPoints[2])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevCoord.val.equals(trackPoints[2])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextCoord.val.equals(trackPoints[3])).toBeTruthy();
          expect(polylineTrackCopy.lastPoint.val.equals(trackPoints[5])).toBeTruthy();
        });

        it('should copy the track from the start time to the end time provided', () => {
          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[4].timestamp;

          const polylineTrackCopy = polylineTrack.copyRangeByTimestamp(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstPoint.val.equals(trackPoints[2])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevCoord.val.equals(trackPoints[2])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextCoord.val.equals(trackPoints[3])).toBeTruthy();
          expect(polylineTrackCopy.lastPoint.val.equals(trackPoints[4])).toBeTruthy();
        });

        it('should copy track by value rather than by reference', () => {
          const startTime = trackPoints[0].timestamp;
          const endTime = trackPoints[2].timestamp;

          const polylineTrackCopy = polylineTrack.copyRangeByTimestamp(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstPoint.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevCoord.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextCoord.val.equals(trackPoints[1])).toBeTruthy();
          expect(polylineTrackCopy.lastPoint.val.equals(trackPoints[2])).toBeTruthy();

          // Make original polyline different to ensure copy is by value and not by reference
          let node = polylineTrack.firstPoint;

          const coord1New = new TrackPoint(-9, -77.777452);
          coord1New.timestamp = '2023-07-04T17:22:15Z';
          node.val = coord1New;
          node = node.next as CoordinateNode<TrackPoint, TrackSegment>;

          const coord2New = new TrackPoint(-8, -77.777400);
          coord2New.timestamp = '2023-07-04T17:22:35Z';
          node.val = coord2New;
          node = node.next as CoordinateNode<TrackPoint, TrackSegment>;

          const coord3New = new TrackPoint(-7, -77.777381);
          coord3New.timestamp = '2023-07-04T17:22:46Z';
          node.val = coord3New;
          node = node.next as CoordinateNode<TrackPoint, TrackSegment>;

          expect(polylineTrack.firstSegment.prevCoord.val.equals(coord1New)).toBeTruthy();
          expect(polylineTrack.firstSegment.nextCoord.val.equals(coord2New)).toBeTruthy();
          expect(polylineTrackCopy.firstPoint.val.equals(polylineTrack.firstPoint.val)).toBeFalsy();
          expect(polylineTrackCopy.lastPoint.val.equals(polylineTrack.lastPoint.val)).toBeFalsy();
        });
      });
    });
  });

  describe('Common Interfaces', () => {
    describe('#clone', () => {
      // TODO: Finish implementing, test
    });

    describe('#equals', () => {
      //TODO: Implement? Test.
    });
  });

  describe('Optimizations', () => {
    describe('#generateTimestampMap', () => {

    });
  });

  describe('Properties Methods', () => {
    describe('#addProperties', () => {
      let trackPoints: TrackPoint[];

      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452);
        coord1.timestamp = '2023-07-04T17:22:15Z';
        // speed 2.3 mph
        // heading 48.3
        // avgSpeed = 1.245 m/s = 2.785
        // segment1 length = 24.9 m
        // segment1 duration = 20 sec
        // segment1 speed = 1.245 m/s = 2.78 mph
        // segment1 angle = 1.339 rad = 76.7 deg
        // segment1 direction = N, E

        const coord2 = new TrackPoint(-8.957069, -77.777400);
        coord2.timestamp = '2023-07-04T17:22:35Z';
        // speed 2.8 mph
        // heading 13.3
        // avgSpeed = 1.301 m/s = 2.91 mph
        // rotation =
        // angularSpeed = 0.09121 rad/s = 5.23 deg/sec
        // segment2 length = 14.9 m
        // segment2 duration = 11 sec
        // segment2 speed = 1.358 m/s = 3.04 mph
        // segment2 angle = 1.431 rad = 82.0 deg
        // segment2 direction = N, E

        const coord3 = new TrackPoint(-8.956936, -77.777381);
        coord3.timestamp = '2023-07-04T17:22:46Z';
        // speed 3.0 mph
        // heading 8.2
        // avgSpeed = 1.297 m/s = 2.90 mph
        // segment3 length = 27.2 m
        // segment3 duration = 22 sec
        // segment3 speed = 1.237 m/s = 2.77 mph
        // segment3 angle = 0.815 rad = 46.7 deg
        // segment3 direction = N, E

        const coord4 = new TrackPoint(-8.956758, -77.777211);
        coord4.timestamp = '2023-07-04T17:23:08Z';
        // speed 2.8 mph
        // heading 43.3
        // avgSpeed = 1.237 m/3 = 2.77 mph

        trackPoints = [
          coord1,
          coord2,
          coord3,
          coord4
        ];
      });

      it('should add derived properties to segments', () => {
        const polylineTrack = new PolylineTrack(trackPoints);

        polylineTrack.addProperties();

        const segments = polylineTrack.segments();

        expect(segments[1].length - 14.935).toBeLessThanOrEqual(0.001);
        expect(segments[1].duration - 11).toBeLessThanOrEqual(0.001);
        expect(segments[1].speed - 1.358).toBeLessThanOrEqual(0.001);
        expect(segments[1].angle - 1.431).toBeLessThanOrEqual(0.001);
        expect(segments[1].direction).toEqual({ lat: 'N', lng: 'E' });
      });

      it('should add derived properties to coordinates', () => {
        const polylineTrack = new PolylineTrack(trackPoints);

        polylineTrack.addProperties();

        const coords = polylineTrack.vertices();

        // Check middle node
        expect(coords[1].path.speed - 1.301).toBeLessThanOrEqual(0.001);
        expect(coords[1].path.rotation - 0.092).toBeLessThanOrEqual(0.001);
        expect(coords[1].path.rotationRate - 0.09121).toBeLessThanOrEqual(0.00001);

        // Check start node
        expect(coords[0].path.speed - 1.245).toBeLessThanOrEqual(0.001);
        expect(coords[0].path.rotation).toBeNull();
        expect(coords[0].path.rotationRate).toBeNull();

        // Check end node
        expect(coords[coords.length - 1].path.speed - 1.237).toBeLessThanOrEqual(0.001);
        expect(coords[coords.length - 1].path.rotation).toBeNull();
        expect(coords[coords.length - 1].path.rotationRate).toBeNull();
      });
    });

    describe('#addElevations', () => {
      it('should do nothing for elevations of non-matching lat/long', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
        ];

        const polylineTrack = new PolylineTrack(coords);
        polylineTrack.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 1, lng: 2 }), 1000);
        elevations.set(JSON.stringify({ lat: 3, lng: 4 }), 2000);
        elevations.set(JSON.stringify({ lat: 5, lng: 6 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);
        elevations.set(JSON.stringify({ lat: 9, lng: 10 }), 5000);

        polylineTrack.addElevations(elevations);

        const trackCoords = polylineTrack.vertices();

        expect(trackCoords.length).toEqual(5);

        expect(trackCoords[0]).not.toHaveProperty('elevation');
        expect(trackCoords[1]).not.toHaveProperty('elevation');
        expect(trackCoords[2]).not.toHaveProperty('elevation');
        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add elevation properties and derived data for matching lat/long', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'), // Intentional mismatch
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];

        const polylineTrack = new PolylineTrack(coords);
        polylineTrack.addProperties();

        const elevations: Map<string, number> = new Map();
        elevations.set(JSON.stringify({ lat: 39.74007868370209, lng: -105.0076261841355 }), 1000);
        elevations.set(JSON.stringify({ lat: 39.74005097339472, lng: -104.9998123858178 }), 2000);
        elevations.set(JSON.stringify({ lat: 39.73055300708892, lng: -104.9990802128465 }), 1500);
        elevations.set(JSON.stringify({ lat: 7, lng: 8 }), 4000);                                         // Intentional mismatch
        elevations.set(JSON.stringify({ lat: 39.73991441833991, lng: -104.9917491337653 }), 5000);
        elevations.set(JSON.stringify({ lat: 39.739914418342, lng: -104.99174913377 }), 4000);

        polylineTrack.addElevations(elevations);

        const trackCoords = polylineTrack.vertices();
        const trackSegs = polylineTrack.segments();

        expect(trackCoords.length).toEqual(6);
        expect(trackSegs.length).toEqual(5);

        expect(trackCoords[0].elevation).toEqual(1000);
        expect(trackCoords[0].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
        expect(trackCoords[0].path.descentRate).toBeLessThanOrEqual(0.1);

        expect(trackSegs[0].height - 1000).toBeLessThanOrEqual(0.1);
        expect(trackSegs[0].heightRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[1].elevation).toEqual(2000);
        expect(trackCoords[1].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
        expect(trackCoords[1].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[1].height + 500).toBeLessThanOrEqual(0.1);
        expect(trackSegs[1].heightRate + 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[2].elevation).toEqual(1500);
        expect(trackCoords[2].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[2].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[2].height).toBeUndefined();
        expect(trackSegs[2].heightRate).toBeUndefined();

        expect(trackCoords[3].elevation).toBeUndefined();
        expect(trackCoords[3].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[3].path.descentRate).toBeLessThanOrEqual(0.1);

        expect(trackSegs[3].height).toBeUndefined();
        expect(trackSegs[3].heightRate).toBeUndefined();

        expect(trackCoords[4].elevation).toEqual(5000);
        expect(trackCoords[4].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[4].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[4].height + 1000).toBeLessThanOrEqual(0.1);
        expect(trackSegs[4].heightRate + 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[5].elevation).toEqual(4000);
        expect(trackCoords[5].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[5].path.descentRate - 50).toBeLessThanOrEqual(0.1);
      });
    });

    describe('#addElevationProperties', () => {
      it('should do nothing if nodes do not have elevations', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
        ];

        const polylineTrack = new PolylineTrack(coords);
        polylineTrack.addProperties();
        polylineTrack.addElevationProperties();

        const trackCoords = polylineTrack.vertices();

        expect(trackCoords.length).toEqual(5);

        expect(trackCoords[0]).not.toHaveProperty('elevation');
        expect(trackCoords[1]).not.toHaveProperty('elevation');
        expect(trackCoords[2]).not.toHaveProperty('elevation');
        expect(trackCoords[3]).not.toHaveProperty('elevation');
        expect(trackCoords[4]).not.toHaveProperty('elevation');
      });

      it('should add derived data from elevations already set for TrackPoints', () => {
        const coords = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'), // Intentional mismatch
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];
        coords[0].elevation = 1000;
        coords[1].elevation = 2000;
        coords[2].elevation = 1500;
        coords[4].elevation = 5000;
        coords[5].elevation = 4000;

        const polylineTrack = new PolylineTrack(coords);
        polylineTrack.addProperties();

        polylineTrack.addElevationProperties();

        const trackCoords = polylineTrack.vertices();
        const trackSegs = polylineTrack.segments();

        expect(trackCoords.length).toEqual(6);
        expect(trackSegs.length).toEqual(5);

        expect(trackCoords[0].elevation).toEqual(1000);
        expect(trackCoords[0].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
        expect(trackCoords[0].path.descentRate).toBeLessThanOrEqual(0.1);

        expect(trackSegs[0].height - 1000).toBeLessThanOrEqual(0.1);
        expect(trackSegs[0].heightRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[1].elevation).toEqual(2000);
        expect(trackCoords[1].path.ascentRate - 50).toBeLessThanOrEqual(0.1);
        expect(trackCoords[1].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[1].height + 500).toBeLessThanOrEqual(0.1);
        expect(trackSegs[1].heightRate + 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[2].elevation).toEqual(1500);
        expect(trackCoords[2].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[2].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[2].height).toBeUndefined();
        expect(trackSegs[2].heightRate).toBeUndefined();

        expect(trackCoords[3].elevation).toBeUndefined();
        expect(trackCoords[3].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[3].path.descentRate).toBeLessThanOrEqual(0.1);

        expect(trackSegs[3].height).toBeUndefined();
        expect(trackSegs[3].heightRate).toBeUndefined();

        expect(trackCoords[4].elevation).toEqual(5000);
        expect(trackCoords[4].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[4].path.descentRate - 50).toBeLessThanOrEqual(0.1);

        expect(trackSegs[4].height + 1000).toBeLessThanOrEqual(0.1);
        expect(trackSegs[4].heightRate + 50).toBeLessThanOrEqual(0.1);

        expect(trackCoords[5].elevation).toEqual(4000);
        expect(trackCoords[5].path.ascentRate).toBeLessThanOrEqual(0.1);
        expect(trackCoords[5].path.descentRate - 50).toBeLessThanOrEqual(0.1);
      });
    });

    describe('#addElevationsFromApi', () => {
      it('should ', () => {

      });
    });
  });

  describe('Accessing Items', () => {
    let trackPoints: TrackPoint[];
    let polylineTrack: PolylineTrack;

    beforeEach(() => {
      const positions = lineStringTrack.features[0].geometry.coordinates;
      const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];
      trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
      polylineTrack = new PolylineTrack(trackPoints);
    });

    describe('#getNodes', () => {
      it('should return an empty array for no matches', () => {
        const nodes = polylineTrack.getNodes(
          -1,
          (target: number, coord: CoordinateNode<TrackPoint, TrackSegment>) => coord.val.timestamp <= target.toString()
        );

        expect(nodes.length).toEqual(0);
      });

      it('should return all nodes that match the numerical target', () => {
        const nodes = polylineTrack.getNodes(
          3,
          (target: number, coord: CoordinateNode<TrackPoint, TrackSegment>) => coord.val.timestamp <= target.toString()
        );

        expect(nodes.length).toEqual(3);
        expect(nodes[1].val.lat).toEqual(1);
        expect(nodes[1].val.lng).toEqual(101);
        expect(nodes[1].val.alt).toEqual(200);
      });

      it('should return all nodes that match all of the Evaluator Args targets', () => {
        const nodes = polylineTrack.getNodes(
          {
            time: 3,
            lng: '101'
          },
          (target: EvaluatorArgs, coord: CoordinateNode<TrackPoint, TrackSegment>) =>
            coord.val.timestamp <= target.time.toString()
            && coord.val.lng <= (target.lng as number)
        );

        expect(nodes.length).toEqual(2);
        expect(nodes[1].val.lat).toEqual(1);
        expect(nodes[1].val.lng).toEqual(101);
        expect(nodes[1].val.alt).toEqual(200);
      });
    });

    describe('#getNodeByTimestamp', () => {
      // TODO: Test
    });
  });

  describe('Manipulating Polyline', () => {
    let trackPoints: TrackPoint[];
    let polylineTrack: PolylineTrack;

    beforeEach(() => {
      const positions = lineStringTrack.features[0].geometry.coordinates;
      const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];
      trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
      polylineTrack = new PolylineTrack(trackPoints);
    });

    describe('#removeNodes', () => {
      it('should do nothing for nodes provided that are not in the track and return a count of 0', () => {
        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(-1, -2, undefined, '-1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1, 101, 200, '-2'));

        const nodes = polylineTrack.removeNodes([node1, node2]);

        expect(nodes).toEqual(0);

        const polylineTrackLength = polylineTrack.size();
        expect(polylineTrackLength.vertices).toEqual(trackPoints.length);
        expect(polylineTrackLength.segments).toEqual(trackPoints.length - 1);
      });

      it('should remove the nodes provided and return a count for the number removed', () => {
        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[0]);
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[3]);

        const nodes = polylineTrack.removeNodes([node1, node2]);

        expect(nodes).toEqual(2);

        const polylineTrackLength = polylineTrack.size();
        expect(polylineTrackLength.vertices).toEqual(trackPoints.length - 2);
        expect(polylineTrackLength.segments).toEqual(trackPoints.length - 2 - 1);
      });

      it('should remove the nodes provided, ignoring ones that are not found in the track and return a count for the number removed', () => {
        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[0]);
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1, 101, 200, '-2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[3]);

        const nodes = polylineTrack.removeNodes([node1, node2, node3]);

        expect(nodes).toEqual(2);

        const polylineTrackLength = polylineTrack.size();
        expect(polylineTrackLength.vertices).toEqual(trackPoints.length - 2);
        expect(polylineTrackLength.segments).toEqual(trackPoints.length - 2 - 1);
      });
    });

    describe('#insertNodesBefore', () => {
      // TODO: Test
    });

    describe('#insertNodesAfter', () => {
      // TODO: Test
    });

    describe('#replaceNodesBetween', () => {
      const getNodeAtCount = (node: CoordinateNode<TrackPoint, TrackSegment>, count: number) => {
        while (node) {
          node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
          count--;
        }

        return node;
      };

      const getTailNode = (node: CoordinateNode<TrackPoint, TrackSegment>) => {
        let tempNode: CoordinateNode<TrackPoint, TrackSegment>;
        while (node) {
          tempNode = node;
          node = node.next as CoordinateNode<TrackPoint, TrackSegment>;
        }

        return tempNode;
      }

      it('should do nothing if the head & tail nodes are both unspecified', () => {
        const initialLength = polylineTrack.size();

        const startNode = null;
        const endNode = null;

        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.1, 101.5, 200, '2.1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.2, 102, 210, '2.2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.3, 107, 240, '2.3'));
        const nodes = [node1, node2, node3];

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(0);
        expect(polylineTrack.size()).toEqual(initialLength);
      });

      it('should only remove nodes in the start/end range if no nodes are provided to insert and return 0', () => {
        const startNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[0]);
        const endNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[3]);

        const initialLength = polylineTrack.size();

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, []);

        expect(result).toEqual(2);
        expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - 2);
        expect(polylineTrack.size().segments).toEqual(initialLength.segments - 2);
      });

      it(`should insert the nodes at the head of track and return the number of nodes inserted
        if only a tail node is provided and tail node is at the head of the track, `, () => {
        const initialLength = polylineTrack.size();
        const initialHead = polylineTrack.firstPoint;

        // Use current tail node - by value to also test matching
        const startNode = null;
        const endNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[0]);

        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.1, 101.5, 200, '2.1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.2, 102, 210, '2.2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.3, 107, 240, '2.3'));
        const nodes = [node1, node2, node3];

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polylineTrack.size().segments).toEqual(initialLength.segments + result);
        expect(polylineTrack.firstPoint.equals(node1.val)).toBeTruthy();

        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).toEqual(polylineTrack.firstPoint);
        expect(node1.prev).toBeNull();
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialHead);
        expect(initialHead.prev).toEqual(node3);
      });

      it(`should insert the nodes at the tail of track and return the number of nodes inserted
        if only a head node is provided and head node is at the tail of the track`, () => {
        const initialLength = polylineTrack.size();
        const initialHead = polylineTrack.firstPoint;
        const initialTail = getTailNode(initialHead);

        // Use current last node - by value to also test matching
        const startNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[trackPoints.length - 1]);
        const endNode = null;

        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.1, 101.5, 200, '2.1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.2, 102, 210, '2.2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.3, 107, 240, '2.3'));
        const nodes = [node1, node2, node3];

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polylineTrack.size().segments).toEqual(initialLength.segments + result);
        expect(polylineTrack.firstPoint.equals(initialHead.val)).toBeTruthy();

        expect(node1.prev.val).toEqual(startNode.val);

        expect(node1).not.toEqual(polylineTrack.firstPoint);
        expect(node1).toEqual(initialTail.next);
        expect(node1.prev).toEqual(initialTail);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toBeNull();
      });

      it(`should insert the nodes between the two specified tail/head nodes in the track
        and return the number of nodes inserted when the head/tail nodes are adjacent`, () => {
        const initialLength = polylineTrack.size();
        const initialHead = polylineTrack.firstPoint.next as CoordinateNode<TrackPoint, TrackSegment>;
        const initialTail = initialHead.next as CoordinateNode<TrackPoint, TrackSegment>;

        // Insert after first segment, over second segment
        const startNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[1]);
        const endNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[2]);

        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.1, 101.5, 200, '2.1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.2, 102, 210, '2.2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.3, 107, 240, '2.3'));
        const nodes = [node1, node2, node3];

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(3); // 3 inserted
        expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + result); // 3 inserted
        expect(polylineTrack.size().segments).toEqual(initialLength.segments + result);

        expect(node1.prev.val).toEqual(startNode.val);
        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).not.toEqual(polylineTrack.firstPoint);
        expect(node1).toEqual(initialHead.next);
        expect(node1.prev).toEqual(initialHead);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialTail);
        expect(initialTail.prev).toEqual(node3);
      });

      it(`should insert the nodes between the two specified tail/head nodes in the track,
        remove the original set of nodes between these same two points,
        and return the number of nodes inserted+removed when the head/tail nodes are not adjacent`, () => {
        const initialLength = polylineTrack.size();
        const initialHead = polylineTrack.firstPoint.next as CoordinateNode<TrackPoint, TrackSegment>;
        const initialTail = initialHead?.next?.next?.next as CoordinateNode<TrackPoint, TrackSegment>;

        // Insert after first segment, over second segment
        const startNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[1]);
        const endNode = new CoordinateNode<TrackPoint, TrackSegment>(trackPoints[4]);

        const node1 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.1, 101.5, 200, '2.1'));
        const node2 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.2, 102, 210, '2.2'));
        const node3 = new CoordinateNode<TrackPoint, TrackSegment>(new TrackPoint(1.3, 107, 240, '2.3'));
        const nodes = [node1, node2, node3];

        const result = polylineTrack.replaceNodesBetween(startNode, endNode, nodes);

        expect(result).toEqual(5); // 3 inserted, 2 removed
        expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
        expect(polylineTrack.size().segments).toEqual(initialLength.segments + 1);
        expect(node1.prev.val).toEqual(startNode.val);
        expect(node3.next.val).toEqual(endNode.val);

        expect(node1).not.toEqual(polylineTrack.firstPoint);
        expect(node1).toEqual(initialHead.next);
        expect(node1.prev).toEqual(initialHead);
        expect(node1.next).toEqual(node2);

        expect(node3.prev).toEqual(node2);
        expect(node3.next).toEqual(initialTail);
        expect(initialTail.prev).toEqual(node3);
      });
    });

    describe('#replaceNodesFromTo', () => {
      // TODO: Test
    });

    // describe('#splitAtNode', () => {
    //   it('should ', () => {

    //   });
    // });
  });

  // describe('IQuery', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coordinates);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     const featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });


  //   describe('#getSegmentBeforeTime', () => {
  //     it('should return segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentBeforeTime(timestamp);

  //       expect(segPoints).toEqual([
  //         [100.0, 0.0, 100],
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300]
  //       ]);
  //       expect(segTimestamps).toEqual(['1', '2', '3']);
  //     });

  //     it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.5';

  //       const segments = polyLineTrack.getSegmentBeforeTime(timestamp)

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentAfterTime', () => {
  //     it('should return segment after the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentAfterTime(timestamp);

  //       expect(segPoints).toEqual([
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400],
  //         [104.0, 4.0, 500],
  //         [105.0, 5.0, 600]
  //       ]);
  //       expect(segTimestamps).toEqual(['3', '4', '5', '6']);
  //     });

  //     it('should return undefined when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.5';

  //       const segments = polyLineTrack.getSegmentBeforeTime(timestamp)

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentBetweenTimes', () => {
  //     it('should return track segment before the coordinate found in a GeoJSON object', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4';

  //       const { segPoints, segTimestamps } = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segPoints).toEqual([
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400]
  //       ]);
  //       expect(segTimestamps).toEqual(['2', '3', '4']);
  //     });

  //     it('should return undefined when the start coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '2.1';
  //       const timestampEnd = '4';

  //       const segments = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segments).toBeUndefined();
  //     });

  //     it('should return undefined when the end coordinate is not found in the track', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4.1';

  //       const segments = polyLineTrack.getSegmentBetweenTimes(timestampStart, timestampEnd);

  //       expect(segments).toBeUndefined();
  //     });
  //   });

  //   describe('#getSegmentsSplitByTimes', () => {
  //     it('should return two segments split by a single coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3']
  //       );


  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return three segments split by a two coordinates found in a GeoJSON object', () => {
  //       const timestamp1 = '2';
  //       const timestamp2 = '4';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp1, timestamp2]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2']
  //       );

  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['2', '3', '4']
  //       );

  //       expect(segments[2].segPoints).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[2].segTimestamps).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return two segments split by 1 coordinate found in a GeoJSON object with 2 coordinates provided', () => {
  //       const timestamp = '3';
  //       const timestampInvalid = '3.1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp, timestampInvalid]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3']
  //       );

  //       expect(segments[1].segPoints).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[1].segTimestamps).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return original track segments when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when split on the start coordinate', () => {
  //       const timestamp = '1';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when split on the end coordinate', () => {
  //       const timestamp = '6';

  //       const segments = polyLineTrack.getSegmentsSplitByTimes([timestamp]);

  //       expect(segments[0].segPoints).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );
  //       expect(segments[0].segTimestamps).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });
  //   });
  // });


  // describe('IClippable', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let featureCollection: FeatureCollection;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coordinates);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });

  //   describe('#clipBeforeTime', () => {
  //     it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const clippedTrack = polyLineTrack.clipBeforeTime(timestamp)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [100.0, 0.0, 100],
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['1', '2', '3']);
  //     });

  //     it('should do nothing to the segment if the coordinate is not found', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.clipBeforeTime(timestamp)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });

  //   describe('#clipAfterTime', () => {
  //     it('should clip track to segment before the coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const clippedTrack = polyLineTrack.clipAfterTime(timestamp)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400],
  //         [104.0, 4.0, 500],
  //         [105.0, 5.0, 600]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['3', '4', '5', '6']);
  //     });

  //     it('should do nothing to the segment if the coordinate is not found', () => {
  //       const timestamp = '3.1';

  //       const segments = polyLineTrack.clipAfterTime(timestamp)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });

  //   describe('#clipBetweenTimes', () => {
  //     it('should clip track to segment between the coordinates found in a GeoJSON object', () => {
  //       const timestampStart = '2';
  //       const timestampEnd = '4';

  //       const clippedTrack = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect((clippedTrack.features[0].geometry as LineString).toPositions()).toEqual([
  //         [101.0, 1.0, 200],
  //         [102.0, 2.0, 300],
  //         [103.0, 3.0, 400]
  //       ]);
  //       expect(clippedTrack.features[0].properties.coordinateProperties.times).toEqual(['2', '3', '4']);
  //     });

  //     it('should do nothing to the segment when the start coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '2.1';
  //       const timestampEnd = '4';

  //       const segments = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect(segments).toEqual(featureCollection);
  //     });

  //     it('should do nothing to the segment when the end coordinate is not found in a GeoJSON object', () => {
  //       const timestampStart = '3';
  //       const timestampEnd = '4.1';

  //       const segments = polyLineTrack.clipBetweenTimes(timestampStart, timestampEnd)

  //       expect(segments).toEqual(featureCollection);
  //     });
  //   });
  // });


  // describe('ISplittable', () => {
  //   let lineString: LineString;
  //   let properties: TrackProperty;
  //   let featureCollection: FeatureCollection;
  //   let polyLineTrack: PolylineTrack;

  //   beforeEach(() => {
  //     const featureJson = lineStringTrack.features[0];
  //     lineString = LineString.fromPositions(featureJson.geometry.coordinates);
  //     properties = TrackProperty.fromJson(featureJson.properties);

  //     const feature = Feature.fromGeometry(lineString, { properties });
  //     featureCollection = FeatureCollection.fromFeatures([feature]);

  //     polyLineTrack = new GeoJsonTrack(featureCollection);
  //   });


  //   describe('#splitByTimes', () => {
  //     it('should return two track segments split by a single coordinate found in a GeoJSON object', () => {
  //       const timestamp = '3';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return three track segments split by two coordinates found in a GeoJSON object', () => {
  //       const timestamp1 = '2';
  //       const timestamp2 = '4';

  //       const tracks = polyLineTrack.splitByTimes([timestamp1, timestamp2]);

  //       expect(tracks.length).toEqual(3);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ])
  //         ;
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );
  //       expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['2', '3', '4']
  //       );
  //       expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return two track segments split by 1 coordinate found in a GeoJSON object with 2 coordinates provided', () => {
  //       const timestamp = '3';
  //       const timestampInvalid = '3.1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp, timestampInvalid]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return the track segment unchanged when the coordinate is not found in a GeoJSON object', () => {
  //       const timestamp = '3.1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect(tracks[0]).toEqual(featureCollection);
  //     });

  //     it('should return only the original track when a coord matches the first track coord', () => {
  //       const timestamp = '1';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the original track when a coord matches the last track coord', () => {
  //       const timestamp = '6';

  //       const tracks = polyLineTrack.splitByTimes([timestamp]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4', '5', '6']
  //       );
  //     });
  //   });

  //   describe('#splitBySegment', () => {
  //     it('should return the specified segment at the start of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '1',
  //         endTime: '2',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //     });

  //     it('should return the specified segment at the end of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '5',
  //         endTime: '6',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return the specified segment at the middle of the track', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);

  //       expect((track.features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //         ]
  //       );

  //       expect(track.features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4']
  //       );
  //     });

  //     it('should return nothing if the specified segment is not found', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3.1',
  //         endTime: '4.1',
  //       }
  //       const track = polyLineTrack.splitBySegment(segment);
  //       expect(track).toBeUndefined();
  //     });
  //   });

  //   describe('#splitBySegments', () => {
  //     it('should return two track segments split by a single segment found in a GeoJSON object', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }
  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return three track segments split by two segments found in a GeoJSON object', () => {
  //       lineStringTrack = {
  //         type: 'FeatureCollection',
  //         features: [
  //           {
  //             type: 'Feature',
  //             geometry: {
  //               type: 'LineString',
  //               coordinates: [
  //                 [100.0, 0.0, 100],
  //                 [101.0, 1.0, 200],
  //                 [102.0, 2.0, 300],
  //                 [103.0, 3.0, 400],
  //                 [104.0, 4.0, 500],
  //                 [105.0, 5.0, 600],
  //                 [106.0, 6.0, 700],
  //                 [107.0, 7.0, 800],
  //                 [108.0, 8.0, 900],
  //                 [109.0, 9.0, 1000],
  //               ]
  //             },
  //             properties: {
  //               _gpxType: 'trk',
  //               name: 'FooBarTest',
  //               time: 'timestamp',
  //               coordinateProperties: {
  //                 times: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  //               }
  //             },
  //           }
  //         ],
  //       }

  //       const featureJson = lineStringTrack.features[0];
  //       const lineString = LineString.fromPositions(featureJson.geometry.coordinates);
  //       const properties = TrackProperty.fromJson(featureJson.properties);

  //       const feature = Feature.fromGeometry(lineString, { properties });
  //       const featureCollection = FeatureCollection.fromFeatures([feature]);

  //       const geoJsonTrack = new GeoJsonTrack(featureCollection);

  //       const segment1: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4',
  //       }

  //       const segment2: ITrackSegmentLimits = {
  //         startTime: '7',
  //         endTime: '8',
  //       }
  //       const tracks = geoJsonTrack.splitBySegments([segment1, segment2]);

  //       expect(tracks.length).toEqual(3);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200]
  //         ])
  //         ;
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600],
  //         ]
  //       );
  //       expect((tracks[2].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [108.0, 8.0, 900],
  //           [109.0, 9.0, 1000],
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //       expect(tracks[2].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['9', '10']
  //       );
  //     });

  //     it('should return two track segments split by 1 segment found in a GeoJSON object with 2 segment provided', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '3',
  //         endTime: '4'
  //       }
  //       const segmentInvalid: ITrackSegmentLimits = {
  //         startTime: '5.1',
  //         endTime: '6.1'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment, segmentInvalid]);

  //       expect(tracks.length).toEqual(2);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //         ]
  //       );
  //       expect((tracks[1].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2']
  //       );
  //       expect(tracks[1].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['5', '6']
  //       );
  //     });

  //     it('should return the track segment unchanged when the segment is not found in a GeoJSON object', () => {
  //       const segmentInvalid: ITrackSegmentLimits = {
  //         startTime: '5.1',
  //         endTime: '6.1'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segmentInvalid]);

  //       expect(tracks.length).toEqual(1);
  //       expect(tracks[0]).toEqual(featureCollection);
  //     });

  //     it('should return only the remaining track when a segment matches the first track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '1',
  //         endTime: '2',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['3', '4', '5', '6']
  //       );
  //     });

  //     it('should return only the remaining track when a segment matches the second track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '2',
  //         endTime: '3',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [103.0, 3.0, 400],
  //           [104.0, 4.0, 500],
  //           [105.0, 5.0, 600]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['4', '5', '6']
  //       );
  //     });

  //     it('should return only the initial track when a segment matches the last track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '5',
  //         endTime: '6'
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300],
  //           [103.0, 3.0, 400]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3', '4']
  //       );
  //     });

  //     it('should return only the initial track when a segment matches the second-to-last track segment', () => {
  //       const segment: ITrackSegmentLimits = {
  //         startTime: '4',
  //         endTime: '5',
  //       }

  //       const tracks = polyLineTrack.splitBySegments([segment]);

  //       expect(tracks.length).toEqual(1);
  //       expect((tracks[0].features[0].geometry as LineString).toPositions()).toEqual(
  //         [
  //           [100.0, 0.0, 100],
  //           [101.0, 1.0, 200],
  //           [102.0, 2.0, 300]
  //         ]
  //       );

  //       expect(tracks[0].features[0].properties?.coordinateProperties?.times).toEqual(
  //         ['1', '2', '3']
  //       );
  //     });
  //   });
  // });



  // describe('Smooth Methods', () => {
  //   describe('#smoothBySpeed', () => {
  //     it('should do nothing to a track that has no speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.55 m/s = 3.47 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:31Z';
  //       // Speed (average): 1.393 m/s = 3.12 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:03Z';
  //       // Speed (average): 1.258 m/s = 2.81 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:43Z';
  //       // Speed (average): 1.283 m/s = 2.87 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(0);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove the first coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 3.575 m/s = 8.0 mph
  //       // Segment speed: 3.575 m/s = 8.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 2.069 m/s = 4.6 mph
  //       // Segment speed: 0.564 m/s = 1.3 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:28Z';
  //       // Speed (average): 1.137 m/s = 2.5 mph
  //       // Segment speed: 1.71 m/s = 3.8 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 1.710 m/s = 3.8 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove the last coordinate from a track when it has speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:50:08Z';
  //       // Speed (average): 1.083 m/s = 2.4 mph
  //       // Segment speed:  m/s =  mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:41Z';
  //       // Speed (average): 0.870 m/s = 1.9 mph
  //       // Segment speed:  m/s =  mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:51:41Z';
  //       // Speed (average): 2.89 m/s = 6.46 mph
  //       // Segment speed:  m/s =  mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:51Z';
  //       // Speed (average): 5.13 m/s = 11.5 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 3.129; // 7 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(3);
  //     });

  //     it('should remove coordinates from a track that have speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
  //       coord1.timeStamp = '2023-07-04T20:49:58Z';
  //       // Speed (average): 1.787 m/s = 4.0 mph

  //       const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
  //       coord2.timeStamp = '2023-07-04T20:50:18Z';
  //       // Speed (average): 3.086 m/s = 6.9 mph

  //       const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
  //       coord3.timeStamp = '2023-07-04T20:50:27Z';
  //       // Speed (average): 2.474 m/s = 5.5 mph

  //       const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
  //       coord4.timeStamp = '2023-07-04T20:51:58Z';
  //       // Speed (average): 0.563 m/s = 1.26 mph

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitMpS = 2.2352; // 5 mph
  //       const removedCoords = track.smoothBySpeed(speedLimitMpS);

  //       expect(removedCoords).toEqual(2);
  //       expect(track.points().length).toEqual(2);
  //     });
  //   });

  //   describe('#smoothByAngularSpeed', () => {
  //     it('should remove coordinates from a track that have clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.75260590879227, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove coordinates from a track that have counter-clockwise angular speeds above the specified limit', () => {
  //       const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
  //       coord1.timeStamp = '2023-07-04T20:00:00Z';

  //       const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
  //       coord2.timeStamp = '2023-07-04T20:07:20Z';

  //       const coord3 = new TrackPoint(39.73055300708892, -104.9990802128465);
  //       coord3.timeStamp = '2023-07-04T20:07:30Z';

  //       const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
  //       coord4.timeStamp = '2023-07-04T20:07:40Z';

  //       const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
  //       coord5.timeStamp = '2023-07-04T20:15:00Z';

  //       const coords = [
  //         coord1,
  //         coord2,
  //         coord3,
  //         coord4,
  //         coord5
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       const speedLimitRadpS = 0.1;
  //       const removedCoords = track.smoothByAngularSpeed(speedLimitRadpS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });

  //   describe('#smoothStationary', () => {
  //     it('should remove coordinates from a track that have a speeds below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T23:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T26:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T26:14:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;
  //       const removedCoords = track.smoothStationary(minSpeedMS);

  //       expect(removedCoords).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should ??? coordinates from a track that do not have speed data', () => {
  //       // TODO: What should this behavior be or should it even be considered?
  //       //  A track with no speed data may just need it calculated or has no time stamps, in which case 'stationary' is not a valid criteria.
  //       //  A valid case would be a track with speeds where some points cannot have speed calculated (perhaps due to an error?).
  //       //    This seems unlikely to happen or would break things down earlier.
  //       //    More likely, removing points is unintended/out of order of operations.
  //       // This concern seems valid/solutions applicable in related cases, such as elevation change rates.
  //     });
  //   });

  //   describe('#smoothNoiseCloud', () => {
  //     it('should do nothing to a path with no noise clouds', () => {
  //       // Points are stationary by timestamps, but fall outside of the radius to be 'stationary' in a location based on min timestamp intervals
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(0);
  //       expect(smoothResults.clouds).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove coordinates in a noise cloud at the beginning of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         // Begin noise cloud
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:50Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:01:10Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary, results in 3.35 meters or less between points
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed resume)

  //       // Presumed resume node
  //       expect(resultCoords[0].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[0].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[0].timeStamp).toEqual('2023-07-04T20:00:50Z');
  //     });

  //     it('should remove coordinates in a noise cloud at the end of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(6);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed pause)

  //       // Presumed pause node
  //       expect(resultCoords[2].lat).toEqual(39.87825420255762);
  //       expect(resultCoords[2].lng).toEqual(-105.13560669104396);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');
  //     });

  //     it('should remove nodes in a noise cloud in the middle of the path, leaving an average pause/resume node in place', () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87823888190675, -105.1357900558201, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.87822589268432, -105.1357027717129, 0, '2023-07-04T20:00:10Z'),
  //         // Begin noise cloud
  //         new TrackPoint(39.87821721769159, -105.1356040418078, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87823050857553, -105.1355974665931, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.878236962082, -105.1356171532047, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87822657116678, -105.1356188651574, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87821596033782, -105.1355800846031, 0, '2023-07-04T20:01:00Z'),
  //         // End noise cloud
  //         new TrackPoint(39.87822512731312, -105.1355053510283, 0, '2023-07-04T20:01:10Z'),
  //         new TrackPoint(39.87821988064638, -105.1353883040605, 0, '2023-07-04T20:01:20Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS);

  //       expect(smoothResults.nodes).toEqual(5);
  //       expect(smoothResults.clouds).toEqual(1);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(6);   // 4 original nodes + 2 avg nodes (1 presumed pause, 1 presumed resume)

  //       // Pause & resume nodes
  //       expect(resultCoords[2].lat).toEqual(39.87822544397074);
  //       expect(resultCoords[2].lng).toEqual(-105.13560352227323);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:00:20Z');

  //       expect(resultCoords[3].lat).toEqual(resultCoords[2].lat);
  //       expect(resultCoords[3].lng).toEqual(resultCoords[2].lng);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:00Z');
  //     });

  //     it(`should remove nodes in multiple overlapping noise clouds in the middle of the path,
  //       leaving an average pause/resume node in place`, () => {
  //       const coords = [
  //         // Times are accelerated such that the points aren't marked as stationary
  //         // Distances are such that based on assume min timestamps, they are too close
  //         new TrackPoint(39.87825432484495, -105.1353814910402, 0, '2023-07-04T20:00:00Z'),
  //         // Begin noise cloud #1
  //         new TrackPoint(39.87824052403623, -105.1352618135007, 0, '2023-07-04T20:00:10Z'),
  //         new TrackPoint(39.8782522989425, -105.1352433936513, 0, '2023-07-04T20:00:20Z'),
  //         new TrackPoint(39.87825750947018, -105.1352618278019, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.87824948371056, -105.1352684908337, 0, '2023-07-04T20:00:40Z'),
  //         new TrackPoint(39.87823201248165, -105.135242862249, 0, '2023-07-04T20:00:50Z'),
  //         new TrackPoint(39.87823014730432, -105.1352631715043, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.87824285433322, -105.135233590465, 0, '2023-07-04T20:01:10Z'),
  //         // End noise cloud #1
  //         // Begin noise cloud #2
  //         new TrackPoint(39.87823856216351, -105.1351918088743, 0, '2023-07-04T20:01:20Z'),
  //         new TrackPoint(39.87824751183506, -105.1351733485622, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.87825320422211, -105.1351936504459, 0, '2023-07-04T20:01:40Z'),
  //         new TrackPoint(39.87823291651964, -105.1352084650403, 0, '2023-07-04T20:01:50Z'),
  //         new TrackPoint(39.87821729634359, -105.1351968777954, 0, '2023-07-04T20:02:00Z'),
  //         new TrackPoint(39.87825197840353, -105.1351988205849, 0, '2023-07-04T20:02:10Z'),
  //         new TrackPoint(39.87823106932006, -105.1351756495897, 0, '2023-07-04T20:02:20Z'),
  //         // End noise cloud #2
  //         new TrackPoint(39.87823847144207, -105.1351062708185, 0, '2023-07-04T20:02:30Z'),
  //         new TrackPoint(39.87823789587544, -105.1350151021305, 0, '2023-07-04T20:02:40Z'),
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.11176 meters/sec = 0.25 mph is essentially stationary
  //       const minSpeedMS = 0.11176;

  //       const smoothResults = track.smoothNoiseClouds(minSpeedMS, true);

  //       expect(smoothResults.nodes).toEqual(14);
  //       expect(smoothResults.clouds).toEqual(2);

  //       const resultCoords = track.points();
  //       expect(resultCoords.length).toEqual(7); // 3 original nodes + 2x2 avg nodes (1 presumed pause, 1 presumed resume, for each cloud)

  //       // Cloud 1 pause & resume nodes
  //       expect(resultCoords[1].lat).toEqual(39.87824354718266);
  //       expect(resultCoords[1].lng).toEqual(-105.13525359285799);
  //       expect(resultCoords[1].timeStamp).toEqual('2023-07-04T20:00:10Z');

  //       expect(resultCoords[2].lat).toEqual(resultCoords[1].lat);
  //       expect(resultCoords[2].lng).toEqual(resultCoords[1].lng);
  //       expect(resultCoords[2].timeStamp).toEqual('2023-07-04T20:01:10Z');

  //       // Cloud 2 pause & resume nodes
  //       expect(resultCoords[3].lat).toEqual(39.87823893411536);
  //       expect(resultCoords[3].lng).toEqual(-105.13519123155609);
  //       expect(resultCoords[3].timeStamp).toEqual('2023-07-04T20:01:20Z');

  //       expect(resultCoords[4].lat).toEqual(resultCoords[3].lat);
  //       expect(resultCoords[4].lng).toEqual(resultCoords[3].lng);
  //       expect(resultCoords[4].timeStamp).toEqual('2023-07-04T20:02:20Z');
  //     });
  //   });

  //   describe('#smoothByElevationSpeed', () => {
  //     it('should do nothing for coordinates with no DEM elevation', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
  //       ];

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should do nothing for coordinates with elevation changes below the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1010;  // 0 m/s // TODO: separate concerns of loss/gain? This is actually 5m up, 5m down over 30 sec ~ 5m/15sec = 0.3 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1005; // -0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1000; // -0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(0);
  //       expect(track.points().length).toEqual(5);
  //     });

  //     it('should remove points that have an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1000; // 0.3333 m/s // Remove
  //       // Seg: 10m/30sec = 0.3333m/s
  //       coords[1].elevation = 1010; // 0.25 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s     // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // 0.16667 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1005; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it(`should remove points that have an elevation loss speed above the general specified
  //       limit if no loss limit is specified`, () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1005; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1010; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1015; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1010; // -0.25 m/s
  //       // Seg: -10m/30sec = -0.3333/s
  //       coords[4].elevation = 1000; // -0.3333 m/s  // Remove

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove points that have an elevation loss speed above the specified limit for loss', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1025; // 0.0 m/s    // TODO: Fix
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[3].elevation = 1020; // -0.4167 m/s
  //       // Seg: -20m/30sec = -0.6667/s
  //       coords[4].elevation = 1000; // -0.6667 m/s  // Remove

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation gain speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -10m/30sec = -0.33333m/s
  //       coords[3].elevation = 1020; // -0.25 m/s
  //       // Seg: -5m/30sec = -0.16667m/s
  //       coords[4].elevation = 1015; // -0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where one adjacent segment has an elevation loss speed above the specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1020; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1025; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });

  //     it('should remove maxima/minima where each adjacent segment has an elevation speed above the corresponding specified limit', () => {
  //       const coords = [
  //         new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
  //         new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
  //         new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
  //         new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
  //         new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
  //       ];
  //       coords[0].elevation = 1015; // 0.16667 m/s
  //       // Seg: 5m/30sec = 0.16667m/s
  //       coords[1].elevation = 1020; // 0.25 m/s
  //       // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
  //       coords[2].elevation = 1030;
  //       // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
  //       coords[3].elevation = 1010; // -0.4167 m/s
  //       // Seg: -5m/30sec = 0.16667m/s
  //       coords[4].elevation = 1000; // 0.16667 m/s

  //       const track = new PolylineTrack(coords);
  //       track.addProperties();
  //       track.addElevationProperties();

  //       // 0.254 meters/sec = 3000 feet/hour
  //       const maxAscentRateMPS = 0.254;
  //       const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss

  //       const smoothResults = track.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

  //       expect(smoothResults).toEqual(1);
  //       expect(track.points().length).toEqual(4);
  //     });
  //   });
  // });
});