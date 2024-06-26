import { FeatureCollection as SerialFeatureCollection } from 'geojson';

import {
  FeatureCollection,
  Feature,
  FeatureProperty,
  GeoJsonGeometryTypes,
  GeoJsonTypes,
  Position
} from '@markpthomas/geojson';

import {
  Point,
  LineString,
  MultiLineString,
  MultiPoint,
} from '@markpthomas/geojson/geometries';

import { RoutePoint } from './Route/index';

import {
  Track,
  TrackPoint,
  getFeatureTimes,
  TrackProperty,
  ITrackPropertyProperties
} from './Track/index';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @interface IGeoJsonManager
 * @typedef {IGeoJsonManager}
 */
export interface IGeoJsonManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {boolean}
 */
  isSingleTrack: boolean;


  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all
   * {@link Point} GeoJson objects into a list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromPoints(): TrackPoint[];

  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all
   * {@link LineString} GeoJson objects into a nested list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[][]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromLineStrings(): TrackPoint[][];

  /**
   * Combines {@link Point} and {@link FeatureProperty} data from all
   * {@link MultiLineString} GeoJson objects into a nested list of {@link TrackPoint}s.
   *
   * @return {*}  {TrackPoint[][][]}
   * @memberof IGeoJsonTrackManager
   */
  getTrackPointsFromMultiLineStrings(): TrackPoint[][][];

  /**
   * Merges any {@link MultiLineString} to change the GeoJson object into a {@link LineString}.
   *
   * @memberof IGeoJsonManager
   */
  mergeTrackLineStrings(): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @class GeoJsonManager
 * @typedef {GeoJsonManager}
 * @implements {IGeoJsonManager}
 */
export class GeoJsonManager implements IGeoJsonManager {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @protected
 * @type {boolean}
 */
  protected _isSingleTrack: boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @readonly
 * @type {boolean}
 */
  get isSingleTrack(): boolean {
    return this._isSingleTrack;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @protected
 * @type {FeatureCollection}
 */
  protected _geoJson: FeatureCollection;

  /**
 * Creates an instance of GeoJsonManager.
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @constructor
 * @param {FeatureCollection} geoJson
 */
  constructor(geoJson: FeatureCollection) {
    this._geoJson = geoJson;

    this._isSingleTrack = this.getType();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {SerialFeatureCollection} json
 * @returns {(Track | null)}
 */
  static TrackFromJson(json: SerialFeatureCollection): Track | null {
    const featureCollection = FeatureCollection.fromJson(json);
    const geoJsonMngr = new GeoJsonManager(featureCollection);

    return geoJsonMngr.toTrack();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @returns {(Track | null)}
 */
  toTrack(): Track | null {
    if (this._geoJson?.features) {
      let type = this._geoJson.features[0].geometry.type;

      // TODO: Determine if this should be automatically merged,
      //    or just return an array of tracks, one for each line as a LineString
      if (type === GeoJsonTypes.MultiLineString) {
        this.mergeTrackLineStrings();
        // TODO: Consider making type a dynamic property that updates whenenver a modifying function is called.
        type = this._geoJson.features[0].geometry.type;
      }

      if (type === GeoJsonTypes.LineString) {
        return Track.fromGeoJson(this._geoJson);
      }
    }
    return null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @protected
 * @returns {boolean}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @returns {{}\}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @returns {{}\}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @returns {{}\}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @returns {{}\}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  mergeRouteLineStrings() {
    const multiLineStringFeatures = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.MultiLineString);

    if (multiLineStringFeatures.length) {
      multiLineStringFeatures.forEach((feature) => {
        const multiLineString = feature.geometry as MultiLineString;

        const lineString = LineString.fromPoints(multiLineString.points.flat(1));

        const lineStringFeature = Feature.fromGeometry(lineString);

        this._geoJson.update(feature, lineStringFeature);
      });

      this._geoJson.save();
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  mergeTrackLineStrings() {
    const multiLineStringFeatures = this._geoJson.getFeaturesByType(GeoJsonGeometryTypes.MultiLineString);

    if (multiLineStringFeatures.length) {
      multiLineStringFeatures.forEach((feature) => {
        const multiLineString = feature.geometry as MultiLineString;

        const lineString = LineString.fromPoints(multiLineString.points.flat(1));

        let lineStringFeature: Feature;
        const featureTimes = getFeatureTimes(feature) as string[][];
        if (featureTimes) {
          const timestamps = featureTimes.flat(2) as string[];
          const json: ITrackPropertyProperties = {
            _gpxType: feature.properties._gpxType,
            name: feature.properties.name,
            time: feature.properties.time,
            coordinateProperties: {
              times: timestamps
            }
          };

          const properties = TrackProperty.fromJson(json);

          lineStringFeature = Feature.fromGeometry(lineString, { properties });
        } else {
          lineStringFeature = Feature.fromGeometry(lineString);
        }

        this._geoJson.update(feature, lineStringFeature);
      });

      this._geoJson.save();
    }
  }

  // === Static Methods
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Point[]} points
 * @returns {Position[]}
 */
  static PointsToPositions(points: Point[]): Position[] {
    const positions: Position[] = points.map((point) => point.toPositions());

    return positions;
  }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  ;


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Position[]} positions
 * @returns {Point[]}
 */
  static PositionsToPoints(positions: Position[]): Point[] {
    const points: Point[] = positions.map((position) => Point.fromPosition(position));

    return points;
  }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  ;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Position} position
 * @returns {*}
 */
  static PositionToRoutePoint(position: Position) {
    return RoutePoint.fromPosition(position);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Position[]} positions
 * @returns {RoutePoint[]}
 */
  static PositionsToRoutePoints(positions: Position[]): RoutePoint[] {
    const coordinates: RoutePoint[] = positions.map(
      (position) => GeoJsonManager.PositionToRoutePoint(position)
    );

    return coordinates;
  }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  ;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Position} position
 * @param {string} time
 * @returns {*}
 */
  static PositionToTrackPoint(position: Position, time: string) {
    return time
      ? TrackPoint.fromPositionInTime({
        position,
        timestamp: time
      })
      : TrackPoint.fromPositionInTime({
        position
      });
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Position[]} positions
 * @param {string[]} times
 * @returns {TrackPoint[]}
 */
  static PositionsToTrackPoints(positions: Position[], times: string[]): TrackPoint[] {
    const coordinates: TrackPoint[] = positions.map(
      (position, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return GeoJsonManager.PositionToTrackPoint(position, timesForPoint);
      }
    );

    return coordinates;
  }/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 */
  ;


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Point} point
 * @param {string} time
 * @returns {*}
 */
  static PointToTrackPoint(point: Point, time: string) {
    return time
      ? TrackPoint.fromPositionInTime({
        position: point.toPositions(),
        timestamp: time
      })
      : TrackPoint.fromPositionInTime({
        position: point.toPositions()
      });
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {Point[]} points
 * @param {string[]} times
 * @returns {{}\}
 */
  static PointsToTrackPoints(points: Point[], times: string[]) {
    const coordinates: TrackPoint[] = points.map(
      (point, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return GeoJsonManager.PointToTrackPoint(point, timesForPoint);
      }
    );

    return coordinates;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {LineString} lineString
 * @param {string[]} times
 * @returns {{}\}
 */
  static LineStringToTrackPoints(lineString: LineString, times: string[]) {
    return GeoJsonManager.PointsToTrackPoints(lineString.points, times);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {LineString[]} lineStrings
 * @param {string[][]} times
 * @returns {{}\}
 */
  static LineStringsToTrackPoints(lineStrings: LineString[], times: string[][]) {
    const lineStringCoordinates: TrackPoint[][] = [];

    lineStrings.forEach((lineString: LineString, lineStringIndex) => {
      const timesForLineString = times ? times[lineStringIndex] : undefined;
      const coordinates: TrackPoint[] = GeoJsonManager.LineStringToTrackPoints(
        lineString,
        timesForLineString
      );
      lineStringCoordinates.push(coordinates);
    });

    return lineStringCoordinates;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {TrackPoint[]} trkPts
 * @returns {LineString}
 */
  static LineStringFromTrackPoints(trkPts: TrackPoint[]): LineString {
    const points: Point[] = [];
    trkPts.forEach((trkPt) => {
      points.push(trkPt.toPoint());
    })

    const geometry = LineString.fromPoints(points);

    return geometry;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {TrackPoint[]} trkPts
 * @returns {Feature}
 */
  static LineStringFeatureFromTrackPoints(trkPts: TrackPoint[]): Feature {
    const points: Point[] = [];
    const times: string[] = [];
    trkPts.forEach((trkPt) => {
      points.push(trkPt.toPoint());
      times.push(trkPt.timestamp);
    })

    const propertiesJson = {
      _gpxType: 'trk',
      name: times[0],
      time: times[0],
      coordinateProperties: {
        times: times
      }
    }

    const geometry = LineString.fromPoints(points);
    const properties = TrackProperty.fromJson(propertiesJson);

    const feature = Feature.fromGeometry(geometry, { properties });

    return feature;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @static
 * @param {TrackPoint[]} trkPts
 * @returns {FeatureCollection}
 */
  static FeatureCollectionFromTrackPoints(trkPts: TrackPoint[]): FeatureCollection {
    const lineStringFeature = GeoJsonManager.LineStringFeatureFromTrackPoints(trkPts);

    const featureCollection = FeatureCollection.fromFeatures([lineStringFeature]);

    return featureCollection;
  }
}