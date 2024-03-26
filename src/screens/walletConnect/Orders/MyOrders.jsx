import { View, Text, StyleSheet, RefreshControl, ScrollView, } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import AdCard from '../Components/AdCard';
import CreateOrder from './CreateOrder';
import ButtonCustom from '../Login/ButtonCustom';

export default function MyOrders() {
  const [orders, setOrders] = useState([])

  const username = "usuario 987"

  useFocusEffect(
    React.useCallback(() => {
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

  return (
    <View style={styles.body}>
      {orders.length >=1 ? 
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
        {orders.sort((a, b) => a.price - b.price)
        .map((order, index) => (
          <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={order.tipo} orderType={order.orderType}/>
        ))}
      </ScrollView> : 
      /* <View style={styles.innerBody}>
        <Text style={styles.text}>No tienes ninguna orden activa</Text>
        <ButtonCustom type="tertiary" text="Crear una orden"/>
      </View> */

      <CreateOrder/>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex:1,
    backgroundColor: "#00000005",
    paddingHorizontal: "5%",
  },
  innerBody:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "25%"
  },
  text:{
    fontSize: 25,
    color: "#4FA0F8",
    fontWeight: 500
  }
})
