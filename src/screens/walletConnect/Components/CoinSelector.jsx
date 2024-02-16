import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function CoinSelector(props) {
  return (
    <View  style={styles.buttonsHolder}>
        <Pressable style={[styles.button, styles.button0]} onPress={() => {props.function("DoC")}}>
            <Text style={props.type === "DoC" ? styles.activeText : styles.text}>DoC</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {props.function("rBtc")}}>
            <Text style={props.type === "rBtc" ? styles.activeText : styles.text}>rBtc</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
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