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
import { ethers } from "ethers";
import abi from "../../../shared/constants/ABI.json"
export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation()
  const { setHideTab } = useMarket();
  const username = "usuario 987"

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
      const whiteListed = await contract.isERC20Whitelisted("0x450bbc727100D806797CD617c88d1319563F8416")
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
    navigation.navigate('Crear Publicación');
    setHideTab(true);
    
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
})
