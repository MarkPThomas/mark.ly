import { IEquatable } from "common/interfaces";
import { DivideByZeroException } from "common/errors/exceptions";

import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";
import { Generics } from "../Generics";
import { TrigonometryLibrary as Trig } from '../trigonometry/TrigonometryLibrary';
import { Numbers } from "../Numbers";
import { VectorLibrary } from "../vectors/VectorLibrary";
import { CartesianOffset3D } from "./CartesianOffset3D";
import { ICoordinate3D } from "./ICoordinate3D";
import { SphericalCoordinate } from "./SphericalCoordinate";
import { Angle } from "../coordinates/Angle";
import { CylindricalCoordinate } from "./CylindricalCoordinate";
import { AlgebraLibrary } from "../algebra/AlgebraLibrary";
import { IAngle3D } from "./IAngle3D";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ICartesian3DJson
 * @typedef {ICartesian3DJson}
 */
export interface ICartesian3DJson {
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

  /**
   * The z-coordinate.
   *
   * @type {number}
   * @memberof ICartesianCoordinate
   */
  z: number
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ICartesian3DData
 * @typedef {ICartesian3DData}
 */
export interface ICartesian3DData {
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

  /**
   * The z-coordinate.
   *
   * @type {number}
   * @memberof ICartesianCoordinate
   */
  Z: number
}

/**
 * A three-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 *
 * @export
 * @interface ICartesianCoordinate
 * @implements {IEquatable<CartesianCoordinate>}
 * @implements {ICoordinate}
 */
export interface ICartesianCoordinate3D extends ICoordinate3D, ICartesian3DData {
}

/**
 * A three-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system}
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_space}
 */
export class CartesianCoordinate3D implements ICartesianCoordinate3D, IEquatable<CartesianCoordinate3D> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @type {number}
 */
  Tolerance: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {number}
 */
  readonly X: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {number}
 */
  readonly Y: number;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @readonly
 * @type {number}
 */
  readonly Z: number;

  // ==== Creation
  /**
   * Initializes a new instance of the CartesianCoordinate3D struct.
   * @param {number} x The x.
   * @param {number} y The y.
   * @param {number} z The z.
   * @param {number} tolerance The tolerance.
   */
  protected constructor(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.Tolerance = tolerance;
  }

  /**
   * Initializes a new instance of the CartesianCoordinate at the origin.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static atOrigin(): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(0, 0, 0);
  }

  /**
   * Initializes a new instance with JSON.
   * @param {ICartesian3DJson} json JSON representation of the coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  static fromJson(
    json: ICartesian3DJson,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(json.x, json.y, json.z, tolerance);
  }

  /**
    * Initializes a new instance with a data object.
    * @param {ICartesianData} data Minimum data for the coordinate.
    * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
    * @returns {CartesianCoordinate} CartesianCoordinate.
    */
  static fromData(
    data: ICartesian3DData,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(data.X, data.Y, data.Z, tolerance);
  }

  /**
   * Creates an instance of CartesianCoordinate.
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   * @param {number} z The z-coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @memberof CartesianCoordinate
   */
  static fromXYZ(
    x: number,
    y: number,
    z: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate3D {
    return new CartesianCoordinate3D(x, y, z, tolerance);
  }

  // TODO: Finish
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {CartesianCoordinate3D} center
 * @param {number} distance
 * @param {Angle} azimuth
 * @param {Angle} inclination
 * @returns {CartesianCoordinate3D}
 */
  static fromCoordinateOffset(
    center: CartesianCoordinate3D,
    distance: number,
    azimuth: Angle,
    inclination: Angle
  ): CartesianCoordinate3D {
    let x = center.X + distance * Trig.Cos(azimuth.Radians);
    if (Numbers.IsZeroSign(x, center.Tolerance)) {
      x = 0;
    }

    let y = center.Y + distance * Trig.Sin(azimuth.Radians);
    if (Numbers.IsZeroSign(y, center.Tolerance)) {
      y = 0;
    }

    let z = center.Z + distance * Trig.Sin(azimuth.Radians);
    if (Numbers.IsZeroSign(z, center.Tolerance)) {
      z = 0;
    }

    return CartesianCoordinate3D.fromXYZ(x, y, z, center.Tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} distance
 * @param {Angle} rotationHor
 * @param {Angle} rotationVert
 * @returns {CartesianCoordinate3D}
 */
  offsetCoordinate(
    distance: number,
    rotationHor: Angle,
    rotationVert: Angle
  ): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromCoordinateOffset(this, distance, rotationHor, rotationVert);
  }

  // ==== I/0
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {string}
 */
  toString(): string {
    return `${CartesianCoordinate3D.name} - X: ${this.X}, Y: ${this.Y}, Z: ${this.Z}`;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {ICartesian3DData}
 */
  toData(): ICartesian3DData {
    return {
      X: this.X,
      Y: this.Y,
      Z: this.Z
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {ICartesian3DJson}
 */
  toJson(): ICartesian3DJson {
    return {
      x: this.X,
      y: this.Y,
      z: this.Z
    }
  }

  // ==== Conversion
  /**
   * Converts the cartesian coordinate to a spherical coordinate.
   * @returns {SphericalCoordinate} PolarCoordinate.
   */
  toSpherical(): SphericalCoordinate {
    throw new Error();
    // return Cartesian3DSphericalConverter.toSpherical(this);
  }

  /**
   * Converts the cartesian coordinate to a spherical coordinate.
   * @returns {SphericalCoordinate} PolarCoordinate.
   */
  toCylindrical(): CylindricalCoordinate {
    throw new Error();
    // return Cartesian3DCylindricalConverter.toCylindrical(this);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {CartesianCoordinate}
 */
  toCartesianXY(): CartesianCoordinate {
    return CartesianCoordinate.fromXY(this.X, this.Y);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {CartesianCoordinate}
 */
  toCartesianXZ(): CartesianCoordinate {
    return CartesianCoordinate.fromXY(this.X, this.Z);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {CartesianCoordinate}
 */
  toCartesianYZ(): CartesianCoordinate {
    return CartesianCoordinate.fromXY(this.Y, this.Z);
  }

  // === Comparison
  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {CartesianCoordinate3D} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: CartesianCoordinate3D): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.IsEqualTo(this.X, other.X, tolerance) &&
      Numbers.IsEqualTo(this.Y, other.Y, tolerance) &&
      Numbers.IsEqualTo(this.Z, other.Z, tolerance)
    );
  }

  // ==== Methods

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianCoordinate3D} coordinateI
 * @returns {CartesianOffset3D}
 */
  offsetFrom(coordinateI: CartesianCoordinate3D): CartesianOffset3D {
    return CartesianOffset3D.fromCoordinates(coordinateI, this);
  }

  /**
   * Crosses the product.
   * @param {CartesianCoordinate3D} point The point.
   * @returns {CartesianCoordinate3D} CartesianCoordinate3D.
   */
  crossProduct(point: CartesianCoordinate3D): CartesianCoordinate3D {
    const matrix = VectorLibrary.CrossProduct3D(this.X, this.Y, this.Z, point.X, point.Y, point.Z);
    return new CartesianCoordinate3D(matrix[0], matrix[1], matrix[2], this.Tolerance);
  }

  /**
   * Dots the product.
   * @param {CartesianCoordinate3D} point The point.
   * @returns {number} System.Double.
   */
  dotProduct(point: CartesianCoordinate3D): number {
    return VectorLibrary.DotProduct3D(this.X, this.Y, this.Z, point.X, point.Y, point.Z);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @returns {number}
 */
  distanceFromOrigin(): number {
    return AlgebraLibrary.SRSS(this.X, this.Y, this.Z);
  }

  /**
   * The angles of the point relative to the origin.
   *
   * @return {*}  {Angle}
   * @memberof CartesianOffset
   */
  anglesFromOrigin(): IAngle3D {
    const coordXY = this.toCartesianXY();
    const azimuth = Angle.CreateFromPoint(coordXY);

    const coordPlanar = CartesianCoordinate.fromXY(coordXY.distanceFromOrigin(), this.Z);
    const inclination = Angle.CreateFromPoint(coordPlanar);

    return {
      azimuth,
      inclination
    }
  }

  // ==== Change
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {ICartesian3DData} a
 * @param {ICartesian3DData} b
 * @returns {ICartesian3DData}
 */
  static subtract(a: ICartesian3DData, b: ICartesian3DData): ICartesian3DData {
    return {
      X: a.X - b.X,
      Y: a.Y - b.Y,
      Z: a.Z - b.Z,
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {(CartesianCoordinate3D | ICartesian3DData)} coord
 * @returns {CartesianOffset3D}
 */
  subtractBy(coord: CartesianCoordinate3D | ICartesian3DData): CartesianOffset3D {
    const tolerance = coord instanceof CartesianCoordinate3D ? Generics.getToleranceBetween(this, coord) : this.Tolerance;

    return coord instanceof CartesianCoordinate3D
      ? CartesianOffset3D.fromCoordinates(this, coord, tolerance)
      : CartesianOffset3D.fromCoordinates(this, CartesianCoordinate3D.fromData(coord), tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianOffset3D} offset
 * @returns {CartesianCoordinate3D}
 */
  subtractOffset(offset: CartesianOffset3D): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      this.X - offset.X,
      this.Y - offset.Y,
      this.Z - offset.Z,
      Generics.getToleranceBetween(this, offset));
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {ICartesian3DData} a
 * @param {ICartesian3DData} b
 * @returns {ICartesian3DData}
 */
  static add(a: ICartesian3DData, b: ICartesian3DData): ICartesian3DData {
    return {
      X: a.X + b.X,
      Y: a.Y + b.Y,
      Z: a.Z + b.Z,
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {(CartesianCoordinate3D | ICartesian3DData)} coord
 * @returns {CartesianCoordinate3D}
 */
  addTo(coord: CartesianCoordinate3D | ICartesian3DData): CartesianCoordinate3D {
    const tolerance = coord instanceof CartesianCoordinate3D ? Generics.getToleranceBetween(this, coord) : this.Tolerance;
    return CartesianCoordinate3D.fromXYZ(
      this.X + coord.X,
      this.Y + coord.Y,
      this.Z + coord.Z,
      tolerance
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {CartesianOffset3D} offset
 * @returns {CartesianCoordinate3D}
 */
  addOffset(offset: CartesianOffset3D): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      this.X + offset.X,
      this.Y + offset.Y,
      this.Z + offset.Z,
      Generics.getToleranceBetween(this, offset));
  }

  // ==== Scale
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {CartesianCoordinate3D} coordinate
 * @param {number} multiplier
 * @returns {CartesianCoordinate3D}
 */
  static multiply(coordinate: CartesianCoordinate3D, multiplier: number): CartesianCoordinate3D {
    return new CartesianCoordinate3D(
      coordinate.X * multiplier,
      coordinate.Y * multiplier,
      coordinate.Z * multiplier,
      coordinate.Tolerance
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} multiplier
 * @returns {CartesianCoordinate3D}
 */
  multiplyBy(multiplier: number): CartesianCoordinate3D {
    return CartesianCoordinate3D.fromXYZ(
      this.X * multiplier,
      this.Y * multiplier,
      this.Z * multiplier,
      this.Tolerance
    );
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @static
 * @param {ICartesian3DData} coordinate
 * @param {number} denominator
 * @returns {ICartesian3DData}
 */
  static divide(coordinate: ICartesian3DData, denominator: number): ICartesian3DData {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return {
      X: coordinate.X / denominator,
      Y: coordinate.Y / denominator,
      Z: coordinate.Z / denominator
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @param {number} denominator
 * @returns {CartesianCoordinate3D}
 */
  divideBy(denominator: number): CartesianCoordinate3D {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return CartesianCoordinate3D.fromXYZ(
      this.X / denominator,
      this.Y / denominator,
      this.Z / denominator,
      this.Tolerance);
  }
}