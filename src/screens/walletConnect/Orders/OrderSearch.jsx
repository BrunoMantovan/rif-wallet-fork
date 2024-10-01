import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from '../Components/AdCard';
import { useFocusEffect } from '@react-navigation/native';
import CoinSelector from '../Components/CoinSelector';
import firestore from '@react-native-firebase/firestore';
import { useNavigation} from '@react-navigation/native';
import { useMarket } from '../MarketContext';
import { sharedColors } from 'src/shared/constants';
import { LoadingScreen } from 'src/components/loading/LoadingScreen';
import { BolsilloArgentoAPIClient } from 'src/baApi';

/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

  export default function OrderSearch({route}) {
    
    const BASE_URL = "https://bolsillo-argento-586dfd80364d.herokuapp.com";
    const client = new BolsilloArgentoAPIClient(BASE_URL);

    const [orders, setOrders] = useState/* <Order[]> */(null)
    const navigation = useNavigation()
    const { setHideTab } = useMarket();
    const {search} = route.params
    
    useEffect(() =>{
        async function getOrders() {
            const response = await client.getOrders({ status: ['PENDING'] });
            const type = search.type == "Vender" ? "BUY" : "SELL"
            setOrders(response.orders);
        }
        getOrders()
    }, [search])
    
    function handlePress(tipo){
        setTipo(tipo)
    }

    const handleCardPress = (order) => {
        navigation.navigate('OrderDetails', {order})
        setHideTab(true)
    } 

    return (
        orders ?    <View style={styles.body}>
                        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                            {orders
                            .sort((a, b) => a.price - b.price)
                            .map((order, index) => (
                                <AdCard key={order.id} username={order.username} price={order.fiatAmount/order.amount} total={order.amount} crypto={order.tokenCode} order_type={order.type} onPress={() => handleCardPress(order)} display={"none"}/>
                            ))}
                        </ScrollView>
                    </View>
        : <LoadingScreen/> 
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