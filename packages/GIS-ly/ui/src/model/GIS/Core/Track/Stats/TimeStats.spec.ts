import { SegmentNode, VertexNode } from '../../../../Geometry';
import { PolylineTrack } from '../PolylineTrack';
import { TrackPoint } from '../TrackPoint';
import { TrackSegment } from '../TrackSegment';
import { TimeStats } from './TimeStats';

describe('##TimeStats', () => {
  const longMultiplier = 0.0005;

  const updateTimestampMS = (timestamp: number, duration: number) => timestamp + duration * 1000;

  const createSegments = (heights: number[], durations: number[]) => {
    const segmentNodes: SegmentNode<TrackPoint, TrackSegment>[] = [];

    if (heights.length) {
      const track = createTrack(heights, durations);
      let segmentNode = track.firstSegment;

      while (segmentNode) {
        segmentNodes.push(segmentNode);
        segmentNode = segmentNode.next as SegmentNode<TrackPoint, TrackSegment>;
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
      const timeStats = new TimeStats();

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });

    it('should take an optional callback that filters what height values are added/removed', () => {
      const isConsidered = (number: number) => number > 4;

      const timeStats = new TimeStats(isConsidered);

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });
  });

  describe('#add', () => {
    let segments: SegmentNode<TrackPoint, TrackSegment>[];
    beforeEach(() => {
      segments = createSegments(heights, durations);
    });

    it('should add the time property', () => {
      const timeStats = new TimeStats();

      timeStats.add(segments[0]); // 30

      expect(timeStats.max.value).toEqual(30);
      expect(timeStats.min.value).toEqual(30);
      expect(timeStats.duration).toEqual(30);

      timeStats.add(segments[1]); // 40

      expect(timeStats.max.value).toEqual(40);
      expect(timeStats.min.value).toEqual(30);
      expect(timeStats.duration).toEqual(70);

      timeStats.add(segments[2]); // 15

      expect(timeStats.max.value).toEqual(40);
      expect(timeStats.min.value).toEqual(15);
      expect(timeStats.duration).toEqual(85);

      timeStats.add(segments[3]); // 45

      expect(timeStats.max.value).toEqual(45);
      expect(timeStats.min.value).toEqual(15);
      expect(timeStats.duration).toEqual(130);

      timeStats.add(segments[4]); // 2

      expect(timeStats.max.value).toEqual(45);
      expect(timeStats.min.value).toEqual(2);
      expect(timeStats.duration).toEqual(132);

      timeStats.add(segments[5]);  // 300

      expect(timeStats.max.value).toEqual(300);
      expect(timeStats.min.value).toEqual(2);
      expect(timeStats.duration).toEqual(432);

      timeStats.add(segments[6]);   // 1

      expect(timeStats.max.value).toEqual(300);
      expect(timeStats.min.value).toEqual(1);
      expect(timeStats.duration).toEqual(433);
    });

    it('should not add the the time property if it is screened out by the initialized callback', () => {
      const isConsidered = (number: number) => Math.abs(number) > 0.5;
      const timeStats = new TimeStats(isConsidered);

      timeStats.add(segments[0]); // 1.7

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);

      // timeStats.add(segments[1]); // -2.8


      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);


      // timeStats.add(segments[2]); // -0.6

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);


      // timeStats.add(segments[3]); // 5

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);


      // timeStats.add(segments[4]); // 0.6

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);


      // timeStats.add(segments[5]);  // -8.3

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);


      // timeStats.add(segments[6]);   // -3.9

      // expect(timeStats.max.value).toBeCloseTo(0, 2);
      // expect(timeStats.min.value).toBeCloseTo(0, 2);
      // expect(timeStats.duration).toBeCloseTo(0, 2);
    });
  });

  describe('#fromTo', () => {
    let track: PolylineTrack;
    beforeEach(() => {
      track = createTrack(heights, durations);
    });

    it('should do nothing if no start node is provided', () => {
      const timeStats = new TimeStats();

      const startNode = null;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));

      timeStats.fromTo(startNode, endNode);

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });

    it('should do nothing if no end node is provided', () => {
      const timeStats = new TimeStats();

      const startNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(5, 6));
      const endNode = null;

      timeStats.fromTo(startNode, endNode);

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });

    it('should traverse from the provided start to end node & determine the time properties', () => {
      const timeStats = new TimeStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = track.lastVertex.prev as VertexNode<TrackPoint, TrackSegment>;

      timeStats.fromTo(startNode, endNode);

      expect(timeStats.max.value).toEqual(300);
      expect(timeStats.min.value).toEqual(2);
      expect(timeStats.duration).toEqual(402);
    });

    it('should traverse to the end of the start node linked list if the end node is not encountered', () => {
      const timeStats = new TimeStats();

      const startNode = track.firstVertex.next as VertexNode<TrackPoint, TrackSegment>;
      const endNode = new VertexNode<TrackPoint, TrackSegment>(new TrackPoint(1, 2));

      timeStats.fromTo(startNode, endNode);

      expect(timeStats.max.value).toEqual(300);
      expect(timeStats.min.value).toEqual(1);
      expect(timeStats.duration).toEqual(403);
    });
  });

  describe('#of', () => {
    let track: PolylineTrack;
    let timeStats: TimeStats;

    beforeEach(() => {
      timeStats = new TimeStats();
      track = createTrack(heights, durations);
    });

    it('should do nothing if no track is provided', () => {
      timeStats.of(null);

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });

    it('should do nothing if an empty track is provided', () => {
      const track = new PolylineTrack([]);

      timeStats.of(track);

      expect(timeStats.max.value).toBeCloseTo(0, 2);
      expect(timeStats.min.value).toBeCloseTo(0, 2);
      expect(timeStats.duration).toBeCloseTo(0, 2);
    });

    it('should determine the time properties of the track', () => {
      const timeStats = new TimeStats();

      timeStats.of(track);

      expect(timeStats.max.value).toEqual(300);
      expect(timeStats.min.value).toEqual(1);
      expect(timeStats.duration).toEqual(433);
    });
  });

  // describe('#remove', () => {
  //   let track: PolylineTrack;

  //   beforeEach(() => {
  //     track = createRoute(heights);
  //   });

  //   it('should remove the value', () => {
  //     const timeStats = new TimeStats();
  //     timeStats.of(track);

  //     expect(timeStats.duration).toEqual(3.5);
  //     expect(timeStats.uphill).toEqual(-8.5);
  //     expect(timeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(timeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(timeStats.net).toEqual(-4 - elevationInitial);

  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);

  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should remove any value, even if not added', () => {

  //     const timeStats = new TimeStats();
  //     timeStats.of(track);

  //     expect(timeStats.duration).toEqual(3.5);
  //     expect(timeStats.uphill).toEqual(-8.5);
  //     expect(timeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(timeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(timeStats.net).toEqual(-4 - elevationInitial);

  //     timeStats.remove(createSegment(1.5));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if the current value count is 0', () => {
  //     const timeStats = new TimeStats();
  //     timeStats.of(track);

  //     expect(timeStats.duration).toEqual(3.5);
  //     expect(timeStats.uphill).toEqual(-8.5);
  //     expect(timeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(timeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(timeStats.net).toEqual(-4 - elevationInitial);

  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);

  //     // Note: There can be remaining values once count is at 0, since any value can be removed
  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);

  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);
  //   });

  //   it('should not remove the value if it is screened out by the initialized callback', () => {
  //     const isConsidered = (number: number) => Math.abs(number) > 0.5;
  //     const timeStats = new TimeStats(isConsidered);
  //     timeStats.of(track);

  //     expect(timeStats.duration).toEqual(3.5);
  //     expect(timeStats.uphill).toEqual(-8.5);
  //     expect(timeStats.downhill).toEqual(elevationInitial + 2);
  //     expect(timeStats.min.value).toEqual(elevationInitial - 4);
  //     expect(timeStats.net).toEqual(-4 - elevationInitial);

  //     timeStats.remove(createSegment(1));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);

  //     timeStats.remove(createSegment(5));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);

  //     timeStats.remove(createSegment(6));
  //     expect(timeStats.duration).toBeCloseTo(0, 2);
  //     expect(timeStats.uphill).toBeCloseTo(0, 2);
  //     expect(timeStats.downhill).toBeCloseTo(0, 2);
  //     expect(timeStats.min.value).toBeCloseTo(0, 2);
  //     expect(timeStats.net).toBeCloseTo(0, 2);
  //   });
  // });

  describe('#serialize', () => {
    let track: PolylineTrack;
    let timeStats: TimeStats;

    beforeEach(() => {
      timeStats = new TimeStats();
      track = createTrack(heights, durations);
    });

    it('should write out empty properties if empty', () => {
      const timeStats = new TimeStats();

      const result = timeStats.serialize();

      expect(result.max.value).toBeCloseTo(0, 2);
      expect(result.min.value).toBeCloseTo(0, 2);
      expect(result.duration).toBeCloseTo(0, 2);
    });

    it('should serialize the object into a JSON object', () => {
      timeStats.of(track);

      const result = timeStats.serialize();

      expect(result.max.value).toEqual(300);
      expect(result.min.value).toEqual(1);
      expect(result.duration).toEqual(433);
    });
  });
});