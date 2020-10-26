import config from 'config';
import { ec, curve } from 'elliptic';
import ChainUtil from './ChainUtil.class';

const INITIAL_BALANCE = config.get<number>('INITIAL_BALANCE');

export default class Wallet {
  balance: number;
  private keyPair: ec.KeyPair;
  publicKey: curve.base.BasePoint;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance: ${this.balance}
    `;
  }
}
