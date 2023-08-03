export const metersToFeet = (meters: number) => {
  return meters * 3.28084;
}

export const metersToFeetRound = (meters: number, decimalRound: number = 0) => {
  return metersToFeet(meters).toFixed(decimalRound);
}

export const feetToMeters = (feet: number) => {
  return feet / 3.28084;
}

export const feetToMetersRound = (feet: number, decimalRound: number = 0) => {
  return feetToMeters(feet).toFixed(decimalRound);
}