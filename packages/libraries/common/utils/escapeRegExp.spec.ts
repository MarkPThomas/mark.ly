import { escapeRegExp } from './escapeRegExp';

describe('#escapeRegExp', () => {
  it('should escape all regular expression characters', () => {
    const value = `. * + ? ^ $ { } ( ) | [ ] \\`;

    const result = escapeRegExp(value);

    expect(result).toEqual('\\. \\* \\+ \\? \\^ \\$ \\{ \\} \\( \\) \\| \\[ \\] \\\\');
  })
});