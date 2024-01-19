export function toUpperFirstLetter(str: string, remainderIsLowerCase: boolean = false): string {
  return remainderIsLowerCase
    ? str[0].toUpperCase() + str.substring(1).toLowerCase()
    : str[0].toUpperCase() + str.substring(1);
}

export function toUpperFirstLetterOfEach(str: string, remainderIsLowerCase: boolean = false): string {
  const strings = str.split(' ');

  strings.forEach((str, index) => {
    strings[index] = toUpperFirstLetter(str, remainderIsLowerCase);
  });

  return strings.join(' ');
}

export function toLowerFirstLetter(str: string, remainderIsLowerCase: boolean = false): string {
  return remainderIsLowerCase
    ? str[0].toLowerCase() + str.substring(1).toLowerCase()
    : str[0].toLowerCase() + str.substring(1);
}

export function toLowerFirstLetterOfEach(str: string): string {
  // Not making remainder lowercase is intentional, as this is the same as .toLowerCase on the entire string
  const strings = str.split(' ');

  strings.forEach((str, index) => {
    strings[index] = toLowerFirstLetter(str);
  });

  return strings.join(' ');
}

export function toLowerSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .join('_')
    .toLowerCase();
}

export function toUpperSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .join('_')
    .toUpperCase();
}

// TODO: Future methods:
// toTrainCase
// toCamelCase
// toPascalCase