import ChainUtil from './ChainUtil.class';
import Wallet from './Wallet.class';

export default class Transaction {
  id: string;
  input: null;
  outputs: [];

  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWaller: Wallet, recipient: Wallet, amount: number) {
    const transaction = new this();

    if (amount > senderWaller.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(...[
      { amount: senderWaller.balance - amount, address: senderWaller.publicKey },
      { amount, recipient },
    ]);

    return transaction;
  }
}
