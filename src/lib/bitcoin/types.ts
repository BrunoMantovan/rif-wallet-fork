import { IRequest, OnRequest } from '../core'
import { RifWalletServicesFetcher } from '../rifWalletServices/RifWalletServicesFetcher'
import { BIP32Interface } from 'bip32'
import { Psbt, Network, HDSigner } from 'bitcoinjs-lib'
import BIPRequestPaymentFacade from './BIPRequestPaymentFacade'
import BitcoinNetwork from './BitcoinNetwork'
import BIPWithRequest from './BIPWithRequest'
import BIP from './BIP'
export { BIP32Interface, Psbt, Network, HDSigner }
export type TransactionInputType = {
  hash: string
  index: number
  witnessUtxo: {
    script: Buffer
    value: number
  }
  bip32Derivation: {
    masterFingerprint: Buffer
    path: string
    pubkey: Buffer
  }[]
}

export type NetworkInfoType = {
  bip32: { public: number; private: number }
  wif: number
  bech32: string
}

export type UnspentTransactionType = {
  txid: string
  vout: number
  value: string
  path: string
  address: string
  confirmations: number
}
/**
 * amountToPay: number
 * addressToPay: string
 * unspentTransactions: Array<>
 * miningFee: number
 */
export type PaymentType = {
  amountToPay: number
  addressToPay: string
  unspentTransactions: Array<UnspentTransactionType>
  miningFee: number
}

export type PaymentTypeWithBalance = PaymentType & { balance: number }

export type EstimateFeeType = Omit<PaymentType, 'miningFee'>

type PaymentTypeWithPaymentFacade = PaymentType & {
  payment: BIPRequestPaymentFacade
  balance: number
}

export type SendBitcoinRequestType = IRequest<
  'SEND_BITCOIN',
  PaymentTypeWithPaymentFacade,
  any,
  any
>

export type BIPOptionsType = {
  request?: OnRequest
  fetcher?: RifWalletServicesFetcher
  paymentFactory?: any
}

export type PaymentFactoryType = (
  paymentType: string,
  bip32root: BIP32Interface,
  networkInfo: NetworkInfoType,
) => any

export interface IPayment {
  generatePayment: (...args: any[]) => Psbt
  signPayment: (...args: any[]) => Psbt | any
  convertPaymentToHexString: (...args: any[]) => string
}

export type BitcoinRequest = SendBitcoinRequestType

export type BitcoinNetworkWithBIPRequest = Omit<BitcoinNetwork, 'bips'> & {
  bips: BIPWithRequest[]
}

export type createBipFactoryType = ConstructorParameters<typeof BIP>
