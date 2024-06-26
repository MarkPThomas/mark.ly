import { ArgumentOutOfRangeException } from "common/errors/exceptions";

import { CartesianCoordinate, CartesianOffset } from "@markpthomas/math/coordinates";
import { LinearCurve } from "@markpthomas/math/curves";
import { Generics } from "@markpthomas/math";
import { Numbers } from "@markpthomas/math";
import { Vector } from "@markpthomas/math/vectors";

import { ILine } from "./ILine";
import { IPathDivisionExtension } from "./IPathDivisionExtension";
import { IPathSegment } from "./IPathSegment";
import { PathSegment } from "./PathSegment";


/**
 * Segment that describes a straight line in a plane.
 *
 * @export
 * @class LineSegment
 * @extends {PathSegment<LinearCurve>}
 * @implements {IPathDivisionExtension}
 * @implements {ILine}
 */
export class LineSegment extends PathSegment<LinearCurve> implements IPathDivisionExtension, ILine {
  /// <summary>
  /// First coordinate value.
  /// </summary>
  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {CartesianCoordinate}
 */
  public override get I(): CartesianCoordinate {
    return this._curve.ControlPointI;
  }

  /// <summary>
  /// Second coordinate value.
  /// </summary>
  /**
 * @inheritdoc
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {CartesianCoordinate}
 */
  public override get J(): CartesianCoordinate {
    return this._curve.ControlPointJ;
  }

  /// <summary>
  /// Initializes the line segment to span between the provided points.
  /// </summary>
  /// <param name="i">First point of the line.</param>
  /// <param name="j">Second point of the line.</param>
  /**
 * Creates an instance of LineSegment.
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @constructor
 * @param {CartesianCoordinate} i
 * @param {CartesianCoordinate} j
 */
  constructor(i: CartesianCoordinate, j: CartesianCoordinate) {
    super(i, j);
    this._curve = new LinearCurve(i, j);
  }


  // #region Methods: Override(IPathSegment)

  /// <summary>
  /// Length of the line segment.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @returns {number}
 */
  public Length(): number {
    return this._curve.Length();
  }

  /// <summary>
  /// X-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @returns {number}
 */
  public Xo(): number {
    return 0.5 * (this.I.X + this.J.X);
  }

  /// <summary>
  /// Y-coordinate of the centroid of the line.
  /// </summary>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @returns {number}
 */
  public Yo(): number {
    return 0.5 * (this.I.Y + this.J.Y);
  }

  /// <summary>
  /// X-coordinate on the line segment that corresponds to the y-coordinate given.
  /// </summary>
  /// <param name="y">Y-coordinate for which an x-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} y
 * @returns {number}
 */
  public X(y: number): number {
    return this._curve.XatY(y);
  }

  /// <summary>
  /// Y-coordinate on the line segment that corresponds to the x-coordinate given.
  /// </summary>
  /// <param name="x">X-coordinate for which a y-coordinate is desired.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} x
 * @returns {number}
 */
  public Y(x: number): number {
    return this._curve.YatX(x);
  }

  /// <summary>
  /// Coordinate on the path that corresponds to the position along the path.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  public PointByPathPosition(sRelative: number): CartesianCoordinate {
    this.validateRelativePosition(sRelative);
    const x = this.I.X + (this.J.X - this.I.X) * sRelative;
    const y = this.I.Y + (this.J.Y - this.I.Y) * sRelative;

    return new CartesianCoordinate(x, y);
  }

  /// <summary>
  /// Vector that is normal to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} sRelative
 * @returns {Vector}
 */
  public NormalVectorByPosition(sRelative: number): Vector {
    return this.NormalVector();
  }

  /// <summary>
  /// Vector that is tangential to the line connecting the defining points at the position specified.
  /// </summary>
  /// <param name="sRelative">The relative position along the path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} sRelative
 * @returns {Vector}
 */
  public TangentVectorByPosition(sRelative: number): Vector {
    return this.TangentVector();
  }

  /// <summary>
  /// Returns a copy of the segment with an updated I coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  public UpdateI(newCoordinate: CartesianCoordinate): IPathSegment {
    return new LineSegment(newCoordinate, this.J) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment with an updated J coordinate.
  /// </summary>
  /// <param name="newCoordinate">The new coordinate.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} newCoordinate
 * @returns {IPathSegment}
 */
  public UpdateJ(newCoordinate: CartesianCoordinate): IPathSegment {
    return new LineSegment(this.I, newCoordinate) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment with the I- &amp; J-coordinates reversed.
  /// </summary>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @returns {IPathSegment}
 */
  public Reverse(): IPathSegment {
    return new LineSegment(this.J, this.I) as IPathSegment;
  }


  // #region Methods: Override(IPathSegmentCollision)

  /// <summary>
  /// Provided point lies on the line segment between or on the defining points.
  /// </summary>
  /// <param name="point"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} point
 * @returns {boolean}
 */
  public IncludesCoordinate(point: CartesianCoordinate): boolean {
    const tolerance = Generics.GetTolerance(point, this.Tolerance);
    if (!this._curve.IsIntersectingCoordinate(point)) {
      return false;
    }

    if (this._curve.IsHorizontal()) {
      return (Numbers.IsGreaterThanOrEqualTo(point.X, this._extents.MinX, tolerance)
        && Numbers.IsLessThanOrEqualTo(point.X, this._extents.MaxX, tolerance));
    }
    return (Numbers.IsGreaterThanOrEqualTo(point.Y, this._extents.MinY, tolerance)
      && Numbers.IsLessThanOrEqualTo(point.Y, this._extents.MaxY, tolerance));
  }

  /// <summary>
  /// Provided line segment intersects the line segment between or on the defining points.
  /// </summary>
  /// <param name="otherLine"></param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} otherLine
 * @returns {boolean}
 */
  public IsIntersecting(otherLine: IPathSegment): boolean {
    const otherSegment = otherLine as LineSegment;
    if (!this._curve.IsIntersectingCurve(otherSegment._curve)) {
      return false;
    }

    const intersection = this._curve.IntersectionCoordinate(otherSegment._curve);
    return this.IncludesCoordinate(intersection) && otherSegment.IncludesCoordinate(intersection);
  }

  /// <summary>
  /// Returns a point where the line segment intersects the provided line segment.
  /// </summary>
  /// <param name="otherLine">Line segment that intersects the current line segment.</param>
  /// <returns></returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} otherLine
 * @returns {CartesianCoordinate}
 */
  public IntersectionCoordinate(otherLine: IPathSegment): CartesianCoordinate {
    const otherSegment = otherLine as LineSegment;
    const intersection = this._curve.IntersectionCoordinate(otherSegment._curve);
    if (this.IncludesCoordinate(intersection) && otherSegment.IncludesCoordinate(intersection)) {
      return intersection;
    }
    throw new ArgumentOutOfRangeException("Segments do not intersect between starting and ending coordinates.");
  }


  // #region Methods: PathDivisionExtension

  /// <summary>
  /// Splits the segment by the provided point.
  /// </summary>
  /// <param name="pointDivision">The point to use for division.</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /// <exception cref="ArgumentOutOfRangeException"></exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} pointDivision
 * @returns {[IPathSegment, IPathSegment]}
 */
  public SplitBySegmentPoint(pointDivision: CartesianCoordinate): [IPathSegment, IPathSegment] {
    if (!this.IncludesCoordinate(pointDivision)) {
      throw new ArgumentOutOfRangeException("Point does not lie on the segment being split.");
    }

    return [
      new LineSegment(this.I, pointDivision) as IPathSegment,
      new LineSegment(pointDivision, this.J) as IPathSegment
    ];
  }

  /// <summary>
  /// Extends the segment to the provided point.
  /// </summary>
  /// <param name="pointExtension">The point to extend the segment to.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} pointExtension
 * @returns {IPathSegment}
 */
  public ExtendSegmentToPoint(pointExtension: CartesianCoordinate): IPathSegment {
    if (!this._curve.IsIntersectingCoordinate(pointExtension)) {
      throw new ArgumentOutOfRangeException("Point being extended to does not lie on the segment curve.");
    }

    if (((this.I.X <= this.J.X && pointExtension.X <= this.I.X) &&
      ((this.I.Y <= this.J.Y && pointExtension.Y <= this.I.Y)
        || (this.I.Y >= this.J.Y && pointExtension.Y >= this.I.Y))) ||
      ((this.I.X >= this.J.X && pointExtension.X >= this.I.X) &&
        ((this.I.Y <= this.J.Y && pointExtension.Y <= this.I.Y)
          || (this.I.Y >= this.J.Y && pointExtension.Y >= this.I.Y)))) {
      return new LineSegment(pointExtension, this.J) as IPathSegment;
    }
    else {
      return new LineSegment(this.I, pointExtension) as IPathSegment;
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
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @param {number} sRelative
 * @returns {CartesianCoordinate}
 */
  protected pointOffsetOnCurve(sRelative: number): CartesianCoordinate {
    const x = this.I.X + sRelative * (this.J.X - this.I.X);
    const y = this.I.Y + sRelative * (this.J.Y - this.I.Y);
    return new CartesianCoordinate(x, y);
  }


  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} priorSegment
 * @returns {IPathSegment}
 */
  public MergeWithPriorSegment(priorSegment: IPathSegment): IPathSegment {
    if (priorSegment.I == this.I) {
      priorSegment = new LineSegment(priorSegment.J, priorSegment.I) as IPathSegment;
    }
    if (priorSegment.J == this.J) {
      return new LineSegment(priorSegment.I, this.I) as IPathSegment;
    }
    return new LineSegment(priorSegment.I, this.J) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment that merges the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} followingSegment
 * @returns {IPathSegment}
 */
  public MergeWithFollowingSegment(followingSegment: IPathSegment): IPathSegment {
    if (followingSegment.I == this.I) {
      return new LineSegment(this.J, followingSegment.J) as IPathSegment;
    }
    if (followingSegment.J == this.J) {
      followingSegment = new LineSegment(followingSegment.J, followingSegment.I) as IPathSegment;
    }
    return new LineSegment(this.I, followingSegment.J) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the prior segment.
  /// </summary>
  /// <param name="priorSegment">The prior segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} priorSegment
 * @returns {(IPathSegment | null)}
 */
  public JoinWithPriorSegment(priorSegment: IPathSegment): IPathSegment | null {
    if ((priorSegment.I == this.I || priorSegment.I == this.J) ||
      (priorSegment.J == this.I || priorSegment.J == this.J)) {
      // segments already joined
      return null;
    }
    return new LineSegment(priorSegment.J, this.I) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment that joins the current segment with the following segment.
  /// </summary>
  /// <param name="followingSegment">The following segment.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {IPathSegment} followingSegment
 * @returns {(IPathSegment | null)}
 */
  public JoinWithFollowingSegment(followingSegment: IPathSegment): IPathSegment | null {
    if ((followingSegment.I == this.I || followingSegment.I == this.J) ||
      (followingSegment.J == this.I || followingSegment.J == this.J)) {
      // segments already joined
      return null;
    }
    return new LineSegment(this.J, followingSegment.I) as IPathSegment;
  }

  /// <summary>
  /// Returns a copy of the segment that splits the segment by the relative location.
  /// <paramref name="sRelative"/> must be between 0 and 1.
  /// </summary>
  /// <param name="sRelative">The relative position along the path between 0 (point i) and 1 (point j).</param>
  /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {number} sRelative
 * @returns {[IPathSegment, IPathSegment]}
 */
  public SplitBySegmentPosition(sRelative: number): [IPathSegment, IPathSegment] {
    const pointDivision = this.PointOffsetOnSegment(sRelative);

    return this.SplitBySegmentPoint(pointDivision);
  }

  /// <summary>
  /// Extends the segment to intersect the provided curve.
  /// If the curve intersects the segment, the segment is truncated at the curve by shifting the j-coordinate to the intersection.
  /// </summary>
  /// <param name="curve">The curve.</param>
  /// <returns>IPathSegment.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {LinearCurve} curve
 * @returns {IPathSegment}
 */
  public ExtendSegmentToCurve(curve: LinearCurve): IPathSegment {
    const pointExtension = this.CoordinateOfSegmentProjectedToCurve(curve);

    return this.ExtendSegmentToPoint(pointExtension);
  }

  /// <summary>
  /// Coordinate of where the segment projection intersects the provided curve.
  /// </summary>
  /// <param name="curve">The curve.</param>
  /// <returns>CartesianCoordinate.</returns>
  /// <exception cref="ArgumentOutOfRangeException">Curves never intersect.</exception>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {LinearCurve} curve
 * @returns {CartesianCoordinate}
 */
  public CoordinateOfSegmentProjectedToCurve(curve: LinearCurve): CartesianCoordinate {
    if (!this._curve.IsIntersectingCurve(curve)) {
      throw new ArgumentOutOfRangeException("Curves never intersect.");
    }

    return this._curve.IntersectionCoordinate(curve);
  }

  /// <summary>
  /// Coordinate of where a perpendicular projection intersects the provided coordinate.
  /// </summary>
  /// <param name="point">The point.</param>
  /// <returns>CartesianCoordinate.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {CartesianCoordinate} point
 * @returns {CartesianCoordinate}
 */
  public CoordinateOfPerpendicularProjection(point: CartesianCoordinate): CartesianCoordinate {
    // 1. Get normal vector to curve
    const normalVector = this._curve.NormalVector();

    // 2. Create new curve B by applying normal vector to point
    const offsetCurve = new LinearCurve(
      point,
      point.addOffset(CartesianOffset.fromOffsets(normalVector.Xcomponent, normalVector.Ycomponent))
    );

    // 3. Return intersection of curve B to current segment curve
    return this._curve.IntersectionCoordinate(offsetCurve);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @returns {Vector}
 */
  public ToVector(): Vector {
    return Vector.fromCoords(
      new CartesianCoordinate(this.I.X, this.I.Y),
      new CartesianCoordinate(this.J.X, this.J.Y)
    );
  }
}