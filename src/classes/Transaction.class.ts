import ChainUtil from './ChainUtil.class';
import { Input, Output } from './interfaces';
import Wallet from './Wallet.class';

export default class Transaction {
  id: string;
  input: Input;
  outputs: Output[];

  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet: Wallet, recipient: string, amount: number) {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

    if (amount > senderOutput?.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ]);

    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
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
      transaction.input.signature as string,
      ChainUtil.hash(transaction.outputs),
    );
  }
}
