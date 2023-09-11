import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";

import { ElevationSpeedSmoother } from "./ElevationSpeedSmoother";

describe('##ElevationSpeedSmoother', () => {
  describe('#smoothByElevationSpeed', () => {
    it('should do nothing for coordinates with no DEM elevation', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
      ];

      const track = Track.fromTrackPoints(coords);
      track.addProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(0);
      expect(track.trackPoints().length).toEqual(5);
    });

    it('should do nothing for coordinates with elevation changes below the specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1000; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1005; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1010;  // 0 m/s // TODO: separate concerns of loss/gain? This is actually 5m up, 5m down over 30 sec ~ 5m/15sec = 0.3 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1005; // -0.16667 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1000; // -0.16667 m/s

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(0);
      expect(track.trackPoints().length).toEqual(5);
    });

    it('should remove points that have an elevation gain speed above the specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1000; // 0.3333 m/s // Remove
      // Seg: 10m/30sec = 0.3333m/s
      coords[1].elevation = 1010; // 0.25 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1015; // 0.0 m/s     // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1010; // 0.16667 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1005; // 0.16667 m/s

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it(`should remove points that have an elevation loss speed above the general specified
      limit if no loss limit is specified`, () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1005; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1010; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1015; // 0.0 m/s    // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1010; // -0.25 m/s
      // Seg: -10m/30sec = -0.3333/s
      coords[4].elevation = 1000; // -0.3333 m/s  // Remove

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove points that have an elevation loss speed above the specified limit for loss', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1025; // 0.0 m/s    // TODO: Fix
      // Seg: -5m/30sec = -0.16667m/s
      coords[3].elevation = 1020; // -0.4167 m/s
      // Seg: -20m/30sec = -0.6667/s
      coords[4].elevation = 1000; // -0.6667 m/s  // Remove

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove maxima/minima where one adjacent segment has an elevation gain speed above the specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.25 m/s
      // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
      coords[2].elevation = 1030;
      // Seg: -10m/30sec = -0.33333m/s
      coords[3].elevation = 1020; // -0.25 m/s
      // Seg: -5m/30sec = -0.16667m/s
      coords[4].elevation = 1015; // -0.16667 m/s

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove maxima/minima where one adjacent segment has an elevation loss speed above the specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1020; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1025; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[2].elevation = 1030;
      // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
      coords[3].elevation = 1010; // -0.4167 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[4].elevation = 1000; // 0.16667 m/s

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });

    it('should remove maxima/minima where each adjacent segment has an elevation speed above the corresponding specified limit', () => {
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:02:00Z')
      ];
      coords[0].elevation = 1015; // 0.16667 m/s
      // Seg: 5m/30sec = 0.16667m/s
      coords[1].elevation = 1020; // 0.25 m/s
      // Seg: 10m/30sec = 0.3333m/s             // Triggers removal of following node
      coords[2].elevation = 1030;
      // Seg: -20m/30sec = -0.66667m/s          // Triggers removal of prior node
      coords[3].elevation = 1010; // -0.4167 m/s
      // Seg: -5m/30sec = 0.16667m/s
      coords[4].elevation = 1000; // 0.16667 m/s

      const track = Track.fromTrackPoints(coords);
      track.addProperties();
      track.addElevationProperties();

      // 0.254 meters/sec = 3000 feet/hour
      const maxAscentRateMPS = 0.254;
      const maxDescentRateMPS = 0.508;  // x2 = 6000 ft/hr loss
      const smoother = new ElevationSpeedSmoother(track);
      const smoothResults = smoother.smoothByElevationSpeed(maxAscentRateMPS, maxDescentRateMPS);

      expect(smoothResults).toEqual(1);
      expect(track.trackPoints().length).toEqual(4);
    });
  });
});