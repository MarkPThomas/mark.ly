import { SegmentNode, VertexNode } from '@MPT/geometry';

import { PolylineTrack } from '../PolylineTrack';
import { TrackPoint } from '../TrackPoint';
import { TrackSegment } from '../TrackSegment';
import { SpeedStats } from './SpeedStats';

describe('##SpeedStats', () => {
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

    return track;
  };

  const heights = [1.7, -2.8, -0.6, 5, 0.6, -8.3, -3.9];
  const durations = [30, 40, 15, 45, 2, 300, 1];

  describe('#constructor', () => {
    it('should initialize a new object', () => {
      const speedStats = new SpeedStats();

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });

    it('should take an optional callback that filters what height values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const speedStats = new SpeedStats(isConsidered);

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });
  });

  describe('#add', () => {
    let segments: SegmentNode<TrackPoint, TrackSegment>[];
    beforeEach(() => {
      segments = createSegments(heights, durations);
    });

    it('should add the speed property', () => {
      const speedStats = new SpeedStats();

      speedStats.add(segments[0]); // 30

      expect(speedStats.max.value).toBeCloseTo(1.86, 2);
      expect(speedStats.min.value).toBeCloseTo(1.86, 2);
      expect(speedStats.avg).toBeCloseTo(1.86, 2);

      speedStats.add(segments[1]); // 40


      expect(speedStats.max.value).toBeCloseTo(1.86, 2);
      expect(speedStats.min.value).toBeCloseTo(1.39, 2);
      expect(speedStats.avg).toBeCloseTo(1.59, 2);


      speedStats.add(segments[2]); // 15

      expect(speedStats.max.value).toBeCloseTo(3.71, 2);
      expect(speedStats.min.value).toBeCloseTo(1.39, 2);
      expect(speedStats.avg).toBeCloseTo(1.97, 2);


      speedStats.add(segments[3]); // 45

      expect(speedStats.max.value).toBeCloseTo(3.71, 2);
      expect(speedStats.min.value).toBeCloseTo(1.24, 2);
      expect(speedStats.avg).toBeCloseTo(1.71, 2);


      speedStats.add(segments[4]); // 2

      expect(speedStats.max.value).toBeCloseTo(27.85, 2);
      expect(speedStats.min.value).toBeCloseTo(1.24, 2);
      expect(speedStats.avg).toBeCloseTo(2.11, 2);


      speedStats.add(segments[5]);  // 300

      expect(speedStats.max.value).toBeCloseTo(27.85, 2);
      expect(speedStats.min.value).toBeCloseTo(0.19, 2);
      expect(speedStats.avg).toBeCloseTo(0.77, 2);


      speedStats.add(segments[6]);   // 1

      expect(speedStats.max.value).toBeCloseTo(55.70, 2);
      expect(speedStats.min.value).toBeCloseTo(0.19, 2);
      expect(speedStats.avg).toBeCloseTo(0.9, 2);
    });

    it('should not add the the speed property if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => Math.abs(number) > 0.5;
      const speedStats = new SpeedStats(isConsidered);

      speedStats.add(segments[0]); // 1.7

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);

      // speedStats.add(segments[1]); // -2.8


      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);


      // speedStats.add(segments[2]); // -0.6

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);


      // speedStats.add(segments[3]); // 5

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);


      // speedStats.add(segments[4]); // 0.6

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);


      // speedStats.add(segments[5]);  // -8.3

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);


      // speedStats.add(segments[6]);   // -3.9

      // expect(speedStats.max.value).toBeCloseTo(0, 2);
      // expect(speedStats.min.value).toBeCloseTo(0, 2);
      // expect(speedStats.avg).toBeCloseTo(0, 2);
    });
  });

  describe('#fromTo', () => {
    let track: PolylineTrack;
    beforeEach(() => {
      track = createTrack(heights, durations);
    });

    it('should do nothing if no start node is provided', () => {

      const speedStats = new SpeedStats();

      const startNode = null;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));

      speedStats.fromTo(startNode, endNode);

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if no end node is provided', () => {
      const speedStats = new SpeedStats();

      const startNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));
      const endNode = null;

      speedStats.fromTo(startNode, endNode);

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });

    it('should traverse from the provided start to end node & determine the speed properties', () => {
      const speedStats = new SpeedStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = track.lastVertex.prev as VertexNode<TrackPoint, TrackSegment>;

      speedStats.fromTo(startNode, endNode);

      expect(speedStats.max.value).toBeCloseTo(27.80, 2);
      expect(speedStats.min.value).toBeCloseTo(0.19, 2);
      expect(speedStats.avg).toBeCloseTo(0.69, 2);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const speedStats = new SpeedStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

      speedStats.fromTo(startNode, endNode);

      expect(speedStats.max.value).toBeCloseTo(55.60, 2);
      expect(speedStats.min.value).toBeCloseTo(0.19, 2);
      expect(speedStats.avg).toBeCloseTo(0.83, 2);
    });
  });

  describe('#of', () => {
    let track: PolylineTrack;
    let speedStats: SpeedStats;

    beforeEach(() => {
      speedStats = new SpeedStats();
      track = createTrack(heights, durations);
    });

    it('should do nothing if no track is provided', () => {
      speedStats.of(null);

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });

    it('should do nothing if an empty track is provided', () => {
      const track = new PolylineTrack([]);

      speedStats.of(track);

      expect(speedStats.max.value).toBeCloseTo(0, 2);
      expect(speedStats.min.value).toBeCloseTo(0, 2);
      expect(speedStats.avg).toBeCloseTo(0, 2);
    });

    it('should determine the speed properties of the track', () => {
      const speedStats = new SpeedStats();

      speedStats.of(track);

      expect(speedStats.max.value).toBeCloseTo(55.60, 2);
      expect(speedStats.min.value).toBeCloseTo(0.19, 2);
      expect(speedStats.avg).toBeCloseTo(0.9, 2);
    });
  });

  // describe('#remove', () => {
  //   let track: PolylineTrack;

  //   beforeEach(() => {
  //     track = createRoute(heights);
  //   });

  //   it('should remove the value', () => {
  //     const speedStats = new SpeedStats();
  //     speedStats.of(track);

  //     expect(speedStats.avg).toEqual(3.5);
  //     expect(speedStats.uphill).toEqual(-8.5);
  //     expect(speedStats.downhill).toEqual(elevationInitial + 2);
  //     expect(speedStats.min.value).toEqual(elevationInitial - 4);
  //     expect(speedStats.net).toEqual(-4 - elevationInitial);

  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);

  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should remove any value, even if not added', () => {

  //     const speedStats = new SpeedStats();
  //     speedStats.of(track);

  //     expect(speedStats.avg).toEqual(3.5);
  //     expect(speedStats.uphill).toEqual(-8.5);
  //     expect(speedStats.downhill).toEqual(elevationInitial + 2);
  //     expect(speedStats.min.value).toEqual(elevationInitial - 4);
  //     expect(speedStats.net).toEqual(-4 - elevationInitial);

  //     speedStats.remove(createSegment(1.5));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if the current value count is 0', () => {
  //     const speedStats = new SpeedStats();
  //     speedStats.of(track);

  //     expect(speedStats.avg).toEqual(3.5);
  //     expect(speedStats.uphill).toEqual(-8.5);
  //     expect(speedStats.downhill).toEqual(elevationInitial + 2);
  //     expect(speedStats.min.value).toEqual(elevationInitial - 4);
  //     expect(speedStats.net).toEqual(-4 - elevationInitial);

  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);

  //     // Note: There can be remaining values once count is at 0, since any value can be removed
  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);

  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if it is screened out by the initialized callback', () => {
  //     const isConsidered = (number: number) => Math.abs(number) > 0.5;
  //     const speedStats = new SpeedStats(isConsidered);
  //     speedStats.of(track);

  //     expect(speedStats.avg).toEqual(3.5);
  //     expect(speedStats.uphill).toEqual(-8.5);
  //     expect(speedStats.downhill).toEqual(elevationInitial + 2);
  //     expect(speedStats.min.value).toEqual(elevationInitial - 4);
  //     expect(speedStats.net).toEqual(-4 - elevationInitial);

  //     speedStats.remove(createSegment(1));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);

  //     speedStats.remove(createSegment(5));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);

  //     speedStats.remove(createSegment(6));
  //     expect(speedStats.avg).toBeCloseTo(0, 2);
  //     expect(speedStats.uphill).toBeCloseTo(0, 2);
  //     expect(speedStats.downhill).toBeCloseTo(0, 2);
  //     expect(speedStats.min.value).toBeCloseTo(0, 2);
  //     expect(speedStats.net).toBeCloseTo(0, 2);
  //   });
  // });

  describe('#serialize', () => {
    let track: PolylineTrack;
    let speedStats: SpeedStats;

    beforeEach(() => {
      speedStats = new SpeedStats();
      track = createTrack(heights, durations);
    });

    it('should write out empty properties if empty', () => {
      const speedStats = new SpeedStats();

      const result = speedStats.serialize();

      expect(result.max.value).toBeCloseTo(0, 2);
      expect(result.min.value).toBeCloseTo(0, 2);
      expect(result.avg).toBeCloseTo(0, 2);
    });

    it('should serialize the object into a JSON object', () => {
      speedStats.of(track);

      const result = speedStats.serialize();

      expect(result.max.value).toBeCloseTo(55.60, 2);
      expect(result.min.value).toBeCloseTo(0.19, 2);
      expect(result.avg).toBeCloseTo(0.9, 2);
    });
  });
});