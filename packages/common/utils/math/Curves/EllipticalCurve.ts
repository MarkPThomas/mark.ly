import { Angle } from "../Coordinates/Angle";
import { AngularOffset } from "../Coordinates/AngularOffset";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { CartesianOffset } from "../Coordinates/CartesianOffset";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { Vector } from "../Vectors/Vector";
import { RotationProps } from "./ConicSectionCurve";
import { ConicSectionEllipticCurve } from "./ConicSectionEllipticCurve";
import { Curve } from "./Curve";
import { LinearCurve } from "./LinearCurve";


/**
 * An ellipse is the set of all points for which the sum of the distances from two fixed points (the foci) is constant.
 * In the case of an ellipse, there are two foci, and two directrices.
 * @extends {ConicSectionEllipticCurve}
 * @public
 */
export class EllipticalCurve extends ConicSectionEllipticCurve {
  /**
   * Distance from local origin to the focus, c.
   * @readonly
   * @type {number}
   */
  public get DistanceFromFocusToLocalOrigin(): number {
    return this.DistanceFromVertexMajorToLocalOrigin - CartesianOffset.lengthBetween(this._focus, this._vertexMajor);
  }

  /**
   * Distance from the focus to the curve along a line perpendicular to the major axis and the focus, p.
   * @readonly
   * @type {number}
   */
  public get SemilatusRectumDistance(): number {
    return this.DistanceFromVertexMajorToLocalOrigin * (1 - this.Eccentricity ** 2);
  }

  /**
   * Second focus, which lies to the right of the local origin.
   * @readonly
   * @type {CartesianCoordinate}
   */
  public get Focus2(): CartesianCoordinate {
    return this._focus.offsetCoordinate(-2 * this.DistanceFromFocusToLocalOrigin, this._rotation);
  }

  /**
   * Second directrix, Xe, which lies to the right of the local origin.
   * @readonly
   * @type {LinearCurve}
   */
  public get Directrix2(): LinearCurve {
    const directrices = this.GetVerticesDirectrix();
    return new LinearCurve(
      directrices[0].offsetCoordinate(-2 * this.DistanceFromDirectrixToLocalOrigin, this._rotation),
      directrices[1].offsetCoordinate(-2 * this.DistanceFromDirectrixToLocalOrigin, this._rotation),
      this._tolerance
    );
  }

  protected constructor(
    vertexMajorOrRotation: CartesianCoordinate | Angle,
    center: CartesianCoordinate,
    b: number,
    a?: number,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    const props = EllipticalCurve.formArguments(a, b, center, vertexMajorOrRotation);
    super(props, tolerance);
  }

  protected static formArguments(
    a: number | undefined,
    b: number,
    center: CartesianCoordinate,
    vertexMajorOrRotation: CartesianCoordinate | Angle
  ): RotationProps {
    if (vertexMajorOrRotation instanceof CartesianCoordinate) {
      const vertexMajor = vertexMajorOrRotation;
      const distanceFromMajorVertexToLocalOrigin = this.GetDistanceFromMajorVertexToLocalOrigin(vertexMajor, center);
      const distanceFromMajorVertexToFocus = EllipticalCurve.getDistanceFromMajorVertexToFocus(vertexMajor, center, b);
      const rotation = this.GetRotation(vertexMajor, center);

      return {
        vertexMajor,
        distanceFromMajorVertexToLocalOrigin,
        distanceFromMajorVertexToFocus,
        rotation
      }
    } else if (vertexMajorOrRotation instanceof Angle && a !== undefined) {
      const rotation = vertexMajorOrRotation;
      const vertexMajor = this.GetMajorVertex(center, a, rotation);
      const distanceFromMajorVertexToLocalOrigin = a;
      const distanceFromMajorVertexToFocus = EllipticalCurve.getDistanceFromMajorVertexToFocusByLengths(a, b);

      return {
        vertexMajor,
        distanceFromMajorVertexToLocalOrigin,
        distanceFromMajorVertexToFocus,
        rotation
      }
    } else {
      return {
        vertexMajor: CartesianCoordinate.atOrigin(),
        distanceFromMajorVertexToLocalOrigin: 0,
        distanceFromMajorVertexToFocus: 0,
        rotation: Angle.atOrigin()
      }
    }
  }

  /**
   * Initializes a new instance of the EllipticalCurve class.
   * @param {CartesianCoordinate} vertexMajor The major vertex, M.
   * @param {number} b Distance, b, from local origin to minor vertex, m.
   * @param {CartesianCoordinate} center The coordinate of the local origin.
   * @param {number} [tolerance=DEFAULT_TOLERANCE] Tolerance to apply to the curve.
   */
  static fromMajorVertex(
    vertexMajor: CartesianCoordinate,
    b: number,
    center: CartesianCoordinate,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ): EllipticalCurve {
    return new EllipticalCurve(vertexMajor, center, b, undefined, tolerance);
  }

  /**
   * Initializes a new instance of the EllipticalCurve class.
   * @param {number} a Distance, a, from local origin to major vertex, M.
   * @param {number} b Distance, b, from local origin to minor vertex, m.
   * @param {CartesianCoordinate} center The coordinate of the local origin.
   * @param {AngularOffset} rotation The rotation offset from the horizontal x-axis.
   * @param {number} [tolerance=DEFAULT_TOLERANCE] Tolerance to apply to the curve.
   */
  static fromRotation(
    a: number,
    b: number,
    center: CartesianCoordinate,
    rotation: Angle,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ): EllipticalCurve {
    return new EllipticalCurve(rotation, center, b, a, tolerance);
  }

  /**
   * +X-coordinate on the curve that corresponds to the y-coordinate given.
   * @param {number} y Y-coordinate for which an x-coordinate is desired.
   * @returns {number} The X-coordinate value.
   */
  public override XatY(y: number): number {
    return this.DistanceFromVertexMajorToLocalOrigin * Math.sqrt(1 - (y / this.DistanceFromVertexMinorToMajorAxis) ** 2);
  }

  /**
   * +Y-coordinate on the curve that corresponds to the x-coordinate given.
   * @param {number} x X-coordinate for which a y-coordinate is desired.
   * @returns {number} The Y-coordinate value.
   */
  public override YatX(x: number): number {
    return this.DistanceFromVertexMinorToMajorAxis * Math.sqrt(1 - (x / this.DistanceFromVertexMajorToLocalOrigin) ** 2);
  }

  /**
   * The length within the provided rotation along an elliptical curve.
   * @param {AngularOffset} rotation Rotation to get arc length between.
   * @returns {number} The arc length.
   */
  public override LengthBetweenAngles(rotation: AngularOffset): number {
    return EllipticalCurve.LengthBetweenAnglesEllipse(
      rotation,
      this.DistanceFromVertexMajorToLocalOrigin,
      this.DistanceFromVertexMinorToMajorAxis
    );
  }

  /**
   * Returns a string representation of this instance.
   * @returns {string} A string representation of this instance.
   */
  public toString(): string {
    return `${EllipticalCurve.name} - `
      + `Center: {X: ${this.LocalOrigin.X}, Y: ${this.LocalOrigin.Y}}, `
      + `Rotation: ${this._rotation.Radians} rad, `
      + `a: ${this.DistanceFromVertexMajorToLocalOrigin}, b: ${this.DistanceFromVertexMinorToMajorAxis}, `
      + `I: {X: ${this._limitStartDefault.X}, Y: ${this._limitStartDefault.Y}}, `
      + `J: {X: ${this._limitEndDefault.X}, Y: ${this._limitEndDefault.Y}}`;
  }

  /**
   * Length of the curve.
   * @see {@link https://www.mathsisfun.com/geometry/ellipse-perimeter.html}
   * @returns {number} The length of the curve.
   */
  public override Length(): number {
    throw new Error('Not Implemented');
  }

  /**
   * Length of the curve between two points.
   * @param {number} relativePositionStart Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd Relative position along the path at which the length measurement is ended.
   * @returns {number} The length of the curve between two points.
   */
  public override LengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new Error('Not Implemented');
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @returns {number} The length of the chord connecting the start and end limits.
   */
  public override ChordLength(): number {
    return LinearCurve.LengthBetweenPts(this._range.start.Limit, this._range.end.Limit);
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd Relative position along the path at which the length measurement is ended.
   * @returns {number} The length of the chord connecting the start and end limits.
   */
  public override ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new Error('Not Implemented');
  }

  /**
   * The chord connecting the start and end limits.
   * @returns {LinearCurve} The chord connecting the start and end limits.
   */
  public override Chord(): LinearCurve {
    return new LinearCurve(this._range.start.Limit, this._range.end.Limit);
  }

  /**
   * The chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the linear curve is started.
   * @param {number} relativePositionEnd Relative position along the path at which the linear curve is ended.
   * @returns {LinearCurve} The chord connecting the start and end limits.
   */
  public override ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    throw new Error('Not Implemented');
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the tangent vector is desired.
   * @returns {Vector} The tangential vector at the specified position.
   */
  public override TangentVector(relativePosition: number): Vector {
    throw new Error('Not Implemented');
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the tangent vector is desired.
   * @returns {Vector} The normal vector at the specified position.
   */
  public override NormalVector(relativePosition: number): Vector {
    throw new Error('Not Implemented');
  }

  /**
   * Coordinate of the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the coordinate is desired.
   * @returns {PolarCoordinate} The polar coordinate at the specified position.
   */
  public override CoordinatePolar(relativePosition: number): PolarCoordinate {
    throw new Error('Not Implemented');
  }

  /**
     * X-coordinates on the curve that corresponds to the y-coordinate given.
     * @param {number} y - Y-coordinate for which x-coordinates are desired.
     * @returns {number[]} An array of x-coordinates.
     * @override
     */
  override XsAtY(y: number): number[] {
    const x: number = this.XatY(y);
    return [x, -x];
  }

  /**
   * Y-coordinates on the curve that corresponds to the x-coordinate given.
   * @param {number} x - X-coordinate for which y-coordinates are desired.
   * @returns {number[]} An array of y-coordinates.
   * @override
   */
  override YsAtX(x: number): number[] {
    const y: number = this.YatX(x);
    return [y, -y];
  }

  /**
     * Calculates the radii measured from the local coordinate origin as a function of the angle in local coordinates.
     * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
     * @returns {number[]} An array containing the radii measured from the local coordinate origin.
     * @public
     */
  public RadiiAboutOrigin(angle: Angle | number): number[] {
    const angleRadians = this.asRadians(angle);

    const radiusLeft = this.RadiusAboutFocusLeft(this.RotationAboutFocusLeftByRotationAboutOrigin(angleRadians));
    const radiusRight = this.RadiusAboutFocusRight(this.RotationAboutFocusRightByRotationAboutOrigin(angleRadians));

    return [radiusLeft, radiusRight];
  }

  /**
     * Calculates the length within the provided rotation along an elliptical curve.
     * @see {@link https://math.stackexchange.com/questions/2901129/what-is-the-fastest-way-to-estimate-the-arc-length-of-an-ellipse}
     * @param {AngularOffset} rotation - Rotation to get arc length between.
     * @param {number} majorAxisLength - The length from the origin to the major vertex (a).
     * @param {number} minorAxisLength - The length from the origin to the minor vertex (b).
     * @returns {number} The arc length between the provided rotations.
     * @static
     */
  public static LengthBetweenAnglesEllipse(rotation: AngularOffset, majorAxisLength: number, minorAxisLength: number): number {
    throw new Error('Not implemented');
  }


  /**
   * Gets the distance from the major vertex to the focus.
   * @param {CartesianCoordinate} vertexMajor - The major vertex.
   * @param {CartesianCoordinate} localOrigin - The local origin.
   * @param {number} b - Length from the origin to the minor vertex.
   * @returns {number} The distance from major vertex to focus.
   * @protected
   * @static
   */
  protected static getDistanceFromMajorVertexToFocus(
    vertexMajor: CartesianCoordinate,
    localOrigin: CartesianCoordinate,
    b: number
  ): number {
    const a = EllipticalCurve.GetDistanceFromMajorVertexToLocalOrigin(vertexMajor, localOrigin);
    return EllipticalCurve.getDistanceFromMajorVertexToFocusByLengths(a, b);
  }

  /**
   * Gets the distance from the major vertex to the focus.
   * @param {number} a - Length from the origin to the major vertex.
   * @param {number} b - Length from the origin to the minor vertex.
   * @returns {number} The distance from major vertex to focus.
   * @protected
   * @static
   */
  protected static getDistanceFromMajorVertexToFocusByLengths(a: number, b: number): number {
    return a - EllipticalCurve.distanceFromFocusToOrigin(a, b);
  }


  /**
   * The coordinate of the local origin.
   * @readonly
   * @type {CartesianCoordinate}
   */
  protected override GetLocalOrigin(): CartesianCoordinate {
    return this._vertexMajor.offsetCoordinate(-this.DistanceFromVertexMajorToLocalOrigin, this._rotation);
  }

  /**
   * Gets the vertex major2 coordinate.
   * @returns {CartesianCoordinate} The vertex major2 coordinate.
   */
  protected override GetVertexMajor2(): CartesianCoordinate {
    return this._vertexMajor.offsetCoordinate(-2 * this.DistanceFromVertexMajorToLocalOrigin, this._rotation);
  }

  /**
   * Gets the minor vertices.
   * @returns {[CartesianCoordinate, CartesianCoordinate]} Tuple containing minor vertices.
   */
  protected override GetVerticesMinor(): [CartesianCoordinate, CartesianCoordinate] {
    return this.GetVerticesMinorByPt(this._vertexMajor);
  }

  /**
   * Distance, b, from minor vertex, m, to the major axis, which is a line that passes through the major vertex, M, and the focus, f.
   * @param {number} a Distance, a, from local origin to major vertex, M.
   * @param {number} c Distance, c, from local origin to the focus, f.
   * @returns {number} Distance from minor vertex to major axis.
   */
  protected override distanceFromVertexMinorToMajorAxis(a: number, c: number): number {
    return Math.sqrt(c ** 2 - a ** 2);
  }

  /**
   * Distance, c, from focus, f, to origin.
   * @param {number} a Distance, a.
   * @param {number} b Distance, b.
   * @returns {number} Distance from focus to origin.
   */
  protected static distanceFromFocusToOrigin(a: number, b: number): number {
    return Math.sqrt(a ** 2 + b ** 2);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {EllipticalCurve} A new object that is a copy of this instance.
   */
  clone(): EllipticalCurve {
    const curve = EllipticalCurve.fromMajorVertex(
      this._vertexMajor,
      this.DistanceFromVertexMinorToMajorAxis,
      this._focus,
      this._tolerance
    );
    curve._range = this.Range.clone();
    return curve;
  }
}
