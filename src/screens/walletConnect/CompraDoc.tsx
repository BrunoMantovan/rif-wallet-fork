import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from './AdCard';



interface Order {
    username: string;
    price: number;
    total: number;
  }

export default function CompraDoc() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = require('../../shared/constants/p2p.json');
          
          setOrders(data.results);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
            <ScrollView style={styles.body}>
                {orders.sort((a, b) => a.price - b.price)
                .map((order, index) => (
                    <AdCard key={index} username={order.username} price={order.price} total={order.total} />
                ))}

            </ScrollView>
    )
}

const styles = StyleSheet.create({
    body:{
      flex:1,
      backgroundColor: "#ffff",
      paddingHorizontal: "5%",
      paddingTop: "10%",
    },
  })