/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category Buy
 * @category generated
 */
export type BuyInstructionArgs = {
  payId: number
  referralCode: beet.COption<beet.bignum>
}
/**
 * @category Instructions
 * @category Buy
 * @category generated
 */
export const buyStruct = new beet.FixableBeetArgsStruct<
  BuyInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['payId', beet.u8],
    ['referralCode', beet.coption(beet.u64)],
  ],
  'BuyInstructionArgs'
)
/**
 * Accounts required by the _buy_ instruction
 *
 * @property [_writable_] settings
 * @property [_writable_] authorityPda
 * @property [_writable_] paymentVaultPda
 * @property [_writable_] paymentVaultTokenAccount
 * @property [] authority
 * @property [_writable_, **signer**] buyer
 * @property [_writable_] buyerTokenAccount
 * @property [_writable_] nftMint
 * @property [**signer**] nftMintAuthority
 * @property [_writable_] nftMetadata
 * @property [_writable_] nftMasterEdition
 * @property [] collectionMint
 * @property [_writable_] collectionMetadata
 * @property [_writable_] collectionMasterEdition
 * @property [] collectionAuthorityRecord
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category Buy
 * @category generated
 */
export type BuyInstructionAccounts = {
  settings: web3.PublicKey
  authorityPda: web3.PublicKey
  paymentVaultPda: web3.PublicKey
  paymentVaultTokenAccount: web3.PublicKey
  authority: web3.PublicKey
  buyer: web3.PublicKey
  buyerTokenAccount: web3.PublicKey
  nftMint: web3.PublicKey
  nftMintAuthority: web3.PublicKey
  nftMetadata: web3.PublicKey
  nftMasterEdition: web3.PublicKey
  collectionMint: web3.PublicKey
  collectionMetadata: web3.PublicKey
  collectionMasterEdition: web3.PublicKey
  collectionAuthorityRecord: web3.PublicKey
  tokenMetadataProgram: web3.PublicKey
  systemProgram?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const buyInstructionDiscriminator = [102, 6, 61, 18, 1, 218, 235, 234]

/**
 * Creates a _Buy_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Buy
 * @category generated
 */
export function createBuyInstruction(
  accounts: BuyInstructionAccounts,
  args: BuyInstructionArgs,
  programId = new web3.PublicKey('EqZ2b3VrYYH426eJ5MnAHs5QGuHXmpTzTHCPsoX9ETMf')
) {
  const [data] = buyStruct.serialize({
    instructionDiscriminator: buyInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.settings,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authorityPda,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.paymentVaultPda,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.paymentVaultTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.buyer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.buyerTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.nftMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.nftMintAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.nftMetadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.nftMasterEdition,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMetadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionMasterEdition,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionAuthorityRecord,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}