import { SegmentNode, VertexNode } from '@markpthomas/geometry';

import { PolylineTrack } from '../PolylineTrack';
import { TrackPoint } from '../TrackPoint';
import { TrackSegment } from '../TrackSegment';
import { HeightRateStats } from './HeightRateStats';

describe('##HeightRateStats', () => {
  const longMultiplier = 0.0005;
  const length = 55.7;

  const updateTimestampMS = (timestamp: number, duration: number) => timestamp + duration * 1000;

  const createSegments = (heights: number[], durations: number[]) => {
    const segmentNodes: SegmentNode<TrackPoint, TrackSegment>[] = [];

    if (heights.length) {
      const angle = 0;
      const lat = 0;
      let long = 0;
      let timestamp = 0;

      let vertexI = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, long, null, timestamp.toString()));
      vertexI.val.elevation = 0;

      timestamp = updateTimestampMS(timestamp, durations[0]);
      let vertexJ = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, ++long * longMultiplier, null, timestamp.toString()));
      vertexJ.val.elevation = vertexI.val.elevation + heights[0];

      let segment = new TrackSegment(length, angle, null, heights[0], durations[0]);
      let segmentNode = new SegmentNode<TrackPoint, TrackSegment>(
        vertexI,
        vertexJ,
        segment
      );
      segmentNode.prevVert = vertexI;
      segmentNode.nextVert = vertexJ;

      segmentNodes.push(segmentNode);

      for (let i = 1; i < heights.length; i++) {
        timestamp = updateTimestampMS(timestamp, durations[i]);

        vertexI = vertexJ;
        vertexJ = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(lat, ++long * longMultiplier, null, timestamp.toString()));
        vertexJ.val.elevation = vertexI.val.elevation + heights[i];
        segment = new TrackSegment(length, angle, null, heights[i], durations[i]);

        const segmentNode = new SegmentNode<TrackPoint, TrackSegment>(
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

  const createTrack = (heights: number[], durations: number[]) => {
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

  const heights = [1.7, -2.8, -0.6, 5, 0.6, -8.3, -9];
  const durations = [30, 30, 30, 30, 30, 30, 30];

  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const heightRateStats = new HeightRateStats();

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });

    it('should take an optional callback that filters what height values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const heightRateStats = new HeightRateStats(isConsidered);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });
  });

  describe('#add', () => {
    let segments: SegmentNode<TrackPoint, TrackSegment>[];
    beforeEach(() => {
      segments = createSegments(heights, durations);
    });

    it('should add the height rate property', () => {
      const heightRateStats = new HeightRateStats();

      heightRateStats.add(segments[0]); // 1.7

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);

      heightRateStats.add(segments[1]); // -2.8

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.09, 2);

      heightRateStats.add(segments[2]); // -0.6

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      heightRateStats.add(segments[3]); // 5

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.11, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      heightRateStats.add(segments[4]); // 0.6

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      heightRateStats.add(segments[5]);  // -8.3

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.28, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.13, 2);


      heightRateStats.add(segments[6]);   // -9

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.30, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.17, 2);
    });

    it('should not add the the height rate property if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => Math.abs(number) > 0.5;
      const heightRateStats = new HeightRateStats(isConsidered);

      heightRateStats.add(segments[0]); // 1.7

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);

      // heightRateStats.add(segments[1]); // -2.8

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.09, 2);

      // heightRateStats.add(segments[2]); // -0.6

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.06, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      // heightRateStats.add(segments[3]); // 5

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.11, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      // heightRateStats.add(segments[4]); // 0.6

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.09, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.06, 2);


      // heightRateStats.add(segments[5]);  // -8.3

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.28, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.13, 2);


      // heightRateStats.add(segments[6]);   // -9

      // expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      // expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      // expect(heightRateStats.descent.min.value).toBeCloseTo(-0.30, 2);
      // expect(heightRateStats.descent.avg).toBeCloseTo(-0.17, 2);
    });
  });

  describe('#fromTo', () => {
    let track: PolylineTrack;
    beforeEach(() => {
      track = createTrack(heights, durations);
    });

    it('should do nothing if no start node is provided', () => {

      const heightRateStats = new HeightRateStats();

      const startNode = null;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));

      heightRateStats.fromTo(startNode, endNode);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if no end node is provided', () => {
      const heightRateStats = new HeightRateStats();

      const startNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));
      const endNode = null;

      heightRateStats.fromTo(startNode, endNode);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });

    it('should traverse from the provided start to end node & determine the height rate properties', () => {
      const heightRateStats = new HeightRateStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = track.lastVertex.prev as VertexNode<TrackPoint, TrackSegment>;

      heightRateStats.fromTo(startNode, endNode);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.09, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.28, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.13, 2);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const heightRateStats = new HeightRateStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

      heightRateStats.fromTo(startNode, endNode);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.09, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.30, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.17, 2);
    });
  });

  describe('#of', () => {
    let track: PolylineTrack;
    let heightRateStats: HeightRateStats;

    beforeEach(() => {
      heightRateStats = new HeightRateStats();
      track = createTrack(heights, durations);
    });

    it('should do nothing if no track is provided', () => {
      heightRateStats.of(null);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if an empty track is provided', () => {
      const track = new PolylineTrack([]);

      heightRateStats.of(track);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(0, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(0, 2);
    });

    it('should determine the height rate properties of the track', () => {
      const heightRateStats = new HeightRateStats();

      heightRateStats.of(track);

      expect(heightRateStats.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(heightRateStats.ascent.avg).toBeCloseTo(0.08, 2);
      expect(heightRateStats.descent.min.value).toBeCloseTo(-0.30, 2);
      expect(heightRateStats.descent.avg).toBeCloseTo(-0.17, 2);
    });
  });

  // describe('#remove', () => {
  //   let track: PolylineTrack<TrackPoint, TrackSegment>;

  //   beforeEach(() => {
  //     track = createRoute(heights);
  //   });

  //   it('should remove the value', () => {
  //     const heightRateStats = new HeightRateStats();
  //     heightRateStats.of(track);

  //     expect(heightRateStats.max.value).toEqual(3.5);
  //     expect(heightRateStats.uphill).toEqual(-8.5);
  //     expect(heightRateStats.downhill).toEqual(elevationInitial + 2);
  //     expect(heightRateStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightRateStats.net).toEqual(-4 - elevationInitial);

  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);

  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should remove any value, even if not added', () => {

  //     const heightRateStats = new HeightRateStats();
  //     heightRateStats.of(track);

  //     expect(heightRateStats.max.value).toEqual(3.5);
  //     expect(heightRateStats.uphill).toEqual(-8.5);
  //     expect(heightRateStats.downhill).toEqual(elevationInitial + 2);
  //     expect(heightRateStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightRateStats.net).toEqual(-4 - elevationInitial);

  //     heightRateStats.remove(createSegment(1.5));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if the current value count is 0', () => {
  //     const heightRateStats = new HeightRateStats();
  //     heightRateStats.of(track);

  //     expect(heightRateStats.max.value).toEqual(3.5);
  //     expect(heightRateStats.uphill).toEqual(-8.5);
  //     expect(heightRateStats.downhill).toEqual(elevationInitial + 2);
  //     expect(heightRateStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightRateStats.net).toEqual(-4 - elevationInitial);

  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);

  //     // Note: There can be remaining values once count is at 0, since any value can be removed
  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);

  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if it is screened out by the initialized callback', () => {
  //     const isConsidered = (number: number) => Math.abs(number) > 0.5;
  //     const heightRateStats = new HeightRateStats(isConsidered);
  //     heightRateStats.of(track);

  //     expect(heightRateStats.max.value).toEqual(3.5);
  //     expect(heightRateStats.uphill).toEqual(-8.5);
  //     expect(heightRateStats.downhill).toEqual(elevationInitial + 2);
  //     expect(heightRateStats.min.value).toEqual(elevationInitial - 4);
  //     expect(heightRateStats.net).toEqual(-4 - elevationInitial);

  //     heightRateStats.remove(createSegment(1));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);

  //     heightRateStats.remove(createSegment(5));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);

  //     heightRateStats.remove(createSegment(6));
  //     expect(heightRateStats.max.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.uphill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.downhill).toBeCloseTo(0, 2);
  //     expect(heightRateStats.min.value).toBeCloseTo(0, 2);
  //     expect(heightRateStats.net).toBeCloseTo(0, 2);
  //   });
  // });

  describe('#serialize', () => {
    let track: PolylineTrack;
    let heightRateStats: HeightRateStats;

    beforeEach(() => {
      heightRateStats = new HeightRateStats();
      track = createTrack(heights, durations);
    });

    it('should write out empty properties if empty', () => {
      const heightRateStats = new HeightRateStats();

      const result = heightRateStats.serialize();

      expect(result.ascent.max.value).toBeCloseTo(0, 2);
      expect(result.ascent.avg).toBeCloseTo(0, 2);
      expect(result.descent.min.value).toBeCloseTo(0, 2);
      expect(result.descent.avg).toBeCloseTo(0, 2);
    });

    it('should serialize the object into a JSON object', () => {
      heightRateStats.of(track);

      const result = heightRateStats.serialize();

      expect(result.ascent.max.value).toBeCloseTo(0.17, 2);
      expect(result.ascent.avg).toBeCloseTo(0.08, 2);
      expect(result.descent.min.value).toBeCloseTo(-0.30, 2);
      expect(result.descent.avg).toBeCloseTo(-0.17, 2);
    });
  });
});