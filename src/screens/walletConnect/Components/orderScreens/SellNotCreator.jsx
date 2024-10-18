import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../../Login/ButtonCustom'
import DropdownList from '../../Orders/DropdownList'
import { ScrollView } from 'react-native-gesture-handler'

export default function sellNotCreator(props) {
  return (
    <>
        {props.status == "WAITING_PAYMENT" ? (
            <View style={styles.awaitingPayment}>
            <View>
                <Text style={styles.awaitingTxt}>Esperando a que el vendedor asegure las criptomonedas</Text>
            </View>              
            </View>
        ) :  props.status == "ACTIVE" ? (
            <ScrollView>
            <Text style={[styles.mainText, {fontSize: 20, letterSpacing:0.5, color: "#464D51"}]}>Datos del vendedor</Text>
            <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5", marginVertical: 14, fontWeight: "400"}]}>
                Utiliza los siguientes datos para realizar la transferencia bancaria desde tu banco o billetera virtual</Text>
            <View>
                <DropdownList data={order.paymentMethods} />  

            </View>
            <View style={{flexDirection: "column",alignContent: "flex-end"}}>
                <Text style={[styles.mainText, {fontSize: 18, letterSpacing:0.5, color: "#5B6369", textAlign: "center"}]}>Una vez realizada la transferencia de los fondos a haz click en el boton de abajo</Text>
                <ButtonCustom text="He realizado el pago" type={"green"} onPress={props.onPress} />          
            </View>
            </ScrollView>
        ) : props.status == "FIAT_SENT" ? (
            <View style={styles.awaitingPayment}>
            <View>
                <Text style={styles.awaitingTxt}>Has marcado la orden como pagada</Text>
                <Text style={styles.awaitingTxt}>Esperando a que el vendedor libere las criptomonedas</Text>
            </View>
            </View>
        ) : null}
    </>
  )
}

const styles = StyleSheet.create({
    mainText:{
      fontSize: 24,
      fontFamily: "Roboto-Medium",
      color: sharedColors.inputText,
      fontWeight: "500",
      letterSpacing: 0.15,
      
    },
    awaitingPayment:{
      marginTop: 8,
    },
    awaitingTxt:{
      fontSize: 22,
      fontFamily: "Roboto-Medium",
      color: sharedColors.balightblue,
      letterSpacing: 0.25,
      textAlign: "center",
    }
  })