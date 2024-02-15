import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { Generics } from "../../../Generics";
import { Numbers } from "../../../Numbers";
import { Transformations } from "../../../Transformations";
import { CircularCurve } from "../../CircularCurve";
import { IntersectingCurveException } from "../../IntersectingCurveException";
import { OverlappingCurvesException } from "../../OverlappingCurvesException";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Class representing the intersection between two circular curves.
 * @extends {IntersectionAbstract<CircularCurve, CircularCurve>}
 */
export class IntersectionCircularCircular extends IntersectionAbstract<CircularCurve, CircularCurve> {
  /**
   * Transformations object for local vs. global coordinates.
   * @type {Transformations}
   * @private
   */
  protected _transformations: Transformations;

  /**
   * Creates an instance of IntersectionCircularCircular.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   */
  public constructor(Curve1: CircularCurve, Curve2: CircularCurve) {
    super(Curve1, Curve2);
    this._transformations = IntersectionCircularCircular.GetTransformations(Curve1, Curve2);
  }

  /**
   * Determines if the curves are tangent to each other.
   * @override
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public AreTangent(): boolean {
    return IntersectionCircularCircular.AreTangent(this.Curve1, this.Curve2);
  }

  /**
   * Determines if the curves intersect and are not tangent.
   * @override
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public AreIntersecting(): boolean {
    return IntersectionCircularCircular.AreIntersecting(this.Curve1, this.Curve2);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @override
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  public IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionCircularCircular._intersectionCoordinates(this.Curve1, this.Curve2, this._transformations);
  }

  /**
   * Gets the separation of the centers of the curves.
   * @returns {number} The separation of the centers.
   */
  public CenterSeparations(): number {
    return IntersectionCircularCircular.CenterSeparations(this.Curve1, this.Curve2);
  }

  /**
   * Gets the length of the radical line, which is the straight line connecting the two intersection points.
   * @returns {number} The length of the radical line.
   * @throws {OverlappingCurvesException} Circles must have different origins to calculate radical line length.
   * @throws {IntersectingCurveException} Circles must intersect to calculate radical line length.
   */
  public RadicalLineLength(): number {
    const separation = this.CenterSeparations();
    if (separation === 0) {
      throw new OverlappingCurvesException(`Circles must have different origins to calculate radical line length. ${this.Curve1}, ${this.Curve2}`);
    }
    if (separation > this.Curve1.Radius + this.Curve2.Radius) {
      throw new IntersectingCurveException(`Circles must intersect to calculate radical line length. ${this.Curve1}, ${this.Curve2}`);
    }

    return IntersectionCircularCircular.RadicalLineLength(separation, this.Curve1.Radius, this.Curve2.Radius);
  }

  /**
   * Gets the transformations to use for local vs. global coordinates.
   * @param {CircularCurve} circleAtOrigin The circular curve set to the local origin.
   * @param {CircularCurve} otherCircle The other circular curve set to the local x-axis.
   * @returns {Transformations} The transformations object.
   * @private
   */
  protected static GetTransformations(circleAtOrigin: CircularCurve, otherCircle: CircularCurve): Transformations {
    return new Transformations(circleAtOrigin.LocalOrigin, otherCircle.LocalOrigin);
  }

  /**
   * Gets the separation of the centers of the curves.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   * @returns {number} The separation of the centers.
   * @static
   */
  public static CenterSeparations(Curve1: CircularCurve, Curve2: CircularCurve): number {
    return Curve1.LocalOrigin.offsetFrom(Curve2.LocalOrigin).length();
  }

  /**
   * Determines if the curves are tangent to each other.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   * @static
   */
  public static AreTangent(Curve1: CircularCurve, Curve2: CircularCurve): boolean {
    const tolerance = Generics.getToleranceBetween(Curve1, Curve2);

    return Numbers.IsEqualTo(Curve1.Radius + Curve2.Radius, IntersectionCircularCircular.CenterSeparations(Curve1, Curve2), tolerance);
  }

  /**
   * Determines if the curves intersect.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   * @static
   */
  public static AreIntersecting(Curve1: CircularCurve, Curve2: CircularCurve): boolean {
    const tolerance = Generics.getToleranceBetween(Curve1, Curve2);
    const centerSeparation = Curve1.LocalOrigin.offsetFrom(Curve2.LocalOrigin).length();

    return Numbers.IsGreaterThanOrEqualTo(Curve1.Radius + Curve2.Radius, centerSeparation, tolerance);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   * @static
   */
  public static IntersectionCoordinates(Curve1: CircularCurve, Curve2: CircularCurve): CartesianCoordinate[] {
    const transformations = IntersectionCircularCircular.GetTransformations(Curve1, Curve2);
    return IntersectionCircularCircular._intersectionCoordinates(Curve1, Curve2, transformations);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @param {CircularCurve} Curve1 The first circular curve.
   * @param {CircularCurve} Curve2 The second circular curve.
   * @param {Transformations} converter The converter.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   * @private
   */
  private static _intersectionCoordinates(Curve1: CircularCurve, Curve2: CircularCurve, converter: Transformations): CartesianCoordinate[] {
    if (!IntersectionCircularCircular.AreIntersecting(Curve1, Curve2)) {
      return [];
    }

    const separation = IntersectionCircularCircular.CenterSeparations(Curve1, Curve2);
    const radius1 = Curve1.Radius;
    const radius2 = Curve2.Radius;
    const tolerance = Generics.getToleranceBetween(Curve1, Curve2);

    const xIntersection = IntersectionCircularCircular.factor(separation, radius1, radius2) / (2 * separation);
    const yIntersection = Numbers.PlusMinus(0, IntersectionCircularCircular.RadicalLineLength(separation, radius1, radius2, tolerance) / 2);

    const localPoint1 = converter.TransformToGlobal(new CartesianCoordinate(xIntersection, yIntersection[0]));

    if (IntersectionCircularCircular.AreTangent(Curve1, Curve2)) {
      return [localPoint1];
    }

    const localPoint2 = converter.TransformToGlobal(new CartesianCoordinate(xIntersection, yIntersection[1]));

    return [localPoint1, localPoint2];
  }

  /**
   * Gets the length of the radical line, which is the straight line connecting the two intersection points.
   * @param {number} separation The separation of the centers.
   * @param {number} radius1 The radius of the first circular curve.
   * @param {number} radius2 The radius of the second circular curve.
   * @param {number} [tolerance=Numbers.ZeroTolerance] The tolerance for numerical comparison.
   * @returns {number} The length of the radical line.
   * @static
   */
  public static RadicalLineLength(separation: number, radius1: number, radius2: number, tolerance: number = Numbers.ZeroTolerance): number {
    if (separation === 0) {
      throw new OverlappingCurvesException('Circles must have different origins to calculate radical line length.');
    }
    if (Numbers.IsGreaterThan(separation, radius1 + radius2, tolerance)) {
      throw new IntersectingCurveException('Circles must intersect to calculate radical line length.');
    }

    const component = Numbers.ValueAsZeroIfWithinAbsoluteTolerance(
      4 * (separation * radius1) ** 2 - IntersectionCircularCircular.factor(separation, radius1, radius2) ** 2,
      tolerance
    );
    return Math.sqrt(component) / separation;
  }

  /**
   * Factors the specified separation.
   * @param {number} separation The separation.
   * @param {number} radius1 The radius of the first circular curve.
   * @param {number} radius2 The radius of the second circular curve.
   * @returns {number} The factor.
   * @private
   */
  private static factor(separation: number, radius1: number, radius2: number): number {
    return separation ** 2 - radius2 ** 2 + radius1 ** 2;
  }
}
