import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from '../Components/AdCard';
import { useFocusEffect } from '@react-navigation/native';
import CoinSelector from '../Components/CoinSelector';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useMarket } from '../MarketContext';
import { sharedColors } from 'src/shared/constants';

/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

  export default function SellOrders({route}) {
    const {search} = route.params 
    const [orders, setOrders] = useState/* <Order[]> */([])
    const navigation = useNavigation()
    const { setHideTab } = useMarket();

    useEffect(() =>{
        const fetchData = async () => {
            const collection = search.type + search.crypto
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
    }, [])
    
    function handlePress(tipo){
        setTipo(tipo)
    }

    const handleCardPress = (order) => {
        navigation.navigate('OrderDetails', {order})
        setHideTab(true)
    } 

    return (
        <View style={styles.body}>
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                {orders.sort((a, b) => a.price - b.price)
                .map((order, index) => (
                    <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={order.crypto} orderType={order.orderType} onPress={() => handleCardPress(order)} display={"none"}/>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: sharedColors.mainWhite,
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
  })