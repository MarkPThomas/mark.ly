import { ICloneable, IEquatable } from '@markpthomas/common-libraries/interfaces';

import { IRouteSegmentProperties, RouteSegment } from './RouteSegment';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRoutePathPropsProperties
 * @typedef {IRoutePathPropsProperties}
 */
export interface IRoutePathPropsProperties {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  rotation: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @interface IRoutePathProps
 * @typedef {IRoutePathProps}
 * @extends {IRoutePathPropsProperties}
 * @extends {ICloneable<RoutePathProps>}
 * @extends {IEquatable<IRoutePathPropsProperties>}
 */
export interface IRoutePathProps
  extends IRoutePathPropsProperties,
  ICloneable<RoutePathProps>,
  IEquatable<IRoutePathPropsProperties> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IRouteSegmentProperties} prevSegment
 * @param {IRouteSegmentProperties} nextSegment
 */
  addPropertiesFromPath(
    prevSegment: IRouteSegmentProperties,
    nextSegment: IRouteSegmentProperties
  ): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @export
 * @class RoutePathProps
 * @typedef {RoutePathProps}
 * @implements {IRoutePathProps}
 */
export class RoutePathProps
  implements IRoutePathProps {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @type {number}
 */
  rotation: number = 0;

  /**
 * Creates an instance of RoutePathProps.
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @constructor
 * @param {?number} [rotation]
 */
  constructor(rotation?: number) {
    this.rotation = rotation ?? null;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @returns {RoutePathProps}
 */
  clone(): RoutePathProps {
    const pathProps = new RoutePathProps(this.rotation);

    return pathProps;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IRoutePathPropsProperties} pathProps
 * @returns {boolean}
 */
  equals(pathProps: IRoutePathPropsProperties): boolean {
    return pathProps.rotation === this.rotation;
  }

  // === Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:54 PM
 *
 * @param {IRouteSegmentProperties} prevSegment
 * @param {IRouteSegmentProperties} nextSegment
 */
  addPropertiesFromPath(
    prevSegment: IRouteSegmentProperties,
    nextSegment: IRouteSegmentProperties
  ) {
    this.rotation = RouteSegment.calcPathRotationRad(prevSegment, nextSegment);
  }
}