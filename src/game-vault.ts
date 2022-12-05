import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import {
  createDepositNftInstruction,
  createWithdrawNftInstruction,
  DepositNftInstructionAccounts,
  WithdrawNftInstructionAccounts,
} from './program';
import { AUTHORITY_KEY } from './constants';
import { getMetadata, getSettingsPda, getGameVaultPda } from './utils';

export async function depositNft(
  connection: Connection,
  mint: PublicKey,
  payer: Keypair,
): Promise<string> {
  try {
    // Derive the pda address

    const settingsPda = getSettingsPda();
    const gameVaultPda = getGameVaultPda(settingsPda);

    // Derive the mint address and the associated token account address

    const fromTokenAddress = await getAssociatedTokenAddress(mint, payer.publicKey);

    const gameVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      gameVaultPda,
      true,
    );
    const gameVaultTokenAddress = gameVaultAssociatedTokenAccount.address;

    // Derive the metadata and master edition addresses

    const metadataAddress = getMetadata(mint);

    const accounts: DepositNftInstructionAccounts = {
      settings: settingsPda,
      gameVaultPda: gameVaultPda,
      gameVaultTokenAccount: gameVaultTokenAddress,
      operatorAuthority: AUTHORITY_KEY,
      fromTokenAccount: fromTokenAddress,
      fromAuthority: payer.publicKey,
      mint: mint,
      metadata: metadataAddress,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createDepositNftInstruction(accounts));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
    return signature;
  } catch (err) {
    throw err;
  }
}

export async function withdrawNft(
  connection: Connection,
  mint: PublicKey,
  from: PublicKey,
  operator: Keypair,
): Promise<string> {
  try {
    // Derive the pda address

    const settingsPda = getSettingsPda();
    const gameVaultPda = getGameVaultPda(settingsPda);

    // Derive the mint address and the associated token account address

    const fromAssociatedTokenAddress = await getAssociatedTokenAddress(mint, from);

    const gameVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      operator,
      mint,
      gameVaultPda,
      true,
    );
    const gameVaultTokenAccount = gameVaultAssociatedTokenAccount.address;

    const accounts: WithdrawNftInstructionAccounts = {
      settings: settingsPda,
      gameVaultPda: gameVaultPda,
      gameVaultTokenAccount: gameVaultTokenAccount,
      operatorAuthority: operator.publicKey,
      toTokenAccount: fromAssociatedTokenAddress,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createWithdrawNftInstruction(accounts));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [operator]);
    return signature;
  } catch (err) {
    throw err;
  }
}
