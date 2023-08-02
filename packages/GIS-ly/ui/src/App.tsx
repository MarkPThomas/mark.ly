import React, { useState } from 'react';
import axios from 'axios';
import { LatLngTuple } from 'leaflet';

import { Map } from './components/Leaflet/Map';
import { BaseLayers } from './components/Leaflet/Layers/BaseLayers';

export const App = (props) => {
  const initialLayers = BaseLayers();
  const initialPosition = {
    point: [37.7749, -122.4194] as LatLngTuple,
    zoom: 13
  }

  return (
    <>
      <Map initialPosition={initialPosition} initialLayers={initialLayers} />
    </>
  );
}