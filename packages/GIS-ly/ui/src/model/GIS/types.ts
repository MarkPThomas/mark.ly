import { FeatureCollection } from "geojson";

import { TrackPoint } from "./Track/TrackPoint";

export type LatLng = [number, number] | [number, number, number];
export type LatLngs = LatLng | LatLng[][] | LatLng[][][];
export type LatLngBounds = [LatLng, LatLng];

export type FeatureCollectionSerial = FeatureCollection;

export type TrackPoints = TrackPoint | TrackPoint[] | TrackPoint[][] | TrackPoint[][][];