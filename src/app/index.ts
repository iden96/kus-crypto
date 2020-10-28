import express, { Application, Request, Response } from 'express';
import Blockchain from '../classes/Blockchain.class';
import P2pServer from './p2p-server';
import Wallet from '../classes/Wallet.class';
import TransactionPool from '../classes/TransactionPool.class';
import { MineRequest, TransactRequest } from './requests';

const app: Application = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

app.use(express.json());

app.get('/blocks', (req: Request, res: Response) => {
  res.json(bc.chain);
});

app.get('/transactions', (req: Request, res: Response) => {
  res.json(tp.transactions);
});

app.get('/public-key', (req: Request, res: Response) => {
  res.json({ publicKey: wallet.publicKey });
});

app.post('/mine', (req: MineRequest, res: Response) => {
  bc.addBlock(req.body.data);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

app.post('/transact', (req: TransactRequest, res: Response) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

p2pServer.listen();

export default app;
