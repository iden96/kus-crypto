import config from 'config';
import { BNInput, ec } from 'elliptic';
import ChainUtil from './ChainUtil.class';

const INITIAL_BALANCE = config.get<number>('INITIAL_BALANCE');

export default class Wallet {
  balance: number;
  private keyPair: ec.KeyPair;
  publicKey: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false);
  }

  sign(dataHash: string) {
    return this.keyPair.sign(dataHash as BNInput);
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance: ${this.balance}
    `;
  }
}
