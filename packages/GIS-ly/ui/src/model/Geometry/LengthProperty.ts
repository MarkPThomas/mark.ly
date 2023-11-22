import {
  SegmentNode,
  VertexNode
} from "./Polyline";
import {
  Sum
} from "./Properties";
import { Segment } from "./Segment";
import { Vertex } from "./Vertex";

export interface ILength {
  length: Sum
}

export class LengthProperty<TVertex extends Vertex, TSegment extends Segment> implements ILength {
  length: Sum

  // Standard deviations need an average, as well as a total length
  // So aggregator/size is needed for:
  // 1. Averages
  // 2. Standard Deviations

  // Calculating across all nodes is needed for summations/integrations such as:
  // Total length, elevation gain, elevation loss, etc.

  // However, some properties, such as net elevation difference or duration just need 1st/last nodes

  // Total updates may go as follows:
  // 1. Start/end 1-step calc (duration, net height, etc.)
  // 2. Summation calc (elevation gain, distance, etc.)
  // 3. Combination of summation calcs (e.g. for average, total numerator item, divided by total denominator item)
  // 4. Higher order combinations - (e.g. standard deviations) calcs that need summations where each item is combined with a prior combination of summation calcs

  // Might make more sense to break each of these out into separate methods.
  // These may be called in different combinations depending on need.
  // Async calls between faster/slower methods might be premature optimization.
  // Standard deviations are needed for time estimations... maybe give probabilities as part of the result context
  //    For general track review, is it worthwhile to always calculate for segments?
  //    Worst case to care about cost hit is full track length.
  //    Maybe is worth always doing. Just present it in a friendlier way than sigma
  //    UX idea - have sigma%, on hover or click, show graph of bell curve with what that MEANS.
  // Naive solution:
  //    Start out just doing all for the entire range. Optimize later if it is a problem, or take some metrics.
  //    For each inheritance, the procedure is to implement all levels independently.
  // i.e. DON'T. GET. FANCY.
  // extra iterations at route don't matter at track, depth levels of inheritance * track length probably small enough
  fromTo(
    start: VertexNode<TVertex, TSegment>,
    end: VertexNode<TVertex, TSegment>
  ): void {
    this.length = new Sum();

    let segNode = start.nextSeg;
    while (segNode) {
      this.add(segNode);

      if (segNode.nextVert === end) {
        break;
      } else {
        segNode = segNode.next as SegmentNode<TVertex, TSegment>;
      }
    }
  }

  add(segment: SegmentNode<TVertex, TSegment>) {
    this.length.add(segment.val.length);
  }

  remove(segment: SegmentNode<TVertex, TSegment>) {
    this.length.remove(segment.val.length);
  }
}