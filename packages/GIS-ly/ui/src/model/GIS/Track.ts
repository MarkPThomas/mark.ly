import { Coordinate } from './Coordinate';
import { Segment } from '../Geometry/Segment';
import { CoordinateNode, PolyLine } from '../Geometry/PolyLine';

class Track extends PolyLine<Coordinate> {

  protected addPropertiesToNodes() {
    this.addPropertiesToSegments();

    let coord = this.coords.getHead()?.next as CoordinateNode<Coordinate>;
    while (coord) {
      this.addNodeProperties(coord);

      coord = coord.next as CoordinateNode<Coordinate>;
    }
  }

  protected addNodeProperties(coord: CoordinateNode<Coordinate>) {
    coord.val.speedAvg = this.calcCoordAvgSpeedMPS(coord.prevSeg.val, coord.nextSeg.val);
  }

  protected addPropertiesToSegments() {
    let coord = this.coords.getHead()?.next as CoordinateNode<Coordinate>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<Coordinate>;
      this.addSegmentProperties(prevCoord, coord);

      coord = coord.next as CoordinateNode<Coordinate>;
    }
  }

  protected addSegmentProperties(coordI: CoordinateNode<Coordinate>, coordJ: CoordinateNode<Coordinate>) {
    const segment = new Segment();
    segment.length = this.calcSegmentDistanceMeters(coordI.val, coordJ.val);
    segment.speed = this.calcSegmentSpeedMPS(coordI.val, coordJ.val);

    coordI.nextSeg.val = segment;
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
  protected calcSegmentSpeedMPS(ptI: Coordinate, ptJ: Coordinate) {
    const distanceM = this.calcSegmentDistanceMeters(ptI, ptJ);
    const timeS = this.calcIntervalSec(ptI.timeStamp, ptJ.timeStamp);

    return timeS ? distanceM / timeS : undefined;
  }

  /**
   * Returns the distance between two points in meters.
   *
   * @protected
   * @param {Coordinate} ptI
   * @param {Coordinate} ptJ
   * @return {*}
   * @memberof Track
   */
  protected calcSegmentDistanceMeters(ptI: Coordinate, ptJ: Coordinate) {
    return ptI.distanceTo(ptJ);
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
  protected calcIntervalSec(timeStampI: string, timeStampJ: string): number | undefined {
    const dateI = new Date(timeStampI);
    const timeI = dateI.getTime();

    const dateJ = new Date(timeStampJ);
    const timeJ = dateJ.getTime();

    return (timeI && timeJ) ? Math.round((timeJ - timeI) / 1000) : undefined;
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
  protected calcCoordAvgSpeedMPS(segI: Segment, segJ: Segment) {
    const speedI = segI.speed;
    const speedJ = segJ.speed;

    return (speedI && speedJ)
      ? (speedI + speedJ) / 2
      : speedI ? speedI : speedJ;
  }
}