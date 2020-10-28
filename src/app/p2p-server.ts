import WebSocket, * as WS from 'ws';
import BlockChain from 'classes/Blockchain.class';
import TransactionPool from 'classes/TransactionPool.class';
import Transaction from 'classes/Transaction.class';

const P2P_PORT = +process.env.P2P_PORT! || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
};

export default class P2pServer {
  blockchain: BlockChain;
  sockets: WebSocket[];
  transactionPool: TransactionPool;

  constructor(blockchain: BlockChain, transactionPool: TransactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new WS.Server({
      port: P2P_PORT,
    });
    server.on('connection', (socket) => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer-to-peer connections on ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket: WebSocket = new WebSocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket: WebSocket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket: WebSocket) {
    socket.on('message', (message: string) => {
      const data: {type: string, chain?: any[], transaction?: any} = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain!);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction!);
          break;
        default: console.log('This type of message is not supported now');
      }
    });
  }

  sendChain(socket: WebSocket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain,
    }));
  }

  sendTransaction(socket: WebSocket, transaction: Transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction,
    }));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => this.sendTransaction(socket, transaction));
  }
}
