import { Request } from 'express';

export interface TransactRequest extends Request{
  body: {
    recipient: string,
    amount: number
  }
}
