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
  createPayInstruction,
  createWithdrawSolInstruction,
  createWithdrawTokenInstruction,
  PayInstructionAccounts,
  WithdrawSolInstructionAccounts,
  WithdrawTokenInstructionAccounts,
} from './program';
import { AUTHORITY_KEY, USDC_MINT } from './constants';
import { getSettingsPda, getAuthorityPda, getPaymentVaultPda } from './utils';

export async function pay(
  connection: Connection,
  payId: number,
  to: PublicKey,
  payer: Keypair,
): Promise<string> {
  try {
    // Derive the pda address

    const settingsPda = getSettingsPda();
    const authorityPda = getAuthorityPda(settingsPda);
    const paymentVaultPda = getPaymentVaultPda(settingsPda);

    const payerTokenAddress = await getAssociatedTokenAddress(USDC_MINT, payer.publicKey);

    const paymentVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      USDC_MINT,
      paymentVaultPda,
      true,
    );
    const paymentVaultTokenAddress = paymentVaultAssociatedTokenAccount.address;

    const accounts: PayInstructionAccounts = {
      settings: settingsPda,
      authorityPda: authorityPda,
      paymentVaultPda: paymentVaultPda,
      paymentVaultTokenAccount: paymentVaultTokenAddress,
      authority: AUTHORITY_KEY,
      payer: payer.publicKey,
      payerTokenAccount: payerTokenAddress,
      toAccount: to,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createPayInstruction(accounts, { payId }));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
    return signature;
  } catch (err) {
    throw err;
  }
}

export async function withdrawSol(
  connection: Connection,
  beneficiary: PublicKey,
  authority: Keypair,
): Promise<string> {
  try {
    const settingsPda = getSettingsPda();
    const paymentVaultPda = getPaymentVaultPda(settingsPda);

    const accounts: WithdrawSolInstructionAccounts = {
      settings: settingsPda,
      paymentVaultPda: paymentVaultPda,
      authority: authority.publicKey,
      beneficiaryAccount: beneficiary,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createWithdrawSolInstruction(accounts));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [authority]);
    return signature;
  } catch (err) {
    throw err;
  }
}

export async function withdrawToken(
  connection: Connection,
  beneficiary: PublicKey,
  authority: Keypair,
): Promise<string> {
  try {
    const settingsPda = getSettingsPda();
    const paymentVaultPda = getPaymentVaultPda(settingsPda);

    const paymentVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      authority,
      USDC_MINT,
      paymentVaultPda,
      true,
    );
    const paymentVaultTokenAddress = paymentVaultAssociatedTokenAccount.address;

    const accounts: WithdrawTokenInstructionAccounts = {
      settings: settingsPda,
      paymentVaultPda: paymentVaultPda,
      paymentVaultTokenAccount: paymentVaultTokenAddress,
      authority: authority.publicKey,
      beneficiaryTokenAccount: beneficiary,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createWithdrawTokenInstruction(accounts));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [authority]);
    return signature;
  } catch (err) {
    throw err;
  }
}
