import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function ButtonCustom(props) {
    const googleLogo = require("../../../../assets/images/GoogleLogo.png")

    const imageSource = props.image == "google" ? googleLogo : null;
    
    


  return (
    <TouchableOpacity activeOpacity={0.5} style={[styles.container, styles[`container_${props.type}`], props.bgColor ? {backgroundColor: props.bgColor, borderWidth: 1, borderColor: props.bdrColor} : {}]} onPress={props.onPress}>
        {imageSource && <Image source={imageSource} style={{marginRight: 8,}}/>}
        <Text style={[styles.text, styles[`text_${props.type}`], props.fgColor ? {color: props.fgColor} : {}]}>{props.text}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    container:{
        width: "100%",
        padding: 15,
        marginVertical: 16,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    container_primary:{
        backgroundColor: "#7DC3F4"
    },
    container_secondary:{
        backgroundColor: "#0A3F7A"
    },
    container_tertiary:{
        backgroundColor: "transparent"
    },
    text:{
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
    },
    text_primary:{
        color: "#00324A",
    },
    text_secondary:{
        color: "#FFFFFF",
    },
    text_tertiary:{
        color: "gray",
    },
})