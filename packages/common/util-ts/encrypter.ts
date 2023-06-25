/* eslint-disable no-magic-numbers */
import { scryptSync, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export class Encrypter {
  private key: Buffer;
  private algorithm = 'aes-192-cbc';

  constructor(secret: string, salt: string) {
    this.key = scryptSync(secret, salt, 24);
  }

  encrypt(textToEncrypt: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');

    return [encrypted + cipher.final('hex'), Buffer.from(iv).toString('hex')].join('|');
  }

  decrypt(textToDecrypt: string): string {
    const [encrypted, iv] = textToDecrypt.split('|');
    if (!iv) {
      throw new Error('IV not found');
    }
    const decipher = createDecipheriv(this.algorithm, this.key, Buffer.from(iv, 'hex'));

    let decryptedData = decipher.update(encrypted, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }
}