import config from 'config';
import ChainUtil from './ChainUtil.class';

const DIFFICULTY = config.get<number>('DIFFICULTY');
const MINE_RATE = config.get<number>('MINE_RATE');

export default class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: object;
  nonce: number;
  difficulty: number;

  static genesis() {
    return new this(23433432, '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock: Block, data: object) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let hash: string;
    let timestamp: number;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp: number, lastHash: string, data: object, nonce: number,
    difficulty: number) {
    return ChainUtil.hash(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`).toString();
  }

  static blockHash(block: Block) {
    const {
      timestamp, lastHash, data, nonce, difficulty,
    } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock: Block, currentTime: number) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  constructor(timestamp: number, lastHash: string, hash: string, data: object, nonce: number,
    difficulty: number) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}
    `;
  }
}
