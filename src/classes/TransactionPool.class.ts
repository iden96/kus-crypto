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

  validTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => total + output.amount, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
}
