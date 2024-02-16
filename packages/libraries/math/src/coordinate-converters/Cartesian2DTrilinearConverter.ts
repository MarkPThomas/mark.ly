import { BarycentricCoordinate } from "../coordinates/BarycentricCoordinate";
import { CartesianCoordinate } from "../coordinates/CartesianCoordinate";
import { TrilinearCoordinate } from "../coordinates/TrilinearCoordinate";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @class Cartesian2DTrilinearConverter
 * @typedef {Cartesian2DTrilinearConverter}
 */
export class Cartesian2DTrilinearConverter {
  // /**
  //  * Converts to Trilinear coordinates.
  //  * @param vertexA The vertex a.
  //  * @param vertexB The vertex b.
  //  * @param vertexC The vertex c.
  //  * @returns TrilinearCoordinate.
  //  */
  // toTrilinear(vertexA: CartesianCoordinate, vertexB: CartesianCoordinate, vertexC: CartesianCoordinate): TrilinearCoordinate {
  //   const barycentric: BarycentricCoordinate = this.toBarycentric(vertexA, vertexB, vertexC);
  //   return barycentric.toTrilinear(vertexA, vertexB, vertexC);
  // }

  // private toBarycentric(vertexA: CartesianCoordinate, vertexB: CartesianCoordinate, vertexC: CartesianCoordinate): BarycentricCoordinate {
  //   // Implementation of ToBarycentric() method
  //   // You need to define or implement this method based on the C# counterpart
  //   // This method should return a BarycentricCoordinate
  //   // ...
  //   return new BarycentricCoordinate();
  // }
}