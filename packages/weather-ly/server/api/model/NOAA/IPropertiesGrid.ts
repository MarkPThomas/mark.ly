import { Intensity } from "./enums";
import { IPropertiesMeta } from "./IPropertiesMeta";
import { IValueSimple } from "./IValueSimple";

export interface IPropertiesGrid extends IPropertiesMeta {
  "@id": string,
  "@type": string,
  "forecastOffice": string,
  "gridId": string,
  "gridX": string,
  "gridY": string,
  "temperature": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "dewpoint": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "maxTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "minTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "relativeHumidity": {
    "uom": string, // "wmoUnit:percent",
    "values": [IValueSimple]
  },
  "apparentTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "heatIndex": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "windChill": {
    "uom": string, // "wmoUnit:degC",
    "values": [IValueSimple]
  },
  "skyCover": {
    "uom": string, // "wmoUnit:percent",
    "values": [IValueSimple]
  },
  "windDirection": {
    "uom": string, // "wmoUnit:degree_(angle)",
    "values": [IValueSimple]
  },
  "windSpeed": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": [IValueSimple]
  },
  "windGust": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": [IValueSimple]
  },
  "weather": {
    "values": [{
      "coverage": string,
      "weather": string,
      "intensity": Intensity | null,
      "visibility": {
        "unitCode": string, // "wmoUnit:km",
        "value": null
      },
      "attributes": []
    }]
  },
  "hazards": {
    "values": []
  },
  "probabilityOfPrecipitation": {
    "uom": string, // "wmoUnit:percent",
    "values": [IValueSimple]
  },
  "quantitativePrecipitation": {},
  "iceAccumulation": {
    "uom": string, // "wmoUnit:mm",
    "values": [IValueSimple]
  },
  "snowfallAmount": {
    "uom": string, // "wmoUnit:mm",
    "values": [IValueSimple]
  },
  "snowLevel": {
    "uom": string, // "wmoUnit:m",
    "values": [IValueSimple]
  },
  "ceilingHeight": {
    "uom": string, // "wmoUnit:m",
    "values": [IValueSimple]
  },
  "visibility": {
    "uom": string, // "wmoUnit:m",
    "values": [IValueSimple]
  },
  "transportWindSpeed": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": [IValueSimple]
  },
  "transportWindDirection": {
    "uom": string, // "wmoUnit:degree_(angle)",
    "values": [IValueSimple]
  },
  "mixingHeight": {
    "uom": string, // "wmoUnit:m",
    "values": [IValueSimple]
  },
  "hainesIndex": {
    "values": [IValueSimple]
  },
  "lightningActivityLevel": {
    "values": [IValueSimple]
  },
  "twentyFootWindSpeed": {
    "values": []
  },
  "twentyFootWindDirection": {
    "values": []
  },
  "waveHeight": {
    "values": []
  },
  "wavePeriod": {
    "values": []
  },
  "waveDirection": {
    "values": []
  },
  "primarySwellHeight": {
    "values": []
  },
  "primarySwellDirection": {
    "values": []
  },
  "secondarySwellHeight": {
    "values": []
  },
  "secondarySwellDirection": {
    "values": []
  },
  "wavePeriod2": {
    "values": []
  },
  "windWaveHeight": {
    "values": []
  },
  "dispersionIndex": {
    "values": []
  },
  "pressure": {
    "values": []
  },
  "probabilityOfTropicalStormWinds": {
    "values": []
  },
  "probabilityOfHurricaneWinds": {
    "values": []
  },
  "potentialOf15mphWinds": {
    "values": []
  },
  "potentialOf25mphWinds": {
    "values": []
  },
  "potentialOf35mphWinds": {
    "values": []
  },
  "potentialOf45mphWinds": {
    "values": []
  },
  "potentialOf20mphWindGusts": {
    "values": []
  },
  "potentialOf30mphWindGusts": {
    "values": []
  },
  "potentialOf40mphWindGusts": {
    "values": []
  },
  "potentialOf50mphWindGusts": {
    "values": []
  },
  "potentialOf60mphWindGusts": {
    "values": []
  },
  "grasslandFireDangerIndex": {
    "values": []
  },
  "probabilityOfThunder": {
    "values": []
  },
  "davisStabilityIndex": {
    "values": []
  },
  "atmosphericDispersionIndex": {
    "values": []
  },
  "lowVisibilityOccurrenceRiskIndex": {
    "values": []
  },
  "stability": {
    "values": []
  },
  "redFlagThreatIndex": {
    "values": []
  }
}