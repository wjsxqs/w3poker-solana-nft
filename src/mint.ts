import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createMintInstruction, MintInstructionAccounts } from './program';
import { TOKEN_METADATA_PROGRAM_ID } from './constants';
import {
  getMetadata,
  getMasterEdition,
  getCollectionAuthorityRecord,
  getSettingsPda,
  getAuthorityPda,
  getPaymentVaultPda,
  getCollectionMint,
} from './utils';

export async function mint(
  connection: Connection,
  to: PublicKey,
  minter: Keypair,
): Promise<string> {
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

    // Derive the metadata and master edition addresses

    const metadataAddress = getMetadata(mintKeypair.publicKey);
    const masterEditionAddress = getMasterEdition(mintKeypair.publicKey);

    // Derive the collection metadata and master edition addresses

    const collectionMetadataAddress = getMetadata(collectionMintKey);
    const collectionMasterEditionAddress = getMasterEdition(collectionMintKey);

    // Derive the collection authority record addresses

    const collectionAuthorityRecordAddress = getCollectionAuthorityRecord(
      collectionMintKey,
      authorityPda,
    );

    const accounts: MintInstructionAccounts = {
      settings: settingsPda,
      authorityPda: authorityPda,
      paymentVaultPda: paymentVaultPda,
      mintAuthority: minter.publicKey,
      payer: minter.publicKey,
      nftMint: mintKeypair.publicKey,
      nftMetadata: metadataAddress,
      nftMasterEdition: masterEditionAddress,
      beneficiaryNftAccount: nftTokenAccount,
      collectionMint: collectionMintKey,
      collectionMetadata: collectionMetadataAddress,
      collectionMasterEdition: collectionMasterEditionAddress,
      collectionAuthorityRecord: collectionAuthorityRecordAddress,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    const ixs: TransactionInstruction[] = [];
    ixs.push(createMintInstruction(accounts));
    const tx = new Transaction().add(...ixs);

    const signature = await sendAndConfirmTransaction(connection, tx, [minter, mintKeypair]);
    return signature;
  } catch (err) {
    throw err;
  }
}
