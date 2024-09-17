import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'

export default function AdCard(props) {
    const cryptoTotal = (props.total * props.price)
    const numberFormatOptions = {
        // Specify the dot as the thousands separator
        useGrouping: true,
        maximumFractionDigits: 2, // Optional: specify the maximum number of fraction digits
    };

    const formatNumberWithDots = (number) => {
        // Convert the number to a string
        let numString = number.toString();
        // Split the string into integer and decimal parts
        const [integerPart, decimalPart] = numString.split('.');
        // Add commas to the integer part (thousands separator)
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        // Return the formatted number with optional decimal part
        return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
    };

  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.card} onPress={props.onPress}>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            {/* <Text style={styles.user}>{props.username}</Text> */}
            <Text style={styles.price}>${props.price.toLocaleString('es-AR', numberFormatOptions)} <Text style={{fontSize: 15}}>ARS</Text></Text>
            <TouchableOpacity onPress={props.onPressDelete} style={{alignItems: "center", justifyContent: "center", display: props.display}}>
                <Text style={{fontWeight:"600"}}>Eliminar</Text>
            </TouchableOpacity>
        </View>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
            <View>
                <Text style={styles.limitsNum}><Text style={styles.limitsTxt}>Límite</Text> {props.order_type == "Comprar" ? formatNumberWithDots(props.total) : "$" + formatNumberWithDots(props.total * props.price)} <Text style={styles.user}>{props.order_type == "Comprar" ? props.crypto : "ARS"}</Text></Text>
                <Text style={styles.limitsNum}><Text style={styles.limitsTxt}>Disponible</Text> {props.order_type == "Vender" ? props.total + props.crypto : formatNumberWithDots(cryptoTotal) + " ARS"}</Text>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={styles.payMethods}>
                        <Text>Transferencia</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buysellbtn}>
                <Text style={styles.buyselltxt}>{props.order_type + " " + props.crypto}</Text>
            </View>
        </View>
        
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    card:{
        width: "100%",
        marginVertical: 8,
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        justifyContent:"space-between",
    },
    price:{
        fontSize: 16,
        color: "#1b1e1e",
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    user:{
        fontSize: 14,
        color: "#464d51",
        fontFamily: "Roboto-Medium",
        fontWeight: "400",
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    limitsTxt:{
        fontSize: 14,
        color: "#7c7c7c",
        fontFamily:"Robot-Medium",
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    limitsNum:{
        fontSize: 16,
        color: "#1b1e1e",
        fontFamily:"Robot-Medium",
        fontWeight: "400",
        letterSpacing: 0.4,
        lineHeight: 16,
        marginTop: 8,
    },
    buysellbtn:{
        minWidth: 110,
        height: 24,
        borderRadius: 100,
        justifyContent: "center",
        alignItems:"center",
        backgroundColor: "#b7cd49",
    },
    buyselltxt:{
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily:"Roboto-Medium",
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    payMethods:{
        backgroundColor: "#F4F4F4",
        padding: 4,
        color: "#5B6369",
        fontSize: 8,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
        marginTop: 8,
        borderRadius: 4,
    },
})