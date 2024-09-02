import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'

export default function Dropdown(props) {
  return (
    <Pressable style={[styles.dropdown, props.width ? {width: props.width} : {}, props.right ? {borderBottomRightRadius: 0, borderTopRightRadius: 0} : {}]} onPress={props.onPress}>
      {props.image && <Image source={props.image} style={styles.image}/>}
      <Text>{props.placeholder}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    dropdown:{
      width: "100%",
      height: 56,
      backgroundColor: "white",
      borderColor: "#D2E6F799",
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 16,
      marginVertical: 16,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
    },
    image: {
      width: 24,
      height: 24,
      marginRight: 12,
    },
  })