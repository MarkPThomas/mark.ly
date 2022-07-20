import { IForecastPeriod } from "./IForecastPeriod";
import { IPropertiesMeta } from "./IPropertiesMeta";

export interface IPropertiesForecast extends IPropertiesMeta {
  "updated": "2022-07-11T02:01:42+00:00",
  "units": "us",
  "forecastGenerator": "BaselineForecastGenerator",
  "generatedAt": "2022-07-11T08:36:30+00:00",
  "periods": [IForecastPeriod]
}