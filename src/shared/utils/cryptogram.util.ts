import * as crypto from 'crypto';

export function makeSalt(len = 3): string {
  return crypto.randomBytes(len).toString('base64');
}

export function encryptoPassword(passWord: string, salt: string): string {
  if (!passWord || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return crypto
    .pbkdf2Sync(passWord, tempSalt, 10000, 64, 'sha1')
    .toString('base64');
}

export function enCryptoFileMD5(buffer: Buffer) {
  const md5 = crypto.createHash('md5');
  return md5.update(buffer).digest('hex');
}
