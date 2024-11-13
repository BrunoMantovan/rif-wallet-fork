/* eslint-disable prettier/prettier */
import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, utils, Contract } from 'ethers'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { toChecksumAddress } from '@rsksmart/rsk-utils'
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { providers } from 'ethers'
const { parseUnits } = utils;
import { createHash } from 'crypto'

import { ChainID } from 'lib/eoaWallet'
import { sanitizeMaxDecimalText } from 'lib/utils'

import { Wallet } from 'shared/wallet'
import erc20ABI from 'src/ERC20.json'
import escrowABI from 'src/escrowABI.json'
import { P2PMarketplaceAPIClient } from 'src/baApi'

const escrowContractAddress = toChecksumAddress('0x47856aD652444563c69Fb2e48384fb633d51C21a')
const BASE_URL = 'https://bolsillo-argento-586dfd80364d.herokuapp.com'
const client = new P2PMarketplaceAPIClient(BASE_URL)

import {
    OnSetTransactionStatusChange,
    TransactionStatus,
} from 'store/shared/types'
import { Order } from 'src/baApi';

import { getWalletSetting } from '../../core/config'
import { SETTINGS } from '../../core/types'
import {
    OnSetCurrentTransactionFunction,
    OnSetErrorFunction,
    TransactionInformation,
} from './types'



interface IEscrowParams {
    order: Order
    token: ITokenWithBalance
    wallet: Wallet
    chainId: number
    onSetError?: OnSetErrorFunction
    onSetCurrentTransaction?: OnSetCurrentTransactionFunction
    onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

interface IApproveParams {
    order: Order
    token: ITokenWithBalance
    amount: BigNumber
    wallet: Wallet
    chainId: number
    onSetError?: OnSetErrorFunction
    onSetCurrentTransaction?: OnSetCurrentTransactionFunction
    onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

interface IAllowanceParams {
    spender: string,
    tokenAddress: string,
    wallet: Wallet,
    chainId: number
}

const gasLimit = BigNumber.from(6800000)

function hexStringToByteArray(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
        throw new Error('Invalid hex string. Length must be even.');
    }

    const byteArray = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }

    return byteArray;
}

export const releaseFunds = async (order: Order, wallet : any) => {
    try {
        console.log("Starting Release")
        console.log(order)
        const escrowContract = new Contract(escrowContractAddress, escrowABI, wallet)
        const tx = await escrowContract.releaseToBuyer(
            order.id,
            '0x' + order.buyerHash,
            {
                value: BigNumber.from(0),
                gasLimit: gasLimit,
            },
        )
        console.log("Release",tx)

    } catch (error) {
      console.error('Error releasing funds:', error);
      return Promise.reject(error);
    }
  }


export const escrow = async ({
    order,
    token,
    wallet,
    chainId,
    onSetError,
    onSetCurrentTransaction,
    onSetTransactionStatusChange,
}: IEscrowParams) => {

    onSetError?.(null)
    onSetCurrentTransaction?.({ status: TransactionStatus.USER_CONFIRM })

    try {
        const escrowContract = new Contract(escrowContractAddress, escrowABI, wallet)
        console.log('Contrato de escrow creado:', escrowContractAddress);
        console.log('TOKEN', token)

        const transferMethod =
            order.tokenCode === 'RBTC'
                ? makeRBTCToken(wallet, chainId)
                : convertToERC20Token(token, wallet)

        const amountInt = parseUnits(order.amount ?? '0', 18); // Ensure order.amount is not undefined
        const feeInt = amountInt.div(BigNumber.from(100)); // Calculate the fee using BigNumber division
        const totalAmount = amountInt.add(feeInt); // Sum using BigNumber addition

        await approve({token, wallet, amount: totalAmount, chainId, order})

        const orderId = order.id
        console.log('ID de la orden:', orderId);

        const decimals = await transferMethod.decimals()
        console.log('Decimales del token:', decimals);

        const tokenAmount = BigNumber.from(
            utils.parseUnits(sanitizeMaxDecimalText(order.amount!, decimals), decimals),
        )
        console.log('Cantidad de tokens a transferir:', tokenAmount.toString());

        // const feeAmount = tokenAmount.div(100)
        // const totalAmount = tokenAmount.add(feeAmount)
        console.log('Cantidad total (incluyendo tarifas):', totalAmount.toString());

        let txPending
        if (!orderId || !transferMethod.address || !order.buyerAddress || !order.buyerHash || !order.sellerHash || !amountInt || !feeInt) {
            console.error('Error: Parámetros requeridos no definidos');
            throw new Error('One or more required parameters for escrowERC20 are undefined')
        } else if (order.tokenCode === 'RBTC') {
            console.log('Ejecutando escrowRBTC...');
            txPending = await escrowContract.escrowRBTC(
                orderId,
                order.buyerAddress.toLowerCase(),
                order.buyerHash,
                order.sellerHash,
                amountInt,
                feeInt,
                {
                    value: amountInt,
                    gasLimit: gasLimit,
                },
            )
        } else {
            console.log('Ejecutando escrowERC20...');
            try {
                const ba = hexStringToByteArray(order.buyerHash!)
                const sa = hexStringToByteArray(order.sellerHash!)

                const buyerHashBuffer = ba
                    ? createHash('sha256').update(ba).digest('hex')
                    : undefined;

                const sellerHashBuffer = sa
                    ? createHash('sha256').update(sa).digest('hex')
                    : undefined;
                txPending = await escrowContract.escrowERC20(
                    order.id,
                    toChecksumAddress(transferMethod.address.toLowerCase()),
                    toChecksumAddress(order.buyerAddress),
                    `0x${buyerHashBuffer}`,
                    `0x${sellerHashBuffer}`,
                    amountInt,
                    feeInt,
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
            .then((contractReceipt: any) => {
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
            .catch((err: Error) => {
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
    order,
}: IApproveParams) => {
    try {
        const transferMethod = convertToERC20Token(token, wallet)
        const erc20Contract = new Contract(transferMethod.address, erc20ABI, wallet)
        const currentAllowance = await getAllowance({ spender: escrowContractAddress, tokenAddress: transferMethod.address, wallet, chainId })

        console.log(currentAllowance)

        if (currentAllowance.lt(amount)) {

            const approveData = erc20Contract.interface.encodeFunctionData(
                'approve',
                [escrowContractAddress.toLowerCase(), amount]
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

            const { wait: waitForTransactionToComplete } = txPending

            const contractReceipt = await waitForTransactionToComplete()

            console.log('Contract receipt: ', txPending.hash)

            return contractReceipt

        } else {
            console.log('Sufficient allowance already exists')
            return null
        }

    } catch (err) {
        console.error('Error in approve function:', err)
        if (err instanceof Error) {
            console.error('Error message:', err.message)
        }
        return null
    }
}


async function orderUpdate(newStatus: string, order: Order) {
    if (!order.id) {
        throw new Error('El ID de la orden no puede ser undefined');
    }
    console.log("comenzo el order update", "orderID: ", order.id, "status: ", newStatus);
    
    const updateOrderRequest = {
      status: newStatus,
      orderId: order.id,
    }

    const response = await client.updateOrder(updateOrderRequest, {
      'x-api-secret': 'test',
      'x-blockchain': 'rsk_testnet',
    })
    console.log('Order Updated:', response)
}