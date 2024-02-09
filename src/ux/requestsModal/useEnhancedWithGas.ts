import { useEffect, useState } from 'react'
import { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { isAddress } from '@rsksmart/rsk-utils'

import { ChainID } from 'lib/eoaWallet'

import { TokenSymbol } from 'screens/home/TokenImage'
import { Wallet } from 'shared/wallet'

const abiEnhancer = new AbiEnhancer()

const convertValueToString = (value?: object | boolean | string) =>
  value ? value.toString() : ''
const convertNumberToString = (value?: number) =>
  value ? value.toString() : '0'

const convertTransactionToStrings = (tx: TransactionRequest) => ({
  ...tx,
  to: convertValueToString(tx.to),
  from: convertValueToString(tx.from),
  data: convertValueToString(tx.data),
  gasLimit: convertNumberToString(Number(tx.gasLimit)),
  gasPrice: convertNumberToString(Number(tx.gasPrice)),
})

export interface EnhancedTransactionRequest extends TransactionRequest {
  symbol?: TokenSymbol
  functionName?: string
  functionParameters?: string[]
}

export const useEnhancedWithGas = (
  wallet: Wallet,
  tx: TransactionRequest,
  chainId: ChainID,
) => {
  const [enhancedTransactionRequest, setEnhancedTransactionRequest] =
    useState<EnhancedTransactionRequest>({
      gasPrice: '0',
      gasLimit: '0',
    })
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    // avoid to call estimateGas if the tx.to address is not valid
    if (tx.to && !isAddress(tx.to)) {
      return
    }
    const gasLimitEstimate = wallet
      .estimateGas({ to: tx.to || '0x', data: tx.data || '0x' })
      .then((estimate: BigNumber) => {
        if (tx.gasLimit && estimate.lt(tx.gasLimit)) {
          return tx.gasLimit
        } else {
          return estimate
        }
      })

    const gasPriceEstimate = wallet.provider
      ?.getGasPrice()
      .then((gp: BigNumber) => gp.mul('101').div('100'))
      .then((estimate: BigNumber) => {
        if (tx.gasPrice && estimate.lt(tx.gasPrice)) {
          return tx.gasPrice
        } else {
          return estimate
        }
      })

    const enhancer = abiEnhancer.enhance(chainId, tx)

    Promise.all([gasLimitEstimate, gasPriceEstimate, enhancer]).then(result => {
      const txEnhanced = convertTransactionToStrings({
        ...result[2],
        gasLimit: result[0] || 0,
        gasPrice: result[1] || 0,
      })

      setEnhancedTransactionRequest(txEnhanced)
      setIsLoaded(true)
    })
  }, [tx, wallet, chainId])

  const setGasLimit = (gasLimit: string) =>
    setEnhancedTransactionRequest({ ...enhancedTransactionRequest, gasLimit })
  const setGasPrice = (gasPrice: string) =>
    setEnhancedTransactionRequest({ ...enhancedTransactionRequest, gasPrice })

  return { enhancedTransactionRequest, isLoaded, setGasLimit, setGasPrice }
}
