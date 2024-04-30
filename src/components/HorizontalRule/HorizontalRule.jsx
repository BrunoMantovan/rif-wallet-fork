import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'

export default function HorizontalRule() {
  return (
    <View style={{borderBottomColor: sharedColors.borderColor, marginVertical: 10, borderBottomWidth: 1, width: "100%"}}>
      
    </View>
  )
}