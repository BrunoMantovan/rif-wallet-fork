/* eslint-disable prettier/prettier */
import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, utils, Contract } from 'ethers'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { toChecksumAddress } from '@rsksmart/rsk-utils'
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { providers } from 'ethers'

import { ChainID } from 'lib/eoaWallet'
import { sanitizeMaxDecimalText } from 'lib/utils'

import { Wallet } from 'shared/wallet'
import erc20ABI from 'src/ERC20.json'
import escrowABI from 'src/escrowABI.json'

const escrowContractAddress = toChecksumAddress('0x47856aD652444563c69Fb2e48384fb633d51C21a')

import {
    OnSetTransactionStatusChange,
    TransactionStatus,
} from 'store/shared/types'

import { getWalletSetting } from '../../core/config'
import { SETTINGS } from '../../core/types'
import {
    OnSetCurrentTransactionFunction,
    OnSetErrorFunction,
    TransactionInformation,
} from './types'



interface IEscrowParams {
    order: EscrowOrder
    wallet: Wallet
    chainId: number
    onSetError?: OnSetErrorFunction
    onSetCurrentTransaction?: OnSetCurrentTransactionFunction
    onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

interface IApproveParams {
    token: ITokenWithBalance
    amount: string
    wallet: Wallet
    chainId: number
    onSetError?: OnSetErrorFunction
    onSetCurrentTransaction?: OnSetCurrentTransactionFunction
    onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

export interface EscrowOrder {
    orderId: string;
    amount: string;
    token: ITokenWithBalance
    buyerAddress: string;
    buyerHash: string;
    sellerHash: string;
}

interface IAllowanceParams {
    spender: string,
    tokenAddress: string,
    wallet: Wallet,
    chainId: number
}

const gasLimit = BigNumber.from(6800000)


export const escrow = async ({
    order,
    wallet,
    chainId,
    onSetError,
    onSetCurrentTransaction,
    onSetTransactionStatusChange,
}: IEscrowParams) => {
    console.log('Iniciando la función escrow con los parámetros:', { order, wallet, chainId });
    onSetError?.(null)
    onSetCurrentTransaction?.({ status: TransactionStatus.USER_CONFIRM })

    const escrowContract = new Contract(escrowContractAddress, escrowABI, wallet)
    console.log('Contrato de escrow creado:', escrowContractAddress);

    const transferMethod =
        order.token.symbol === 'RBTC'
            ? makeRBTCToken(wallet, chainId)
            : convertToERC20Token(order.token, wallet)
    console.log('Método de transferencia seleccionado:', transferMethod);

    try {
        const orderId = order.orderId
        console.log('ID de la orden:', orderId);
        
        const decimals = await transferMethod.decimals()
        console.log('Decimales del token:', decimals);
        
        const tokenAmount = BigNumber.from(
            utils.parseUnits(sanitizeMaxDecimalText(order.amount, decimals), decimals),
        )
        console.log('Cantidad de tokens a transferir:', tokenAmount.toString());
        
        const feeAmount = tokenAmount.div(100)
        const totalAmount = tokenAmount.add(feeAmount)
        console.log('Cantidad total (incluyendo tarifas):', totalAmount.toString());

        let txPending
        if (!orderId || !transferMethod.address || !order.buyerAddress || !order.buyerHash || !order.sellerHash || !tokenAmount || !feeAmount) {
            console.error('Error: Parámetros requeridos no definidos');
            throw new Error('One or more required parameters for escrowERC20 are undefined')
        } else if (order.token.symbol === 'RBTC') {
            console.log('Ejecutando escrowRBTC...');
            txPending = await escrowContract.escrowRBTC(
                orderId,
                order.buyerAddress.toLowerCase(),
                order.buyerHash,
                order.sellerHash,
                tokenAmount,
                feeAmount,
                {
                    value: totalAmount,
                    gasLimit: gasLimit,
                },
            )
        } else {
            console.log('Ejecutando escrowERC20...');
            try {
                txPending = await escrowContract.escrowERC20(
                    orderId,
                    toChecksumAddress(transferMethod.address.toLowerCase()),
                    toChecksumAddress(order.buyerAddress.toLowerCase()),
                    order.buyerHash,
                    order.sellerHash,
                    tokenAmount,
                    feeAmount,
                    {
                        gasLimit: gasLimit,
                        value: '0x0',
                    }
                )
            } catch (err) {
                console.error('Error al ejecutar escrowERC20:', err);
            }
        }

        console.log('Transacción pendiente:', txPending);
        const { wait: waitForTransactionToComplete, ...txPendingRest } = txPending

        onSetTransactionStatusChange?.({
            txStatus: 'PENDING',
            ...txPendingRest,
            value: tokenAmount,
            symbol: transferMethod.symbol,
            finalAddress: escrowContractAddress,
            enhancedAmount: order.amount,
            original: txPendingRest,
        })
        const current: TransactionInformation = {
            to: escrowContractAddress,
            value: order.amount,
            symbol: transferMethod.symbol,
            hash: txPending.hash,
            status: TransactionStatus.PENDING,
            original: txPendingRest,
        }

        onSetCurrentTransaction?.(current)

        waitForTransactionToComplete()
            .then(contractReceipt => {
                console.log('Transacción confirmada:', contractReceipt.transactionHash);
                onSetCurrentTransaction?.({ ...current, status: TransactionStatus.SUCCESS })
                onSetTransactionStatusChange?.({
                    txStatus: 'CONFIRMED',
                    original: {
                        ...txPendingRest,
                        hash: contractReceipt.transactionHash,
                    },
                    ...contractReceipt,
                })
            })
            .catch(err => {
                console.error('Error en la espera de la transacción:', err);
                onSetCurrentTransaction?.({ ...current, status: TransactionStatus.FAILED })
                onSetTransactionStatusChange?.({
                    txStatus: TransactionStatus.FAILED,
                    ...txPendingRest,
                })
            })
    } catch (err) {
        console.error('ERROR en la función escrow:', err);
        onSetError?.(err as Error)
        onSetCurrentTransaction?.(null)
    }
}

const getAllowance = async ({ spender, tokenAddress, wallet, chainId }: IAllowanceParams) => {
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(
        getWalletSetting(SETTINGS.RPC_URL,
            chainId as ChainID
        ),
    )
    const erc20Contract = new Contract(toChecksumAddress(tokenAddress), erc20ABI, jsonRpcProvider)
    const allowance = await erc20Contract.allowance(wallet.address, toChecksumAddress(spender))
    console.log('Allowance:', allowance.toString())
    return allowance
}

export const approve = async ({
    token,
    wallet,
    amount,
    chainId,
    onSetError,
    onSetCurrentTransaction,
    onSetTransactionStatusChange,
}: IApproveParams) => {
    onSetError?.(null)
    onSetCurrentTransaction?.({ status: TransactionStatus.USER_CONFIRM })

    try {
        const transferMethod = convertToERC20Token(token, wallet)
        const decimals = await transferMethod.decimals()
        const tokenAmount = BigNumber.from(
            utils.parseUnits(sanitizeMaxDecimalText(amount, decimals), decimals),
        )

        const erc20Contract = new Contract(transferMethod.address, erc20ABI, wallet)
        const currentAllowance = await getAllowance({ spender: escrowContractAddress, tokenAddress: transferMethod.address, wallet, chainId })

        if (currentAllowance.lt(tokenAmount)) {

            const approveData = erc20Contract.interface.encodeFunctionData(
                'approve',
                [escrowContractAddress, tokenAmount]
            )

            const transactionRequest: TransactionRequest = {
                to: transferMethod.address,
                data: approveData,
                gasLimit,
                value: '0x0',
            }

            console.log('Sending approval transaction...')
            const txPending = await wallet.sendTransaction(transactionRequest)

            console.log('Approval transaction sent:', txPending.hash)

            const { wait: waitForTransactionToComplete, ...txPendingRest } = txPending

            onSetTransactionStatusChange?.({
                txStatus: TransactionStatus.PENDING,
                ...txPendingRest,
                value: tokenAmount,
                symbol: transferMethod.symbol,
                finalAddress: escrowContractAddress,
                enhancedAmount: amount,
                original: txPendingRest,
            })

            const current: TransactionInformation = {
                to: transferMethod.address,
                value: tokenAmount.toString(),
                symbol: transferMethod.symbol,
                hash: txPending.hash,
                status: TransactionStatus.PENDING,
                original: txPendingRest,
            }
            onSetCurrentTransaction?.(current)

            const contractReceipt = await waitForTransactionToComplete()
            console.log('Approval transaction confirmed:', contractReceipt.transactionHash)
            onSetCurrentTransaction?.({ ...current, status: TransactionStatus.SUCCESS })
            onSetTransactionStatusChange?.({
                txStatus: TransactionStatus.USER_CONFIRM,
                original: {
                    ...txPendingRest,
                    hash: contractReceipt.transactionHash,
                },
                ...contractReceipt,
            })

            onSetTransactionStatusChange?.({
                txStatus: TransactionStatus.FAILED,
                ...txPendingRest,
            })

        } else {
            console.log('Sufficient allowance already exists')
            onSetCurrentTransaction?.({ status: TransactionStatus.SUCCESS })
        }
    } catch (err) {
        console.error('Error in approve function:', err)
        if (err instanceof Error) {
            console.error('Error message:', err.message)
        }
        onSetError?.(err as Error)
        onSetCurrentTransaction?.(null)
    }
}
