import crypto from 'crypto';
import { writeFileSync } from 'fs';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});
console.log('public key', publicKey);
console.log('private key', privateKey);

writeFileSync('cert/privatekey.pem', privateKey);
writeFileSync('cert/publickey.pem', publicKey);
