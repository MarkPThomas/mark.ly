export default (str: string): string =>
  str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .join('_')
    .toLowerCase();