import { BoundingBox } from '../../../GeoJSON/BoundingBox';

import {
  VertexNode,
  IPolyline,
  Polyline
} from '../../../Geometry';

// import { ElevationRequestApi } from '../../elevationDataApi';
import { ElevationRequestApi } from '../../../../../../server/api/elevationDataApi';

import { IRoutePointProperties, RoutePoint } from './RoutePoint';
import { RouteSegment } from './RouteSegment';
import { IPointProperties } from '../Point/Point';
import { IRouteStats } from './Properties/IRouteStats';

type CoordNode = VertexNode<RoutePoint, RouteSegment>;



export interface IPolylineRouteMethods<TVertex extends RoutePoint, TSegment extends RouteSegment> {
  // Misc Methods
  /**
     * Adds elevation data to the track for matching lat/long points.
     *
     * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
     * from { lat: number, lng: number } as a JSON string.
     * @memberof Track
     */
  addElevations(elevations: Map<string, number>): void;

  /**
   * Adds derived elevation properties to Segments and Points based on elevation data in the Points.
   *
   * @memberof ITrack
   */
  addElevationProperties(): void;

  /**
   * Queries an API to add mapped elevation data to the Polyline.
   *
   * @memberof Track
   */
  addElevationsFromApi(): void;

  cloneFromToPoints(
    startPoint: IPointProperties | null,
    endPoint: IPointProperties | null
  ): PolylineRoute<TVertex, TSegment> | null;

  vertexNodesByPoint(point: IPointProperties): VertexNode<TVertex, TSegment>[];

  // Delete Methods
  trimBeforePoint(point: IPointProperties): VertexNode<TVertex, TSegment> | null;
  trimAfterPoint(point: IPointProperties): VertexNode<TVertex, TSegment> | null;
  trimToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment>[];

  removeAtPoint(point: IPointProperties): VertexNode<TVertex, TSegment>;
  removeAtAnyPoint(points: IPointProperties[]): VertexNode<TVertex, TSegment>[];
  removeBetweenPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment>;
  removeFromToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment>;

  // Update Methods
  prependPoints(
    points: IRoutePointProperties | IRoutePointProperties[],
    returnListCount: boolean
  ): number;
  prependRoute(
    route: PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): number;
  appendPoints(
    points: IRoutePointProperties | IRoutePointProperties[],
    returnListCount: boolean
  ): number;
  appendRoute(
    route: PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): number;

  insertBeforePoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): number;
  insertAfterPoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): number;

  replaceAtPoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;
  replaceBetweenPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;
  replaceFromToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null;

  // Split Methods
  splitByPoint(
    point: IPointProperties
  ): PolylineRoute<TVertex, TSegment>[];
  splitByPoints(
    points: IPointProperties[]
  ): PolylineRoute<TVertex, TSegment>[];
}

export interface IPolylineRoute<TVertex extends RoutePoint, TSegment extends RouteSegment>
  extends
  IPolyline<TVertex, TSegment>,
  IPolylineRouteMethods<TVertex, TSegment> {

  // stats: IRouteStats;
}

export class PolylineRoute<TVertex extends RoutePoint, TSegment extends RouteSegment>
  extends Polyline<TVertex, TSegment>
  implements IPolylineRoute<TVertex, TSegment>
{
  // TODO: Abstract this & generic stats type to Polyline
  // protected _statsDirty: boolean;
  // protected _stats: IRouteStats;
  // get stats(): IRouteStats {
  //   if (!this._stats || this._statsDirty) {
  //     this._stats = this.calcStats();
  //     if (this._statsDirty) {
  //       this._statsDirty = false;
  //     }
  //   }
  //   return this._stats;
  // }
  protected override _properties: IRouteStats;

  constructor(coords: VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | TVertex[]) {
    super(coords);
  }

  protected override createPolyline(coords: VertexNode<TVertex, TSegment>[] = []): PolylineRoute<TVertex, TSegment> {
    return new PolylineRoute(coords);
  }

  // TODO: Currently assumed that lat/long are not unique, allowing a route to revisit the same lat/lng
  //   This will not clone correctly as it will always use the first occurrence.
  //   Determine how/whether this can/should be supported, e.g. by having arguments that specify which # occurrence is to be chosen?
  cloneFromToPoints(
    startPoint: IPointProperties | null = null,
    endPoint: IPointProperties | null = null
  ): PolylineRoute<TVertex, TSegment> | null {

    let startVertex: VertexNode<TVertex, TSegment> | null;
    let endVertex: VertexNode<TVertex, TSegment> | null;

    if (startPoint !== null) {
      const startVertices = this.vertexNodesByPoint(startPoint) as VertexNode<TVertex, TSegment>[];
      if (startVertices?.length > 1) {
        console.log(`Warning!
        ${startVertices.length} coordinates found for start vertex ${startPoint}.
        Cloning might not work on desired specified range.`);
      }

      startVertex = startVertices[0];
    } else {
      startVertex = null;
    }

    if (endPoint !== null) {
      const endVertices = this.vertexNodesByPoint(endPoint) as VertexNode<TVertex, TSegment>[];
      if (endVertices?.length > 1) {
        console.log(`Warning!
        ${endVertices.length} coordinates found for end vertex ${endPoint}.
        Cloning might not work on desired specified range.`);
      }

      endVertex = endVertices[0];
    } else {
      endVertex = null;
    }

    if (startVertex === undefined || endVertex === undefined) {
      return null;
    }

    return this.cloneFromTo(startVertex, endVertex) as PolylineRoute<TVertex, TSegment>;
  }

  protected initializePoint(point: IRoutePointProperties): RoutePoint {
    return RoutePoint.fromProperties(point);
  }

  protected initializeVertex(point: IRoutePointProperties | VertexNode<TVertex, TSegment>): VertexNode<TVertex, TSegment> {
    return VertexNode.isVertexNode(point)
      ? point as VertexNode<TVertex, TSegment>
      : new VertexNode<TVertex, TSegment>(this.initializePoint(point as IRoutePointProperties) as TVertex);
  }

  // === Property Methods
  protected override addPropertiesToNodes() {
    super.addPropertiesToNodes();
    this.addPathPropertiesToCoords();
  }

  protected addPathPropertiesToCoords() {
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      this.updatePathProperties([coord as VertexNode<TVertex, TSegment>])

      coord = coord.next as CoordNode;
    }
  }

  protected override updatePathProperties(vertices: VertexNode<TVertex, TSegment>[]) {
    vertices.forEach((vertex) => {
      vertex.val.path.addPropertiesFromPath(vertex.prevSeg?.val, vertex.nextSeg?.val);
    });
  }

  protected override createSegmentValue(prevCoord: RoutePoint, nextCoord: RoutePoint): TSegment {
    return RouteSegment.fromRoutePoints(prevCoord, nextCoord) as TSegment;
  }

  /**
   * Adds elevation-derived properties from nodes to segments.
   * Adds further elevation-derived properties from segments back to nodes.
   *
   * Does nothing if nodes do not have elevation properties.
   *
   * @memberof PolylineTrack
   */
  addElevationProperties() {
    this.addElevationDataToSegments();
  }


  addElevations(elevations: Map<string, number> | { [key: string]: number }) {
    this.addNodeElevations(elevations);
    // TODO: What if route properties haven't been run?
    //  Should this be manual like that?
    //  Or should that be lazily triggered by this?
    //  Or should both be manual?
    this.addElevationProperties();
  }

  protected addNodeElevations(elevations: Map<string, number> | { [key: string]: number }) {
    console.log('Adding elevations to points...')
    console.log('Elevations: ', elevations)
    let updatedPoints = 0;
    let totalElevations = elevations instanceof Map ? elevations.size : Object.keys(elevations).length;
    let totalPoints = 0;
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      const elevation = elevations instanceof Map
        ? elevations.get(JSON.stringify({ lat: coord.val.lat, lng: coord.val.lng }))
        : elevations[`${coord.val.lat},${coord.val.lng}`];
      if (elevation) {
        // console.log('Elevation: ', elevation)
        updatedPoints++;
        coord.val.elevation = elevation;
      }

      coord = coord.next as CoordNode;
      totalPoints++;
    }
    console.log(`${updatedPoints} of ${totalPoints} points updated with elevations from ${totalElevations} elevations`)
  }

  addElevationsFromApi() {
    const coords = this._vertices.toArray();
    const boundingBox = BoundingBox.fromPoints(coords);
    console.log(`Getting elevations for ${coords.length} coords`);

    const elevationsApi = new ElevationRequestApi();
    elevationsApi.getElevations(coords, boundingBox)
      // TODO: How does this work with requests 100 at a time?
      .then((result) => {
        if (result.elevations) {
          console.log(`Received elevations for ${result.elevations.size} coords`);
          console.log('Result: ', result);

          this.addElevations(result.elevations);
        } else {
          console.log('No elevations received');
        }
      });
    // TODO: Only once the entire API payload is processed should this be called:
    // this.addElevationProperties();
  }

  protected addElevationDataToSegments() {
    console.log('Deriving elevation data for segments...')
    let coord = this._vertices.head?.next as VertexNode<TVertex, TSegment>;
    let segmentCount = 0;
    let updatedSegmentCount = 0;
    while (coord) {
      const prevCoord = coord.prev as VertexNode<TVertex, TSegment>;
      const prevSegmentVal = prevCoord.nextSeg?.val as TSegment;

      // console.log('prevCoord: ', prevCoord)
      // console.log('prevSegmentVal: ', prevSegmentVal)
      // console.log('coord: ', coord)


      if (prevSegmentVal && prevSegmentVal.addElevationData) {
        // console.log('adding elevation data')
        updatedSegmentCount++;
        prevSegmentVal.addElevationData(prevCoord.val, coord.val);
      }

      coord = coord.next as VertexNode<TVertex, TSegment>;
      segmentCount++;
    }
    console.log(`Updated ${updatedSegmentCount} segments out of ${segmentCount}`)
  }

  // === Query Methods
  vertexNodesByPoint(point: IPointProperties): VertexNode<TVertex, TSegment>[] {
    return this.vertexNodesBy(
      point,
      (target: IPointProperties, vertexNode: VertexNode<TVertex, TSegment>) =>
        target &&
        vertexNode.val.lat === target.lat
        && vertexNode.val.lng === target.lng
        && (!target.alt || vertexNode.val.alt === target.alt)
        && (!target.elevation || vertexNode.val.elevation === target.elevation)
    );
  }

  // TODO: What is a unique property. By node value?
  static isPolylineRoute(polyline: any) {
    return polyline instanceof PolylineRoute || 'firstVertex' in polyline;
  }

  // === Delete Methods
  trimBeforePoint(point: IPointProperties): VertexNode<TVertex, TSegment> | null {
    const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment> ?? null;

    return vertex ? this.trimBefore(vertex) : null;
  }

  trimAfterPoint(point: IPointProperties): VertexNode<TVertex, TSegment> | null {
    const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment> ?? null;

    return vertex ? this.trimAfter(vertex) : null;
  }

  trimToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment>[] {
    const startVertex = this.vertexNodesByPoint(startPoint)[0] as VertexNode<TVertex, TSegment> ?? null;
    const endVertex = this.vertexNodesByPoint(endPoint)[0] as VertexNode<TVertex, TSegment> ?? null;

    return this.trimTo(startVertex, endVertex);
  }

  removeAtPoint(point: IPointProperties): VertexNode<TVertex, TSegment> {
    const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment> ?? null;

    return this.removeAt(vertex);
  }

  removeAtAnyPoint(points: IPointProperties[]): VertexNode<TVertex, TSegment>[] {
    const vertices = [];

    points.forEach(
      (point) => {
        const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment>;
        if (vertex) {
          vertices.push(vertex);
        }
      }
    );

    return this.removeAtAny(vertices);
  }

  removeBetweenPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment> {
    const startVertex = this.vertexNodesByPoint(startPoint)[0] as VertexNode<TVertex, TSegment> ?? null;
    const endVertex = this.vertexNodesByPoint(endPoint)[0] as VertexNode<TVertex, TSegment> ?? null;

    return this.removeBetween(startVertex, endVertex);
  }

  removeFromToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): VertexNode<TVertex, TSegment> {
    const startVertex = this.vertexNodesByPoint(startPoint)[0] as VertexNode<TVertex, TSegment> ?? null;
    const endVertex = this.vertexNodesByPoint(endPoint)[0] as VertexNode<TVertex, TSegment> ?? null;

    return this.removeFromTo(startVertex, endVertex);
  }

  // === Update Methods
  prependPoints(
    points: IRoutePointProperties | IRoutePointProperties[],
    returnListCount: boolean = false
  ): number {
    if (Array.isArray(points)) {
      const vertices = points.map((point) => this.initializePoint(point) as TVertex);
      return this.prepend(vertices, returnListCount);
    } else {
      const vertex = this.initializePoint(points) as TVertex;
      return this.prepend(vertex, returnListCount);
    }
  }

  prependRoute(
    route: PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    return this.prepend(route, returnListCount);
  }

  appendPoints(
    points: IRoutePointProperties | IRoutePointProperties[],
    returnListCount: boolean = false
  ): number {
    if (Array.isArray(points)) {
      const vertices = points.map((point) => this.initializePoint(point) as TVertex);
      return this.append(vertices, returnListCount);
    } else {
      const vertex = this.initializePoint(points) as TVertex;
      return this.append(vertex, returnListCount);
    }
  }

  appendRoute(
    route: PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    return this.append(route, returnListCount);
  }

  insertBeforePoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    const targetVertex = this.vertexNodesByPoint(targetPoint)[0] as VertexNode<TVertex, TSegment>;
    if (!targetVertex) {
      return 0;
    }

    if (Array.isArray(items)) {
      const insertionVertices = items.map((point) => this.initializePoint(point) as TVertex);
      return this.insertBefore(targetVertex, insertionVertices, returnListCount);
    } else if (items instanceof PolylineRoute || items instanceof Polyline) {
      return this.insertBefore(targetVertex, items, returnListCount);
    } else {
      const insertionVertex = this.initializeVertex(items as IRoutePointProperties);
      return this.insertBefore(targetVertex, insertionVertex, returnListCount);
    }
  }

  insertAfterPoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): number {
    const targetVertex = this.vertexNodesByPoint(targetPoint)[0] as VertexNode<TVertex, TSegment>;
    if (!targetVertex) {
      return 0;
    }

    if (Array.isArray(items)) {
      const insertionVertices = items.map((point) => this.initializePoint(point) as TVertex);
      return this.insertAfter(targetVertex, insertionVertices, returnListCount);
    } else if (items instanceof PolylineRoute || items instanceof Polyline) {
      return this.insertAfter(targetVertex, items, returnListCount);
    } else {
      const insertionVertex = this.initializeVertex(items as IRoutePointProperties);
      return this.insertAfter(targetVertex, insertionVertex, returnListCount);
    }
  }

  replaceAtPoint(
    targetPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {
    const targetVertex = this.vertexNodesByPoint(targetPoint)[0] as VertexNode<TVertex, TSegment>;
    if (!targetVertex) {
      return null;
    }

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializePoint(point) as TVertex);
      return this.replaceAt(targetVertex, replacementVertices, returnListCount);
    } else if (items instanceof PolylineRoute || items instanceof Polyline) {
      return this.replaceAt(targetVertex, items, returnListCount);
    } else {
      const insertionVertex = this.initializeVertex(items as IRoutePointProperties);
      return this.replaceAt(targetVertex, insertionVertex, returnListCount);
    }
  }

  replaceBetweenPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {
    const startVertex = this.vertexNodesByPoint(startPoint)[0] as VertexNode<TVertex, TSegment> ?? null;
    const endVertex = this.vertexNodesByPoint(endPoint)[0] as VertexNode<TVertex, TSegment> ?? null;

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializePoint(point) as TVertex);
      return this.replaceBetween(startVertex, endVertex, replacementVertices, returnListCount);
    } else if (items instanceof PolylineRoute || items instanceof Polyline) {
      return this.replaceBetween(startVertex, endVertex, items, returnListCount);
    } else {
      const insertionVertex = this.initializeVertex(items as IRoutePointProperties);
      return this.replaceBetween(startVertex, endVertex, insertionVertex, returnListCount);
    }
  }

  replaceFromToPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties,
    items: IRoutePointProperties | IRoutePointProperties[] | VertexNode<TVertex, TSegment> | VertexNode<TVertex, TSegment>[] | PolylineRoute<TVertex, TSegment>,
    returnListCount: boolean = false
  ): {
    removed: VertexNode<TVertex, TSegment>,
    inserted: number
  } | null {

    if (startPoint === null && endPoint === null) {
      return null;
    }

    const startVertex = this.vertexNodesByPoint(startPoint)[0] as VertexNode<TVertex, TSegment> ?? null;
    const endVertex = this.vertexNodesByPoint(endPoint)[0] as VertexNode<TVertex, TSegment> ?? null;

    if (startPoint === null && endVertex.val === this.firstVertex.val) {
      return this.replaceBetweenPoints(startPoint, endVertex.next.val, items, returnListCount);
    }

    if (endPoint === null && startVertex.val === this.lastVertex.val) {
      return this.replaceBetweenPoints(startVertex.prev.val, endPoint, items, returnListCount);
    }

    if (Array.isArray(items)) {
      const replacementVertices = items.map((point) => this.initializePoint(point) as TVertex);
      return this.replaceFromTo(startVertex, endVertex, replacementVertices, returnListCount);
    } else if (items instanceof PolylineRoute || items instanceof Polyline) {
      return this.replaceFromTo(startVertex, endVertex, items, returnListCount);
    } else {
      const insertionVertex = this.initializeVertex(items as IRoutePointProperties);
      return this.replaceFromTo(startVertex, endVertex, insertionVertex, returnListCount);
    }
  }

  // === Split Methods
  splitByPoint(
    point: IPointProperties
  ): PolylineRoute<TVertex, TSegment>[] {
    const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment> ?? null;

    return this.splitBy(vertex) as PolylineRoute<TVertex, TSegment>[];
  }

  splitByPoints(
    points: IPointProperties[]
  ): PolylineRoute<TVertex, TSegment>[] {
    const vertices = [];
    points.forEach(
      (point) => {
        const vertex = this.vertexNodesByPoint(point)[0] as VertexNode<TVertex, TSegment>;
        if (vertex) {
          vertices.push(vertex);
        }
      }
    );

    return this.splitByMany(vertices) as PolylineRoute<TVertex, TSegment>[];
  }
}
