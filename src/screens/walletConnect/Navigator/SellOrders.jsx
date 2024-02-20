import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from '../Components/AdCard';
import { useFocusEffect } from '@react-navigation/native';
import CoinSelector from '../Components/CoinSelector';
import firestore from '@react-native-firebase/firestore';


/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

  export default function SellOrders() {
    const [orders, setOrders] = useState/* <Order[]> */([])
    const [tipo, setTipo] = useState("DoC")

    useFocusEffect(
        React.useCallback(() => {
            tipo === "rBtc" & setTipo("DoC")
        }, [])
    );
    useEffect(() =>{
        const fetchData = async () => {
            const collection = "sell" + tipo
            try {
                const querySnapshot = await firestore().collection(collection).get();
                const orderData = [];
                querySnapshot.forEach((doc) => {
                    // Extract data from each document and add it to the array
                    orderData.push(doc.data());
                });
                setOrders(orderData);

            } catch (error) {
              console.error('Error fetching orders:', error);
            }
        };
    
        fetchData();
    }, [tipo])
    
    function handlePress(tipo){
        setTipo(tipo)
    }

    return (
        <View style={styles.body}>
            <View  style={styles.buttonsHolder}>
            <CoinSelector type={tipo} function={handlePress}/>
            </View>
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                {orders.sort((a, b) => a.price - b.price)
                .map((order, index) => (
                    <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={order.crypto} orderType={order.orderType}/>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: "#00000005",
        paddingHorizontal: "5%",
    },
    scrollView:{
        flex:1,
    },
    buttonsHolder: {
        width: "100%",
        flexDirection: "row",
       
    },
    button: {
        paddingHorizontal: 10,
        height: 50,
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
    },
    activeText: {
        fontSize: 20,
        color: "#000000",
        fontWeight: "500"
    }
  })