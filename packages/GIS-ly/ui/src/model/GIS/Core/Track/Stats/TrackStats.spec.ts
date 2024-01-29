import { VertexNode } from '../../../../Geometry/Polyline';
import { PolylineTrack } from '../PolylineTrack';
import { TrackSegment } from '../TrackSegment';
import { TrackPoint } from '../TrackPoint';
import { TrackStats } from './TrackStats';

describe('##TrackStats', () => {
  const longMultiplier = 0.0005;
  const updateTimestampMS = (timestamp: number, duration: number) => timestamp + duration * 1000;

  const createTrack = (heights: number[]): PolylineTrack => {
    let track: PolylineTrack;

    if (heights.length) {
      const lat = 0;
      let long = 0;
      let timestampMS = new Date(0).getMilliseconds();
      let timestamp = new Date(timestampMS);

      let vertexI = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, long, null, timestamp.toString()));
      vertexI.val.elevation = 0;

      timestampMS = updateTimestampMS(timestampMS, durations[0]);
      timestamp = new Date(timestampMS);
      let vertexJ = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, ++long * longMultiplier, null, timestamp.toString()));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];

      track = new PolylineTrack([vertexI, vertexJ]);

      for (let i = 1; i < heights.length; i++) {
        timestampMS = updateTimestampMS(timestampMS, durations[i]);
        timestamp = new Date(timestampMS);

        vertexI = vertexJ;
        vertexJ = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, ++long * longMultiplier, null, timestamp.toString()));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];

        track.append(vertexJ);
      }
    } else {
      track = new PolylineTrack([]);
    }

    track.addElevationProperties();

    return track;
  };

  const heights = [1.7, -2.8, -0.6, 5, 0.6, -8.3, -3.9];
  const durations = [30, 25, 15, 30, 50, 60, 30];

  describe('#constructor', () => {
    it('should initialize a new object from Points', () => {
      const firstPoint = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2, 3, '4'));
      const lastVertex = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(2, 3, 4, '5'));

      const stats = TrackStats.fromTrackPoints(firstPoint, lastVertex);

      expect(stats.isDirty()).toBeTruthy();
    });

    it('should initialize a new object from a polyline', () => {
      const vertices: TrackPoint[] = [
        new TrackPoint(1, 2, 3, '4'),
        new TrackPoint(2, 3, 4, '5'),
        new TrackPoint(3, 4, 5, '6'),
        new TrackPoint(4, 5, 6, '7'),
      ];

      const polyline = new PolylineTrack(vertices);

      const stats = TrackStats.fromTrack(polyline);

      expect(stats.isDirty()).toBeTruthy();
    });
  });

  describe('#setDirty', () => {
    it('should set object to dirty if initialized with vertices', () => {
      const vertices: TrackPoint[] = [
        new TrackPoint(1, 2, 3, '4'),
        new TrackPoint(2, 3, 4, '5'),
        new TrackPoint(3, 4, 5, '6'),
        new TrackPoint(4, 5, 6, '7'),
      ];


      const firstVertex = new VertexNode<TrackPoint, TrackSegment>(vertices[0]);
      const lastVertex = new VertexNode<TrackPoint, TrackSegment>(vertices[vertices.length - 1]);

      const stats = TrackStats.fromTrackPoints(firstVertex, lastVertex);

      expect(stats.isDirty()).toBeTruthy();

      stats.addStats();

      expect(stats.isDirty()).toBeFalsy();

      stats.setDirty();

      expect(stats.isDirty()).toBeTruthy();
    });

    it('do nothing if initialized with polyline', () => {
      const vertices: TrackPoint[] = [
        new TrackPoint(1, 2, 3, '4'),
        new TrackPoint(2, 3, 4, '5'),
        new TrackPoint(3, 4, 5, '6'),
        new TrackPoint(4, 5, 6, '7'),
      ];

      const polyline = new PolylineTrack(vertices);

      const stats = TrackStats.fromPolyline(polyline);

      expect(stats.isDirty()).toBeTruthy();

      stats.addStats();

      expect(stats.isDirty()).toBeFalsy();

      stats.setDirty();

      expect(stats.isDirty()).toBeFalsy();
    });
  });

  describe('#addStats', () => {
    let vertices: TrackPoint[];
    beforeEach(() => {
      vertices = [
        new TrackPoint(1, 2, 3, '4'),
        new TrackPoint(2, 3, 4, '5'),
        new TrackPoint(3, 4, 5, '6'),
        new TrackPoint(4, 5, 6, '7'),
      ];
    });

    describe('with first/last vertices', () => {
      let firstVertex: VertexNode<TrackPoint, TrackSegment>;
      let lastVertex: VertexNode<TrackPoint, TrackSegment>;

      beforeEach(() => {
        firstVertex = new VertexNode(vertices[0]);
        lastVertex = new VertexNode(vertices[vertices.length - 1]);
      });

      it('should do nothing for a stats object with no first vertex', () => {
        const stats = TrackStats.fromTrackPoints(null, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeTruthy();
      });

      it('should explicitly add stats & reset dirty flag', () => {
        const stats = TrackStats.fromTrackPoints(firstVertex, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.isDirty()).toBeFalsy();
      });
    });

    describe('with Polyline', () => {
      let polyline: PolylineTrack;

      beforeEach(() => {
        polyline = new PolylineTrack(vertices);
      });

      it('should do nothing for a stats object with no polyline', () => {
        const stats = TrackStats.fromTrack(null);

        expect(stats.hasPolyline()).toBeFalsy();
        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.isDirty()).toBeTruthy();
      });

      it('should explicitly add stats & reset dirty flag', () => {
        const stats = TrackStats.fromTrack(polyline);

        expect(stats.hasPolyline()).toBeTruthy();
        expect(stats.polylineVersion).toEqual(-1);
        expect(stats.isDirty()).toBeTruthy();

        stats.addStats();

        expect(stats.polylineVersion).toEqual(0);
        expect(stats.isDirty()).toBeFalsy();
      });
    });
  });

  describe('#stats property', () => {
    let polyline: PolylineTrack;
    let firstVertex: VertexNode<TrackPoint, TrackSegment>;
    let lastVertex: VertexNode<TrackPoint, TrackSegment>;

    beforeEach(() => {
      polyline = createTrack(heights);

      firstVertex = polyline.firstVertex;
      lastVertex = polyline.lastVertex;
    });

    describe('with first/last vertices', () => {
      it('should do nothing & return undefined for a stats object with no first vertex', () => {
        const stats = TrackStats.fromTrackPoints(null, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeTruthy();

        expect(result).toBeUndefined();
      });

      it('should lazy load stats & reset dirty flag', () => {
        const stats = TrackStats.fromTrackPoints(firstVertex, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

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
        expect(result.slope.downhill.min.value).toBeCloseTo(-0.15, 2);
        expect(result.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(result.slope.uphill.max.value).toBeCloseTo(0.09, 2);

        // Track Stats
        expect(result.time.duration).toEqual(240);
        expect(result.time.max.value).toEqual(60);
        expect(result.time.min.value).toEqual(15);

        expect(result.speed.avg).toBeCloseTo(1.62, 2);
        expect(result.speed.max.value).toBeCloseTo(3.71, 2);
        expect(result.speed.min.value).toBeCloseTo(0.93, 2);

        expect(result.heightRate.ascent.avg).toBeCloseTo(0.066, 3);  // 0.081 - Wrong?
        expect(result.heightRate.ascent.max.value).toBeCloseTo(0.167, 3);
        expect(result.heightRate.descent.avg).toBeCloseTo(-0.12, 2);  // -0.11 - Wrong?
        expect(result.heightRate.descent.min.value).toBeCloseTo(-0.14, 2);
      });

      // it('should skip nodes not meeting callback criteria provided', () => {
      //   const isLengthConsidered = (length: number) => length > 1;
      //   const stats = TrackStats.fromTrackPoints(
      //     firstVertex,
      //     lastVertex,
      //     { isLengthConsidered }
      //   );

      //   expect(stats.isDirty()).toBeTruthy();

      //   const result = stats.stats;

      //   expect(stats.isDirty()).toBeFalsy();

      //   expect(result).toEqual({
      //     length: 5
      //   });
      // });

      it('should return updated stats when middle vertex is changed & stats reset to dirty', () => {
        const stats = TrackStats.fromTrackPoints(firstVertex, lastVertex);

        expect(stats.isDirty()).toBeTruthy();

        const initialResult = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

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
        expect(initialResult.slope.downhill.min.value).toBeCloseTo(-0.15, 2);
        expect(initialResult.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(initialResult.slope.uphill.max.value).toBeCloseTo(0.09, 2);

        // Track Stats
        expect(initialResult.time.duration).toEqual(240);
        expect(initialResult.time.max.value).toEqual(60);
        expect(initialResult.time.min.value).toEqual(15);

        expect(initialResult.speed.avg).toBeCloseTo(1.62, 2);
        expect(initialResult.speed.max.value).toBeCloseTo(3.71, 2);
        expect(initialResult.speed.min.value).toBeCloseTo(0.93, 2);

        expect(initialResult.heightRate.ascent.avg).toBeCloseTo(0.066, 3);  // 0.081 - Wrong?
        expect(initialResult.heightRate.ascent.max.value).toBeCloseTo(0.167, 3);
        expect(initialResult.heightRate.descent.avg).toBeCloseTo(-0.12, 2);  // -0.11 - Wrong?
        expect(initialResult.heightRate.descent.min.value).toBeCloseTo(-0.14, 2);

        // Insert node
        const vertexBeforeRemove = polyline.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
        const vertexAfterRemove = vertexBeforeRemove.next;

        const longitudeRemove = 0.5 * (vertexBeforeRemove.val.lng + vertexAfterRemove.val.lng);
        const latitudeRemove = 45;
        const elevationRemove = 30000;
        const timestampRemoveStr = 'Wed Dec 31 1969 17:00:43 GMT-0700 (Mountain Standard Time)';
        const pointToRemove = new TrackPoint(latitudeRemove, longitudeRemove, null, timestampRemoveStr);
        pointToRemove.elevation = elevationRemove;

        polyline.insertAfter(vertexBeforeRemove, pointToRemove);

        expect(stats.isDirty()).toBeFalsy();

        const insertResultDirty = stats.stats;

        // State should be unchanged from original polyline
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
        expect(insertResultDirty.slope.downhill.min.value).toBeCloseTo(initialResult.slope.downhill.min.value, 2);
        expect(insertResultDirty.slope.uphill.avg).toBeCloseTo(initialResult.slope.uphill.avg, 2);
        expect(insertResultDirty.slope.uphill.max.value).toBeCloseTo(initialResult.slope.uphill.max.value, 2);

        // Track Stats
        expect(insertResultDirty.time.duration).toEqual(initialResult.time.duration);
        expect(insertResultDirty.time.max.value).toEqual(initialResult.time.max.value);
        expect(insertResultDirty.time.min.value).toEqual(initialResult.time.min.value);

        expect(insertResultDirty.speed.avg).toBeCloseTo(initialResult.speed.avg, 2);
        expect(insertResultDirty.speed.max.value).toBeCloseTo(initialResult.speed.max.value, 2);
        expect(insertResultDirty.speed.min.value).toBeCloseTo(initialResult.speed.min.value, 2);

        expect(insertResultDirty.heightRate.ascent.avg).toBeCloseTo(initialResult.heightRate.ascent.avg, 2);
        expect(insertResultDirty.heightRate.ascent.max.value).toBeCloseTo(initialResult.heightRate.ascent.max.value, 2);
        expect(insertResultDirty.heightRate.descent.avg).toBeCloseTo(initialResult.heightRate.descent.avg, 2);
        expect(insertResultDirty.heightRate.descent.min.value).toBeCloseTo(initialResult.heightRate.descent.min.value, 2);

        // Manually reset state
        expect(stats.isDirty()).toBeFalsy();

        stats.setDirty();

        expect(stats.isDirty()).toBeTruthy();

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
        expect(insertResult.slope.downhill.min.value).toBeCloseTo(-0.148, 3);
        expect(insertResult.slope.uphill.avg).toBeCloseTo(0.006, 3);
        expect(insertResult.slope.uphill.max.value).toBeCloseTo(0.09, 3);

        // Track Stats
        expect(insertResult.time.duration).toEqual(initialResult.time.duration);
        expect(insertResult.time.max.value).toEqual(initialResult.time.max.value);
        expect(insertResult.time.min.value).toEqual(12);

        expect(insertResult.speed.avg).toBeCloseTo(41699.49, 2);
        expect(insertResult.speed.max.value).toBeCloseTo(416980.97, 2);
        expect(insertResult.speed.min.value).toBeCloseTo(0.93, 2);

        expect(insertResult.heightRate.ascent.avg).toBeCloseTo(243.95, 2);
        expect(insertResult.heightRate.ascent.max.value).toBeCloseTo(2307.56, 2);
        expect(insertResult.heightRate.descent.avg).toBeCloseTo(-256.53, 2);
        expect(insertResult.heightRate.descent.min.value).toBeCloseTo(-2500.09, 2);

        // Remove node
        const vertexToRemove = vertexBeforeRemove.next as VertexNode<TrackPoint, TrackSegment>;

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
        expect(removedResultDirty.slope.downhill.min.value).toBeCloseTo(-0.148, 3);
        expect(removedResultDirty.slope.uphill.avg).toBeCloseTo(0.006, 3);
        expect(removedResultDirty.slope.uphill.max.value).toBeCloseTo(0.09, 3);

        // Track Stats
        expect(removedResultDirty.time.duration).toEqual(initialResult.time.duration);
        expect(removedResultDirty.time.max.value).toEqual(initialResult.time.max.value);
        expect(removedResultDirty.time.min.value).toEqual(12);

        expect(removedResultDirty.speed.avg).toBeCloseTo(41699.49, 2);
        expect(removedResultDirty.speed.max.value).toBeCloseTo(416980.97, 2);
        expect(removedResultDirty.speed.min.value).toBeCloseTo(0.93, 2);

        expect(removedResultDirty.heightRate.ascent.avg).toBeCloseTo(243.95, 2);
        expect(removedResultDirty.heightRate.ascent.max.value).toBeCloseTo(2307.56, 2);
        expect(removedResultDirty.heightRate.descent.avg).toBeCloseTo(-256.53, 2);
        expect(removedResultDirty.heightRate.descent.min.value).toBeCloseTo(-2500.09, 2);

        // Manually reset state
        expect(stats.isDirty()).toBeFalsy();

        stats.setDirty();

        expect(stats.isDirty()).toBeTruthy();

        const removedResult = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

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
        expect(removedResult.slope.downhill.min.value).toBeCloseTo(initialResult.slope.downhill.min.value, 2);
        expect(removedResult.slope.uphill.avg).toBeCloseTo(initialResult.slope.uphill.avg, 2);
        expect(removedResult.slope.uphill.max.value).toBeCloseTo(initialResult.slope.uphill.max.value, 2);

        // Track Stats
        expect(removedResult.time.duration).toEqual(initialResult.time.duration);
        expect(removedResult.time.max.value).toEqual(initialResult.time.max.value);
        expect(removedResult.time.min.value).toEqual(initialResult.time.min.value);

        expect(removedResult.speed.avg).toBeCloseTo(initialResult.speed.avg, 2);
        expect(removedResult.speed.max.value).toBeCloseTo(initialResult.speed.max.value, 2);
        expect(removedResult.speed.min.value).toBeCloseTo(initialResult.speed.min.value, 2);

        expect(removedResult.heightRate.ascent.avg).toBeCloseTo(initialResult.heightRate.ascent.avg, 2);
        expect(removedResult.heightRate.ascent.max.value).toBeCloseTo(initialResult.heightRate.ascent.max.value, 2);
        expect(removedResult.heightRate.descent.avg).toBeCloseTo(initialResult.heightRate.descent.avg, 2);
        expect(removedResult.heightRate.descent.min.value).toBeCloseTo(initialResult.heightRate.descent.min.value, 2);
      });
    });

    describe('with polyline', () => {
      it('should do nothing & return undefined for a stats object with no polyline', () => {
        const stats = TrackStats.fromTrack(null);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeTruthy();

        expect(result).toBeUndefined();
      });

      it('should lazy load stats & reset dirty flag', () => {
        const stats = TrackStats.fromTrack(polyline);

        expect(stats.isDirty()).toBeTruthy();

        const result = stats.stats;

        expect(stats.isDirty()).toBeFalsy();

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
        expect(result.slope.downhill.min.value).toBeCloseTo(-0.15, 2);
        expect(result.slope.uphill.avg).toBeCloseTo(0.04, 2);
        expect(result.slope.uphill.max.value).toBeCloseTo(0.09, 2);

        // Track Stats
        expect(result.time.duration).toEqual(240);
        expect(result.time.max.value).toEqual(60);
        expect(result.time.min.value).toEqual(15);

        expect(result.speed.avg).toBeCloseTo(1.62, 2);
        expect(result.speed.max.value).toBeCloseTo(3.71, 2);
        expect(result.speed.min.value).toBeCloseTo(0.93, 2);

        expect(result.heightRate.ascent.avg).toBeCloseTo(0.066, 3);
        expect(result.heightRate.ascent.max.value).toBeCloseTo(0.167, 3);
        expect(result.heightRate.descent.avg).toBeCloseTo(-0.12, 2);
        expect(result.heightRate.descent.min.value).toBeCloseTo(-0.14, 2);
      });
    });
  });
});