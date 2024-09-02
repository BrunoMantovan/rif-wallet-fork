import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function ButtonCustom(props) {
    const googleLogo = require("../../../../assets/images/GoogleLogo.png")

    const imageSource = props.image == "google" ? googleLogo : null;
    
    


  return (
    <TouchableOpacity activeOpacity={props.activeOpacity ? props.activeOpacity : 0.5} style={[styles.container, props.borderColor ? {borderColor: props.borderColor, borderWidth: 1} : {}, {width: props.width}, styles[`container_${props.type}`], ]} onPress={props.onPress}>
        {imageSource && <Image source={imageSource} style={{marginRight: 8,}}/>}
        <Text style={[styles.text, styles[`text_${props.type}`], props.fgColor ? {color: props.fgColor} : {}]}>{props.text}</Text>
        {props.icon ? 
        <FontAwesome5Icon
            name={props.icon}
            size={20}
            color={props.color ? props.color : sharedColors.white}
            style={{paddingLeft: 8}}
        /> : null}
        
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
        flexDirection: "row",
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
    container_green:{
        backgroundColor: sharedColors.bagreen
    },
    container_disabled:{
        backgroundColor: "#1D1B201F"
    },
    text:{
        fontWeight: "bold",
        fontSize: 18,
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
    text_green:{
        color: "#FFFFFF",
    },
})