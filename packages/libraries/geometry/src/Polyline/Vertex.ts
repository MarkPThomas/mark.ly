import { ICloneable, IEquatable } from '@markpthomas/common-libraries/interfaces';

/**
 * Vertices in are the points where two or more line segments or edges meet (like a corner).
 *
 * @export
 * @interface IVertexProperties
 */
export interface IVertexProperties {
  // Left blank as vertex could be in a variety of coordinate systems, such as LatLong, Cartesian, etc.
}

/**
 * Vertices in are the points where two or more line segments or edges meet (like a corner).
 *
 * @export
 * @interface IVertex
 */
export interface IVertex
  extends
  IVertexProperties,
  ICloneable<Vertex>,
  IEquatable<IVertexProperties> {
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @export
 * @abstract
 * @class Vertex
 * @typedef {Vertex}
 * @implements {IVertex}
 */
export abstract class Vertex implements IVertex {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @abstract
 * @returns {Vertex}
 */
  abstract clone(): Vertex;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:19 PM
 *
 * @abstract
 * @param {IVertexProperties} item
 * @returns {boolean}
 */
  abstract equals(item: IVertexProperties): boolean;
}