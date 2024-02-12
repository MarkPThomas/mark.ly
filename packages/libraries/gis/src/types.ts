import { FeatureCollection } from "geojson";

import { TrackPoint } from "./Core/Track/TrackPoint";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {LatLng}
 */
export type LatLng = [number, number];
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {LatLngs}
 */
export type LatLngs = LatLng | LatLng[] | LatLng[][] | LatLng[][][];
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {LatLngBounds}
 */
export type LatLngBounds = [LatLng, LatLng];

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {FeatureCollectionSerial}
 */
export type FeatureCollectionSerial = FeatureCollection;


/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {TrackPoints}
 */
export type TrackPoints = TrackPoint | TrackPoint[] | TrackPoint[][] | TrackPoint[][][];