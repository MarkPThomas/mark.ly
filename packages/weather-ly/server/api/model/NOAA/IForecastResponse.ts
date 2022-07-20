import { IForecastMeta } from "./IForecastMeta";
import { IPropertiesForecast } from "./IPropertiesForecast";

export interface IForecastResponse extends IForecastMeta {
  "properties": IPropertiesForecast
}