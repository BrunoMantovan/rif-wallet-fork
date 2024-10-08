import "@ethersproject/shims"
import { View, StyleSheet, RefreshControl, ScrollView, Text, Pressable, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import AdCard from '../Components/AdCard';
import ButtonCustom from '../Login/ButtonCustom';
import { sharedColors, testIDs } from 'src/shared/constants';
import { AppButton, LoadingScreen } from 'src/components';
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
import AddTokenButton from "./Dispatch";

import { keccak256 } from "ethers/lib/utils";
import { P2PMarketplaceAPIClient} from "src/baApi";

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation()
  const { setHideTab, username } = useMarket();
  const [mnemonic, setMnemonic] = useState("")

  const { wallet, walletIsDeployed } = useWalletState()
  const BASE_URL = 'https://bolsillo-argento-586dfd80364d.herokuapp.com';
  const client = new P2PMarketplaceAPIClient(BASE_URL);
  const [status, setStatus] = useState(["PENDING"]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHideTab(false)
      async function testCreateUser() {
        setLoading(true);
        const smartWalletAddress = wallet.smartWalletAddress
        console.log(smartWalletAddress);
        
        const user = {
          username: username
        }
        console.log("user", user);
        
        const response = await client.createUser(user);
        console.log(response);
        

        const ordersFetch = await client.getOrders({ status: [status], user:response.id});  
        console.log("orders", ordersFetch);
        
        setOrders(ordersFetch.orders)
        setLoading(false);
      }
      testCreateUser()
    }, [status])
  );
  
  const handleDelete = async (id) => {
    client.deleteOrder(id);
  };

  function createOrderNavigate(){
    navigation.navigate('Crear Publicación');
    setHideTab(true);    
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

  return (
    <View style={styles.body}>
        <View style={{height:40, width: "100%", flexDirection: "row", marginBottom: 24}}>
          <Pressable onPress={()=> setStatus(["PENDING"])} style={[styles.orderSelector, status[0] === "PENDING" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, status[0] === "PENDING" ? styles.selectedText : null]}>Pendientes</Text>
          </Pressable>
          <Pressable onPress={()=> setStatus(['ACTIVE', 'FIAT_SENT', 'WAITING_PAYMENT'])} style={[styles.orderSelector, status[0] === "ACTIVE" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, status[0] === "ACTIVE" ? styles.selectedText : null]}>Activas</Text>
          </Pressable>
          <Pressable onPress={()=> setStatus(['COMPLETED_BY_ADMIN', 'CANCELED_BY_ADMIN', 'RELEASED' ])} style={[styles.orderSelector, status[0] === "COMPLETED_BY_ADMIN" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8,borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, status[0] === "COMPLETED_BY_ADMIN" ? styles.selectedText : null]}>Finalizadas</Text>
          </Pressable>
        </View>
      {loading ? <LoadingScreen/> : orders ? 
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
        {orders.sort((a, b) => a.price - b.price)
        .map((order, index) => (
          <AdCard key={order.id} username={order.id} price={order.fiatAmount/order.amount} total={order.amount} crypto={order.tokenCode} order_type={order.type == "SELL" ? "Vender" : "Comprar"} onPressDelete={() => handleDelete(order.id)} onPress={() => navigation.navigate('OrderTaken', { takeOrderRequest: { orderId: order.id } })} status={order.status} />
        ))}
        
      </ScrollView> : 
      
      <View style={styles.innerBody}>
        <Text style={styles.text}> {status[0] === "PENDING" ? "No has publicado ninguna orden" : status[0] === "ACTIVE" ? "No hay ordenes activas" : "No hay ordenes finalizadas"}</Text>
      </View>
    }
    <AppButton
        accessibilityLabel={testIDs.newContact}
        onPress={() => createOrderNavigate()}
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
  orderSelector:{
    height: 40,
    width: "33%",
    backgroundColor: "transparent",
    borderColor: "#D2E6F799",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8
  },
  orderText:{
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    color: "#727F9E",
  },
  selectedOrder: {
    backgroundColor: "#D2E6F7",
  },
  selectedText:{
    color: sharedColors.bablue,
  },
})
