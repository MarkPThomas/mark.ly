import {
  Track,
  TrackPoint
} from "../../Core/Track";

import { DurationSplitter } from "./DurationSplitter";

describe('##DurationSplitter', () => {
  describe('#splitByMaxDuration', () => {
    it('should do nothing to an empty track', () => {
      const track = Track.fromPoints([]);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(0);
      expect(track.trackPoints().length).toEqual(0);
    });

    it('should do nothing to a track that has no separate activities by time stopped', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 59 min from stop, 3 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(4);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should trim the start of a track that has only one Point', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T21:01:00Z'), // Resume 1 hr, 1 min min from start, 6 min from end
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'),
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:07:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(3);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should trim the start of a track based on a long enough stop between movement that is close enough to the start of the activity', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should trim the end of a track that has only one Point', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start, 1 hr, 1 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:04:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);   // 4
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(3);
      expect(track.trackPoints().length).toEqual(3); // track is modified & is the first returned track or dropped track
    });

    it('should trim the end of a track based on a long enough stop between movement that is close enough to the end of the activity', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'), // Resume 1 hr, 1 min from stop, 1 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should return no tracks when both ends are trimmed and middle section is the triggering segment', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:03:00Z'), // Resume  1 hr, 1 min from start, 1 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:04:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(0);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should trim ends by the Splitter default if not specified in function call', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:04:00Z'), // Stop 4 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:05:00Z'), // Resume 1 hr, 1 min from stop, 6 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:11:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // minEdgeTimes default = 300 sec = 5 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should trim ends by the Splitter overwrite upon initialization if not specified in function call', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track, minMoveDurationS);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(1);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should split a track based on a long enough stop between movement', () => {
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:07:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMoveDurationS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

      expect(splitResult.points.length).toEqual(2);
      expect(splitResult.segments.length).toEqual(1);
      expect(splitResult.tracks.length).toEqual(2);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(splitResult.tracks[1].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });

    it('should split a track at multiple points based on a long enough stop between movement', () => {
      // Trim both ends, 1 middle, keep 2 mid points = 10
      const coords = [
        new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T19:00:00Z'),
        new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T19:01:00Z'), // Stop 1 min from start
        new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T20:02:00Z'), // Resume 1 hr, 1 min from stop. Trim to here
        new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T20:05:00Z'),  // Stop after 3 min
        new TrackPoint(-8.948042761, -77.7136469014, 0, '2023-07-04T21:06:00Z'),  // Resume 1 hr, 1 min from stop
        new TrackPoint(-8.949042761, -77.7136469014, 0, '2023-07-04T21:07:00Z'),  // Stop after 1 min. Drop this segment
        new TrackPoint(-8.950042761, -77.7136469014, 0, '2023-07-04T22:08:00Z'),  // Resume 1 hr, 1 min from stop
        new TrackPoint(-8.957042761, -77.7136469014, 0, '2023-07-04T22:11:00Z'),  // Stop after 3 min. Trim from here
        new TrackPoint(-8.958042761, -77.7136469014, 0, '2023-07-04T23:12:00Z'),  // Resume 1 hr, 1 min from stop, 1 min from end
        new TrackPoint(-8.959042761, -77.7136469014, 0, '2023-07-04T23:13:00Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const minMovementTimesS = 120; // 2 min
      const maxStopDurationS = 3600; // 1 hr
      const splitter = new DurationSplitter(track);
      const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMovementTimesS);

      expect(splitResult.points.length).toEqual(8);
      expect(splitResult.segments.length).toEqual(4);
      expect(splitResult.tracks.length).toEqual(2);
      expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
      expect(splitResult.tracks[1].trackPoints().length).toEqual(2);
      expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
    });
  });
});