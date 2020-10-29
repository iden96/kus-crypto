import config from 'config';
import { BNInput, ec } from 'elliptic';
import BlockChain from './Blockchain.class';
import ChainUtil from './ChainUtil.class';
import Transaction from './Transaction.class';
import TransactionPool from './TransactionPool.class';

const INITIAL_BALANCE = config.get<number>('INITIAL_BALANCE');

export default class Wallet {
  balance: number;
  private keyPair: ec.KeyPair;
  publicKey: string;

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false);
  }

  sign(dataHash: string) {
    return this.keyPair.sign(dataHash as BNInput);
  }

  createTransaction(
    recipient: string, amount: number,
    blockchain: BlockChain, transactionPool: TransactionPool,
  ) {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction as Transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain: BlockChain) {
    let { balance } = this;
    const transactions: Transaction[] = [];
    blockchain.chain.forEach((block) => block
      .data.forEach((transaction) => { transactions.push(transaction); }));

    const walletInputTs = transactions
      .filter((transaction) => transaction.input.address === this.publicKey);

    let startTime = 0;

    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => (prev.input.timestamp > current.input.timestamp ? prev : current),
      );

      balance = recentInputT.outputs.find((output) => output.address === this.publicKey).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach((transaction) => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find((output) => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance: ${this.balance}
    `;
  }
}
