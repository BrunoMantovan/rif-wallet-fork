import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function ButtonCustom(props) {
  return (
    <Pressable style={[styles.container, styles[`container_${props.type}`]]} onPress={props.onPress}>
      <Text style={[styles.text, styles[`text_${props.type}`]]}>{props.text}</Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({
    container:{
        width: "100%",
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    container_primary:{
        backgroundColor: "#3b71f3"
    },
    container_tertiary:{
        backgroundColor: "transparent"
    },
    text:{
        fontWeight: "bold",
        fontSize: 18,
    },
    text_primary:{
        color: "white",
    },
    text_tertiary:{
        color: "gray",
    },
})