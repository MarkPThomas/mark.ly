import { Angle } from "../Coordinates/Angle";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { TrigonometryLibrary } from "../Trigonometry/TrigonometryLibrary";
import { Vector } from "../Vectors/Vector";
import { ConicSectionCurve, FocusProps, RotationProps } from "./ConicSectionCurve";
import { LinearCurve } from "./LinearCurve";
import { HyperbolicCurveParametric } from "./Parametrics/HyperbolicCurveParametric";


/**
 * A hyperbola is the set of all points where the difference between their distances from two fixed points (the foci) is constant.
 * In the case of a hyperbola, there are two foci and two directrices. Hyperbolas also have two asymptotes.
 * @extends {ConicSectionCurve}
 * @public
 */
export class HyperbolicCurve extends ConicSectionCurve {
  /**
   * Distance from local origin to the focus, c.
   * @readonly
   * @type {number}
   */
  public get DistanceFromFocusToLocalOrigin(): number {
    return this.DistanceFromFocusToVertexMajor() + this.DistanceFromVertexMajorToLocalOrigin;
  }

  /**
   * Distance from the focus to the curve along a line perpendicular to the major axis and the focus, p.
   * @readonly
   * @type {number}
   */
  public get SemilatusRectumDistance(): number {
    return this.DistanceFromVertexMajorToLocalOrigin * (this.Eccentricity ** 2 - 1);
  }

  /**
   * Asymptotes of the hyperbolic curve.
   * @readonly
   * @type {Tuple<LinearCurve, LinearCurve>}
   */
  public get Asymptotes(): [LinearCurve, LinearCurve] {
    const minorVertices = this.GetVerticesMinor();
    return [
      new LinearCurve(this.LocalOrigin, minorVertices[0], this.Tolerance),
      new LinearCurve(this.LocalOrigin, minorVertices[1], this.Tolerance)
    ];
  }

  /**
   * Second focus, which lies to the left of the local origin.
   * @readonly
   * @type {CartesianCoordinate}
   */
  public get Focus2(): CartesianCoordinate {
    return CartesianCoordinate.fromCoordinateOffset(this._focus, -2 * this.DistanceFromFocusToLocalOrigin, this._rotation);
  }

  /**
   * Second set of minor vertices, b which lie to the left of the local origin, along a line perpendicular to a line passing through the major vertex, a, and focus.
   * @readonly
   * @type {Tuple<CartesianCoordinate, CartesianCoordinate>}
   */
  public get VerticesMinor2(): [CartesianCoordinate, CartesianCoordinate] {
    const minorVertices = this.GetVerticesMinor();
    return [
      CartesianCoordinate.fromCoordinateOffset(minorVertices[0], -2 * this.DistanceFromVertexMajorToLocalOrigin, this._rotation),
      CartesianCoordinate.fromCoordinateOffset(minorVertices[1], -2 * this.DistanceFromVertexMajorToLocalOrigin, this._rotation)
    ];
  }

  /**
   * Second directrix, Xe, which lies to the left of the local origin.
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

  /**
   * Initializes a new instance of the HyperbolicCurve class.
   * @param {number} a Distance, a, from local origin to major vertex, M, which lies at the apex of the curve.
   * @param {CartesianCoordinate} vertexMajor The major vertex, M, which lies at the peak of the parabola.
   * @param {CartesianCoordinate} focus The focus, f.
   * @param {number} [tolerance=DEFAULT_TOLERANCE] Tolerance to apply to the curve.
   */
  protected constructor(
    a: number,
    vertexMajor?: CartesianCoordinate,
    focus?: CartesianCoordinate,
    rotation?: Angle,
    center?: CartesianCoordinate,
    b?: number,
    tolerance: number = ConicSectionCurve.DEFAULT_TOLERANCE
  ) {
    const props = HyperbolicCurve.formArguments(a, vertexMajor, focus);
    super(props, tolerance);

    if (rotation && center && b) {
      this._focus = center.offsetCoordinate(this.DistanceFromFocusToLocalOrigin, rotation);
      this._focus.Tolerance = tolerance;
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @static
 * @param {number} a
 * @param {?CartesianCoordinate} [vertexMajor]
 * @param {?CartesianCoordinate} [focus]
 * @param {?Angle} [rotation]
 * @param {?CartesianCoordinate} [center]
 * @param {?number} [b]
 * @returns {(FocusProps | RotationProps)}
 */
  protected static formArguments(
    a: number,
    vertexMajor?: CartesianCoordinate,
    focus?: CartesianCoordinate,
    rotation?: Angle,
    center?: CartesianCoordinate,
    b?: number
  ): FocusProps | RotationProps {
    if (rotation && center && b) {
      const vertexMajor = center.offsetCoordinate(a, rotation);
      const distanceFromMajorVertexToLocalOrigin = HyperbolicCurve.DistanceFromFocusToOrigin(a, b) - a;

      return {
        vertexMajor,
        distanceFromMajorVertexToLocalOrigin,
        distanceFromMajorVertexToFocus: a,
        rotation
      }
    } else if (vertexMajor && focus) {
      return {
        vertexMajor,
        focus,
        distanceFromMajorVertexToLocalOrigin: a
      }
    } else {
      return {
        vertexMajor: CartesianCoordinate.atOrigin(),
        focus: CartesianCoordinate.atOrigin(),
        distanceFromMajorVertexToLocalOrigin: 0
      }
    }
  }

  /**
   * Initializes a new instance of the HyperbolicCurve class.
   * @param {number} a Distance, a, from local origin to major vertex, M, which lies at the apex of the curve.
   * @param {CartesianCoordinate} vertexMajor The major vertex, M, which lies at the peak of the parabola.
   * @param {CartesianCoordinate} focus The focus, f.
   */
  static fromMajorVertex(
    a: number,
    vertexMajor: CartesianCoordinate,
    focus: CartesianCoordinate,
    tolerance: number = ConicSectionCurve.DEFAULT_TOLERANCE
  ): HyperbolicCurve {
    return new HyperbolicCurve(a, vertexMajor, focus, undefined, undefined, undefined, tolerance);
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
    tolerance: number = ConicSectionCurve.DEFAULT_TOLERANCE
  ): HyperbolicCurve {
    return new HyperbolicCurve(a, undefined, undefined, rotation, center, b, tolerance);
  }

  /**
   * Creates the parametric vector for the hyperbolic curve.
   * @returns {HyperbolicCurveParametric} The parametric equation for the hyperbolic curve.
   * @protected
   */
  protected createParametricEquation(): HyperbolicCurveParametric {
    return new HyperbolicCurveParametric(this);
  }

  /**
   * Calculates the positive X-coordinate on the line segment that corresponds to the given Y-coordinate.
   * @param {number} y - The Y-coordinate for which a positive X-coordinate is desired.
   * @returns {number} The positive X-coordinate on the line segment.
   * @public
   */
  public XatY(y: number): number {
    return this.DistanceFromVertexMajorToLocalOrigin
      * Math.sqrt((y / this.DistanceFromVertexMinorToMajorAxis) ** 2 + 1);
  }

  /**
   * Calculates the positive Y-coordinate on the line segment that corresponds to the given X-coordinate.
   * @param {number} x - The X-coordinate for which a positive Y-coordinate is desired.
   * @returns {number} The positive Y-coordinate on the line segment.
   * @public
   */
  public YatX(x: number): number {
    return this.DistanceFromVertexMinorToMajorAxis
      * Math.sqrt((x / this.DistanceFromVertexMajorToLocalOrigin) ** 2 - 1);
  }

  /**
   * X-coordinate on the right curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate in radians.
   * @returns {number} The X-coordinate value.
   */
  public XbyRotationAboutOriginRight(angle: Angle | number): number {
    return this.XbyRotationAboutOrigin(angle);
  }

  /**
   * X-coordinate on the left curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate in radians.
   * @returns {number} The X-coordinate value.
   */
  public XbyRotationAboutOriginLeft(angle: Angle | number): number {
    return -1 * this.XbyRotationAboutOrigin(angle);
  }

  /**
   * X-coordinate on the curve in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Angle of rotation about the focus [Angle or Radians].
   * @returns {number} The X-coordinate value.
   */
  public override XbyRotationAboutFocusRight(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    return this.DistanceFromFocusToLocalOrigin
      + this.RadiusAboutFocusRight(angleRadians) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * X-coordinate on the curve in local coordinates about the left (-X) focus that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Angle of rotation about the left (-X) focus [Angle or Radians].
   * @returns {number} The X-coordinate value.
   */
  public override XbyRotationAboutFocusLeft(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    return -1 * this.DistanceFromFocusToLocalOrigin
      + this.RadiusAboutFocusLeft(angleRadians) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Returns a string representation of this instance.
   * @returns {string} A string representation of this instance.
   */
  public toString(): string {
    return `${HyperbolicCurve.name} - `
      + `Center: {X: ${this.LocalOrigin.X}, Y: ${this.LocalOrigin.Y}}, `
      + `Rotation: ${this._rotation.Radians} rad, `
      + `a: ${this.DistanceFromVertexMajorToLocalOrigin}, b: ${this.DistanceFromVertexMinorToMajorAxis}, `
      + `I: {X: ${this._limitStartDefault.X}, Y: ${this._limitStartDefault.Y}}, `
      + `J: {X: ${this._limitEndDefault.X}, Y: ${this._limitEndDefault.Y}}`;
  }

  /**
   * Length of the curve.
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
   * X-coordinates on the curve that correspond to the y-coordinate given.
   * @param {number} y Y-coordinate for which x-coordinates are desired.
   * @returns {number[]} Array of X-coordinates corresponding to the given Y-coordinate.
   */
  public override XsAtY(y: number): number[] {
    throw new Error('Not Implemented');
  }

  /**
   * Y-coordinates on the curve that correspond to the x-coordinate given.
   * @param {number} x X-coordinate for which y-coordinates are desired.
   * @returns {number[]} Array of Y-coordinates corresponding to the given X-coordinate.
   */
  public override YsAtX(x: number): number[] {
    throw new Error('Not Implemented');
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
   * @returns {Tuple<CartesianCoordinate, CartesianCoordinate>} Tuple containing minor vertices.
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
  protected static DistanceFromFocusToOrigin(a: number, b: number): number {
    return Math.hypot(a, b);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {object} A new object that is a copy of this instance.
   */
  clone(): HyperbolicCurve {
    const curve = new HyperbolicCurve(
      this.DistanceFromVertexMajorToLocalOrigin,
      this._vertexMajor,
      this._focus,
      undefined,
      undefined,
      this._tolerance
    );
    curve._range = this.Range.clone();
    return curve;
  }
}
