import {
  Track,
  TrackPoint
} from "../../Core/Track";

import { AngularSpeedSmoother } from "./AngularSpeedSmoother";

describe('##AngularSpeedSmoother', () => {
  describe('#smoothByAngularSpeed', () => {
    it('should remove coordinates from a track that have clockwise angular speeds above the specified limit', () => {
      const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
      coord1.timestamp = '2023-07-04T20:00:00Z';

      const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
      coord2.timestamp = '2023-07-04T20:07:20Z';

      const coord3 = new TrackPoint(39.75260590879227, -104.9990802128465);
      coord3.timestamp = '2023-07-04T20:07:30Z';

      const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
      coord4.timestamp = '2023-07-04T20:07:40Z';

      const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
      coord5.timestamp = '2023-07-04T20:15:00Z';

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const speedLimitRadpS = 0.1;
      const smoother = new AngularSpeedSmoother(track);
      const removedCoords = smoother.smoothByAngularSpeed(speedLimitRadpS);

      expect(removedCoords).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove coordinates from a track that have counter-clockwise angular speeds above the specified limit', () => {
      const coord1 = new TrackPoint(39.74007868370209, -105.0076261841355);
      coord1.timestamp = '2023-07-04T20:00:00Z';

      const coord2 = new TrackPoint(39.74005097339472, -104.9998123858178);
      coord2.timestamp = '2023-07-04T20:07:20Z';

      const coord3 = new TrackPoint(39.73055300708892, -104.9990802128465);
      coord3.timestamp = '2023-07-04T20:07:30Z';

      const coord4 = new TrackPoint(39.73993779411854, -104.9985377946692);
      coord4.timestamp = '2023-07-04T20:07:40Z';

      const coord5 = new TrackPoint(39.73991441833991, -104.9917491337653);
      coord5.timestamp = '2023-07-04T20:15:00Z';

      const coords = [
        coord1,
        coord2,
        coord3,
        coord4,
        coord5
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      const speedLimitRadpS = 0.1;
      const smoother = new AngularSpeedSmoother(track);
      const removedCoords = smoother.smoothByAngularSpeed(speedLimitRadpS);

      expect(removedCoords).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });
  });
});