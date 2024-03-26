import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import InputText from './InputText'
import ButtonCustom from './ButtonCustom'
import { useMarket } from '../MarketContext';


export default function LoginScreen() {

  const { setLogged } = useMarket();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const onSignIn = () => { setLogged(true)}
  return (
    <ScrollView>
      <View style={styles.body}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Image source={require('../../../../assets/images/Group.png')} style={{alignSelf: "center", marginBottom: "30%"}}/>
        <InputText placeholder="Correo electrónico" value={email} setValue={setEmail}/>
        <InputText placeholder="password" value={password} setValue={setPassword} hidden={true} />
        <ButtonCustom onPress={onSignIn} text="Iniciar sesión" type="primary" />
        <ButtonCustom onPress={onSignIn} text="Crear cuenta" type="secondary" />
        <ButtonCustom  text="Iniciar sesión con Google" type="primary" bgColor="tansparent" bdrColor="#737781" fgColor="#0a3f7a" image="google"/>
        <ButtonCustom onPress={onSignIn} text="Olvidé mi contraseña" type="tertiary" />
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
})