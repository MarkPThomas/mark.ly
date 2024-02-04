import { BarycentricCoordinate } from "../Coordinates/BarycentricCoordinate";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";

export class Cartesian2DBarycentricConverter {
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
