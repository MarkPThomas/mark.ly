import { NodeDouble } from "@markpthomas/data-structures";

import { Segment, Vertex } from "../polyline/index";


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @interface INodeOfInterest
 * @typedef {INodeOfInterest}
 * @template {Vertex} TVertex
 * @template {Segment} TSegment
 */
export interface INodeOfInterest<TVertex extends Vertex, TSegment extends Segment> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {number}
 */
  value: number,
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @type {NodeDouble<TVertex | TSegment>[]}
 */
  nodes: NodeDouble<TVertex | TSegment>[]
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @export
 * @class NodeOfInterest
 * @typedef {NodeOfInterest}
 */
export class NodeOfInterest {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:18 PM
 *
 * @static
 * @returns {{ value: number; nodes: {}; \}\}
 */
  static empty() {
    return { value: 0, nodes: [] };
  }
}