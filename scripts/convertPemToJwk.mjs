import { readFileSync } from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';
const privateKey = readFileSync('./cert/privatekey.pem');
const jwk = rsaPemToJwk(privateKey, { use: 'sig' }, 'public');
console.log(JSON.stringify(jwk));
