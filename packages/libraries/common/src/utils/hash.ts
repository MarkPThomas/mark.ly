export const hashString = (str: string) => {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < Math.min(str.length, 255); i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};