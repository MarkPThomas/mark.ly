import {
  FeatureCollection as SerialFeatureCollection,
  Geometry as SerialGeometry
} from "geojson";

import { ICloneable, IEquatable } from '../../../../../../../common/interfaces';

import {
  FeatureCollection,
  Feature,
  Point,
  LineString,
  BBoxState
} from '../../../GeoJSON';


import { TrackSegmentData } from './TrackSegment';
import { ITimeRange } from '../Time/TimeRange';

import {
  ITrackPropertyProperties,
  TrackProperty
} from './TrackProperty';
import { TrackPoint } from './TrackPoint';
import { GeoJsonManager } from '../GeoJsonManager';
import { BoundingBox } from '../BoundingBox';

export interface IGeoJsonTrack
  extends
  ICloneable<GeoJsonTrack>,
  IEquatable<GeoJsonTrack> {

  trackMetaData: IBaseTrackProperty;

  boundingBox(): BoundingBox;

  trackPoints(): TrackPoint[];

  toFeatureCollection(): FeatureCollection;

  updateFromTrackPoints(
    trackPoints: TrackPoint[],
    geoJson?: FeatureCollection
  ): FeatureCollection;

  /**
   * Updates the geoJson data in the manager, or the provided geoJson object.
   *
   * @param {TrackSegmentData} segData {@link Point}s and corresponding timestamps to update.
   * @param {FeatureCollection} [geoJson] If provided, is updated. Otherwise, the geoJSon contained in the manager is updated.
   * @return {*}  {FeatureCollection}
   * @memberof IGeoJsonTrackManager
   */
  updateFromTrackSegData(
    segData: TrackSegmentData,
    geoJson?: FeatureCollection
  ): FeatureCollection;

  /**
   * Generates a new geoJson object with the data provided.
   *
   * @param {TrackSegmentData} segData
   * @return {*}  {FeatureCollection}
   * @memberof IGeoJsonTrackManager
   */
  copyBySegmentData(segData: TrackSegmentData): FeatureCollection;

  toJson(includeBBox: BBoxState): SerialFeatureCollection<SerialGeometry, { [name: string]: any; }>;
}

interface IBaseTrackProperty {
  _gpxType: string;
  name: string;
  time: string;
}

export class GeoJsonTrack implements IGeoJsonTrack {
  protected _geoJson: FeatureCollection;

  protected _baseTrackProperty: IBaseTrackProperty;
  get trackMetaData(): IBaseTrackProperty {
    return { ...this._baseTrackProperty };
  }

  toJson(includeBBox: BBoxState = BBoxState.IncludeIfPresent): SerialFeatureCollection<SerialGeometry, { [name: string]: any; }> {
    return this._geoJson.toJson(includeBBox);
  }

  boundingBox(): BoundingBox {
    return BoundingBox.fromBoundingBox(this._geoJson.bbox());
  }


  constructor(geoJson: FeatureCollection, name?: string) {
    this._geoJson = geoJson;

    this.setBaseTrackPropertyFromJson(name);
  }

  clone(): GeoJsonTrack {
    return new GeoJsonTrack(this._geoJson.clone());
  }

  equals(track: GeoJsonTrack): boolean {
    return JSON.stringify(this._baseTrackProperty) === JSON.stringify(track._baseTrackProperty)
      && this._geoJson.equals(track._geoJson);
  }

  toFeatureCollection(): FeatureCollection {
    return this._geoJson.clone();
  }

  trackPoints(): TrackPoint[] {
    const { segPoints, segTimestamps } = this.getTrackCoordData();
    const trackPoints: TrackPoint[] = [];

    segPoints.forEach((point, pointIndex) => {
      const timestamp = segTimestamps[pointIndex];
      const trkPt = TrackPoint.fromPointInTime({ point, timestamp });
      trackPoints.push(trkPt);
    });

    return trackPoints;
  }

  updateFromTrackPoints(
    trackPoints: TrackPoint[],
    geoJson?: FeatureCollection
  ): FeatureCollection {
    geoJson = geoJson ?? this._geoJson;

    const lineString = GeoJsonManager.LineStringFromTrackPoints(trackPoints);
    const timestamps = trackPoints.map((trackPoint => trackPoint.timestamp));

    this.update(lineString, timestamps, geoJson);
    return geoJson;
  }

  updateFromTrackSegData(
    segData: TrackSegmentData,
    geoJson?: FeatureCollection
  ): FeatureCollection {
    geoJson = geoJson ?? this._geoJson;

    if (segData.segPoints.length) {
      const lineString = LineString.fromPoints(segData.segPoints);

      this.update(lineString, segData.segTimestamps, geoJson);
    }
    return geoJson;
  }

  /**
   * Updates the geometry and properties on the provided geoJSON.
   *
   * @protected
   * @param {LineString} lineString
   * @param {string[]} timestamps
   * @param {FeatureCollection} geoJson
   * @memberof GeoJsonTrack
   */
  protected update(
    lineString: LineString,
    timestamps: string[],
    geoJson: FeatureCollection) {

    const propertiesJson: ITrackPropertyProperties = {
      ...this._baseTrackProperty,
      coordinateProperties: {
        times: timestamps
      }
    }
    const properties = TrackProperty.fromJson(propertiesJson);
    const updatedFeature = Feature.fromGeometry(lineString, { properties });

    geoJson.update(geoJson.features[0], updatedFeature);
    geoJson.save();
  }

  copyBySegmentData(segData: TrackSegmentData): FeatureCollection {
    const geoJsonClone = this._geoJson.clone();
    return this.updateFromTrackSegData(segData, geoJsonClone);
  }


  protected setBaseTrackPropertyFromJson(name?: string) {
    const properties = TrackProperty.fromJson(this.getFeature().properties as unknown as ITrackPropertyProperties);
    if (!this.baseTrackPropertiesSet()) {
      if (!properties.time) {
        const firstTime = [properties.coordinateProperties?.times[0]].flat(10)[0];
        properties.time = firstTime;
      }

      if (!properties.name) {
        properties.name = name ? name : `Track: ${properties.time}`;
      }

      this.setBaseTrackProperty(properties);
    }
  }

  protected baseTrackPropertiesSet(): boolean {
    return !!(this._baseTrackProperty);
  }

  protected setBaseTrackProperty(property: TrackProperty) {
    this._baseTrackProperty = {
      _gpxType: property._gpxType,
      name: property.name,
      time: property.time
    }
  }

  protected getTrackCoordDataWithTimestamp(timestamp: string) {
    const { segPoints, segTimestamps } = this.getTrackCoordData();
    const timestampIndex = this.getTimestampIndex(timestamp, segTimestamps);

    return {
      points: segPoints,
      timestamps: segTimestamps,
      timestampIndex
    }
  }

  protected getTimestampIndex(timestamp: string, timestamps: string[]): number {
    return timestamps.indexOf(timestamp);
  }

  protected getTrackCoordData(): TrackSegmentData {
    return {
      segPoints: this.getPoints(),
      segTimestamps: this.getTimestamps()
    }
  }

  /**
   * Returns a reference to the Point coordinates.
   *
   * @protected
   * @return {*}  {Point[]}
   * @memberof GeoJsonTrack
   */
  protected getPoints(): Point[] {
    const feature = this.getFeature();
    return (feature.geometry as LineString).points;
  }

  /**
   * Returns a reference to the Timestamp list.
   *
   * @protected
   * @return {*}  {string[]}
   * @memberof GeoJsonTrack
   */
  protected getTimestamps(): string[] {
    const feature = this.getFeature();
    return (feature.properties as TrackProperty).coordinateProperties.times as string[];
  }

  /**
   * Returns a reference to the feature.
   *
   * @protected
   * @return {*}
   * @memberof GeoJsonTrack
   */
  protected getFeature(): Feature {
    return this._geoJson.features[0];
  }


  // === IQuery
  getSegmentBeforeTime(timestamp: string): TrackSegmentData {
    const { points, timestamps, timestampIndex } = this.getTrackCoordDataWithTimestamp(timestamp);

    if (timestampIndex) {
      const segPoints = points.slice(0, timestampIndex + 1);
      const segTimestamps: string[] = timestamps.slice(0, timestampIndex + 1);

      return { segPoints, segTimestamps };
    }
    return { segPoints: [], segTimestamps: [] };
  }

  getSegmentAfterTime(timestamp: string): TrackSegmentData {
    const { points, timestamps, timestampIndex } = this.getTrackCoordDataWithTimestamp(timestamp);

    if (timestampIndex) {
      const segPoints = points.slice(timestampIndex);
      const segTimestamps: string[] = timestamps.slice(timestampIndex);

      return { segPoints, segTimestamps };
    }
    return { segPoints: [], segTimestamps: [] };
  }

  getSegmentBetweenTimes(timestampStart: string, timestampEnd: string): TrackSegmentData {
    const { segPoints: points, segTimestamps: timestamps } = this.getTrackCoordData();
    const indexStart = this.getTimestampIndex(timestampStart, timestamps);
    const indexEnd = this.getTimestampIndex(timestampEnd, timestamps);

    if (indexStart && indexEnd) {
      const segPoints = points.slice(indexStart, indexEnd + 1);
      const segTimestamps: string[] = timestamps.slice(indexStart, indexEnd + 1);

      return { segPoints, segTimestamps };
    }
    return { segPoints: [], segTimestamps: [] };
  }

  getSegmentsSplitByTimes(timestampsSplit: string[]): TrackSegmentData[] {
    const segmentsData: TrackSegmentData[] = [];

    let { segPoints: trackPoints, segTimestamps: timestamps } = this.getTrackCoordData();
    timestampsSplit.forEach((timestamp) => {
      const index = this.getTimestampIndex(timestamp, timestamps);

      if (index && index < trackPoints.length - 1) {
        const segPoints = trackPoints.slice(0, index + 1);
        const segTimestamps = timestamps.slice(0, index + 1);
        if (segPoints.length && segTimestamps.length) {
          segmentsData.push({ segPoints, segTimestamps });
          trackPoints = trackPoints.slice(index);
          timestamps = timestamps.slice(index);
        }
      }
    });

    if (trackPoints.length) {
      segmentsData.push({
        segPoints: trackPoints,
        segTimestamps: timestamps
      });
    }

    return segmentsData;
  }


  // === IClippable
  trimBeforeTime(timestamp: string) {
    const segmentData = this.getSegmentBeforeTime(timestamp);

    return this.updateFromTrackSegData(segmentData);
  }

  trimAfterTime(timestamp: string) {
    const segmentData = this.getSegmentAfterTime(timestamp);

    return this.updateFromTrackSegData(segmentData);
  }

  trimToTimes(timestampStart: string, timestampEnd: string) {
    const segmentData = this.getSegmentBetweenTimes(timestampStart, timestampEnd);

    return this.updateFromTrackSegData(segmentData);
  }


  // === ISplittable
  splitByTimes(timestampsSplit: string[]): FeatureCollection[] {
    const tracks: FeatureCollection[] = [];

    const segmentsData = this.getSegmentsSplitByTimes(timestampsSplit);
    if (segmentsData.length === 1) {
      return [];
    }

    segmentsData.forEach((segmentData) => {
      tracks.push(this.copyBySegmentData(segmentData));
    });

    return this.trimSingleNodeSegments(tracks);
  }

  /**
   * Removes any tracks from the collection that consist of a single {@link Point}.
   *
   * @protected
   * @param {FeatureCollection[]} tracks
   * @return {*}
   * @memberof GeoJsonTrackManager
   */
  protected trimSingleNodeSegments(tracks: FeatureCollection[]): FeatureCollection[] {
    const trimmedTracks: FeatureCollection[] = [];

    tracks.forEach((track) => {
      if ((track.features[0].geometry as LineString).points.length > 1) {
        trimmedTracks.push(track);
      }
    });

    return trimmedTracks;
  }

  splitToSegment(segment: ITimeRange): FeatureCollection | undefined {
    const splitSegments = this.splitByTimes([segment.startTime, segment.endTime]);

    return this.trimSingleNodeSegments(
      this.addSplittingSegment(segment, splitSegments)
    )[0];
  }

  /**
   * Adds split segment from the collection to the provided Track list,
   * or returns a new list with the split segment as the sole item if found.
   *
   * @protected
   * @param {ITimeRange} segment
   * @param {FeatureCollection[]} splitSegments
   * @return {*}
   * @memberof GeoJsonTrackManager
   */
  protected addSplittingSegment(
    segment: ITimeRange,
    splitSegments: FeatureCollection[]
  ): FeatureCollection[] {
    const tracks: FeatureCollection[] = [];
    for (const splitSegment of splitSegments) {
      const property = (splitSegment.features[0].properties as TrackProperty);
      const times = property.coordinateProperties.times as string[];

      if (this.isTargetSplitSegment(times, segment)) {
        tracks.push(splitSegment);
      }
    }
    return tracks;
  }

  protected trimSingleSegmentSegments(tracks: FeatureCollection[]): FeatureCollection[] {
    const trimmedTracks: FeatureCollection[] = [];

    tracks.forEach((track) => {
      if ((track.features[0].geometry as LineString).points.length > 2) {
        trimmedTracks.push(track);
      }
    });

    return trimmedTracks;
  }


  splitBySegments(segmentLimits: ITimeRange[]): FeatureCollection[] {
    const splitTimes = [];
    for (const segment of segmentLimits) {
      splitTimes.push(segment.startTime);
      splitTimes.push(segment.endTime);
    }

    const splitSegments = this.splitByTimes(splitTimes);

    const tracks: FeatureCollection[] = this.addSplittedSegments(segmentLimits, splitSegments);

    const finalTracks = this.trimSingleSegmentSegments(tracks);

    return finalTracks.length ? finalTracks : [this._geoJson.clone()];
  }

  /**
   * Returns a reduced list of split segments that does not contain the segments defined in the segment limits.
   *
   * @protected
   * @param {ITimeRange[]} segmentLimits
   * @param {FeatureCollection[]} splitSegments
   * @return {*}  {FeatureCollection[]}
   * @memberof GeoJsonTrack
   */
  protected addSplittedSegments(
    segmentLimits: ITimeRange[],
    splitSegments: FeatureCollection[]
  ): FeatureCollection[] {
    const tracks: FeatureCollection[] = [];
    let segmentLimitIndex = 0;
    let splitSegmentIndex = 0;
    while (segmentLimitIndex < segmentLimits.length
      && splitSegmentIndex < splitSegments.length) {

      const splitSegment = splitSegments[splitSegmentIndex];
      const property = (splitSegment.features[0].properties as TrackProperty);
      const times = property.coordinateProperties.times as string[];

      const segmentLimit = segmentLimits[segmentLimitIndex];
      if (segmentLimit.endTime < times[0]) {
        segmentLimitIndex++;
      } else if (times[times.length - 1] < segmentLimit.startTime) {
        splitSegmentIndex++;
      } else {
        if (this.isTargetSplitSegment(times, segmentLimit)) {
          segmentLimitIndex++;
        } else {
          tracks.push(splitSegment);
        }
        splitSegmentIndex++;
      }
    }
    // At most, 1 remaining segment after last splitting interval
    if (splitSegmentIndex < splitSegments.length) {
      tracks.push(splitSegments[splitSegmentIndex]);
    }

    return tracks;
  }

  /**
   * Splits from start time, assuming end time is in segment:
   *
   * i.e. Splits by start time to end of segment or track, whichever occurs first.
   *
   * Else splits from start of track to end time.
   *
   * @protected
   * @param {string[]} times
   * @param {ITimeRange} segment
   * @return {*}  {boolean}
   * @memberof GeoJsonTrackManager
   */
  protected isTargetSplitSegment(times: string[], segment: ITimeRange): boolean {
    return (times[0] === segment.startTime
      || times[times.length] === segment.endTime);
  }
}