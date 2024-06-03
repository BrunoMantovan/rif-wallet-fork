import { View, Text, StyleSheet, TextInput, } from 'react-native'
import React from 'react'

export default function InputText(props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={props.setValue}
        value={props.value}
        placeholder={props.placeholder}
        secureTextEntry={props.hidden}
        keyboardType={props.keyboard}
        maxLength={props.maxLength}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "white",
    width: "100%",
    height: 56,
    borderColor: "#e8e8e8",
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    paddingLeft: 16,
    marginVertical: 12,
  },
  input:{
    fontSize: 18
  }
})