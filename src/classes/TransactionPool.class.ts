import Transaction from './Transaction.class';

export default class TransactionPool {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction: Transaction) {
    const transactionWithId = this.transactions.find((t) => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address: string) {
    return this.transactions.find((t) => t.input.address === address);
  }
}
