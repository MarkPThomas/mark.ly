import { Angle } from "../Coordinates/Angle";
import { AngularOffset } from "../Coordinates/AngularOffset";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { Numbers } from "../Numbers";
import { TrigonometryLibrary } from "../Trigonometry/TrigonometryLibrary";
import { ConicSectionCurve, FocusProps, RotationProps } from "./ConicSectionCurve";
import { Curve } from "./Curve";
import { ICurveLimits } from "./ICurveLimits";
import { LinearCurve } from "./LinearCurve";
import { CartesianParametricEquationXY } from "./Parametrics/Components/CartesianParametricEquationXY";
import { EllipticalCurveParametric } from "./Parametrics/EllipticalCurveParametric";


/**
 * Conic section curves that may form closed shapes.
 * @extends {ConicSectionCurve}
 * @implements {ICurveLimits}
 */
export abstract class ConicSectionEllipticCurve extends ConicSectionCurve implements ICurveLimits {
  /**
 * Creates an instance of ConicSectionEllipticCurve.
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
   * Creates the parametric vector.
   * @returns {CartesianParametricEquationXY}
   * @protected
   * @override
   */
  protected override createParametricEquation(): CartesianParametricEquationXY {
    return new EllipticalCurveParametric(this);
  }

  /**
   * Determines whether the curve is closed.
   * @returns {boolean} `true` if the curve is closed; otherwise, `false`.
   */
  isClosedCurve(): boolean {
    return this.Range.start.Limit === this.Range.end.Limit;
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @returns {number}
   * @override
   */
  ChordLength(): number {
    return LinearCurve.LengthBetweenPts(this.Range.start.Limit, this.Range.end.Limit);
  }

  /**
   * The length of the chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd Relative position along the path at which the length measurement is ended.
   * @returns {number}
   * @override
   */
  ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    return LinearCurve.LengthBetweenPts(
      this.CoordinateCartesian(relativePositionStart),
      this.CoordinateCartesian(relativePositionEnd)
    );
  }

  /**
   * The chord connecting the start and end limits.
   * @returns {LinearCurve}
   * @override
   */
  Chord(): LinearCurve {
    return new LinearCurve(this.Range.start.Limit, this.Range.end.Limit);
  }

  /**
   * The chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the linear curve is started.
   * @param {number} relativePositionEnd Relative position along the path at which the linear curve is ended.
   * @returns {LinearCurve}
   * @override
   */
  ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    return new LinearCurve(
      this.CoordinateCartesian(relativePositionStart),
      this.CoordinateCartesian(relativePositionEnd)
    );
  }

  /**
   * The radius measured from the right (+X) major vertex as a function of the angle in local coordinates.
   * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
   * @returns {number}
   * @override
   */
  RadiusAboutVertexMajorRight(angle: Angle | number): number {
    return this.RadiusAboutVertexMajorLeft(this.asRadians(angle));
  }

  /**
   * The radius measured from the left focus (-X) as a function of the angle in local coordinates.
   * @param {Angle | number} angleRadians The angle in local coordinates [Angle or radians].
   * @returns {number}
   * @override
   */
  RadiusAboutFocusLeft(angle: Angle | number): number {
    return super.RadiusAboutFocusRight(this.asRadians(angle));
  }

  /**
   * The radius measured from the left (-X) major vertex as a function of the angle in local coordinates.
   * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
   * @returns {number}
   * @override
   */
  RadiusAboutVertexMajorLeft(angle: Angle | number): number {
    return this.RadiusAboutVertexMajorRight(this.asRadians(angle));
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the x-coordinate given.
   * @param {number} x X-coordinate.
   * @returns {number}
   */
  SlopeAtX(x: number): number {
    return -1
      * (this.DistanceFromVertexMinorToMajorAxis / this.DistanceFromVertexMajorToLocalOrigin)
      * (x / Math.sqrt(this.DistanceFromVertexMajorToLocalOrigin ** 2 - x ** 2));
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the y-coordinate given.
   * @param {number} y Y-coordinate.
   * @returns {number}
   */
  SlopeAtY(y: number): number {
    return this.SlopeAtX(this.XatY(y));
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number}
   * @override
   */
  SlopeByAngle(angleRadians: number): number {
    return -1
      * (this.DistanceFromVertexMinorToMajorAxis / this.DistanceFromVertexMajorToLocalOrigin)
      * TrigonometryLibrary.Cot(angleRadians);
  }

  /**
   * The length within the provided rotation along an elliptical curve.
   * @param {AngularOffset} rotation Rotation to get arc length between.
   * @returns {number}
   * @abstract
   */
  abstract LengthBetweenAngles(rotation: AngularOffset): number;

  /**
   * +X-coordinate on the line segment that corresponds to the y-coordinate given.
   * @param {number} y Y-coordinate for which a +x-coordinate is desired.
   * @returns {number}
   * @override
   */
  XatY(y: number): number {
    return this.DistanceFromVertexMajorToLocalOrigin * Math.sqrt(1 - (y / this.DistanceFromVertexMinorToMajorAxis) ** 2);
  }

  /**
   * +Y-coordinate on the line segment that corresponds to the x-coordinate given.
   * @param {number} x X-coordinate for which a +y-coordinate is desired.
   * @returns {number}
   * @override
   */
  YatX(x: number): number {
    return this.DistanceFromVertexMinorToMajorAxis * Math.sqrt(1 - (x / this.DistanceFromVertexMajorToLocalOrigin) ** 2);
  }

  /**
   * X-coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number}
   * @override
   */
  XbyRotationAboutOrigin(angleRadians: number): number {
    return (this.DistanceFromVertexMajorToLocalOrigin * TrigonometryLibrary.Cos(angleRadians));
  }

  /**
   * Y-coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number}
   * @override
   */
  YbyRotationAboutOrigin(angleRadians: number): number {
    return (this.DistanceFromVertexMinorToMajorAxis * TrigonometryLibrary.Sin(angleRadians));
  }

  /**
   * X-coordinate on the curve in local coordinates about the focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the focus, in radians.
   * @returns {number}
   * @override
   */
  XbyRotationAboutFocusRight(angleRadians: number): number {
    return this.DistanceFromFocusToLocalOrigin + this.RadiusAboutFocusRight(angleRadians) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * X-coordinate on the curve in local coordinates about the left (-X) focus that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the left (-X) focus, in radians.
   * @returns {number}
   * @override
   */
  XbyRotationAboutFocusLeft(angleRadians: number): number {
    return -1 * this.DistanceFromFocusToLocalOrigin + this.RadiusAboutFocusLeft(angleRadians) * TrigonometryLibrary.Cos(angleRadians);
  }

  /**
   * Gets the minor vertices.
   * @returns {[CartesianCoordinate, CartesianCoordinate]} Tuple containing minor vertices.
   * @protected
   * @override
   */
  protected override GetVerticesMinor(): [CartesianCoordinate, CartesianCoordinate] {
    return this.GetVerticesMinorByPt(this.LocalOrigin);
  }

  /**
   * Gets the vertex major2 coordinate.
   * @returns {CartesianCoordinate}
   * @protected
   * @override
   */
  protected override GetVertexMajor2(): CartesianCoordinate {
    return this._vertexMajor.offsetCoordinate(-2 * this.DistanceFromVertexMajorToLocalOrigin, this._rotation);
  }

  /**
   * Distance from local origin to minor Vertex, b.
   * @param {number} a Distance from local origin to major vertex, a.
   * @param {number} c Distance from local origin to the focus, c.
   * @returns {number}
   * @protected
   * @override
   */
  protected override distanceFromVertexMinorToMajorAxis(a: number, c: number): number {
    return Math.sqrt(a ** 2 - c ** 2);
  }

  /**
   * Gets the directrix vertices.
   * @returns {[CartesianCoordinate, CartesianCoordinate]} Tuple containing directrix vertices.
   * @protected
   * @override
   */
  protected override GetVerticesDirectrix(): [CartesianCoordinate, CartesianCoordinate] {
    const rotation = new Angle(this._rotation.Radians + Numbers.PiOver2);
    if (this.DistanceFromFocusToDirectrix === Number.POSITIVE_INFINITY || this.DistanceFromFocusToDirectrix === Number.NEGATIVE_INFINITY) {
      return [
        new CartesianCoordinate(this.DistanceFromFocusToDirectrix, 0),
        new CartesianCoordinate(this.DistanceFromFocusToDirectrix, 1)
      ];
    }
    const directrixIntercept = this._focus.offsetCoordinate(this.DistanceFromFocusToDirectrix, this._rotation);
    return [
      directrixIntercept,
      directrixIntercept.offsetCoordinate(1, rotation)
    ];
  }
}
