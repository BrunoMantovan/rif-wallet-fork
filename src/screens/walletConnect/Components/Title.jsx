import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Title(props) {
  return (
    <Text style={styles.title}>{props.title}</Text>
  )
}

const styles = StyleSheet.create({
  title:{
    fontSize: 25,
    color: "#0A3F7A",
    fontWeight: "800",
    marginVertical: "11%",
    fontFamily: "Roboto-Medium",
    alignSelf: "flex-start",
    fontWeight: "900"
  },
})