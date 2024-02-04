import { AlgebraLibrary } from "../../../Algebra/AlgebraLibrary";
import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { Generics } from "../../../Generics";
import { Numbers } from "../../../Numbers";
import { Transformations } from "../../../Transformations";
import { CircularCurve } from "../../CircularCurve";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Class representing the intersection between a linear curve and a circular curve.
 * @extends {IntersectionAbstract<LinearCurve, CircularCurve>}
 */
export class IntersectionLinearCircular extends IntersectionAbstract<LinearCurve, CircularCurve> {
  /**
   * Gets the linear curve.
   * @type {LinearCurve}
   */
  public get linearCurve(): LinearCurve {
    return this.Curve1;
  }

  /**
   * Gets the circular curve.
   * @type {CircularCurve}
   */
  public get circularCurve(): CircularCurve {
    return this.Curve2;
  }

  /**
   * Intersection properties.
   * @private
   * @type {IntersectionProperties}
   */
  private properties: IntersectionProperties;

  /**
   * Initializes a new instance of the `IntersectionLinearCircular` class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   */
  public constructor(linearCurve: LinearCurve, circularCurve: CircularCurve) {
    super(linearCurve, circularCurve);
    this.properties = new IntersectionProperties(linearCurve, circularCurve);
  }

  /**
   * Determines if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  AreTangent(): boolean {
    return IntersectionLinearCircular._areTangent(this.linearCurve, this.circularCurve, this.properties);
  }

  /**
   * Determines if the curves intersect.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  AreIntersecting(): boolean {
    return IntersectionLinearCircular._areIntersecting(this.linearCurve, this.circularCurve, this.properties);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearCircular._intersectionCoordinates(this.linearCurve, this.circularCurve, this.properties);
  }

  /**
   * Static method: Determines if the curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  static areTangent(linearCurve: LinearCurve, circularCurve: CircularCurve): boolean {
    return this._areTangent(linearCurve, circularCurve, new IntersectionProperties(linearCurve, circularCurve));
  }

  /**
   * Static method: Determines if the curves intersect.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  static areIntersecting(linearCurve: LinearCurve, circularCurve: CircularCurve): boolean {
    return this._areIntersecting(linearCurve, circularCurve, new IntersectionProperties(linearCurve, circularCurve));
  }

  /**
   * Static method: Gets the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  static intersectionCoordinates(linearCurve: LinearCurve, circularCurve: CircularCurve): CartesianCoordinate[] {
    return this._intersectionCoordinates(linearCurve, circularCurve, new IntersectionProperties(linearCurve, circularCurve));
  }

  /**
   * Static method: Determines if the curves are tangent to each other.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @param {IntersectionProperties} properties Pre-calculated properties for convenience.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   * @private
   */
  private static _areTangent(linearCurve: LinearCurve, circularCurve: CircularCurve, properties: IntersectionProperties): boolean {
    return Numbers.IsEqualTo(properties.incidenceDelta, 0, Generics.getToleranceBetween(linearCurve, circularCurve));
  }

  /**
   * Static method: Determines if the curves intersect.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @param {IntersectionProperties} properties Pre-calculated properties for convenience.
   * @returns {boolean} True if the curves intersect, false otherwise.
   * @private
   */
  private static _areIntersecting(linearCurve: LinearCurve, circularCurve: CircularCurve, properties: IntersectionProperties): boolean {
    return Numbers.IsGreaterThanOrEqualTo(properties.incidenceDelta, 0, Generics.getToleranceBetween(linearCurve, circularCurve));
  }

  /**
   * Static method: Gets the coordinates of the intersection of two curves.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   * @param {IntersectionProperties} properties Pre-calculated properties for convenience.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   * @private
   */
  private static _intersectionCoordinates(linearCurve: LinearCurve, circularCurve: CircularCurve, properties: IntersectionProperties): CartesianCoordinate[] {
    if (!this._areIntersecting(linearCurve, circularCurve, properties)) {
      return [];
    }

    const D: number = properties.D;
    const dx: number = properties.dx;
    const dy: number = properties.dy;
    const dr: number = properties.dr;
    const incidenceDeltaSqrt: number = Math.sqrt(properties.incidenceDelta);

    const xIntersection: number[] = Numbers.PlusMinus(D * dy / (dr ** 2), (Math.sign(dy) * dx / (dr ** 2)) * incidenceDeltaSqrt);
    const yIntersection: number[] = Numbers.PlusMinus(-1 * D * dx / (dr ** 2), (Math.abs(dy) / (dr ** 2)) * incidenceDeltaSqrt);

    const converter: Transformations = properties.transformations;

    if (this._areTangent(linearCurve, circularCurve, properties)) {
      return [converter.TransformToGlobal(new CartesianCoordinate(xIntersection[0], yIntersection[0]))];
    }

    return [
      converter.TransformToGlobal(new CartesianCoordinate(xIntersection[0], yIntersection[0])),
      converter.TransformToGlobal(new CartesianCoordinate(xIntersection[1], yIntersection[1]))
    ];
  }
}

/**
 * Class representing intersection properties.
 * @private
 */
class IntersectionProperties {
  /**
   * Tolerance for calculations.
   * @type {number}
   */
  public tolerance: number;

  /**
   * Cross-product of two points defining the linear curve.
   * @type {number}
   */
  public D: number;

  /**
   * X-axis distance between two points defining the linear curve.
   * @type {number}
   */
  public dx: number;

  /**
   * Y-axis distance between two points defining the linear curve.
   * @type {number}
   */
  public dy: number;

  /**
   * Distance between two points defining the linear curve.
   * @type {number}
   */
  public dr: number;

  /**
   * Incidence delta value.
   * @type {number}
   */
  public incidenceDelta: number;

  /**
   * Transformations object.
   * @type {Transformations}
   */
  public transformations: Transformations;

  /**
   * Initializes a new instance of the `IntersectionProperties` class.
   * @param {LinearCurve} linearCurve The linear curve.
   * @param {CircularCurve} circularCurve The circular curve.
   */
  public constructor(linearCurve: LinearCurve, circularCurve: CircularCurve) {
    this.tolerance = Generics.getToleranceBetween(linearCurve, circularCurve);
    this.transformations = new Transformations(circularCurve.LocalOrigin, new CartesianCoordinate(circularCurve.LocalOrigin.X + 1, circularCurve.LocalOrigin.Y));
    const linearCurveLocal: LinearCurve = this.transformToLocal(linearCurve);

    this.D = Numbers.ValueAsZeroIfWithinAbsoluteTolerance(linearCurveLocal.ControlPointI.crossProduct(linearCurveLocal.ControlPointJ), this.tolerance);

    const offset: CartesianCoordinate = linearCurveLocal.Range.end.Limit.offsetFrom(linearCurveLocal.Range.start.Limit).toCartesianCoordinate();
    this.dx = offset.X;
    this.dy = offset.Y;
    this.dr = AlgebraLibrary.SRSS(this.dx, this.dy);

    this.incidenceDelta = Numbers.ValueAsZeroIfWithinAbsoluteTolerance((circularCurve.Radius * this.dr) ** 2 - this.D ** 2, this.tolerance);
  }

  /**
   * Returns a new linear curve transformed to the local coordinates of the provided circular curve.
   * @param {LinearCurve} linearCurve The linear curve.
   * @returns {LinearCurve}
   * @private
   */
  private transformToLocal(linearCurve: LinearCurve): LinearCurve {
    return new LinearCurve(
      this.transformations.TransformToLocal(linearCurve.ControlPointI),
      this.transformations.TransformToLocal(linearCurve.ControlPointJ)
    );
  }
}
