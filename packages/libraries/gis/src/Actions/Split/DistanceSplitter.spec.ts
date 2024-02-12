import {
  LineString,
  Position
} from 'geojson';

import { FeatureCollection } from '../../../../geojson/src';

import { FeatureCollectionSerial } from '../../types';

import {
  Track,
  TrackPoint
} from "../../Core/Track";

import { DistanceSplitter } from "./DistanceSplitter";

describe('##DistanceSplitter', () => {
  // describe('#splitByMaxDistance', () => {
  //   it('should do nothing to a track that has no triggering distance', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 59 min from stop, 3 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DistanceSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(0);
  //     expect(splitResult.segments.length).toEqual(0);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(4);
  //     expect(track.trackPoints().length).toEqual(4);
  //   });

  //   it('should trim the start of a track that has only one Point', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T21:01:00Z'), // Resume 1 hr, 1 min min from start, 6 min from end
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'),
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:07:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(3);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should trim the start of a track based on a long enough stop between movement that is close enough to the start of the activity', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should trim the end of a track that has only one Point', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'),
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start, 1 hr, 1 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:04:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);   // 4
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(3);
  //     expect(track.trackPoints().length).toEqual(3); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should trim the end of a track based on a long enough stop between movement that is close enough to the end of the activity', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'), // Resume 1 hr, 1 min from stop, 1 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should return no tracks when both ends are trimmed and middle section is the triggering segment', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:03:00Z'), // Resume  1 hr, 1 min from start, 1 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:04:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(0);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should trim ends by the Splitter default if not specified in function call', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:04:00Z'), // Stop 4 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:05:00Z'), // Resume 1 hr, 1 min from stop, 6 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:11:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     // minEdgeTimes default = 300 sec = 5 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should trim ends by the Splitter overwrite upon initialization if not specified in function call', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:01:00Z'), // Stop 1 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:02:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:05:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track, minMoveDurationS);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(1);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should split a track based on a long enough stop between movement', () => {
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T20:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T20:03:00Z'), // Stop 3 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T21:04:00Z'), // Resume 1 hr, 1 min from stop, 3 min from end
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T21:07:00Z')
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMoveDurationS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMoveDurationS);

  //     expect(splitResult.points.length).toEqual(2);
  //     expect(splitResult.segments.length).toEqual(1);
  //     expect(splitResult.tracks.length).toEqual(2);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(splitResult.tracks[1].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });

  //   it('should split a track at multiple points based on a long enough stop between movement', () => {
  //     // Trim both ends, 1 middle, keep 2 mid points = 10
  //     const coords = [
  //       new TrackPoint(-8.9428362309, -77.7104663163, 0, '2023-07-04T19:00:00Z'),
  //       new TrackPoint(-8.9438362309, -77.7114663163, 0, '2023-07-04T19:01:00Z'), // Stop 1 min from start
  //       new TrackPoint(-8.9446145296, -77.7118207421, 0, '2023-07-04T20:02:00Z'), // Resume 1 hr, 1 min from stop. Trim to here
  //       new TrackPoint(-8.947042761, -77.7136469014, 0, '2023-07-04T20:05:00Z'),  // Stop after 3 min
  //       new TrackPoint(-8.948042761, -77.7136469014, 0, '2023-07-04T21:06:00Z'),  // Resume 1 hr, 1 min from stop
  //       new TrackPoint(-8.949042761, -77.7136469014, 0, '2023-07-04T21:07:00Z'),  // Stop after 1 min. Drop this segment
  //       new TrackPoint(-8.950042761, -77.7136469014, 0, '2023-07-04T22:08:00Z'),  // Resume 1 hr, 1 min from stop
  //       new TrackPoint(-8.957042761, -77.7136469014, 0, '2023-07-04T22:11:00Z'),  // Stop after 3 min. Trim from here
  //       new TrackPoint(-8.958042761, -77.7136469014, 0, '2023-07-04T23:12:00Z'),  // Resume 1 hr, 1 min from stop, 1 min from end
  //       new TrackPoint(-8.959042761, -77.7136469014, 0, '2023-07-04T23:13:00Z'),
  //     ];

  //     const track = Track.fromPoints(coords);
  //     track.addProperties();

  //     const minMovementTimesS = 120; // 2 min
  //     const maxStopDurationS = 3600; // 1 hr
  //     const splitter = new DurationSplitter(track);
  //     const splitResult = splitter.splitByMaxDuration(maxStopDurationS, minMovementTimesS);

  //     expect(splitResult.points.length).toEqual(8);
  //     expect(splitResult.segments.length).toEqual(4);
  //     expect(splitResult.tracks.length).toEqual(2);
  //     expect(splitResult.tracks[0].trackPoints().length).toEqual(2);
  //     expect(splitResult.tracks[1].trackPoints().length).toEqual(2);
  //     expect(track.trackPoints().length).toEqual(2); // track is modified & is the first returned track or dropped track
  //   });
  // });
  // vs.
  const createNewFeatureCollection = (): FeatureCollectionSerial => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [

          ]
        },
        properties: {}
      }
    ],
  });

  const featureCollectionFromPositions = (coordinates: Position[], timestamps: string[]) => {
    const featureCollection = createNewFeatureCollection();
    (featureCollection.features[0].geometry as LineString).coordinates = coordinates;
    featureCollection.features[0].properties = {
      _gpxType: '',
      name: '',
      time: '',
      coordinateProperties: {
        times: timestamps
      }
    }
    return featureCollection;
  }

  const getDistanceSplitter = (data: {
    positions: Position[],
    times: string[]
  }) => {
    const coordinates: Position[] = data.positions;
    const timestamps: string[] = data.times;
    const featureCollection = featureCollectionFromPositions(coordinates, timestamps);
    const track = Track.fromGeoJson(FeatureCollection.fromJson(featureCollection));

    const distanceSplitter = new DistanceSplitter(track);

    return distanceSplitter;
  }

  const dataPositions = {
    splitStart: [
      [-105.0127698013641, 39.73175292386382, 0],
      [-105.0004457547322, 39.73029041395932, 0],
      [-105.010960150138, 39.7368136595752, 0],
      [-105.0056388622745, 39.73937239233006, 0],
      [-104.9946388969436, 39.758014755451, 0], // Keep here to end
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9947462379639, 39.76200765811915, 0],
      [-104.9835169989596, 39.76426030962995, 0],
      [-104.9929538279561, 39.76773804641108, 0]
    ],
    splitEnd: [
      [-104.9929538279561, 39.76773804641108, 0],
      [-104.9835169989596, 39.76426030962995, 0],
      [-104.9947462379639, 39.76200765811915, 0],
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9946388969436, 39.758014755451, 0], // Keep here to beginning
      [-105.010960150138, 39.7368136595752, 0],
      [-105.0004457547322, 39.73029041395932, 0],
      [-105.0127698013641, 39.73175292386382, 0],
      [-105.0056388622745, 39.73937239233006, 0]
    ],
    splitStartEnd: [
      [-105.0127698013641, 39.73175292386382, 0],
      [-105.0004457547322, 39.73029041395932, 0],
      [-105.010960150138, 39.7368136595752, 0],
      [-105.0056388622745, 39.73937239233006, 0],
      [-104.9946388969436, 39.758014755451, 0],   // Keep here down
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9952285611948, 39.76239797577348, 0],
      [-104.9890656660424, 39.76884536977788, 0],
      [-104.9835169989596, 39.76426030962995, 0], // Keep here up
      [-104.9834658623495, 39.74039697244989, 0],
      [-104.9779998528178, 39.73801589241057, 0],
      [-104.9826590934965, 39.73617516945873, 0]
    ],
    splitInto4Segments: [
      [-105.0127698013641, 39.73175292386382, 0], // First trim segment
      [-105.0004457547322, 39.73029041395932, 0],
      [-105.010960150138, 39.7368136595752, 0],
      [-105.0056388622745, 39.73937239233006, 0],
      [-104.9946388969436, 39.758014755451, 0],   // Keep here down
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9944023239115, 39.76189285634545, 0],
      [-104.9907607643185, 39.76673722483862, 0],
      [-104.9835169989596, 39.76426030962995, 0], // Keep here up
      [-104.9829721298797, 39.74002704198475, 0],
      [-104.9884738932551, 39.74007471717409, 0],
      [-104.9839514624485, 39.73698380300784, 0],
      [-104.9810711477942, 39.73725624205192, 0],
      [-104.9804000292142, 39.73351810260323, 0],// End of competing segment
      [-105.0047565810937, 39.73616096865927, 0],
      [-105.0127698013641, 39.73175292386382, 0] // Last trim segment
    ],
    splitNone: [
      [-104.9946388969436, 39.758014755451, 0],
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9949490224107, 39.76209110858792, 0],
      [-104.9903491883622, 39.7665365866026, 0],
      [-104.9835169989596, 39.76426030962995, 0]
    ]
  }

  const dataTimes = {
    splitStart: [
      '1',
      '2',
      '3',
      '4',
      '5', // Keep here to end
      '6',
      '7',
      '8',
      '9'
    ],
    splitEnd: [
      '1',
      '2',
      '3',
      '4',
      '5', // Keep here to beginning
      '6',
      '7',
      '8',
      '9'
    ],
    splitStartEnd: [
      '1',
      '2',
      '3',
      '4',
      '5',   // Keep here down
      '6',
      '7',
      '8',
      '9', // Keep here up
      '10',
      '11',
      '12'
    ],
    splitInto4Segments: [
      '1', // First trim segment
      '2',
      '3',
      '4',
      '5',   // Keep here down
      '6',
      '7',
      '8',
      '9', // Keep here up
      '10',
      '11',
      '12',
      '13',
      '14',// End of competing segment
      '15',
      '16' // Last trim segment
    ],
    splitNone: [
      '1',
      '2',
      '3',
      '4',
      '5',
    ]
  }

  const data = {
    splitStart: {
      positions: dataPositions.splitStart,
      times: dataTimes.splitStart
    },
    splitEnd: {
      positions: dataPositions.splitEnd,
      times: dataTimes.splitEnd
    },
    splitStartEnd: {
      positions: dataPositions.splitStartEnd,
      times: dataTimes.splitStartEnd
    },
    splitInto4Segments: {
      positions: dataPositions.splitInto4Segments,
      times: dataTimes.splitInto4Segments
    },
    splitNone: {
      positions: dataPositions.splitNone,
      times: dataTimes.splitNone
    }
  }

  describe('#splitByMaxDistance', () => {
    it('should do nothing to an empty track', () => {
      const track = Track.fromPoints([]);
      track.addProperties();

      const triggerDistanceM = 2000;
      const splitter = new DistanceSplitter(track);
      const splitResult = splitter.splitByMaxDistance(triggerDistanceM);

      expect(splitResult.points.length).toEqual(0);
      expect(splitResult.segments.length).toEqual(0);
      expect(splitResult.tracks.length).toEqual(0);
      expect(track.trackPoints().length).toEqual(0);
    });

    it('should do nothing for a track that does not trigger splitting', () => {
      const distanceSplitter = getDistanceSplitter(data.splitNone);

      const triggerDistanceM = 2000;
      const tracksSplit = distanceSplitter.splitByMaxDistance(triggerDistanceM);

      expect(tracksSplit.tracks.length).toEqual(1);
      expect(tracksSplit.tracks[0].trackPoints().length).toEqual(5);
    });

    it('should split at the last portion of a track when triggered', () => {
      const distanceSplitter = getDistanceSplitter(data.splitStart);

      const triggerDistanceM = 2000;
      const tracksSplit = distanceSplitter.splitByMaxDistance(triggerDistanceM);

      expect(tracksSplit.tracks.length).toEqual(2);
      expect(tracksSplit.tracks[0].trackPoints().length).toEqual(4);
      expect(tracksSplit.tracks[1].trackPoints().length).toEqual(5);
    });

    it('should split at the first portion of a track when triggered', () => {
      const distanceSplitter = getDistanceSplitter(data.splitEnd);

      const triggerDistanceM = 2000;
      const tracksSplit = distanceSplitter.splitByMaxDistance(triggerDistanceM);

      expect(tracksSplit.tracks.length).toEqual(2);
      expect(tracksSplit.tracks[0].trackPoints().length).toEqual(5);
      expect(tracksSplit.tracks[1].trackPoints().length).toEqual(4);
    });

    it('should split at the first & last portions', () => {
      const distanceSplitter = getDistanceSplitter(data.splitStartEnd);

      const triggerDistanceM = 2000;
      const tracksSplit = distanceSplitter.splitByMaxDistance(triggerDistanceM);

      expect(tracksSplit.tracks.length).toEqual(3);
      expect(tracksSplit.tracks[0].trackPoints().length).toEqual(4);
      expect(tracksSplit.tracks[1].trackPoints().length).toEqual(5);
      expect(tracksSplit.tracks[2].trackPoints().length).toEqual(3);
    });

    it('should split into 4 segments after splitting multiple segments', () => {
      const distanceSplitter = getDistanceSplitter(data.splitInto4Segments);

      const triggerDistanceM = 2000;
      const tracksSplit = distanceSplitter.splitByMaxDistance(triggerDistanceM);

      expect(tracksSplit.tracks.length).toEqual(4);
      expect(tracksSplit.tracks[0].trackPoints().length).toEqual(4);
      expect(tracksSplit.tracks[1].trackPoints().length).toEqual(5);
      expect(tracksSplit.tracks[2].trackPoints().length).toEqual(5);
      expect(tracksSplit.tracks[3].trackPoints().length).toEqual(2);
    });
  });
});