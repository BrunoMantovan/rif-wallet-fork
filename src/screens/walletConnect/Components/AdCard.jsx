import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'

export default function AdCard(props) {
    const cryptoTotal = (props.total / props.price).toFixed(2)
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.card} onPress={props.onPress}>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.user}>{props.username}</Text>
            <TouchableOpacity style={{alignItems: "center", justifyContent: "center", display: props.display}}>
                <Text style={{fontWeight:"600"}}>Eliminar</Text>
            </TouchableOpacity>
        </View>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View>
                <Text style={styles.price}>${props.price} <Text style={{fontSize: 15}}>ARS</Text></Text>
                <Text style={styles.total}><Text style={styles.user}>Límite:</Text> {props.orderType == "comprar" ? " $" + props.total : props.total * props.price} <Text style={styles.user}>ARS</Text></Text>
                <Text style={styles.cryptoTotal}><Text style={styles.user}>Cantidad cripto:</Text> {props.orderType == "vender" ? props.total : cryptoTotal} {props.crypto}</Text>
            </View>
            <View style={[styles.buysellbtn, {backgroundColor: props.orderType == "comprar" ? "#0ecb81" : "#f6465d"}]}>
                <Text style={{color: "#fef6ff", fontSize: 16, fontWeight:"600"}}>{props.orderType}</Text>
            </View>
        </View>
        
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    card:{
        width: "100%",
        marginVertical:10,
        backgroundColor: "#19A3FF30",
        paddingHorizontal: 30,
        borderRadius: 20,
        justifyContent:"space-between",
        paddingVertical: 10,
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
    cryptoTotal:{
        fontSize: 15,
        color: "#003D66",
        fontWeight: "700"
    },
    buysellbtn:{
        width: 90,
        height: 35,
        borderRadius: 6,
        justifyContent: "center",
        alignItems:"center",
    },
})