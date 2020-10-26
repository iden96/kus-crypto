import { ec as EC } from 'elliptic';
import { v1 as uuidV1 } from 'uuid';
import { SHA256 } from 'crypto-js';

const ec = new EC('secp256k1');

export default class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data: any) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static varifySignature(publicKey: string, signature: string, dataHash: string) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}
