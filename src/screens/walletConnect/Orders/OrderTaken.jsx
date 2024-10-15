import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { sharedColors, testIDs } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'
import { AppButton } from 'src/components'
import { useMarket } from '../MarketContext'
import firestore from '@react-native-firebase/firestore';
import Title from '../Components/Title'
import { LoadingScreen } from 'src/components/loading/LoadingScreen'
import ButtonCustom from '../Login/ButtonCustom'
import Icon from 'react-native-vector-icons/FontAwesome'
import { P2PMarketplaceAPIClient } from 'src/baApi'
import DropdownList from './DropdownList'

export default function OrderTaken({route, navigation}) {
  const {takeOrderRequest} = route.params
  const {orderId} = useMarket();
  const [order, setOrder] = useState()
  const [loading, setLoading] = useState(true); 

  const BASE_URL = "https://bolsillo-argento-586dfd80364d.herokuapp.com";
  const client = new P2PMarketplaceAPIClient(BASE_URL);

  async function GetOrderById() {
    try{        
      console.log("takeOrderRequest: ", takeOrderRequest);
      const response = await client.getOrderById(takeOrderRequest.orderId);
      setOrder(response.orders[0]);
      setLoading(false)
      console.log(response.orders[0].status);
    }
    catch(e){
      console.log(e)
    }
  }

  const formatNumberWithDots = (number) => {
    // Convert the number to a string
    let numString = number.toString();
    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = numString.split('.');
    // Add commas to the integer part (thousands separator)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Return the formatted number with optional decimal part
    return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
};

  useEffect(() =>{
    setLoading(true);
    
    GetOrderById();

    const intervalId = setInterval(() => {
      GetOrderById();
    }, 10000); // 10000 milliseconds = 10 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [])

  async function fiatSent(){
    const updateOrderRequest = {
      status: 'FIAT_SENT',
      orderId: order.id
    };

    const response = await client.updateOrder(updateOrderRequest, {
      'x-api-secret': 'test',
      'x-blockchain': 'rsk_testnet'
    });
    console.log('Order Updated:', response);
  }

  return (
    loading ? <LoadingScreen/> : order.status == "COMPLETED_BY_ADMIN" || order.status == "RELEASED" ? (
      <View style={{flex: 1, backgroundColor: sharedColors.mainWhite, paddingHorizontal: "5%"}}>
        <View style={{flex: 5, justifyContent: "center", alignItems: "center"}}>
          <AppButton
            accessibilityLabel={testIDs.newContact}
            onPress={() => navigation.navigate("Market")}
            style={styles.newContactButton}
            leftIcon={{
              name: "times",
              size: 30,
            }}
            textColor={sharedColors.black}
          />
          <View style={{justifyContent: "center", alignItems: "center"}}>
            <Icon
              name={"check-circle-o"}
              size={150}
              color={"#19AD79"}
            />
            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 8}}>
              <Text style={[styles.mainText, {fontSize: 30}]}>{formatNumberWithDots(order.amount)} </Text>
              <Text style={[styles.mainText, {fontSize: 30}]}>{order.tokenCode}</Text>
            </View>
            <Text style={[styles.mainText, {fontSize: 18, letterSpacing: 0.25, marginTop: 8, textAlign: "center"}]}>Tus crypto fueron depositadas en tu cuenta exitosamente</Text>
          </View>
        </View>
        
        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <ButtonCustom text="Volver al inicio" type={"green"} onPress={() => navigation.navigate("Market")} />          
        </View>
      </View>
    ) : (
      <ScrollView style={{flex: 1, backgroundColor: sharedColors.mainWhite, paddingHorizontal: "5%"}}>
        <AppButton
          accessibilityLabel={testIDs.newContact}
          onPress={() => navigation.navigate("Market")}
          style={styles.newContactButton}
          leftIcon={{
            name: "times",
            size: 30,
          }}
          textColor={sharedColors.black}
        />
        <Title title={"Pago"}/>
        
        
        <View style={{flex: 1}}>
            <View style={styles.total}>
              <Text style={styles.mainText}>{formatNumberWithDots(order.amount)}</Text>
              <Text style={[styles.mainText, {fontSize: 18, letterSpacing: 0.25}]}>{order.tokenCode}</Text>
            </View>
            <View style={{marginBottom: 8}}>
              <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 8}}>
                <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5"}]}>Precio por unidad</Text> 
                <Text style={[styles.mainText, {fontSize: 20}]}>${formatNumberWithDots(order.fiatAmount/order.amount)} ARS</Text>
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 8}}>
                <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5"}]}>Monto total</Text> 
                <Text style={[styles.mainText, {fontSize: 20}]}>${formatNumberWithDots(order.fiatAmount)} ARS</Text>
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 8}}>
                <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5"}]}>Método de pago</Text> 
                <Text style={[styles.mainText, {fontSize: 20}]}>"Transferencia Bancaria"</Text>
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 8}}>
                <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5"}]}>{order.type == "SELL" ? "Vendedor" : "Comprador"}</Text> 
                <Text style={[styles.mainText, {fontSize: 20}]}>{order.username}</Text>
              </View>
              <View style={{borderBottomWidth:1, width: "100%", borderBottomColor: sharedColors.bagreen, marginVertical: 24}}></View>
          </View>
          {(order.status == "WAITING_PAYMENT" && order.type == "SELL") ? (
            <View style={styles.awaitingPayment}>
              <View>
                <Text style={styles.awaitingTxt}>Esperando a que el vendedor asegure las criptomonedas</Text>
              </View>              
            </View>
          ) :  (order.status == "ACTIVE" && order.type == "SELL") ? (
            <ScrollView>
              <Text style={[styles.mainText, {fontSize: 20, letterSpacing:0.5, color: "#464D51"}]}>Datos del vendedor</Text>
              <Text style={[styles.mainText, {fontSize: 16, letterSpacing:0.5, color: "#B0B3B5", marginVertical: 14, fontWeight: "400"}]}>
                Utiliza los siguientes datos para realizar la transferencia bancaria desde tu banco o billetera virtual</Text>
              <View>
                <DropdownList data={order.paymentMethods} />  

              </View>
              <View style={{flexDirection: "column",alignContent: "flex-end"}}>
                <Text style={[styles.mainText, {fontSize: 18, letterSpacing:0.5, color: "#5B6369", textAlign: "center"}]}>Una vez realizada la transferencia de los fondos a haz click en el boton de abajo</Text>
                <ButtonCustom text="He realizado el pago" type={"green"} onPress={()=>fiatSent()} />          
              </View>
            </ScrollView>
          ) : (order.status == "FIAT_SENT" && order.type == "SELL") ? (
            <View style={styles.awaitingPayment}>
              <View>
                <Text style={styles.awaitingTxt}>Has marcado la orden como pagada</Text>
                <Text style={styles.awaitingTxt}>Esperando a que el vendedor libere las criptomonedas</Text>
              </View>
            </View>
          ) : order.type == "BUY" ? (
            <View><Text>Status is pending</Text></View>
          ) : null}
        </View>        
      </ScrollView>
    )
  )
}
//style={{flex:1}}

const styles = StyleSheet.create({
  newContactButton: castStyle.view({
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    width: 60,
    height: 60,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  }),
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    height: 56,
    backgroundColor: "#EAF3FB",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
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