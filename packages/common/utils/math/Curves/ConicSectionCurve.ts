import { NotImplementedException } from '../../../errors/exceptions';
import { TrigonometryLibrary as Trig } from '../Trigonometry/TrigonometryLibrary';
import { CartesianOffset } from '../Coordinates/CartesianOffset';
import { PolarCoordinate } from '../Coordinates/PolarCoordinate';
import { Generics } from '../Generics';
import { Vector } from '../Vectors/Vector';
import { ICurveLimits } from './ICurveLimits';
import { ICurvePositionCartesian } from './ICurvePositionCartesian';
import { ICurvePositionPolar } from './ICurvePositionPolar';
import { CartesianCoordinate } from '../Coordinates/CartesianCoordinate';
import { Angle } from '../Coordinates/Angle';
import { Numbers } from '../Numbers';
import { Curve } from './Curve';
import { LinearCurve } from './LinearCurve';
import { ConicFocusParametric } from './Parametrics/ConicSectionCurveComponents/ConicFocusParametric';
import { GeometryLibrary } from '../Geometry/GeometryLibrary';

/**
 * Initializes a new instance of the `ConicSectionCurve` class.
 * @param {CartesianCoordinate} vertexMajor The major vertex, M. This is taken to be the left apex of circles and ellipses, the right apex of hyperbolas, and the sole apex of parabolas.
 * @param {CartesianCoordinate} focus The focus, f.
 * @param {number} distanceFromMajorVertexToLocalOrigin Distance, a, major vertex, M, to the local origin.
 */
export type FocusProps = {
  vertexMajor: CartesianCoordinate;
  focus: CartesianCoordinate;
  distanceFromMajorVertexToLocalOrigin: number;
}

/**
 * Initializes a new instance of the `ConicSectionCurve` class.
 * @param {CartesianCoordinate} vertexMajor The vertex major.
 * @param {number} distanceFromMajorVertexToFocus aThe distance from major vertex, M, to focus, f.
 * @param {number} distanceFromMajorVertexToLocalOrigin Distance, a, major vertex, M, to the local origin.
 * @param {Angle} rotation The rotation offset from the horizontal x-axis.
 */
export type RotationProps = {
  vertexMajor: CartesianCoordinate;
  distanceFromMajorVertexToLocalOrigin: number;
  distanceFromMajorVertexToFocus: number;
  rotation: Angle;
}

/**
 * A conic section (or simply conic) is a curve obtained as the intersection of the surface of a cone with a plane;
 * the three types are parabolas, ellipses (circles are a subtype), and hyperbolas.
 * A conic section is the locus of points P whose distance to the focus is a constant multiple of the distance from P to the directrix of the conic.
 * @see [Reference](https://courses.lumenlearning.com/boundless-algebra/chapter/introduction-to-conic-sections)
 * @see [Wikipedia](https://en.wikipedia.org/wiki/Conic_section)
 * @extends {Curve}
 * @implements {ICurveLimits}
 * @implements {ICurvePositionCartesian}
 * @implements {ICurvePositionPolar}
 */
export abstract class ConicSectionCurve extends Curve implements ICurveLimits, ICurvePositionCartesian, ICurvePositionPolar {
  /**
   * Tolerance to use in all calculations with double types.
   * @type {number}
   */
  get Tolerance(): number {
    return super.Tolerance;
  }

  set Tolerance(value: number) {
    super.Tolerance = value;
    this.setTolerances(value);
  }

  /**
   * The parametric equation of the radius measured from the focus.
   * @type {ConicFocusParametric}
   * @protected
   */
  protected _radiusFromRightFocus: ConicFocusParametric;

  /**
   * The rotational offset of local coordinates from global coordinates.
   * @type {Angle}
   * @protected
   */
  protected _rotation: Angle;

  /**
   * Gets the rotational offset of local coordinates from global coordinates.
   * @type {Angle}
   */
  get Rotation(): Angle {
    return this._rotation;
  }

  /**
   * The coordinate of the local origin.
   * @type {CartesianCoordinate}
   */
  get LocalOrigin(): CartesianCoordinate {
    return this.GetLocalOrigin();
  }

  /**
   * The major vertex. This is taken to be the left apex of circles and ellipses, the right apex of hyperbolas, and the sole apex of parabolas.
   * @type {CartesianCoordinate}
   * @protected
   */
  protected _vertexMajor: CartesianCoordinate;

  /**
   * Gets the major vertices, M, which are the points on a conic section that lie closest to the directrices.
   * @type {Tuple<CartesianCoordinate, CartesianCoordinate>}
   */
  get VerticesMajor(): [CartesianCoordinate, CartesianCoordinate] {
    return [this._vertexMajor, this.GetVertexMajor2()];
  }

  protected _distanceFromVertexMajorToLocalOrigin: number;
  /**
   * Distance, a, from local origin to major vertex.
   * @type {number}
   */
  get DistanceFromVertexMajorToLocalOrigin(): number {
    return this._distanceFromVertexMajorToLocalOrigin;
  }

  /**
   * Gets the minor vertices, m, which lie along a line perpendicular to a line passing through the major vertex, M, and focus, f.
   * @type {Tuple<CartesianCoordinate, CartesianCoordinate>}
   */
  get VerticesMinor(): [CartesianCoordinate, CartesianCoordinate] {
    return this.GetVerticesMinor();
  }

  /**
   * Distance, b, from the major axis to minor vertex, m.
   * @type {number}
   */
  get DistanceFromVertexMinorToMajorAxis(): number {
    return this.distanceFromVertexMinorToMajorAxis(
      this.DistanceFromVertexMajorToLocalOrigin,
      this.DistanceFromFocusToLocalOrigin
    );
  }

  /**
   * The focus.
   * @type {CartesianCoordinate}
   * @protected
   */
  protected _focus: CartesianCoordinate;

  /**
   * Gets the focus, f.
   * @type {CartesianCoordinate}
   */
  get Focus(): CartesianCoordinate {
    return this._focus;
  }

  /**
   * Distance, c, from local origin to the focus, f.
   * @type {number}
   */
  get DistanceFromFocusToLocalOrigin(): number {
    return this.DistanceFromFocusToLocalOrigin;
  }

  /**
   * Distance, Xe, from the focus to the directrix.
   * @type {number}
   */
  get DistanceFromFocusToDirectrix(): number {
    return this.Eccentricity === 0
      ? Number.POSITIVE_INFINITY :
      Math.abs(this.DistanceFromFocusToLocalOrigin - this.DistanceFromDirectrixToLocalOrigin);
  }

  /**
   * The eccentricity, e.
   * A measure of how much the conic section deviates from being circular.
   * Distance from any point on the conic section to its focus, divided by the perpendicular distance from that point to the nearest directrix.
   * e = c / a;
   * @type {number}
   */
  get Eccentricity(): number {
    return this.DistanceFromFocusToLocalOrigin / this.DistanceFromVertexMajorToLocalOrigin;
  }

  /**
   * Gets the directrix, Xe.
   * @type {LinearCurve}
   */
  get Directrix(): LinearCurve {
    const directrices = this.GetVerticesDirectrix();
    return new LinearCurve(directrices[0], directrices[1], this.Tolerance);
  }

  /**
   * Distance from local origin to the directrix line, Xe.
   * @type {number}
   */
  get DistanceFromDirectrixToLocalOrigin(): number {
    return this.Eccentricity === 0 ? Number.POSITIVE_INFINITY :
      this.DistanceFromVertexMajorToLocalOrigin ** 2 / this.DistanceFromFocusToLocalOrigin;
  }

  /**
   * Distance, p, from the focus to the curve along a line perpendicular to the major axis and the focus.
   * @type {number}
   */
  get SemilatusRectumDistance(): number {
    return this.SemilatusRectumDistance;
  }


  protected constructor(
    props: FocusProps | RotationProps,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    super();

    if ((props as FocusProps).focus !== undefined) {
      props = props as FocusProps;
      const rotation = Angle.CreateFromPoints(props.focus, props.vertexMajor);

      if (Numbers.AreEqual(rotation.Radians, Numbers.Pi, tolerance)) {
        this._rotation = Angle.Origin();
      } else {
        this._rotation = rotation;
      }

      this._focus = props.focus;

      this.initialize(
        props.vertexMajor,
        props.distanceFromMajorVertexToLocalOrigin,
        tolerance
      );
    } else if ((props as RotationProps).rotation !== undefined) {
      props = props as RotationProps;
      this._rotation = props.rotation;

      this._focus = props.vertexMajor.offsetCoordinate(
        -props.distanceFromMajorVertexToFocus,
        props.rotation
      );

      this.initialize(
        props.vertexMajor,
        props.distanceFromMajorVertexToLocalOrigin,
        tolerance
      );
    }
  }

  /**
   * Initializes the specified properties.
   * @param {CartesianCoordinate} vertexMajor The major vertex, M.
   * @param {number} distanceFromMajorVertexToLocalOrigin The distance from the major vertex, M, to the local origin.
   * @param {number} tolerance The tolerance.
   * @private
   */
  private initialize(
    vertexMajor: CartesianCoordinate,
    distanceFromMajorVertexToLocalOrigin: number,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ): void {
    this._vertexMajor = vertexMajor;
    this._distanceFromVertexMajorToLocalOrigin = distanceFromMajorVertexToLocalOrigin;

    this._radiusFromRightFocus = new ConicFocusParametric(this);
    this._limitStartDefault = this._vertexMajor;
    this._limitEndDefault = this._limitStartDefault;

    this.setTolerances(tolerance);
  }

  /**
   * Sets the tolerances.
   * @param {number} tolerance Tolerance to apply to the curve.
   * @protected
   */
  protected setTolerances(tolerance: number = Curve.DEFAULT_TOLERANCE): void {
    // this._rotation.Tolerance = tolerance;
    this._focus.Tolerance = tolerance;
    this._vertexMajor.Tolerance = tolerance;
  }

  /**
     * Gets the vertices, p, that lie on the curve along a line perpendicular to the major axis and the focus.
     * @returns {[CartesianCoordinate, CartesianCoordinate]} Tuple of CartesianCoordinates.
     */
  SemilatusRectum(): [CartesianCoordinate, CartesianCoordinate] {
    const localCoordinate1 = new CartesianCoordinate(this.SemilatusRectumDistance, this.YatX(this.SemilatusRectumDistance));
    const localCoordinate2 = new CartesianCoordinate(this.SemilatusRectumDistance, -this.YatX(this.SemilatusRectumDistance));

    // TODO: Handle conversion from local to global coordinates.
    throw new NotImplementedException();
  }

  /**
   * Gets the major vertex.
   * @param {CartesianCoordinate} localOrigin The local origin.
   * @param {number} a The 'a' parameter.
   * @param {Angle} rotation The rotation angle.
   * @returns {CartesianCoordinate} The major vertex coordinate.
   * @protected
   * @static
   */
  protected static GetMajorVertex(localOrigin: CartesianCoordinate, a: number, rotation: Angle): CartesianCoordinate {
    return localOrigin.offsetCoordinate(a, rotation);
  }

  /**
   * Gets the distance from major vertex to local origin.
   * @param {CartesianCoordinate} vertexMajor The major vertex.
   * @param {CartesianCoordinate} localOrigin The local origin.
   * @returns {number} The distance.
   * @protected
   * @static
   */
  protected static GetDistanceFromMajorVertexToLocalOrigin(vertexMajor: CartesianCoordinate, localOrigin: CartesianCoordinate): number {
    return CartesianOffset.lengthBetween(vertexMajor, localOrigin);
  }

  /**
   * Gets the rotation angle.
   * @param {CartesianCoordinate} vertexMajor The major vertex.
   * @param {CartesianCoordinate} localOrigin The local origin.
   * @returns {Angle} The rotation angle.
   * @protected
   * @static
   */
  protected static GetRotation(vertexMajor: CartesianCoordinate, localOrigin: CartesianCoordinate): Angle {
    return Angle.CreateFromPoints(localOrigin, vertexMajor);
  }

  /**
   * Gets the radius measured from the right focus (+X) as a function of the angle in local coordinates.
   * @param {Angle} angle The angle in local coordinates [Angle or radians] .
   * @returns {number} The radius.
   */
  RadiusAboutFocusRight(angle: Angle | number): number {
    return this._radiusFromRightFocus.Radius.ValueAt(this.asRadians(angle));
  }

  /**
   * The radius measured from the left focus (-X) as a function of the angle in local coordinates.
   * @param {Angle} angle The angle in local coordinates [Angle or radians].
   * @returns {number} The radius measured from the left focus.
   * @public
   */
  RadiusAboutFocusLeft(angle: Angle | number): number {
    return this.RadiusAboutFocusRight(Numbers.Pi - this.asRadians(angle));
  }

  /**
  * The differential change in radius corresponding with a differential change in the angle, measured from the right focus (+X) as a function of the angle in local coordinates.
  * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
  * @returns {number} The differential change in radius.
  * @protected
  */
  protected radiusAboutFocusRightPrime(angle: Angle | number): number {
    return this._radiusFromRightFocus.Radius.Differential?.ValueAt(this.asRadians(angle)) ?? 0;
  }

  /**
   * The radius measured from the right (+X) major vertex as a function of the angle in local coordinates.
   * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
   * @returns {number} The radius measured from the right major vertex.
   * @public
   */
  RadiusAboutVertexMajorRight(angle: Angle | number): number {
    throw new NotImplementedException();
  }

  /**
   * The radius measured from the left (-X) major vertex as a function of the angle in local coordinates.
   * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
   * @returns {number} The radius measured from the left major vertex.
   * @public
  */
  RadiusAboutVertexMajorLeft(angle: Angle | number): number {
    return this.RadiusAboutVertexMajorRight(Numbers.Pi - this.asRadians(angle));
  }

  /**
   * The radius measured from the local coordinate origin as a function of the angle in local coordinates.
   * @param {Angle | number} angle The angle in local coordinates [Angle or radians].
   * @param {CartesianCoordinate} offset The offset of the shape center/origin from the coordinate origin.
   * @returns {number} The radius measured from the local coordinate origin.
   * @public
   */
  RadiusAboutOffset(angle: Angle | number, offset: CartesianCoordinate): number {
    const angleRadians = this.asRadians(angle);

    return Math.sqrt(
      (offset.X + this.XbyRotationAboutOrigin(angleRadians)) ** 2
      + (offset.Y + this.YbyRotationAboutOrigin(angleRadians)) ** 2
    );
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {number} The slope of the curve.
   */
  public SlopeByAngle(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);

    return GeometryLibrary.SlopeParametric(xPrime, yPrime);
  }

  /**
   * Curvature of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {number} The curvature of the curve.
   */
  public CurvatureByAngle(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);
    const xPrimeDouble = this.xPrimeDoubleByParameter(angleRadians);
    const yPrimeDouble = this.yPrimeDoubleByParameter(angleRadians);

    return GeometryLibrary.CurvatureParametric(xPrime, yPrime, xPrimeDouble, yPrimeDouble);
  }

  /**
   * Tangential angle of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {number} The tangential angle.
   */
  public TangentialAngleByAngle(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);

    return Trig.ArcTan(yPrime / xPrime);
  }

  /**
   * Angle between the tangent of the curve and the radius connecting the origin to the point considered.
   * This is in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * Reference: [PlanetMath](https://planetmath.org/polartangentialangle) & [Video](https://www.youtube.com/watch?v=6RwOoPN2zqE).
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {number} The polar tangential angle.
   */
  public PolarTangentialAngleAboutByAngle(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    // TODO: PolarTangentialAngleAboutByAngle - Check whether this is really about the origin vs. right focus, in which case a left focus method is also needed.
    const radius = this.RadiusAboutFocusRight(Angle.fromRadians(angleRadians));
    const radiusPrime = this.radiusAboutFocusRightPrime(angleRadians);

    return Trig.ArcTan(radius / radiusPrime);
  }

  /**
   * Vector that is tangential to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {Vector} The tangential vector.
   */
  public TangentVectorByAngle(angle: Angle | number): Vector {
    const angleRadians = this.asRadians(angle);

    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);

    return Vector.UnitTangentVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  /**
   * Vector that is normal to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle Parametric coordinate [Angle or radians].
   * @returns {Vector} The normal vector.
   */
  public NormalVectorByAngle(angle: Angle | number): Vector {
    const angleRadians = this.asRadians(angle);

    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);

    return Vector.UnitNormalVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  /**
   * Gets the cartesian coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle | number} angle The angle of rotation about the local origin.
   * @returns {CartesianCoordinate} The cartesian coordinate.
   */
  public CoordinateByAngle(angle: Angle | number): CartesianCoordinate {
    return this.CoordinateByAngleRadians(this.asRadians(angle));
  }

  /**
   * Gets the cartesian coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angle The angle of rotation about the local origin [Angle or radians].
   * @returns {CartesianCoordinate} The cartesian coordinate.
   */
  public CoordinateByAngleRadians(angle: Angle | number): CartesianCoordinate {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutOrigin(angleRadians);
    const y = this.YbyRotationAboutOrigin(angleRadians);
    return new CartesianCoordinate(x, y);
  }

  /**
   * X-coordinate on the curve in local coordinates about the right (+X) focus that corresponds to the parametric coordinate given.
   *
   * @param {number} angle - Angle of rotation about the right (+X) focus [Angle or radians].
   * @returns {number} The X-coordinate on the curve.
   */
  public abstract XbyRotationAboutFocusRight(angle: Angle | number): number;

  /**
   * Y-coordinate on the curve in local coordinates about the right (+X) focus that corresponds to the parametric coordinate given.
   *
   * @param {number} angle - Angle of rotation about the right (+X) focus [Angle or radians].
   * @returns {number} The Y-coordinate on the curve.
   */
  public YbyRotationAboutFocusRight(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    return this.RadiusAboutFocusRight(angleRadians) * Trig.Sin(angleRadians);
  }

  /**
   * The angle about the origin, in radians, determined by the angle about the right focus.
   *
   * @param {number} angle - Angle of rotation about the right (+X) focus [Angle or radians].
   * @returns {number} The angle about the origin.
   */
  public RotationAboutOriginByRotationAboutFocusRight(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutFocusRight(angleRadians);
    const y = this.YbyRotationAboutFocusRight(angleRadians);

    return Trig.ArcTan(y / x);
  }

  /**
   * The angle about the right (+X) focus, in radians, determined by the angle about the origin.
   *
   * @param {number} angle - The angle [Angle or radians].
   * @returns {number} The angle about the right focus.
   */
  public RotationAboutFocusRightByRotationAboutOrigin(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutOrigin(angleRadians);
    const y = this.YbyRotationAboutOrigin(angleRadians);

    return Trig.ArcTan(y / (x - this.DistanceFromFocusToLocalOrigin));
  }
  /**
   * X-coordinate on the curve in local coordinates about the left (-X) focus that corresponds to the parametric coordinate given.
   *
   * @param {number} angle - Angle of rotation about the left (-X) focus [Angle or radians].
   * @returns {number} The X-coordinate on the curve.
   */
  public abstract XbyRotationAboutFocusLeft(angle: Angle | number): number;

  /**
   * Y-coordinate on the curve in local coordinates about the left (-X) focus that corresponds to the parametric coordinate given.
   *
   * @param {number} angle - Angle of rotation about the left (-X) focus [Angle or radians].
   * @returns {number} The Y-coordinate on the curve.
   */
  public YbyRotationAboutFocusLeft(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    return this.RadiusAboutFocusLeft(angleRadians) * Trig.Sin(angleRadians);
  }

  /**
   * The angle about the origin, in radians, determined by the angle about the left focus.
   *
   * @param {Angle | number} angle - Angle of rotation about the left (-X) focus [Angle or radians].
   * @returns {number} The angle about the origin.
   */
  public RotationAboutOriginByRotationAboutFocusLeft(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutFocusLeft(angleRadians);
    const y = this.YbyRotationAboutFocusLeft(angleRadians);

    return Trig.ArcTan(y / x);
  }

  /**
   * The angle about the left (-X) focus, in radians, determined by the angle about the origin.
   *
   * @param {number} angle - The angle [Angle or radians].
   * @returns {number} The angle about the left focus.
   */
  public RotationAboutFocusLeftByRotationAboutOrigin(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutOrigin(angleRadians);
    const y = this.YbyRotationAboutOrigin(angleRadians);

    return Trig.ArcTan(y / (x + this.DistanceFromFocusToLocalOrigin));
  }

  /**
   * The coordinate of the local origin.
   *
   * @returns {CartesianCoordinate} The local origin.
   */
  protected abstract GetLocalOrigin(): CartesianCoordinate;

  /**
   * Gets the vertex major2 coordinate.
   *
   * @returns {CartesianCoordinate} The vertex major2 coordinate.
   */
  protected GetVertexMajor2(): CartesianCoordinate {
    return this._vertexMajor;
  }

  /**
   * Gets the minor vertices.
   *
   * @returns {Tuple<CartesianCoordinate, CartesianCoordinate>} The minor vertices.
   */
  protected abstract GetVerticesMinor(): [CartesianCoordinate, CartesianCoordinate];

  /**
   * Gets the minor vertices.
   *
   * @param {CartesianCoordinate} point - The point that the minor vertices are offset from.
   * @returns {Tuple<CartesianCoordinate, CartesianCoordinate>} The minor vertices.
   */
  protected GetVerticesMinorByPt(point: CartesianCoordinate): [CartesianCoordinate, CartesianCoordinate] {
    const rotation = new Angle(this._rotation.Radians + Numbers.PiOver2);
    return [
      point.offsetCoordinate(this.DistanceFromVertexMinorToMajorAxis, rotation),
      point.offsetCoordinate(-this.DistanceFromVertexMinorToMajorAxis, rotation)
    ];
  }

  /**
   * Gets the directrix vertices.
   *
   * @returns {Tuple<CartesianCoordinate, CartesianCoordinate>} The directrix vertices.
   */
  protected GetVerticesDirectrix(): [CartesianCoordinate, CartesianCoordinate] {
    const rotation = new Angle(this._rotation.Radians + Numbers.PiOver2);
    const directrixIntercept = this._focus.offsetCoordinate(-this.DistanceFromFocusToDirectrix, this._rotation);
    return [
      directrixIntercept,
      directrixIntercept.offsetCoordinate(1, rotation)
    ];
  }

  /**
   * Distance from the focus to major vertex.
   *
   * @returns {number} The distance from the focus to major vertex.
   */
  protected DistanceFromFocusToVertexMajor(): number {
    return CartesianOffset.fromCoordinates(this._focus, this._vertexMajor).length();
  }

  /**
   * Distance, b, from local origin to minor Vertex, b.
   *
   * @param {number} a - Distance, a, from local origin to major vertex, M.
   * @param {number} c - Distance, c, from local origin to the focus, f.
   * @returns {number} The distance from vertex minor to major axis.
   */
  protected abstract distanceFromVertexMinorToMajorAxis(a: number, c: number): number;

  /**
   * The radius measured from the local coordinate origin as a function of the angle in local coordinates.
   *
   * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
   * @returns {number} The radius about the local origin.
   */
  public RadiusAboutOrigin(angle: Angle | number): number {
    const angleRadians = this.asRadians(angle);

    const x = this.XbyRotationAboutOrigin(angleRadians);
    const y = this.YbyRotationAboutOrigin(angleRadians);

    return Math.sqrt(x ** 2 + y ** 2);
  }

  /**
   * The radii measured from the local coordinate origin as a function of the angle in local coordinates.
   *
   * @param {Angle | number} angle - The angle in local coordinates [Angle or radians].
   * @returns {number[]} The radii about the local origin.
   */
  public RadiiAboutOrigin(angle: Angle | number): number[] {
    const angleRadians = this.asRadians(angle);

    const radiusLeft = this.RadiusAboutFocusLeft(this.RotationAboutFocusLeftByRotationAboutOrigin(angleRadians));
    const radiusRight = this.RadiusAboutFocusRight(this.RotationAboutFocusRightByRotationAboutOrigin(angleRadians));

    return [radiusLeft, radiusRight];
  }

  /**
   * X-coordinate on the curve that corresponds to the y-coordinate given.
   *
   * @param {number} y - Y-coordinate for which an x-coordinate is desired.
   * @returns {number} The x-coordinate on the curve.
   */
  public abstract XatY(y: number): number;

  /**
   * Y-coordinate on the curve that corresponds to the x-coordinate given.
   *
   * @param {number} x - X-coordinate for which y-coordinates are desired.
   * @returns {number} The y-coordinate on the curve.
   */
  public abstract YatX(x: number): number;

  /**
   * X-coordinates on the curve that correspond to the y-coordinate given.
   *
   * @param {number} y - Y-coordinate for which x-coordinates are desired.
   * @returns {number[]} The x-coordinates on the curve.
   */
  public abstract XsAtY(y: number): number[];

  /**
   * Y-coordinates on the curve that correspond to the x-coordinate given.
   *
   * @param {number} x - X-coordinate for which a y-coordinate is desired.
   * @returns {number[]} The y-coordinates on the curve.
   */
  public abstract YsAtX(x: number): number[];

  /**
   * Provided point lies on the curve.
   *
   * @param {CartesianCoordinate} coordinate - The coordinate.
   * @returns {boolean} True if the point lies on the curve, otherwise false.
   */
  public IsIntersectingCoordinate(coordinate: CartesianCoordinate): boolean {
    const tolerance = Generics.GetTolerance(coordinate, this.Tolerance);
    const ysAtX = this.YsAtX(coordinate.X);
    for (let i = 0; i < ysAtX.length; i++) {
      if (Numbers.AreEqual(ysAtX[i], coordinate.Y, tolerance)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Length of the line segment.
   *
   * @returns {number} The length of the line segment.
   */
  public abstract Length(): number;

  /**
   * Length of the curve between two points.
   *
   * @param {number} relativePositionStart - Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd - Relative position along the path at which the length measurement is ended.
   * @returns {number} The length of the curve between two points.
   */
  public abstract LengthBetween(relativePositionStart: number, relativePositionEnd: number): number;

  /**
   * The length of the chord connecting the start and end limits.
   *
   * @returns {number} The length of the chord.
   */
  public abstract ChordLength(): number;

  /**
   * The length of the chord connecting the start and end limits.
   *
   * @param {number} relativePositionStart - Relative position along the path at which the length measurement is started.
   * @param {number} relativePositionEnd - Relative position along the path at which the length measurement is ended.
   * @returns {number} The length of the chord between two points.
   */
  public abstract ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number;

  /**
   * The chord connecting the start and end limits.
   *
   * @returns {LinearCurve} The chord connecting the start and end limits.
   */
  public abstract Chord(): LinearCurve;

  /**
   * The chord connecting the start and end limits.
   *
   * @param {number} relativePositionStart - Relative position along the path at which the linear curve is started.
   * @param {number} relativePositionEnd - Relative position along the path at which the linear curve is ended.
   * @returns {LinearCurve} The chord connecting the start and end limits.
   */
  public abstract ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve;

  /**
   * Vector that is tangential to the curve at the specified position.
   *
   * @param {number} relativePosition - Relative position along the path at which the tangent vector is desired.
   * @returns {Vector} The tangential vector.
   */
  public abstract TangentVector(relativePosition: number): Vector;

  /**
   * Vector that is tangential to the curve at the specified position.
   *
   * @param {number} relativePosition - Relative position along the path at which the tangent vector is desired.
   * @returns {Vector} The tangential vector.
   */
  public abstract NormalVector(relativePosition: number): Vector;

  /**
   * Coordinate of the curve at the specified position.
   *
   * @param {number} relativePosition - Relative position along the path at which the coordinate is desired.
   * @returns {CartesianCoordinate} The Cartesian coordinate of the curve at the specified position.
   */
  public CoordinateCartesian(relativePosition: number): CartesianCoordinate {
    return this.CoordinatePolar(relativePosition).toCartesian();
  }

  /**
   * Coordinate of the curve at the specified position.
   *
   * @param {number} relativePosition - Relative position along the path at which the coordinate is desired.
   * @returns {PolarCoordinate} The polar coordinate of the curve at the specified position.
   */
  public abstract CoordinatePolar(relativePosition: number): PolarCoordinate;
}
