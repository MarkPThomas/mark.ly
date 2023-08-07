import { Coordinate } from './Coordinate';
import { ISegment, Segment } from '../Geometry/Segment';
import { CoordinateNode, PolyLine } from '../Geometry/PolyLine';

export class Track extends PolyLine<Coordinate, Segment> {

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
      this.addNodeProperties(coord);

      coord = coord.next as CoordinateNode<Coordinate, Segment>;
    }
  }

  protected addNodeProperties(coord: CoordinateNode<Coordinate, Segment>) {
    coord.val.speedAvg = Track.calcCoordAvgSpeedMPS(coord.prevSeg?.val, coord.nextSeg?.val);
    coord.val.path = {
      rotation: Track.calcPathRotationRad(coord.prevSeg?.val, coord.nextSeg?.val),
      angularSpeed: Track.calcPathAngularSpeedRadPerSec(coord.prevSeg?.val, coord.nextSeg?.val)
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

    coordI.nextSeg.val = segment;
  }


  /**
   * Removes coordinates that exceed the specified speed.
   *
   * @param {number} speedLimitMS Speed in meters/second.
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @memberof Track
   */
  public smoothBySpeed(speedLimitMS: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth(speedLimitMS, this.isExceedingSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingSpeedLimit(limit: number, coord: CoordinateNode<Coordinate, Segment>) {
    return coord.val?.speedAvg && coord.val.speedAvg > limit;
  }

  /**
   * Removes coordinates that have adjacent segments that rotate beyond the specified rotation rate.
   *
   * @param {number} speedLimitRadS Rotation rate limit  in radians/second
   * @param {boolean} [iterate] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}
   * @memberof Track
   */
  public smoothByAngularSpeed(speedLimitRadS: number, iterate?: boolean) {
    const nodesSmoothed = this.smooth(speedLimitRadS, this.isExceedingAngularSpeedLimit, iterate);
    return nodesSmoothed.length;
  }

  protected isExceedingAngularSpeedLimit(limit: number, coord: CoordinateNode<Coordinate, Segment>) {
    return coord.val?.path && Math.abs(coord.val.path.angularSpeed) > limit;
  }

  /**
   *
   *
   * @protected
   * @param {number} target
   * @param {(target: number, coord: CoordinateNode<Coordinate, Segment>) => boolean} evaluator
   * @param {boolean} [iterate=false] If true, smoothing operation is repeated until no additional coordinates are removed.
   * @return {*}
   * @memberof Track
   */
  protected smooth(
    target: number,
    evaluator: (target: number, coord: CoordinateNode<Coordinate, Segment>) => boolean,
    iterate: boolean = false
  ) {
    let smoothCoordsCurrent;
    let smoothCoords = [];
    do {
      smoothCoordsCurrent = this.getCoords(target, evaluator);
      smoothCoords.push(...smoothCoordsCurrent);
      // console.log('smoothCoordsCurrent: ', smoothCoordsCurrent.length);
      this.removeCoords(smoothCoordsCurrent);
    } while (iterate && smoothCoordsCurrent.length)

    return smoothCoords;
  }

  protected getCoords(
    target: number,
    evaluator: (target: number, coord: CoordinateNode<Coordinate, Segment>) => boolean
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
}