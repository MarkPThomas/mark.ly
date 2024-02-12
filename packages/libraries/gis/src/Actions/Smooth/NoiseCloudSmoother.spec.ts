import {
  Track,
  TrackPoint
} from "../../Core/Track";

import { NoiseCloudSmoother } from "./NoiseCloudSmoother";

describe('##NoiseCloudSmoother', () => {
  describe('#smoothNoiseCloud', () => {
    it('should do nothing to a path with no noise clouds', () => {
      // Points are stationary by timestamps, but fall outside of the radius to be 'stationary' in a location based on min timestamp intervals
      const coords = [
        new TrackPoint(39.74007868370209, -105.0076261841355, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.74005097339472, -104.9998123858178, 0, '2023-07-04T20:07:20Z'),
        new TrackPoint(39.73055300708892, -104.9990802128465, 0, '2023-07-04T20:07:30Z'),
        new TrackPoint(39.73993779411854, -104.9985377946692, 0, '2023-07-04T20:07:40Z'),
        new TrackPoint(39.73991441833991, -104.9917491337653, 0, '2023-07-04T20:15:00Z')
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const smoother = new NoiseCloudSmoother(track);
      const smoothResults = smoother.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(0);
      expect(smoothResults.clouds).toEqual(0);
      expect(track.trackPoints().length).toEqual(5);
    });

    it('should remove coordinates in a noise cloud at the beginning of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        // Begin noise cloud
        new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:00:10Z'),
        new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:20Z'),
        new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:40Z'),
        new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:50Z'),
        // End noise cloud
        new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:01:10Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary, results in 3.35 meters or less between points
      const minSpeedMS = 0.11176;
      const smoother = new NoiseCloudSmoother(track);
      const smoothResults = smoother.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(6);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.trackPoints();
      expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed resume)

      // Presumed resume node
      expect(resultCoords[0].lat).toEqual(39.87825420255762);
      expect(resultCoords[0].lng).toEqual(-105.13560669104396);
      expect(resultCoords[0].timestamp).toEqual('2023-07-04T20:00:50Z');
    });

    it('should remove coordinates in a noise cloud at the end of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new TrackPoint(39.87826264076499, -105.1354118952022, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.87824842224867, -105.135538250267, 0, '2023-07-04T20:00:10Z'),
        // Begin noise cloud
        new TrackPoint(39.87825387952743, -105.1356161946944, 0, '2023-07-04T20:00:20Z'),
        new TrackPoint(39.87826472592575, -105.1356132849471, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.87826161162284, -105.1355917824807, 0, '2023-07-04T20:00:40Z'),
        new TrackPoint(39.87824419141037, -105.1355964254974, 0, '2023-07-04T20:00:50Z'),
        new TrackPoint(39.87825725567232, -105.1356064333283, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.878243551187, -105.1356160253158, 0, '2023-07-04T20:01:10Z'),
        // End noise cloud
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const smoother = new NoiseCloudSmoother(track);
      const smoothResults = smoother.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(6);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.trackPoints();
      expect(resultCoords.length).toEqual(3); // 2 original nodes + 1 avg node (presumed pause)

      // Presumed pause node
      expect(resultCoords[2].lat).toEqual(39.87825420255762);
      expect(resultCoords[2].lng).toEqual(-105.13560669104396);
      expect(resultCoords[2].timestamp).toEqual('2023-07-04T20:00:20Z');
    });

    it('should remove nodes in a noise cloud in the middle of the path, leaving an average pause/resume node in place', () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new TrackPoint(39.87823888190675, -105.1357900558201, 0, '2023-07-04T20:00:00Z'),
        new TrackPoint(39.87822589268432, -105.1357027717129, 0, '2023-07-04T20:00:10Z'),
        // Begin noise cloud
        new TrackPoint(39.87821721769159, -105.1356040418078, 0, '2023-07-04T20:00:20Z'),
        new TrackPoint(39.87823050857553, -105.1355974665931, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.878236962082, -105.1356171532047, 0, '2023-07-04T20:00:40Z'),
        new TrackPoint(39.87822657116678, -105.1356188651574, 0, '2023-07-04T20:00:50Z'),
        new TrackPoint(39.87821596033782, -105.1355800846031, 0, '2023-07-04T20:01:00Z'),
        // End noise cloud
        new TrackPoint(39.87822512731312, -105.1355053510283, 0, '2023-07-04T20:01:10Z'),
        new TrackPoint(39.87821988064638, -105.1353883040605, 0, '2023-07-04T20:01:20Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const smoother = new NoiseCloudSmoother(track);
      const smoothResults = smoother.smoothNoiseClouds(minSpeedMS);

      expect(smoothResults.nodes).toEqual(5);
      expect(smoothResults.clouds).toEqual(1);

      const resultCoords = track.trackPoints();
      expect(resultCoords.length).toEqual(6);   // 4 original nodes + 2 avg nodes (1 presumed pause, 1 presumed resume)

      // Pause & resume nodes
      expect(resultCoords[2].lat).toEqual(39.87822544397074);
      expect(resultCoords[2].lng).toEqual(-105.13560352227323);
      expect(resultCoords[2].timestamp).toEqual('2023-07-04T20:00:20Z');

      expect(resultCoords[3].lat).toEqual(resultCoords[2].lat);
      expect(resultCoords[3].lng).toEqual(resultCoords[2].lng);
      expect(resultCoords[3].timestamp).toEqual('2023-07-04T20:01:00Z');
    });

    it(`should remove nodes in multiple overlapping noise clouds in the middle of the path,
      leaving an average pause/resume node in place`, () => {
      const coords = [
        // Times are accelerated such that the points aren't marked as stationary
        // Distances are such that based on assume min timestamps, they are too close
        new TrackPoint(39.87825432484495, -105.1353814910402, 0, '2023-07-04T20:00:00Z'),
        // Begin noise cloud #1
        new TrackPoint(39.87824052403623, -105.1352618135007, 0, '2023-07-04T20:00:10Z'),
        new TrackPoint(39.8782522989425, -105.1352433936513, 0, '2023-07-04T20:00:20Z'),
        new TrackPoint(39.87825750947018, -105.1352618278019, 0, '2023-07-04T20:00:30Z'),
        new TrackPoint(39.87824948371056, -105.1352684908337, 0, '2023-07-04T20:00:40Z'),
        new TrackPoint(39.87823201248165, -105.135242862249, 0, '2023-07-04T20:00:50Z'),
        new TrackPoint(39.87823014730432, -105.1352631715043, 0, '2023-07-04T20:01:00Z'),
        new TrackPoint(39.87824285433322, -105.135233590465, 0, '2023-07-04T20:01:10Z'),
        // End noise cloud #1
        // Begin noise cloud #2
        new TrackPoint(39.87823856216351, -105.1351918088743, 0, '2023-07-04T20:01:20Z'),
        new TrackPoint(39.87824751183506, -105.1351733485622, 0, '2023-07-04T20:01:30Z'),
        new TrackPoint(39.87825320422211, -105.1351936504459, 0, '2023-07-04T20:01:40Z'),
        new TrackPoint(39.87823291651964, -105.1352084650403, 0, '2023-07-04T20:01:50Z'),
        new TrackPoint(39.87821729634359, -105.1351968777954, 0, '2023-07-04T20:02:00Z'),
        new TrackPoint(39.87825197840353, -105.1351988205849, 0, '2023-07-04T20:02:10Z'),
        new TrackPoint(39.87823106932006, -105.1351756495897, 0, '2023-07-04T20:02:20Z'),
        // End noise cloud #2
        new TrackPoint(39.87823847144207, -105.1351062708185, 0, '2023-07-04T20:02:30Z'),
        new TrackPoint(39.87823789587544, -105.1350151021305, 0, '2023-07-04T20:02:40Z'),
      ];

      const track = Track.fromPoints(coords);
      track.addProperties();

      // 0.11176 meters/sec = 0.25 mph is essentially stationary
      const minSpeedMS = 0.11176;
      const smoother = new NoiseCloudSmoother(track);
      const smoothResults = smoother.smoothNoiseClouds(minSpeedMS, true);

      expect(smoothResults.nodes).toEqual(14);
      expect(smoothResults.clouds).toEqual(2);

      const resultCoords = track.trackPoints();
      expect(resultCoords.length).toEqual(7); // 3 original nodes + 2x2 avg nodes (1 presumed pause, 1 presumed resume, for each cloud)

      // Cloud 1 pause & resume nodes
      expect(resultCoords[1].lat).toEqual(39.87824354718266);
      expect(resultCoords[1].lng).toEqual(-105.13525359285799);
      expect(resultCoords[1].timestamp).toEqual('2023-07-04T20:00:10Z');

      expect(resultCoords[2].lat).toEqual(resultCoords[1].lat);
      expect(resultCoords[2].lng).toEqual(resultCoords[1].lng);
      expect(resultCoords[2].timestamp).toEqual('2023-07-04T20:01:10Z');

      // Cloud 2 pause & resume nodes
      expect(resultCoords[3].lat).toEqual(39.87823893411536);
      expect(resultCoords[3].lng).toEqual(-105.13519123155609);
      expect(resultCoords[3].timestamp).toEqual('2023-07-04T20:01:20Z');

      expect(resultCoords[4].lat).toEqual(resultCoords[3].lat);
      expect(resultCoords[4].lng).toEqual(resultCoords[3].lng);
      expect(resultCoords[4].timestamp).toEqual('2023-07-04T20:02:20Z');
    });
  });
});