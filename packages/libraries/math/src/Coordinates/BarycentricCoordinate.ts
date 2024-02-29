import { IEquatable } from "@markpthomas/common-libraries/interfaces";

import { Numbers } from "../Numbers";
import { CartesianCoordinate } from "./CartesianCoordinate";
import { CartesianOffset } from "./CartesianOffset";
import { ICoordinate } from "./ICoordinate";
import { TrilinearCoordinate } from "./TrilinearCoordinate";

/**
 * A coordinate system in which the location of a point of a simplex (a triangle, tetrahedron, etc.) is specified as the center of mass, or barycenter, of usually unequal masses placed at its vertices.
 * @see [Wikipedia](https://en.wikipedia.org/wiki/Barycentric_coordinate_system).
 * @implements {IEquatable<BarycentricCoordinate>}
 * @implements {ICoordinate}
 */
export class BarycentricCoordinate implements IEquatable<BarycentricCoordinate>, ICoordinate {
  /**
   * Tolerance to use in all calculations with double types.
   * @type {number}
   */
  public Tolerance: number;

  /**
   * Gets the alpha.
   * @type {number}
   */
  public Alpha: number;

  /**
   * Gets the beta.
   * @type {number}
   */
  public Beta: number;

  /**
   * Gets the gamma.
   * @type {number}
   */
  public Gamma: number;

  /**
   * Initializes a new instance of the BarycentricCoordinate struct.
   * @param {number} alpha The alpha.
   * @param {number} beta The beta.
   * @param {number} gamma The gamma.
   * @param {number} tolerance The tolerance.
   */
  constructor(alpha: number, beta: number, gamma: number, tolerance: number = Numbers.ZeroTolerance) {
    this.Alpha = alpha;
    this.Beta = beta;
    this.Gamma = gamma;
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

    const x = this.Alpha * vertexA.X + this.Beta * vertexB.X + this.Gamma * vertexC.X;
    const y = this.Alpha * vertexA.Y + this.Beta * vertexB.Y + this.Gamma * vertexC.Y;

    return new CartesianCoordinate(x, y, this.Tolerance);
  }

  /**
   * To the trilinear.
   * @param {CartesianCoordinate} vertexA The vertex a.
   * @param {CartesianCoordinate} vertexB The vertex b.
   * @param {CartesianCoordinate} vertexC The vertex c.
   * @returns {TrilinearCoordinate} TrilinearCoordinate.
   */
  public toTrilinear(
    vertexA: CartesianCoordinate,
    vertexB: CartesianCoordinate,
    vertexC: CartesianCoordinate
  ): TrilinearCoordinate {

    const sideA = CartesianOffset.fromCoordinates(vertexC, vertexB).length();
    const sideB = CartesianOffset.fromCoordinates(vertexA, vertexC).length();
    const sideC = CartesianOffset.fromCoordinates(vertexB, vertexA).length();

    return new TrilinearCoordinate(
      this.Alpha / sideA,
      this.Beta / sideB,
      this.Gamma / sideC
    );
  }

  /**
   * Indicates whether the current object is equal to another object of the same type.
   * @param {BarycentricCoordinate} other An object to compare with this object.
   * @returns {boolean} true if the current object is equal to the other parameter; otherwise, false.
   */
  equals(other: BarycentricCoordinate): boolean {
    const tolerance = Math.min(this.Tolerance, other.Tolerance);
    return (
      Numbers.IsEqualTo(this.Alpha, other.Alpha, tolerance) &&
      Numbers.IsEqualTo(this.Beta, other.Beta, tolerance) &&
      Numbers.IsEqualTo(this.Gamma, other.Gamma, tolerance)
    );
  }
}