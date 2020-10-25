import BlockChain from '../src/classes/Blockchain.class';
import Block from '../src/classes/Block.class';

describe('Blockchain', () => {
  let bc: BlockChain;
  let bc2: BlockChain;

  beforeEach(() => {
    bc = new BlockChain();
    bc2 = new BlockChain();
  });

  it('starts with genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block', () => {
    const data = {};
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it('validates a valid chain', () => {
    bc.addBlock({});
    expect(BlockChain.isValidChain(bc.chain)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    bc.chain[0].data = { dddddddd: 'dsdsd' };
    expect(BlockChain.isValidChain(bc.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    bc.addBlock({ a: 'a' });
    bc.chain[1].data = { b: 'b' };
    expect(BlockChain.isValidChain(bc.chain)).toBe(false);
  });

  it('replaces the chain with a valid chain', () => {
    bc2.addBlock({ a: 'a' });
    bc.replaceChain(bc2.chain);
    expect(bc.chain).toEqual(bc2.chain);
  });

  it('doen\'t replace the chain with one of less than or equal to length', () => {
    bc.addBlock({});
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toEqual(bc2.chain);
  });
});
