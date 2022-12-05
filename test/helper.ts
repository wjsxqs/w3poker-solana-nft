import { Connection, Keypair } from '@solana/web3.js';
import * as bs58 from 'bs58';

export const connection = new Connection('https://api.devnet.solana.com');

// test account: 8RKsHicJpEyeNHCZ3jzYXym5EkKtqbhh4ybXSBVyH8dh
export const feePayer = Keypair.fromSecretKey(
  bs58.decode(
    '4E9PypogMVsdoTbgi8sTDGiLXmRoNYsLoR8DuKsE1mk2oheJYGmd3REzkifBUZ1sciCmfPBH3zYuJ6ypLjgtpcXm',
  ),
);
