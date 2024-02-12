import { IForecastMeta } from "./IForecastMeta";
import { IPropertiesGrid } from "./IPropertiesGrid";

export interface IForecastGridResponse extends IForecastMeta {
  "id": string,
  "properties": IPropertiesGrid
}