import { FeatureCollection, Geometry } from "geojson";

import { TrackPoint } from "./Core/Track/TrackPoint";

export type LatLng = [number, number];
export type LatLngs = LatLng | LatLng[] | LatLng[][] | LatLng[][][];
export type LatLngBounds = [LatLng, LatLng];

export type FeatureCollectionSerial = FeatureCollection;
// export type GeoJSONFeatureCollection = FeatureCollection<Geometry, { [name: string]: any; }>;


export type TrackPoints = TrackPoint | TrackPoint[] | TrackPoint[][] | TrackPoint[][][];