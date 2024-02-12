import { Angle } from "../Coordinates/Angle";
import { AngularOffset } from "../Coordinates/AngularOffset";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../Coordinates/CartesianOffset";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { Numbers } from "../Numbers";
import { Vector } from "../Vectors/Vector";
import { FocusProps } from "./ConicSectionCurve";
import { ConicSectionEllipticCurve } from "./ConicSectionEllipticCurve";
import { Curve } from "./Curve";
import { LinearCurve } from "./LinearCurve";
import { IntersectionCircularCircular } from "./tools/Intersections/IntersectionCircularCircular";
import { IntersectionLinearCircular } from "./tools/Intersections/IntersectionLinearCircular";

/**
 * Class CircularCurve.
 * Implements the ConicSectionEllipticCurve.
 *
 * @extends {ConicSectionEllipticCurve}
 */
export class CircularCurve extends ConicSectionEllipticCurve {
  /**
   * Distance from local origin to the focus, c.
   *
   * @readonly
   * @type {number}
   */
  public get DistanceFromFocusToLocalOrigin(): number {
    return 0;
  }

  /**
   * Gets the center control point.
   *
   * @readonly
   * @type {CartesianCoordinate}
   */
  public get Center(): CartesianCoordinate {
    return this._focus;
  }

  /**
   * Gets the radius.
   *
   * @readonly
   * @type {number}
   */
  public get Radius(): number {
    return this.DistanceFromVertexMajorToLocalOrigin;
  }

  /**
   * Gets the curvature.
   *
   * @readonly
   * @type {number}
   */
  public get Curvature(): number {
    return 1 / this.Radius;
  }

  /**
   * The eccentricity, e.
   * A measure of how much the conic section deviates from being circular.
   * Distance from any point on the conic section to its focus, divided by the perpendicular distance from that point to the nearest directrix.
   *
   * @readonly
   * @type {number}
   */
  public get Eccentricity(): number {
    return 0;
  }

  /**
   * Distance from the focus to the curve along a line perpendicular to the major axis and the focus, p.
   *
   * @readonly
   * @type {number}
   */
  public get SemilatusRectumDistance(): number {
    return this.DistanceFromVertexMajorToLocalOrigin;
  }

  /**
 * Creates an instance of CircularCurve.
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @constructor
 * @param {(number | CartesianCoordinate)} radiusOrVertex
 * @param {CartesianCoordinate} center
 * @param {number} [tolerance=Curve.DEFAULT_TOLERANCE]
 */
  constructor(
    radiusOrVertex: number | CartesianCoordinate,
    center: CartesianCoordinate,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    const props = CircularCurve.formArguments(radiusOrVertex, center);
    super(props, tolerance);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @static
 * @param {(number | CartesianCoordinate)} radiusOrVertex
 * @param {CartesianCoordinate} center
 * @returns {FocusProps}
 */
  protected static formArguments(
    radiusOrVertex: number | CartesianCoordinate,
    center: CartesianCoordinate
  ): FocusProps {
    if (typeof radiusOrVertex === 'number') {
      const vertex = radiusOrVertex as number;

      const vertexMajor = CircularCurve.VertexMajor(vertex, center);
      const focus = center;
      const distanceFromMajorVertexToLocalOrigin = CartesianOffset.lengthBetween(vertexMajor, center);

      return { vertexMajor, focus, distanceFromMajorVertexToLocalOrigin };
    } else if (radiusOrVertex instanceof CartesianCoordinate) {
      const radius = radiusOrVertex as CartesianCoordinate;

      const vertexMajor = radius;
      const focus = center;
      const distanceFromMajorVertexToLocalOrigin = CartesianOffset.lengthBetween(radius, center);

      return { vertexMajor, focus, distanceFromMajorVertexToLocalOrigin };
    } else {
      return {
        vertexMajor: CartesianCoordinate.atOrigin(),
        focus: CartesianCoordinate.atOrigin(),
        distanceFromMajorVertexToLocalOrigin: 0
      }
    }
  }

  /**
   * Initializes a new instance of the CircularCurve class.
   *
   * @param {CartesianCoordinate} vertex - Any vertex on the curve.
   * @param {CartesianCoordinate} center - The center.
   * @param {number} [tolerance=DEFAULT_TOLERANCE] - Tolerance to apply to the curve.
   */
  static fromPtOnCurve(
    vertex: CartesianCoordinate,
    center: CartesianCoordinate,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    return new CircularCurve(vertex, center, tolerance);
  }

  /**
   * Initializes a new instance of the CircularCurve class.
   *
   * @param {number} radius - The radius.
   * @param {CartesianCoordinate} center - The center.
   * @param {number} [tolerance=DEFAULT_TOLERANCE] - Tolerance to apply to the curve.
   */
  static fromRadius(
    radius: number,
    center: CartesianCoordinate,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    return new CircularCurve(radius, center, tolerance);
  }

  /**
   * +X-coordinate on the line segment that corresponds to the y-coordinate given.
   *
   * @param {number} y - Y-coordinate for which an x-coordinate is desired.
   * @returns {number}
   */
  public XatY(y: number): number {
    const coordinates = this.XsAtY(y);
    if (coordinates.length === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return coordinates[0];
  }

  /**
   * +Y-coordinate on the line segment that corresponds to the x-coordinate given.
   *
   * @param {number} x - X-coordinate for which a y-coordinate is desired.
   * @returns {number}
   */
  public YatX(x: number): number {
    const coordinates = this.YsAtX(x);
    if (coordinates.length === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return coordinates[0];
  }

  /**
   * Determines whether the specified curve is intersecting.
   *
   * @param {CircularCurve} curve - The curve.
   * @returns {boolean}
   */
  public IsIntersecting(curve: CircularCurve): boolean {
    return CircularCurve.AreIntersecting(this, curve);
  }

  /**
   * Determines whether the specified curve is tangent.
   *
   * @param {CircularCurve} curve - The curve.
   * @returns {boolean}
   */
  public IsTangent(curve: CircularCurve): boolean {
    return CircularCurve.AreTangent(this, curve);
  }

  /**
       * The radius measured from the right focus (+X) as a function of the angle in local coordinates.
       * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
       * @returns {number} The radius.
       */
  RadiusAboutFocusRight(angle: Angle | number): number {
    return this.Radius;
  }

  /**
  * The radius measured from the right (+X) major vertex as a function of the angle in local coordinates.
  * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
  * @returns {number} The radius.
  */
  RadiusAboutVertexMajorRight(angle: Angle | number): number {
    const radius = this.RadiusAboutVertexMajorLeft(this.asRadians(angle));
    return radius > 0 ? radius : 0;
  }

  /**
   * The radius measured from the left focus (-X) as a function of the angle in local coordinates.
   * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
   * @returns {number} The radius.
   */
  RadiusAboutFocusLeft(angle: Angle | number): number {
    return this.Radius;
  }

  /**
  * The radius measured from the left (-X) major vertex as a function of the angle in local coordinates.
  * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
  * @returns {number} The radius.
  */
  RadiusAboutVertexMajorLeft(angle: Angle | number): number {
    const radius = 2 * this.Radius * Math.cos(this.asRadians(angle));
    return radius > this.Tolerance ? radius : 0;
  }

  /**
   * The radius measured from the local coordinate origin as a function of the angle in local coordinates.
   * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
   * @returns {number} The radius.
   */
  RadiusAboutOrigin(angle: Angle | number): number {
    return this.Radius;
  }

  /**
  * Curvature of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
  * @param {Angle | number} angle - Parametric coordinate in radians.
  * @returns {number} The curvature.
  */
  CurvatureByAngle(angle: Angle | number): number {
    return 1 / this.Radius;
  }

  /**
 * Returns a string that represents this instance.
 * @returns {string} A string that represents this instance.
 */
  toString(): string {
    return `${CircularCurve.name} - `
      + `Center: {X: ${this.LocalOrigin.X}, Y: ${this.LocalOrigin.Y}}, `
      + `Radius: ${this.Radius}, `
      + `I: {X: ${this._limitStartDefault.X}, Y: ${this._limitStartDefault.Y}}, `
      + `J: {X: ${this._limitEndDefault.X}, Y: ${this._limitEndDefault.Y}}`;
  }

  /**
  * Returns points where the circular curve intersects the provided linear curve.
  * @param {LinearCurve} otherLine - Linear curve that intersects the current linear curve.
  * @returns {CartesianCoordinate[]} An array of CartesianCoordinates representing intersection points.
  */
  IntersectionCoordinateLinear(otherLine: LinearCurve): CartesianCoordinate[] {
    return IntersectionLinearCircular.intersectionCoordinates(otherLine, this);
  }

  /**
  * Returns points where the circular curve intersects the provided circular curve.
  * @param {CircularCurve} otherLine - Circular curve that intersects the current circular curve.
  * @returns {CartesianCoordinate[]} An array of CartesianCoordinates representing intersection points.
  */
  IntersectionCoordinateCircular(otherLine: CircularCurve): CartesianCoordinate[] {
    return IntersectionCircularCircular.IntersectionCoordinates(this, otherLine);
  }

  /**
  * Coordinate of the closest point where a perpendicular projection intersects the provided coordinate.
  * Returns infinity if the point is coincident with the circular curve center.
  * @param {CartesianCoordinate} point - The point.
  * @returns {CartesianCoordinate} The closest intersection point.
  */
  CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate {
    return CircularCurve.CoordinatesOfPerpendicularProjection(point, this)[0];
  }

  /**
  * Coordinates of where a perpendicular projection intersects the provided coordinate.
  * The first coordinate is of the closer intersection.
  * Returns infinity if the point is coincident with the circular curve center.
  * @param {CartesianCoordinate} point - The point.
  * @returns {Tuple<CartesianCoordinate, CartesianCoordinate>} A tuple of CartesianCoordinates representing intersection points.
  */
  CoordinatesOfPerpendicularProjection(point: CartesianCoordinate): [CartesianCoordinate, CartesianCoordinate] {
    return CircularCurve.CoordinatesOfPerpendicularProjection(point, this);
  }

  /**
  * The length within the provided rotation along a circular curve.
  * @param {AngularOffset} rotation - Rotation to get arc length between.
  * @returns {number} The length between rotations.
  */
  LengthBetweenAngles(rotation: AngularOffset): number {
    return CircularCurve.LengthBetween(rotation, this.Radius);
  }

  /**
   * Length of the curve between the limits.
   * @returns {number} The length of the curve.
   * @throws {Error} Throws an error indicating that the method is not implemented.
   */
  Length(): number {
    throw new Error("Not implemented");
    //return 2 * Math.PI * this.radius;
  }

  /**
  * Length of the curve between two points.
  * @param {number} relativePositionStart - Relative position along the path at which the length measurement is started.
  * @param {number} relativePositionEnd - Relative position along the path at which the length measurement is ended.
  * @returns {number} The length of the curve between the two specified positions.
  * @throws {Error} Throws an error indicating that the method is not implemented.
  */
  LengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new Error("Not implemented");
  }

  /**
  * Vector that is tangential to the curve at the specified position.
  * If the shape is a closed shape, `relativePosition` = {any integer} where `relativePosition` = 0.
  * @param {number} relativePosition - Relative length along the path at which the tangent vector is desired.
  * @returns {Vector} The tangential vector at the specified position.
  * @throws {Error} Throws an error indicating that the method is not implemented.
  */
  TangentVector(relativePosition: number): Vector {
    throw new Error("Not implemented");
  }

  /**
  * Vector that is tangential to the curve at the specified position.
  * If the shape is a closed shape, `relativePosition` = {any integer} where `relativePosition` = 0.
  * @param {number} relativePosition - Relative length along the path at which the tangent vector is desired.
  * @returns {Vector} The tangential vector at the specified position.
  * @throws {Error} Throws an error indicating that the method is not implemented.
  */
  NormalVector(relativePosition: number): Vector {
    throw new Error("Not implemented");
  }

  /**
  * Coordinate of the curve at the specified position.
  * If the shape is a closed shape, `relativePosition` = {any integer} where `relativePosition` = 0.
  * @param {number} relativePosition - Relative position along the path at which the coordinate is desired.
  * @returns {PolarCoordinate} The polar coordinate at the specified position.
  * @throws {Error} Throws an error indicating that the method is not implemented.
  */
  CoordinatePolar(relativePosition: number): PolarCoordinate {
    throw new Error("Not implemented");
  }

  /**
   * X-coordinates on the curve that corresponds to the y-coordinate given.
   * @param {number} y - Y-coordinate for which x-coordinates are desired.
   * @returns {number[]} Array of x-coordinates corresponding to the given y-coordinate.
   */
  XsAtY(y: number): number[] {
    const innerSqrt = this.Radius ** 2 - (y - this.LocalOrigin.Y) ** 2;
    if (innerSqrt < 0) {
      return [];
    }
    const x = Math.sqrt(innerSqrt);
    return [x + this.LocalOrigin.X, -x + this.LocalOrigin.X];
  }

  /**
  * Y-coordinates on the curve that corresponds to the x-coordinate given.
  * @param {number} x - X-coordinate for which y-coordinates are desired.
  * @returns {number[]} Array of y-coordinates corresponding to the given x-coordinate.
  */
  YsAtX(x: number): number[] {
    const innerSqrt = this.Radius ** 2 - (x - this.LocalOrigin.X) ** 2;
    if (innerSqrt < 0) {
      return [];
    }
    const y = Math.sqrt(innerSqrt);
    return [y + this.LocalOrigin.Y, -y + this.LocalOrigin.Y];
  }

  // The radii measured from the local coordinate origin as a function of the angle in local coordinates.
  // angleRadians: The angle in local coordinates [Angle or radians].
  // Returns: Array of numbers representing radii.
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {(Angle | number)} angle
 * @returns {number[]}
 */
  public RadiiAboutOrigin(angle: Angle | number): number[] {
    return [this.Radius];
  }

  // TODO Useful? Not used yet
  // The length between the provided points along a circular curve, assumed to be about the origin.
  // pointI: Point i.
  // pointJ: Point j.
  // Returns: Length between the points.
  // public static LengthBetween(pointI: CartesianCoordinate, pointJ: CartesianCoordinate): number {
  //     const angle: AngularOffset = AngularOffset.CreateFromPoints(pointI, CartesianCoordinate.Origin(), pointJ);
  //     const radius: number = pointI.OffsetFrom(CartesianCoordinate.Origin()).Length();
  //     return this.LengthBetween(angle, radius);
  // }

  // The length between the provided points along a circular curve.
  // pointI: Point i.
  // pointJ: Point j.
  // radius: Arc radius.
  // Returns: Length between the points.
  // public static LengthBetween(pointI: CartesianCoordinate, pointJ: CartesianCoordinate, radius: number): number {
  //     const intersection: IntersectionCircularCircular = new IntersectionCircularCircular(
  //         new CircularCurve(radius, pointI),
  //         new CircularCurve(radius, pointJ)
  //     );

  //     // Shape is symmetric, so it doesn't matter if the 1st or 2nd intersection coordinate is taken.
  //     const center: CartesianCoordinate = intersection.IntersectionCoordinates()[0];
  //     const angle: AngularOffset = AngularOffset.CreateFromPoints(pointI, center, pointJ);
  //     return this.LengthBetween(angle, radius);
  // }

  // The length within the provided rotation along a circular curve.
  // rotation: Rotation to get arc length between.
  // radius: Arc radius.
  // Returns: Arc length.
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {AngularOffset} rotation
 * @param {number} radius
 * @returns {number}
 */
  public static LengthBetween(rotation: AngularOffset, radius: number): number {
    const length: number = rotation.LengthArc(radius);

    return (length === 0 && rotation.Delta().Radians !== 0) ?
      Numbers.TwoPi * radius :
      length;
  }

  /**
       * Determines if the curves are tangent to each other.
       * @param curve1 The first circular curve.
       * @param curve2 The second circular curve.
       * @returns True if the curves are tangent, false otherwise.
       */
  public static AreTangent(curve1: CircularCurve, curve2: CircularCurve): boolean {
    return IntersectionCircularCircular.AreTangent(curve1, curve2);
  }

  /**
  * Determines if the curves intersect each other.
  * @param curve1 The first circular curve.
  * @param curve2 The second circular curve.
  * @returns True if the curves intersect, false otherwise.
  */
  public static AreIntersecting(curve1: CircularCurve, curve2: CircularCurve): boolean {
    return IntersectionCircularCircular.AreIntersecting(curve1, curve2);
  }

  /**
  * Coordinates of where a perpendicular projection intersects the provided coordinate.
  * The first coordinate is of the closer intersection.
  * Returns infinity if the point is coincident with the circular curve center.
  * @param point The point.
  * @param referenceArc The line to which a perpendicular projection is drawn.
  * @returns Tuple containing CartesianCoordinates representing the closer and farther intersections.
  */
  public static CoordinatesOfPerpendicularProjection(
    point: CartesianCoordinate,
    referenceArc: CircularCurve
  ): [CartesianCoordinate, CartesianCoordinate] {
    if (point.equals(referenceArc.Center)) {
      return [new CartesianCoordinate(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), new CartesianCoordinate(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)];
    }

    const ray: LinearCurve = new LinearCurve(referenceArc.Center, point);
    const intersectionCoordinates: CartesianCoordinate[] = referenceArc.IntersectionCoordinateLinear(ray);

    const distance1: number = CartesianOffset.lengthBetween(point, intersectionCoordinates[0]);
    const distance2: number = CartesianOffset.lengthBetween(point, intersectionCoordinates[1]);
    const intersectionClose: CartesianCoordinate = (distance1 < distance2) ? intersectionCoordinates[0] : intersectionCoordinates[1];
    const intersectionFar: CartesianCoordinate = (distance1 < distance2) ? intersectionCoordinates[1] : intersectionCoordinates[0];

    return [intersectionClose, intersectionFar];
  }

  /**
  * Gets the major vertex.
  * @param radius The radius.
  * @param center The center.
  * @returns CartesianCoordinate representing the major vertex.
  */
  protected static VertexMajor(radius: number, center: CartesianCoordinate): CartesianCoordinate {
    return new CartesianCoordinate(center.X + radius, center.Y);
  }

  /**
  * The coordinate of the local origin.
  * @returns The local origin.
  */
  protected GetLocalOrigin(): CartesianCoordinate {
    return this.Focus;
  }

  /**
  * Creates a new object that is a copy of the current instance.
  * @returns A new object that is a copy of this instance.
  */
  clone(): CircularCurve {
    const curve = new CircularCurve(
      this._vertexMajor,
      this._focus,
      this._tolerance
    );
    curve._range = this.Range.clone();
    return curve;
  }
}
