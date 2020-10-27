import Transaction from '../src/classes/Transaction.class';
import TransactionPool from '../src/classes/TransactionPool.class';
import Wallet from '../src/classes/Wallet.class';

describe('Wallet', () => {
  let wallet: Wallet;
  let tp: TransactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction: Transaction;
    let sendAmount: number;
    let recipient: string;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(recipient, sendAmount, tp) as Transaction;
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it('doubles the `sendAmount` substracted from the wallet balance', () => {
        expect(transaction.outputs.find((output) => output.address === wallet.publicKey)!.amount)
          .toEqual(wallet.balance - sendAmount*2);
      });

      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter((output) => output.address === recipient)
          .map((output) => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
