import { IEquatable } from "@markpthomas/common-libraries/interfaces";

import { ITolerance } from "../ITolerance";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:29 PM
 *
 * @export
 * @interface ICoordinate3D
 * @typedef {ICoordinate3D}
 * @extends {IEquatable<ICoordinate3D>}
 * @extends {ITolerance}
 */
export interface ICoordinate3D extends IEquatable<ICoordinate3D>, ITolerance {
}