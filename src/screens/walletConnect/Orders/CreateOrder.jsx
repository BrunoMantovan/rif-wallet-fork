import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import InputText from '../Login/InputText'
import SelectDropdown from 'react-native-select-dropdown'
import ButtonCustom from '../Login/ButtonCustom'
import Title from '../Components/Title'
import firestore from '@react-native-firebase/firestore';

export default function CreateOrder() {

  const [price, setPrice] = useState()
  const [type, setType] = useState(null)
  const [crypto, setCrypto] = useState(null)
  const [total, setTotal] = useState()

  const username = "usuario 987"
  const cryptos = ["DoC", "rBtc"]
  const orderTypes = ["vender", "comprar"]
  function hola(){
    const num1 = parseFloat(num);
  }

  const handleNumberChange = (inputValue, input) => {
    if(input == 1){
      const sanitizedValue = inputValue.replace(/,/g, '.');
      setPrice(sanitizedValue);
    }else if(input == 2){
      const sanitizedValue = inputValue.replace(/,/g, '.');
      setTotal(sanitizedValue);
    }
  };

  function handleSubmit(){
    const order = {
      price: price,
      total: total,
      crypto: crypto,
      username: username,
      orderType: type,
    }

    firestore()
    .collection('Users')
    .doc(username)
    .update({
      orders: firestore.FieldValue.arrayUnion(order) // Add the new order to the orders array
    })

    const collection = type == "comprar" ? "buy" + crypto : "sell" + crypto
    firestore()
    .collection(collection)
    .add(order);
  }

  return (
    <View style={styles.body}>
      <Title title="Crear una orden"/>
      <View style={{height:100, width: "100%",}}>
        <Text style={styles.subtitle}>Tipo de orden</Text>
        <SelectDropdown data={orderTypes} onSelect={(e)=> setType(e)} buttonStyle={styles.dropdown} dropdownStyle={{borderColor: "#e8e8e8", borderRadius: 5,}} defaultButtonText="Elija una..."buttonTextStyle={{textAlign:"left", fontSize: 19}} rowTextStyle={{textAlign:"left"}}/>
      </View>
      
      <View style={styles.wrapper}>
        <View style={{height:100, width: "50%", paddingRight: "2%"}}>
          <Text style={styles.subtitle}>Criptomoneda</Text>
          <SelectDropdown data={cryptos} onSelect={(e)=> setCrypto(e)} buttonStyle={styles.dropdown} dropdownStyle={{borderColor: "#e8e8e8", borderRadius: 5,}} defaultButtonText="Elija una..." buttonTextStyle={{textAlign:"left", fontSize: 19}} rowTextStyle={{textAlign:"left"}}/>
        </View>
        <View style={{height:100, width: "50%", paddingLeft: "2%"}}>
          <Text style={styles.subtitle}>Precio</Text>
          <InputText value={price} setValue={(value) => handleNumberChange(value, 1)} placeholder="precio" keyboard="numeric" style={styles.input}/>
        </View>
      </View>

      <View style={{height:100, width: "100%"}}>
        <Text style={styles.subtitle}>Total {type && crypto ? type == "comprar" ? "de ARS para comprar" : "de " + crypto + " para vender" : ""}</Text>
        <InputText value={total} setValue={(value) => handleNumberChange(value, 2)} placeholder="precio" keyboard="numeric"/>
      </View>
      <ButtonCustom onPress={handleSubmit} text="Publicar Orden" type="primary" />
    </View>
  )
}


const styles = StyleSheet.create({
  body:{
    paddingHorizontal: "5%",
    backgroundColor: "#00000005",
  },
  subtitle:{
    fontSize: 16,
    color: "black",
    fontWeight: "700",
  },
  dropdown:{
    width: "100%",
    backgroundColor: "white",
    borderColor: "#e8e8e8",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  wrapper:{
    flexDirection: "row"
  },
})