import { ConicSectionCurve } from "../../ConicSectionCurve";
import { ParabolicCurve } from "../../ParabolicCurve";
import { ConicParametricDoubleComponents } from "./ConicParametricDoubleComponents";


/**
 * Represents a parabolic curve in parametric equations defining the x-component and differentials.
 * @extends {ConicParametricDoubleComponents}
 */
export class ParabolicParametricX extends ConicParametricDoubleComponents {
  /**
   * Initializes a new instance of the `ParabolicParametricX` class.
   * @param {ParabolicCurve} parent The parent curve.
   */
  constructor(parent: ParabolicCurve) {
    super(parent as unknown as ConicSectionCurve);
  }

  /**
   * X-coordinate on the curve in local coordinates that corresponds to the parametric coordinate given.
   * @param {number} t Parametric coordinate.
   * @returns {number} The X-coordinate on the curve.
   * @see {@link http://amsi.org.au/ESA_Senior_Years/SeniorTopic2/2a/2a_2content_11.html}
   */
  public override BaseByParameter(t: number): number {
    return this.parent.DistanceFromVertexMajorToLocalOrigin * Math.pow(t, 2);
  }

  /**
   * X-component of the curve slope in local coordinates that corresponds to the parametric coordinate given.
   * @param {number} t Parametric coordinate.
   * @returns {number} The X-component of the curve slope.
   */
  public override PrimeByParameter(t: number): number {
    return 2 * this.parent.DistanceFromVertexMajorToLocalOrigin * t;
  }

  /**
   * X-component of the curve curvature in local coordinates that corresponds to the parametric coordinate given.
   * @param {number} t Parametric coordinate.
   * @returns {number} The X-component of the curve curvature.
   */
  public override PrimeDoubleByParameter(t: number): number {
    return 2 * this.parent.DistanceFromVertexMajorToLocalOrigin;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {ParabolicParametricX} A new object that is a copy of this instance.
   */
  public override Clone(): ParabolicParametricX {
    return this.CloneParametric();
  }

  /**
   * Clones the curve.
   * @returns {ParabolicParametricX} A cloned instance of the curve.
   */
  public CloneParametric(): ParabolicParametricX {
    const parametric = new ParabolicParametricX(this.parent as unknown as ParabolicCurve);
    return parametric;
  }
}
