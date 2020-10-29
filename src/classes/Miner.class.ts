import P2pServer from 'app/p2p-server';
import BlockChain from './Blockchain.class';
import Transaction from './Transaction.class';
import TransactionPool from './TransactionPool.class';
import Wallet from './Wallet.class';

export default class Miner {
  blockchain: BlockChain;
  transactionPool: TransactionPool;
  wallet: Wallet;
  p2pServer: P2pServer;

  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  // include a reward for the miner
  // create a block consisting of the valid transaction
  // synchronize the chains in the peer-to-peer server
  // clear the transaction pool
  // broadcast to every miner to clear their transaction pool
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}
