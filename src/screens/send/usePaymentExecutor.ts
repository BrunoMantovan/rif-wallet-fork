import { useState, useEffect } from 'react'
import {
  convertBtcToSatoshi,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { useTranslation } from 'react-i18next'
import { createHash, randomBytes } from 'crypto'
import { utils, BigNumber } from 'ethers'
import { generateSecretAndHash } from 'shared/utils'

import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { fetchBitcoinTransactions } from 'store/slices/transactionsSlice'
import {
  fetchAddressToReturnFundsTo,
  fetchUtxo,
} from 'screens/send/bitcoinUtils'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import {
  addAddressToUsedBitcoinAddresses,
  selectWholeSettingsState,
} from 'store/slices/settingsSlice'
import { handleTransactionStatusChange } from 'store/shared/utils'
import { Wallet } from 'shared/wallet'

import { transferBitcoin } from './transferBitcoin'
import { TransactionInformation } from './types'
import { approve, escrow, releaseFunds } from './escrowTokens'
import { Order } from 'src/baApi'

const { parseUnits } = utils

interface ExecutePayment {
  token: TokenBalanceObject
  amount: number
  to: string
  wallet: Wallet
  chainId: number
}

const checkBitcoinPaymentForErrors = (
  utxos: UnspentTransactionType[],
  amountToSend: number,
): string | void => {
  // Check if user has inputs
  if (utxos.length === 0) {
    return 'bitcoin_validation_zero_inputs'
  }
  // Compare current amountToSent versus current input values
  let currentAmount = convertBtcToSatoshi(amountToSend.toString())
  for (const utxo of utxos) {
    currentAmount = currentAmount.sub(utxo.value)
    if (currentAmount.isNegative()) {
      break
    }
  }
  // If amount is not negative, user is trying to send more balance than he has available
  if (!currentAmount.isNegative()) {
    return 'bitcoin_validation_inputs_not_enough'
  }
}

export const usePaymentExecutor = (
  bitcoinNetwork: TokenBalanceObject | undefined,
) => {
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionInformation | null>(null)
  const [error, setError] = useState<string | null | { message: string }>()
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const [addressToReturnRemainingAmount, setAddressToReturnRemainingAmount] =
    useState<string>('')
  const [bitcoinBalance, setBalanceAvailable] = useState<number>(0)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { usedBitcoinAddresses } = useAppSelector(selectWholeSettingsState)

  const onBitcoinTransactionSuccess = ({
    addressUsed,
  }: {
    addressUsed: string
  }) => {
    dispatch(addAddressToUsedBitcoinAddresses(addressUsed))
    // Easy fix to avoid dispatching a lot: Fetch latest 3 bitcoin transactions after 3s of the tx being completed
    setTimeout(() => {
      dispatch(fetchBitcoinTransactions({ pageSize: 3 }))
    }, 3000)
  }

  const escrowToken = async (
    token: ITokenWithBalance,
    order: Order,
    wallet: any,
    chainId: any,
  ) => {
    console.log('EscrowToken - PaymentExecutor')
    await escrow({
      order: order,
      token: token as unknown as ITokenWithBalance,
      wallet: wallet,
      chainId,
      onSetCurrentTransaction: setCurrentTransaction,
      onSetError: setError,
      onSetTransactionStatusChange: handleTransactionStatusChange(dispatch),
    })
  }

  const releaseToken = async (order: Order, wallet: any) => {
    await releaseFunds(order, wallet)
  }

  const executePayment = ({
    token,
    amount,
    to,
    wallet,
    chainId,
  }: ExecutePayment) => {
    console.log(
      'wallet: ',
      wallet,
      'chainid: ',
      chainId,
      'amount: ',
      amount,
      'to: ',
      to,
    )

    if ('bips' in token) {
      const hasError = checkBitcoinPaymentForErrors(utxos, amount)
      if (hasError) {
        setError(t(hasError))
        return
      }
      transferBitcoin({
        btcToPay: amount,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        bip: token.bips[0],
        to,
        utxos,
        balance: bitcoinBalance,
        addressToReturnRemainingAmount,
        onBitcoinTransactionSuccess,
      })
    } else {
      // transfer({
      //   token: token as unknown as ITokenWithBalance,
      //   amount: amount.toString(),
      //   to,
      //   wallet,
      //   chainId,
      //   onSetCurrentTransaction: setCurrentTransaction,
      //   onSetError: setError,
      //   onSetTransactionStatusChange: handleTransactionStatusChange(dispatch),
      // })

      const { secret: secretSeller } = generateSecretAndHash()
      const { secret: secretBuyer } = generateSecretAndHash()

      console.log('TOKEN', token)

      const order1: Order = {
        fiatCode: 'ars',
        type: 'SELL',
        amount: amount.toString(),
        id: 'bc035a46-b511-4102-9198-8427b3effb42',
        buyerAddress: '0xd97D397BfF4610AA208936A5D42C640604570372',
        tokenCode: 'trif',
        sellerHash: secretSeller.toString('hex'),
        buyerHash: secretBuyer.toString('hex'),
      }

      const amountInt = parseUnits(amount.toString() ?? '0', 18) // Ensure order.amount is not undefined
      const feeInt = amountInt.div(BigInt(100)) // Calculate the fee as a BigInt
      const totalAmount = amountInt.add(feeInt) // Sum is also a BigInt

      console.log(order1)
      console.log(BigNumber.from(totalAmount).toString())

      approve({
        token: token as unknown as ITokenWithBalance,
        wallet: wallet,
        amount: totalAmount,
        chainId,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        onSetTransactionStatusChange: handleTransactionStatusChange(dispatch),
      })

      escrow({
        order: order1,
        token: token as unknown as ITokenWithBalance,
        wallet: wallet,
        chainId,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        onSetTransactionStatusChange: handleTransactionStatusChange(dispatch),
      })

      /* const orderId = "23dcf5f5-e2c1-4d2c-9241-42";
      console.log("orderId: ", orderId);



       */
    }
  }
  // When bitcoin network changes - fetch utxos
  // and also set the return address
  useEffect(() => {
    if (bitcoinNetwork && 'satoshis' in bitcoinNetwork) {
      fetchUtxo({
        token: bitcoinNetwork,
        onSetUtxos: setUtxos,
        onSetBalance: balance => setBalanceAvailable(balance.toNumber()),
      })
      fetchAddressToReturnFundsTo({
        token: bitcoinNetwork,
        onSetAddress: setAddressToReturnRemainingAmount,
        usedBitcoinAddresses,
      })
    }
  }, [bitcoinNetwork, usedBitcoinAddresses])

  return {
    currentTransaction,
    error,
    executePayment,
    escrowToken,
    releaseToken,
    bitcoinBalance,
  }
}
