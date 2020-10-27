import config from 'config';
import { BNInput, ec } from 'elliptic';
import ChainUtil from './ChainUtil.class';
import Transaction from './Transaction.class';
import TransactionPool from './TransactionPool.class';

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

  createTransaction(recipient: string, amount: number, transactionPool: TransactionPool) {
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance: ${this.balance}
    `;
  }
}
