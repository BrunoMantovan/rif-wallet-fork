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
      color: "black",
      fontWeight: "800",
      paddingHorizontal: "5%",
      marginVertical: 15,
    },
  })