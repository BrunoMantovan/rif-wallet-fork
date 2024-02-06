import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'

export default function AdCard(props) {
    const usdtTotal = (props.total / props.price).toFixed(2)
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.card}>
        <Text style={styles.user}>{props.username}</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.price}>${props.price} <Text style={{fontSize: 15}}>ARS</Text></Text>
            <Text style={styles.total}>${props.total} <Text style={styles.user}>ARS</Text></Text>
        </View>
        <Text style={styles.usdtTotal}>{usdtTotal} DoC</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    card:{
        width: "100%",
        height: 100,
        marginBottom:20,
        backgroundColor: "#19A3FF",
        padding: 10,
        borderRadius: 20
    },
    price:{
        fontSize: 23,
        color: "#001E33",
        fontWeight: "800"
    },
    user:{
        fontSize: 13,
        color: "#003D66",
        fontWeight: "600"
    },
    total:{
        fontSize: 15,
        color: "#003D66",
        fontWeight: "600"
    },
    usdtTotal:{
        fontSize: 15,
        color: "#003D66",
        fontWeight: "600"
    }
})