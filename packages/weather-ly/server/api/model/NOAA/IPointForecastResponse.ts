export interface IPointForecastResponse {
  "@context": [],
  "id": string,
  "type": string,
  "geometry": {
    "type": string,
    "coordinates": [number, number]
  },
  "properties": {
    "@id": string,
    "@type": string,
    "cwa": string,
    "forecastOffice": string,
    "gridId": string,
    "gridX": number,
    "gridY": number,
    "forecast": string,
    "forecastHourly": string,
    "forecastGridData": string,
    "observationStations": string,
    "relativeLocation": {},
    "forecastZone": string,
    "county": string,
    "fireWeatherZone": string,
    "timeZone": string,
    "radarStation": string
  }
}