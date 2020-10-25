import { SHA256 } from 'crypto-js';

export default class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: object;

  static genesis() {
    return new this(23433432, '-----', 'f1r57-h45h', []);
  }

  static mineBlock(lastBlock: Block, data: object) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);
    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp: number, lastHash: string, data: object) {
    return SHA256(`${timestamp}${lastHash}${JSON.stringify(data)}`).toString();
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }

  constructor(timestamp: number, lastHash: string, hash: string, data: object) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Data     : ${this.data}
    `;
  }
}
