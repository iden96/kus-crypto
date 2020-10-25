import Block from './Block.class';

export default class BlockChain {
  chain: Block[];

  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data: object) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  static isValidChain(chain: Block[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];

      if (block.lastHash !== lastBlock.hash
          || block.hash !== Block.blockHash(block)) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain: Block[]) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer that the current chain');
      return;
    } if (!BlockChain.isValidChain(newChain)) {
      console.log('The received chain is not valid');
      return;
    }

    console.log('Replacing blockchain with the new chain');
    this.chain = newChain;
  }
}
