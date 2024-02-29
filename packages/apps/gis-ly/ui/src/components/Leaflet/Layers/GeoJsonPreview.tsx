import { PathOptions } from "leaflet";
import { GeoJSON } from "react-leaflet";
import { Track } from "@markpthomas/gis"

import { hashString } from '@markpthomas/common-libraries/utils';

export type GeoJsonPreviewProps = {
  tracks: Track[]
}

export function GeoJsonPreview({ tracks }: GeoJsonPreviewProps) {
  const pathOptions: PathOptions[] = [];

  const defaultColors: string[] = [
    '#ff0000',
    '#ff00cc'
  ];
  const defaultWeights: number[] = [
    6,
    6
  ];

  const data = [];

  if (tracks) {
    tracks.forEach((track, index) => {
      pathOptions.push({
        color: defaultColors[index % 2],
        weight: defaultWeights[index % 2],
        opacity: 0.5
      });

      data.push(track.toJson());
    });
  }

  return tracks ?
    <>
      {tracks.map((track, index) =>
        <GeoJSON
          key={hashString(JSON.stringify(track.firstPoint.val))}
          data={data[index]}
          pathOptions={pathOptions[index]}
        />
      )}
    </>
    : null
}