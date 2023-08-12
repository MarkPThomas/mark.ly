// TODO: Make Generic form of VectorParametric for this to derive from.
import { DivideByZeroException } from "../../../errors/exceptions";
import { ITolerance } from "../ITolerance";
import { Numbers } from "../Numbers";
import { CartesianParametricEquationXY } from "../Parametrics/Components/CartesianParametricEquationXY";
import { Vector } from "./Vector";
import { VectorLibrary } from "./VectorLibrary";

/**
 * Represents a parametric vector in 2D space.
 * This is used for non-linear curves.
 *
 * @export
 * @class VectorParametric
 * @implements {ITolerance}
 */
export class VectorParametric implements ITolerance {
  public Tolerance: number;

  protected _curveParametric: CartesianParametricEquationXY;

  /**
   * The associated parametric function.
   *
   * @readonly
   * @type {CartesianParametricEquationXY}
   * @memberof VectorParametric
   */
  get CurveParametric(): CartesianParametricEquationXY {
    return this._curveParametric;
  };
  /// <summary>
  /// Initializes a new instance of the <see cref="VectorParametric" /> class that is based on the provided parametric function.
  /// </summary>
  /// <param name="parametricCartesian">The parametric function.</param>
  /// <param name="tolerance">The tolerance.</param>
  constructor(parametricCartesian: CartesianParametricEquationXY, tolerance: number = Numbers.ZeroTolerance) {
    this._curveParametric = parametricCartesian;

    if (tolerance != Numbers.ZeroTolerance) {
      this.Tolerance = tolerance;
    }
  }


  /// <summary>
  /// Returns a differential of the parametric vector.
  /// For any component that no longer has a differential, the associated function returns a pre-defined constant value.
  /// </summary>
  /// <returns>VectorParametric.</returns>
  public Differentiate(): VectorParametric {
    const differential = this._curveParametric.Differentiate() as CartesianParametricEquationXY;
    return new VectorParametric(differential, this.Tolerance);
  }

  /// <summary>
  /// Determines whether this instance can be differentiated further.
  /// </summary>
  /// <returns><c>true</c> if this instance has differential; otherwise, <c>false</c>.</returns>
  public HasDifferential(): boolean {
    return this._curveParametric.HasDifferential();
  }

  /// <summary>
  /// Magnitudes the specified angle radians.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>System.Double.</returns>
  public Magnitude(angleRadians: number): number {
    return VectorLibrary.Magnitude(
      this._curveParametric.Xcomponent.ValueAt(angleRadians),
      this._curveParametric.Ycomponent.ValueAt(angleRadians));
  }

  /// <summary>
  /// Curvatures the specified angle radians.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>System.Double.</returns>
  public Curvature(angleRadians: number): number {
    const unitTangentVector = this.UnitTangentVectorAt(angleRadians);
    const unitTangentVectorPrime = unitTangentVector.Differentiate();
    const vectorPrime = this.Differentiate();

    return unitTangentVectorPrime.Magnitude(angleRadians) / vectorPrime.Magnitude(angleRadians);
  }

  /// <summary>
  /// Units the vector at.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>VectorParametric.</returns>
  public UnitVectorAt(angleRadians: number): VectorParametric {
    const vector = new VectorParametric(this._curveParametric, this.Tolerance);

    return vector.divideBy(vector.Magnitude(angleRadians));
  }

  /// <summary>
  /// Units the tangent vector at.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>VectorParametric.</returns>
  public UnitTangentVectorAt(angleRadians: number): VectorParametric {
    const vectorPrime = this.Differentiate();

    return vectorPrime.divideBy(vectorPrime.Magnitude(angleRadians));
  }

  /// <summary>
  /// Units the normal vector at.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>VectorParametric.</returns>
  public UnitNormalVectorAt(angleRadians: number): VectorParametric {
    const unitTangentVector = this.UnitTangentVectorAt(angleRadians);
    const unitTangentVectorPrime = unitTangentVector.Differentiate();

    return unitTangentVectorPrime.divideBy(unitTangentVectorPrime.Magnitude(angleRadians));
  }

  /// <summary>
  /// Converts to vectorat.
  /// </summary>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>Vector.</returns>
  public ToVectorAt(angleRadians: number): Vector {
    const xComponent = this._curveParametric.Xcomponent.ValueAt(angleRadians);
    const yComponent = this._curveParametric.Ycomponent.ValueAt(angleRadians);
    return Vector.fromMagnitudesAtLocation(xComponent, yComponent);
  }

  /// <summary>
  /// Dot product of two vectors.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>System.Double.</returns>
  public DotProductAt(vector: VectorParametric, angleRadians: number): number {
    return VectorLibrary.DotProduct(
      this._curveParametric.Xcomponent.ValueAt(angleRadians),
      this._curveParametric.Ycomponent.ValueAt(angleRadians),
      vector._curveParametric.Xcomponent.ValueAt(angleRadians),
      vector._curveParametric.Ycomponent.ValueAt(angleRadians));
  }

  /// <summary>
  /// Cross-product of two vectors.
  /// </summary>
  /// <param name="vector">The vector.</param>
  /// <param name="angleRadians">The angle radians.</param>
  /// <returns>System.Double.</returns>
  public CrossProductAt(vector: VectorParametric, angleRadians: number): number {
    return VectorLibrary.CrossProduct(
      this._curveParametric.Xcomponent.ValueAt(angleRadians),
      this._curveParametric.Ycomponent.ValueAt(angleRadians),
      vector._curveParametric.Xcomponent.ValueAt(angleRadians),
      vector._curveParametric.Ycomponent.ValueAt(angleRadians));
  }


  /// <summary>
  /// Implements the * operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public multiplyBy(multiplier: number): VectorParametric {
    return new VectorParametric(this._curveParametric.multiplyBy(multiplier));
  }

  /// <summary>
  /// Implements the / operator.
  /// </summary>
  /// <param name="a">a.</param>
  /// <param name="b">The b.</param>
  /// <returns>The result of the operator.</returns>
  public divideBy(denominator: number): VectorParametric {
    if (denominator === 0) { throw new DivideByZeroException(); }

    return new VectorParametric(this._curveParametric.divideBy(denominator));
  }
}