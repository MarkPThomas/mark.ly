import { Coordinate } from './Coordinate';
import { Segment } from '../Geometry/Segment';
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
    segment.angle = Track.calcSegmentAngleRads(coordI.val, coordJ.val);
    segment.speed = Track.calcSegmentSpeedMPS(coordI.val, coordJ.val);
    segment.direction = Track.calcSegmentDirection(coordI.val, coordJ.val);

    coordI.nextSeg.val = segment;
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

  static calcSegmentAngleRads(ptI: Coordinate, ptJ: Coordinate) {
    const latLength = ptI.distanceTo(new Coordinate(ptJ.lat, ptI.lng)) * ((ptJ.lat > ptI.lat) ? 1 : -1);
    const lngLength = ptI.distanceTo(new Coordinate(ptI.lat, ptJ.lng)) * ((ptJ.lng > ptI.lng) ? 1 : -1);


    return lngLength
      ? Math.atan2(latLength, lngLength)
      // ? Math.atan(latLength / lngLength)
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
  static calcCoordAvgSpeedMPS(segI: Segment, segJ: Segment) {
    const speedI = segI?.speed;
    const speedJ = segJ?.speed;

    return (speedI && speedJ)
      ? (speedI + speedJ) / 2
      : speedI ? speedI
        : speedJ ? speedJ
          : undefined;
  }
}