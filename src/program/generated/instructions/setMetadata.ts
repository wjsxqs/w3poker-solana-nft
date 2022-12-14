/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { TokenMetadata, tokenMetadataBeet } from '../types/TokenMetadata'

/**
 * @category Instructions
 * @category SetMetadata
 * @category generated
 */
export type SetMetadataInstructionArgs = {
  data: TokenMetadata
}
/**
 * @category Instructions
 * @category SetMetadata
 * @category generated
 */
export const setMetadataStruct = new beet.FixableBeetArgsStruct<
  SetMetadataInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['data', tokenMetadataBeet],
  ],
  'SetMetadataInstructionArgs'
)
/**
 * Accounts required by the _setMetadata_ instruction
 *
 * @property [_writable_] settings
 * @property [_writable_] authorityPda
 * @property [**signer**] authority
 * @property [] nftMetadata
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category SetMetadata
 * @category generated
 */
export type SetMetadataInstructionAccounts = {
  settings: web3.PublicKey
  authorityPda: web3.PublicKey
  authority: web3.PublicKey
  nftMetadata: web3.PublicKey
  systemProgram?: web3.PublicKey
  tokenMetadataProgram: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const setMetadataInstructionDiscriminator = [
  78, 157, 75, 242, 151, 20, 121, 144,
]

/**
 * Creates a _SetMetadata_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetMetadata
 * @category generated
 */
export function createSetMetadataInstruction(
  accounts: SetMetadataInstructionAccounts,
  args: SetMetadataInstructionArgs,
  programId = new web3.PublicKey('EqZ2b3VrYYH426eJ5MnAHs5QGuHXmpTzTHCPsoX9ETMf')
) {
  const [data] = setMetadataStruct.serialize({
    instructionDiscriminator: setMetadataInstructionDiscriminator,
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
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.nftMetadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
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
