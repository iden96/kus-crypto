import Transaction from '../src/classes/Transaction.class';
import Wallet from '../src/classes/Wallet.class';

describe('Transaction', () => {
  let transaction: Transaction | undefined;
  let wallet: Wallet;
  let recipient: string;
  let amount: number;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it('outputs the `amout` substracted from the wallet balance', () => {
    expect(transaction?.outputs.find((output) => output.address === wallet.publicKey)?.amount)
      .toEqual(wallet.balance - amount);
  });

  it('outputs the `amout` added to the recipient', () => {
    expect(transaction?.outputs.find((output) => output.address === recipient)?.amount)
      .toEqual(amount);
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('doesn\'t create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });
});
