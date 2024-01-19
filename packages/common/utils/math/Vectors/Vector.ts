import { DivideByZeroException } from "../../../errors/exceptions";
import { IEquatable } from "../../../interfaces";
import { Angle } from "../Coordinates/Angle";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { Generics } from "../Generics";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { VectorLibrary } from "./VectorLibrary";


/**
 * Represents a linear curve vector in 2D space.
 *
 * @export
 * @class Vector
 * @implements {IEquatable<Vector>}
 * @implements {ITolerance}
 */
export class Vector implements IEquatable<Vector>, ITolerance {
  public Tolerance: number;

  private _xComponent: number;
  public get Xcomponent(): number {
    return this._xComponent;
  }

  private _yComponent: number;
  public get Ycomponent(): number {
    return this._yComponent;
  }

  private _location: CartesianCoordinate;
  get Location(): CartesianCoordinate {
    return this._location;
  }

  /**
   * Length of this vector.
   *
   * @readonly
   * @type {number}
   * @memberof Vector
   */
  get Magnitude(): number {
    return VectorLibrary.Magnitude(this.Xcomponent, this.Ycomponent);
  }

  /**
   * Gets the square of the length of this vector.
   *
   * @readonly
   * @type {number}
   * @memberof Vector
   */
  get MagnitudeSquared(): number {
    return Numbers.Squared(this.Xcomponent) + Numbers.Squared(this.Ycomponent);
  }

  protected constructor() { }

  public static fromMagnitudesAtLocation(
    xMagnitude: number,
    yMagnitude: number,
    location?: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ) {
    const vector = new Vector();
    vector._xComponent = xMagnitude;
    vector._yComponent = yMagnitude;

    const locationCoord = location as unknown as CartesianCoordinate;
    if (locationCoord) {
      vector._location = locationCoord;
    } else {
      vector._location = new CartesianCoordinate(0, 0);
    }

    if (tolerance !== Numbers.ZeroTolerance) {
      vector.Tolerance = tolerance;
    }

    return vector;
  }

  /**
   *
   *
   * @static
   * @param {CartesianCoordinate} pointI The starting point, i.
   * @param {CartesianCoordinate} pointJ The ending point, j.
   * @param {number} [tolerance=Numbers.ZeroTolerance]
   * @return {*}
   * @memberof Vector
   */
  public static fromCoords(
    pointI: CartesianCoordinate,
    pointJ: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance) {

    const vector = new Vector();
    vector._xComponent = Vector.getXComponent(pointI, pointJ);
    vector._yComponent = Vector.getYComponent(pointI, pointJ);
    vector._location = pointI;

    if (tolerance != Numbers.ZeroTolerance) {
      vector.Tolerance = tolerance;
    }

    return vector;
  }

  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the same direction.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if [is collinear same direction] [the specified vector]; otherwise, <c>false</c>.</returns>
  public IsCollinearSameDirection(vector: Vector): boolean {
    return Vector.AreCollinearSameDirection(this, vector);
  }

  /// <summary>
  /// Vectors form a concave angle.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if the specified vector is concave; otherwise, <c>false</c>.</returns>
  public IsConcave(vector: Vector): boolean {
    return Vector.AreConcave(this, vector);
  }

  /// <summary>
  /// Vectors form a 90 degree angle.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if the specified vector is orthogonal; otherwise, <c>false</c>.</returns>
  public IsOrthogonal(vector: Vector): boolean {
    return Vector.AreOrthogonal(this, vector);
  }

  /// <summary>
  /// Vectors form a convex angle.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if the specified vector is convex; otherwise, <c>false</c>.</returns>
  public IsConvex(vector: Vector): boolean {
    return Vector.AreConvex(this, vector);
  }

  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the opposite direction.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if [is collinear opposite direction] [the specified vector]; otherwise, <c>false</c>.</returns>
  public IsCollinearOppositeDirection(vector: Vector): boolean {
    return Vector.AreCollinearOppositeDirection(this, vector);
  }


  /// <summary>
  /// True: The concave side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
  public IsConcaveInside(vector: Vector): boolean {
    return Vector.AreConcaveInside(this, vector);
  }

  /// <summary>
  /// True: The convex side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
  public IsConvexInside(vector: Vector): boolean {
    return Vector.AreConvexInside(this, vector);
  }

  /// <summary>
  /// Returns a value indicating the concavity of the vectors.
  /// 1 = Pointing the same way.
  /// &gt; 0 = Concave.
  /// 0 = Orthogonal.
  /// &lt; 0 = Convex.
  /// -1 = Pointing the exact opposite way.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns>System.Double.</returns>
  public ConcavityCollinearity(vector: Vector): number {
    return Vector.ConcavityCollinearity(this, vector);
  }


  /// <summary>
  /// Dot product of two vectors.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns>System.Double.</returns>
  public DotProduct(vector: Vector): number {
    return VectorLibrary.DotProduct(this.Xcomponent, this.Ycomponent, vector.Xcomponent, vector.Ycomponent);
  }

  /// <summary>
  /// Cross-product of two vectors.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns>System.Double.</returns>
  public CrossProduct(vector: Vector): number {
    return VectorLibrary.CrossProduct(this.Xcomponent, this.Ycomponent, vector.Xcomponent, vector.Ycomponent);
  }


  /// <summary>
  /// Returns the angle [radians] of a vector from the origin axis (x-axis, positive for counter-clockwise).
  /// </summary>
  /// <returns>System.Double.</returns>
  public Angle() {
    return new Angle(Angle.AsRadians(this.Xcomponent, this.Ycomponent));
  }

  /// <summary>
  /// Returns the angle [radians] between the two vectors, which is a value between 0 and +π.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns>System.Double.</returns>
  public toAngle(vector: Vector) {
    return Vector.AngleBetween(this, vector);
  }

  /// <summary>
  /// Returns the area between two vectors.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <returns>System.Double.</returns>
  public Area(vector: Vector): number {
    return (0.5 * (this.CrossProduct(vector)));
  }

  /// <summary>
  /// Returns a normalized vector.
  /// </summary>
  /// <returns>Vector.</returns>
  /// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
  public UnitVector(): Vector {
    return Vector.UnitVectorByComponents(this.Xcomponent, this.Ycomponent, this.Tolerance);
  }

  /// <summary>
  /// Returns the tangent unit vector.
  /// </summary>
  /// <returns>Vector.</returns>
  public UnitTangentVector(): Vector {
    return Vector.UnitTangentVectorByComponents(this.Xcomponent, this.Ycomponent, this.Tolerance);
  }

  /// <summary>
  /// Returns a normal unit vector.
  /// </summary>
  /// <returns>Vector.</returns>
  public UnitNormalVector(): Vector {
    return Vector.UnitNormalVectorByComponents(this.Xcomponent, this.Ycomponent, this.Tolerance);
  }


  /// <summary>
  /// Returns a normalized vector to the supplied points.
  /// </summary>
  /// <param name="i">The i.</param>
  /// <param name="j">The j.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  /// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
  public static UnitVector(i: CartesianCoordinate, j: CartesianCoordinate, tolerance: number = Numbers.ZeroTolerance): Vector {
    tolerance = Generics.GetTolerance(i, j, tolerance);
    const xComponent = this.getXComponent(i, j);
    const yComponent = this.getYComponent(i, j);

    return Vector.UnitVectorByComponents(xComponent, yComponent, tolerance);
  }

  /// <summary>
  /// Returns a normalized vector.
  /// </summary>
  /// <param name="xComponent">The x component.</param>
  /// <param name="yComponent">The y component.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  /// <exception cref="Exception">Ill-formed vector. Vector magnitude cannot be zero.</exception>
  public static UnitVectorByComponents(xComponent: number, yComponent: number, tolerance: number = Numbers.ZeroTolerance): Vector {
    const magnitude = VectorLibrary.Magnitude(xComponent, yComponent);

    xComponent /= magnitude;
    yComponent /= magnitude;

    return Vector.fromMagnitudesAtLocation(xComponent, yComponent, undefined, tolerance);
  }


  /// <summary>
  /// Returns the tangent unit vector to the supplied points.
  /// </summary>
  /// <param name="i">First point.</param>
  /// <param name="j">Second point.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  public static UnitTangentVectorByPts(i: CartesianCoordinate, j: CartesianCoordinate, tolerance: number = Numbers.ZeroTolerance): Vector {
    tolerance = Generics.GetTolerance(i, j, tolerance);
    return Vector.UnitVector(i, j, tolerance);
  }

  /// <summary>
  /// Returns the tangent unit vector to the supplied components.
  /// </summary>
  /// <param name="xComponent">The x component.</param>
  /// <param name="yComponent">The y component.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  public static UnitTangentVectorByComponents(xComponent: number, yComponent: number, tolerance: number = Numbers.ZeroTolerance): Vector {
    return Vector.UnitVectorByComponents(xComponent, yComponent, tolerance);
  }


  /// <summary>
  /// Returns a normal unit vector to the supplied points.
  /// </summary>
  /// <param name="i">First point.</param>
  /// <param name="j">Second point.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  public static UnitNormalVectorByPts(i: CartesianCoordinate, j: CartesianCoordinate, tolerance: number = Numbers.ZeroTolerance): Vector {
    tolerance = Generics.GetTolerance(i, j, tolerance);
    const xComponent = this.getXComponent(i, j);
    const yComponent = this.getYComponent(i, j);
    return Vector.UnitNormalVectorByComponents(xComponent, yComponent, tolerance);
  }


  /// <summary>
  /// Returns a normal unit vector to the supplied components.
  /// </summary>
  /// <param name="xComponent">The x component.</param>
  /// <param name="yComponent">The y component.</param>
  /// <param name="tolerance">The tolerance.</param>
  /// <returns>Vector.</returns>
  public static UnitNormalVectorByComponents(xComponent: number, yComponent: number, tolerance: number = Numbers.ZeroTolerance): Vector {
    const magnitude = VectorLibrary.Magnitude(xComponent, yComponent, tolerance);

    return Vector.fromMagnitudesAtLocation(-yComponent / magnitude, xComponent / magnitude, undefined, tolerance);
  }


  /// <summary>
  /// Returns the angle [radians] between the two vectors, which is a value between 0 and +π.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  public static AngleBetween(vector1: Vector, vector2: Vector, tolerance: number = Numbers.ZeroTolerance): number {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Math.acos(Vector.ConcavityCollinearity(vector1, vector2));
  }


  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the same direction.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if [is collinear same direction] [the specified vector1]; otherwise, <c>false</c>.</returns>
  public static AreCollinearSameDirection(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Numbers.IsEqualTo(Vector.ConcavityCollinearity(vector1, vector2), 1, Generics.GetTolerance(vector1, vector2, tolerance));
  }

  /// <summary>
  /// Vectors form a concave angle.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the specified vector1 is concave; otherwise, <c>false</c>.</returns>
  public static AreConcave(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    const concavityCollinearity = Vector.ConcavityCollinearity(vector1, vector2);
    return Numbers.IsPositiveSign(concavityCollinearity, tolerance) && !Numbers.IsEqualTo(concavityCollinearity, 1, tolerance);
  }

  /// <summary>
  /// Vectors form a 90 degree angle.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the specified vector1 is orthogonal; otherwise, <c>false</c>.</returns>
  public static AreOrthogonal(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Numbers.IsZeroSign(Vector.ConcavityCollinearity(vector1, vector2), tolerance);
  }

  /// <summary>
  /// Vectors form a convex angle.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the specified vector1 is convex; otherwise, <c>false</c>.</returns>
  public static AreConvex(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    const concavityCollinearity = Vector.ConcavityCollinearity(vector1, vector2);
    return Numbers.IsNegativeSign(concavityCollinearity, tolerance) && !Numbers.IsEqualTo(concavityCollinearity, -1, tolerance);
  }

  /// <summary>
  /// True: Segments are parallel, on the same line, oriented in the opposite direction.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if [is collinear opposite direction] [the specified vector1]; otherwise, <c>false</c>.</returns>
  public static AreCollinearOppositeDirection(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Numbers.IsEqualTo(Vector.ConcavityCollinearity(vector1, vector2), -1, tolerance);
  }


  /// <summary>
  /// True: The concave side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if [is concave inside] [the specified vector1]; otherwise, <c>false</c>.</returns>
  public static AreConcaveInside(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Numbers.IsPositiveSign(vector1.Area(vector2), tolerance);
  }

  /// <summary>
  /// True: The convex side of the vector is inside the shape.
  /// This is determined by the direction of the vector.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if [is convex inside] [the specified vector1]; otherwise, <c>false</c>.</returns>
  public static AreConvexInside(
    vector1: Vector,
    vector2: Vector,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.GetTolerance(vector1, vector2, tolerance);
    return Numbers.IsNegativeSign(vector1.Area(vector2), tolerance);
  }

  /// <summary>
  /// Returns a value indicating the concavity of the vectors.
  /// 1 = Pointing the same way.
  /// &gt; 0 = Concave.
  /// 0 = Orthogonal.
  /// &lt; 0 = Convex.
  /// -1 = Pointing the exact opposite way.
  /// </summary>
  /// <param name="vector1">The vector1.</param>
  /// <param name="vector2">The vector2.</param>
  /// <returns>System.Double.</returns>
  public static ConcavityCollinearity(vector1: Vector, vector2: Vector): number {
    const magnitude1 = vector1.Magnitude;
    const magnitude2 = vector2.Magnitude;
    return vector1.DotProduct(vector2) / (magnitude1 * magnitude2);
  }


  /// <summary>
  /// Gets the x component.
  /// </summary>
  /// <param name="i">The i.</param>
  /// <param name="j">The j.</param>
  /// <returns>System.Double.</returns>
  private static getXComponent(i: CartesianCoordinate, j: CartesianCoordinate): number {
    return j.X - i.X;
  }
  /// <summary>
  /// Gets the y component.
  /// </summary>
  /// <param name="i">The i.</param>
  /// <param name="j">The j.</param>
  /// <returns>System.Double.</returns>
  private static getYComponent(i: CartesianCoordinate, j: CartesianCoordinate): number {
    return j.Y - i.Y;
  }



  // #region Operators & Equals

  /// <summary>
  /// Indicates whether the current object is equal to another object of the same type.
  /// </summary>
  /// <param name="other">An object to compare with this object.</param>
  /// <returns>true if the current object is equal to the <paramref name="other" /> parameter; otherwise, false.</returns>
  public equals(other: Vector): boolean {
    return (Math.abs(this.Xcomponent - other.Xcomponent) < this.Tolerance) &&
      (Math.abs(this.Ycomponent - other.Ycomponent) < this.Tolerance);
  }

  /// <summary>
  /// Implements the + operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public addTo(vector: Vector): Vector {
    return Vector.fromMagnitudesAtLocation(this.Xcomponent + vector.Xcomponent, this.Ycomponent + vector.Ycomponent);
  }

  /// <summary>
  /// Implements the - operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public subtractBy(vector: Vector): Vector {
    return Vector.fromMagnitudesAtLocation(this.Xcomponent - vector.Xcomponent, this.Ycomponent - vector.Ycomponent);
  }


  /// <summary>
  /// Implements the * operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public multiplyBy(multiplier: number): Vector {
    return Vector.fromMagnitudesAtLocation(this.Xcomponent * multiplier, this.Ycomponent * multiplier);
  }

  /// <summary>
  /// Implements the / operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public divideBy(denominator: number): Vector {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return Vector.fromMagnitudesAtLocation(this.Xcomponent / denominator, this.Ycomponent / denominator);
  }
}