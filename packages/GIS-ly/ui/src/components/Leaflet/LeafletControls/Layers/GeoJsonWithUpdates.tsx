import React, { ReactElement, useEffect, useRef } from "react";
import { GeoJSON, GeoJSONProps } from "react-leaflet";
import { Layer, GeoJSON as LeafletGeoJSON } from "leaflet";

type GeoJsonWrapperProps = { layers?: Layer[] } & GeoJSONProps;

/**
 * GeoJsonWithUpdates is a wrapper around react-leaflet's GeoJSON component to support data changes
 * See https://github.com/PaulLeCam/react-leaflet/issues/332
 *
 * It accepts the same props like react-leaflet's GeoJSON component.
 * However, updates are only support
 */
export default function GeoJsonWithUpdates(props: GeoJsonWrapperProps): ReactElement {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    const geoJsonLayer = geoJsonLayerRef.current;
    if (geoJsonLayer) {
      geoJsonLayer.clearLayers().addData(props.data);
      // clearLayers() seems to remove the `pathOptions`, `style` and `interactive` prop as well
      // Resetting it here
      if (props.pathOptions) {
        geoJsonLayer.setStyle(props.pathOptions);
      } else if (props.style) {
        geoJsonLayer.setStyle(props.style);
      }

      if (props.layers) {
        props.layers.forEach((layer) => {
          geoJsonLayer.addLayer(layer);
        });
      }
    }
  }, [props.data, props.pathOptions, props.style]);

  return <GeoJSON {...props} ref={geoJsonLayerRef} />;
}