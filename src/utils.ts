import { PublicKey, Keypair, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { TOKEN_METADATA_PROGRAM_ID, AUTHORITY_KEY } from './constants';
import { accountProviders, PROGRAM_ID } from './program/generated';
import fs from 'fs';
import BN from 'bn.js';

export const createKeypairFromFile = async (filePath: string): Promise<Keypair> => {
  const secretKeyString = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
};

export const getMetadata = (mint: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID,
  )[0];
};

export const getMasterEdition = (mint: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  )[0];
};

export const getCollectionAuthorityRecord = (
  mint: PublicKey,
  collectionAuthority: PublicKey,
): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('collection_authority'),
      collectionAuthority.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  )[0];
};

export const getSettingsPda = (): PublicKey => {
  const [settingsPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('settings', 'utf8'), AUTHORITY_KEY.toBuffer()],
    PROGRAM_ID,
  );
  return settingsPda;
};

export const getAuthorityPda = (settingsPda: PublicKey): PublicKey => {
  const [authorityPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('authority', 'utf8'), settingsPda.toBuffer()],
    PROGRAM_ID,
  );
  return authorityPda;
};

export const getPaymentVaultPda = (settingsPda: PublicKey): PublicKey => {
  const [paymentVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('payment_vault', 'utf8'), settingsPda.toBuffer()],
    PROGRAM_ID,
  );
  return paymentVaultPda;
};

export const getGameVaultPda = (settingsPda: PublicKey): PublicKey => {
  const [gameVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('game_vault', 'utf8'), settingsPda.toBuffer()],
    PROGRAM_ID,
  );
  return gameVaultPda;
};

export const getCollectionMint = async (
  connection: Connection,
  settingsPda: PublicKey,
): Promise<PublicKey> => {
  const settingsPdaData = await accountProviders.Settings.fromAccountAddress(
    connection,
    settingsPda,
  );
  const collectionMint = settingsPdaData.collectionMint;
  return collectionMint;
};

export const parseSol = (sol: string): BN => {
  return new BN(sol).mul(new BN(LAMPORTS_PER_SOL));
};

export const formatSol = (sol: string): BN => {
  return new BN(sol).div(new BN(LAMPORTS_PER_SOL));
};
