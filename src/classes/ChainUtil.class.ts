import { ec as EC } from 'elliptic';
import { v1 as uuidV1 } from 'uuid';

const ec = new EC('secp256k1');

export default class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }
}
