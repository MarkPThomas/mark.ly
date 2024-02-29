import { NotImplementedException } from "@markpthomas/common-libraries/exceptions";

import { Angle } from "../coordinates/Angle";
import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../coordinates/PolarCoordinate";
import { Vector } from "../vectors/Vector";
import { ConicSectionCurve, FocusProps, RotationProps } from "./ConicSectionCurve";
import { Curve } from "./Curve";
import { LinearCurve } from "./LinearCurve";
import { CartesianParametricEquationXY } from "./parametrics/components/CartesianParametricEquationXY";
import { ParabolicCurveParametric } from "./parametrics/ParabolicCurveParametric";

/**
 * A parabola is the set of all points whose distance from a fixed point, called the focus,
 * is equal to the distance from a fixed line, called the directrix.
 * @see {@link https://en.wikipedia.org/wiki/Parabola}
 * @extends {ConicSectionCurve}
 */
export class ParabolicCurve extends ConicSectionCurve {
  /**
   * Distance from local origin to the focus, c.
   * @readonly
   * @type {number}
   */
  public get DistanceFromFocusToLocalOrigin(): number {
    return this.DistanceFromFocusToVertexMajor();
  }

  /**
   * Distance from local origin to the directrix line, Xe.
   * @readonly
   * @type {number}
   */
  public get DistanceFromDirectrixToLocalOrigin(): number {
    return this.DistanceFromFocusToLocalOrigin;
  }

  /**
   * Distance from the focus to the directrix, p.
   * @readonly
   * @type {number}
   */
  public get DistanceFromFocusToDirectrix(): number {
    return this.SemilatusRectumDistance;
  }

  /**
   * The eccentricity, e.
   * A measure of how much the conic section deviates from being circular.
   * Distance from any point on the conic section to its focus,
   * divided by the perpendicular distance from that point to the nearest directrix.
   * @readonly
   * @type {number}
   */
  public get Eccentricity(): number {
    return 1;
  }

  /**
   * Distance from the focus to the curve along a line perpendicular to the major axis and the focus, p.
   * @readonly
   * @type {number}
   */
  public get SemilatusRectumDistance(): number {
    return 2 * this.DistanceFromFocusToLocalOrigin;
  }

  /**
 * Creates an instance of ParabolicCurve.
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @constructor
 * @protected
 * @param {(FocusProps | RotationProps)} props
 * @param {number} [tolerance=Curve.DEFAULT_TOLERANCE]
 */
  protected constructor(
    props: FocusProps | RotationProps,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    super(props, tolerance);
  }

  /**
   * Initializes a new instance of the `ParabolicCurve` class.
   * @param {CartesianCoordinate} vertexMajor The major vertex, M, which lies at the peak of the parabola.
   * @param {CartesianCoordinate} focus The focus, f.
   * @param {number} tolerance Tolerance to apply to the curve.
   */
  static fromMajorVertex(
    vertexMajor: CartesianCoordinate,
    focus: CartesianCoordinate,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    return new ParabolicCurve({
      vertexMajor,
      focus,
      distanceFromMajorVertexToLocalOrigin: 0
    });
  }

  /**
   * Initializes a new instance of the `ParabolicCurve` class.
   * @param {number} a Distance, a, from major vertex, M, to the focus, f.
   * @param {CartesianCoordinate} center The center.
   * @param {Angle} rotation The rotation offset from the horizontal x-axis.
   * @param {number} tolerance Tolerance to apply to the curve.
   */
  static fromRotation(
    a: number,
    center: CartesianCoordinate,
    rotation: Angle,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    return new ParabolicCurve({
      vertexMajor: center,
      distanceFromMajorVertexToFocus: a,
      distanceFromMajorVertexToLocalOrigin: 0,
      rotation
    });
  }

  /**
   * Creates the parametric vector.
   * @protected
   * @returns {CartesianParametricEquationXY} VectorParametric.
   */
  protected createParametricEquation(): CartesianParametricEquationXY {
    return new ParabolicCurveParametric(this);
  }

  /**
   * X-coordinate on the line segment that corresponds to the y-coordinate given.
   * @param {number} y Y-coordinate for which an x-coordinate is desired.
   * @returns {number}
   */
  public XatY(y: number): number {
    return y ** 2 / (4 * this.DistanceFromVertexMajorToLocalOrigin);
  }

  /**
   * +Y-coordinate on the line segment that corresponds to the x-coordinate given.
   * @param {number} x X-coordinate for which a +y-coordinate is desired.
   * @returns {number}
   */
  public YatX(x: number): number {
    return 2 * (this.DistanceFromVertexMajorToLocalOrigin * x) ** 0.5;
  }

  /**
   * X-coordinate on the curve in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Angle of rotation about the focus [Angle or Radians].
   * @returns {number}
   */
  public XbyRotationAboutFocusRight(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    return (
      this.DistanceFromVertexMajorToLocalOrigin +
      this.RadiusAboutFocusRight(Angle.fromRadians(angleRadians)) * Math.cos(angleRadians)
    );
  }

  /**
   * X-coordinate on the curve in local coordinates about the left (-X) focus that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Angle of rotation about the left (-X) focus [Angle or Radians].
   * @returns {number}
   */
  public XbyRotationAboutFocusLeft(angle: Angle | number): number {
    return this.XbyRotationAboutFocusRight(this.asRadians(angle));
  }

  /**
   * Returns a string that represents this instance.
   * @returns {string} A string that represents this instance.
   */
  public toString(): string {
    return (
      ParabolicCurve.name +
      ' - Center: {X: ' +
      this.LocalOrigin.X +
      ', Y: ' +
      this.LocalOrigin.Y +
      '}, Rotation: ' +
      this._rotation.Radians +
      ' rad' +
      ', c: ' +
      this.DistanceFromFocusToLocalOrigin +
      ', I: {X: ' +
      this._limitStartDefault.X +
      ', Y: ' +
      this._limitStartDefault.Y +
      '}, J: {X: ' +
      this._limitEndDefault.X +
      ', Y: ' +
      this._limitEndDefault.Y +
      '}'
    );
  }

  /**
   * Length of the curve.
   * @returns {number} System.Double.
   */
  public Length(): number {
    throw new NotImplementedException();
  }

  /**
   * Length of the curve between two points.
   * @param {number} relativePositionStart Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd Relative position along the path at which the length measurement is ended.
   * @returns {number} System.Double.
   */
  public LengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new NotImplementedException();
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @returns {number} System.Double.
   */
  public ChordLength(): number {
    return LinearCurve.LengthBetweenPts(this._range.start.Limit, this._range.end.Limit);
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd Relative position along the path at which the length measurement is ended.
   * @returns {number} System.Double.
   */
  public ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new NotImplementedException();
  }

  /**
   * The chord connecting the start and end limits.
   * @returns {LinearCurve}
   */
  public Chord(): LinearCurve {
    return new LinearCurve(this._range.start.Limit, this._range.end.Limit);
  }

  /**
   * The chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the linear curve is started.
   * @param {number} relativePositionEnd Relative position along the path at which the linear curve is ended.
   * @returns {LinearCurve}
   */
  public ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    throw new NotImplementedException();
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the tangent vector is desired.
   * @returns {Vector}
   */
  public TangentVector(relativePosition: number): Vector {
    throw new NotImplementedException();
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the tangent vector is desired.
   * @returns {Vector}
   */
  public NormalVector(relativePosition: number): Vector {
    throw new NotImplementedException();
  }

  /**
   * Coordinate of the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the coordinate is desired.
   * @returns {PolarCoordinate}
   */
  public CoordinatePolar(relativePosition: number): PolarCoordinate {
    throw new NotImplementedException();
  }

  /**
   * X-coordinates on the curve that correspond to the y-coordinate given.
   * @param {number} y Y-coordinate for which x-coordinates are desired.
   * @returns {number[]}
   */
  public XsAtY(y: number): number[] {
    throw new NotImplementedException();
  }

  /**
   * Y-coordinates on the curve that correspond to the x-coordinate given.
   * @param {number} x X-coordinate for which a y-coordinate is desired.
   * @returns {number[]}
   */
  public YsAtX(x: number): number[] {
    throw new NotImplementedException();
  }

  /**
   * The coordinate of the local origin.
   * @readonly
   * @type {CartesianCoordinate}
   */
  GetLocalOrigin(): CartesianCoordinate {
    return this._vertexMajor;
  }

  /**
   * Gets the minor vertices.
   * @protected
   * @returns {[CartesianCoordinate, CartesianCoordinate]}
   */
  protected GetVerticesMinor(): [CartesianCoordinate, CartesianCoordinate] {
    return this.GetVerticesMinorByPt(this._focus);
  }

  /**
   * Distance from local origin to minor Vertex, b.
   * @param {number} a Distance, a, from local origin to major vertex, M.
   * @param {number} c Distance, c, from local origin to the focus, f.
   * @returns {number}
   */
  protected distanceFromVertexMinorToMajorAxis(a: number, c: number): number {
    return 2 * c;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {object} A new object that is a copy of this instance.
   */
  clone(): ParabolicCurve {
    const curve = ParabolicCurve.fromMajorVertex(this._vertexMajor, this._focus, this._tolerance);
    curve._range = this.Range.clone();
    return curve;
  }
}