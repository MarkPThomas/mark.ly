import {
  FeatureCollection,
  Feature,
  FeatureProperty,
  Point,
  LineString,
  MultiLineString,
  GeoJsonGeometryTypes,
  GeoJsonTypes,
  MultiPoint,
  Position
} from '../GeoJSON';

import { TrackPoint } from './Track/TrackPoint';

import {
  getFeatureTimes,
  TrackProperty
} from './Track/TrackProperty';

export interface IGeoJsonManager {
  isSingleTrack: boolean;


  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all {@link Point} GeoJson objects into a list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromPoints(): TrackPoint[];

  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all {@link LineString} GeoJson objects into a list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[][]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromLineStrings(): TrackPoint[][];

  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all {@link MultiLineString} GeoJson objects into a list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[][][]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromMultiLineStrings(): TrackPoint[][][];

  mergeTrackSegments(): void;
}

export class GeoJsonManager implements IGeoJsonManager {
  protected _isSingleTrack: boolean;
  get isSingleTrack(): boolean {
    return this._isSingleTrack;
  }

  protected _geoJson: FeatureCollection;

  constructor(geoJson: FeatureCollection) {
    this._geoJson = geoJson;

    this._isSingleTrack = this.getType();
  }

  protected getType(): boolean {
    const features = this._geoJson.features;
    if (features.length === 1) {
      const type = features[0].geometry.type;
      if (type === GeoJsonTypes.LineString) {
        return true;
      }
    }
    return false;
  }

  getTrackPointsFromPoints() {
    const pointFeature = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.Point);
    const coordinates: TrackPoint[] = [];

    pointFeature.forEach((feature) => {
      const coordinate = GeoJsonManager.PointToTrackPoint(
        feature.geometry as Point,
        getFeatureTimes(feature) as string
      );
      coordinates.push(coordinate);
    });

    return coordinates;
  }

  getTrackPointsFromMultiPoints() {
    const multiPointFeature = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.MultiPoint);
    const multiPointcoordinates: TrackPoint[][] = [];

    multiPointFeature.forEach((feature) => {
      const coordinates: TrackPoint[] = GeoJsonManager.PointsToTrackPoints(
        (feature.geometry as MultiPoint).points,
        getFeatureTimes(feature) as string[]
      );
      multiPointcoordinates.push(coordinates);
    });

    return multiPointcoordinates;
  }

  getTrackPointsFromLineStrings() {
    const lineStringFeatures = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.LineString);
    const lineStringCoordinates: TrackPoint[][] = [];

    lineStringFeatures.forEach((feature) => {
      const coordinates: TrackPoint[] = GeoJsonManager.LineStringToTrackPoints(
        feature.geometry as LineString,
        getFeatureTimes(feature) as string[]
      );
      lineStringCoordinates.push(coordinates);
    });

    return lineStringCoordinates;
  }

  getTrackPointsFromMultiLineStrings() {
    const multiLineStringFeatures = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.MultiLineString);
    const multiLineStringCoordinates: TrackPoint[][][] = [];

    multiLineStringFeatures.forEach((feature) => {
      const multiLineString = feature.geometry as MultiLineString;
      const lineStringCoordinates: TrackPoint[][] = GeoJsonManager.LineStringsToTrackPoints(
        multiLineString?.lineStrings,
        getFeatureTimes(feature) as string[][]
      );
      multiLineStringCoordinates.push(lineStringCoordinates);
    });

    return multiLineStringCoordinates;
  }

  mergeTrackSegments() {
    const multiLineStringFeatures = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.MultiLineString);

    multiLineStringFeatures.map((feature) => {
      const multiLineString = feature.geometry as MultiLineString;

      const lineString = LineString.fromPoints(multiLineString.points.flat(1));

      const timeStamps = (getFeatureTimes(feature) as string[][]).flat(2) as string[];
      const properties = (feature.properties as TrackProperty).fromTimestamps(timeStamps);

      const lineStringFeature = Feature.fromGeometry(lineString, { properties });

      this._geoJson.update(feature, lineStringFeature);
    });

    this._geoJson.save();
  }

  // === Static Methods
  static PointsToPositions(points: Point[]): Position[] {
    const positions: Position[] = points.map((point) => point.toPositions());

    return positions;
  };

  static PositionsToPoints(positions: Position[]): Point[] {
    const points: Point[] = positions.map((position) => Point.fromPosition(position));

    return points;
  };

  static PositionToTrackPoint(position: Position, time: string) {
    return time
      ? TrackPoint.fromPosition({
        position,
        timestamp: time
      })
      : TrackPoint.fromPosition({
        position
      });
  }

  static PositionsToTrackPoints(positions: Position[], times: string[]): TrackPoint[] {
    const coordinates: TrackPoint[] = positions.map(
      (position, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return this.PositionToTrackPoint(position, timesForPoint);
      }
    );

    return coordinates;
  };

  static PointToTrackPoint(point: Point, time: string) {
    return time
      ? TrackPoint.fromPosition({
        position: point.toPositions(),
        timestamp: time
      })
      : TrackPoint.fromPosition({
        position: point.toPositions()
      });
  }

  static PointsToTrackPoints(points: Point[], times: string[]) {
    const coordinates: TrackPoint[] = points.map(
      (point, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return this.PointToTrackPoint(point, timesForPoint);
      }
    );

    // const coordinates: TrackPoint[] = [];

    // points.forEach((point, pointIndex) => {
    //   const timesForPoint = times ? times[pointIndex] : undefined;
    //   const coordinate = this.PointToTrackPoint(point, timesForPoint);
    //   coordinates.push(coordinate);
    // });

    return coordinates;
  }

  static LineStringToTrackPoints(lineString: LineString, times: string[]) {
    return this.PointsToTrackPoints(lineString.points, times);
  }

  static LineStringsToTrackPoints(lineStrings: LineString[], times: string[][]) {
    const lineStringCoordinates: TrackPoint[][] = [];

    lineStrings.forEach((lineString: LineString, lineStringIndex) => {
      const timesForLineString = times ? times[lineStringIndex] : undefined;
      const coordinates: TrackPoint[] = this.LineStringToTrackPoints(
        lineString,
        timesForLineString
      );
      lineStringCoordinates.push(coordinates);
    });

    return lineStringCoordinates;
  }
}