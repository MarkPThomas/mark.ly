import { CartesianCoordinate } from "../../../coordinates/CartesianCoordinate";
import { EllipticalCurve } from "../../EllipticalCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Represents the intersection of two elliptical curves.
 * @extends {IntersectionAbstract<EllipticalCurve, EllipticalCurve>}
 */
export class IntersectionEllipticalElliptical extends IntersectionAbstract<EllipticalCurve, EllipticalCurve> {
  /**
   * Initializes a new instance of the IntersectionEllipticalElliptical class.
   * @param {EllipticalCurve} curve1 The first curve.
   * @param {EllipticalCurve} curve2 The second curve.
   */
  constructor(curve1: EllipticalCurve, curve2: EllipticalCurve) {
    super(curve1, curve2);
  }

  /**
   * Checks if the curves are tangent to each other.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public override AreTangent(): boolean {
    return IntersectionEllipticalElliptical.AreTangent(this.Curve1, this.Curve2);
  }

  /**
   * Checks if the curves intersect and are not tangent.
   * @returns {boolean} True if the curves intersect and are not tangent, false otherwise.
   */
  public override AreIntersecting(): boolean {
    return IntersectionEllipticalElliptical.AreIntersecting(this.Curve1, this.Curve2);
  }

  /**
   * Calculates the coordinates of the intersection of two curves.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public override IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionEllipticalElliptical.IntersectionCoordinates(this.Curve1, this.Curve2);
  }

  /**
   * Calculates the separation of the centers of two curves.
   * @param {EllipticalCurve} curve1 The first curve.
   * @param {EllipticalCurve} curve2 The second curve.
   * @returns {number} The separation of the centers of the curves.
   */
  public static CenterSeparations(curve1: EllipticalCurve, curve2: EllipticalCurve): number {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two elliptical curves are tangent to each other.
   * @param {EllipticalCurve} curve1 The first curve.
   * @param {EllipticalCurve} curve2 The second curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public static AreTangent(curve1: EllipticalCurve, curve2: EllipticalCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Determines if two elliptical curves intersect.
   * @param {EllipticalCurve} curve1 The first curve.
   * @param {EllipticalCurve} curve2 The second curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public static AreIntersecting(curve1: EllipticalCurve, curve2: EllipticalCurve): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Calculates the coordinates of the intersection of two elliptical curves.
   * @param {EllipticalCurve} curve1 The first curve.
   * @param {EllipticalCurve} curve2 The second curve.
   * @returns {CartesianCoordinate[]} An array of Cartesian coordinates representing the intersection points.
   */
  public static IntersectionCoordinates(curve1: EllipticalCurve, curve2: EllipticalCurve): CartesianCoordinate[] {
    throw new Error('Not implemented');
  }
}
