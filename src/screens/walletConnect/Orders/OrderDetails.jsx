import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputText from '../Login/InputText'
import SelectDropdown from 'react-native-select-dropdown'


export default function OrderDetails({route, navigation}) {

  const {order} = route.params 
  parseFloat(order.price, order.total)
  const [cantidad, setCantidad] = useState()
  const metodosDePago = ["Mercadopago"]
  const [payment, setPayment] = useState("")
  return (
    <View style={styles.container}>
      <Text>Precio: ARS${order.price}</Text>
      <View style={styles.card}>
        <InputText placeholder="Cantidad a comerciar" value={cantidad} setValue={setCantidad} keyboard="numeric"/>
        <Text>Límite: ARS${order.total}</Text>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <SelectDropdown data={metodosDePago} onSelect={(e)=> setPayment(e)} buttonStyle={styles.dropdown} dropdownStyle={{borderColor: "#e8e8e8", borderRadius: 5,}} defaultButtonText="Metodo de pago" buttonTextStyle={{textAlign:"left", fontSize: 19}} rowTextStyle={{textAlign:"left"}}/>
          <TouchableOpacity style={{width: 50, height: 50,backgroundColor: "white", borderColor: "#e8e8e8", borderRadius: 5, borderWidth: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize:35, fontWeight: "900",}}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: "5%"
  },
  card: {
    
  },
  dropdown:{
    width: "85%",
    backgroundColor: "white",
    borderColor: "#e8e8e8",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
})