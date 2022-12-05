import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  BuyAndDepositInstructionAccounts,
  BuyInstructionAccounts,
  createBuyAndDepositInstruction,
  createBuyInstruction,
} from './program';
import { USDC_MINT, TOKEN_METADATA_PROGRAM_ID, AUTHORITY_KEY } from './constants';
import {
  getMetadata,
  getMasterEdition,
  getCollectionAuthorityRecord,
  getSettingsPda,
  getAuthorityPda,
  getPaymentVaultPda,
  getCollectionMint,
  getGameVaultPda,
} from './utils';

export async function buy(connection: Connection, to: PublicKey, payer: Keypair): Promise<string> {
  try {
    // Derive the pda address

    const settingsPda = getSettingsPda();
    const authorityPda = getAuthorityPda(settingsPda);
    const paymentVaultPda = getPaymentVaultPda(settingsPda);

    const collectionMintKey = await getCollectionMint(connection, settingsPda);

    // Derive the mint address and the associated token account address

    const mintKeypair: Keypair = Keypair.generate();
    const nftMint = mintKeypair.publicKey;

    const nftOwner = to;
    const nftTokenAccount = await getAssociatedTokenAddress(nftMint, nftOwner);

    const payerTokenAddress = await getAssociatedTokenAddress(USDC_MINT, payer.publicKey);
    const paymentVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      USDC_MINT,
      paymentVaultPda,
      true,
    );
    const paymentVaultTokenAddress = paymentVaultAssociatedTokenAccount.address;

    // Derive the metadata and master edition addresses

    const metadataAddress = getMetadata(nftMint);
    const masterEditionAddress = getMasterEdition(nftMint);
    const collectionMetadataAddress = getMetadata(collectionMintKey);
    const collectionMasterEditionAddress = getMasterEdition(collectionMintKey);
    const collectionAuthorityRecordAddress = getCollectionAuthorityRecord(
      collectionMintKey,
      authorityPda,
    );

    const accounts: BuyInstructionAccounts = {
      settings: settingsPda,
      authorityPda: authorityPda,
      paymentVaultPda: paymentVaultPda,
      paymentVaultTokenAccount: paymentVaultTokenAddress,
      authority: AUTHORITY_KEY,
      buyer: payer.publicKey,
      buyerTokenAccount: payerTokenAddress,
      nftMint: nftMint,
      nftMintAuthority: payer.publicKey,
      nftMetadata: metadataAddress,
      nftMasterEdition: masterEditionAddress,
      collectionMint: collectionMintKey,
      collectionMetadata: collectionMetadataAddress,
      collectionMasterEdition: collectionMasterEditionAddress,
      collectionAuthorityRecord: collectionAuthorityRecordAddress,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: nftMint,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    ixs.push(createInitializeMintInstruction(nftMint, 0, payer.publicKey, payer.publicKey));
    ixs.push(
      createAssociatedTokenAccountInstruction(payer.publicKey, nftTokenAccount, nftOwner, nftMint),
    );
    ixs.push(createMintToInstruction(nftMint, nftTokenAccount, payer.publicKey, 1, []));
    // buy instruction
    ixs.push(
      createBuyInstruction(accounts, {
        payId: 101,
        referralCode: null,
      }),
    );
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [payer, mintKeypair]);
    return signature;
  } catch (err) {
    throw err;
  }
}

export async function buyAndDeposit(connection: Connection, payer: Keypair): Promise<string> {
  try {
    // Derive the pda address

    const settingsPda = getSettingsPda();
    const authorityPda = getAuthorityPda(settingsPda);
    const paymentVaultPda = getPaymentVaultPda(settingsPda);
    const gameVaultPda = getGameVaultPda(settingsPda);

    const collectionMintKey = await getCollectionMint(connection, settingsPda);

    // Derive the mint address and the associated token account address

    const mintKeypair: Keypair = Keypair.generate();
    const nftMint = mintKeypair.publicKey;

    const nftOwner = payer.publicKey;
    const nftTokenAccount = await getAssociatedTokenAddress(nftMint, nftOwner);

    const gameVaultTokenAccount = await getAssociatedTokenAddress(nftMint, gameVaultPda, true);

    const payerTokenAddress = await getAssociatedTokenAddress(USDC_MINT, payer.publicKey);

    const paymentVaultAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      USDC_MINT,
      paymentVaultPda,
      true,
    );
    const paymentVaultTokenAddress = paymentVaultAssociatedTokenAccount.address;

    // Derive the metadata and master edition addresses

    const metadataAddress = getMetadata(nftMint);
    const masterEditionAddress = getMasterEdition(nftMint);

    // Derive the collection metadata and master edition addresses

    const collectionMetadataAddress = getMetadata(collectionMintKey);
    const collectionMasterEditionAddress = getMasterEdition(collectionMintKey);

    // Derive the collection authority record addresses

    const collectionAuthorityRecordAddress = getCollectionAuthorityRecord(
      collectionMintKey,
      authorityPda,
    );

    const accounts: BuyAndDepositInstructionAccounts = {
      settings: settingsPda,
      authorityPda: authorityPda,
      paymentVaultPda: paymentVaultPda,
      gameVaultPda: gameVaultPda,
      paymentVaultTokenAccount: paymentVaultTokenAddress,
      gameVaultTokenAccount: gameVaultTokenAccount,
      authority: AUTHORITY_KEY,
      buyer: payer.publicKey,
      buyerTokenAccount: payerTokenAddress,
      buyerNftAccount: nftTokenAccount,
      nftMint: nftMint,
      nftMetadata: metadataAddress,
      nftMasterEdition: masterEditionAddress,
      collectionMint: collectionMintKey,
      collectionMetadata: collectionMetadataAddress,
      collectionMasterEdition: collectionMasterEditionAddress,
      collectionAuthorityRecord: collectionAuthorityRecordAddress,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: nftMint,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    ixs.push(createInitializeMintInstruction(nftMint, 0, payer.publicKey, payer.publicKey));
    ixs.push(
      createAssociatedTokenAccountInstruction(payer.publicKey, nftTokenAccount, nftOwner, nftMint),
    );
    ixs.push(createMintToInstruction(nftMint, nftTokenAccount, payer.publicKey, 1, []));
    ixs.push(
      createAssociatedTokenAccountInstruction(
        payer.publicKey,
        gameVaultTokenAccount,
        gameVaultPda,
        nftMint,
      ),
    );
    // buyAndDeposit instruction
    ixs.push(
      createBuyAndDepositInstruction(accounts, {
        payId: 101,
        referralCode: null,
      }),
    );

    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [payer, mintKeypair]);
    return signature;
  } catch (err) {
    throw err;
  }
}
