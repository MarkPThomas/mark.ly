import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";
import { ITimeRange } from "../Time/TimeRange";
import config from '../../../config';
import { TrackSegment } from "../Track/TrackSegment";
import { VertexNode } from "../../Geometry";


export interface ICruftManager {
  track: Track;

  getTrackRangesByCruft(triggerDistanceKM: number): {
    segments: ITimeRange[];
    segmentKeep: ITimeRange;
  };
  trimTrackByCruft(triggerDistanceKM: number): number;
  // splitTrackSegmentByCruft(triggerDistanceKM: number): Track[];
}

export class CruftManager implements ICruftManager {
  private _totalSize: number = 0;
  private _maxSize: number = 0;

  private _track: Track;
  get track() {
    return this._track;
  }

  constructor(track: Track) {
    this._track = track;
  }

  getTrackRangesByCruft(
    triggerDistanceKM: number = config.trackCriteria.cruft.pointSeparationLimit
  ): {
    segments: ITimeRange[];
    segmentKeep: ITimeRange;
  } {
    const triggerDistanceMeters = triggerDistanceKM * 1000;
    const coordinates = this._track.trackPoints() as TrackPoint[];
    let point = this._track.firstPoint;

    this._maxSize = 0;
    this._totalSize = 0;

    const segments: ITimeRange[] = [];
    let segmentKeep: ITimeRange;
    let segment: ITimeRange = {
      startTime: point.val.timestamp,
      endTime: null
    };

    const updateSegmentKeep = (segmentCheck: ITimeRange, coordCount: number) => {
      segments.push(segmentCheck);

      if (coordCount > this._maxSize) {
        segmentKeep = segmentCheck;
        this._maxSize = coordCount;
      }
    }

    let coordCount = 0;
    while (point.next) {
      coordCount++;
      if (point.val.distanceTo(point.next.val) >= triggerDistanceMeters) {
        segment.endTime = point.val.timestamp;

        updateSegmentKeep(segment, coordCount);
        this._totalSize += coordCount;
        coordCount = 0;

        segment = {
          startTime: point.next.val.timestamp,
          endTime: null
        };
      }

      point = point.next as VertexNode<TrackPoint, TrackSegment>;
    }

    coordCount++;
    segment.endTime = coordinates[coordinates.length - 1].timestamp;
    updateSegmentKeep(segment, coordCount);
    this._totalSize += coordCount;

    return { segments, segmentKeep };
  }

  trimTrackByCruft(triggerDistanceKM: number = config.trackCriteria.cruft.pointSeparationLimit): number {
    const { segments, segmentKeep } = this.getTrackRangesByCruft(triggerDistanceKM);

    if (segments.length > 1) {
      this._track.trimToRange(segmentKeep);
    };

    return this._totalSize - this._maxSize;
  }

  // splitTrackSegmentByCruft(triggerDistanceKM: number = config.CRUFT_TRIGGER_DISTANCE_KM): Track[] {
  //   const { segments } = this.getTrackSegmentsByCruft(triggerDistanceKM);
  //   if (segments.length === 1) {
  //     return [this._track.clone()];
  //   }

  //   const tracks: Track[] = [];
  //   segments.forEach((segment) => {
  //     const track = this._track.splitToSegment(segment);
  //     if (track) {
  //       tracks.push(track);
  //     }
  //   });

  //   return tracks.length ? tracks : [this._track.clone()];
  // }
}



// export function getTrackSegmentsByCruft(
//   geoJson: FeatureCollection,
//   triggerDistanceKM: number = 5
// ) {
//   const triggerDistanceMeters = triggerDistanceKM * 1000;
//   const coordinates = getCoords(geoJson) as TrackPoint[];

//   let maxSize = 0;

//   const segments: SegmentLimits[] = [];
//   let segmentKeep: SegmentLimits;
//   let segment: SegmentLimits = {
//     startCoord: coordinates[0],
//     endCoord: null
//   };

//   const updateSegmentKeep = (segmentCheck: SegmentLimits) => {
//     segments.push(segmentCheck);

//     const priorSegmentSize = segmentCheck.endCoord.indices.coordIndex - segmentCheck.startCoord.indices.coordIndex + 1;
//     // TODO: Add future weights to BB diagonal length as well in case noise cloud on clipped end
//     if (priorSegmentSize > maxSize) {
//       segmentKeep = segmentCheck;
//       maxSize = priorSegmentSize;
//     }
//   }

//   for (let i = 1; i < coordinates.length; i++) {
//     if (coordinates[i].distanceTo(coordinates[i - 1]) >= triggerDistanceMeters) {
//       segment.endCoord = coordinates[i - 1];
//       updateSegmentKeep(segment);

//       segment = {
//         startCoord: coordinates[i],
//         endCoord: null
//       };
//     }
//   }
//   segment.endCoord = coordinates[coordinates.length - 1];
//   updateSegmentKeep(segment);

//   return { segments, segmentKeep };
// }

// export function splitTrackSegmentByCruft(
//   geoJson: GeoJSONFeatureCollection,
//   triggerDistanceKM: number = 5
// ) {
//   const { segments } = getTrackSegmentsByCruft(geoJson, triggerDistanceKM);
//   if (segments.length === 1) {
//     return [geoJson];
//   }

//   const tracks: GeoJSONFeatureCollection[] = [];
//   segments.forEach((segment) => {
//     const track = splitTrackSegment(geoJson, segment);
//     if (track) {
//       tracks.push(track);
//     }
//   });

//   return tracks.length ? tracks : [geoJson];
// }

// export function clipTrackSegmentByCruft(
//   geoJson: GeoJSONFeatureCollection,
//   triggerDistanceKM: number = 5
// ) {
//   const { segments, segmentKeep } = getTrackSegmentsByCruft(geoJson, triggerDistanceKM);

//   return segments.length === 1 ? geoJson : splitTrackSegment(geoJson, segmentKeep);
// }