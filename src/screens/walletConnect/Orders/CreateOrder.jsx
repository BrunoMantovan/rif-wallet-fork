import { View, Text, TextInput, StyleSheet, Button, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputText from '../Login/InputText'
import SelectDropdown from 'react-native-select-dropdown'
import ButtonCustom from '../Login/ButtonCustom'
import firestore from '@react-native-firebase/firestore';
import Dropdown from '../Components/Dropdown'
import { sharedColors } from 'src/shared/constants'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet from '../Components/BottomSheet'
import { useNavigation } from '@react-navigation/native'
import { useMarket } from '../MarketContext'
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated'
import { NotificationSend } from '../Components/NotificationSend'

export default function CreateOrder() {

  const [price, setPrice] = useState(null)
  const [type, setType] = useState("BUY")
  const [crypto, setCrypto] = useState("DoC")
  const [cryptoPlaceholder, setCryptoPlaceholder] = useState('DoC');
  const [specs, setSpecs] = useState(false);
  const [specs2, setSpecs2] = useState(false);
  const [total, setTotal] = useState()
  const [minAmm, setMinAmm] = useState()
  const [maxAmm, setMaxAmm] = useState()
  const username = "usuario 987"
  const cryptos = [
    {text: "DoC", image: require('../../../images/slides/doc.png')},
    {text: "rBtc", image: require('../../../images/slides/rbtc.png')}
]
  const [payment_method, setpayment_method] = useState([])
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(null)
  const [step1, setStep1] = useState(false)
  const [maxHeight, setMaxHeight] = useState(null)
  const { setHideTab } = useMarket()
  const navigation = useNavigation()
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const { addPayment, payments, removePayment} = useMarket();



  const handleNumberChange = (inputValue, input) => {
    if(input == 1){
      const sanitizedValue = parseFloat(inputValue.replace(/,/g, '.'))
      setPrice(sanitizedValue);
    }else if(input == 2){
      const sanitizedValue = parseFloat(inputValue.replace(/,/g, '.'))
      setTotal(sanitizedValue);
    }else if(input == 3){
      const sanitizedValue = parseFloat(inputValue.replace(/,/g, '.'))
      setMinAmm(sanitizedValue);
    }else if(input == 4){
      const sanitizedValue = parseFloat(inputValue.replace(/,/g, '.'))
      setMaxAmm(sanitizedValue);
    }
  };

  useEffect(()=>{
    console.log("payments ", payments);
    setpayment_method(payments)
  }, [payments])

  useEffect(() => {
    if(type == "BUY"){
      if (type && crypto && price && total ) {
        setSpecs(true);
      } else {
        setSpecs(false);
      }
    }else if(type === "SELL"){
      if (type && crypto && price && total && payment_method.length > 0) {
        setSpecs(true);
      } else {
        setSpecs(false);
      }
    }

  }, [type, crypto, price, total, payment_method]);

  function onPressing(){
    const order = {
      price: price,
      crypto: crypto,
      username: username,
      order_type: type,
      total: total,
      order_type_for_self: type,
      payment_methods: type === "SELL" ? payment_method : []
    }
      
    navigation.navigate('Resumen', { order: order })
    setHideTab(true)
  }

  function selectType(value){
    setType(value == "Comprar" ? "BUY" : "SELL")
  }
  function handleSelect(value){
    const areEqual = JSON.stringify(data) === JSON.stringify(cryptos);

    if(areEqual == true){
      setCrypto(value)
      setCryptoPlaceholder(value);
      setOpen(null);
    }else{
      setpayment_method(payments)
      toggleOpen()
    }
  }
  function toggleOpen(maxHeight, value){
    value === 1 ? setData(value) : value == 2 ? setData(cryptos) : setData(payments)
    maxHeight ? setMaxHeight(maxHeight) : setMaxHeight(null)
    setOpen(!open)
  }
  function handleConfirm(cbu, alias, ref, owner, accountType){
    const payment = {
      type: accountType,
      alias: alias,
      cbu: cbu,
      fullName: owner,
      entity: ref,
    }
    addPayment(payment); 
    toggleOpen();
  }

  function handleEliminate(alias){
    removePayment(alias)
    toggleOpen()
  }

  /* function handleNotification(){
    const token = "dVVgJr8lRbWHj9z-YeFW7N:APA91bHJOypCIRScdnunHJDTbm31B4kDubEt11GDIh1lyLfozXjg88_JG0nMnd6O3o2dhEaKT_stL8vKVKh5jAN53KXY9ioFpQrMapqo0Z3-vZcuGn969dfRtZlqjwJAiICYdzMU8vbk"
    const title = "Notificación"
    const body = "Esta es una notificación"
    NotificationSend(token, title, body)
  } */

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView style={styles.body}>
        <View style={{height:40, width: "100%", flexDirection: "row", marginBottom: 24}}>
          <Pressable onPress={()=> selectType("Comprar")} style={[styles.orderSelector, type === "BUY" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, type === "BUY" ? styles.selectedText : null]}>Comprar</Text>
          </Pressable>
          <Pressable onPress={()=> selectType("Vender")} style={[styles.orderSelector, type === "SELL" ? styles.selectedOrder : null, {borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, type === "SELL" ? styles.selectedText : null]}>Vender</Text>
          </Pressable>
          {/* <Pressable onPress={()=> handleNotification()} style={[styles.orderSelector, type === "Comprar" ? styles.selectedOrder : null, {borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, type === "Comprar" ? styles.selectedText : null]}>notificacion</Text>
          </Pressable> */}
        </View>
        
        <View style={styles.wrapper}>
          <View style={{flexDirection: "row", marginBottom: 14}}>
            <View style={{height:100, width: "50%", paddingRight: "2%"}}>
              <Text style={styles.span}>Crypto</Text>
              <Dropdown placeholder={cryptoPlaceholder} onPress={() => toggleOpen(null, 2)} image={cryptoPlaceholder === "rBtc" ? require('../../../images/slides/rbtc.png') : require('../../../images/slides/doc.png')}/>
            </View>
            <View style={{height:100, width: "50%", paddingRight: "2%"}}>
              <Text style={styles.span}>Por</Text>
              <Dropdown placeholder="ARS" image={require('../../../images/slides/rbtc.png')}/>
            </View>
          </View>
        </View>
        <View style={{width: "100%", alignContent: "center", marginBottom: 14}}>
          <Text style={styles.subtitle}>CANTIDAD TOTAL</Text>
          <Text style={styles.span}>¿Cuánto {crypto} querés {type === "BUY" ? "comprar" : "Vender"}?</Text>
          <InputText value={total} setValue={(value) => handleNumberChange(value, 2)} placeholder="0" keyboard="numeric" style={styles.input}/>
          <Text style={{position: "absolute", right: "5%", bottom: "18%", fontSize: 18}}>{crypto}</Text>
        </View>
        <View style={{width: "100%", alignContent: "center", marginBottom: 14}}>
          <Text style={styles.subtitle}>PRECIO</Text>
          <Text style={styles.span}>¿A qué precio querés {type === "BUY" ? "comprar" : "Vender"} {crypto}?</Text>
          <InputText value={price} setValue={(value) => handleNumberChange(value, 1)} placeholder="0" keyboard="numeric" style={styles.input}/>
          <Text style={{position: "absolute", right: "5%", bottom: "18%", fontSize: 18}}>ARS</Text>
        </View>
        {type === "SELL" ? (
          <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
          <Dropdown onPress={() => toggleOpen(700)} placeholder={"Métodos de pago"} width={"85%"} right={true}/>
          <TouchableOpacity style={styles.addPayment} onPress={() => toggleOpen(null, 1)}>
            <Text style={{fontSize:35, fontWeight: "700", color: sharedColors.bablue}}>+</Text>
          </TouchableOpacity>
        </View>) : null}

        <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 24}}>
          <ButtonCustom onPress={specs ? onPressing : undefined} text="Continuar" type={specs ? "green" : "disabled"} activeOpacity={specs ? false : 1} icon="arrow-right"/>
        </View>
      </ScrollView>
      {open && (
        <>
          <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
          <BottomSheet data={data} title={'Tus métodos de pago'} onSelect={handleSelect} maxHeight={maxHeight} onConfirm={handleConfirm} onEliminate={handleEliminate}/>
        </>
      )}
    </GestureHandlerRootView>)

    //cuando esta step1

    {/* <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.body}>

        


        
        <Text style={styles.subtitle}>CANTIDAD POR TRANSACCIÓN</Text>
        <View style={{width: "100%", justifyContent: "space-between", marginBottom: 24, flexDirection: "row"}}>
          <View style={{width: "49%"}}>
            <Text style={styles.span}>Cant. mínima</Text>
            <InputText value={minAmm} setValue={(value) => handleNumberChange(value, 3)} placeholder="0" keyboard="numeric" style={styles.input}/>
            <Text style={{position: "absolute", right: "5%", bottom: "30%", fontSize: 18}}>{crypto}</Text>
          </View>
          <View style={{width: "49%", position: "relative"}}>
            <Text style={styles.span}>Cant. máxima</Text>
            <InputText value={maxAmm} setValue={(value) => handleNumberChange(value, 4)} placeholder="0" keyboard="numeric" style={styles.input}/>
            <Text style={{position: "absolute", right: "5%", bottom: "30%", fontSize: 18}}>{crypto}</Text>
          </View>
        </View>


        {type === "Comprar" ? (
          <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
          <Dropdown onPress={() => toggleOpen(700)} placeholder={payment_method} width={"85%"} right={true}/>
          <TouchableOpacity style={styles.addPayment} onPress={() => toggleOpen(null, 1)}>
            <Text style={{fontSize:35, fontWeight: "700", color: sharedColors.bablue}}>+</Text>
          </TouchableOpacity>
        </View>) : null}

        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <ButtonCustom onPress={specs2 ? onPressing : undefined} text="Continuar" type={specs2 ? "green" : "disabled"} activeOpacity={specs2 ? false : 1} icon="arrow-right"/>
        </View>
      </View>

      {open && (
        <>
          <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
          <BottomSheet data={data} title={'Elegí tu método de pago'} maxHeight={maxHeight} onSelect={handleSelect} onConfirm={handleConfirm}/>
        </>
      )} 

    </GestureHandlerRootView>)
   */}
}


const styles = StyleSheet.create({
  body:{
    paddingHorizontal: "5%",
    backgroundColor: sharedColors.mainWhite,
    paddingTop: "5%",
    flex: 1
  },
  subtitle:{
    fontSize: 18,
    color: sharedColors.inputText,
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    letterSpacing: 0.1,
    marginVertical: 12
  },
  dropdown:{
    width: "100%",
    height: 56,
    backgroundColor: "white",
    borderColor: "#D2E6F799",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
  },
  wrapper:{
    flexDirection: "row"
  },
  orderSelector:{
    height: 40,
    width: "50%",
    backgroundColor: "transparent",
    borderColor: "#D2E6F799",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8
  },
  orderText:{
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    color: "#727F9E",
  },
  selectedOrder: {
    backgroundColor: "#D2E6F7",
  },
  selectedText:{
    color: sharedColors.bablue,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  span:{
    color: sharedColors.inputBorder,
    letterSpacing: 0.5,
    fontFamily: "Robot-Medium",
    fontWeight: "400",
    fontSize: 16
  },
  addPayment:{
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderColor: "#e8e8e8",
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})