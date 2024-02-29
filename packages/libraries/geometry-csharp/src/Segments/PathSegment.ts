import { ArgumentOutOfRangeException, NotImplementedException } from "@markpthomas/common-libraries/exceptions";

import {
  Angle,
  CartesianCoordinate,
  CartesianOffset
} from "@markpthomas/math/coordinates";
import { Curve, LinearCurve } from "@markpthomas/math/curves";
import { Vector } from "@markpthomas/math/vectors";
import { Numbers } from "@markpthomas/math";

import { GeometryLibrary } from "../GeometryLibrary";
import { PointExtents } from "../tools/PointExtents";
import { IPathSegmentCollision } from "./IPathSegmentCollision";
import { IPathSegment } from "./IPathSegment";
import { LineSegment } from "./LineSegment";

/**
 * Base class used for segment types.
 *
 * @export
 * @abstract
 * @class PathSegment
 * @implements {IPathSegment}
 * @implements {IPathSegmentCollision<T>}
 * @template T
 */
export abstract class PathSegment<T extends Curve> implements IPathSegment, IPathSegmentCollision<T>
{

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @type {number}
 */
  protected _tolerance: number = GeometryLibrary.ZeroTolerance;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @type {number}
 */
  get Tolerance(): number {
    return this._tolerance;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @type {number}
 */
  set Tolerance(value: number) {
    this._tolerance = value;
    this._curve.Tolerance = this._tolerance;
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @type {T}
 */
  protected _curve: T;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @readonly
 * @type {T}
 */
  get Curve(): T {
    return this._curve.clone() as T;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @type {PointExtents}
 */
  protected _extents: PointExtents;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @readonly
 * @type {PointExtents}
 */
  get Extents(): PointExtents {
    return this._extents.Clone();
  }


  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _i: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @readonly
 * @type {CartesianCoordinate}
 */
  get I(): CartesianCoordinate {
    return this._i;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @type {CartesianCoordinate}
 */
  protected _j: CartesianCoordinate;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @readonly
 * @type {CartesianCoordinate}
 */
  get J(): CartesianCoordinate {
    return this._j;
  }

  /// <summary>
  /// Initializes the segment to span between the provided points.
  /// </summary>
  /// <param name="i">First point of the line.</param>
  /// <param name="j">Second point of the line.</param>
  /**
 * Creates an instance of PathSegment.
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @constructor
 * @protected
 * @param {CartesianCoordinate} i
 * @param {CartesianCoordinate} j
 */
  protected constructor(i: CartesianCoordinate, j: CartesianCoordinate) {
    i.Tolerance = this._tolerance;
    j.Tolerance = this._tolerance;
    this._i = i;
    this._j = j;
    this._extents = PointExtents.fromCornerPoints(i, j);
  }

  /// <summary>
  /// Determines whether the segment [has same coordinates] as [the specified segment].
  /// </summary>
  /// <param name="segment">The segment.</param>
  /// <returns><c>true</c> if [has same coordinates] [the specified segment]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {IPathSegment} segment
 * @returns {boolean}
 */
  public HasSameCoordinates(segment: IPathSegment): boolean {
    return ((this.I == segment.I) && (this.J == segment.J));
  }

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {Vector}
 */
  public TangentVector(): Vector {
    return Vector.UnitTangentVectorByPts(this.I, this.J);
  }

  /// <summary>
  /// Vector that is normal to the line connecting the defining points.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {Vector}
 */
  public NormalVector(): Vector {
    return Vector.UnitNormalVectorByPts(this.I, this.J);
  }

  /// <summary>
  /// Validates the relative position provided.
  /// </summary>
  /// <param name="sRelative">The relative position, s.</param>
  /// <exception cref="ArgumentOutOfRangeException">Relative position must be between 0 and 1, but was {sRelative}.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @param {number} sRelative
 */
  protected validateRelativePosition(sRelative: number) {
    if (!Numbers.IsWithinInclusive(sRelative, 0, 1, this.Tolerance)) {
      throw new ArgumentOutOfRangeException(`Relative position must be between 0 and 1, but was ${sRelative}.`);
    }
  }

  /// <summary>
  /// Returns a point determined by a given fraction of the distance between point i and point j of the segment.
  /// <paramref name="sRelative"/> must be between 0 and 1.
  /// </summary>
  /// <param name="sRelative">The relative position along the path between 0 (point i) and 1 (point j).</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @protected
 * @abstract
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  protected abstract pointOffsetOnCurve(sRelative: number): CartesianCoordinate;

  // #region Methods: IPathSegment

  /// <summary>
  /// Length of the path segment.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @returns {number}
 */
  public abstract Length(): number;


  /// <summary>
  /// X-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @returns {number}
 */
  public abstract Xo(): number;

  /// <summary>
  /// Y-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @returns {number}
 */
  public abstract Yo(): number;

  /// <summary>
  /// X-coordinate on the line segment that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} y
 * @returns {number}
 */
  public abstract X(y: number): number;

  /// <summary>
  /// Y-coordinate on the line segment that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} x
 * @returns {number}
 */
  public abstract Y(x: number): number;

  /// <summary>
  /// Coordinate on the path that corresponds to the position along the path.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  public abstract PointByPathPosition(sRelative: number): CartesianCoordinate;

  /// <summary>
  /// Vector that is normal to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} sRelative
 * @returns {Vector}
 */
  public abstract NormalVectorByPosition(sRelative: number): Vector;

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} sRelative
 * @returns {Vector}
 */
  public abstract TangentVectorByPosition(sRelative: number): Vector;

  // #region Methods: IPathTransform

  /**
   *  Translates the segment.
   *
   * @param {CartesianOffset} translation The amount to translate by.
   * @return {*}  {IPathSegment}
   * @memberof PathSegment
   */
  public Translate(translation: CartesianOffset): IPathSegment {
    return new LineSegment(this.I.addOffset(translation), this.J.addOffset(translation)) as IPathSegment;
  }

  /// <summary>
  /// Scales the segment from the provided reference point.
  /// </summary>
  /// <param name="scale">The amount to scale relative to the reference point.</param>
  /// <param name="referencePoint">The reference point.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {number} scale
 * @param {CartesianCoordinate} referencePoint
 * @returns {IPathSegment}
 */
  public ScaleFromPoint(scale: number, referencePoint: CartesianCoordinate): IPathSegment {
    const offsetJ = (this.J.offsetFrom(referencePoint)).multiplyBy(scale);
    const offsetI = (this.I.offsetFrom(referencePoint)).multiplyBy(scale);

    return new LineSegment(
      offsetI.toCartesianCoordinate().addTo(referencePoint),
      offsetJ.toCartesianCoordinate().addTo(referencePoint)
    ) as IPathSegment;
  }

  /// <summary>
  /// Rotates the segment about the reference point.
  /// </summary>
  /// <param name="rotation">The amount of rotation. [rad]</param>
  /// <param name="referencePoint">The center of rotation reference point.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {Angle} rotation
 * @param {CartesianCoordinate} referencePoint
 * @returns {IPathSegment}
 */
  public RotateAboutPoint(rotation: Angle, referencePoint: CartesianCoordinate): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.RotateAboutPoint(this.I, referencePoint, rotation.Radians),
      CartesianCoordinate.RotateAboutPoint(this.J, referencePoint, rotation.Radians)) as IPathSegment;
  }

  /// <summary>
  /// Skews the specified segment to the skewing of a containing box.
  /// </summary>
  /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
  /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {CartesianCoordinate} stationaryReferencePoint
 * @param {CartesianCoordinate} skewingReferencePoint
 * @param {CartesianOffset} magnitude
 * @returns {IPathSegment}
 */
  public Skew(
    stationaryReferencePoint: CartesianCoordinate,
    skewingReferencePoint: CartesianCoordinate,
    magnitude: CartesianOffset): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.SkewWithinBox(this.I, stationaryReferencePoint, skewingReferencePoint, magnitude),
      CartesianCoordinate.SkewWithinBox(this.J, stationaryReferencePoint, skewingReferencePoint, magnitude)) as IPathSegment;
  }

  /// <summary>
  /// Mirrors the specified segment about the specified reference line.
  /// </summary>
  /// <param name="referenceLine">The reference line.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {LinearCurve} referenceLine
 * @returns {IPathSegment}
 */
  public MirrorAboutLine(referenceLine: LinearCurve): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.MirrorAboutLine(this.I, referenceLine),
      CartesianCoordinate.MirrorAboutLine(this.J, referenceLine)) as IPathSegment;
  }

  /// <summary>
  /// Mirrors the specified segment about the x-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisX(): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.MirrorAboutAxisX(this.I),
      CartesianCoordinate.MirrorAboutAxisX(this.J)) as IPathSegment;
  }

  /// <summary>
  /// Mirrors the specified segment about the y-axis.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisY(): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.MirrorAboutAxisY(this.I),
      CartesianCoordinate.MirrorAboutAxisY(this.J)) as IPathSegment;
  }


  // #region Methods: Transform About Ends I, J


  /// <summary>
  /// Scales the segment from point I.
  /// </summary>
  /// <param name="scaleFromI">The amount to scale from point I.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {number} scaleFromI
 * @returns {IPathSegment}
 */
  public ScaleFromI(scaleFromI: number): IPathSegment {
    return this.ScaleFromPoint(scaleFromI, this.I);
  }

  /// <summary>
  /// Scales the segment from point J.
  /// </summary>
  /// <param name="scaleFromJ">The amount to scale from point J.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {number} scaleFromJ
 * @returns {IPathSegment}
 */
  public ScaleFromJ(scaleFromJ: number): IPathSegment {
    return this.ScaleFromPoint(scaleFromJ, this.J);
  }


  /// <summary>
  /// Rotates the segment from point I.
  /// </summary>
  /// <param name="rotation">The amount of rotation. [rad]</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {Angle} rotation
 * @returns {IPathSegment}
 */
  public RotateAboutI(rotation: Angle): IPathSegment {
    return new LineSegment(
      this.I, CartesianCoordinate.RotateAboutPoint(this.J, this.I, rotation.Radians)
    ) as IPathSegment;
  }

  /// <summary>
  /// Rotates the segment from point J.
  /// </summary>
  /// <param name="rotation">The amount of rotation. [rad]</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {Angle} rotation
 * @returns {IPathSegment}
 */
  public RotateAboutJ(rotation: Angle): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.RotateAboutPoint(this.I, this.J, rotation.Radians), this.J
    ) as IPathSegment;
  }


  /// <summary>
  /// Skews the specified segment about point I by shearing point J.
  /// </summary>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {CartesianOffset} magnitude
 * @returns {IPathSegment}
 */
  public SkewAboutI(magnitude: CartesianOffset): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.SkewWithinBox(this.I, this.I, this.J, magnitude),
      CartesianCoordinate.SkewWithinBox(this.J, this.I, this.J, magnitude)) as IPathSegment;
  }

  /// <summary>
  /// Skews the specified segment about point J by shearing point I.
  /// </summary>
  /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {CartesianOffset} magnitude
 * @returns {IPathSegment}
 */
  public SkewAboutJ(magnitude: CartesianOffset): IPathSegment {
    return new LineSegment(
      CartesianCoordinate.SkewWithinBox(this.I, this.J, this.I, magnitude),
      CartesianCoordinate.SkewWithinBox(this.J, this.J, this.I, magnitude)) as IPathSegment;
  }


  /// <summary>
  /// Mirrors the specified segment about the X-axis through point I.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisIX(): IPathSegment {
    const referenceLine = new LinearCurve(this.I, new CartesianCoordinate(this.I.X + 1, this.I.Y));

    return new LineSegment(
      CartesianCoordinate.MirrorAboutLine(this.I, referenceLine),
      CartesianCoordinate.MirrorAboutLine(this.J, referenceLine)) as IPathSegment;
  }


  /// <summary>
  /// Mirrors the specified segment about the X-axis through point J.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisJX(): IPathSegment {
    const referenceLine = new LinearCurve(this.J, new CartesianCoordinate(this.J.X + 1, this.J.Y));

    return new LineSegment(
      CartesianCoordinate.MirrorAboutLine(this.I, referenceLine),
      CartesianCoordinate.MirrorAboutLine(this.J, referenceLine)) as IPathSegment;
  }


  /// <summary>
  /// Mirrors the specified segment about the Y-axis through point I.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisIY(): IPathSegment {
    const referenceLine = new LinearCurve(this.I, new CartesianCoordinate(this.I.X, this.I.Y + 1));

    return new LineSegment(
      CartesianCoordinate.MirrorAboutLine(this.I, referenceLine),
      CartesianCoordinate.MirrorAboutLine(this.J, referenceLine)) as IPathSegment;
  }


  /// <summary>
  /// Mirrors the specified segment about the Y-axis through point J.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public MirrorAboutAxisJY(): IPathSegment {
    const referenceLine = new LinearCurve(this.J, new CartesianCoordinate(this.J.X, this.J.Y + 1));

    return new LineSegment(
      CartesianCoordinate.MirrorAboutLine(this.I, referenceLine),
      CartesianCoordinate.MirrorAboutLine(this.J, referenceLine)) as IPathSegment;
  }


  // #region Methods: IPathDivisionExtension

  /// <summary>
  /// Returns a point determined by a given fraction of the distance between point i and point j of the segment.
  /// <paramref name="sRelative"/> must be between 0 and 1.
  /// </summary>
  /// <param name="sRelative">The relative position along the path between 0 (point i) and 1 (point j).</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  public PointOffsetOnSegment(sRelative: number): CartesianCoordinate {
    this.validateRelativePosition(sRelative);
    return this.pointOffsetOnCurve(sRelative);
  }

  /// <summary>
  ///  Returns a point determined by a given ratio of the distance between point i and point j of the segment.
  /// </summary>
  /// <param name="ratio">Ratio of the size of the existing segment.
  /// If <paramref name="ratio"/>&lt; 0, returned point is offset from point i, in that direction.
  /// If <paramref name="ratio"/>&gt; 0, returned point is offset from point j, in that direction.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {number} ratio
 * @returns {CartesianCoordinate}
 */
  public PointScaledFromSegment(ratio: number): CartesianCoordinate {
    if (Numbers.IsGreaterThanOrEqualTo(ratio, 0, this.Tolerance)) {
      ratio += 1;
    }
    return this.pointOffsetOnCurve(ratio);
  }

  /// <summary>
  /// Returns a copy of the segment with an updated I coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  public abstract UpdateI(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment with an updated J coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  public abstract UpdateJ(newCoordinate: CartesianCoordinate): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} priorSegment
 * @returns {IPathSegment}
 */
  public abstract MergeWithPriorSegment(priorSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} followingSegment
 * @returns {IPathSegment}
 */
  public abstract MergeWithFollowingSegment(followingSegment: IPathSegment): IPathSegment;

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} priorSegment
 * @returns {(IPathSegment | null)}
 */
  public abstract JoinWithPriorSegment(priorSegment: IPathSegment): IPathSegment | null;

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} followingSegment
 * @returns {(IPathSegment | null)}
 */
  public abstract JoinWithFollowingSegment(followingSegment: IPathSegment): IPathSegment | null;

  /// <summary>
  /// Returns a copy of the segment that splits the segment by the relative location.
  /// <paramref name="sRelative"/> must be between 0 and 1.
  /// </summary>
  /// <param name="sRelative">The relative position along the path between 0 (point i) and 1 (point j).</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {number} sRelative
 * @returns {[IPathSegment, IPathSegment]}
 */
  public abstract SplitBySegmentPosition(sRelative: number): [IPathSegment, IPathSegment];


  // #region IPathSegmentCollision


  /// <summary>
  /// Provided point lies on the line segment between or on the defining points.
  /// </summary>
  /// <param name="point"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {CartesianCoordinate} point
 * @returns {boolean}
 */
  public abstract IncludesCoordinate(point: CartesianCoordinate): boolean;

  /// <summary>
  /// Provided line segment intersects the line segment between or on the defining points.
  /// </summary>
  /// <param name="otherLine"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} otherLine
 * @returns {boolean}
 */
  public abstract IsIntersecting(otherLine: IPathSegment): boolean;

  /// <summary>
  /// Returns a point where the line segment intersects the provided line segment.
  /// </summary>
  /// <param name="otherLine">Line segment that intersects the current line segment.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @param {IPathSegment} otherLine
 * @returns {CartesianCoordinate}
 */
  public abstract IntersectionCoordinate(otherLine: IPathSegment): CartesianCoordinate;



  // #region Methods: Chamfers & Fillets

  /// <summary>
  /// Chamfers the segments at the specified point.
  /// Returns the new bounding segments and joining chamfer segment.
  /// </summary>
  /// <param name="segment">Segment to chamfer with.</param>
  /// <param name="depth">The depth.</param>
  /// <returns>Polyline.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @param {IPathSegment} segment
 * @param {number} depth
 * @returns {[IPathSegment, LineSegment, IPathSegment]}
 */
  public(segment: IPathSegment, depth: number): [IPathSegment, LineSegment, IPathSegment] {
    throw new NotImplementedException();

    // 1. Get angle bisector
    // 2. Create bisector segment from vertex to a 'depth' along this line on the acute side.
    // 3. Get the midpoint of the chamfer segment from the bisector segment pt J
    // 4. Project curve out from midpoint of chamfer perpendicular to angle bisector line to intersection with segments on either side.
    // 5. Trim adjacent segments to these intersections.
    // 6. Create chamfer segment from the trim points.
  }

  /// <summary>
  /// Fillets the segments at the specified point.
  /// Returns the new bounding segments and joining fillet segment.
  /// </summary>
  /// <param name="segment">Segment to fillet with.</param>
  /// <param name="radius">The radius.</param>
  /// <returns>Polyline.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {IPathSegment} segment
 * @param {number} radius
 * @returns {[IPathSegment, IPathSegment, IPathSegment]}
 */
  public Fillet(segment: IPathSegment, radius: number): [IPathSegment, IPathSegment, IPathSegment] {
    throw new NotImplementedException();
    // 1. Offset segment curves to acute side by radius
    // 2. Get curves intersection as fillet center
    // 3. From fillet center, get perpendicular projection from point to each segment
    // 4. Get intesections on each segment of the perpendicular projection
    // 5. Trim adjacent segments to these intersections.
    // 6. Create arc segment with trim points and fillet center
  }


  /// <summary>
  /// Indicates whether the current object is equal to another object of the same type.
  /// </summary>
  /// <param name="other">An object to compare with this object.</param>
  /// <returns>true if the current object is equal to the <paramref name="other">other</paramref> parameter; otherwise, false.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @param {IPathSegment} other
 * @returns {boolean}
 */
  public equals(other: IPathSegment): boolean {
    return this.HasSameCoordinates(other);
  }

  /// <summary>
  /// Returns a copy of the segment with the I- &amp; J-coordinates reversed, as well as any other relevant control points.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:04 PM
 *
 * @public
 * @abstract
 * @returns {IPathSegment}
 */
  public abstract Reverse(): IPathSegment;
}