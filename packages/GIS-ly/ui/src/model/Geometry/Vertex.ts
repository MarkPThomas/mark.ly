import { ICloneable, IEquatable } from '../../../../../common/interfaces';

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

export abstract class Vertex implements IVertex {
  abstract clone(): Vertex;
  abstract equals(item: IVertexProperties): boolean;
}