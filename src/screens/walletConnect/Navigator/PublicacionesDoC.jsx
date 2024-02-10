import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from './AdCard';
import { useFocusEffect } from '@react-navigation/native';

/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

export default function PublicacionesDoc() {
    const [orders, setOrders] = useState/* <Order[]> */([])
    const [tipo, setTipo] = useState("compra")

    useFocusEffect(
        React.useCallback(() => {
            tipo === "venta" & setTipo("compra")
        }, [])
    );
    useEffect(() =>{
        const fetchData = async () => {
            try {
                  if(tipo == "compra"){
                      const data = require('../../../shared/constants/p2p.json')
                      setOrders(data.results);
                  }else if(tipo == "venta"){
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

    return (
        <View style={styles.body}>
            <View  style={styles.buttonsHolder}>
                <Pressable style={[styles.button, styles.button0]} onPress={() => {handlePress("compra")}}>
                    <Text style={tipo === "compra" ? styles.activeText : styles.text}>Comprar</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => {handlePress("venta")}}>
                    <Text style={tipo === "venta" ? styles.activeText : styles.text}>Vender</Text>
                </Pressable>
            </View>
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                {orders.sort((a, b) => a.price - b.price)
                .map((order, index) => (
                    <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={"DoC"}/>
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
        width: 100,
        height: 40,
        justifyContent: "center",
        marginVertical: 10
    },
    button0: {
        borderEndWidth: 1,
        borderColor: "#00000070"
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