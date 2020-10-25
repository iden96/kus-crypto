import { SHA256 } from 'crypto-js';

const DIFFICULTY = 4;

export default class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: object;
  nonce: number;

  static genesis() {
    return new this(23433432, '-----', 'f1r57-h45h', [], 0);
  }

  static mineBlock(lastBlock: Block, data: object) {
    const lastHash = lastBlock.hash;

    let hash: string;
    let timestamp: string;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = Block.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new this(timestamp, lastHash, hash, data, nonce);
  }

  static hash(timestamp: number, lastHash: string, data: object, nonce: number) {
    return SHA256(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}`).toString();
  }

  static blockHash(block: Block) {
    const {
      timestamp, lastHash, data, nonce,
    } = block;
    return Block.hash(timestamp, lastHash, data, nonce);
  }

  constructor(timestamp: number, lastHash: string, hash: string, data: object, nonce: number) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Nonce    : ${this.nonce}
      Data     : ${this.data}
    `;
  }
}
