import Transaction from '../src/classes/Transaction.class';
import TransactionPool from '../src/classes/TransactionPool.class';
import Wallet from '../src/classes/Wallet.class';

describe('TransactionPool', () => {
  let tp: TransactionPool;
  let wallet: Wallet;
  let transaction: Transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'r4nd-4dr33', 30);
    tp.updateOrAddTransaction(transaction);
  });

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find((t) => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find((t) => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });
});
