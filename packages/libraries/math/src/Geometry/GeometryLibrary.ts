import { DivideByZeroException } from "common/errors/exceptions";

import { Numbers } from "../Numbers";
import { TrigonometryLibrary as Trig } from '../trigonometry/TrigonometryLibrary';


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:25 PM
 *
 * @export
 * @class GeometryLibrary
 * @typedef {GeometryLibrary}
 */
export class GeometryLibrary {
  // #region Parametric Representations
  // Let γ(t) = (x(t), y(t)) be a proper parametric representation
  // Here proper means that on the domain of definition of the parametrization, the derivative dγ/dt is defined, differentiable and nowhere equal to the zero vector.

  /**
   * Slope of the curve based on all differentiated components being parametric.
   *
   * @static
   * @param {number} xPrime The first differential of x w.r.t. some parameter.
   * @param {number} yPrime The first differential of y w.r.t. some parameter.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static SlopeParametric(xPrime: number, yPrime: number): number {
    if (xPrime == 0) {
      throw new DivideByZeroException("xPrime cannot be zero.");
    }

    return yPrime / xPrime;
  }

  /**
   * Curvature of the curve based on all differentiated components being parametric.
   *
   * See: https://en.wikipedia.org/wiki/Curvature
   *
   * @static
   * @param {number} xPrime The first differential of x w.r.t. some parameter.
   * @param {number} yPrime The first differential of y w.r.t. some parameter.
   * @param {number} xPrimeDouble The second differential of x w.r.t. some parameter.
   * @param {number} yPrimeDouble The second differential of y w.r.t. some parameter.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static CurvatureParametric(
    xPrime: number, yPrime: number,
    xPrimeDouble: number, yPrimeDouble: number
  ): number {
    if (xPrime == 0 && yPrime == 0) {
      throw new DivideByZeroException("xPrime & yPrime cannot both be zero.");
    }

    return (xPrime * yPrimeDouble - yPrime * xPrimeDouble) /
      Numbers.Pow((Numbers.Squared(xPrime) + Numbers.Squared(yPrime)), 3 / 2);
  }



  // #region Graph of a Function
  // The graph of a function y = f(x), is a special case of a parametrized curve, of the form x = t, y = f(t).

  /**
   * Slope of the curve based on all differentiated components being from the graph of a function y = f(x).
   *
   * @static
   * @param {number} yPrime The first differential of y w.r.t. some parameter.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static SlopeGraph(yPrime: number): number {
    return yPrime;
  }


  /**
   * Curvature of the curve based on all differentiated components being from the graph of a function y = f(x).
   *
   * See: https://en.wikipedia.org/wiki/Curvature
   *
   * @static
   * @param {number} yPrime The first differential of y w.r.t. some parameter.
   * @param {number} yPrimeDouble The second differential of y w.r.t. some parameter.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static CurvatureGraph(yPrime: number, yPrimeDouble: number): number {
    return yPrimeDouble / Numbers.Pow((1 + Numbers.Squared(yPrime)), 3 / 2);
  }




  // #region Polar Coordinates
  // If a curve is defined in polar coordinates by the radius expressed as a function of the polar angle, that is r is a function of θ


  /**
   * Slope of the curve based on all differentiated components being the polar radius at θ differentiated by θ.
   *
   * See: https://socratic.org/questions/how-do-you-find-the-slope-of-a-polar-curve
   *
   * @static
   * @param {number} thetaRadians The position θ, in radians.
   * @param {number} radius The polar radius at position θ.
   * @param {number} radiusPrime The first differential of the polar radius w.r.t. θ.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static SlopePolar(thetaRadians: number, radius: number, radiusPrime: number): number {
    if ((radius == 0 && radiusPrime == 0) || (thetaRadians == 0 && radiusPrime == 0)) {
      throw new DivideByZeroException("radius & radiusPrime cannot both be zero.");
    }

    return (radiusPrime * Trig.Sin(thetaRadians) + radius * Trig.Cos(thetaRadians)) /
      (radiusPrime * Trig.Cos(thetaRadians) - radius * Trig.Sin(thetaRadians));
  }

  /**
   * Curvature of the curve based on all differentiated components being the polar radius at θ differentiated by θ.
   *
   * See: https://en.wikipedia.org/wiki/Curvature
   *
   * @static
   * @param {number} radius The polar radius at position θ.
   * @param {number} radiusPrime The first differential of the polar radius w.r.t. θ.
   * @param {number} radiusPrimeDouble The second differential of the polar radius w.r.t. θ.
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static CurvaturePolar(radius: number, radiusPrime: number, radiusPrimeDouble: number): number {
    if (radius == 0 && radiusPrime == 0) {
      throw new DivideByZeroException("radius & radiusPrime cannot both be zero.");
    }

    return Math.abs(Numbers.Squared(radius) + 2 * Numbers.Squared(radiusPrime) - radius * radiusPrimeDouble) /
      Numbers.Pow((Numbers.Squared(radius) + Numbers.Squared(radiusPrime)), 3 / 2);
  }




  // #region Implicit Curves
  // For a curve defined by an implicit equation F(x, y) = 0 with partial derivatives denoted Fx, Fy, Fxx, Fxy, Fyy
  // https://en.wikipedia.org/wiki/Implicit_function

  /**
   * Slope of the curve based on all differentiated components being being partial derivatives of an implicit equation.
   *
   * See: https://en.wikipedia.org/wiki/Implicit_function
   *
   * @static
   * @param {number} Fx For function F(x,y), partial derivative dF/dx
   * @param {number} Fy For function F(x,y), partial derivative dF/dy
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static SlopeImplicit(Fx: number, Fy: number): number {
    if (Fy == 0) {
      throw new DivideByZeroException("Fy cannot be zero.");
    }

    return -1 * Fx / Fy;
  }

  /**
   * Curvature of the curve based on all differentiated components being partial derivatives of an implicit equation.
   *
   * See: https://en.wikipedia.org/wiki/Curvature
   *
   * @static
   * @param {number} Fx For function F(x,y), partial derivative dF/dx
   * @param {number} Fy For function F(x,y), partial derivative dF/dy
   * @param {number} Fxx For function F(x,y), partial derivative (dF/dx)/dx
   * @param {number} Fxy For function F(x,y), partial derivative (dF/dx)/dy
   * @param {number} Fyy For function F(x,y), partial derivative (dF/dy)/dy
   * @return {*}  {number}
   * @memberof GeometryLibrary
   */
  public static CurvatureImplicit(
    Fx: number, Fy: number,
    Fxx: number, Fxy: number, Fyy: number): number {
    if (Fx == 0 && Fy == 0) {
      throw new DivideByZeroException("Fx & Fy cannot both be zero.");
    }

    return Math.abs(Numbers.Squared(Fy) * Fxx - 2 * Fx * Fy * Fxy + Numbers.Squared(Fx) * Fyy) /
      Numbers.Pow((Numbers.Squared(Fx) + Numbers.Squared(Fy)), 3 / 2);
  }
}