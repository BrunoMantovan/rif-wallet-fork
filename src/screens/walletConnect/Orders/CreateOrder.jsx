import { View, Text, TextInput, StyleSheet, Button, Pressable, TouchableOpacity } from 'react-native'
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

export default function CreateOrder() {

  const [price, setPrice] = useState(null)
  const [type, setType] = useState("Vender")
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
  const [paymentMethod, setPaymentMethod] = useState("Método de pago")
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(null)
  const [step1, setStep1] = useState(false)
  const [maxHeight, setMaxHeight] = useState(null)
  const { setHideTab } = useMarket()
  const navigation = useNavigation()
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const { addPayment, payments} = useMarket();

  function hola(){
    const num1 = parseFloat(num);
  }

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

  useEffect(() => {
    if (type && crypto && price) {
      setSpecs(true);
    } else {
      setSpecs(false);
    }

    if(type == "Comprar"){
      if(total && minAmm && maxAmm && paymentMethod != "Método de pago" && (total >= maxAmm) && (maxAmm >= minAmm)){
        setSpecs2(true);
      } else {setSpecs2(false)}
    }else if(type === "Vender"){
      if (total && minAmm && maxAmm && (total >= maxAmm) && (maxAmm >= minAmm)) {
        setSpecs2(true)
      } else {setSpecs2(false)}
    }

  }, [type, crypto, price, maxAmm, minAmm, total, paymentMethod]);

  /* function handleSubmit(){
    const order = {
      price: price,
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
  } */

  function onPressing(){
    if(step1){
      const typeForSelf = type == "Comprar" ? "Vender" : "Comprar"
      const order = {
        price: price,
        crypto: crypto,
        username: username,
        orderType: type,
        total: total,
        minAmm: minAmm,
        maxAmm: maxAmm,
        orderTypeForSelf: typeForSelf,
        paymentMethod: payments.find((e => e.text == paymentMethod))
      }
      
      navigation.navigate('Resumen', { order: order })
      setHideTab(true)
    }else if(!step1){
      setStep1(true)
    }
  }

  function toggleOpen(){    
    setOpen(!open)        
  }
  function selectType(value){
    setType(value)
  }
  function handleSelect(value){
    if(!step1){
      setCrypto(value)
      setCryptoPlaceholder(value);
      setOpen(null);
    }else{
      setPaymentMethod(value)
      toggleOpen()
    }
  }
  function toggleOpen(maxHeight, value){
    value === 1 ? setData(value) : setData(payments)
    maxHeight ? setMaxHeight(maxHeight) : setMaxHeight(null)
    setOpen(!open)
  }
  function handleConfirm(cbu, alias, ref, owner){
    const payment = {
      cbu: cbu,
      alias: alias,
      text: ref + "("+ alias +")",
      titular: owner,
      bacno: ref,
    }
    addPayment(payment); 
    toggleOpen();
  }
  return (
    !step1 ? (<GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.body}>
        <View style={{height:40, width: "100%", flexDirection: "row", marginBottom: 24}}>
          <Pressable onPress={()=> selectType("Vender")} style={[styles.orderSelector, type === "Vender" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, type === "Vender" ? styles.selectedText : null]}>Comprar</Text>
          </Pressable>
          <Pressable onPress={()=> selectType("Comprar")} style={[styles.orderSelector, type === "Comprar" ? styles.selectedOrder : null, {borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
            <Text style={[styles.orderText, type === "Comprar" ? styles.selectedText : null]}>Vender</Text>
          </Pressable>
        </View>
        
        <View style={styles.wrapper}>
          <View style={{flexDirection: "row", marginBottom: 24}}>
            <View style={{height:100, width: "50%", paddingRight: "2%"}}>
              <Text style={styles.span}>Crypto</Text>
              <Dropdown placeholder={cryptoPlaceholder} onPress={() => toggleOpen()} image={cryptoPlaceholder === "rBtc" ? require('../../../images/slides/rbtc.png') : require('../../../images/slides/doc.png')}/>
            </View>
            <View style={{height:100, width: "50%", paddingRight: "2%"}}>
              <Text style={styles.span}>Por</Text>
              <Dropdown placeholder="ARS" image={require('../../../images/slides/rbtc.png')}/>
            </View>
          </View>
        </View>

        <View style={{width: "100%", alignContent: "center", marginBottom: 24}}>
          <Text style={styles.subtitle}>PRECIO</Text>
          <Text style={styles.span}>¿A qué precio querés {type === "Vender" ? "comprar" : "Vender"} {crypto}?</Text>
          <InputText value={price} setValue={(value) => handleNumberChange(value, 1)} placeholder="0" keyboard="numeric" style={styles.input}/>
          <Text style={{position: "absolute", right: "5%", bottom: "18%", fontSize: 18}}>ARS</Text>
        </View>

        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <ButtonCustom onPress={specs ? onPressing : undefined} text="Continuar" type={specs ? "green" : "disabled"} activeOpacity={specs ? false : 1} icon="arrow-right"/>
        </View>
      </View>
      {open && (
        <>
          <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
          <BottomSheet data={cryptos} title={'Elegir moneda'} onSelect={handleSelect}/>
        </>
      )}
    </GestureHandlerRootView>) : 

    //cuando esta step1

    (<GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.body}>

        <View style={{width: "100%", alignContent: "center", marginBottom: 24}}>
          <Text style={styles.subtitle}>CANTIDAD TOTAL</Text>
          <Text style={styles.span}>¿Cuánto {crypto} querés {type === "Vender" ? "comprar" : "Vender"}?</Text>
          <InputText value={total} setValue={(value) => handleNumberChange(value, 2)} placeholder="0" keyboard="numeric" style={styles.input}/>
          <Text style={{position: "absolute", right: "5%", bottom: "18%", fontSize: 18}}>{crypto}</Text>
        </View>

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
          <Dropdown onPress={() => toggleOpen(700)} placeholder={paymentMethod} width={"85%"} right={true}/>
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
  )
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
    marginVertical: 24
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