import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useMap, useMapEvent, Rectangle } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core'

// Note: from https://react-leaflet.js.org/docs/example-react-control/

const BOUNDS_STYLE = { weight: 1 }

type Props = {
  parentMap: any,
  zoom: number
}

export function MiniMapBounds({ parentMap, zoom }: Props) {
  const minimap = useMap()

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e: { latlng: any; }) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  // Listen to events on the parent map
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
  useEventHandlers({ instance: parentMap, context: this }, handlers)

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}