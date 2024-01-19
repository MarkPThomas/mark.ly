import { SpeedSmoother } from '../Smooth';
import { Track, TrackPoint } from '../../Core/Track';
import { IActivity } from '../../settings';
import { ActivitySplitter } from './ActivitySplitter';

describe('#ActivitySplitter', () => {
  let activity: IActivity;
  beforeEach(() => {
    activity = {
      name: "Hiking",
      speed: {
        min: 0.11176, // 0.25 mph
        max: 2  // 4.5 mph
      },
      gapDistanceMax: 1650
    }
  });

  describe('##splitByActivity', () => {
    it('should do nothing to an empty track', () => {
      const track = Track.fromPoints([]);
      track.addProperties();

      const smoother = new SpeedSmoother(track);
      smoother.smoothBySpeed(activity.speed.max);
      const isSmoothed = true;

      const splitter = new ActivitySplitter(track);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(0);
      expect(track.trackPoints().length).toEqual(0);
    });

    it('should do nothing to a track that has data from only the specified sport', () => {
      const coords = [
        new TrackPoint(0, 0, 0, '2023-07-04T12:00:00Z'),
        new TrackPoint(0, 0.0004, 0, '2023-07-04T12:01:00Z'),
        new TrackPoint(0, 0.0008, 0, '2023-07-04T12:02:00Z'),
        new TrackPoint(0, 0.0012, 0, '2023-07-04T12:03:00Z'),
        new TrackPoint(0, 0.0016, 0, '2023-07-04T12:04:00Z'),
        new TrackPoint(0, 0.0020, 0, '2023-07-04T12:05:00Z'),
        new TrackPoint(0, 0.0024, 0, '2023-07-04T12:06:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      expect(track.trackPoints().length).toEqual(7);

      const smoother = new SpeedSmoother(track);
      smoother.smoothBySpeed(activity.speed.max);
      const isSmoothed = true;

      expect(track.trackPoints().length).toEqual(7);

      const splitter = new ActivitySplitter(track);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(7);
      expect(track.trackPoints().length).toEqual(7);
    });

    it('should do nothing for a track that has data from only one sport, but not the specified sport', () => {
      const coords = [
        new TrackPoint(0, 0, 0, '2023-07-04T12:00:00Z'),
        new TrackPoint(0, 0.005, 0, '2023-07-04T12:03:00Z'),
        new TrackPoint(0, 0.010, 0, '2023-07-04T12:06:00Z'),
        new TrackPoint(0, 0.015, 0, '2023-07-04T12:09:00Z'),
        new TrackPoint(0, 0.020, 0, '2023-07-04T12:12:00Z'),
        new TrackPoint(0, 0.025, 0, '2023-07-04T12:15:00Z'),
        new TrackPoint(0, 0.030, 0, '2023-07-04T12:18:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      expect(track.trackPoints().length).toEqual(7);

      const smoother = new SpeedSmoother(track);
      smoother.smoothBySpeed(activity.speed.max);
      const isSmoothed = true;

      expect(track.trackPoints().length).toEqual(0);

      const splitter = new ActivitySplitter(track);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(0);
      expect(track.trackPoints().length).toEqual(0);
    });

    it('should do nothing to a track where the specified sport has no max gap distance specified', () => {
      const coords = [
        new TrackPoint(0, 0, 0, '2023-07-04T12:00:00Z'),
        new TrackPoint(0, 0.0004, 0, '2023-07-04T12:01:00Z'),
        new TrackPoint(0, 0.0008, 0, '2023-07-04T12:02:00Z'),
        new TrackPoint(0, 0.0012, 0, '2023-07-04T12:03:00Z'), // end slow
        new TrackPoint(0, 0.0062, 0, '2023-07-04T12:06:00Z'),
        new TrackPoint(0, 0.0112, 0, '2023-07-04T12:09:00Z'),
        new TrackPoint(0, 0.0162, 0, '2023-07-04T12:12:00Z'), // end fast
        new TrackPoint(0, 0.0166, 0, '2023-07-04T12:13:00Z'),
        new TrackPoint(0, 0.0170, 0, '2023-07-04T12:14:00Z'),
        new TrackPoint(0, 0.0174, 0, '2023-07-04T12:15:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      expect(track.trackPoints().length).toEqual(10);

      const smoother = new SpeedSmoother(track);
      smoother.smoothBySpeed(activity.speed.max);
      const isSmoothed = true;

      expect(track.trackPoints().length).toEqual(8);

      delete activity.gapDistanceMax;

      const splitter = new ActivitySplitter(track);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(8);
      expect(track.trackPoints().length).toEqual(8);
    });

    it('should split a track into 3, with 2 kept with the bad movement at the middle', () => {
      const coords = [
        new TrackPoint(0, 0, 0, '2023-07-04T12:00:00Z'),
        new TrackPoint(0, 0.0004, 0, '2023-07-04T12:01:00Z'),
        new TrackPoint(0, 0.0008, 0, '2023-07-04T12:02:00Z'),
        new TrackPoint(0, 0.0012, 0, '2023-07-04T12:03:00Z'), // end slow
        new TrackPoint(0, 0.0062, 0, '2023-07-04T12:06:00Z'),
        new TrackPoint(0, 0.0112, 0, '2023-07-04T12:09:00Z'),
        new TrackPoint(0, 0.0162, 0, '2023-07-04T12:12:00Z'),
        new TrackPoint(0, 0.0212, 0, '2023-07-04T12:15:00Z'), // end fast
        new TrackPoint(0, 0.0216, 0, '2023-07-04T12:16:00Z'),
        new TrackPoint(0, 0.0220, 0, '2023-07-04T12:17:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      expect(track.trackPoints().length).toEqual(10);

      const smoother = new SpeedSmoother(track);
      smoother.smoothBySpeed(activity.speed.max);
      const isSmoothed = true;

      expect(track.trackPoints().length).toEqual(7);

      const minMoveDurationS = 60;
      const splitter = new ActivitySplitter(track, minMoveDurationS);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(2);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(4);
      expect(splitResult.tracks[1].trackPoints().length).toEqual(3);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should smooth a track if it has not already been smoothed', () => {
      const coords = [
        new TrackPoint(0, 0, 0, '2023-07-04T12:00:00Z'),
        new TrackPoint(0, 0.0004, 0, '2023-07-04T12:01:00Z'),
        new TrackPoint(0, 0.0008, 0, '2023-07-04T12:02:00Z'),
        new TrackPoint(0, 0.0012, 0, '2023-07-04T12:03:00Z'), // end slow
        new TrackPoint(0, 0.0062, 0, '2023-07-04T12:06:00Z'),
        new TrackPoint(0, 0.0112, 0, '2023-07-04T12:09:00Z'),
        new TrackPoint(0, 0.0162, 0, '2023-07-04T12:12:00Z'),
        new TrackPoint(0, 0.0212, 0, '2023-07-04T12:15:00Z'), // end fast
        new TrackPoint(0, 0.0216, 0, '2023-07-04T12:16:00Z'),
        new TrackPoint(0, 0.0220, 0, '2023-07-04T12:17:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      expect(track.trackPoints().length).toEqual(10);

      const isSmoothed = false;

      const minMoveDurationS = 60;
      const splitter = new ActivitySplitter(track, minMoveDurationS);
      const splitResult = splitter.splitByActivity(activity, isSmoothed);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(2);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(4);
      expect(splitResult.tracks[1].trackPoints().length).toEqual(3);
      expect(track.trackPoints().length).toEqual(4);
    });
  });
});