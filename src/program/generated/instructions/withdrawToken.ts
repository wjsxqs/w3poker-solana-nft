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
 * @category WithdrawToken
 * @category generated
 */
export const withdrawTokenStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'WithdrawTokenInstructionArgs'
)
/**
 * Accounts required by the _withdrawToken_ instruction
 *
 * @property [_writable_] settings
 * @property [_writable_] paymentVaultPda
 * @property [_writable_] paymentVaultTokenAccount
 * @property [**signer**] authority
 * @property [_writable_] beneficiaryTokenAccount
 * @category Instructions
 * @category WithdrawToken
 * @category generated
 */
export type WithdrawTokenInstructionAccounts = {
  settings: web3.PublicKey
  paymentVaultPda: web3.PublicKey
  paymentVaultTokenAccount: web3.PublicKey
  authority: web3.PublicKey
  beneficiaryTokenAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const withdrawTokenInstructionDiscriminator = [
  136, 235, 181, 5, 101, 109, 57, 81,
]

/**
 * Creates a _WithdrawToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category WithdrawToken
 * @category generated
 */
export function createWithdrawTokenInstruction(
  accounts: WithdrawTokenInstructionAccounts,
  programId = new web3.PublicKey('EqZ2b3VrYYH426eJ5MnAHs5QGuHXmpTzTHCPsoX9ETMf')
) {
  const [data] = withdrawTokenStruct.serialize({
    instructionDiscriminator: withdrawTokenInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.settings,
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
      isSigner: true,
    },
    {
      pubkey: accounts.beneficiaryTokenAccount,
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
