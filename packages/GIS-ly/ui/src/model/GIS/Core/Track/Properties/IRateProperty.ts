import { MaxMin } from "../../../../Geometry/Properties";

export interface IRateProperty {
  range: MaxMin; // <SegmentNode<TVertex, TSegment>>
  avg: number;
  median: number;
  stdDev1: number;
}