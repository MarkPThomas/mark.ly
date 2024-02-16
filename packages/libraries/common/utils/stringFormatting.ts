export function toUpperFirstLetter(str: string, remainderIsLowerCase: boolean = false): string {
  str = cleanString(str);

  return remainderIsLowerCase
    ? str[0].toUpperCase() + str.substring(1).toLowerCase()
    : str[0].toUpperCase() + str.substring(1);
}

export function toUpperFirstLetterOfEach(str: string, remainderIsLowerCase: boolean = false): string {
  str = cleanString(str);

  const strings = str.split(' ');
  strings.forEach((str, index) => {
    strings[index] = toUpperFirstLetter(str, remainderIsLowerCase);
  });

  return strings.join(' ');
}

export function toLowerFirstLetter(str: string, remainderIsLowerCase: boolean = false): string {
  str = cleanString(str);

  return remainderIsLowerCase
    ? str[0].toLowerCase() + str.substring(1).toLowerCase()
    : str[0].toLowerCase() + str.substring(1);
}

export function toLowerFirstLetterOfEach(str: string): string {
  str = cleanString(str);

  // Not making remainder lowercase is intentional, as this is the same as .toLowerCase on the entire string
  const strings = str.split(' ');
  strings.forEach((str, index) => {
    strings[index] = toLowerFirstLetter(str);
  });

  return strings.join(' ');
}

export function toLowerSnakeCase(str: string): string {
  str = cleanString(str);
  return str
    .split(' ')
    .join('_')
    .toLowerCase();
}

export function toUpperSnakeCase(str: string): string {
  str = cleanString(str);
  return str
    .split(' ')
    .join('_')
    .toUpperCase();
}


export function toCamelCase(str: string): string {
  const strPascal = toPascalCase(str);
  return toLowerFirstLetter(strPascal);
}

export function toPascalCase(str: string): string {
  str = cleanString(str);

  const strings = str.split(' ');
  strings.forEach((str, index) => {
    strings[index] = toUpperFirstLetter(str, true);
  });

  return strings.join('');
}

export function toTrainCase(str: string): string {
  str = cleanString(str);
  return str
    .split(' ')
    .join('-')
    .toLowerCase();
}

function cleanString(str: string): string {
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
}