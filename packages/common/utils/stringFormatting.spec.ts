import {
  toUpperFirstLetter,
  toUpperFirstLetterOfEach,
  toLowerFirstLetter,
  toLowerFirstLetterOfEach,
  toLowerSnakeCase,
  toUpperSnakeCase,
  toTrainCase,
  toCamelCase,
  toPascalCase
} from './stringFormatting';

describe('#toUpperFirstLetter', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toUpperFirstLetter(value)).toEqual('Ab20');
  });

  it('should capitalize only the first letter, not changing any other part of the string', () => {
    const value = 'fooBar';

    expect(toUpperFirstLetter(value)).toEqual('FooBar');
  });

  it('should capitalize only the first letter, making the remainder lowercase as specified', () => {
    const value = 'fooBar';
    const remainderIsLowerCase = true;

    expect(toUpperFirstLetter(value, remainderIsLowerCase)).toEqual('Foobar');
  });

  it('should capitalize only the first letter of the first word of a multiword string, not changing any other part of the string', () => {
    const value = 'fooBar moo Nar';

    expect(toUpperFirstLetter(value)).toEqual('FooBar moo Nar');
  });
});

describe('#toUpperFirstLetterOfEach', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toUpperFirstLetterOfEach(value)).toEqual('Ab20');
  });

  it('should capitalize only the first letter of each word of a multiword string, not changing any other part of the string', () => {
    const value = 'fooBar moo nar';

    expect(toUpperFirstLetterOfEach(value)).toEqual('FooBar Moo Nar');
  });

  it('should capitalize only the first letter of each word of a multiword string, making the remainder lowercase as specified', () => {
    const value = 'fooBar moo nar';
    const remainderIsLowerCase = true;

    expect(toUpperFirstLetterOfEach(value, remainderIsLowerCase)).toEqual('Foobar Moo Nar');
  });
});


describe('#toLowerFirstLetter', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&B^2-0';

    expect(toLowerFirstLetter(value)).toEqual('aB20');
  });

  it('should de-capitalize only the first letter, not changing any other part of the string', () => {
    const value = 'FooBar';

    expect(toLowerFirstLetter(value)).toEqual('fooBar');
  });

  it('should de-capitalize only the first letter, making the remainder lowercase as specified', () => {
    const value = 'FooBar';
    const remainderIsLowerCase = true;

    expect(toLowerFirstLetter(value, remainderIsLowerCase)).toEqual('foobar');
  });

  it('should de-capitalize only the first letter of the first word of a multiword string, not changing any other part of the string', () => {
    const value = 'FooBar moo Nar';

    expect(toLowerFirstLetter(value)).toEqual('fooBar moo Nar');
  });
});

describe('#toLowerFirstLetterOfEach', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&B^2-0';

    expect(toLowerFirstLetterOfEach(value)).toEqual('aB20');
  });

  it('should de-capitalize only the first letter of each word of a multiword string, not changing any other part of the string', () => {
    const value = 'FooBar Moo Nar';

    expect(toLowerFirstLetterOfEach(value)).toEqual('fooBar moo nar');
  });
});


describe('#toLowerSnakeCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toLowerSnakeCase(value)).toEqual('ab20');
  });

  it('should replace spaces with underscores', () => {
    const value = 'foo bar';

    expect(toLowerSnakeCase(value)).toEqual('foo_bar');
  });

  it('should make all characters lower case', () => {
    const value = 'FooBAR';

    expect(toLowerSnakeCase(value)).toEqual('foobar');
  });

  it('should convert a string to a snake case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toLowerSnakeCase(value)).toEqual('foo_bar20_moo_nar');
  });
});

describe('#toUpperSnakeCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toUpperSnakeCase(value)).toEqual('AB20');
  });

  it('should replace spaces with underscores', () => {
    const value = 'foo bar';

    expect(toUpperSnakeCase(value)).toEqual('FOO_BAR');
  });

  it('should make all characters lower case', () => {
    const value = 'FooBAR';

    expect(toUpperSnakeCase(value)).toEqual('FOOBAR');
  });

  it('should convert a string to a snake case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toUpperSnakeCase(value)).toEqual('FOO_BAR20_MOO_NAR');
  });
});

describe('#toPascalCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toPascalCase(value)).toEqual('Ab20');
  });

  it('should capitalize only the first letter of each word of a multiword string, making the remainder lowercase as specified', () => {
    const value = 'fooBar moo nar';

    expect(toPascalCase(value)).toEqual('FoobarMooNar');
  });

  it('should convert a string to a Pascal case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toPascalCase(value)).toEqual('FooBar20MooNar');
  });
});

describe('#toCamelCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toCamelCase(value)).toEqual('ab20');
  });

  it(`should capitalize only the first letter of each word of a multiword string, making the remainder lowercase as specified,
    but with the first word all lower case`, () => {
    const value = 'fooBar moo nar';

    expect(toCamelCase(value)).toEqual('foobarMooNar');
  });

  it('should convert a string to a camel case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toCamelCase(value)).toEqual('fooBar20MooNar');
  });
});


describe('#toTrainCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toTrainCase(value)).toEqual('ab20');
  });

  it('should make all characters lower case', () => {
    const value = 'FooBAR moo nAr';

    expect(toTrainCase(value)).toEqual('foobar-moo-nar');
  });

  it('should convert a string to a train case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toTrainCase(value)).toEqual('foo-bar20-moo-nar');
  });
});