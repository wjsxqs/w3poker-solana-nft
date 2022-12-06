import { Keypair } from '@solana/web3.js';
import { expect } from 'chai';
import { buy } from '../src';
import { connection, feePayer } from './helper';

describe('buy', () => {
  beforeEach(async () => {
    const balance = await connection.getBalance(feePayer.publicKey);
    expect(balance).to.be.gt(0);
  });

  it('buy success', async () => {
    const toAccount = Keypair.generate();

    const signature = await buy(connection, toAccount.publicKey, feePayer);
    console.log('signature', signature);
  });
});
