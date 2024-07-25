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
    const mnemonic = "bunker crew scrub patient fitness hat ginger undo neck monitor mule ball";
    const hdPath = "m/44'/37310'/0'/0/0";
    
    // Derive the wallet
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, hdPath);

    // Connect to the RSK testnet
    const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co", 31);
    
    // Create a signer
    const signer = wallet.connect(provider);

    const contract = new ethers.Contract('0xa4aE638eF492792A9a758935df99052dae317A34', abi, signer);
    const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const flag = false;

    try {
      console.log("tx started");
      const tx = await contract.setWhitelistedERC20Token(tokenAddress, flag);
      console.log('Transaction hash:', tx.hash);
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction was mined in block:', receipt.blockNumber, "tx: ", receipt);
    } catch (error) {
      console.error('Error while setting whitelisted token:', error);
    }
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
      const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
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
/*   const balance = await wallet.getBalance();
  console.log(ethers.utils.formatEther(balance));
  //console.log(wallet.smartWalletAddress.toLowerCase()); */
  const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co", 31);

  const contract = new ethers.Contract('0xd83Be589F2622E6f311C886309A0629a18e36e22', abi, provider);
  console.log("function called");
  const ownerAddress = await contract.owner();
  console.log('Contract owner address:', ownerAddress);
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
    const address = "0x4210cbC7424A8B809316c1f53dd2564e5320eb88"
    const recipientAddress = address.toLowerCase()
    const chsad = ethers.utils.getAddress(recipientAddress);
    console.log(isValidChecksumAddress(chsad, 31));
    console.log("recipientAddress is ",chsad)
    const tx = {
      to: chsad,
      value: ethers.utils.parseEther("0.03"),
    };
    const transactionResponse = await walletrsk.sendTransaction(tx);
    await transactionResponse.wait();
    console.log('Transaction Sent', `Hash: ${transactionResponse.hash}`);
  }
  catch(error){
    console.log("error is ",error)
  }
}

const callContractMethod = async () => {
  const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co");
  try {
    const keys = await getKeys()
    if (keys) {
      const { kms } = KeyManagementSystem.fromSerialized(
        keys,
        getCurrentChainId(),
      )
      setMnemonic(kms.mnemonic)
      console.log("chain id: ", getCurrentChainId())
    }
    const path = "m/44'/37310'/0'/0/0"
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    const signer = new ethers.Wallet(wallet.privateKey, provider);
    const contractAddress = '0xd83Be589F2622E6f311C886309A0629a18e36e22';
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("contract is ",contract)
    const tx = await contract.setWhitelistedERC20Token("0xdAC17F958D2ee523a2206206994597C13D831ec7", true, {
      gasLimit: ethers.utils.hexlify(100000),
    });

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
  } catch (error) {
      console.error('Error calling contract method:', error);
  }
};




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
