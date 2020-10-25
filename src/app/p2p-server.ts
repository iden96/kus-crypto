import WebSocket, * as WS from 'ws';
import BlockChain from 'classes/Blockchain.class';

const P2P_PORT = +process.env.P2P_PORT! || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

export default class P2pServer {
  blockchain: BlockChain;
  sockets: WebSocket[];

  constructor(blockchain: BlockChain) {
    this.blockchain = blockchain;
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
    socket.on('message', (message) => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket: WebSocket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }
}
