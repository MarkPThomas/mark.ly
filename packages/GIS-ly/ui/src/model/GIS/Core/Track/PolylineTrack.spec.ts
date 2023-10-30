import { VertexNode, EvaluatorArgs, SegmentNode } from '../../../Geometry/Polyline';
import { GeoJsonManager } from '../GeoJsonManager';

import { TrackPoint } from './TrackPoint';
import { ITrackPropertyProperties } from './TrackProperty';
import { TrackSegment } from './TrackSegment';
import { ITimeRange } from '../Time/TimeRange';

import { PolylineTrack } from './PolylineTrack';

// TODO: For any 'TimeRange' methods, create & test overloads for providing a Track instead of a time range.
describe('##PolylineTrack', () => {
  const sizeOf = (start: VertexNode<TrackPoint, TrackSegment>): number => {
    let count = 0;

    let currNode = start;
    while (currNode) {
      count++;
      currNode = currNode.next as VertexNode<TrackPoint, TrackSegment>;
    }

    return count;
  }

  let lineStringTrack;
  beforeEach(() => {
    lineStringTrack = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coords: [
              [100.0, 0.0, 100],
              [99.0, -1.0, 200],
              [103.5, 2.5, 350],
              [103.0, 3.0, 420],
              [104.75, 3.75, 510],
              [105.0, 5.0, 600],
            ]
          },
          properties: {
            _gpxType: 'trk',
            name: 'FooBarTest',
            time: 'timestamp',
            coordinateProperties: {
              times: [
                '2023-07-04T20:00:00Z',
                '2023-07-04T20:00:20Z',
                '2023-07-04T20:00:30Z',
                '2023-07-04T20:00:40Z',
                '2023-07-04T20:00:50Z',
                '2023-07-04T20:01:10Z'
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

      it('should create a new Polyline object from the provided TrackPoints', () => {
        const polylineTrack = new PolylineTrack(trackPoints);

        expect(polylineTrack.firstVertex.val).toEqual(trackPoints[0]);
        expect(polylineTrack.firstVertex.nextSeg).toEqual(polylineTrack.firstSegment);
        expect(polylineTrack.firstSegment.prevVert.val).toEqual(trackPoints[0]);
        expect(polylineTrack.firstSegment.nextVert.val).toEqual(trackPoints[1]);
      });
    });

    describe('Duplication', () => {
      let trackPoints: TrackPoint[];
      let polylineTrack: PolylineTrack;
      beforeEach(() => {
        const coord1 = new TrackPoint(-8.957287, -77.777452, 100);
        coord1.timestamp = '2023-07-04T17:22:15Z';

        const coord2 = new TrackPoint(-8.957069, -77.777400, 200);
        coord2.timestamp = '2023-07-04T17:22:35Z';

        const coord3 = new TrackPoint(-8.956936, -77.777381, 500);
        coord3.timestamp = '2023-07-04T17:22:46Z';

        const coord4 = new TrackPoint(-8.956758, -77.777211, 300);
        coord4.timestamp = '2023-07-04T17:23:50Z';

        const coord5 = new TrackPoint(-8.956768, -77.777311, 400);
        coord5.timestamp = '2023-07-04T17:24:08Z';

        const coord6 = new TrackPoint(-8.956778, -77.777411, 600);
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

      describe('#cloneFromToTimes', () => {
        beforeEach(() => {
          // Add properties to have more to track for point/segment copying
          polylineTrack.addProperties();
        });

        it('should return null for an empty Track', () => {
          const startTime = '2023-07-04T17:22:00Z';
          const endTime = trackPoints[2].timestamp;

          const emptyPolylineTrack = new PolylineTrack([]);
          const polylineTrackCopy = emptyPolylineTrack.cloneFromToTimes(startTime, endTime);

          expect(polylineTrackCopy).toBeNull();
        });

        it('should return null if the start time does not exist in the Track', () => {
          const polylineCopy = polylineTrack.cloneFromToTimes('Foo', trackPoints[2].timestamp);

          expect(polylineCopy).toBeNull();
        });

        it('should return null if the end time does not exist in the Track', () => {
          const polylineCopy = polylineTrack.cloneFromToTimes(trackPoints[2].timestamp, 'Foo');

          expect(polylineCopy).toBeNull();
        });

        it('should copy the Track from the head to tail if no times are given', () => {
          const polylineCopy = polylineTrack.cloneFromToTimes();

          expect(polylineCopy.size()).toEqual({
            vertices: 6,
            segments: 5
          });
          expect(polylineCopy.firstVertex.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.prevVert.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineCopy.firstSegment.nextVert.val.equals(trackPoints[1])).toBeTruthy();
          expect(polylineCopy.lastSegment.prevVert.val.equals(trackPoints[4])).toBeTruthy();
          expect(polylineCopy.lastSegment.nextVert.val.equals(trackPoints[5])).toBeTruthy();
          expect(polylineCopy.lastVertex.val.equals(trackPoints[5])).toBeTruthy();
        });

        it('should copy the Track from the head to the end time if only the end time is given', () => {
          const endTime = trackPoints[2].timestamp;

          const polylineTrackCopy = polylineTrack.cloneFromToTimes(null, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstVertex.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevVert.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextVert.val.equals(trackPoints[1])).toBeTruthy();
          expect(polylineTrackCopy.lastVertex.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.lastVertex.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.lastVertex.val.timestamp).toEqual(trackPoints[2].timestamp);
        });

        it('should copy the Track from the start time to the tail if only the start time is given', () => {
          const startTime = trackPoints[2].timestamp;

          const polylineTrackCopy = polylineTrack.cloneFromToTimes(startTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 4,
            segments: 3
          });
          expect(polylineTrackCopy.firstVertex.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.firstVertex.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.firstVertex.val.timestamp).toEqual(trackPoints[2].timestamp);
          expect(polylineTrackCopy.firstSegment.prevVert.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.firstSegment.prevVert.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.firstSegment.prevVert.val.timestamp).toEqual(trackPoints[2].timestamp);
          expect(polylineTrackCopy.firstSegment.nextVert.val.equals(trackPoints[3])).toBeTruthy();
          expect(polylineTrackCopy.lastVertex.val.equals(trackPoints[5])).toBeTruthy();
        });

        it('should copy the Track from the start time to the end time provided', () => {
          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[4].timestamp;

          const polylineTrackCopy = polylineTrack.cloneFromToTimes(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstVertex.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.firstVertex.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.firstVertex.val.timestamp).toEqual(trackPoints[2].timestamp);
          expect(polylineTrackCopy.firstSegment.prevVert.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.firstSegment.prevVert.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.firstSegment.prevVert.val.timestamp).toEqual(trackPoints[2].timestamp);
          expect(polylineTrackCopy.firstSegment.nextVert.val.equals(trackPoints[3])).toBeTruthy();
          expect(polylineTrackCopy.lastVertex.val.lat).toEqual(trackPoints[4].lat);
          expect(polylineTrackCopy.lastVertex.val.lng).toEqual(trackPoints[4].lng);
          expect(polylineTrackCopy.lastVertex.val.timestamp).toEqual(trackPoints[4].timestamp);
        });

        it('should copy the Track by value rather than by reference', () => {
          const startTime = trackPoints[0].timestamp;
          const endTime = trackPoints[2].timestamp;

          const polylineTrackCopy = polylineTrack.cloneFromToTimes(startTime, endTime);

          expect(polylineTrackCopy.size()).toEqual({
            vertices: 3,
            segments: 2
          });
          expect(polylineTrackCopy.firstVertex.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.prevVert.val.equals(trackPoints[0])).toBeTruthy();
          expect(polylineTrackCopy.firstSegment.nextVert.val.equals(trackPoints[1])).toBeTruthy();
          expect(polylineTrackCopy.lastVertex.val.lat).toEqual(trackPoints[2].lat);
          expect(polylineTrackCopy.lastVertex.val.lng).toEqual(trackPoints[2].lng);
          expect(polylineTrackCopy.lastVertex.val.timestamp).toEqual(trackPoints[2].timestamp);

          // Make original polylineTrack different to ensure copy is by value and not by reference
          let node = polylineTrack.firstVertex;

          const coord1New = new TrackPoint(-9, -77.777452);
          coord1New.timestamp = '2023-07-04T17:22:15Z';
          node.val = coord1New;
          node = node.next as VertexNode<TrackPoint, TrackSegment>;

          const coord2New = new TrackPoint(-8, -77.777400);
          coord2New.timestamp = '2023-07-04T17:22:35Z';
          node.val = coord2New;
          node = node.next as VertexNode<TrackPoint, TrackSegment>;

          const coord3New = new TrackPoint(-7, -77.777381);
          coord3New.timestamp = '2023-07-04T17:22:46Z';
          node.val = coord3New;
          node = node.next as VertexNode<TrackPoint, TrackSegment>;

          expect(polylineTrack.firstSegment.prevVert.val.equals(coord1New)).toBeTruthy();
          expect(polylineTrack.firstSegment.nextVert.val.equals(coord2New)).toBeTruthy();
          expect(polylineTrackCopy.firstVertex.val.equals(polylineTrack.firstVertex.val)).toBeFalsy();
          expect(polylineTrackCopy.lastVertex.val.equals(polylineTrack.lastVertex.val)).toBeFalsy();
        });

        it(`should update the 2nd-order properties of the first and last time of the copied Track`, () => {
          polylineTrack.addElevationProperties();

          const vertex1 = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp);
          const vertex2 = polylineTrack.vertexNodeByTime(trackPoints[4].timestamp);

          expect(vertex1.val.path.rotation).toBeCloseTo(-0.6161, 4);
          expect(vertex1.val.path.rotationRate).toBeCloseTo(-0.008215, 6);
          expect(vertex1.val.path.speed).toBeCloseTo(0.8914, 4);
          expect(vertex1.val.path.ascentRate).toBeCloseTo(27.3, 1);
          expect(vertex1.val.path.descentRate).toBeCloseTo(3.125, 3);

          expect(vertex2.val.path.rotation).toBeCloseTo(0.0000037, 7);
          expect(vertex2.val.path.rotationRate).toBeCloseTo(0.000000098, 9);
          expect(vertex2.val.path.speed).toBeCloseTo(0.5827, 4);
          expect(vertex2.val.path.ascentRate).toBeCloseTo(7.78, 2);
          expect(vertex2.val.path.descentRate).toBeCloseTo(0, 1);

          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[4].timestamp;

          const polylineCopy = polylineTrack.cloneFromToTimes(startTime, endTime);

          expect(polylineCopy.firstVertex.val.path.rotation).toBeNull();
          expect(polylineCopy.firstVertex.val.path.rotationRate).toBeNull();
          expect(polylineCopy.firstVertex.val.path.speed).toBeCloseTo(1.245, 3);
          expect(polylineCopy.firstVertex.val.path.ascentRate).toBeCloseTo(5, 1);
          expect(polylineCopy.firstVertex.val.path.descentRate).toBeCloseTo(0, 3);

          expect(polylineCopy.lastVertex.val.path.rotation).toBeNull();
          expect(polylineCopy.lastVertex.val.path.rotationRate).toBeNull();
          expect(polylineCopy.lastVertex.val.path.speed).toBeCloseTo(1.358, 3);
          expect(polylineCopy.lastVertex.val.path.ascentRate).toBeCloseTo(27.27, 2);
          expect(polylineCopy.lastVertex.val.path.descentRate).toBeCloseTo(0, 1);
        });

        // TODO: Determine best way to validate this
        it('should include cloning the timestamp map if specified', () => {
          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[4].timestamp;
          const includeTimeStampMap = true;

          const polylineCopy = polylineTrack.cloneFromToTimes(startTime, endTime, includeTimeStampMap);
          // TODO: Determine best way to validate this
        });
      });
    });
  });

  describe('Common Interfaces', () => {
    let trackPoints: TrackPoint[];
    let polylineTrack: PolylineTrack;

    beforeEach(() => {
      const coord1 = new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z');
      const coord2 = new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z');
      const coord3 = new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z');
      const coord4 = new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:08Z');
      const coord5 = new TrackPoint(-8.956768, -77.777311, null, '2023-07-04T17:24:08Z');
      const coord6 = new TrackPoint(-8.956778, -77.777411, null, '2023-07-04T17:24:28Z');

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

    describe('#clone', () => {
      it('should clone the Track Polyline', () => {
        const polylineClone = polylineTrack.clone();

        expect(polylineClone.equals(polylineTrack)).not.toBeTruthy();

        expect(polylineClone.size()).toEqual({
          vertices: 6,
          segments: 5
        });
        expect(polylineClone.firstVertex.val.equals(trackPoints[0])).toBeTruthy();
        expect(polylineClone.firstSegment.prevVert.val.equals(trackPoints[0])).toBeTruthy();
        expect(polylineClone.firstSegment.nextVert.val.equals(trackPoints[1])).toBeTruthy();
        expect(polylineClone.lastSegment.prevVert.val.equals(trackPoints[4])).toBeTruthy();
        expect(polylineClone.lastSegment.nextVert.val.equals(trackPoints[5])).toBeTruthy();
        expect(polylineClone.lastVertex.val.equals(trackPoints[5])).toBeTruthy();
      });
    });

    describe('#equals', () => {
      it('should return False for Track Polylines with differing TrackPoints', () => {
        const polyline1 = new PolylineTrack(trackPoints);

        const trackPointsDifferent = [
          new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z'),
          new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z'),
          new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z'),
          new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:28Z'),  // Only differs by timestamp
          new TrackPoint(-8.956768, -77.777311, null, '2023-07-04T17:24:08Z'),
          new TrackPoint(-8.956778, -77.777411, null, '2023-07-04T17:24:28Z')
        ];
        const polyline2 = new PolylineTrack(trackPointsDifferent);

        const result = polyline1.equals(polyline2);

        expect(result).toBeFalsy();
      });

      it('should return True for Track Polylines with identical TrackPoints', () => {
        const polyline1 = new PolylineTrack(trackPoints);
        const polyline2 = new PolylineTrack(trackPoints);

        const result = polyline1.equals(polyline2);

        expect(result).toBeTruthy();
      });
    });
  });

  // TODO: Test
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

      it('should add derived properties to coords', () => {
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
        expect(trackCoords[0].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[0].path.descentRate).toBeCloseTo(0, 0);

        expect(trackSegs[0].height).toBeCloseTo(1000, 1);
        expect(trackSegs[0].heightRate).toBeCloseTo(50, 1);

        expect(trackCoords[1].elevation).toEqual(2000);
        expect(trackCoords[1].path.ascentRate).toBeCloseTo(50, 1);
        expect(trackCoords[1].path.descentRate).toBeCloseTo(50, 1);

        expect(trackSegs[1].height).toBeCloseTo(-500, 1);
        expect(trackSegs[1].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[2].elevation).toEqual(1500);
        expect(trackCoords[2].path.ascentRate).toBeCloseTo(0, 0);
        expect(trackCoords[2].path.descentRate).toBeCloseTo(50, 1);

        expect(trackSegs[2].height).toBeUndefined();
        expect(trackSegs[2].heightRate).toBeUndefined();

        expect(trackCoords[3].elevation).toBeUndefined();
        expect(trackCoords[3].path.ascentRate).toBeUndefined();
        expect(trackCoords[3].path.descentRate).toBeUndefined();

        expect(trackSegs[3].height).toBeUndefined();
        expect(trackSegs[3].heightRate).toBeUndefined();

        expect(trackCoords[4].elevation).toEqual(5000);
        expect(trackCoords[4].path.ascentRate).toBeCloseTo(0, 0);
        expect(trackCoords[4].path.descentRate).toBeCloseTo(50, 1);

        expect(trackSegs[4].height).toBeCloseTo(-1000, 1);
        expect(trackSegs[4].heightRate).toBeCloseTo(-50, 1);

        expect(trackCoords[5].elevation).toEqual(4000);
        expect(trackCoords[5].path.ascentRate).toBeCloseTo(0, 0);
        expect(trackCoords[5].path.descentRate).toBeCloseTo(50, 1);
      });
    });
  });

  describe('Accessing Items', () => {
    let trackPoints: TrackPoint[];
    let polylineTrack: PolylineTrack;

    beforeEach(() => {
      const coord1 = new TrackPoint(-8.957287, -77.777452, null, '2023-07-04T17:22:15Z');
      const coord2 = new TrackPoint(-8.957069, -77.777400, null, '2023-07-04T17:22:35Z');
      const coord3 = new TrackPoint(-8.956936, -77.777381, null, '2023-07-04T17:22:46Z');
      const coord4 = new TrackPoint(-8.956758, -77.777211, null, '2023-07-04T17:23:08Z');
      const coord5 = new TrackPoint(-8.956768, -77.777311, null, '2023-07-04T17:24:08Z');
      const coord6 = new TrackPoint(-8.956778, -77.777411, null, '2023-07-04T17:24:28Z');

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

    describe('#vertexNodeByTime', () => {
      it('should return undefined if null is given for the time', () => {
        const nodes = polylineTrack.vertexNodeByTime(null);

        expect(nodes).toBeUndefined();
      });

      it('should return undefined if an empty string is given for the time', () => {
        const nodes = polylineTrack.vertexNodeByTime('');

        expect(nodes).toBeUndefined();
      });

      it('should return undefined if the given time is not found', () => {
        const nodes = polylineTrack.vertexNodeByTime('Foo');

        expect(nodes).toBeUndefined();
      });

      it('should return the vertex node corresponding to the provided time', () => {
        const nodes = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp);

        expect(nodes.equals(trackPoints[2])).toBeTruthy();
      });
    });

    // Use optional enum for these options?
    // vertexNodeClosestToTime
    // vertexNodeBeforeTime
    // vertexNodeAfterTime

    // vertexNodesByTimeRange
    // use boolean for the following?
    // vertexNodesFromToTime
    // vertexNodesBetweenTime
    // use boolean for exact vs. bounds

    // these can all be used in all methods. Testing need only be done here, just method signatures changed.

    // TODO: Test
    describe('#isPolylineTrack', () => {

    });
  });

  describe('Manipulating PolylineTrack', () => {
    let trackPoints: TrackPoint[];
    let polylineTrack: PolylineTrack;

    beforeEach(() => {
      const positions = lineStringTrack.features[0].geometry.coords;
      const times = (lineStringTrack.features[0].properties as ITrackPropertyProperties).coordinateProperties.times as string[];
      trackPoints = GeoJsonManager.PositionsToTrackPoints(positions, times);
      polylineTrack = new PolylineTrack(trackPoints);
    });

    describe('Trim', () => {
      let time1: string;
      let time2: string;

      beforeEach(() => {
        trackPoints = [
          new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
          new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:20Z'),
          new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:00:30Z'),
          new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:00:40Z'),
          new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:00:50Z'),
          new TrackPoint(39.739914418342, -104.99174913377, 0, '2023-07-04T20:01:10Z')
        ];
        trackPoints[0].elevation = 1000;
        trackPoints[1].elevation = 2000;
        trackPoints[2].elevation = 1500;
        trackPoints[3].elevation = 1600;
        trackPoints[4].elevation = 5000;
        trackPoints[5].elevation = 4000;

        polylineTrack = new PolylineTrack(trackPoints);
        polylineTrack.addProperties();
        polylineTrack.addElevationProperties();


        time1 = trackPoints[2].timestamp;
        time2 = trackPoints[3].timestamp;
      });

      describe('#trimBeforeTime', () => {
        it('should do nothing and return null on an empty Track', () => {
          polylineTrack = new PolylineTrack([]);

          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;


          const trimmedPoint = polylineTrack.trimBeforeTime(time1);

          expect(trimmedPoint).toBeNull();
          expect(polylineTrack.size().vertices).toEqual(0);
          expect(polylineTrack.size().segments).toEqual(0);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified time does not exist for any Point in the Track', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const nonExistingTime = 'Foo';
          const trimmedPoint = polylineTrack.trimBeforeTime(nonExistingTime);

          expect(trimmedPoint).toBeNull();
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.size().vertices).toEqual(6);
          expect(polylineTrack.size().segments).toEqual(5);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();
        });

        it('should trim off vertices & segments before the specified Point & return the head vertex node of the trimmed portion', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time1);
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          const trimmedPoint = polylineTrack.trimBeforeTime(time1);

          expect(trimmedPoint).toEqual(originalVertexHead);

          expect(polylineTrack.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();

          // New Head
          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        // TODO: Update
        it(`should update the 2nd-order properties of the start Point after trimming`, () => {
          const vertex = polylineTrack.vertexNodeByTime(time1);

          expect(vertex.val.path.rotation).toBeCloseTo(3.038, 3);

          polylineTrack.trimBeforeTime(time1);

          expect(vertex.val.path.rotation).toBeNull();
        });
      });

      describe('#trimAfterTime', () => {
        it('should do nothing and return null on an empty Track', () => {
          polylineTrack = new PolylineTrack([]);

          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;


          const trimmedPoint = polylineTrack.trimAfterTime(time2);

          expect(trimmedPoint).toBeNull();
          expect(polylineTrack.size().vertices).toEqual(0);
          expect(polylineTrack.size().segments).toEqual(0);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.vertices()).toEqual([]);
        });

        it('should do nothing and return null when the specified time does not exist for any Point in the Track', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const nonExistingTime = 'Foo';
          const trimmedPoint = polylineTrack.trimAfterTime(nonExistingTime);

          expect(trimmedPoint).toBeNull();
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.size().vertices).toEqual(6);
          expect(polylineTrack.size().segments).toEqual(5);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();
        });

        it(`should trim off vertices & segments after the specified Point & return the head vertex node of the trimmed portion`, () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time2);
          const vertexTrimmed = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const trimmedPoint = polylineTrack.trimAfterTime(time2);

          expect(trimmedPoint).toEqual(vertexTrimmed);

          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1 - 2])).toBeTruthy();

          // New Tail
          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        // TODO: Update
        it(`should update the 2nd-order properties of the end Point after trimming`, () => {
          const vertex = polylineTrack.vertexNodeByTime(time2);

          expect(vertex.val.path.rotation).toBeCloseTo(-1.531, 3);

          polylineTrack.trimAfterTime(time2);

          expect(vertex.val.path.rotation).toBeNull();
        });
      });

      describe('#trimToTimes', () => {
        it('should do nothing and return a null tuple on an empty Track', () => {
          polylineTrack = new PolylineTrack([]);

          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const trimmedPoints = polylineTrack.trimToTimes(time1, time2);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineTrack.size().vertices).toEqual(0);
          expect(polylineTrack.size().segments).toEqual(0);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.vertices()).toEqual([]);
        });

        it('should do nothing and return a null tuple when the specified time does not exist for any Point in the Track', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const nonExistingPoint1 = 'Foo';
          const nonExistingPoint2 = 'Bar';
          const trimmedPoints = polylineTrack.trimToTimes(nonExistingPoint1, nonExistingPoint2);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.size().vertices).toEqual(6);
          expect(polylineTrack.size().segments).toEqual(5);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();
        });

        it(`should trim off vertices & segments before & after the specified start & end Points
          & return the head vertex node of each of the trimmed portions`, () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          // Trim before state
          const vertex1 = polylineTrack.vertexNodeByTime(time1);
          const trimmed1 = polylineTrack.firstVertex;
          const segmentNext = vertex1.nextSeg;
          const trimmedVertexTail = vertex1.prev as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex1.prev).not.toBeNull();
          expect(vertex1.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          // Derived Properties
          expect(vertex1.val.path.rotation).toBeCloseTo(3.038, 3);

          // Trim after state
          const vertex2 = polylineTrack.vertexNodeByTime(time2);
          const trimmed2 = vertex2.next;
          const segmentPrev = vertex2.prevSeg;
          const trimmedVertexHead = vertex2.next as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex2.next).not.toBeNull();
          expect(vertex2.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          // Derived Properties
          expect(vertex2.val.path.rotation).toBeCloseTo(-1.531, 3);


          const trimmedPoints = polylineTrack.trimToTimes(time1, time2);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineTrack.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(2);
          expect(polylineTrack.size().segments).toEqual(1);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1 - 2])).toBeTruthy();

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
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time1);
          const trimmed1 = polylineTrack.firstVertex;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();


          const trimmedPoints = polylineTrack.trimToTimes(time1, null);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          expect(polylineTrack.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments before the specified start Point if the end Point is not found', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time1);
          const trimmed1 = polylineTrack.firstVertex;
          const segmentNext = vertex.nextSeg;
          const trimmedVertexTail = vertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.prev).not.toBeNull();
          expect(vertex.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          const nonExistingTime = 'Foo';
          const trimmedPoints = polylineTrack.trimToTimes(time1, nonExistingTime);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toBeNull();

          expect(polylineTrack.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();

          expect(vertex.prev).toBeNull();
          expect(vertex.prevSeg).toBeNull();
          expect(segmentNext.prev).toBeNull();

          expect(trimmedVertexTail.next).toBeNull();
          expect(trimmedSegmentTail.next).toBeNull();
          expect(trimmedSegmentTail.nextVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not specified', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time2);
          const trimmed2 = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const trimmedPoints = polylineTrack.trimToTimes(null, time2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1 - 2])).toBeTruthy();

          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });

        it('should trim off vertices & segments after the specified end Point if the start Point is not found', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const vertex = polylineTrack.vertexNodeByTime(time2);
          const trimmed2 = vertex.next;
          const segmentPrev = vertex.prevSeg;
          const trimmedVertexHead = vertex.next as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex.next).not.toBeNull();
          expect(vertex.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();


          const nonExistingTime = 'Foo';
          const trimmedPoints = polylineTrack.trimToTimes(nonExistingTime, time2);

          expect(trimmedPoints[0]).toBeNull();
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(4);
          expect(polylineTrack.size().segments).toEqual(3);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1 - 2])).toBeTruthy();

          expect(vertex.next).toBeNull();
          expect(vertex.nextSeg).toBeNull();
          expect(segmentPrev.next).toBeNull();

          expect(trimmedVertexHead.prev).toBeNull();
          expect(trimmedSegmentHead.prev).toBeNull();
          expect(trimmedSegmentHead.prevVert).toBeNull();
        });
      });

      describe('#trimToTimeRange', () => {
        it('should do nothing for an empty time segment', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const emptyTimeRange: ITimeRange = {
            startTime: '',
            endTime: ''
          }
          const trimmedPoints = polylineTrack.trimToTimeRange(emptyTimeRange);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.size().vertices).toEqual(6);
          expect(polylineTrack.size().segments).toEqual(5);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();
        });

        it('should do nothing for an empty time segment', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          const nonExistingTimeSegment: ITimeRange = {
            startTime: 'Foo',
            endTime: 'Bar'
          }
          const trimmedPoints = polylineTrack.trimToTimeRange(nonExistingTimeSegment);

          expect(trimmedPoints).toEqual([null, null]);
          expect(polylineTrack.firstVertex).toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).toEqual(originalSegmentTail);
          expect(polylineTrack.size().vertices).toEqual(6);
          expect(polylineTrack.size().segments).toEqual(5);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[0])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1])).toBeTruthy();
        });

        it('should trim off vertices and segments outside of the start/end times & return the head nodes of each trimmed section', () => {
          const originalVertexHead = polylineTrack.firstVertex;
          const originalSegmentHead = polylineTrack.firstSegment;
          const originalVertexTail = polylineTrack.lastVertex;
          const originalSegmentTail = polylineTrack.lastSegment;

          // Trim before state
          const vertex1 = polylineTrack.vertexNodeByTime(time1);
          const trimmed1 = polylineTrack.firstVertex;
          const segmentNext = vertex1.nextSeg;
          const trimmedVertexTail = vertex1.prev as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentTail = segmentNext.prev as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex1.prev).not.toBeNull();
          expect(vertex1.prevSeg).not.toBeNull();
          expect(segmentNext.prev).not.toBeNull();
          expect(segmentNext.prevVert).not.toBeNull();

          // Derived Properties
          expect(vertex1.val.path.rotation).toBeCloseTo(3.038, 3);

          // Trim after state
          const vertex2 = polylineTrack.vertexNodeByTime(time2);
          const trimmed2 = vertex2.next;
          const segmentPrev = vertex2.prevSeg;
          const trimmedVertexHead = vertex2.next as VertexNode<TrackPoint, TrackSegment>;
          const trimmedSegmentHead = segmentPrev.next as SegmentNode<TrackPoint, TrackSegment>;

          expect(vertex2.next).not.toBeNull();
          expect(vertex2.nextSeg).not.toBeNull();
          expect(segmentPrev.next).not.toBeNull();
          expect(segmentPrev.nextVert).not.toBeNull();

          const timeRange: ITimeRange = {
            startTime: time1,
            endTime: time2
          }
          const trimmedPoints = polylineTrack.trimToTimeRange(timeRange);

          expect(trimmedPoints[0]).toEqual(trimmed1);
          expect(trimmedPoints[1]).toEqual(trimmed2);

          expect(polylineTrack.firstVertex).not.toEqual(originalVertexHead);
          expect(polylineTrack.firstSegment).not.toEqual(originalSegmentHead);
          expect(polylineTrack.lastVertex).not.toEqual(originalVertexTail);
          expect(polylineTrack.lastSegment).not.toEqual(originalSegmentTail);

          expect(polylineTrack.size().vertices).toEqual(2);
          expect(polylineTrack.size().segments).toEqual(1);

          const vertices = polylineTrack.vertices();
          expect(vertices[0].equals(trackPoints[2])).toBeTruthy();
          expect(vertices[vertices.length - 1].equals(trackPoints[trackPoints.length - 1 - 2])).toBeTruthy();

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
        });
      });
    });

    describe('Remove', () => {
      describe('#removeAtTime', () => {
        it('should do nothing & return null for an empty Track', () => {
          const existingTime = trackPoints[0].timestamp;
          const polylineTrack = new PolylineTrack([]);

          const pointRemoved = polylineTrack.removeAtTime(existingTime);

          expect(pointRemoved).toBeNull();

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(0);
          expect(polylineTrackLength.segments).toEqual(0);
        });

        it('should do nothing & return null for a Point provided that is not in the Track', () => {
          const nonExistingTime = 'Foo';

          const pointRemoved = polylineTrack.removeAtTime(nonExistingTime);

          expect(pointRemoved).toBeNull();

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(trackPoints.length);
          expect(polylineTrackLength.segments).toEqual(trackPoints.length - 1);
        });

        it('should remove & return the valid Point provided', () => {
          const existingTime = trackPoints[1].timestamp;

          const pointRemoved = polylineTrack.removeAtTime(existingTime);
          expect(pointRemoved.val.timestamp).toEqual(existingTime);

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(trackPoints.length - 1);
          expect(polylineTrackLength.segments).toEqual(trackPoints.length - 1 - 1);
        });

        it(`should update the segment property spanning over the removed Point`, () => {
          const existingTime = trackPoints[1].timestamp;

          const removedVertexNode = polylineTrack.vertexNodeByTime(existingTime);
          const prevSegmentNode = removedVertexNode.prevSeg;
          expect(prevSegmentNode.val.angle).toBeCloseTo(-2.3562, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'S',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(100, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(157249.4, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(20, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(7862.5, 1);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(5, 1);

          polylineTrack.removeAtTime(existingTime);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6202, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(250, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(478166.9, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(30, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(15938.9, 1);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(8.3, 1);
        });

        it(`should update the 2nd-order properties of the Points just before and just after the removed Point`, () => {
          polylineTrack.addProperties();
          const existingTime = trackPoints[2].timestamp;

          const removedVertexNode = polylineTrack.vertexNodeByTime(existingTime);

          const prevVertexNode = removedVertexNode.prev;
          expect(prevVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);

          expect(prevVertexNode.val.path.rotationRate).toBeCloseTo(0.1006, 4);
          expect(prevVertexNode.val.path.speed).toBeCloseTo(35621.9, 1);
          expect(prevVertexNode.val.path.ascentRate).toBeCloseTo(10, 1);
          expect(prevVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          const nextVertexNode = removedVertexNode.next;
          expect(nextVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          expect(nextVertexNode.val.path.rotationRate).toBeCloseTo(-0.0975, 4);
          expect(nextVertexNode.val.path.speed).toBeCloseTo(14498.9, 1);
          expect(nextVertexNode.val.path.ascentRate).toBeCloseTo(8, 1);
          expect(nextVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.removeAtTime(existingTime);

          expect(prevVertexNode.val.path.rotation).toBeCloseTo(3.1417, 4);

          expect(prevVertexNode.val.path.rotationRate).toBeCloseTo(0.0785, 4);
          expect(prevVertexNode.val.path.speed).toBeCloseTo(19653.8, 1);
          expect(prevVertexNode.val.path.ascentRate).toBeCloseTo(8, 1);
          expect(prevVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          expect(nextVertexNode.val.path.rotation).toBeCloseTo(-0.3801, 4);

          expect(nextVertexNode.val.path.rotationRate).toBeCloseTo(-0.0127, 4);
          expect(nextVertexNode.val.path.speed).toBeCloseTo(26292.4, 1);
          expect(nextVertexNode.val.path.ascentRate).toBeCloseTo(10, 1);
          expect(nextVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#removeAtAnyTime', () => {
        it('should do nothing & return null for Points provided that are not in the Track', () => {
          const nonExistingTime = 'Foo';

          const pointsRemoved = polylineTrack.removeAtAnyTime([nonExistingTime]);

          expect(pointsRemoved.length).toEqual(0);

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(trackPoints.length);
          expect(polylineTrackLength.segments).toEqual(trackPoints.length - 1);
        });

        it('should remove the Points provided & return the Points removed', () => {
          const time1 = trackPoints[0].timestamp;
          const time2 = trackPoints[3].timestamp;

          const pointsRemoved = polylineTrack.removeAtAnyTime([time1, time2]);

          expect(pointsRemoved.length).toEqual(2);
          expect(pointsRemoved[0].val.timestamp).toEqual(time1);
          expect(pointsRemoved[1].val.timestamp).toEqual(time2);

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(trackPoints.length - 2);
          expect(polylineTrackLength.segments).toEqual(trackPoints.length - 2 - 1);
        });

        it(`should remove the valid Points provided, ignoring ones that are not found in the Track,
        & return the actual Points removed`, () => {
          const time1 = trackPoints[0].timestamp;
          const time2 = 'Foo';
          const time3 = trackPoints[3].timestamp;

          const pointsRemoved = polylineTrack.removeAtAnyTime([time1, time2, time3]);

          expect(pointsRemoved.length).toEqual(2);
          expect(pointsRemoved[0].val.timestamp).toEqual(time1);
          expect(pointsRemoved[1].val.timestamp).toEqual(time3);

          const polylineTrackLength = polylineTrack.size();
          expect(polylineTrackLength.vertices).toEqual(trackPoints.length - 2);
          expect(polylineTrackLength.segments).toEqual(trackPoints.length - 2 - 1);
        });
      });

      describe('#removeBetweenTimes', () => {
        it('should do nothing & return null if the head & tail Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const startTime = null;
          const endTime = null;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null if only a tail Point is provided & tail Point is at the head of the Track`, () => {
          const initialLength = polylineTrack.size();

          const startTime = null;
          const endTime = trackPoints[0].timestamp;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null if only a head Point is provided & head Point is at the tail of the Track`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[trackPoints.length - 1].timestamp;
          const endTime = null;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null when the head/tail Points are the same`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[1].timestamp;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should do nothing & return null when the head/tail Points are adjacent`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[2].timestamp;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are not adjacent`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const removedPointsHead = polylineTrack.removeBetweenTimes(startTime, endTime);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(2);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - 2);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - 2);
        });

        it(`should update the segment property spanning over the removed Points`, () => {
          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const startVertexNode = polylineTrack.vertexNodeByTime(startTime);
          const prevSegmentNode = startVertexNode.nextSeg;
          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(10, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(63381.33, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(15, 1);

          polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6905, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(310, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(829032.4, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(30, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(27634.4, 1);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(10.3, 1);
        });

        it(`should update the 2nd-order properties of the Points just before and just after the removed Points`, () => {
          polylineTrack.addProperties();
          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[4].timestamp;

          const priorStartVertexNode = polylineTrack.vertexNodeByTime(startTime);
          expect(priorStartVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);

          expect(priorStartVertexNode.val.path.rotationRate).toBeCloseTo(0.0847, 4);
          expect(priorStartVertexNode.val.path.speed).toBeCloseTo(35619.7, 1);
          expect(priorStartVertexNode.val.path.ascentRate).toBeCloseTo(11, 1);
          expect(priorStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const priorEndVertexNode = polylineTrack.vertexNodeByTime(endTime);
          expect(priorEndVertexNode.val.path.rotation).toBeCloseTo(0.9684, 4);

          expect(priorEndVertexNode.val.path.rotationRate).toBeCloseTo(0.0323, 4);
          expect(priorEndVertexNode.val.path.speed).toBeCloseTo(14113.1, 1);
          expect(priorEndVertexNode.val.path.ascentRate).toBeCloseTo(6.75, 2);
          expect(priorEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.removeBetweenTimes(startTime, endTime);

          expect(priorStartVertexNode.val.path.rotation).toBeCloseTo(0.1248, 4);

          expect(priorStartVertexNode.val.path.rotationRate).toBeCloseTo(0.0042, 4);
          expect(priorStartVertexNode.val.path.speed).toBeCloseTo(36601.1, 1);
          expect(priorStartVertexNode.val.path.ascentRate).toBeCloseTo(11.5, 1);
          expect(priorStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(priorEndVertexNode.val.path.rotation).toBeCloseTo(0.5879, 4);

          expect(priorEndVertexNode.val.path.rotationRate).toBeCloseTo(0.0147, 4);
          expect(priorEndVertexNode.val.path.speed).toBeCloseTo(8453.7, 1);
          expect(priorEndVertexNode.val.path.ascentRate).toBeCloseTo(6.25, 2);
          expect(priorEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#removeFromToTimes', () => {
        it('should do nothing & return null if the head & tail Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const startTime = null;
          const endTime = null;

          const removedPointsHead = polylineTrack.removeFromToTimes(startTime, endTime);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should remove and return the Point when the head/tail Points are the same`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[1].timestamp;

          const removedPointsHead = polylineTrack.removeFromToTimes(startTime, endTime);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(1);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are adjacent`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[2].timestamp;

          const removedPointsHead = polylineTrack.removeFromToTimes(startTime, endTime);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(2);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are not adjacent`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const removedPointsHead = polylineTrack.removeFromToTimes(startTime, endTime);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(4);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });
      });

      describe('#removeTimeRange', () => {
        it('should do nothing & return null if the head & tail Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const emptyTimeRange: ITimeRange = {
            startTime: '',
            endTime: ''
          }
          const removedPointsHead = polylineTrack.removeTimeRange(emptyTimeRange);

          expect(removedPointsHead).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should remove and return the Point when the head/tail Points are the same`, () => {
          const initialLength = polylineTrack.size();

          const timeRange: ITimeRange = {
            startTime: trackPoints[1].timestamp,
            endTime: trackPoints[1].timestamp
          }
          const removedPointsHead = polylineTrack.removeTimeRange(timeRange);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(1);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are adjacent`, () => {
          const initialLength = polylineTrack.size();

          const timeRange: ITimeRange = {
            startTime: trackPoints[1].timestamp,
            endTime: trackPoints[2].timestamp
          }
          const removedPointsHead = polylineTrack.removeTimeRange(timeRange);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(2);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });

        it(`should remove the range of Points specified & return the head vertex node of the removed range
          when the head/tail Points are not adjacent`, () => {
          const initialLength = polylineTrack.size();

          const timeRange: ITimeRange = {
            startTime: trackPoints[1].timestamp,
            endTime: trackPoints[4].timestamp
          }
          const removedPointsHead = polylineTrack.removeTimeRange(timeRange);

          const removedPointsLength = sizeOf(removedPointsHead);
          expect(removedPointsLength).toEqual(4);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedPointsLength);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedPointsLength);
        });
      });
    });

    // TODO: Add & test the following capabilities:
    //  1. Timestamp validation - must lie between start/end values, etc. This may be what requires non-string timestamps.
    //    1.a. Perhaps failure is a thrown error w/ a message that can be relayed to used.
    //    1.b. User could opt to override timestamps, which first calls a method to clear timestamps of insertion before trying again.
    //  2. For each inserted item where timestamp is missing, add timestamp interpolated between prior & next point times and relative distances between them.
    describe('Insert', () => {
      describe('#prependRoute', () => {
        it(`should update the 2nd-order properties of the last Point of the prepended Track and first Point of the original Track`, () => {
          polylineTrack.addProperties();

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T19:00:00Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T19:00:20Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T19:00:40Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          expect(insertEndVertexNode.val.path.rotationRate).toBeNull();
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(27797.7, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(1.5, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          const startVertexNode = polylineTrack.firstVertex;
          expect(startVertexNode.val.path.rotation).toBeNull();

          expect(startVertexNode.val.path.rotationRate).toBeNull();
          expect(startVertexNode.val.path.speed).toBeCloseTo(7862.5, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(5, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          polylineTrack.prependRoute(insertedRoute);

          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(-2.9779, 4);

          expect(insertEndVertexNode.val.path.rotationRate).toBeCloseTo(-0.0008, 4);
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(14010.0, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(1.5, 1);  // same
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(startVertexNode.val.path.rotation).toBeCloseTo(0.6017, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.0002, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(4042.4, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(5, 1);    // same
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0.039, 3);
        });
      });

      describe('#appendRoute', () => {
        it(`should update the 2nd-order properties of the last Point of the prepended Track and first Point of the original Track`, () => {
          polylineTrack.addProperties();
          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:01:30Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:01:40Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:01:50Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const endVertexNode = polylineTrack.lastVertex;
          expect(endVertexNode.val.path.rotation).toBeNull();

          expect(endVertexNode.val.path.rotationRate).toBeNull();
          expect(endVertexNode.val.path.speed).toBeCloseTo(7086.5, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(4.5, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          expect(insertStartVertexNode.val.path.rotationRate).toBeNull();
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(5668.8, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.appendRoute(insertedRoute);

          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(2.4977, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.0919, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(18100.0, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(4.5, 1);    // same
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(20, 1);


          expect(endVertexNode.val.path.rotation).toBeCloseTo(-3.6741, 4);

          expect(insertStartVertexNode.val.path.rotationRate).toBeCloseTo(0.0833, 4);
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(17391.1, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);    // same
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(20, 1);
        });
      });

      describe('#insertBeforeTime', () => {
        it(`should do nothing & return 0 if the specified target Point does not exist in the Track`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = 'Foo';
          const insertionPoint = new TrackPoint(1.1, 101.5, 200);

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertionPoint);

          expect(insertedCount).toEqual(0);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments);
        });

        it(`should insert the Point before the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalPrevTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[1].timestamp);

          const insertionPoint = new TrackPoint(1.1, 101.5, 200);

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertionPoint);

          expect(insertedCount).toEqual(1);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(originalPrevTargetPointNode.next.val).toEqual(insertionPoint);
          expect(targetPointNode.prev.val).toEqual(insertionPoint);
        });

        it(`should insert the Points before the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalPrevTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[1].timestamp);

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(originalPrevTargetPointNode.next.val).toEqual(point1);
          expect(targetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Points before the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should insert the Track before the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalPrevTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[1].timestamp);

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(originalPrevTargetPointNode.next.val).toEqual(point1);
          expect(targetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Track before the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const returnListCount = true;

          const insertedCount = polylineTrack.insertBeforeTime(targetTime, insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          polylineTrack.addProperties();

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:22Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:25Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:27Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const targetTime = trackPoints[2].timestamp;
          const targetVertex = polylineTrack.vertexNodeByTime(targetTime);
          const startVertexNode = targetVertex.prev as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(10, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(63381.33, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(15, 1);

          polylineTrack.insertBeforeTime(targetTime, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(2, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(181517.8, 1);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(2.5, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineTrack.addProperties();

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:22Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:25Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:27Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const targetTime = trackPoints[2].timestamp;
          const targetVertex = polylineTrack.vertexNodeByTime(targetTime);

          const startVertexNode = targetVertex.prev as VertexNode<TrackPoint, TrackSegment>;
          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1006, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(35621.9, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(10, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          expect(insertStartVertexNode.val.path.rotationRate).toBeNull();
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(18895.8, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1.7, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          expect(insertEndVertexNode.val.path.rotationRate).toBeNull();
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(277976.7, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(15, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const endVertexNode = targetVertex;
          expect(endVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(0.0847, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(35619.7, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(11, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.insertBeforeTime(targetTime, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1389, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(94690.1, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(3.75, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);

          expect(insertStartVertexNode.val.path.rotationRate).toBeCloseTo(-0.1003, 4);
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(100206.8, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(2.1, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7912, 4);

          expect(insertEndVertexNode.val.path.rotationRate).toBeCloseTo(0.5582, 4);
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(207523.7, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(25.8, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(endVertexNode.val.path.rotation).toBeCloseTo(-0.4555, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.0350, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(72464.4, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(21.8, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#insertAfterTime', () => {
        it(`should do nothing & return 0 if the specified target Point does not exist in the Track`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = 'Foo';
          const insertionPoint = new TrackPoint(1.1, 101.5, 200);

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertionPoint);

          expect(insertedCount).toEqual(0);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments);
        });

        it(`should insert the Point after the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalNextTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[3].timestamp);

          const insertionPoint = new TrackPoint(1.1, 101.5, 200);

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertionPoint);

          expect(insertedCount).toEqual(1);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);

          expect(targetPointNode.next.val).toEqual(insertionPoint);
          expect(originalNextTargetPointNode.prev.val).toEqual(insertionPoint);
        });

        it(`should insert the Points after the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalNextTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[3].timestamp);

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertionPoints);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(targetPointNode.next.val).toEqual(point1);
          expect(originalNextTargetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Points after the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const insertionPoints = [point1, point2, point3];

          const returnListCount = true;

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertionPoints, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should insert the Track after the specified target Point & return 1`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;
          const targetPointNode = polylineTrack.vertexNodeByTime(targetTime);
          const originalNextTargetPointNode = polylineTrack.vertexNodeByTime(trackPoints[3].timestamp);

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertedRoute);

          expect(insertedCount).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(targetPointNode.next.val).toEqual(point1);
          expect(originalNextTargetPointNode.prev.val).toEqual(point3);
        });

        it(`should insert the Track after the specified target Point & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const returnListCount = true;

          const insertedCount = polylineTrack.insertAfterTime(targetTime, insertedRoute, returnListCount);

          expect(insertedCount).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + insertedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + insertedCount);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          polylineTrack.addProperties();
          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:32Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:35Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:37Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const targetVertex = polylineTrack.vertexNodeByTime(targetTime);
          const startVertexNode = targetVertex as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(2.3557, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(70, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(78581.3, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(10, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(7858.13, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(7, 1);

          polylineTrack.insertAfterTime(targetTime, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(-2.5304, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'S',
            lng: 'W'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(-150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(271367.0, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(2, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(135683.5, 1);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(-75, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineTrack.addProperties();
          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200, '2023-07-04T20:00:32Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:35Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:37Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const targetVertex = polylineTrack.vertexNodeByTime(targetTime);

          const startVertexNode = targetVertex as VertexNode<TrackPoint, TrackSegment>;
          expect(startVertexNode.val.path.rotation).toBeCloseTo(1.6946, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.0847, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(35619.7, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(11, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          expect(insertStartVertexNode.val.path.rotationRate).toBeNull();
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(18895.8, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(3.3, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          expect(insertEndVertexNode.val.path.rotationRate).toBeNull();
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(277976.7, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(15, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const endVertexNode = targetVertex.next;
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.0975, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(14498.9, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(8, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.insertAfterTime(targetTime, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(-3.1915, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(-0.2660, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(99532.4, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(15, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(75, 1);


          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(2.7279, 4);

          expect(insertStartVertexNode.val.path.rotationRate).toBeCloseTo(0.5456, 4);
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(77289.7, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(3.3, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(75, 1);


          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);

          expect(insertEndVertexNode.val.path.rotationRate).toBeCloseTo(0.5439, 4);
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(219484.9, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(37.5, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.1796, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(91066.4, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(34.5, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });
    });

    describe('Replace', () => {
      it('should do nothing & return null if Track is empty', () => {
        polylineTrack = new PolylineTrack([]);
        const targetTime = trackPoints[2].timestamp;;

        const point1 = new TrackPoint(1.1, 101.5, 200);
        const point2 = new TrackPoint(1.2, 102, 210);
        const point3 = new TrackPoint(1.3, 107, 240);
        const points = [point1, point2, point3];

        const result = polylineTrack.replaceAtTime(targetTime, points);

        expect(result).toBeNull();
        expect(polylineTrack.size().vertices).toEqual(0);
        expect(polylineTrack.size().segments).toEqual(0);
      });

      describe('#replaceAtTime', () => {
        it('should do nothing & return null if the target Point is not specified', () => {
          const initialLength = polylineTrack.size();

          const targetTime = null;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceAtTime(targetTime, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it('should do nothing & return null if the target Point does not exist in the Track', () => {
          const initialLength = polylineTrack.size();

          const targetTime = 'Foo';

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceAtTime(targetTime, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should replace the specified Point with the provided Point
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are the same`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const targetTime = trackPoints[2].timestamp;

          const point = new TrackPoint(1.1, 101.5, 200);

          const result = polylineTrack.replaceAtTime(targetTime, point);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 1);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 1);

          expect(initialHead.next.val).toEqual(point);
          expect(initialTail.prev.val).toEqual(point);
        });

        it(`should replace the specified target Point in the Track with the provided Points
         & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceAtTime(targetTime, points);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the specified target Point in the Track with the provided Track
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are the same`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const result = polylineTrack.replaceAtTime(targetTime, insertedRoute);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should update the segment property spanning from the prior Point to the first inserted Point`, () => {
          polylineTrack.addProperties();

          const startTime = trackPoints[1].timestamp;
          const targetTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:25Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:35Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const startVertexNode = polylineTrack.vertexNodeByTime(startTime) as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(10, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(63381.33, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(15, 1);

          polylineTrack.replaceAtTime(targetTime, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(72607.12, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(1, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the remaining Points just before & just after the inserted Points`, () => {
          polylineTrack.addProperties();

          const startTime = trackPoints[1].timestamp;
          const targetTime = trackPoints[2].timestamp;
          const endTime = trackPoints[3].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:25Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:35Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const startVertexNode = polylineTrack.vertexNodeByTime(startTime) as VertexNode<TrackPoint, TrackSegment>;
          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1006, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(35621.9, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(10, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          expect(insertStartVertexNode.val.path.rotationRate).toBeNull();
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(11337.5, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          expect(insertEndVertexNode.val.path.rotationRate).toBeNull();
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(111190.7, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(6, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const endVertexNode = polylineTrack.vertexNodeByTime(endTime) as VertexNode<TrackPoint, TrackSegment>;
          expect(endVertexNode.val.path.rotation).toBeCloseTo(-1.9503, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.0975, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(14498.9, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(8, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.replaceAtTime(targetTime, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1222, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(40234.8, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(3, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);

          expect(insertStartVertexNode.val.path.rotationRate).toBeCloseTo(-0.0501, 4);
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(41972.3, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);  // Same
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.7196, 4);

          expect(insertEndVertexNode.val.path.rotationRate).toBeCloseTo(0.2720, 4);
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(103893.2, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(21, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(endVertexNode.val.path.rotation).toBeCloseTo(-2.3342, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.1556, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(58867.8, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(22.5, 1);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#replaceBetweenTimes', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const startTime = null;
          const endTime = null;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it('should do nothing & return null if the start/end Points are the same', () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startTime = trackPoints[0].timestamp;
          const endTime = trackPoints[3].timestamp;

          const initialLength = polylineTrack.size();

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, []);

          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(2);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - 2);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - 2);
        });

        it(`should insert the Points at the start of the Track & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Track, `, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.firstVertex;

          const startTime = null;
          const endTime = trackPoints[0].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result.removed).toBeNull();
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(polylineTrack.firstVertex.val).toEqual(point1);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should insert the Points at the end of the Track and return a truthy number of Points inserted
          if only a start Point is provided and the start Point is at the end of the Track`, () => {
          const initialLength = polylineTrack.size();
          const initialTail = polylineTrack.lastVertex;

          const startTime = trackPoints[trackPoints.length - 1].timestamp;
          const endTime = null;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result.removed).toBeNull();
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(initialTail.next.val).toEqual(point1);
          expect(polylineTrack.lastVertex.val).toEqual(point3);
        });

        it(`should insert the Points between the specified start/end Points in the Track
          & return a truthy number of points inserted when the start/end Points are adjacent`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
          const initialTail = initialHead.next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the Points between the specified start/end Points in the Track,
          remove the original set of Points between these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the start/end Points are not adjacent`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
          const initialTail = initialHead?.next?.next?.next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Track between the specified start/end Points in the Track,
          remove the original set of Points between these same two Points,
          & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
          const initialTail = initialHead?.next?.next?.next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, insertedRoute);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const result = polylineTrack.replaceBetweenTimes(startTime, endTime, points, returnListCount);

          // 3 inserted, 2 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(2);
          expect(result.inserted).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + result.inserted);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + result.inserted);
        });

        it(`should update the segment property spanning from the target Point to the first inserted Point`, () => {
          polylineTrack.addProperties();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:25Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:40Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const startVertexNode = polylineTrack.vertexNodeByTime(startTime) as VertexNode<TrackPoint, TrackSegment>;
          const prevSegmentNode = startVertexNode.nextSeg;

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6611, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(150, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(633813.3, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(10, 0);
          expect(prevSegmentNode.val.speed).toBeCloseTo(63381.33, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(15, 1);

          polylineTrack.replaceBetweenTimes(startTime, endTime, insertedRoute);

          expect(prevSegmentNode.val.angle).toBeCloseTo(0.6987, 4);
          expect(prevSegmentNode.val.direction).toEqual({
            lat: 'N',
            lng: 'E'
          });
          expect(prevSegmentNode.val.height).toBeCloseTo(5, 0);
          expect(prevSegmentNode.val.length).toBeCloseTo(363035.6, 1);

          expect(prevSegmentNode.val.duration).toBeCloseTo(5, 1);
          expect(prevSegmentNode.val.speed).toBeCloseTo(72607.12, 2);
          expect(prevSegmentNode.val.heightRate).toBeCloseTo(1, 1);
        });

        it(`should update the 2nd-order properties of the first & last inserted Points
          & the Points just before & just after the inserted Points`, () => {
          polylineTrack.addProperties();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 205, '2023-07-04T20:00:25Z');
          const point2 = new TrackPoint(1.2, 102, 210, '2023-07-04T20:00:30Z');
          const point3 = new TrackPoint(1.3, 107, 240, '2023-07-04T20:00:40Z');
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);
          insertedRoute.addProperties();

          const startVertexNode = polylineTrack.vertexNodeByTime(startTime) as VertexNode<TrackPoint, TrackSegment>;
          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0173, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1006, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(35621.9, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(10, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertStartVertexNode = insertedRoute.firstVertex;
          expect(insertStartVertexNode.val.path.rotation).toBeNull();

          expect(insertStartVertexNode.val.path.rotationRate).toBeNull();
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(11337.5, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const insertEndVertexNode = insertedRoute.lastVertex;
          expect(insertEndVertexNode.val.path.rotation).toBeNull();

          expect(insertEndVertexNode.val.path.rotationRate).toBeNull();
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(55595.3, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(3, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          const endVertexNode = polylineTrack.vertexNodeByTime(endTime) as VertexNode<TrackPoint, TrackSegment>;
          expect(endVertexNode.val.path.rotation).toBeCloseTo(0.9684, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(0.0323, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(14113.1, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(6.75, 2);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);

          polylineTrack.replaceBetweenTimes(startTime, endTime, insertedRoute);

          expect(startVertexNode.val.path.rotation).toBeCloseTo(3.0549, 4);

          expect(startVertexNode.val.path.rotationRate).toBeCloseTo(0.1222, 4);
          expect(startVertexNode.val.path.speed).toBeCloseTo(40234.8, 1);
          expect(startVertexNode.val.path.ascentRate).toBeCloseTo(3, 1);
          expect(startVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertStartVertexNode.val.path.rotation).toBeCloseTo(-0.5013, 4);

          expect(insertStartVertexNode.val.path.rotationRate).toBeCloseTo(-0.0501, 4);
          expect(insertStartVertexNode.val.path.speed).toBeCloseTo(41972.3, 1);
          expect(insertStartVertexNode.val.path.ascentRate).toBeCloseTo(1, 1);    // same
          expect(insertStartVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(insertEndVertexNode.val.path.rotation).toBeCloseTo(2.2935, 4);

          expect(insertEndVertexNode.val.path.rotationRate).toBeCloseTo(0.1147, 4);
          expect(insertEndVertexNode.val.path.speed).toBeCloseTo(46282.8, 1);
          expect(insertEndVertexNode.val.path.ascentRate).toBeCloseTo(15, 1);
          expect(insertEndVertexNode.val.path.descentRate).toBeCloseTo(0, 1);


          expect(endVertexNode.val.path.rotation).toBeCloseTo(-0.9397, 4);

          expect(endVertexNode.val.path.rotationRate).toBeCloseTo(-0.0313, 4);
          expect(endVertexNode.val.path.speed).toBeCloseTo(22028.4, 1);
          expect(endVertexNode.val.path.ascentRate).toBeCloseTo(15.75, 2);
          expect(endVertexNode.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#replaceFromToTimes', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const startTime = null;
          const endTime = null;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should only remove Points in the start/end range & return the head of the removed range
          if no Points are provided to insert`, () => {
          const startTime = trackPoints[0].timestamp;
          const endTime = trackPoints[3].timestamp;

          const initialLength = polylineTrack.size();

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, []);

          const removedCount = sizeOf(result.removed);
          expect(removedCount).toEqual(4);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removedCount);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removedCount);
        });

        it(`should replace the first Point in the Track & return a truthy number of Points inserted
          if only an end Point is provided and the end Point is at the start of the Track, `, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = null;
          const endTime = trackPoints[0].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(polylineTrack.firstVertex.val).toEqual(point1);
          expect(initialHead.prev.val).toEqual(point3);
        });

        it(`should replace the last Point in the route & return a truthy number of Points inserted
          if only a start Point is provided & the starty Node is at the end of the Track`, () => {
          const initialLength = polylineTrack.size();
          const initialTail = polylineTrack.lastVertex.prev;

          const startTime = trackPoints[trackPoints.length - 1].timestamp;
          const endTime = null;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points);

          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy(); // 3 inserted
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 3); // 3 inserted
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialTail.next.val).toEqual(point1);
          expect(polylineTrack.lastVertex.val).toEqual(point3);
        });

        it(`should insert the provided Points at the specified start/end Point in the Track,
        remove the Point & return the head of the removed range & a truthy number of Points inserted
        when the start/end Points are the same`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[2].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points);

          // 3 inserted, 1 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(1);
          expect(result.inserted).toBeTruthy();
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + 3);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + 3);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Points between the specified start/end Points in the Track,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted
          when the head/tail Points are adjacent`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[2].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[3].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[2].timestamp;
          const endTime = trackPoints[3].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices + 1); // 3 inserted - 2 removed
          expect(polylineTrack.size().segments).toEqual(initialLength.segments + 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should insert the provided Track between the specified start/end Points in the Track,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[1].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[4].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, insertedRoute);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - 1); // 3 inserted - 4 removed
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const startTime = trackPoints[1].timestamp;
          const endTime = trackPoints[4].timestamp;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const result = polylineTrack.replaceFromToTimes(startTime, endTime, points, returnListCount);

          // 3 inserted, 2 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(4);
          expect(result.inserted).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + result.inserted);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + result.inserted);
        });
      });

      describe('#replaceTimeRange', () => {
        it('should do nothing & return null if the start/end Points are both unspecified', () => {
          const initialLength = polylineTrack.size();

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const emptyTimeRange: ITimeRange = {
            startTime: '',
            endTime: ''
          }
          const result = polylineTrack.replaceTimeRange(emptyTimeRange, points);

          expect(result).toBeNull();
          expect(polylineTrack.size()).toEqual(initialLength);
        });

        it(`should insert the provided Track between the specified start/end Points in the Track,
          remove the original set of Points between & including these same two Points,
          & return the head of the removed range & a truthy number of Points inserted`, () => {
          const initialLength = polylineTrack.size();
          const initialHead = polylineTrack.vertexNodeByTime(trackPoints[1].timestamp).prev;
          const initialTail = polylineTrack.vertexNodeByTime(trackPoints[4].timestamp).next as VertexNode<TrackPoint, TrackSegment>;

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];
          const insertedRoute = new PolylineTrack(points);

          const timeRange: ITimeRange = {
            startTime: trackPoints[1].timestamp,
            endTime: trackPoints[4].timestamp
          }
          const result = polylineTrack.replaceTimeRange(timeRange, insertedRoute);

          expect(result.inserted).toBeTruthy(); // 3 inserted, 2 removed
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - 1); // 3 inserted - 4 removed
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - 1);

          expect(initialHead.next.val).toEqual(point1);
          expect(initialTail.prev.val).toEqual(point3);
        });

        it(`should replace the Points within the specified target range & return the number of Points inserted if requested`, () => {
          const initialLength = polylineTrack.size();

          const point1 = new TrackPoint(1.1, 101.5, 200);
          const point2 = new TrackPoint(1.2, 102, 210);
          const point3 = new TrackPoint(1.3, 107, 240);
          const points = [point1, point2, point3];

          const returnListCount = true;

          const timeRange: ITimeRange = {
            startTime: trackPoints[1].timestamp,
            endTime: trackPoints[4].timestamp
          }
          const result = polylineTrack.replaceTimeRange(timeRange, points, returnListCount);

          // 3 inserted, 2 removed
          const removed = sizeOf(result.removed);
          expect(removed).toEqual(4);
          expect(result.inserted).toEqual(3);
          expect(polylineTrack.size().vertices).toEqual(initialLength.vertices - removed + result.inserted);
          expect(polylineTrack.size().segments).toEqual(initialLength.segments - removed + result.inserted);
        });
      });
    });

    describe('Split', () => {
      it('should do nothing and return an empty array if the Track is empty', () => {
        polylineTrack = new PolylineTrack([]);

        const targetTime = trackPoints[3].timestamp;

        const splitRoutes = polylineTrack.splitByTime(targetTime);

        expect(splitRoutes.length).toEqual(1);
        const firstRouteSize = splitRoutes[0].size();
        expect(firstRouteSize.vertices).toEqual(0);
        expect(firstRouteSize.segments).toEqual(0);
      });

      describe('#splitByTime', () => {
        it(`should do nothing & return the original Track if the specified Point doesn't exist in the Track`, () => {
          const initialSize = polylineTrack.size()

          const targetTime = 'Foo';

          const splitRoutes = polylineTrack.splitByTime(targetTime);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it(`should do nothing & return the original Track if the specified Point is the start of the Track`, () => {
          const initialSize = polylineTrack.size()

          const targetTime = trackPoints[0].timestamp;

          const splitRoutes = polylineTrack.splitByTime(targetTime);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it(`should do nothing & return the original Track if the specified Point is the end of the Track`, () => {
          const initialSize = polylineTrack.size()

          const targetTime = trackPoints[trackPoints.length - 1].timestamp;

          const splitRoutes = polylineTrack.splitByTime(targetTime);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it('should split the Track and return each split Track', () => {
          const initialSize = polylineTrack.size()
          const initialHeadVertex = polylineTrack.firstVertex;
          const initialHeadSegment = polylineTrack.firstSegment;
          const initialTailVertex = polylineTrack.lastVertex;
          const initialTailSegment = polylineTrack.lastSegment;

          const targetTime = trackPoints[3].timestamp;
          const initialSplitVertex = polylineTrack.vertexNodeByTime(targetTime);
          const initialSplitPrevVertex = initialSplitVertex.prev;
          const initialSplitPrevSegment = initialSplitVertex.prevSeg;
          const initialSplitNextVertex = initialSplitVertex.next;
          const initialSplitNextSegment = initialSplitVertex.nextSeg;

          const splitRoutes = polylineTrack.splitByTime(targetTime);

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
          expect(initialSplitVertex.val.lat).toEqual(splitRoutes[1].firstVertex.val.lat);
          expect(initialSplitVertex.val.lng).toEqual(splitRoutes[1].firstVertex.val.lng);

          expect(initialSplitPrevVertex).toEqual(splitRoutes[0].lastVertex.prev);
          expect(initialSplitPrevSegment).toEqual(splitRoutes[0].lastVertex.prevSeg);

          expect(initialSplitNextVertex).toEqual(splitRoutes[1].firstVertex.next);
          expect(initialSplitNextSegment).toEqual(splitRoutes[1].firstVertex.nextSeg);
        });

        it(`should update the 2nd-order properties of the last Point of the first split Track, and the first Point of the second split Track`, () => {
          polylineTrack.addProperties();
          const targetTime = trackPoints[3].timestamp;

          const vertex = polylineTrack.vertexNodeByTime(trackPoints[3].timestamp);
          expect(vertex.val.path.rotation).toBeCloseTo(-1.9503, 4);

          // ===

          expect(vertex.val.path.rotationRate).toBeCloseTo(-0.0975, 4);
          expect(vertex.val.path.speed).toBeCloseTo(14498.9, 1);
          expect(vertex.val.path.ascentRate).toBeCloseTo(8, 1);
          expect(vertex.val.path.descentRate).toBeCloseTo(0, 1);

          const splitRoutes = polylineTrack.splitByTime(targetTime);

          const firstRouteLastVertex = splitRoutes[0].lastVertex;
          expect(firstRouteLastVertex.val.path.rotation).toBeNull();

          const secondRouteFirstVertex = splitRoutes[1].firstVertex;
          expect(secondRouteFirstVertex.val.path.rotation).toBeNull();

          // ===

          expect(firstRouteLastVertex.val.path.rotationRate).toBeNull();
          expect(firstRouteLastVertex.val.path.speed).toBeCloseTo(7858.1, 1);
          expect(firstRouteLastVertex.val.path.ascentRate).toBeCloseTo(7, 1);
          expect(firstRouteLastVertex.val.path.descentRate).toBeCloseTo(0, 1);

          // ===

          expect(secondRouteFirstVertex.val.path.rotationRate).toBeNull();
          expect(secondRouteFirstVertex.val.path.speed).toBeCloseTo(21139.7, 1);
          expect(secondRouteFirstVertex.val.path.ascentRate).toBeCloseTo(9, 1);
          expect(secondRouteFirstVertex.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#splitByTimes', () => {
        it(`should do nothing & return one entry of the original Track if the specified Points don't exist in the Track`, () => {
          const initialSize = polylineTrack.size()

          const targetPoint1 = 'Foo';
          const targetPoint2 = 'Bar';
          const targetPoint3 = 'Nar';
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitRoutes = polylineTrack.splitByTimes(targetPoints);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it('should split the Track and return all sub-Routes demarcated by the provided Points', () => {
          const targetPoint1 = trackPoints[2].timestamp;
          const targetPoint2 = trackPoints[3].timestamp;
          const targetPoints = [targetPoint1, targetPoint2];

          const splitRoutes = polylineTrack.splitByTimes(targetPoints);

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

        it('should split the Track and return all sub-Routes demarcated by the provided Points, ignoring invalid Points', () => {
          const targetPoint1 = trackPoints[2].timestamp;
          const targetPoint2 = 'Foo';
          const targetPoint3 = trackPoints[4].timestamp;
          const targetPoints = [targetPoint1, targetPoint2, targetPoint3];

          const splitRoutes = polylineTrack.splitByTimes(targetPoints);

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

        it('should not split the Track more than once by duplicate Points', () => {
          const targetPoint1 = trackPoints[3].timestamp;
          const targetPoint2 = trackPoints[3].timestamp;
          const targetPoints = [targetPoint1, targetPoint2];

          const splitRoutes = polylineTrack.splitByTimes(targetPoints);

          expect(splitRoutes.length).toEqual(2);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(4);
          expect(firstRouteSize.segments).toEqual(3);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(3);
          expect(secondRouteSize.segments).toEqual(2);
        });

        it(`should update the 2nd-order properties of the first and last Point of the middle split Track`, () => {
          polylineTrack.addProperties();
          const targetPoint1 = trackPoints[2].timestamp;
          const targetPoint2 = trackPoints[4].timestamp;
          const targetPoints = [targetPoint1, targetPoint2];

          const vertex1 = polylineTrack.vertexNodeByTime(targetPoint1);
          const vertex2 = polylineTrack.vertexNodeByTime(targetPoint2);

          expect(vertex1.val.path.rotation).toBeCloseTo(1.6946, 4);
          expect(vertex2.val.path.rotation).toBeCloseTo(0.9684, 4);

          // === First Split Vertex

          expect(vertex1.val.path.rotationRate).toBeCloseTo(0.0847, 4);
          expect(vertex1.val.path.speed).toBeCloseTo(35619.7, 1);
          expect(vertex1.val.path.ascentRate).toBeCloseTo(11, 1);
          expect(vertex1.val.path.descentRate).toBeCloseTo(0, 1);

          // === Second Split Vertex

          expect(vertex2.val.path.rotationRate).toBeCloseTo(0.0323, 4);
          expect(vertex2.val.path.speed).toBeCloseTo(14113.1, 1);
          expect(vertex2.val.path.ascentRate).toBeCloseTo(6.75, 1);
          expect(vertex2.val.path.descentRate).toBeCloseTo(0, 1);

          const splitRoutes = polylineTrack.splitByTimes(targetPoints);

          expect(splitRoutes.length).toEqual(3);

          const firstRouteFirstVertex = splitRoutes[0].lastVertex;
          const firstRouteLastVertex = splitRoutes[0].lastVertex;
          expect(firstRouteFirstVertex.val.path.rotation).toBeNull();
          expect(firstRouteLastVertex.val.path.rotation).toBeNull();

          const secondRouteFirstVertex = splitRoutes[1].lastVertex;
          const secondRouteLastVertex = splitRoutes[1].lastVertex;
          expect(secondRouteFirstVertex.val.path.rotation).toBeNull();
          expect(secondRouteLastVertex.val.path.rotation).toBeNull();

          const thirdRouteFirstVertex = splitRoutes[2].lastVertex;
          const thirdRouteLastVertex = splitRoutes[2].lastVertex;
          expect(thirdRouteFirstVertex.val.path.rotation).toBeNull();
          expect(thirdRouteLastVertex.val.path.rotation).toBeNull();

          // === First Split Vertex
          expect(firstRouteLastVertex.val.path.rotationRate).toBeNull();
          expect(firstRouteLastVertex.val.path.speed).toBeCloseTo(63381.3, 1);
          expect(firstRouteLastVertex.val.path.ascentRate).toBeCloseTo(15, 1);
          expect(firstRouteLastVertex.val.path.descentRate).toBeCloseTo(0, 1);
          // ===

          expect(secondRouteFirstVertex.val.path.rotationRate).toBeNull();
          expect(secondRouteFirstVertex.val.path.speed).toBeCloseTo(21139.7, 1);
          expect(secondRouteFirstVertex.val.path.ascentRate).toBeCloseTo(9, 1);
          expect(secondRouteFirstVertex.val.path.descentRate).toBeCloseTo(0, 1);

          // === Second Split Vertex

          expect(secondRouteLastVertex.val.path.rotationRate).toBeNull();
          expect(secondRouteLastVertex.val.path.speed).toBeCloseTo(21139.7, 1);
          expect(secondRouteLastVertex.val.path.ascentRate).toBeCloseTo(9, 1);
          expect(secondRouteLastVertex.val.path.descentRate).toBeCloseTo(0, 1);

          // ===

          expect(thirdRouteFirstVertex.val.path.rotationRate).toBeNull();
          expect(thirdRouteFirstVertex.val.path.speed).toBeCloseTo(7086.5, 1);
          expect(thirdRouteFirstVertex.val.path.ascentRate).toBeCloseTo(4.5, 1);
          expect(thirdRouteFirstVertex.val.path.descentRate).toBeCloseTo(0, 1);
        });
      });

      describe('#splitByTimeRange', () => {
        it(`should do nothing & return one entry of the original Track if the specified times are empty`, () => {
          const initialSize = polylineTrack.size()

          const timeRange: ITimeRange = {
            startTime: '',
            endTime: ''
          }
          const splitRoutes = polylineTrack.splitByTimeRange(timeRange);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it(`should do nothing & return one entry of the original Track if the specified times don't exist in the Track`, () => {
          const initialSize = polylineTrack.size()

          const timeRange: ITimeRange = {
            startTime: 'Foo',
            endTime: 'Bar'
          }
          const splitRoutes = polylineTrack.splitByTimeRange(timeRange);

          expect(splitRoutes.length).toEqual(1);
          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(initialSize.vertices);
          expect(firstRouteSize.segments).toEqual(initialSize.segments);
        });

        it('should split the Track and return all sub-Routes demarcated by the provided times', () => {
          const timeRange: ITimeRange = {
            startTime: trackPoints[2].timestamp,
            endTime: trackPoints[3].timestamp
          }
          const splitRoutes = polylineTrack.splitByTimeRange(timeRange);

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

        it('should not split the Track more than once by duplicate times', () => {
          const timeRange: ITimeRange = {
            startTime: trackPoints[3].timestamp,
            endTime: trackPoints[3].timestamp
          }
          const splitRoutes = polylineTrack.splitByTimeRange(timeRange);

          expect(splitRoutes.length).toEqual(2);

          const firstRouteSize = splitRoutes[0].size();
          expect(firstRouteSize.vertices).toEqual(4);
          expect(firstRouteSize.segments).toEqual(3);

          const secondRouteSize = splitRoutes[1].size();
          expect(secondRouteSize.vertices).toEqual(3);
          expect(secondRouteSize.segments).toEqual(2);
        });
      });


      // TODO: After methods are built out for later ticket
      describe('#splitByTimeRanges', () => {
        //  Create method. Before calling child methods, it should handle interval-merge operations/validations on the time ranges
      });

      // splitByTimeRanges better?
      describe('#splitByTrack', () => {
        // Empty Track
        // Target doesn't exist
        // Target is at start
        // Target is at end
        // Valid Track
      });

      describe('#splitByTracks', () => {
        // Invalid Track
        // Valid Track
        // Mixed valid/invalid Routes
      });
    });
  });
});