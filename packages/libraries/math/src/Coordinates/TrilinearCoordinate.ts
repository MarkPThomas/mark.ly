import { IEquatable } from "@markpthomas/common-libraries/interfaces";

import { Numbers } from "../Numbers";
import { BarycentricCoordinate } from "./BarycentricCoordinate";
import { CartesianCoordinate } from "./CartesianCoordinate";
import { CartesianOffset } from "./CartesianOffset";
import { ICoordinate } from "./ICoordinate";

/**
 * A point relative to a given triangle describe the relative directed distances from the three sidelines of the triangle.
 * @see [Wikipedia](https://en.wikipedia.org/wiki/Trilinear_coordinates#Formulas).
 * @implements {IEquatable<TrilinearCoordinate>}
 * @implements {ICoordinate}
 */
export class TrilinearCoordinate implements IEquatable<TrilinearCoordinate>, ICoordinate {
  /**
   * Tolerance to use in all calculations with double types.
   * @type {number}
   */
  public Tolerance: number;

  /**
   * Gets the x.
   * @type {number}
   */
  public X: number;

  /**
   * Gets the y.
   * @type {number}
   */
  public Y: number;

  /**
   * Gets the z.
   * @type {number}
   */
  public Z: number;

  /**
   * Initializes a new instance of the TrilinearCoordinate struct.
   * @param {number} x The x.
   * @param {number} y The y.
   * @param {number} z The z.
   * @param {number} tolerance The tolerance.
   */
  constructor(x: number, y: number, z: number, tolerance: number = Numbers.ZeroTolerance) {
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.Tolerance = tolerance;
  }

  /**
   * To the cartesian.
   * @param {CartesianCoordinate} vertexA The vertex a.
   * @param {CartesianCoordinate} vertexB The vertex b.
   * @param {CartesianCoordinate} vertexC The vertex c.
   * @returns {CartesianCoordinate} CartesianCoordinate.
   */
  public toCartesian(
    vertexA: CartesianCoordinate,
    vertexB: CartesianCoordinate,
    vertexC: CartesianCoordinate
  ): CartesianCoordinate {
    const sideA = CartesianOffset.fromCoordinates(vertexC, vertexB).length();
    const sideB = CartesianOffset.fromCoordinates(vertexA, vertexC).length();
    const sideC = CartesianOffset.fromCoordinates(vertexB, vertexA).length();

    const denominator = sideA * this.X + sideB * this.Y + sideC * this.Z;

    const weight1 = (sideA * this.X) / denominator;
    const weight2 = (sideB * this.Y) / denominator;
    const weight3 = (sideC * this.Z) / denominator;

    const pVector: CartesianCoordinate =
      vertexA.multiplyBy(weight1)
        .addTo(vertexB.multiplyBy(weight2))
        .addTo(vertexC.multiplyBy(weight3));

    return new CartesianCoordinate(pVector.X, pVector.Y, this.Tolerance);
  }

  /**
   * To the barycentric.
   * @param {CartesianCoordinate} vertexA The vertex a.
   * @param {CartesianCoordinate} vertexB The vertex b.
   * @param {CartesianCoordinate} vertexC The vertex c.
   * @returns {BarycentricCoordinate} BarycentricCoordinate.
   */
  public toBarycentric(
    vertexA: CartesianCoordinate,
    vertexB: CartesianCoordinate,
    vertexC: CartesianCoordinate
  ): BarycentricCoordinate {

    const sideA = (vertexC.subtractBy(vertexB)).length();
    const sideB = (vertexA.subtractBy(vertexC)).length();
    const sideC = (vertexB.subtractBy(vertexA)).length();

    return new BarycentricCoordinate(
      this.X * sideA,
      this.Y * sideB,
      this.Z * sideC
    );
  }

  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {TrilinearCoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: TrilinearCoordinate): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.IsEqualTo(this.X, other.X, tolerance) &&
      Numbers.IsEqualTo(this.Y, other.Y, tolerance) &&
      Numbers.IsEqualTo(this.Z, other.Z, tolerance)
    );
  }
}