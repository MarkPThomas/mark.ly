import { Intensity } from "./enums";
import { IPropertiesMeta } from "./IPropertiesMeta";
import { IValue } from "./IValue";

export interface IPropertiesGrid extends IPropertiesMeta {
  "@id": string,
  "@type": string,
  "forecastOffice": string,
  "gridId": string,
  "gridX": string,
  "gridY": string,
  "temperature": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "dewpoint": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "maxTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "minTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "relativeHumidity": {
    "uom": string, // "wmoUnit:percent",
    "values": IValue[]
  },
  "apparentTemperature": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "heatIndex": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "windChill": {
    "uom": string, // "wmoUnit:degC",
    "values": IValue[]
  },
  "skyCover": {
    "uom": string, // "wmoUnit:percent",
    "values": IValue[]
  },
  "windDirection": {
    "uom": string, // "wmoUnit:degree_(angle)",
    "values": IValue[]
  },
  "windSpeed": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": IValue[]
  },
  "windGust": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": IValue[]
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
    "values": IValue[]
  },
  "quantitativePrecipitation": {},
  "iceAccumulation": {
    "uom": string, // "wmoUnit:mm",
    "values": IValue[]
  },
  "snowfallAmount": {
    "uom": string, // "wmoUnit:mm",
    "values": IValue[]
  },
  "snowLevel": {
    "uom": string, // "wmoUnit:m",
    "values": IValue[]
  },
  "ceilingHeight": {
    "uom": string, // "wmoUnit:m",
    "values": IValue[]
  },
  "visibility": {
    "uom": string, // "wmoUnit:m",
    "values": IValue[]
  },
  "transportWindSpeed": {
    "uom": string, // "wmoUnit:km_h-1",
    "values": IValue[]
  },
  "transportWindDirection": {
    "uom": string, // "wmoUnit:degree_(angle)",
    "values": IValue[]
  },
  "mixingHeight": {
    "uom": string, // "wmoUnit:m",
    "values": [IValue]
  },
  "hainesIndex": {
    "values": IValue[]
  },
  "lightningActivityLevel": {
    "values": IValue[]
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