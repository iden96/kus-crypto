import express, { Application, Request, Response } from 'express';
import Blockchain from '../classes/Blockchain.class';
import P2pServer from './p2p-server';
import { MineRequest } from './requests/mine.request';

const app: Application = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(express.json());

app.get('/blocks', (req: Request, res: Response) => {
  res.json(bc.chain);
});

app.post('/mine', (req: MineRequest, res: Response) => {
  bc.addBlock(req.body.data);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

p2pServer.listen();

export default app;
