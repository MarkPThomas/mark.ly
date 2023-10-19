import { Config } from './Config';
import { Tiles } from './api';
import { Map } from './components/Leaflet/Map';

const restHandlers = {
  handleLayerApiKeys: async (apiKeyName: string) => {
    return await Tiles.getApiKey(apiKeyName);
  }
}

type Props = {
  config: Config
}

export const App = ({ config }: Props) => {
  return (
    <>
      <Map
        config={config}
        restHandlers={restHandlers}
      />
    </>
  );
}