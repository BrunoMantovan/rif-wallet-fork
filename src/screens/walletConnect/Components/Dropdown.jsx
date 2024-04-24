import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'

export default function Dropdown(props) {
  return (
    <View>
      <SelectDropdown data={props.data} onSelect={props.function} buttonStyle={styles.dropdown} dropdownStyle={{borderColor: "#e8e8e8", borderBottomStartRadius: 16, borderBottomEndRadius: 16}} defaultButtonText={props.placeholder} buttonTextStyle={{textAlign:"left", fontSize: 19, color: "#8C9094", letterSpacing: 0.25, lineHeight: 20}} rowTextStyle={{textAlign:"left"}  }/>
    </View>
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
    },
  })