import {
  ArgumentOutOfRangeException,
  NotImplementedException,
  ArgumentException
} from 'common/errors/exceptions';

import { AlgebraLibrary } from '../algebra/AlgebraLibrary';
import { TrigonometryLibrary as Trig } from '../trigonometry/TrigonometryLibrary';
import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";
import { CartesianOffset } from '../coordinates/CartesianOffset';
import { Generics } from '../Generics';
import { Numbers } from '../Numbers';
import { CartesianParametricEquationXY } from './parametrics/components/CartesianParametricEquationXY';
import { LinearCurveParametric } from './parametrics/LinearCurveParametric';
import { Vector } from '../vectors/Vector';
import { Curve } from "./Curve";
import { ICurveLimits } from "./ICurveLimits";
import { ICurvePositionCartesian } from "./ICurvePositionCartesian";
import { ICurvePositionPolar } from "./ICurvePositionPolar";
import { IPerpendicularProjections } from "./IPerpendicularProjections";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @export
 * @class LinearCurve
 * @typedef {LinearCurve}
 * @extends {Curve}
 * @implements {ICurveLimits}
 * @implements {ICurvePositionCartesian}
 * @implements {ICurvePositionPolar}
 * @implements {IPerpendicularProjections}
 */
export class LinearCurve extends Curve implements
  ICurveLimits,
  ICurvePositionCartesian, ICurvePositionPolar,
  IPerpendicularProjections {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @type {number}
 */
  public set Tolerance(value: number) {
    this._tolerance = value;
    this.setTolerances(value);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _controlPointI: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @readonly
 * @type {CartesianCoordinate}
 */
  public get ControlPointI() {
    return this._controlPointI;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _controlPointJ: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @readonly
 * @type {CartesianCoordinate}
 */
  public get ControlPointJ() {
    return this._controlPointJ;
  }

  /**
 * Creates an instance of LinearCurve.
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @constructor
 * @param {CartesianCoordinate} i
 * @param {CartesianCoordinate} j
 * @param {?number} [tolerance]
 */
  constructor(
    i: CartesianCoordinate,
    j: CartesianCoordinate,
    tolerance?: number
  ) {
    super(tolerance);

    this._controlPointI = i;
    this._controlPointJ = j;
    this._limitStartDefault = this._controlPointI;
    this._limitEndDefault = this._controlPointJ;

    this.setTolerances(tolerance);
  }

  /// <summary>
  /// Sets the tolerances.
  /// </summary>
  /// <param name="tolerance">Tolerance to apply to the curve.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @param {number} [tolerance=Curve.DEFAULT_TOLERANCE]
 */
  protected setTolerances(tolerance: number = Curve.DEFAULT_TOLERANCE) {
    this._controlPointI.Tolerance = tolerance;
    this._controlPointJ.Tolerance = tolerance;
  }

  /// <summary>
  /// Creates the parametric vector.
  /// </summary>
  /// <returns>VectorParametric.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @protected
 * @returns {CartesianParametricEquationXY}
 */
  protected createParametricEquation(): CartesianParametricEquationXY {
    return new LinearCurveParametric(this);
  }

  /// <summary>
  /// Returns a curve based on the slope and y-intercept.
  /// </summary>
  /// <param name="slope">The slope.</param>
  /// <param name="yIntercept">The y intercept.</param>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope
 * @param {number} yIntercept
 * @returns {LinearCurve}
 */
  public static CurveByYIntercept(slope: number, yIntercept: number): LinearCurve {
    return new LinearCurve(
      new CartesianCoordinate(0, yIntercept),
      new CartesianCoordinate(1, yIntercept + slope)
    );
  }

  /// <summary>
  /// Returns a curve based on the slope and x-intercept.
  /// </summary>
  /// <param name="slope">The slope.</param>
  /// <param name="xIntercept">The x intercept.</param>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope
 * @param {number} xIntercept
 * @returns {LinearCurve}
 */
  public static CurveByXIntercept(slope: number, xIntercept: number): LinearCurve {
    return new LinearCurve(
      new CartesianCoordinate(xIntercept, 0),
      new CartesianCoordinate(xIntercept + 1, slope)
    );
  }




  // #region Methods: Query

  /// <summary>
  /// Determines whether this instance is horizontal.
  /// </summary>
  /// <returns><c>true</c> if this instance is horizontal; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {boolean}
 */
  public IsHorizontal(): boolean {
    return LinearCurve.PtsHorizontal(this.ControlPointI, this.ControlPointJ, this.Tolerance);
  }

  /// <summary>
  /// Determines whether this instance is vertical.
  /// </summary>
  /// <returns><c>true</c> if this instance is vertical; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {boolean}
 */
  public IsVertical(): boolean {
    return LinearCurve.PtsVertical(this.ControlPointI, this.ControlPointJ, this.Tolerance);
  }

  /// <summary>
  /// Lines are parallel to each other.
  /// </summary>
  /// <param name="otherLine">The other line.</param>
  /// <returns><c>true</c> if the specified other line is parallel; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {LinearCurve} otherLine
 * @returns {boolean}
 */
  public IsParallel(otherLine: LinearCurve): boolean {
    const slope = this.Slope();
    const otherSlope = otherLine.Slope();
    if (slope === Infinity && otherSlope === Infinity) {
      return true;
    }

    const tolerance = Generics.getToleranceBetween(otherLine, undefined, this.Tolerance);
    return Numbers.IsZeroSign((this.Slope() - otherLine.Slope()), tolerance);
  }

  /// <summary>
  /// Lines are perpendicular to each other.
  /// </summary>
  /// <param name="otherLine">The other line.</param>
  /// <returns><c>true</c> if the specified other line is perpendicular; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {LinearCurve} otherLine
 * @returns {boolean}
 */
  public IsPerpendicular(otherLine: LinearCurve): boolean {
    const slope = this.Slope();
    const otherSlope = otherLine.Slope();
    const tolerance = Generics.getToleranceBetween(otherLine, undefined, this.Tolerance);
    if ((slope === Infinity && Numbers.IsZeroSign(otherSlope, tolerance)) ||
      (otherSlope === Infinity && Numbers.IsZeroSign(slope, tolerance))) {
      return true;
    }

    return Numbers.IsEqualTo((this.Slope() * otherLine.Slope()), -1, tolerance);
  }

  /// <summary>
  /// Provided line segment intersects an infinitely long line projecting off of the line segment.
  /// It isn't necessarily intersecting between the defining points.
  /// </summary>
  /// <param name="otherLine">The other line.</param>
  /// <returns><c>true</c> if [is intersecting curve] [the specified other line]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {LinearCurve} otherLine
 * @returns {boolean}
 */
  public IsIntersectingCurve(otherLine: LinearCurve): boolean {
    return !this.IsParallel(otherLine);
  }



  // #region Methods: Properties

  /// <summary>
  /// Slope of the line.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public Slope(): number {
    return LinearCurve.SlopeByPts(this.ControlPointI, this.ControlPointJ, this.Tolerance);
  }

  /// <summary>
  /// Curvature of the line.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public Curvature(): number {
    return 0;
  }

  /// <summary>
  /// X-Intercept of the line.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public InterceptX(): number {
    return LinearCurve.InterceptXByPts(this.ControlPointI, this.ControlPointJ, this.Tolerance);
  }

  /// <summary>
  /// Y-Intercept of the line.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public InterceptY(): number {
    return LinearCurve.InterceptYByPts(this.ControlPointI, this.ControlPointJ, this.Tolerance);
  }

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points.
  /// </summary>
  /// <returns>Vector.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {Vector}
 */
  public TangentVector(): Vector {
    return Vector.UnitTangentVectorByPts(this.ControlPointI, this.ControlPointJ);
  }

  /// <summary>
  /// Vector that is normal to the line connecting the defining points.
  /// </summary>
  /// <returns>Vector.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {Vector}
 */
  public NormalVector(): Vector {
    return Vector.UnitNormalVectorByPts(this.ControlPointI, this.ControlPointJ);
  }



  // #region ICurvePositionPolar

  /// <summary>
  /// The radius measured from the local coordinate origin as a function of the angle in local coordinates.
  /// </summary>
  /// <param name="angleRadians">The angle in radians in local coordinates.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {number}
 */
  public RadiusAboutOrigin(angleRadians: number): number {
    return this.RadiiAboutOrigin(angleRadians)[0];
  }

  /// <summary>
  /// The radii measured from the local coordinate origin as a function of the angle in local coordinates.
  /// </summary>
  /// <param name="angleRadians">The angle in radians in local coordinates.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} angleRadians
 * @returns {number[]}
 */
  public RadiiAboutOrigin(angleRadians: number): number[] {
    if (Numbers.IsEqualTo(Trig.Sin(angleRadians) - Trig.Cos(angleRadians), 0, this.Tolerance) ||
      Numbers.IsNegativeSign(Trig.Sin(angleRadians) - Trig.Cos(angleRadians), this.Tolerance)) {
      throw new ArgumentOutOfRangeException(`Angle ${angleRadians} provided will never intersect line.`);
    }
    return [Math.abs(this.InterceptY() / (Trig.Sin(angleRadians) - this.Slope() * Trig.Cos(angleRadians)))];
  }


  // #region ICurvePositionCartesian
  /// <summary>
  /// X-coordinate on the line segment that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} y
 * @returns {number}
 */
  public XatY(y: number): number {
    return this.XsAtY(y)[0];
  }

  /// <summary>
  /// Y-coordinate on the line segment that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} x
 * @returns {number}
 */
  public YatX(x: number): number {
    return this.YsAtX(x)[0];
  }

  /// <summary>
  /// X-coordinate on the line segment that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} y
 * @returns {number[]}
 */
  public XsAtY(y: number): number[] {
    if (this.IsHorizontal() && !Numbers.IsEqualTo(y, this.InterceptY(), this.Tolerance)) {
      throw new ArgumentOutOfRangeException(`Coordinate ${y} does not lie on horizontal line ${this}`);
    }
    return [this.InterceptX() + y / this.Slope()];
  }

  /// <summary>
  /// Y-coordinate on the line segment that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} x
 * @returns {number[]}
 */
  public YsAtX(x: number): number[] {
    return [this.InterceptY() + this.Slope() * x];
  }

  /// <summary>
  /// Provided point lies on the curve.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns><c>true</c> if [is intersecting coordinate] [the specified coordinate]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {CartesianCoordinate} coordinate
 * @returns {boolean}
 */
  public IsIntersectingCoordinate(coordinate: CartesianCoordinate): boolean {
    const tolerance = Generics.getToleranceBetween(coordinate, undefined, this.Tolerance);
    const y = this.YatX(coordinate.X);
    if (this.IsVertical()) {
      return Numbers.IsEqualTo(this.ControlPointI.X, coordinate.X, tolerance);
    }
    return Numbers.IsEqualTo(y, coordinate.Y, tolerance);
  }



  // #region ICurveLimits

  /// <summary>
  /// Length of the line segment.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public Length(): number {
    return LinearCurve.LengthBetweenPts(this.Range.start.Limit, this.Range.end.Limit);
  }

  /// <summary>
  /// Length of the curve between two points.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the length measurement is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the length measurement is ended.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePositionStart
 * @param {number} relativePositionEnd
 * @returns {number}
 */
  public LengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new NotImplementedException();
  }

  /// <summary>
  /// The length of the chord connecting the start and end limits.
  /// </summary>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {number}
 */
  public ChordLength(): number {
    return this.Length();
  }

  /// <summary>
  /// The length of the chord connecting the start and end limits.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the length measurement is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the length measurement is ended.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePositionStart
 * @param {number} relativePositionEnd
 * @returns {number}
 */
  public ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    return this.LengthBetween(relativePositionStart, relativePositionEnd);
  }

  /// <summary>
  /// The chord connecting the start and end limits.
  /// </summary>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {LinearCurve}
 */
  public Chord(): LinearCurve {
    return this.clone();
  }

  /// <summary>
  /// The chord connecting the start and end limits.
  /// </summary>
  /// <param name="relativePositionStart">Relative position along the path at which the linear curve is started.</param>
  /// <param name="relativePositionEnd">Relative position along the path at which the linear curve is ended.</param>
  /// <returns>LinearCurve.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePositionStart
 * @param {number} relativePositionEnd
 * @returns {LinearCurve}
 */
  public ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    throw new NotImplementedException();
  }

  /// <summary>
  /// Vector that is tangential to the curve at the specified position.
  /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  /// </summary>
  /// <param name="relativePosition">Relative position along the path at which the tangent vector is desired.</param>
  /// <returns>Vector.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePosition
 * @returns {Vector}
 */
  public TangentVectorByPosition(relativePosition: number): Vector {
    return this.TangentVector();
  }

  /// <summary>
  /// Vector that is tangential to the curve at the specified position.
  /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  /// </summary>
  /// <param name="relativePosition">Relative position along the path at which the tangent vector is desired.</param>
  /// <returns>Vector.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePosition
 * @returns {Vector}
 */
  public NormalVectorByPosition(relativePosition: number): Vector {
    return this.NormalVector();
  }

  /// <summary>
  /// Coordinate of the curve at the specified position.
  /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  /// </summary>
  /// <param name="relativePosition">Relative position along the path at which the coordinate is desired.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {number} relativePosition
 * @returns {CartesianCoordinate}
 */
  public CoordinateCartesian(relativePosition: number): CartesianCoordinate {
    throw new NotImplementedException();
  }

  // /// <summary>
  // /// Coordinate of the curve at the specified position.
  // /// If the shape is a closed shape, <paramref name="relativePosition" /> = {any integer} where <paramref name="relativePosition" /> = 0.
  // /// </summary>
  // /// <param name="relativePosition">Relative position along the path at which the coordinate is desired.</param>
  // /// <returns>CartesianCoordinate.</returns>
  // public PolarCoordinate CoordinatePolar(relativePosition: number) {
  //   return this.CoordinateCartesian(relativePosition);
  // }



  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {string}
 */
  public ToString() {
    return 'LinearCurve' + " - X-Intercept: " + this.InterceptX() + ", Y-Intercept: " + this.InterceptY() + ", Slope: " + this.Slope();
  }

  /// <summary>
  /// Returns a point where the line segment intersects the provided line segment.
  /// </summary>
  /// <param name="otherLine">Line segment that intersects the current line segment.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {LinearCurve} otherLine
 * @returns {CartesianCoordinate}
 */
  public IntersectionCoordinate(otherLine: LinearCurve): CartesianCoordinate {
    return LinearCurve.LineIntersect(
      this.Slope(), this.InterceptX(), this.InterceptY(),
      otherLine.Slope(), otherLine.InterceptX(), otherLine.InterceptY()
    );
  }

  /// <summary>
  /// Coordinate of where a perpendicular projection intersects the provided coordinate.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @param {CartesianCoordinate} point
 * @returns {CartesianCoordinate}
 */
  public CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate {
    return LinearCurve.CoordinateOfPerpendicularProjection(point, this);
  }

  /// <summary>
  /// The length between the provided points along a linear curve.
  /// </summary>
  /// <param name="pointI">Point i.</param>
  /// <param name="pointJ">Point j.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} pointI
 * @param {CartesianCoordinate} pointJ
 * @returns {number}
 */
  public static LengthBetweenPts(pointI: CartesianCoordinate, pointJ: CartesianCoordinate): number {
    return AlgebraLibrary.SRSS((pointJ.X - pointI.X), (pointJ.Y - pointI.Y));
  }

  /// <summary>
  /// Determines if the line is horizontal.
  /// </summary>
  /// <param name="ptI">The point i.</param>
  /// <param name="ptJ">The point j.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the shape segment is horizontal, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static PtsHorizontal(
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(ptI, ptJ, tolerance);
    return Numbers.AreEqual(ptI.Y, ptJ.Y, tolerance);
  }

  /// <summary>
  /// Determines whether the specified slope is vertical.
  /// </summary>
  /// <param name="slope">The slope.</param>
  /// <returns><c>true</c> if the specified slope is vertical; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope
 * @returns {boolean}
 */
  public static SlopeHorizontal(slope: number): boolean {
    return (Numbers.IsZeroSign(slope));
  }

  /// <summary>
  /// Determines if the segment is vertical.
  /// </summary>
  /// <param name="ptI">The point i.</param>
  /// <param name="ptJ">The point j.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the segment is vertical, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} ptI
 * @param {CartesianCoordinate} ptJ
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static PtsVertical(
    ptI: CartesianCoordinate,
    ptJ: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    tolerance = Generics.getToleranceBetween(ptI, ptJ, tolerance);
    return Numbers.IsEqualTo(ptI.X, ptJ.X, tolerance);
  }

  /// <summary>
  /// Determines whether the specified slope is vertical.
  /// </summary>
  /// <param name="slope">The slope.</param>
  /// <returns><c>true</c> if the specified slope is vertical; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope
 * @returns {boolean}
 */
  public static SlopeVertical(slope: number): boolean {
    return (slope === Infinity || slope === -Infinity);
  }

  /// <summary>
  /// True: Slopes are parallel.
  /// </summary>
  /// <param name="slope1">The slope1.</param>
  /// <param name="slope2">The slope2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the specified slope1 is parallel; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} slope2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static SlopesParallel(
    slope1: number,
    slope2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    if (slope1 === -Infinity && slope2 === Infinity) { return true; }
    if (slope2 === -Infinity && slope1 === Infinity) { return true; }
    return Numbers.AreEqual(slope1, slope2, tolerance);
  }

  /// <summary>
  /// True: Slopes are perpendicular.
  /// </summary>
  /// <param name="slope1">The slope1.</param>
  /// <param name="slope2">The slope2.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if the specified slope1 is perpendicular; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} slope2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static SlopesPerpendicular(
    slope1: number,
    slope2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    if (slope1 === -Infinity && Numbers.IsZeroSign(slope2, tolerance)) { return true; }
    if (slope2 === -Infinity && Numbers.IsZeroSign(slope1, tolerance)) { return true; }
    if (slope1 === Infinity && Numbers.IsZeroSign(slope2, tolerance)) { return true; }
    if (slope2 === Infinity && Numbers.IsZeroSign(slope1, tolerance)) { return true; }
    return (Numbers.AreEqual((slope1 * slope2), -1));
  }



  // #region Slope


  /// <summary>
  /// Returns the slope of a line (y2-y1)/(x2-x1).
  /// </summary>
  /// <param name="rise">Difference in y-coordinate values or equivalent.</param>
  /// <param name="run">Difference in x-coordinate values or equivalent.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /// <exception cref="ArgumentException">Rise &amp; run are both zero. Cannot determine a slope for a point.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} rise
 * @param {number} run
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static SlopeByRiseRun(
    rise: number,
    run: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (Numbers.IsZeroSign(run, tolerance) && Numbers.IsPositiveSign(rise)) { return Infinity; }
    if (Numbers.IsZeroSign(run, tolerance) && Numbers.IsNegativeSign(rise)) { return -Infinity; }
    if (Numbers.IsZeroSign(run, tolerance) && Numbers.IsZeroSign(rise, tolerance)) {
      throw new ArgumentException("Rise & run are both zero. Cannot determine a slope for a point.");
    }
    return (rise / run);
  }

  /// <summary>
  /// Returns the slope of a line (y2-y1)/(x2-x1).
  /// </summary>
  /// <param name="x1">First x-coordinate.</param>
  /// <param name="y1">First y-coordinate.</param>
  /// <param name="x2">Second x-coordinate.</param>
  /// <param name="y2">Second y-coordinate.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static SlopeByXY(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tolerance: number = Numbers.ZeroTolerance): number {
    return LinearCurve.SlopeByRiseRun(
      (y2 - y1),
      (x2 - x1),
      tolerance
    );
  }


  /// <summary>
  /// Returns the slope of a line (y2-y1)/(x2-x1).
  /// </summary>
  /// <param name="point1">First point.</param>
  /// <param name="point2">Second point.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static SlopeByPts(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return LinearCurve.SlopeByRiseRun(
      (point2.Y - point1.Y),
      (point2.X - point1.X),
      tolerance
    );
  }

  /// <summary>
  /// Returns the slope of a line (y2-y1)/(x2-x1).
  /// </summary>
  /// <param name="delta">The difference between two points.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianOffset} delta
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static SlopeByOffset(
    delta: CartesianOffset,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return LinearCurve.SlopeByRiseRun(
      (delta.J.Y - delta.I.Y),
      (delta.J.X - delta.I.X),
      tolerance
    );
  }




  // #region Intercept

  /// <summary>
  /// Returns the x-intercept.
  /// Returns +infinity if line is horizontal.
  /// </summary>
  /// <param name="x1">First x-coordinate.</param>
  /// <param name="y1">First y-coordinate.</param>
  /// <param name="x2">Second x-coordinate.</param>
  /// <param name="y2">Second y-coordinate.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static InterceptXByXY(
    x1: number, y1: number,
    x2: number, y2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (Numbers.IsZeroSign(y1, tolerance)) { return x1; }
    if (Numbers.IsZeroSign(y2, tolerance)) { return x2; }
    if (Numbers.AreEqual(y1, y2, tolerance)) { return Infinity; }
    return (-y1 / LinearCurve.SlopeByXY(x1, y1, x2, y2, tolerance) + x1);
  }

  /// <summary>
  /// Returns the x-intercept.
  /// </summary>
  /// <param name="point1">First point defining a line.</param>
  /// <param name="point2">Second point defining a line.</param>
  /// <param name="tolerance">&gt;Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static InterceptXByPts(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return LinearCurve.InterceptXByXY(point1.X, point1.Y, point2.X, point2.Y, tolerance);
  }

  /// <summary>
  /// Returns the y-intercept.
  /// Returns +infinity if line is vertical.
  /// </summary>
  /// <param name="x1">First x-coordinate.</param>
  /// <param name="y1">First y-coordinate.</param>
  /// <param name="x2">Second x-coordinate.</param>
  /// <param name="y2">Second y-coordinate.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static InterceptYByXY(
    x1: number, y1: number,
    x2: number, y2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (Numbers.IsZeroSign(x1, tolerance)) { return y1; }
    if (Numbers.IsZeroSign(x2, tolerance)) { return y2; }
    if (Numbers.AreEqual(x1, x2, tolerance)) { return Infinity; }
    return (-x1 * LinearCurve.SlopeByXY(x1, y1, x2, y2, tolerance) + y1);
  }

  /// <summary>
  /// Returns the y-intercept.
  /// </summary>
  /// <param name="point1">First point defining a line.</param>
  /// <param name="point2">Second point defining a line.</param>
  /// <param name="tolerance">&gt;Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point1
 * @param {CartesianCoordinate} point2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static InterceptYByPts(
    point1: CartesianCoordinate,
    point2: CartesianCoordinate,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    return LinearCurve.InterceptYByXY(point1.X, point1.Y, point2.X, point2.Y, tolerance);
  }



  // #region Intersect

  /// <summary>
  /// The lines intersect.
  /// </summary>
  /// <param name="slope1">Slope of the first line.</param>
  /// <param name="slope2">Slope of the second line.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} slope2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {boolean}
 */
  public static AreLinesIntersecting(
    slope1: number,
    slope2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): boolean {
    return (!LinearCurve.SlopesParallel(slope1, slope2, tolerance));
  }

  /// <summary>
  /// The x-coordinate of the intersection of two lines.
  /// </summary>
  /// <param name="slope1">Slope of the first line.</param>
  /// <param name="xIntercept1">X-intercept of the first line.</param>
  /// <param name="slope2">Slope of the second line.</param>
  /// <param name="xIntercept2">X-intercept of the second line.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} xIntercept1
 * @param {number} slope2
 * @param {number} xIntercept2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static LineIntersectX(
    slope1: number,
    xIntercept1: number,
    slope2: number,
    xIntercept2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (LinearCurve.SlopesParallel(slope1, slope2, tolerance)) {
      return Infinity;
    }
    if (xIntercept1 === Infinity ||
      slope2 === Infinity ||
      slope2 === -Infinity) {
      return xIntercept2;
    }
    if (xIntercept2 === Infinity ||
      slope1 === Infinity ||
      slope1 === -Infinity) {
      return xIntercept1;
    }
    return (xIntercept1 + (xIntercept1 - xIntercept2) * (slope2 / (slope1 - slope2)));
  }

  /// <summary>
  /// The y-coordinate of the intersection of two lines.
  /// </summary>
  /// <param name="slope1">Slope of the first line.</param>
  /// <param name="yIntercept1">Y-intercept of the first line.</param>
  /// <param name="slope2">Slope of the second line.</param>
  /// <param name="yIntercept2">Y-intercept of the second line.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>System.Double.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} yIntercept1
 * @param {number} slope2
 * @param {number} yIntercept2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {number}
 */
  public static LineIntersectY(
    slope1: number,
    yIntercept1: number,
    slope2: number,
    yIntercept2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): number {
    if (LinearCurve.SlopesParallel(slope1, slope2, tolerance)) {
      return Infinity;
    }
    if (yIntercept1 === Infinity) {
      return yIntercept2;
    }
    if (yIntercept2 === Infinity) {
      return yIntercept1;
    }
    return (yIntercept1 + (yIntercept1 - yIntercept2) * (slope1 / (slope2 - slope1)));
  }

  /// <summary>
  /// The coordinates of the intersection of two lines.
  /// </summary>
  /// <param name="slope1">Slope of the first line.</param>
  /// <param name="xIntercept1">X-intercept of the first line.</param>
  /// <param name="yIntercept1">Y-intercept of the first line.</param>
  /// <param name="slope2">Slope of the second line.</param>
  /// <param name="xIntercept2">X-intercept of the second line.</param>
  /// <param name="yIntercept2">Y-intercept of the second line.</param>
  /// <param name="tolerance">Tolerance by which a double is considered to be zero or equal.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {number} slope1
 * @param {number} xIntercept1
 * @param {number} yIntercept1
 * @param {number} slope2
 * @param {number} xIntercept2
 * @param {number} yIntercept2
 * @param {number} [tolerance=Numbers.ZeroTolerance]
 * @returns {CartesianCoordinate}
 */
  public static LineIntersect(
    slope1: number, xIntercept1: number, yIntercept1: number,
    slope2: number, xIntercept2: number, yIntercept2: number,
    tolerance: number = Numbers.ZeroTolerance
  ): CartesianCoordinate {
    // check for vertical lines and handle those cases here
    // in sub-functions, throw exceptions
    if (LinearCurve.SlopeVertical(slope1) && !LinearCurve.SlopeVertical(slope2)) {
      const curve2 = LinearCurve.CurveByYIntercept(slope2, yIntercept2);
      return new CartesianCoordinate(xIntercept1, curve2.YatX(xIntercept1));
    }
    if (!LinearCurve.SlopeVertical(slope1) && LinearCurve.SlopeVertical(slope2)) {
      const curve2 = LinearCurve.CurveByYIntercept(slope1, yIntercept1);
      return new CartesianCoordinate(xIntercept2, curve2.YatX(xIntercept2));
    }
    if (LinearCurve.SlopeHorizontal(slope1) && !LinearCurve.SlopeHorizontal(slope2)) {
      const curve2 = LinearCurve.CurveByYIntercept(slope2, yIntercept2);
      return new CartesianCoordinate(curve2.XatY(yIntercept1), yIntercept1);
    }
    if (!LinearCurve.SlopeHorizontal(slope1) && LinearCurve.SlopeHorizontal(slope2)) {
      const curve2 = LinearCurve.CurveByYIntercept(slope1, yIntercept1);
      return new CartesianCoordinate(curve2.XatY(yIntercept2), yIntercept2);
    }

    return new CartesianCoordinate(
      LinearCurve.LineIntersectX(slope1, xIntercept1, slope2, xIntercept2, tolerance),
      LinearCurve.LineIntersectY(slope1, yIntercept1, slope2, yIntercept2, tolerance));
  }


  // #region Projection

  /// <summary>
  /// Coordinate of where a perpendicular projection intersects the provided coordinate.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <param name="referenceLine">The line to which a perpendicular projection is drawn.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @static
 * @param {CartesianCoordinate} point
 * @param {LinearCurve} referenceLine
 * @returns {CartesianCoordinate}
 */
  public static CoordinateOfPerpendicularProjection(
    point: CartesianCoordinate,
    referenceLine: LinearCurve
  ): CartesianCoordinate {
    // 1. Get normal vector to curve
    const normalVector = referenceLine.NormalVector();

    // 2. Create new curve B by applying normal vector to point
    const offsetCurve = new LinearCurve(
      point,
      point.addOffset(CartesianOffset.fromOffsets(normalVector.Xcomponent, normalVector.Ycomponent))
    );

    // 3. Return intersection of curve B to current segment curve
    return referenceLine.IntersectionCoordinate(offsetCurve);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:18 PM
 *
 * @public
 * @returns {LinearCurve}
 */
  public clone(): LinearCurve {
    const curve = new LinearCurve(this.ControlPointI, this.ControlPointJ);
    curve.Tolerance = this.Tolerance;
    curve._range = this.Range.clone();
    return curve;
  }
}