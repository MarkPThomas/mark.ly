import { IEquatable } from '@markpthomas/common-libraries/interfaces';

import { ITolerance } from '../ITolerance';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:30 PM
 *
 * @export
 * @interface ICoordinate
 * @typedef {ICoordinate}
 * @extends {IEquatable<ICoordinate>}
 * @extends {ITolerance}
 */
export interface ICoordinate extends IEquatable<ICoordinate>, ITolerance {
}