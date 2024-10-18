import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../../Login/ButtonCustom'
import { ScrollView } from 'react-native-gesture-handler'
import DropdownList from '../../Orders/DropdownList'

export default function SellCreator(props) {
  return (
    <>
        {props.status == "WAITING_PAYMENT" ? (
            <View style={styles.awaitingPayment}>
            <View>
                <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5", marginVertical: 14, fontWeight: "400"}]}>
                    Debes asegurar las criptomonedas en el contrato inteligente haciendo click en el boton de abajo</Text>
                <ButtonCustom text="Bloquear Activos" type={"green"} onPress={props.onLock} /> 
            </View>              
            </View>
        ) :  props.status == "ACTIVE" ? (
            <ScrollView>
            <Text style={styles.awaitingTxt}>Esperando a que el comprador realice el pago mediante transferencia</Text>   
            <Text style={styles.awaitingTxt}>Monto a recibir: ${props.fiatAmount}</Text>          
            </ScrollView>
        ) : props.status == "FIAT_SENT" ? (
            <View style={styles.awaitingPayment}>
            <View>
                <Text style={styles.awaitingTxt}>El comprador ha marcado la orden como pagada</Text>
                <Text style={styles.awaitingTxt}>Revisa que los fondos se hayan transferido correctamente y libera las criptomonedas</Text>
                <Text style={styles.warning}>No liberes los activos sin ver los fondos en tu cuenta</Text>
                <ButtonCustom text="Bloquear Activos" type={"green"} onPress={props.onRelease} />
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
    },
    warning:{
        fontSize: 24,
        fontFamily: "Roboto-Medium",
        color: sharedColors.warning,
        letterSpacing: 0.25,
        textAlign: "center",
        fontWeight: "700"    
    }
  })