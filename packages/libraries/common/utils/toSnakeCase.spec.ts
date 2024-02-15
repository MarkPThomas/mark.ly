import toSnakeCase from './toSnakeCase';

describe('#toSnakeCase', () => {
  it('should remove non-alphanumeric characters', () => {
    const value = 'a&b^2-0';

    expect(toSnakeCase(value)).toEqual('ab20');
  });

  it('should replace spaces with underscores', () => {
    const value = 'foo bar';

    expect(toSnakeCase(value)).toEqual('foo_bar');
  });

  it('should make all characters lower case', () => {
    const value = 'FooBAR';

    expect(toSnakeCase(value)).toEqual('foobar');
  });

  it('should convert a string to a snake case representation', () => {
    const value = 'foo Bar-2^0%^& moO nar';

    expect(toSnakeCase(value)).toEqual('foo_bar20_moo_nar');
  });
})