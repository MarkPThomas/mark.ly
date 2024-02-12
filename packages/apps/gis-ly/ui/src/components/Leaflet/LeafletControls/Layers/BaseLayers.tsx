import { ReactNode } from 'react';
import { LayersControl } from 'react-leaflet';

export interface IBaseLayer {
  name: string;
  item: ReactNode;
}

export type BaseLayersProps = {
  baseLayers: IBaseLayer[];
}

export function BaseLayers({ baseLayers = [] }: BaseLayersProps) {
  return (
    baseLayers ?
      <>
        {baseLayers.map((baseLayer, index) => (
          <LayersControl.BaseLayer checked={index === 0 ? true : false} name={baseLayer.name} key={baseLayer.name}>
            {baseLayer.item}
          </LayersControl.BaseLayer>
        ))}
      </>
      : null
  );
}