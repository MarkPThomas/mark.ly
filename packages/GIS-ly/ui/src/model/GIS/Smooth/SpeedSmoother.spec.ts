import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";

import { SpeedSmoother } from "./SpeedSmoother";

describe('##SpeedSmoother', () => {
  describe('#smoothBySpeed', () => {
    it('should do nothing to a track that has no speeds above the specified limit', () => {
      const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
      coord1.timestamp = '2023-07-04T20:50:08Z';
      // Speed (average): 1.55 m/s = 3.47 mph

      const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
      coord2.timestamp = '2023-07-04T20:50:31Z';
      // Speed (average): 1.393 m/s = 3.12 mph

      const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
      coord3.timestamp = '2023-07-04T20:51:03Z';
      // Speed (average): 1.258 m/s = 2.81 mph

      const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
      coord4.timestamp = '2023-07-04T20:51:43Z';
      // Speed (average): 1.283 m/s = 2.87 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = Track.fromTrackPoints(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const smoother = new SpeedSmoother(track);
      const removedCoords = smoother.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(0);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove the first coordinate from a track when it has speeds above the specified limit', () => {
      const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
      coord1.timestamp = '2023-07-04T20:50:08Z';
      // Speed (average): 3.575 m/s = 8.0 mph
      // Segment speed: 3.575 m/s = 8.0 mph

      const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
      coord2.timestamp = '2023-07-04T20:50:18Z';
      // Speed (average): 2.069 m/s = 4.6 mph
      // Segment speed: 0.564 m/s = 1.3 mph

      const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
      coord3.timestamp = '2023-07-04T20:51:28Z';
      // Speed (average): 1.137 m/s = 2.5 mph
      // Segment speed: 1.71 m/s = 3.8 mph

      const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
      coord4.timestamp = '2023-07-04T20:51:58Z';
      // Speed (average): 1.710 m/s = 3.8 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = Track.fromTrackPoints(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const smoother = new SpeedSmoother(track);
      const removedCoords = smoother.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(1);
      expect(track.trackPoints().length).toEqual(3);
    });

    it('should remove the last coordinate from a track when it has speeds above the specified limit', () => {
      const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
      coord1.timestamp = '2023-07-04T20:50:08Z';
      // Speed (average): 1.083 m/s = 2.4 mph
      // Segment speed:  m/s =  mph

      const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
      coord2.timestamp = '2023-07-04T20:50:41Z';
      // Speed (average): 0.870 m/s = 1.9 mph
      // Segment speed:  m/s =  mph

      const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
      coord3.timestamp = '2023-07-04T20:51:41Z';
      // Speed (average): 2.89 m/s = 6.46 mph
      // Segment speed:  m/s =  mph

      const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
      coord4.timestamp = '2023-07-04T20:51:51Z';
      // Speed (average): 5.13 m/s = 11.5 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = Track.fromTrackPoints(coords);
      track.addProperties();

      const speedLimitMpS = 3.129; // 7 mph
      const smoother = new SpeedSmoother(track);
      const removedCoords = smoother.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(1);
      expect(track.trackPoints().length).toEqual(3);
    });

    it('should remove coordinates from a track that have speeds above the specified limit', () => {
      const coord1 = new TrackPoint(-8.9448362309, -77.7124663163);
      coord1.timestamp = '2023-07-04T20:49:58Z';
      // Speed (average): 1.787 m/s = 4.0 mph

      const coord2 = new TrackPoint(-8.9447123464, -77.7121659927);
      coord2.timestamp = '2023-07-04T20:50:18Z';
      // Speed (average): 3.086 m/s = 6.9 mph

      const coord3 = new TrackPoint(-8.9446145296, -77.7118207421);
      coord3.timestamp = '2023-07-04T20:50:27Z';
      // Speed (average): 2.474 m/s = 5.5 mph

      const coord4 = new TrackPoint(-8.945042761, -77.7116469014);
      coord4.timestamp = '2023-07-04T20:51:58Z';
      // Speed (average): 0.563 m/s = 1.26 mph

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4
      ];

      const track = Track.fromTrackPoints(coords);
      track.addProperties();

      const speedLimitMpS = 2.2352; // 5 mph
      const smoother = new SpeedSmoother(track);
      const removedCoords = smoother.smoothBySpeed(speedLimitMpS);

      expect(removedCoords).toEqual(2);
      expect(track.trackPoints().length).toEqual(2);
    });
  });
});