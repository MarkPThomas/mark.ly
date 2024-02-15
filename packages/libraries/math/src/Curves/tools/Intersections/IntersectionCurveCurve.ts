import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { Curve } from "../../Curve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Class representing the intersection between two curves.
 * @extends {IntersectionAbstract<Curve, Curve>}
 */
export class IntersectionCurveCurve extends IntersectionAbstract<Curve, Curve> {
  /**
   * Creates an instance of IntersectionCurveCurve.
   * @param {Curve} curve1 The first curve.
   * @param {Curve} curve2 The second curve.
   */
  public constructor(curve1: Curve, curve2: Curve) {
    super(curve1, curve2);
  }

  /**
   * Determines if the curves are tangent to each other.
   * @override
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public AreTangent(): boolean {
    return IntersectionCurveCurve.AreTangent(this.Curve1, this.Curve2);
  }

  /**
   * Determines if the curves intersect and are not tangent.
   * @override
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public AreIntersecting(): boolean {
    return IntersectionCurveCurve.AreIntersecting(this.Curve1, this.Curve2);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @override
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  public IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionCurveCurve.IntersectionCoordinates(this.Curve1, this.Curve2);
  }

  /**
   * Gets the separation of the centers of the curves.
   * @param {Curve} curve1 The first curve.
   * @param {Curve} curve2 The second curve.
   * @returns {number} The separation of the centers.
   * @static
   * @throws {Error} If the method is not implemented.
   */
  public static CenterSeparations(curve1: Curve, curve2: Curve): number {
    throw new Error('Method not implemented');
  }

  /**
   * Determines if the curves are tangent to each other.
   * @param {Curve} curve1 The first curve.
   * @param {Curve} curve2 The second curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   * @static
   * @throws {Error} If the method is not implemented.
   */
  public static AreTangent(curve1: Curve, curve2: Curve): boolean {
    throw new Error('Method not implemented');
  }

  /**
   * Determines if the curves intersect.
   * @param {Curve} curve1 The first curve.
   * @param {Curve} curve2 The second curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   * @static
   * @throws {Error} If the method is not implemented.
   */
  public static AreIntersecting(curve1: Curve, curve2: Curve): boolean {
    throw new Error('Method not implemented');
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @param {Curve} curve1 The first curve.
   * @param {Curve} curve2 The second curve.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   * @static
   * @throws {Error} If the method is not implemented.
   */
  public static IntersectionCoordinates(curve1: Curve, curve2: Curve): CartesianCoordinate[] {
    throw new Error('Method not implemented');
  }
}
