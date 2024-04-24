import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import InputText from './InputText'
import ButtonCustom from './ButtonCustom'
import { useMarket } from '../MarketContext';


export default function SignUpScreen() {

  const { setLogged } = useMarket();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  /* const onSignIn = () => { setLogged(true)} */
  return (
    <ScrollView>
      <View style={styles.body}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <ButtonCustom  text="Resgistrarse con Google" type="primary" bgColor="tansparent" bdrColor="#737781" fgColor="#0a3f7a" image="google"/>
        <Text style={styles.subtitle}>O registrarse con un correo electrónico</Text>
        <InputText placeholder="Correo electrónico" value={email} setValue={setEmail}/>
        <InputText placeholder="Contraseña" value={password} setValue={setPassword} hidden={true}/>
        <InputText placeholder="Repetir contraseña" value={repeatPassword} setValue={setRepeatPassword} hidden={true}/>
        <ButtonCustom  text="Crear cuenta" type="secondary" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  body:{
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "#f9f9ff",
  },
  title:{
    marginTop: 10,
    fontSize: 22,
    fontFamily: "BalooTammudu",
    fontWeight: "400",
    color: "#0A3F7A",
    paddingVertical: 6,
  },
  subtitle:{
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    color: "#464D51",
    paddingVertical: 6,
  },
})