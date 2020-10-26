import { ec } from 'elliptic';

export interface Output {
  amount: number,
  address?: string,
  recipient?: string
}

export interface Input {
  timestamp: number;
  amount: number;
  address: string;
  signature: ec.Signature;
}
