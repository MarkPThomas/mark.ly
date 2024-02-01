
// /**
//  * Handles transformations between global coordinates and local coordinates.
//  *
//  * @export
//  * @class Transformations
//  */
// export class Transformations {
//   /// <summary>
//   /// Gets the local origin.
//   /// </summary>
//   /// <value>The local origin.</value>
//   public CartesianCoordinate LocalOrigin { get; }
//         /// <summary>
//         /// Gets the local axis x.
//         /// </summary>
//         /// <value>The local axis x.</value>
//         public CartesianCoordinate LocalAxisX { get; }

import { AngularOffset } from "./Coordinates/AngularOffset";
import { CartesianCoordinate } from "./Coordinates/CartesianCoordinate";
import { CartesianOffset } from "./Coordinates/CartesianOffset";

//         /// <summary>
//         /// Gets the rotation.
//         /// </summary>
//         /// <value>The rotation.</value>
//         public AngularOffset Rotation { get; }

//         /// <summary>
//         /// Gets the displacement.
//         /// </summary>
//         /// <value>The displacement.</value>
//         public CartesianOffset Displacement { get; }

//         /// <summary>
//         /// Initializes a new instance of the <see cref="Transformations"/> class.
//         /// </summary>
//         /// <param name="localOriginInGlobal">The local origin in global coordinates.</param>
//         /// <param name="localAxisXPtInGlobal">Any point along the local x-axis in global coordinates.</param>
//         public Transformations(CartesianCoordinate localOriginInGlobal, CartesianCoordinate localAxisXPtInGlobal)
// {
//   LocalOrigin = localOriginInGlobal;
//   LocalAxisX = localAxisXPtInGlobal;

//   Displacement = localOriginInGlobal.OffsetFrom(CartesianCoordinate.Origin());
//   if (localAxisXPtInGlobal.Y == localOriginInGlobal.Y) {
//     Rotation = new AngularOffset();
//   }
//   else {
//     Rotation = AngularOffset.CreateFromPoints(
//       localAxisXPtInGlobal,
//       localOriginInGlobal,
//       new CartesianCoordinate(localOriginInGlobal.X - 1, localOriginInGlobal.Y)
//     );
//   }
// }

//         /// <summary>
//         /// Transforms to global.
//         /// </summary>
//         /// <param name="localCoordinate">The local coordinate.</param>
//         /// <returns>CartesianCoordinate.</returns>
//         public CartesianCoordinate TransformToGlobal(CartesianCoordinate localCoordinate)
// {
//             CartesianCoordinate translatedCoordinate = new CartesianCoordinate(LocalOrigin.X + localCoordinate.X, LocalOrigin.Y + localCoordinate.Y);
//   return CartesianCoordinate.RotateAboutPoint(translatedCoordinate, LocalOrigin, Rotation.ToAngle().Radians);;
// }

//         /// <summary>
//         /// Transforms to local.
//         /// </summary>
//         /// <param name="globalCoordinate">The global coordinate.</param>
//         /// <returns>CartesianCoordinate.</returns>
//         public CartesianCoordinate TransformToLocal(CartesianCoordinate globalCoordinate)
// {
//             CartesianCoordinate rotatedCoordinate = CartesianCoordinate.RotateAboutPoint(globalCoordinate, LocalOrigin, -1 * Rotation.ToAngle().Radians);
//   return rotatedCoordinate - LocalOrigin;
// }
// }

/**
 * Handles transformations between global coordinates and local coordinates.
 */
export class Transformations {
  /**
   * Gets the local origin.
   */
  public readonly LocalOrigin: CartesianCoordinate;

  /**
   * Gets the local axis x.
   */
  public readonly LocalAxisX: CartesianCoordinate;

  /**
   * Gets the rotation.
   */
  public readonly Rotation: AngularOffset;

  /**
   * Gets the displacement.
   */
  public readonly Displacement: CartesianOffset;

  /**
   * Initializes a new instance of the Transformations class.
   * @param localOriginInGlobal The local origin in global coordinates.
   * @param localAxisXPtInGlobal Any point along the local x-axis in global coordinates.
   */
  constructor(localOriginInGlobal: CartesianCoordinate, localAxisXPtInGlobal: CartesianCoordinate) {
    this.LocalOrigin = localOriginInGlobal;
    this.LocalAxisX = localAxisXPtInGlobal;

    this.Displacement = localOriginInGlobal.OffsetFrom(CartesianCoordinate.Origin());

    if (localAxisXPtInGlobal.Y === localOriginInGlobal.Y) {
      this.Rotation = AngularOffset.fromNone();
    } else {
      this.Rotation = AngularOffset.fromPoints(
        localAxisXPtInGlobal,
        localOriginInGlobal,
        new CartesianCoordinate(localOriginInGlobal.X - 1, localOriginInGlobal.Y)
      );
    }
  }

  /**
   * Transforms to global.
   * @param localCoordinate The local coordinate.
   * @returns CartesianCoordinate.
   */
  public TransformToGlobal(localCoordinate: CartesianCoordinate): CartesianCoordinate {
    const translatedCoordinate = new CartesianCoordinate(
      this.LocalOrigin.X + localCoordinate.X,
      this.LocalOrigin.Y + localCoordinate.Y
    );

    return CartesianCoordinate.RotateAboutPoint(translatedCoordinate, this.LocalOrigin, this.Rotation.ToAngle().Radians);
  }

  /**
   * Transforms to local.
   * @param globalCoordinate The global coordinate.
   * @returns CartesianCoordinate.
   */
  public TransformToLocal(globalCoordinate: CartesianCoordinate): CartesianCoordinate {
    const rotatedCoordinate = CartesianCoordinate.RotateAboutPoint(
      globalCoordinate,
      this.LocalOrigin,
      -1 * this.Rotation.ToAngle().Radians
    );

    return rotatedCoordinate.subtractBy(this.LocalOrigin);
  }
}
