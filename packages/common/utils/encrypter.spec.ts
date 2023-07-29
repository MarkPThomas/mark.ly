import { Encrypter } from './encrypter';

describe('#Encrypter', () => {
  let encrypter: Encrypter;

  beforeEach(() => {
    const password = 'contraseño';
    const salt = '$%&*&HH12'
    encrypter = new Encrypter(password, salt);
  });

  it('should encrypt a string', () => {
    const originalValue = 'fooBar mooNar';
    const encryptedResult = encrypter.encrypt(originalValue);

    expect(encryptedResult).not.toEqual(originalValue);

    const regex = new RegExp(/^[0-9a-fA-F]{32}|[0-9a-fA-F]{32}$/);
    // e.g. 80bf2d984ba631582d9f9b7fbf511293|f882007edccd56bfb9d10b5297a2f370
    expect(regex.test(encryptedResult)).toBeTruthy();
  });

  it('should decrypt an encrypted string', () => {
    const originalValue = 'fooBar mooNar';
    const encryptedResult = encrypter.encrypt(originalValue);
    const decryptedResult = encrypter.decrypt(encryptedResult);

    expect(decryptedResult).toEqual(originalValue);
  });

  it('should throw an error if given an invalid encryption', () => {
    const encryptedResult = '80bf2d984ba631582d9f9b7fbf511293';

    expect(() => { encrypter.decrypt(encryptedResult) }).toThrowError('IV not found');
  })
});