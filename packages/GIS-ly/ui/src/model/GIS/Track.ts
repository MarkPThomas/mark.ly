// import { ElevationRequestApi } from '../../elevationDataApi';
import { ElevationRequestApi } from '../../../../server/api/elevationDataApi';

import { Coordinate } from './Coordinate';
import { ISegment, Segment } from '../Geometry/Segment';
import { CoordinateNode, PolyLine } from '../Geometry/PolyLine';
import { BoundingBox } from './BoundingBox';
import { Numbers } from '../../../../../common/utils/math/Numbers';


type EvaluatorArgs = { [name: string]: number };


export class Track extends PolyLine<Coordinate, Segment> {
  // Shortest GPS signal interval is ~30 sec
  protected static GPS_INTERVAL_MIN_SEC = 30;

  constructor(coords: Coordinate[]) {
    super(coords);
  }

  public addProperties() {
    this.addPropertiesToNodes();
  }

  protected addPropertiesToNodes() {
    this.addPropertiesToSegments();

    let coord = this._coords.getHead() as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      this.addNodePropertiesFromPath(coord);

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }


  /**
   * Adds elevation data to the track for matching lat/long points.
   *
   * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
   * form { lat: number, lng: number } as a JSON string.
   * @memberof Track
   */
  public addElevations(elevations: Map<string, number>) {
    this.addNodeElevations(elevations);
    this.addSegmentElevationDataFromNodes();
    this.addNodeElevationSpeedsFromSegments();
  }

  public addElevationProperties() {
    this.addSegmentElevationDataFromNodes();
    this.addNodeElevationSpeedsFromSegments();
  }

  /**
   * Queries an API to add mapped elevation data to the track.
   *
   * @memberof Track
   */
  public addElevationsFromApi() {
    const coords = this._coords.toArray();
    const boundingBox = new BoundingBox(coords);
    console.log(`Getting elevations for ${coords.length} coords`);

    const elevationsApi = new ElevationRequestApi();
    elevationsApi.getElevations(coords, boundingBox)
      // TODO: How does this work with requests 100 at a time?
      .then((result) => {
        if (result.elevations) {
          console.log(`Received elevations for ${result.elevations.size} coords`);
          console.log('Result: ', result);

          this.addElevations(result.elevations);
        } else {
          console.log('No elevations received');
        }
      });
  }

  protected addNodeElevations(elevations: Map<string, number>) {
    console.log('Adding elevations to points...')
    let coord = this._coords.getHead() as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      const elevation = elevations.get(JSON.stringify({ lat: coord.val.lat, lng: coord.val.lng }));
      if (elevation) {
        coord.val.elevation = elevation;
      }

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }

  protected addSegmentElevationDataFromNodes() {
    console.log('Deriving elevation data for segments...')
    let coord = this._coords.getHead()?.next as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<Coordinate, Segment>;
      const prevSegment = prevCoord.nextSeg;

      const elevationChange = Track.calcSegmentMappedElevationChange(prevCoord.val, coord.val);
      if (elevationChange !== undefined) {
        prevSegment.val.height = elevationChange;
        const elevationSpeed = Track.calcSegmentMappedElevationSpeedMPS(prevSegment.val.height, prevSegment.val.duration);
        prevSegment.val.heightRate = elevationSpeed;
      }

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }

  protected addNodeElevationSpeedsFromSegments() {
    console.log('Deriving elevation data for points...')
    let coord = this._coords.getHead() as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      if (coord.val.path) {
        if (this.pointIsMaximaMinima(coord.prevSeg?.val, coord.nextSeg?.val)) {
          if (coord.prevSeg?.val?.heightRate > 0) {
            coord.val.path.ascentRate = coord.prevSeg.val.heightRate
            coord.val.path.descentRate = Math.abs(coord.nextSeg.val.heightRate);
          } else {
            coord.val.path.ascentRate = coord.nextSeg.val.heightRate
            coord.val.path.descentRate = Math.abs(coord.prevSeg.val.heightRate);
          }
        } else {
          const elevationSpeed = Track.calcCoordAvgElevationSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
          if (elevationSpeed !== undefined && elevationSpeed > 0) {
            coord.val.path.ascentRate = elevationSpeed;
          } else if (elevationSpeed !== undefined && elevationSpeed < 0) {
            coord.val.path.descentRate = Math.abs(elevationSpeed);
          }
        }
      }

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }

  protected pointIsMaximaMinima(segI: ISegment, segJ: ISegment): boolean {
    return segI?.heightRate && segJ?.heightRate
      ? Numbers.Sign(segI.heightRate) !== Numbers.Sign(segJ.heightRate)
      : false;
  }

  protected addNodePropertiesFromPath(coord: CoordinateNode<Coordinate, Segment>) {
    coord.val.speedAvg = Track.calcCoordAvgSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
    coord.val.path = {
      rotation: Track.calcPathRotationRad(coord.prevSeg?.val, coord.nextSeg?.val),
      rotationRate: Track.calcPathAngularSpeedRadPerSec(coord.prevSeg?.val, coord.nextSeg?.val),
      ascentRate: 0,
      descentRate: 0
    }
  }

  protected addPropertiesToSegments() {
    let coord = this._coords.getHead()?.next as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<Coordinate, Segment>;
      this.addSegmentProperties(prevCoord, coord);

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }

  protected addSegmentProperties(coordI: CoordinateNode<Coordinate, Segment>, coordJ: CoordinateNode<Coordinate, Segment>) {
    const segment = new Segment();

    segment.length = Track.calcSegmentDistanceMeters(coordI.val, coordJ.val);
    segment.angle = Track.calcSegmentAngleRad(coordI.val, coordJ.val);
    segment.direction = Track.calcSegmentDirection(coordI.val, coordJ.val);
    segment.duration = Track.calcIntervalSec(coordI.val.timeStamp, coordJ.val.timeStamp)
    segment.speed = Track.calcSegmentSpeedMPS(coordI.val, coordJ.val);

    // if (coordI.val.altExt && coordJ.val.altExt) {
    //   segment.elevationChange = Track.calcSegmentElevationChange(coordI.val, coordJ.val);
    //   segment.elevationRate = Track.calcSegmentElevationRateMPS(segment.elevationChange, segment.duration);
    // }

    coordI.nextSeg.val = segment;
  }


  public smoothNoiseClouds(minSpeedMS: number, iterate?: boolean) {
    const minRadiusMeters = minSpeedMS * Track.GPS_INTERVAL_MIN_SEC;

    const totalRemovedNodes: CoordinateNode<Coordinate, Segment>[][] = [];
    let startCoordNode = this._coords.getHead();
    let nextCoordNode = startCoordNode?.next as CoordinateNode<Coordinate, Segment>;
    while (startCoordNode && nextCoordNode) {
      if (this.isInCloud(startCoordNode, nextCoordNode, minRadiusMeters)) {
        const smoothingResults = this.smoothNextNoiseCloud(startCoordNode, nextCoordNode, minRadiusMeters);
        totalRemovedNodes.push(smoothingResults.removedNodes);

        if (iterate) {
          startCoordNode = smoothingResults.nextNode as CoordinateNode<Coordinate, Segment>;
          nextCoordNode = startCoordNode?.next as CoordinateNode<Coordinate, Segment>;
        } else {
          break;
        }
      } else {
        startCoordNode = startCoordNode.next as CoordinateNode<Coordinate, Segment>;
        nextCoordNode = nextCoordNode?.next as CoordinateNode<Coordinate, Segment>;
      }
    }

    return { nodes: totalRemovedNodes.flat().length, clouds: totalRemovedNodes.length };
  }

  protected smoothNextNoiseCloud(
    startCoordNode: CoordinateNode<Coordinate, Segment>,
    nextCoordNode: CoordinateNode<Coordinate, Segment>,
    minRadiusMeters: number) {
    const presumedPauseNode = startCoordNode;

    const removedNodes = [presumedPauseNode];
    let totalLat = presumedPauseNode.val.lat;
    let totalLng = presumedPauseNode.val.lng;
    let prevCoordNode: CoordinateNode<Coordinate, Segment>;
    while (nextCoordNode && this.isInCloud(presumedPauseNode, nextCoordNode, minRadiusMeters)) {
      totalLat += nextCoordNode.val.lat;
      totalLng += nextCoordNode.val.lng;
      removedNodes.push(nextCoordNode);
      prevCoordNode = nextCoordNode;
      nextCoordNode = nextCoordNode.next as CoordinateNode<Coordinate, Segment>;
    }

    const presumedResumeNode = prevCoordNode;
    const averageCoord = new Coordinate(totalLat / removedNodes.length, totalLng / removedNodes.length);

    // Generate new nodes
    const smoothedPauseCoord = averageCoord.clone() as Coordinate;
    (smoothedPauseCoord as Coordinate).timeStamp = presumedPauseNode.val.timeStamp;
    const smoothedPauseNode = new CoordinateNode<Coordinate, Segment>(smoothedPauseCoord);

    const smoothedResumeCoord = averageCoord.clone() as Coordinate;
    (smoothedResumeCoord as Coordinate).timeStamp = presumedResumeNode.val.timeStamp;
    const smoothedResumeNode = new CoordinateNode<Coordinate, Segment>(smoothedResumeCoord);

    // Remove cloud nodes
    const tempHeadNode = removedNodes[0].prev;
    const tempTailNode = removedNodes[removedNodes.length - 1].next;

    this.removeCoords(removedNodes);

    // Connect new nodes
    if (tempHeadNode && tempTailNode) {
      this._coords.insertAfter(tempHeadNode as CoordinateNode<Coordinate, Segment>, smoothedPauseNode);
      this._coords.insertAfter(smoothedPauseNode, smoothedResumeNode);
    } else if (tempHeadNode) {
      // End of track
      this._coords.insertAfter(tempHeadNode as CoordinateNode<Coordinate, Segment>, smoothedPauseNode);
    } else if (tempTailNode) {
      // Start of track
      this._coords.insertBefore(tempTailNode as CoordinateNode<Coordinate, Segment>, smoothedResumeNode);
    } else {
      throw new Error('No head or tail nodes within which to insert replacement cloud nodes!')
    }

    return { removedNodes, nextNode: tempTailNode };
  }

  protected isInCloud(
    startCoord: CoordinateNode<Coordinate, Segment>,
    nextCoord: CoordinateNode<Coordinate, Segment>,
    minRadiusM: number
  ) {
    return startCoord.val.distanceTo(nextCoord.val) < minRadiusM;
  }

  public smoothStationary(minSpeedMS: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth(minSpeedMS, this.isStationary, iterate);
    return nodesSmoothed.length;
  }

  protected isStationary(limit: number, coord: CoordinateNode<Coordinate, Segment>) {
    return coord.val?.speedAvg && coord.val.speedAvg < limit;
  }

  /**
   * Removes coordinates that exceed the specified speed.
   *
   * @param {number} maxSpeedMS Speed in meters/second.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @memberof Track
   */
  public smoothBySpeed(maxSpeedMS: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth(maxSpeedMS, this.isExceedingSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingSpeedLimit(limit: number, coord: CoordinateNode<Coordinate, Segment>) {
    return coord.val?.speedAvg && coord.val.speedAvg > limit;
  }

  /**
   * Removes coordinates that have adjacent segments that rotate beyond the specified rotation rate.
   *
   * @param {number} maxAngSpeedRadS Rotation rate limit in radians/second.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}
   * @memberof Track
   */
  public smoothByAngularSpeed(maxAngSpeedRadS: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth(maxAngSpeedRadS, this.isExceedingAngularSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingAngularSpeedLimit(limit: number, coord: CoordinateNode<Coordinate, Segment>) {
    return coord.val?.path && Math.abs(coord.val.path.rotationRate) > limit;
  }

  /**
   * Removes coordinates that have adjacent segments that gain/lose elevation beyond the specified rate.
   *
   * @protected
   * @param {number} maxAscentRateMPS Elevation gain rate limit in meters/second.
   * @param {number} [maxDescentRateMPS] Elevation loss rate limit in meters/second. If not provided, the gain rate limit will be applied.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}
   * @memberof Track
   */
  public smoothByElevationSpeed(maxAscentRateMPS: number, maxDescentRateMPS?: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth({ maxAscentRateMPS, maxDescentRateMPS }, this.isExceedingElevationSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingElevationSpeedLimit(
    { maxAscentRateMPS, maxDescentRateMPS }: EvaluatorArgs,
    coord: CoordinateNode<Coordinate, Segment>
  ): boolean {
    maxDescentRateMPS = maxDescentRateMPS ?? maxAscentRateMPS;
    if (coord.val?.path) {
      return coord.val.path.ascentRate > maxAscentRateMPS
        || coord.val.path.descentRate > maxDescentRateMPS;
    }

    return false;
  }

  /**
     * Removes nodes based on the target criteria & evaluator function.
     *
     * @protected
     * @param {number} target
     * @param {(target: number, coord: CoordinateNode<Coordinate, Segment>) => boolean} evaluator
     * @param {boolean} [iterate=false] If true, smoothing operation is repeated until no additional coordinates are removed.
     * @return {*}
     * @memberof Track
     */
  protected smooth(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<Coordinate, Segment>) => boolean,
    iterate: boolean = false
  ) {
    let smoothCoordsCurrent;
    let smoothCoords = [];
    do {
      smoothCoordsCurrent = this.getCoords(target, evaluator);
      smoothCoords.push(...smoothCoordsCurrent);
      this.removeCoords(smoothCoordsCurrent);
    } while (iterate && smoothCoordsCurrent.length)

    return smoothCoords;
  }


  protected getCoords(
    target: number | EvaluatorArgs,
    evaluator: (target: number | EvaluatorArgs, coord: CoordinateNode<Coordinate, Segment>) => boolean
  ) {
    const coords: CoordinateNode<Coordinate, Segment>[] = [];

    let coord = this._coords.getHead() as CoordinateNode<Coordinate, Segment>;
    while (coord) {
      if (evaluator(target, coord)) {
        coords.push(coord);
      }

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }

    return coords;
  }


  protected removeCoords(coords: CoordinateNode<Coordinate, Segment>[]) {
    // remove all coords
    coords.forEach((coord) => {
      this._coords.remove(coord);
    })

    // regenerate all segments
    this.buildSegments();
    //    optimize: replace segment
    //     // coord.prevSeg
    //     // coord.nextSeg

    // update segment properties
    this.addProperties();
    //    optimize: update new segment properties and adjacent node properties
  }

  /**
  * Returns the distance between two lat/long points in meters.
  *
  * @protected
  * @param {Coordinate} ptI
  * @param {Coordinate} ptJ
  * @return {*}
  * @memberof Track
  */
  static calcSegmentDistanceMeters(ptI: Coordinate, ptJ: Coordinate) {
    return ptI.distanceTo(ptJ);
  }

  static calcSegmentAngleRad(ptI: Coordinate, ptJ: Coordinate) {
    const latLength = ptI.distanceTo(new Coordinate(ptJ.lat, ptI.lng)) * ((ptJ.lat > ptI.lat) ? 1 : -1);
    const lngLength = ptI.distanceTo(new Coordinate(ptI.lat, ptJ.lng)) * ((ptJ.lng > ptI.lng) ? 1 : -1);


    return lngLength
      ? Math.atan2(latLength, lngLength)
      : latLength > 0 ? Math.PI / 2
        : latLength < 0 ? 3 * Math.PI / 2
          : null;
  }

  static calcSegmentDirection(ptI: Coordinate, ptJ: Coordinate) {
    const deltaLat = ptJ.lat - ptI.lat;
    const lat = deltaLat > 0
      ? 'N'
      : deltaLat < 0
        ? 'S'
        : null;

    const deltaLng = ptJ.lng - ptI.lng;
    const lng = deltaLng > 0
      ? 'E'
      : deltaLng < 0
        ? 'W'
        : null;
    return { lat, lng };
  }

  static calcSegmentMappedElevationChange(ptI: Coordinate, ptJ: Coordinate) {
    return ptJ.elevation && ptI.elevation ? ptJ.elevation - ptI.elevation : undefined;
  }

  static calcSegmentMappedElevationSpeedMPS(elevationChange: number, duration: number) {
    return duration ? elevationChange / duration : Infinity;
  }

  /**
   * Returns a time interval in seconds between two timestamps, or undefined if there is an error.
   *
   * @protected
   * @param {string} timeStampI UTC
   * @param {string} timeStampJ UTC
   * @return {*}
   * @memberof Track
   */
  static calcIntervalSec(timeStampI: string, timeStampJ: string): number | undefined {
    if (!timeStampI && !timeStampJ) {
      // Assumed points providing timestamps do not have timestamps, therefore no time can elapse
      return 0;
    }
    if (!timeStampI || !timeStampJ) {
      // If one point has a timestamp to provide, the other should as well
      return undefined;
    }

    const dateI = new Date(timeStampI);
    const timeI = dateI.getTime();

    const dateJ = new Date(timeStampJ);
    const timeJ = dateJ.getTime();

    return (timeI && timeJ) ? Math.round((timeJ - timeI) / 1000) : undefined;
  }

  /**
   * Returns the speed of a straight-line segment joining two points in meters/second.
   *
   * @protected
   * @param {Coordinate} ptI
   * @param {Coordinate} ptJ
   * @return {*}
   * @memberof Track
   */
  static calcSegmentSpeedMPS(ptI: Coordinate, ptJ: Coordinate) {
    const distanceMeter = Track.calcSegmentDistanceMeters(ptI, ptJ);
    const timeSec = this.calcIntervalSec(ptI.timeStamp, ptJ.timeStamp);

    return timeSec === 0
      ? 0 :
      timeSec ? Math.abs(distanceMeter / timeSec)
        : undefined;
  }

  /**
   * Returns the average speed of two segments in meters/second.
   * If one segment does not have a numerical speed, the valid segment's speed is returned.
   *
   * @protected
   * @param {Segment} segI
   * @param {Segment} segJ
   * @return {*}
   * @memberof Track
   */
  static calcCoordAvgSpeedMPS(segI: ISegment, segJ: ISegment) {
    const speedI = segI?.speed;
    const speedJ = segJ?.speed;

    return (speedI && speedJ)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }


  static calcPathRotationRad(segI: ISegment, segJ: ISegment) {
    return (segJ?.angle === undefined || segJ.angle === null
      || segI?.angle === undefined || segI.angle === null
      || isNaN(segJ.angle - segI.angle)
    )
      ? null
      : segJ.angle - segI.angle;
  }

  static calcPathAngularSpeedRadPerSec(segI: ISegment, segJ: ISegment) {
    const pathRotationRad = this.calcPathRotationRad(segI, segJ);
    const pathDurationSec = (segI?.duration === undefined || segJ?.duration === undefined)
      ? null
      : segI.duration + segJ.duration;

    return (pathRotationRad === null || pathDurationSec === null)
      ? null
      : pathRotationRad / pathDurationSec;
  }

  static calcCoordAvgElevationSpeedMPS(segI: ISegment, segJ: ISegment) {
    const speedI = segI?.heightRate;
    const speedJ = segJ?.heightRate;

    return (speedI !== undefined && speedJ !== undefined)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }
}