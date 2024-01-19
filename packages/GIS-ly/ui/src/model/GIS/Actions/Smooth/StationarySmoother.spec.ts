import {
  Track,
  TrackPoint
} from "../../Core/Track";

import { StationarySmoother } from "./StationarySmoother";

describe('##StationarySmoother', () => {
  describe('#smoothStationary', () => {
    it('should remove coordinates from a track that have a speeds below the specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T23:07:30Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T26:07:40Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T26:14:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const smoother = new StationarySmoother(track);
      const removedCoords = smoother.smoothStationary(minSpeedMS);

      expect(removedCoords).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should ??? coordinates from a track that do not have speed data', () => {
      // TODO: What should this behavior be or should it even be considered?
      //  A track with no speed data may just need it calculated or has no time stamps, in which case 'stationary' is not a valid criteria.
      //  A valid case would be a track with speeds where some points cannot have speed calculated (perhaps due to an error?).
      //    This seems unlikely to happen or would break things down earlier.
      //    More likely, removing points is unintended/out of order of operations.
      // This concern seems valid/solutions applicable in related cases, such as elevation change rates.
    });
  });
});