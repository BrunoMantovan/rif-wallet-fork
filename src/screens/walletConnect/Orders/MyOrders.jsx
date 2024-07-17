import "@ethersproject/shims"
import { View, StyleSheet, RefreshControl, ScrollView, Text, Pressable, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import AdCard from '../Components/AdCard';
import ButtonCustom from '../Login/ButtonCustom';
import { sharedColors, testIDs } from 'src/shared/constants';
import { AppButton } from 'src/components';
import { castStyle } from 'src/shared/utils';
import { useTranslation } from 'react-i18next'
import { t } from 'i18next';
import { useNavigation } from '@react-navigation/native';
import { useMarket } from '../MarketContext';
import { Contract, ethers } from "ethers";
import abi from "../../../shared/constants/ABI.json"
import { getKeys } from "src/storage/SecureStorage";
import { KeyManagementSystem } from "src/lib/core";
import { getCurrentChainId } from "src/storage/ChainStorage";
import { useWalletState } from "src/shared/wallet";
import SmartWalletFactoryABI from "../../../../docs/recovery/abi/smartWalletFactory.json"
import smartWalletABI from "../../../../docs/recovery/abi/SmartWalletAbi.json"
import { toChecksumAddress,isValidChecksumAddress  } from "@rsksmart/rsk-utils";
 
export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation()
  const { setHideTab } = useMarket();
  const username = "usuario 987"
  const [mnemonic, setMnemonic] = useState("")

  const orderId = "939d2fb8-7dfd-47af-8803-961a01dcd409"
  const buyerAddress = "0x2501007dfca40d605c620ed92a6161feb5a6e18f"
  const buyerHash = "0x86ca218517b3c1e75848981aa4699fce5290b48131d8706f1a2ae390a4352f9b"
  const sellerHash = "0x8e87fb92780cb765b7944a6352448ad5a0a22f348407782101dd69a426b8d50e"
  const amount = "0.000001"
  const fee = "0.00002"
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const { wallet, walletIsDeployed } = useWalletState()

  useFocusEffect(
    React.useCallback(() => {
      setHideTab(false)
      const fetchData = async () => {
        try {
          const userDoc = await firestore().collection('Users').doc(username).get();
          const userData = userDoc.data(); // Get the data of the user document
          if (userData) {
            const userOrders = userData.orders || []; // Get the orders array from the user data
            setOrders(userOrders);
             // Update the state with the orders array
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      fetchData();
      
    }, [])
);

  useEffect(() => {
    async function contractCall(){
      const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co")
      const contract = new ethers.Contract("0xd83Be589F2622E6f311C886309A0629a18e36e22", abi, provider)
    
    try {
      const collectedFees = await contract.fees("0x542fDA317318eBF1d3DEAf76E0b632741A7e677d")
      const feesNumber = ethers.utils.formatUnits(collectedFees, 3);
      const whiteListed = await contract.isERC20Whitelisted("0x6B175474E89094C44Da98b954EedeAC495271d0F")
      console.log("result is ",feesNumber)
      console.log("whiteListed is ",whiteListed)
    }
    catch (error) {
      console.error('Error fetching fees:', error);
    }
    }

  }, [])

  const handleDelete = async (id) => {
    const index = orders.findIndex(order => order.id === id);
    const collection = orders[index].order_type + orders[index].crypto;
    try {
      const updatedOrders = [...orders];
      updatedOrders.splice(index, 1);
      setOrders(updatedOrders);

      await firestore().collection('Users').doc(username).update({
        orders: updatedOrders
      });
      await firestore().collection(collection).doc(id).delete();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  function createOrderNavigate(){
    /* navigation.navigate('Crear Publicación');
    setHideTab(true); */    
  }
  const fn = async () => {
    const keys = await getKeys()
    if (keys) {
      const { kms } = KeyManagementSystem.fromSerialized(
        keys,
        getCurrentChainId(),
      )
      /* console.log("nemonica: ",kms.mnemonic);
      console.log("kms: ",kms);
      const derivationPath = "m/44'/37310'/0'/0/0";
      const privateKey = kms.state.derivedPaths[derivationPath]
      console.log(`Private Key: ${privateKey}`); */
      setMnemonic(kms.mnemonic)
      console.log("chain id: ", getCurrentChainId())
    }
    const path = "m/44'/37310'/0'/0/0"
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

    console.log('Wallet: ', wallet);
    console.log('Wallet address: ', wallet.address);
    console.log('Private Key: ', wallet.privateKey);
  }

  const whitelistedERC20Token = async () => {
    try {
      console.log("getting mnemonic");
      let mnemonicPhrase = ""
      const keys = await getKeys()
      if (keys) {
        const { kms } = KeyManagementSystem.fromSerialized(
          keys,
          getCurrentChainId(),
        )
        mnemonicPhrase = kms.mnemonic
      }
      console.log(mnemonicPhrase);
      const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co');
      const path = "m/44'/37310'/0'/0/0";
      const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase, path)
      console.log('EOA ADDRESS:', wallet.address);

      const smartWalletFactory = new Contract(
        '0xbadb31caf5b95edd785446b76219b60fb1f07233',
        SmartWalletFactoryABI,
        provider,
      );
      const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress(
        wallet.address.toLowerCase(),
        '0x0000000000000000000000000000000000000000',
        0,
      );
      console.log('SMART WALLET ADDRESS:', smartWalletAddress);

      const smartWallet = new Contract(
        smartWalletAddress.toLowerCase(),
        smartWalletABI,
        wallet.connect(provider),
      );

      const myContract = new Contract("0xd83Be589F2622E6f311C886309A0629a18e36e22", abi, provider);
      const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      const whitelisted = true
      console.log("Estimating gas...");
      const estimatedGasLimit = await myContract.estimateGas.setWhitelistedERC20Token(tokenAddress, whitelisted);
      console.log("Estimated Gas Limit:", estimatedGasLimit.toString());

      console.log("Populating transaction...");
      const setWhitelistedERC20TokenData = myContract.interface.encodeFunctionData('setWhitelistedERC20Token', [
        tokenAddress, whitelisted,
      ]);
      const tx = await smartWallet.directExecute(
        "0xd83Be589F2622E6f311C886309A0629a18e36e22",
        setWhitelistedERC20TokenData,
        { gasLimit: estimatedGasLimit.mul(2) },
      );
  
      console.log("Waiting for transaction receipt...");
      const receipt = await tx.wait();
  
      console.log("Transaction successful:", receipt);
      
    } catch (err) {
      console.error("Transaction failed:", err);
    }
};

const hashAddress = () => {
  /* const hash =  ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address"], ["0x846c25707b92ab0652392c14f02961b27f825e66"])); //0xf1F6d9e134703993C2c68ABb45f109ba9Dd66BB5
  console.log("hash is ",hash) */

  const wallet = wallet
};

async function checkBalance() {  
  const balance = await wallet.getBalance();
  console.log(ethers.utils.formatEther(balance));
  //console.log(wallet.smartWalletAddress.toLowerCase());
}


function createWallet(){
  const randomMnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
  console.log("randomMnemonic is ",randomMnemonic)
  const newWallet = ethers.Wallet.fromMnemonic(randomMnemonic, "m/44'/37310'/0'/0/0");
  console.log("newWallet is ",newWallet)
  console.log("newWallet.address is ",newWallet.address)
  console.log("newWallet.mnemonic.phrase is ",newWallet.mnemonic.phrase)
  console.log("newWallet.privateKey is ",newWallet.privateKey)
  const checksumAddress = ethers.utils.getAddress(newWallet.address);
  console.log("checksumAddress is ",checksumAddress)
}
async function sendTX(){
  try{
    const walletaddress = "0x400190c784497f2eA6F5D31252c0a5167A7faF81"
    const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co", 31);
    const path = "m/44'/37310'/0'/0/0";
    const mnemonicPh = "bunker crew scrub patient fitness hat ginger undo neck monitor mule ball"
    const walletrsk = ethers.Wallet.fromMnemonic(mnemonicPh, path).connect(provider)
    console.log('EOA ADDRESS:', walletrsk.provider);
    console.log('EOA PRIVATE KEY:', walletrsk.privateKey);
    const address = "0x846C25707b92aB0652392c14F02961B27f825E66"
    const recipientAddress = address.toLowerCase()
    const chsad = ethers.utils.getAddress(recipientAddress);
    console.log(isValidChecksumAddress(chsad, 31));
    console.log("recipientAddress is ",chsad)
    const tx = {
      to: chsad,
      value: ethers.utils.parseEther("0.0003"),
    };
    const transactionResponse = await walletrsk.sendTransaction(tx);
    await transactionResponse.wait();
    console.log('Transaction Sent', `Hash: ${transactionResponse.hash}`);
  }
  catch(error){
    console.log("error is ",error)
  }
}

  return (
    <View style={styles.body}>
      {orders.length >=1 ? 
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
        {orders.sort((a, b) => a.price - b.price)
        .map((order, index) => (
          <AdCard key={order.id} username={order.username} price={order.price} total={order.total} crypto={order.crypto} order_type={order.order_type_for_self} onPressDelete={() => handleDelete(order.id)}/>
        ))}
        
      </ScrollView> : 
      
      <View style={styles.innerBody}>
        <Text style={styles.text}>No has publicado ninguna orden</Text>
      </View>
      
    }
    <AppButton
        accessibilityLabel={testIDs.newContact}
        onPress={() => sendTX()}
        style={styles.newContactButton}
        leftIcon={{
          name: "plus",
          size: 24,
        }}
        textColor={sharedColors.mainWhite}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex:1,
    backgroundColor: sharedColors.white,
  },
  innerBody:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    fontSize: 25,
    color: "#4FA0F8",
    fontFamily: "BalooTammudu"
  },
  newContactButton: castStyle.view({
    position: 'absolute',
    bottom: 30,
    right: 12,
    backgroundColor: "#7DC3F4",
    width: 60,
    height: 60,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  }),
})
