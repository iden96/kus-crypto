import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export default class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }
}
