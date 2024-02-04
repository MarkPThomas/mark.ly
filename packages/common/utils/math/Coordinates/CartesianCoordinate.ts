import { DivideByZeroException } from "../../../errors/exceptions";
import { IEquatable } from "../../../interfaces";
import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { Cartesian2DPolarConverter } from "../CoordinateConverters/Cartesian2DPolarConverter";
import { LinearCurve } from "../Curves/LinearCurve";
import { Generics } from "../Generics";
import { Numbers } from "../Numbers";
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';
import { VectorLibrary } from "../Vectors/VectorLibrary";
import { Angle } from "./Angle";
import { CartesianOffset } from "./CartesianOffset";
import { ICoordinate } from "./ICoordinate";
import { PolarCoordinate } from "./PolarCoordinate";

export interface ICartesianJson {
  /**
   * The x-coordinate.
   *
   * @type {number}
   * @memberof ICartesianCoordinate
   */
  x: number

  /**
   * The y-coordinate.
   *
   * @type {number}
   * @memberof ICartesianCoordinate
   */
  y: number
}

export interface ICartesianData {
  /**
  * The x-coordinate.
  *
  * @type {number}
  * @memberof ICartesianCoordinate
  */
  X: number

  /**
   * The y-coordinate.
   *
   * @type {number}
   * @memberof ICartesianCoordinate
   */
  Y: number
}

/**
 * The interface for a coordinate in a two-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 *
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 *
 * @export
 * @interface ICartesianCoordinate
 * @implements {IEquatable<CartesianCoordinate>}
 * @implements {ICoordinate}
 */
export interface ICartesianCoordinate extends ICoordinate, ICartesianData {
}

/**
 * Coordinate in a two-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 *
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 *
 * @export
 * @class CartesianCoordinate
 * @implements {ICartesianCoordinate}
 */
export class CartesianCoordinate implements ICartesianCoordinate, IEquatable<CartesianCoordinate> {
  Tolerance: number;

  readonly X: number;

  readonly Y: number;

  // ==== Creation
  /**
   * Creates an instance of CartesianCoordinate.
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @memberof CartesianCoordinate
   */
  constructor(
    x: number = 0,
    y: number = 0,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.X = x;
    this.Y = y;
    this.Tolerance = tolerance;
  }

  /**
   * Initializes a new instance of the CartesianCoordinate at the origin.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static atOrigin(): CartesianCoordinate {
    return CartesianCoordinate.fromXY(0, 0);
  }

  /**
   * Initializes a new instance with JSON.
   * @param {ICartesianJson} json JSON representation of the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static fromJson(
    json: ICartesianJson,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    return CartesianCoordinate.fromXY(json.x, json.y, tolerance);
  }

  /**
    * Initializes a new instance with a data object.
    * @param {ICartesianData} data Minimum data for the coordinate.
    * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
    * @returns {CartesianCoordinate} CartesianCoordinate.
    */
  static fromData(
    data: ICartesianData,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    return CartesianCoordinate.fromXY(data.X, data.Y, tolerance);
  }

  /**
   * Creates an instance of CartesianCoordinate.
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @memberof CartesianCoordinate
   */
  static fromXY(
    x: number,
    y: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    return new CartesianCoordinate(x, y, tolerance);
  }

  /// <summary>
  /// Returns a new coordinate offset from the provided coordinate.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="center">The center.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  static fromCoordinateOffset(
    center: CartesianCoordinate,
    distance: number,
    rotation: Angle
  ): CartesianCoordinate {
    let x = center.X + distance * Trig.Cos(rotation.Radians);
    if (Numbers.IsZeroSign(x, center.Tolerance)) {
      x = 0;
    }

    let y = center.Y + distance * Trig.Sin(rotation.Radians);
    if (Numbers.IsZeroSign(y, center.Tolerance)) {
      y = 0;
    }

    return CartesianCoordinate.fromXY(x, y, center.Tolerance);
  }

  /// <summary>
  /// Returns a new coordinate offset by the provided parameters.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  offsetCoordinate(distance: number, rotation: Angle): CartesianCoordinate {
    return CartesianCoordinate.fromCoordinateOffset(this, distance, rotation);
  }

  // ==== I/0
  toString(): string {
    return `${CartesianCoordinate.name} - X: ${this.X}, Y: ${this.Y}`;
  }

  toData(): ICartesianData {
    return {
      X: this.X,
      Y: this.Y
    }
  }

  toJson(): ICartesianJson {
    return {
      x: this.X,
      y: this.Y
    }
  }

  // ==== Conversion
  /**
   * Converts the cartesian coordinate to a polar coordinate.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  toPolar(): PolarCoordinate {
    return Cartesian2DPolarConverter.toPolar(this);
  }

  // === Comparison
  /**
   * Indicates whether the current object is equal to another object.
   * @param {CartesianCoordinate | ICartesianData | ICoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: CartesianCoordinate | ICartesianData | ICoordinate): boolean {
    if (other instanceof CartesianCoordinate) {
      const tolerance = Math.min(this.Tolerance, other.Tolerance);
      return (
        Numbers.AreEqual(this.X, other.X, tolerance) &&
        Numbers.AreEqual(this.Y, other.Y, tolerance));
    } else if (other instanceof PolarCoordinate) {
      return this.equals(Cartesian2DPolarConverter.toCartesian(other));
    }

    return false;
  }

  // ==== Methods

  /// <summary>
  /// Returns the cartesian offset of the current coordinate from the provided coordinate.
  /// i.e. the current coordinate subtracting the provided coordinate.
  /// </summary>
  /// <param name="coordinateI">The coordinate i.</param>
  /// <returns>AngularOffset.</returns>
  offsetFrom(coordinateI: CartesianCoordinate): CartesianOffset {
    return CartesianOffset.fromCoordinates(coordinateI, this);
  }

  /// <summary>
  /// Returns the cross product/determinant of the coordinates.
  /// x1*y2 - x2*y1
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  crossProduct(coordinate: CartesianCoordinate): number {
    return VectorLibrary.CrossProduct(this.X, this.Y, coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the dot product of the coordinates.
  /// x1*x2 + y1*y2
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  dotProduct(coordinate: CartesianCoordinate): number {
    return VectorLibrary.DotProduct(this.X, this.Y, coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// The linear distance the coordinate is from the origin.
  /// </summary>
  /// <returns>System.Double.</returns>
  distanceFromOrigin(): number {
    return AlgebraLibrary.SRSS(this.X, this.Y);
  }



  // #region === Methods: Static / ITransform ===

  /// <summary>
  /// Rotates the the specified coordinate by the specified angle about a point.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="centerOfRotation">The center of rotation.</param>
  /// <param name="angleRadians">The angle [radians], where counter-clockwise is positive.</param>
  /// <returns>MPT.Math.Coordinates.CartesianCoordinate.</returns>
  static RotateAboutPoint(
    coordinate: CartesianCoordinate,
    centerOfRotation: CartesianCoordinate,
    angleRadians: number
  ): CartesianCoordinate {
    // Move coordinate such that center of rotation is at origin
    const centeredCoordinate = coordinate.subtractOffset(coordinate.subtractBy(centerOfRotation));

    // Rotate coordinate
    const rotatedCoordinate = CartesianCoordinate.RotateAboutOrigin(centeredCoordinate, angleRadians);

    // Move coordinate such that center of rotation is back at original coordinate
    return rotatedCoordinate.addTo(centerOfRotation);
  }

  /// <summary>
  /// Rotates the specified coordinate by the specifed angle about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="angleRadians">The angle [radians], where counter-clockwise is positive.</param>
  /// <returns>MPT.Math.Coordinates.CartesianCoordinate.</returns>
  static RotateAboutOrigin(
    coordinate: CartesianCoordinate,
    angleRadians: number
  ): CartesianCoordinate {
    const xRotated = coordinate.X * Trig.Cos(angleRadians) - coordinate.Y * Trig.Sin(angleRadians);
    const yRotated = coordinate.X * Trig.Sin(angleRadians) + coordinate.Y * Trig.Cos(angleRadians);

    return new CartesianCoordinate(xRotated, yRotated);
  }

  /// <summary>
  /// Scales the specified coordinate from the specified point.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="referencePoint">The reference point.</param>
  /// <param name="scale">The scale.</param>
  /// <returns>CartesianCoordinate.</returns>
  static ScaleFromPoint(
    coordinate: CartesianCoordinate,
    referencePoint: CartesianCoordinate,
    scale: number
  ): CartesianCoordinate {
    // Move coordinate such that reference point is at origin
    const centeredCoordinate = coordinate.subtractOffset(coordinate.subtractBy(referencePoint));

    // Scale coordinate
    const rotatedCoordinate = CartesianCoordinate.ScaleFromOrigin(centeredCoordinate, scale);

    // Move coordinate such that reference point is back at original coordinate
    return rotatedCoordinate.addTo(referencePoint);
  }

  /// <summary>
  /// Scales the specified coordinate about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="scale">The scale.</param>
  /// <returns>CartesianCoordinate.</returns>
  static ScaleFromOrigin(
    coordinate: CartesianCoordinate,
    scale: number): CartesianCoordinate {
    return coordinate.multiplyBy(scale);
  }

  /// <summary>
  /// Skews the specified coordinate to the skewing of a containing box.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
  /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>CartesianCoordinate.</returns>
  static SkewWithinBox(
    coordinate: CartesianCoordinate,
    stationaryReferencePoint: CartesianCoordinate,
    skewingReferencePoint: CartesianCoordinate,
    magnitude: CartesianOffset
  ): CartesianCoordinate {
    const skewBoxOffset = skewingReferencePoint.offsetFrom(stationaryReferencePoint);
    const lambdaX = magnitude.X / skewBoxOffset.Y;
    const lambdaY = magnitude.Y / skewBoxOffset.X;

    return CartesianCoordinate.SkewAboutOrigin(coordinate, lambdaX, lambdaY);
  }

  /// <summary>
  /// Skews the specified coordinate about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="lambda">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>CartesianCoordinate.</returns>
  static SkewByOffset(
    coordinate: CartesianCoordinate,
    lambda: CartesianOffset
  ): CartesianCoordinate {
    return CartesianCoordinate.SkewAboutOrigin(coordinate, lambda.X, lambda.Y);
  }

  /// <summary>
  /// Skews the specified coordinate about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="lambdaX">The magnitude to skew along the x-axis.</param>
  /// <param name="lambdaY">The magnitude to skew along the y-axis.</param>
  /// <returns>CartesianCoordinate.</returns>
  static SkewAboutOrigin(
    coordinate: CartesianCoordinate,
    lambdaX: number,
    lambdaY: number
  ): CartesianCoordinate {
    return new CartesianCoordinate(coordinate.X + lambdaX * coordinate.Y, coordinate.Y + lambdaY * coordinate.X);
  }

  /// <summary>
  /// Mirrors the specified coordinate about the specified line.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="referenceLine">The reference line.</param>
  /// <returns>CartesianCoordinate.</returns>
  static MirrorAboutLine(
    coordinate: CartesianCoordinate,
    referenceLine: LinearCurve
  ): CartesianCoordinate {
    const reflectionLinePoint: CartesianCoordinate = referenceLine.CoordinateOfPerpendicularProjection(coordinate);
    const deltaReflection: CartesianOffset = reflectionLinePoint.offsetFrom(coordinate).multiplyBy(2);

    return coordinate.addTo(deltaReflection.toCartesianCoordinate());
  }

  /// <summary>
  /// Mirrors the specified coordinate about the x-axis.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>CartesianCoordinate.</returns>
  static MirrorAboutAxisX(coordinate: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(coordinate.X, -coordinate.Y);
  }

  /// <summary>
  /// Mirrors the specified coordinate about the y-axis.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>CartesianCoordinate.</returns>
  static MirrorAboutAxisY(coordinate: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(-coordinate.X, coordinate.Y);
  }


  // ==== Change
  static subtract(a: ICartesianData, b: ICartesianData): ICartesianData {
    return {
      X: a.X - b.X,
      Y: a.Y - b.Y
    }
  }

  subtractBy(coord: CartesianCoordinate | ICartesianData): CartesianOffset {
    const tolerance = coord instanceof CartesianCoordinate ? Generics.getToleranceBetween(this, coord) : this.Tolerance;

    return coord instanceof CartesianCoordinate
      ? CartesianOffset.fromCoordinates(this, coord, tolerance)
      : CartesianOffset.fromCoordinates(this, CartesianCoordinate.fromData(coord), tolerance);
  }

  subtractOffset(offset: CartesianOffset): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      this.X - offset.X,
      this.Y - offset.Y,
      Generics.getToleranceBetween(this, offset));
  }

  static add(a: ICartesianData, b: ICartesianData): ICartesianData {
    return {
      X: a.X + b.X,
      Y: a.Y + b.Y
    }
  }

  addTo(coord: CartesianCoordinate | ICartesianData): CartesianCoordinate {
    const tolerance = coord instanceof CartesianCoordinate ? Generics.getToleranceBetween(this, coord) : this.Tolerance;
    return CartesianCoordinate.fromXY(
      this.X + coord.X,
      this.Y + coord.Y,
      tolerance
    );
  }

  addOffset(offset: CartesianOffset): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      this.X + offset.X,
      this.Y + offset.Y,
      Generics.getToleranceBetween(this, offset));
  }

  // ==== Scale
  static multiply(coordinate: ICartesianData, multiplier: number): ICartesianData {
    return {
      X: coordinate.X * multiplier,
      Y: coordinate.Y * multiplier
    }
  }

  multiplyBy(multiplier: number): CartesianCoordinate {
    return CartesianCoordinate.fromXY(
      this.X * multiplier,
      this.Y * multiplier,
      this.Tolerance);
  }

  static divide(coordinate: ICartesianData, denominator: number): ICartesianData {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return {
      X: coordinate.X / denominator,
      Y: coordinate.Y / denominator
    }
  }

  divideBy(denominator: number): CartesianCoordinate {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return CartesianCoordinate.fromXY(
      this.X / denominator,
      this.Y / denominator,
      this.Tolerance);
  }
}