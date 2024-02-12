import { BarycentricCoordinate } from "../Coordinates/BarycentricCoordinate";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @class Cartesian2DBarycentricConverter
 * @typedef {Cartesian2DBarycentricConverter}
 */
export class Cartesian2DBarycentricConverter {
  /**
 * Creates an instance of Cartesian2DBarycentricConverter.
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @constructor
 * @param {number} tolerance
 */
  constructor(private tolerance: number) { }

  // toBarycentric(
  //   vertexA: CartesianCoordinate,
  //   vertexB: CartesianCoordinate,
  //   vertexC: CartesianCoordinate
  // ): BarycentricCoordinate {
  //   const determinate: number = (vertexB.Y - vertexC.Y) * (vertexA.X - vertexC.X) +
  //     (vertexC.X - vertexB.X) * (vertexA.Y - vertexC.Y);

  //   const alpha: number = ((vertexB.Y - vertexC.Y) * (this.X - vertexC.X) +
  //     (vertexC.X - vertexB.X) * (this.Y - vertexC.Y)) / determinate;

  //   const beta: number = ((vertexC.Y - vertexA.Y) * (this.X - vertexC.X) +
  //     (vertexA.X - vertexC.X) * (this.Y - vertexC.Y)) / determinate;

  //   const gamma: number = 1 - alpha - beta;

  //   return new BarycentricCoordinate(alpha, beta, gamma, this.tolerance);
  // }
}
