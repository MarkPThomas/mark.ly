export interface ISegment {
  length: number;
  angle: number;
  speed?: number;
}

export class Segment implements ISegment {
  length: number;
  angle: number;
  speed: number;
}