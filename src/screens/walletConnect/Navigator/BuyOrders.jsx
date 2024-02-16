import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from '../Components/AdCard';
import { useFocusEffect } from '@react-navigation/native';
import CoinSelector from '../Components/CoinSelector';
import firestore from '@react-native-firebase/firestore';
import dataArray from "../../../shared/constants/p2pCopy.json"

/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

export default function BuyOrders() {
    const [orders, setOrders] = useState/* <Order[]> */([])
    const [tipo, setTipo] = useState("DoC")

    useFocusEffect(
        React.useCallback(() => {
            tipo === "rBtc" & setTipo("DoC")
        }, [])
    );
    useEffect(() =>{
        const fetchData = async () => {
            try {
                  if(tipo == "DoC"){
                      const data = require('../../../shared/constants/p2p.json')
                      setOrders(data.results);
                  }else if(tipo == "rBtc"){
                      const data = require('../../../shared/constants/p2pCopy.json')
                      setOrders(data.results)
                  }
            } catch (error) {
                  console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [tipo])
    
    function handlePress(tipo){
        setTipo(tipo)
    }
    const productos = dataArray.results;
    
    return (
        <View style={styles.body}>
            <View  style={styles.buttonsHolder}>
                <CoinSelector type={tipo} function={handlePress}/>
            </View>

            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                {orders.sort((a, b) => a.price - b.price)
                .map((order, index) => (
                    <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={tipo}/>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: "#00000020",
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
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    button0: {
        borderEndWidth: 1,
        borderColor: "#00000070",
    },
    myAdsButton: {
        borderColor: "#00000070",
        borderStartWidth: 1,
    },
    text: {
        fontSize: 20,
        color: "#00000070"
    },
    activeText: {
        fontSize: 20,
        color: "#000000",
        fontWeight: "500"
    }
  })