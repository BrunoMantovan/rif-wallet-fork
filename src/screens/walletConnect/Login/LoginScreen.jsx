import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import InputText from './InputText'
import ButtonCustom from './ButtonCustom'
import { useMarket } from '../MarketContext';


export default function LoginScreen() {

  const { setLogged } = useMarket();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const onSignIn = () => { setLogged(true)}
  return (
    <View style={styles.body}>
      <InputText placeholder="username" value={username} setValue={setUsername}/>
      <InputText placeholder="password" value={password} setValue={setPassword} hidden={true} />
      <ButtonCustom onPress={onSignIn} text="Iniciar sesion" type="primary" />
      <ButtonCustom onPress={onSignIn} text="Olvidé mi contraseña" type="tertiary" />
    </View>
  )
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        paddingHorizontal: "5%",
        backgroundColor: "#19A3FF30",
        justifyContent: "center",
    }
})