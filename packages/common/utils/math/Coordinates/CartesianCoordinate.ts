import { DivideByZeroException } from "../../../errors/exceptions";
import { IEquatable } from "../../../interfaces";
import { AlgebraLibrary } from "../Algebra/AlgebraLibrary";
import { LinearCurve } from "../Curves/LinearCurve";
import { Generics } from "../Generics";
import { Numbers } from "../Numbers";
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';
import { VectorLibrary } from "../Vectors/VectorLibrary";
import { Angle } from "./Angle";
import { CartesianOffset } from "./CartesianOffset";
import { ICoordinate } from "./ICoordinate";

/**
 * The interface for a coordinate in a two-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * See: https://en.wikipedia.org/wiki/Cartesian_coordinate_system
 *
 * See: https://en.wikipedia.org/wiki/Euclidean_space
 *
 * @export
 * @interface ICartesianCoordinate
 * @implements {IEquatable<CartesianCoordinate>}
 * @implements {ICoordinate}
 */
export interface ICartesianCoordinate extends IEquatable<ICoordinate>, ICoordinate {
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
 * Coordinate in a two-dimensional coordinate system that specifies each point uniquely in a plane by a set of numerical coordinates,
 * which are the signed distances to the point from two fixed perpendicular oriented lines, measured in the same unit of length.
 *
 * See: https://en.wikipedia.org/wiki/Cartesian_coordinate_system
 *
 * See: https://en.wikipedia.org/wiki/Euclidean_space
 *
 * @export
 * @class CartesianCoordinate
 * @implements {ICartesianCoordinate}
 */
export class CartesianCoordinate implements ICartesianCoordinate {
  public Tolerance: number;

  private _x = 0;
  get X() { return this._x }

  private _y = 0;
  get Y() { return this._y }

  /**
   * Creates an instance of CartesianCoordinate.
   * @param {number} x The x-coordinate.
   * @param {number} y The y-coordinate.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance to be used in relating coordinates.
   * @memberof CartesianCoordinate
   */
  constructor(x: number = 0, y: number = 0, tolerance: number = Numbers.ZeroTolerance) {
    this._x = x;
    this._y = y;
    this.Tolerance = tolerance;
  }

  ToString(): string {
    return this.toString() + " - X: " + this._x + ", Y: " + this._y;
  }

  /// <summary>
  /// Returns the cross product/determinant of the coordinates.
  /// x1*y2 - x2*y1
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  CrossProduct(coordinate: CartesianCoordinate): number {
    return VectorLibrary.CrossProduct(this._x, this._y, coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the dot product of the coordinates.
  /// x1*x2 + y1*y2
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>System.Double.</returns>
  DotProduct(coordinate: CartesianCoordinate): number {
    return VectorLibrary.DotProduct(this._x, this._y, coordinate.X, coordinate.Y);
  }

  /// <summary>
  /// Returns the cartesian offset of the current coordinate from the provided coordinate.
  /// i.e. the current coordinate subtracting the provided coordinate.
  /// </summary>
  /// <param name="coordinateI">The coordinate i.</param>
  /// <returns>AngularOffset.</returns>
  OffsetFrom(coordinateI: CartesianCoordinate): CartesianOffset {
    return new CartesianOffset(coordinateI, this);
  }

  /// <summary>
  /// Returns a new coordinate offset by the provided parameters.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  OffsetCoordinate(distance: number, rotation: Angle): CartesianCoordinate {
    return CartesianCoordinate.OffsetCoordinate(this, distance, rotation);
  }

  /// <summary>
  /// The linear distance the coordinate is from the origin.
  /// </summary>
  /// <returns>System.Double.</returns>
  DistanceFromOrigin(): number {
    return AlgebraLibrary.SRSS(this._x, this._y);
  }


  // #region  == Methods: Static

  /// <summary>
  /// Returns a default static coordinate at the origin.
  /// </summary>
  /// <returns></returns>
  public static Origin(): CartesianCoordinate {
    return new CartesianCoordinate(0, 0);
  }

  /// <summary>
  /// Returns a new coordinate offset from the provided coordinate.
  /// </summary>
  /// <param name="distance">The distance to offset.</param>
  /// <param name="center">The center.</param>
  /// <param name="rotation">The rotation.</param>
  /// <returns>CartesianCoordinate.</returns>
  public static OffsetCoordinate(
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

    return new CartesianCoordinate(
      x,
      y,
      center.Tolerance);
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
    const centeredCoordinate = coordinate.subtractBy(centerOfRotation);

    // Rotate coordinate
    const rotatedCoordinate = CartesianCoordinate.Rotate(centeredCoordinate, angleRadians);

    // Move coordinate such that center of rotation is back at original coordinate
    return rotatedCoordinate.addTo(centerOfRotation);
  }

  /// <summary>
  /// Rotates the specified coordinate by the specifed angle about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="angleRadians">The angle [radians], where counter-clockwise is positive.</param>
  /// <returns>MPT.Math.Coordinates.CartesianCoordinate.</returns>
  static Rotate(
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
    const centeredCoordinate = coordinate.subtractBy(referencePoint);

    // Scale coordinate
    const rotatedCoordinate = CartesianCoordinate.Scale(centeredCoordinate, scale);

    // Move coordinate such that reference point is back at original coordinate
    return rotatedCoordinate.addTo(referencePoint);
  }

  /// <summary>
  /// Scales the specified coordinate about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="scale">The scale.</param>
  /// <returns>CartesianCoordinate.</returns>
  static Scale(
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
    const skewBoxOffset = skewingReferencePoint.OffsetFrom(stationaryReferencePoint);
    const lambdaX = magnitude.X / skewBoxOffset.Y;
    const lambdaY = magnitude.Y / skewBoxOffset.X;

    return CartesianCoordinate.Skew(coordinate, lambdaX, lambdaY);
  }

  // /// <summary>
  // /// Skews the specified coordinate about the origin.
  // /// </summary>
  // /// <param name="coordinate">The coordinate.</param>
  // /// <param name="lambda">The magnitude to skew along the x-axis and y-axis.</param>
  // /// <returns>CartesianCoordinate.</returns>
  // static Skew(coordinate: CartesianCoordinate, lambda: CartesianOffset): CartesianCoordinate {
  //   return this.Skew(coordinate, lambda.X(), lambda.Y());
  // }

  /// <summary>
  /// Skews the specified coordinate about the origin.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <param name="lambdaX">The magnitude to skew along the x-axis.</param>
  /// <param name="lambdaY">The magnitude to skew along the y-axis.</param>
  /// <returns>CartesianCoordinate.</returns>
  static Skew(
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
  public static MirrorAboutLine(
    coordinate: CartesianCoordinate,
    referenceLine: LinearCurve
  ): CartesianCoordinate {
    const reflectionLinePoint: CartesianCoordinate = referenceLine.CoordinateOfPerpendicularProjection(coordinate);
    const deltaReflection: CartesianOffset = reflectionLinePoint.OffsetFrom(coordinate).multiplyBy(2);

    return coordinate.addTo(deltaReflection.ToCartesianCoordinate());
  }

  /// <summary>
  /// Mirrors the specified coordinate about the x-axis.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>CartesianCoordinate.</returns>
  public static MirrorAboutAxisX(coordinate: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(coordinate.X, -coordinate.Y);
  }

  /// <summary>
  /// Mirrors the specified coordinate about the y-axis.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns>CartesianCoordinate.</returns>
  public static MirrorAboutAxisY(coordinate: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(-coordinate.X, coordinate.Y);
  }


  // #region Methods: Conversion
  // /// <summary>
  // /// Converts the cartesian coordinate to a polar coordinate.
  // /// </summary>
  // /// <returns>PolarCoordinate.</returns>
  // public ToPolar(): PolarCoordinate {
  //   return Cartesian2DPolarConverter.ToPolar(this);
  // }


  // #region Operators: Combining
  public subtractBy(coord: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(
      this.X - coord.X,
      this.Y - coord.Y,
      Generics.GetTolerance(this, coord));
  }


  // public static Subtract(a: ICartesianCoordinate, b: ICartesianCoordinate): ICartesianCoordinate {
  //   return {
  //     X: a.X - b.X,
  //     Y: a.Y - b.Y
  //   }
  // }

  public addTo(coord: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(
      this.X + coord.X,
      this.Y + coord.Y,
      Generics.GetTolerance(this, coord));
  }

  public addOffset(offset: CartesianOffset) {
    return new CartesianCoordinate(
      this.X + offset.X,
      this.Y + offset.Y,
      Generics.GetTolerance(this, offset));
  }

  // public static Add(a: ICartesianCoordinate, b: ICartesianCoordinate): ICartesianCoordinate {
  //   return {
  //     X: a.X + b.X,
  //     Y: a.Y + b.Y
  //   }
  // }


  public multiplyBy(multiplier: number): CartesianCoordinate {
    return new CartesianCoordinate(
      this.X * multiplier,
      this.Y * multiplier,
      this.Tolerance);
  }

  // public static MultiplyBy(coordinate: ICartesianCoordinate, multiplier: number): ICartesianCoordinate {
  //   return {
  //     X: coordinate.X * multiplier,
  //     Y: coordinate.Y * multiplier
  //   }
  // }

  public divideBy(denominator: number): CartesianCoordinate {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return new CartesianCoordinate(
      this.X / denominator,
      this.Y / denominator,
      this.Tolerance);
  }

  // public static DivideBy(coordinate: ICartesianCoordinate, denominator: number): ICartesianCoordinate {
  //   if (denominator === 0) { throw new DivideByZeroException(); }

  //   return {
  //     X: coordinate.X / denominator,
  //     Y: coordinate.Y / denominator
  //   }
  // }


  public equals(other: CartesianCoordinate): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return Numbers.AreEqual(this._x, other.X, tolerance) &&
      Numbers.AreEqual(this._y, other.Y, tolerance);
  }

  // /// <summary>
  // /// Indicates whether the current object is equal to another object of the same ICoordinate interface.
  // /// </summary>
  // /// <param name="other">The other.</param>
  // /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
  // public Equals(other: ICoordinate): boolean {
  //   if (typeof other === CartesianCoordinate) {
  //     return Equals(other as CartesianCoordinate);
  //   }
  //   if (other as PolarCoordinate) {
  //     return Equals(Cartesian2DPolarConverter.ToCartesian(other as PolarCoordinate));
  //   }
  //   return Equals(other as object);
  // }
}