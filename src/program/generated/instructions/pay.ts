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
 * @category Pay
 * @category generated
 */
export type PayInstructionArgs = {
  payId: number
}
/**
 * @category Instructions
 * @category Pay
 * @category generated
 */
export const payStruct = new beet.BeetArgsStruct<
  PayInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['payId', beet.u8],
  ],
  'PayInstructionArgs'
)
/**
 * Accounts required by the _pay_ instruction
 *
 * @property [_writable_] settings
 * @property [_writable_] authorityPda
 * @property [_writable_] paymentVaultPda
 * @property [_writable_] paymentVaultTokenAccount
 * @property [] authority
 * @property [_writable_, **signer**] payer
 * @property [_writable_] payerTokenAccount
 * @property [_writable_] toAccount
 * @category Instructions
 * @category Pay
 * @category generated
 */
export type PayInstructionAccounts = {
  settings: web3.PublicKey
  authorityPda: web3.PublicKey
  paymentVaultPda: web3.PublicKey
  paymentVaultTokenAccount: web3.PublicKey
  authority: web3.PublicKey
  payer: web3.PublicKey
  payerTokenAccount: web3.PublicKey
  toAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const payInstructionDiscriminator = [
  119, 18, 216, 65, 192, 117, 122, 220,
]

/**
 * Creates a _Pay_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Pay
 * @category generated
 */
export function createPayInstruction(
  accounts: PayInstructionAccounts,
  args: PayInstructionArgs,
  programId = new web3.PublicKey('EqZ2b3VrYYH426eJ5MnAHs5QGuHXmpTzTHCPsoX9ETMf')
) {
  const [data] = payStruct.serialize({
    instructionDiscriminator: payInstructionDiscriminator,
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
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.payerTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.toAccount,
      isWritable: true,
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
