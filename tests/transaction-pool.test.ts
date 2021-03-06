import BlockChain from '../src/classes/Blockchain.class';
import Transaction from '../src/classes/Transaction.class';
import TransactionPool from '../src/classes/TransactionPool.class';
import Wallet from '../src/classes/Wallet.class';

describe('TransactionPool', () => {
  let tp: TransactionPool;
  let wallet: Wallet;
  let transaction: Transaction;
  let bc: BlockChain;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new BlockChain();
    transaction = wallet.createTransaction('r4nd-4dr33', 30, bc, tp)!;
  });

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find((t) => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40) as Transaction;
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find((t) => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  it('clears transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions: Transaction[];

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp)!;
        if (i%2 === 0) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
