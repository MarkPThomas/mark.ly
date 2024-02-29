import { NotImplementedException } from "@markpthomas/common-libraries/exceptions";

import { TrigonometryLibrary as Trig } from '../trigonometry/TrigonometryLibrary';
import { Angle } from "../coordinates/Angle";
import { AngularOffset } from "../coordinates/AngularOffset";
import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../coordinates/PolarCoordinate";
import { GeometryLibrary } from "../geometry/GeometryLibrary";
import { Vector } from "../vectors/Vector";
import { Curve } from "./Curve";
import { ICurveLimits } from "./ICurveLimits";
import { LinearCurve } from "./LinearCurve";
import { CartesianParametricEquationXY } from "./parametrics/components/CartesianParametricEquationXY";
import { LogarithmicSpiralCurveParametric } from "./parametrics/LogarithmicSpiralCurveParametric";


/**
 * A curve whose polar tangential angle is constant.
 * @extends {Curve}
 * @implements {ICurveLimits}
 */
export class LogarithmicSpiralCurve extends Curve implements ICurveLimits {
  /**
   * Gets the radius at origin, a.
   * @type {number}
   */
  public readonly RadiusAtOrigin: number;

  /**
   * Gets the radius change with differential rotation, b.
   * @type {number}
   */
  public readonly RadiusChangeWithRotation: number;

  /**
   * Gets the differential radius change with differential rotation, dr/dθ.
   * @type {number}
   */
  public get RadiusPrime(): number {
    return this.RadiusAtOrigin * this.RadiusChangeWithRotation;
  }

  /**
   * Initializes a new instance of the LogarithmicSpiralCurve class.
   * @param {number} radiusAtOrigin The radius at origin.
   * @param {number} radiusChangeWithRotation The radius change with rotation.
   * @param {number} [tolerance=Tolerance.DEFAULT_TOLERANCE] Tolerance to apply to the curve.
   */
  public constructor(
    radiusAtOrigin: number,
    radiusChangeWithRotation: number,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ) {
    super(tolerance);
    this.RadiusAtOrigin = radiusAtOrigin;
    this.RadiusChangeWithRotation = radiusChangeWithRotation;
  }

  /**
   * Creates the parametric vector.
   * @protected
   * @returns {CartesianParametricEquationXY} VectorParametric.
   */
  protected createParametricEquation(): CartesianParametricEquationXY {
    return new LogarithmicSpiralCurveParametric(this);
  }

  // Methods: Properties
  // Radius
  /**
   * The radius measured from the local coordinate origin as a function of the angle in local coordinates.
   * @param {number} angleRadians The angle in radians in local coordinates.
   * @returns {number} System.Double.
   */
  public RadiusAboutOrigin(angleRadians: number): number {
    return this.RadiusAtOrigin * Math.E ** (this.RadiusChangeWithRotation * angleRadians);
  }

  /**
   * The radius measured from the local coordinate origin as a function of the angle in local coordinates.
   * @param {number} angleRadians The angle in radians in local coordinates.
   * @param {CartesianCoordinate} offset The offset of the shape center/origin from the coordinate origin.
   * @returns {number} System.Double.
   */
  public RadiusAboutOffset(angleRadians: number, offset: CartesianCoordinate): number {
    return Math.sqrt(
      (offset.X + this.XbyRotationAboutOrigin(angleRadians)) ** 2 +
      (offset.Y + this.YbyRotationAboutOrigin(angleRadians)) ** 2
    );
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} System.Double.
   */
  public SlopeByAngle(angleRadians: number): number {
    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);

    return GeometryLibrary.SlopeParametric(xPrime, yPrime);
  }

  /**
   * Curvature of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} System.Double.
   */
  public CurvatureByAngle(angleRadians: number): number {
    return Math.E ** (-1 * this.RadiusChangeWithRotation * angleRadians) / (this.RadiusAtOrigin * Math.sqrt(1 + this.RadiusChangeWithRotation ** 2));
  }

  /**
   * Tangential angle of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} System.Double.
   */
  public TangentialAngleByAngle(angleRadians: number): number {
    return angleRadians;
  }

  /**
   * Angle between the tangent of the curve and the radius connecting the origin to the point considered.
   * This is in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {number} System.Double.
   */
  public PolarTangentialAngleAboutOriginByAngle(angleRadians: number): number {
    return Trig.ArcTan(1 / this.RadiusChangeWithRotation);
  }

  /**
   * Vector that is tangential to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {Vector} Vector.
   */
  public TangentVectorByAngle(angleRadians: number): Vector {
    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);
    return Vector.UnitTangentVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  /**
   * Vector that is tangential to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Parametric coordinate in radians.
   * @returns {Vector} Vector.
   */
  public NormalVectorByAngle(angleRadians: number): Vector {
    const xPrime = this.xPrimeByParameter(angleRadians);
    const yPrime = this.yPrimeByParameter(angleRadians);
    return Vector.UnitNormalVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  // ICurveLimits
  /**
   * Length of the curve between the limits.
   * @returns {number} System.Double.
   */
  public Length(): number {
    return this.LengthBetween(0, 1);
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
    throw new NotImplementedException();
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
   * @returns {LinearCurve} LinearCurve.
   */
  public Chord(): LinearCurve {
    throw new NotImplementedException();
  }

  /**
   * The chord connecting the start and end limits.
   * @param {number} relativePositionStart Relative position along the path at which the linear curve is started.
   * @param {number} relativePositionEnd Relative position along the path at which the linear curve is ended.
   * @returns {LinearCurve} LinearCurve.
   */
  public ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    throw new NotImplementedException();
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative length along the path at which the tangent vector is desired.
   * @returns {Vector} Vector.
   */
  public TangentVector(relativePosition: number): Vector {
    throw new NotImplementedException();
  }

  /**
   * Vector that is tangential to the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative length along the path at which the tangent vector is desired.
   * @returns {Vector} Vector.
   */
  public NormalVector(relativePosition: number): Vector {
    throw new NotImplementedException();
  }

  /**
   * Coordinate of the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the coordinate is desired.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  public CoordinateCartesian(relativePosition: number): CartesianCoordinate {
    throw new NotImplementedException();
  }

  /**
   * Coordinate of the curve at the specified position.
   * If the shape is a closed shape, relativePosition = {any integer} where relativePosition = 0.
   * @param {number} relativePosition Relative position along the path at which the coordinate is desired.
   * @returns {PolarCoordinate} PolarCoordinate.
   */
  public CoordinatePolar(relativePosition: number): PolarCoordinate {
    throw new NotImplementedException();
  }

  // Methods: Curve Position
  /**
   * The cartesian coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {Angle} angle Angle of rotation about the local origin.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  public CoordinateByAngle(angle: Angle): CartesianCoordinate {
    return this.CoordinateByRadians(angle.Radians);
  }

  /**
   * The cartesian coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} angleRadians Angle of rotation about the local origin, in radians.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  public CoordinateByRadians(angleRadians: number): CartesianCoordinate {
    const x = this.XbyRotationAboutOrigin(angleRadians);
    const y = this.YbyRotationAboutOrigin(angleRadians);
    return new CartesianCoordinate(x, y);
  }

  // Methods: Public
  /**
   * Returns a string that represents this instance.
   * @returns {string} A string that represents this instance.
   */
  public override toString(): string {
    return `${LogarithmicSpiralCurve.name} - `
      + `Radius at origin, a: ${this.RadiusAtOrigin}, `
      + `Radius change w/ rotation, b: ${this.RadiusChangeWithRotation}`;
  }

  /**
   * Length of the curve from the start to the specified position.
   * @param {number} angleRadians Angle of rotation about the local origin, in radians.
   * @returns {number} System.Double.
   */
  public LengthTo(angleRadians: number): number {
    return Math.E ** (this.RadiusChangeWithRotation * angleRadians)
      * (this.RadiusAtOrigin / this.RadiusChangeWithRotation)
      * Math.sqrt(1 + this.RadiusChangeWithRotation ** 2);
  }

  /**
   * The length within the provided rotation along a circular curve.
   * @param {AngularOffset} rotation Rotation to get arc length between.
   * @returns {number} System.Double.
   */
  public LengthBetweenAngle(rotation: AngularOffset): number {
    return this.LengthTo(rotation.J.RadiansRaw) - this.LengthTo(rotation.I.RadiansRaw);
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {LogarithmicSpiralCurve} A new object that is a copy of this instance.
   */
  clone(): LogarithmicSpiralCurve {
    const curve = new LogarithmicSpiralCurve(this.RadiusAtOrigin, this.RadiusChangeWithRotation);
    curve._range = this.Range.clone();
    return curve;
  }
}
