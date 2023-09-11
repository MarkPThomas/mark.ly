import {
  LineString,
  Position
} from 'geojson';

import { FeatureCollectionSerial } from '../types';

import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";

import { CruftManager } from "./CruftManager";
import { FeatureCollection } from '../../GeoJSON';

describe('##CruftManager', () => {
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

  const getCruftManager = (data: {
    positions: Position[],
    times: string[]
  }) => {
    const coordinates: Position[] = data.positions;
    const timestamps: string[] = data.times;
    const featureCollection = featureCollectionFromPositions(coordinates, timestamps);
    const track = Track.fromGeoJson(FeatureCollection.fromJson(featureCollection));
    const cruftManager = new CruftManager(track);

    return cruftManager;
  }

  const dataPositions = {
    cruftStart: [
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
    cruftEnd: [
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
    cruftStartEnd: [
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
    cruftKeep2ndOf4: [
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
    cruftNone: [
      [-104.9946388969436, 39.758014755451, 0],
      [-104.9854983786352, 39.75819785322535, 0],
      [-104.9949490224107, 39.76209110858792, 0],
      [-104.9903491883622, 39.7665365866026, 0],
      [-104.9835169989596, 39.76426030962995, 0]
    ]
  }

  const dataTimes = {
    cruftStart: [
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
    cruftEnd: [
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
    cruftStartEnd: [
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
    cruftKeep2ndOf4: [
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
    cruftNone: [
      '1',
      '2',
      '3',
      '4',
      '5',
    ]
  }

  const data = {
    cruftStart: {
      positions: dataPositions.cruftStart,
      times: dataTimes.cruftStart
    },
    cruftEnd: {
      positions: dataPositions.cruftEnd,
      times: dataTimes.cruftEnd
    },
    cruftStartEnd: {
      positions: dataPositions.cruftStartEnd,
      times: dataTimes.cruftStartEnd
    },
    cruftKeep2ndOf4: {
      positions: dataPositions.cruftKeep2ndOf4,
      times: dataTimes.cruftKeep2ndOf4
    },
    cruftNone: {
      positions: dataPositions.cruftNone,
      times: dataTimes.cruftNone
    }
  }

  describe('#getTrackSegmentsByCruft', () => {
    it('should clip the first portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStart);

      const { segments, segmentKeep } = cruftManager.getTrackSegmentsByCruft(2);

      expect(segments.length).toEqual(2);
      expect(segmentKeep.startTime).toEqual('5');
      expect(segmentKeep.endTime).toEqual('9');
    });

    it('should clip the last portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftEnd);

      const { segments, segmentKeep } = cruftManager.getTrackSegmentsByCruft(2);

      expect(segments.length).toEqual(2);
      expect(segmentKeep.startTime).toEqual('1');
      expect(segmentKeep.endTime).toEqual('5');
    });

    it('should clip the first & last portions of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStartEnd);

      const { segments, segmentKeep } = cruftManager.getTrackSegmentsByCruft(2);

      expect(segments.length).toEqual(3);
      expect(segmentKeep.startTime).toEqual('5');
      expect(segmentKeep.endTime).toEqual('9');
    });

    it('should keep the 2nd of 4 segments after clipping multiple segments', () => {
      const cruftManager = getCruftManager(data.cruftKeep2ndOf4);

      const { segments, segmentKeep } = cruftManager.getTrackSegmentsByCruft(2);

      expect(segments.length).toEqual(4);
      expect(segmentKeep.startTime).toEqual('5');
      expect(segmentKeep.endTime).toEqual('9');
    });

    it('should do nothing to a track that does not trigger clipping', () => {
      const cruftManager = getCruftManager(data.cruftNone);

      const { segments, segmentKeep } = cruftManager.getTrackSegmentsByCruft(2);

      expect(segments.length).toEqual(1);
      expect(segmentKeep.startTime).toEqual('1');
      expect(segmentKeep.endTime).toEqual('5');
    });
  });

  describe('#splitTrackSegmentByCruft', () => {
    it('should split to keep the last portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStart);

      const tracks = cruftManager.splitTrackSegmentByCruft(2);

      expect(tracks.length).toEqual(2);
      expect(tracks[0].trackPoints.length).toEqual(4);
      expect(tracks[1].trackPoints.length).toEqual(5);
    });

    it('should split to keep the first portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftEnd);

      const tracks = cruftManager.splitTrackSegmentByCruft(2);

      expect(tracks.length).toEqual(2);
      expect(tracks[0].trackPoints.length).toEqual(5);
      expect(tracks[1].trackPoints.length).toEqual(4);
    });

    it('should split at the first & last portions to keep the middle of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStartEnd);

      const tracks = cruftManager.splitTrackSegmentByCruft(2);

      expect(tracks.length).toEqual(3);
      expect(tracks[0].trackPoints.length).toEqual(4);
      expect(tracks[1].trackPoints.length).toEqual(5);
      expect(tracks[2].trackPoints.length).toEqual(3);
    });

    it('should split to keep the 2nd of 4 segments after clipping multiple segments', () => {
      const cruftManager = getCruftManager(data.cruftKeep2ndOf4);

      const tracks = cruftManager.splitTrackSegmentByCruft(2);

      expect(tracks.length).toEqual(4);
      expect(tracks[0].trackPoints.length).toEqual(4);
      expect(tracks[1].trackPoints.length).toEqual(5); // Kept in tie
      expect(tracks[2].trackPoints.length).toEqual(5);
      expect(tracks[3].trackPoints.length).toEqual(2);
    });

    it('should return the track segment unchanged for a track that does not trigger clipping', () => {
      const cruftManager = getCruftManager(data.cruftNone);

      const tracks = cruftManager.splitTrackSegmentByCruft(2);

      expect(tracks.length).toEqual(1);
      expect(tracks[0].trackPoints.length).toEqual(5);
    });
  });

  describe('#clipTrackSegmentByCruft', () => {
    it('should clip the first portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStart);

      const clippedTrack = cruftManager.clipTrackSegmentByCruft(2);

      expect(clippedTrack.trackPoints.length).toEqual(5);
    });

    it('should clip the last portion of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftEnd);

      const clippedTrack = cruftManager.clipTrackSegmentByCruft(2);

      expect(clippedTrack.trackPoints.length).toEqual(5);
    });

    it('should clip the first & last portions of a track when triggered', () => {
      const cruftManager = getCruftManager(data.cruftStartEnd);

      const clippedTrack = cruftManager.clipTrackSegmentByCruft(2);

      expect(clippedTrack.trackPoints.length).toEqual(5);
    });

    it('should keep the 2nd of 4 segments after clipping multiple segments', () => {
      const cruftManager = getCruftManager(data.cruftKeep2ndOf4);

      const clippedTrack = cruftManager.clipTrackSegmentByCruft(2);

      expect(clippedTrack.trackPoints.length).toEqual(5);
    });

    it('should do nothing to a track that does not trigger clipping', () => {
      const cruftManager = getCruftManager(data.cruftNone);

      const clippedTrack = cruftManager.clipTrackSegmentByCruft(2);

      expect(clippedTrack.trackPoints.length).toEqual(5);
    });
  });
});