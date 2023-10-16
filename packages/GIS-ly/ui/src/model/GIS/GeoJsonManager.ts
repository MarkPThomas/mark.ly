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

import { RoutePoint } from './Route';

import {
  Track,
  TrackPoint,
  getFeatureTimes,
  TrackProperty,
  ITrackPropertyProperties
} from './Track';

export interface IGeoJsonManager {
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

  TrackFromGeoJson(): Track | null {
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

          // const trackProperty = feature.properties as TrackProperty;
          // const properties = trackProperty.fromTimestamps(timestamps);
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
  static PointsToPositions(points: Point[]): Position[] {
    const positions: Position[] = points.map((point) => point.toPositions());

    return positions;
  };


  static PositionsToPoints(positions: Position[]): Point[] {
    const points: Point[] = positions.map((position) => Point.fromPosition(position));

    return points;
  };

  static PositionToRoutePoint(position: Position) {
    return RoutePoint.fromPosition(position);
  }

  static PositionsToRoutePoints(positions: Position[]): RoutePoint[] {
    const coordinates: RoutePoint[] = positions.map(
      (position) => GeoJsonManager.PositionToRoutePoint(position)
    );

    return coordinates;
  };

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

  static PositionsToTrackPoints(positions: Position[], times: string[]): TrackPoint[] {
    const coordinates: TrackPoint[] = positions.map(
      (position, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return GeoJsonManager.PositionToTrackPoint(position, timesForPoint);
      }
    );

    return coordinates;
  };


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

  static PointsToTrackPoints(points: Point[], times: string[]) {
    const coordinates: TrackPoint[] = points.map(
      (point, index) => {
        const timesForPoint = times ? times[index] : undefined;
        return GeoJsonManager.PointToTrackPoint(point, timesForPoint);
      }
    );

    return coordinates;
  }


  static LineStringToTrackPoints(lineString: LineString, times: string[]) {
    return GeoJsonManager.PointsToTrackPoints(lineString.points, times);
  }

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

  static LineStringFromTrackPoints(trkPts: TrackPoint[]): LineString {
    const points: Point[] = [];
    trkPts.forEach((trkPt) => {
      points.push(trkPt.toPoint());
    })

    const geometry = LineString.fromPoints(points);

    return geometry;
  }

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


  static FeatureCollectionFromTrackPoints(trkPts: TrackPoint[]): FeatureCollection {
    const lineStringFeature = GeoJsonManager.LineStringFeatureFromTrackPoints(trkPts);

    const featureCollection = FeatureCollection.fromFeatures([lineStringFeature]);

    return featureCollection;
  }
}