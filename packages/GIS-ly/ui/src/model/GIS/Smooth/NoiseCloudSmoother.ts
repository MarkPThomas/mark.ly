import { VertexNode } from "../../Geometry/Polyline";
import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";
import { TrackSegment } from "../Track/TrackSegment";

import { Smoother } from "./Smoother";

export class NoiseCloudSmoother extends Smoother {
  private _gpsTimeInterval: number;

  constructor(track: Track, gpsTimeInterval: number = 30) {
    super(track);
    this._gpsTimeInterval = gpsTimeInterval;
  }

  public smoothNoiseClouds(minSpeedMS: number, iterate?: boolean) {
    const minRadiusMeters = minSpeedMS * this._gpsTimeInterval;

    const totalRemovedNodes: VertexNode<TrackPoint, TrackSegment>[][] = [];

    let startCoordNode = this._smoothManager.track.firstPoint;
    let nextCoordNode = startCoordNode?.next as VertexNode<TrackPoint, TrackSegment>;
    while (startCoordNode && nextCoordNode) {
      if (this.isInCloud(startCoordNode, nextCoordNode, minRadiusMeters)) {
        const smoothingResults = this.smoothNextNoiseCloud(startCoordNode, nextCoordNode, minRadiusMeters, iterate);
        totalRemovedNodes.push(smoothingResults.removedNodes);

        if (iterate) {
          startCoordNode = smoothingResults.nextNode as VertexNode<TrackPoint, TrackSegment>;
          nextCoordNode = startCoordNode?.next as VertexNode<TrackPoint, TrackSegment>;
        } else {
          break;
        }
      } else {
        startCoordNode = startCoordNode.next as VertexNode<TrackPoint, TrackSegment>;
        nextCoordNode = nextCoordNode?.next as VertexNode<TrackPoint, TrackSegment>;
      }
    }

    if (iterate) {
      this._smoothManager.track.updateGeoJsonTrack(totalRemovedNodes.length);
    }

    return { nodes: totalRemovedNodes.flat().length, clouds: totalRemovedNodes.length };
  }

  protected smoothNextNoiseCloud(
    startCoordNode: VertexNode<TrackPoint, TrackSegment>,
    nextCoordNode: VertexNode<TrackPoint, TrackSegment>,
    minRadiusMeters: number,
    iterate?: boolean) {
    const presumedPauseNode = startCoordNode;

    const removedNodes = [presumedPauseNode];
    let totalLat = presumedPauseNode.val.lat;
    let totalLng = presumedPauseNode.val.lng;
    let prevCoordNode: VertexNode<TrackPoint, TrackSegment>;
    while (nextCoordNode && this.isInCloud(presumedPauseNode, nextCoordNode, minRadiusMeters)) {
      totalLat += nextCoordNode.val.lat;
      totalLng += nextCoordNode.val.lng;
      prevCoordNode = nextCoordNode;

      removedNodes.push(nextCoordNode);

      nextCoordNode = nextCoordNode.next as VertexNode<TrackPoint, TrackSegment>;
    }

    const presumedResumeNode = prevCoordNode;
    const averageCoord = new TrackPoint(totalLat / removedNodes.length, totalLng / removedNodes.length);

    // Generate new nodes
    const smoothedPauseCoord = averageCoord.clone() as TrackPoint;
    (smoothedPauseCoord as TrackPoint).timestamp = presumedPauseNode.val.timestamp;
    const smoothedPauseNode = new VertexNode<TrackPoint, TrackSegment>(smoothedPauseCoord);

    const smoothedResumeCoord = averageCoord.clone() as TrackPoint;
    (smoothedResumeCoord as TrackPoint).timestamp = presumedResumeNode.val.timestamp;
    const smoothedResumeNode = new VertexNode<TrackPoint, TrackSegment>(smoothedResumeCoord);

    // Remove cloud nodes & connect new ones
    const prevNodeKept = removedNodes[0].prev as VertexNode<TrackPoint, TrackSegment>;
    const nextNodeKept = removedNodes[removedNodes.length - 1].next as VertexNode<TrackPoint, TrackSegment>;

    if (!prevNodeKept) {
      this._smoothManager.track.replaceBetween(prevNodeKept, nextNodeKept, [smoothedResumeNode], iterate);
    } else if (!nextNodeKept) {
      this._smoothManager.track.replaceBetween(prevNodeKept, nextNodeKept, [smoothedPauseNode], iterate);
    } else {
      this._smoothManager.track.replaceBetween(prevNodeKept, nextNodeKept, [smoothedPauseNode, smoothedResumeNode], iterate);
    }

    return { removedNodes, nextNode: nextNodeKept };
  }

  protected isInCloud(
    startCoord: VertexNode<TrackPoint, TrackSegment>,
    nextCoord: VertexNode<TrackPoint, TrackSegment>,
    minRadiusM: number
  ) {
    return startCoord.val.distanceTo(nextCoord.val) < minRadiusM;
  }
}