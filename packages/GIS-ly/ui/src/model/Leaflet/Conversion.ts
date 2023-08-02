export const metersToFeet = (meters: number) => {
  return Math.round(meters * 3.28084);
}

export const feetToMeters = (feet: number) => {
  return Math.round(feet / 3.28084);
}