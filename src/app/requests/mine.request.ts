import { Request } from 'express';

export interface MineRequest extends Request{
  body: {
    data: object
  }
}
