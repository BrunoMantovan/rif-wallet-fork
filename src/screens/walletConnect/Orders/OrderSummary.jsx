import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../Login/ButtonCustom'
import firestore from '@react-native-firebase/firestore';

export default function OrderSummary({route, navigation}) {

  const {order} = route.params
  const username = "usuario 987"
  

  const newOrder = {
    price: order.price,
    crypto: order.crypto,
    username: order.username,
    orderType: order.orderType,
    total: order.total,
    minAmm: order.minAmm,
    maxAmm: order.maxAmm,
    orderTypeForSelf: order.orderTypeForSelf,
    paymentMethod: order.paymentMethod
  }

  function handleSubmit(){
    firestore()
    .collection('Users')
    .doc(username)
    .update({
      orders: firestore.FieldValue.arrayUnion(newOrder) // Add the new order to the orders array
    })

    const collection = order.orderType + order.crypto
    firestore()
    .collection(collection)
    .add(newOrder);
    navigation.navigate('MyOrders')
  }

  return (
    <View style={{padding: 16, flex: 1}}>
      <Text style={styles.text}>Tipo de operación: <Text style={styles.innetText}>{order.orderTypeForSelf}</Text></Text>
      <Text style={styles.text}>Crypto: <Text style={styles.innetText}>{order.crypto}</Text></Text>
      <Text style={styles.text}>Moneda de {order.orderTypeForSelf == "Comprar" ? "compra" : "cobro"}: <Text style={styles.innetText}>ARS</Text></Text>
      <Text style={styles.text}>Precio unitario: <Text style={styles.innetText}>${order.price}</Text></Text>
      <Text style={styles.text}>Cantidad total: <Text style={styles.innetText}>{order.total} {order.crypto}</Text></Text>
      <Text style={styles.text}>Cantidad mínima por transacción: <Text style={styles.innetText}>{order.minAmm} {order.crypto}</Text></Text>
      <Text style={styles.text}>Cantidad máxima por transacción: <Text style={styles.innetText}>{order.maxAmm} {order.crypto}</Text></Text>
      <Text style={styles.text}>Método de pago: <Text style={styles.innetText}>{order.paymentMethod.text}</Text></Text>
      <View style={{flex: 1, justifyContent: "flex-end"}}><ButtonCustom onPress={()=> handleSubmit()} text="Publicar" type="green"/></View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Robot-Medium",
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 14,
    color: sharedColors.inputText,
    marginVertical: 12,
    padding: 4,
    justifyContent: "center"
  },
  innetText: {
    fontFamily: "Robot-Medium",
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 14,
    color: sharedColors.inputText,
    backgroundColor: "#E8E8E9",
    color: "#5B6369",
    padding: 50
  }
})