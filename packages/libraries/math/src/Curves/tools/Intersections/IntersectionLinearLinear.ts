import { CartesianCoordinate } from "../../../Coordinates/CartesianCoordinate";
import { Generics } from "../../../Generics";
import { Numbers } from "../../../Numbers";
import { LinearCurve } from "../../LinearCurve";
import { IntersectionAbstract } from "./IntersectionAbstract";


/**
 * Class representing the intersection between two linear curves.
 * @extends {IntersectionAbstract<LinearCurve, LinearCurve>}
 */
export class IntersectionLinearLinear extends IntersectionAbstract<LinearCurve, LinearCurve> {
  /**
   * Creates an instance of IntersectionLinearLinear.
   * @param {LinearCurve} curve1 The first linear curve.
   * @param {LinearCurve} curve2 The second linear curve.
   */
  public constructor(curve1: LinearCurve, curve2: LinearCurve) {
    super(curve1, curve2);
  }

  /**
   * Determines if the curves are tangent to each other.
   * @override
   * @returns {boolean} True if the curves are tangent, false otherwise.
   */
  public AreTangent(): boolean {
    return IntersectionLinearLinear.areTangent(this.Curve1, this.Curve2);
  }

  /**
   * Determines if the curves intersect and are not tangent.
   * @override
   * @returns {boolean} True if the curves intersect, false otherwise.
   */
  public AreIntersecting(): boolean {
    return IntersectionLinearLinear.areIntersecting(this.Curve1, this.Curve2);
  }

  /**
   * Gets the coordinates of the intersection of two curves.
   * @override
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   */
  public IntersectionCoordinates(): CartesianCoordinate[] {
    return IntersectionLinearLinear.intersectionCoordinates(this.Curve1, this.Curve2);
  }

  /**
   * Determines if two linear curves are tangent to each other.
   * @param {LinearCurve} curve1 The first linear curve.
   * @param {LinearCurve} curve2 The second linear curve.
   * @returns {boolean} True if the curves are tangent, false otherwise.
   * @static
   */
  public static areTangent(curve1: LinearCurve, curve2: LinearCurve): boolean {
    const tolerance: number = Generics.getToleranceBetween(curve1, curve2);
    const yInterceptsMatch: boolean = Numbers.AreEqual(curve1.InterceptY(), curve2.InterceptY(), tolerance) && !curve1.IsVertical();
    const xInterceptsMatch: boolean = Numbers.AreEqual(curve1.InterceptX(), curve2.InterceptX(), tolerance) && !curve1.IsHorizontal();
    return (yInterceptsMatch || xInterceptsMatch) && curve1.IsParallel(curve2);
  }

  /**
   * Determines if two linear curves intersect and are not tangent.
   * @param {LinearCurve} curve1 The first linear curve.
   * @param {LinearCurve} curve2 The second linear curve.
   * @returns {boolean} True if the curves intersect, false otherwise.
   * @static
   */
  public static areIntersecting(curve1: LinearCurve, curve2: LinearCurve): boolean {
    return !curve1.IsParallel(curve2);
  }

  /**
   * Gets the coordinates of the intersection of two linear curves.
   * @param {LinearCurve} curve1 The first linear curve.
   * @param {LinearCurve} curve2 The second linear curve.
   * @returns {CartesianCoordinate[]} Array of CartesianCoordinates representing the intersection points.
   * @static
   */
  public static intersectionCoordinates(curve1: LinearCurve, curve2: LinearCurve): CartesianCoordinate[] {
    const intersectionCoordinates: CartesianCoordinate[] = [curve2.IntersectionCoordinate(curve1)];
    if (intersectionCoordinates.length > 0
      && intersectionCoordinates[0].X === Infinity
      && intersectionCoordinates[0].Y === Infinity
    ) {
      return [];
    }
    return [curve2.IntersectionCoordinate(curve1)];
  }
}
