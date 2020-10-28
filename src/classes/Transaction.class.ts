import config from 'config';
import ChainUtil from './ChainUtil.class';
import { Input, Output } from './interfaces';
import Wallet from './Wallet.class';

const MINING_REWARD = config.get<number>('MINING_REWARD');

export default class Transaction {
  id: string;
  input: Input;
  outputs: Output[];

  constructor() {
    this.id = ChainUtil.id();
    this.input = undefined as any;
    this.outputs = [];
  }

  update(senderWallet: Wallet, recipient: string, amount: number) {
    const senderOutput = this.outputs
      .find((output) => output.address === senderWallet.publicKey) as Output;

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet: Wallet, outputs: Output[]) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ]);
  }

  static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      { amount: MINING_REWARD, address: minerWallet.publicKey },
    ]);
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction: Transaction) {
    return ChainUtil.varifySignature(
      transaction.input.address,
      transaction.input.signature as unknown as string,
      ChainUtil.hash(transaction.outputs),
    );
  }
}
