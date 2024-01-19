import { CartesianCoordinate } from "../../math/Coordinates/CartesianCoordinate"
import { Extents } from "./Extents"

export class PointExtents extends Extents<CartesianCoordinate>
{
  // TODO: Consider if PointExtents should be able to have limits applied?

  protected constructor() { super() }

  /**
   * Initializes a `PointExtents` class that bounds 2 points.
   *
   * @static
   * @param {CartesianCoordinate} pointI
   * @param {CartesianCoordinate} pointJ
   * @return {*}
   * @memberof PointExtents
   */
  static fromCornerPoints(pointI: CartesianCoordinate, pointJ: CartesianCoordinate) {
    const extentsBase = new PointExtents();
    extentsBase.fromCornerPoints(pointI, pointJ);
    return extentsBase;
  }

  /**
   * Initializes a `PointExtents` class for a polyline or a shape.
   *
   * @static
   * @param {CartesianCoordinate[]} coordinates
   * @return {*}
   * @memberof PointExtents
   */
  static fromCoordinates(coordinates: CartesianCoordinate[]) {
    const extentsBase = new PointExtents();
    extentsBase.fromCoordinates(coordinates);
    return extentsBase;
  }

  /**
   * Initializes a `PointExtents` class for a polyline or a shape.
   *
   * @static
   * @param {Extents<CartesianCoordinate>} extents
   * @return {*}
   * @memberof PointExtents
   */
  static fromExtents(extents: PointExtents) {
    const extentsBase = new PointExtents();
    extentsBase.fromExtents(extents as Extents<CartesianCoordinate>);
    return extentsBase;
  }

  /**
   * Determines whether the coordinate lies within the extents.
   *
   * @param {CartesianCoordinate} coordinate The coordinate.
   * @return {*}  {boolean} `true` if the specified coordinates are within the extents; otherwise, `false`.
   * @memberof PointExtents
   */
  IsWithinExtents(coordinate: CartesianCoordinate): boolean {
    return ((this.MinX <= coordinate.X && coordinate.X <= this.MaxX) &&
      (this.MinY <= coordinate.Y && coordinate.Y <= this.MaxY));
  }

  /**
   * Returns a rectangle boundary of this instance.
   *
   * @return {*}  {CartesianCoordinate[]}
   * @memberof PointExtents
   */
  Boundary(): CartesianCoordinate[] {
    return [
      new CartesianCoordinate(this.MinX, this.MaxY),
      new CartesianCoordinate(this.MaxX, this.MaxY),
      new CartesianCoordinate(this.MaxX, this.MinY),
      new CartesianCoordinate(this.MinX, this.MinY),
    ];
  }

  /**
   * Gets the geometric center.
   *
   * @return {*}  {CartesianCoordinate}
   * @memberof PointExtents
   */
  GeometricCenter(): CartesianCoordinate {
    return new CartesianCoordinate(this.MinX + this.Width / 2, this.MinY + this.Height / 2);
  }

  /**
   * Translates points that define the extents.
   *
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   * @return {*}  {PointExtents}
   * @memberof PointExtents
   */
  Translate(x: number, y: number): PointExtents {
    const coordinateTranslation: CartesianCoordinate = new CartesianCoordinate(x, y);

    const coordinates: CartesianCoordinate[] = this.Boundary();
    for (let i = 0; i < coordinates.length; i++) {
      coordinates[i] = coordinateTranslation.addTo(coordinates[i]);
    }

    return PointExtents.fromCoordinates(coordinates);
  }

  /**
   * Rotates points that define the extents.
   *
   * @param {number} angleRadians The angle [radians] to rotate by.
   * @return {*}  {Extents<CartesianCoordinate>}
   * @memberof PointExtents
   */
  Rotate(angleRadians: number): Extents<CartesianCoordinate> {
    const geometricCenter = this.GeometricCenter();
    const boundary = this.Boundary();
    for (let i = 0; i < boundary.length; i++) {
      boundary[i] = CartesianCoordinate.RotateAboutPoint(boundary[i], geometricCenter, angleRadians);
    }

    return PointExtents.fromCoordinates(boundary);
  }

  protected addCoordinate(coordinate: CartesianCoordinate) {
    if (coordinate.Y > this.MaxY) {
      this._maxY = Math.min(coordinate.Y, this._maxYLimit);
    }
    if (coordinate.Y < this.MinY) {
      this._minY = Math.max(coordinate.Y, this._minYLimit);
    }

    if (coordinate.X > this.MaxX) {
      this._maxX = Math.min(coordinate.X, this._maxXLimit);
    }
    if (coordinate.X < this.MinX) {
      this._minX = Math.max(coordinate.X, this._minXLimit);
    }
  }

  Clone(): PointExtents {
    return PointExtents.fromExtents(this);
  }
}