import { NodeDouble } from "common/utils/dataStructures/LinkedListDouble";
import { Segment, Vertex } from "../Polyline";


export interface INodeOfInterest<TVertex extends Vertex, TSegment extends Segment> {
  value: number,
  nodes: NodeDouble<TVertex | TSegment>[]
}