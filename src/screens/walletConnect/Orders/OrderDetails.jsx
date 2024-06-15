import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import InputText from '../Login/InputText'
import SelectDropdown from 'react-native-select-dropdown'
import { sharedColors } from 'src/shared/constants'
import Dropdown from '../Components/Dropdown'
import BottomSheet from '../Components/BottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { FadeIn, FadeOut, log, or } from 'react-native-reanimated'
import { useMarket } from '../MarketContext'
import ButtonCustom from '../Login/ButtonCustom'
import { useForm } from 'react-hook-form'
import { useAppSelector } from 'src/redux/storeUtils'
import { getAddressDisplayText } from 'src/components'
import { selectBitcoin, selectChainId } from 'src/redux/slices/settingsSlice'
import { selectBalances } from 'src/redux/slices/balancesSlice'
import { selectProfile, selectUsername } from 'src/redux/slices/profileSlice'
import { WalletContext } from 'src/shared/wallet'
import { shortAddress } from 'src/lib/utils'
import firestore from '@react-native-firebase/firestore';

export default function OrderDetails({route, navigation}) {

  const {order} = route.params 
  parseFloat(order.price, order.total)
  const [cantidad, setCantidad] = useState()
  const [paymentMethod, setPaymentMethod] = useState("Método de pago")
  const [type, setType] = useState("crypto")
  const [ammount, setAmmount] = useState(null)
  const [fiatTotal, setFiatTotal] = useState()
  const [cryptoTotal, setCryptoTotal] = useState()
  const [open, setOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState(null)
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const [data, setData] = useState(null)
  const { addPayment, payments, setOrderId} = useMarket();
  
  useEffect(() => {
    setAmmount(null)
  }, [type]);
  useEffect(() => {
    if(type == "crypto"){
      setFiatTotal(ammount * order.price)
      setCryptoTotal(ammount)
    }else if(type == "fiat"){
      setCryptoTotal((ammount / order.price))
      setFiatTotal(ammount)
    }
  }, [ammount]);

  const handleNumberChange = (inputValue, input) => {
    if(input == 1){
      const sanitizedValue = inputValue.replace(/,/g, '.');
      setAmmount(sanitizedValue);
    }
  };

  function selectType(value){
    setType(value)
  }

  const formatNumberWithDots = (number) => {
    if (number === undefined || number === null) return '0'
    // Convert the number to a string
    let numString = number.toString();
    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = numString.split('.');
    // Add commas to the integer part (thousands separator)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Return the formatted number with optional decimal part
    return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
  };

  function toggleOpen(maxHeight, value){
    value === 1 ? setData(value) : value === 2 ? setData(value) : setData(payments)
    maxHeight ? setMaxHeight(maxHeight) : setMaxHeight(null)
    setOpen(!open)
  }

  function handleConfirm(cbu, alias, ref, owner){
    const payment = {
      cbu: cbu,
      alias: alias,
      text: ref + " ("+ alias +")",
      titular: owner,
      banco: ref,
    }
    addPayment(payment); 
    toggleOpen();
  }
  function handleSlecet(value){
    setPaymentMethod(value)
    toggleOpen()
  }
  
  function handleClick(){
    setOrderId({
      "id": order.id,
      "collection": order.orderType + order.crypto,
    })
    const orderConfirmed = {
      address: address,
      paymentMethod: payments.find((e => e.text == paymentMethod)),
      cryptoTotal: cryptoTotal,
      fiatTotal: fiatTotal,
    }
    const collection = order.orderType + order.crypto
    firestore()
    .collection(collection)
    .doc(order.id)
    .update({
      orderConfirmed,
      status: "pendingLock"
    })
    .then(() => {
      navigation.replace('OrderTaken', {orderConfirmed})
    })
  }


  const methods = useForm();
  const bitcoinCore = useAppSelector(selectBitcoin);

  const tokenBalances = useAppSelector(selectBalances);
  
  
  
  const username = useAppSelector(selectUsername);
    
  const { token, networkId } = route.params;
  const [selectedAsset, setSelectedAsset] = useState(
    (networkId && bitcoinCore?.networksMap[networkId]) ||
    token ||
    Object.values(tokenBalances)[0],
  );
  
  const [address, setAddress] = useState('');
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const shouldShowAssets = true;

  const { wallet } = useContext(WalletContext);
  const chainId = useAppSelector(selectChainId);
  const profile = useAppSelector(selectProfile);

  const rskAddress = useMemo(() => {
    if (wallet && chainId) {
      return getAddressDisplayText(wallet.smartWalletAddress, chainId);
    }
    return null;
  }, [wallet, chainId]);

  useEffect(() => {
    const tokenSelected = Object.values(tokenBalances).find(e => 
      order.crypto == "RBTC" ? e.name == "RBTC" : e.name == "Dollar on Chain"
    );
    setSelectedAsset(tokenSelected);
  }, [order.crypto, tokenBalances]);

  const onShareUsername = useCallback(() => {
    Share.share({
      message: profile?.alias || '',
    });
  }, [profile?.alias]);

  const onShareAddress = useCallback(() => {
    Share.share({
      message: address,
    });
  }, [address]);

  const onGetAddress = useCallback(
    (asset) => {
      console.log('onGetAddress called with asset:', asset);
      if (asset) {
        setIsAddressLoading(true);
        if ('bips' in asset) {
          asset.bips[0]
            .fetchExternalAvailableAddress({})
            .then((addressReturned) => {
              console.log('Fetched address:', addressReturned);
              setAddress(addressReturned);
            })
            .finally(() => {
              setIsAddressLoading(false);
              console.log('Address loading finished');
            });
        } else {
          setAddress(rskAddress?.checksumAddress || '');
          setIsAddressLoading(false);
          console.log('RSK address set:', rskAddress?.checksumAddress);
        }
      }
    },
    [rskAddress?.checksumAddress],
  );

  useEffect(() => {
    if (selectedAsset) {
      onGetAddress(selectedAsset);
    }
  }, [onGetAddress, selectedAsset]);



  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: sharedColors.mainWhite}}>
      <View style={styles.container}>
        <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 16 }}>
          <Text style={styles.simpleText}>Precio del {order.crypto}:</Text>
          <View style={{padding: 4, backgroundColor: "#E4E6EB", marginLeft: 8}}><Text style={[styles.simpleText, {color: "#19AD79", fontSize: 16}]}>$ {order.price} ARS</Text></View>
        </View>

        <View style={{height:40, width: "100%", flexDirection: "row", marginBottom: 24}}>
            <Pressable onPress={()=> selectType("crypto")} style={[styles.orderSelector, type === "crypto" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
              <Text style={[styles.orderText, type === "crypto" ? styles.selectedText : null]}>Monto a {order.orderType}</Text>
            </Pressable>
            <Pressable onPress={()=> selectType("fiat")} style={[styles.orderSelector, type === "fiat" ? styles.selectedOrder : null, {borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
              <Text style={[styles.orderText, type === "fiat" ? styles.selectedText : null]}>Monto a {order.orderType == "Vender" ? "Recibir" : "pagar"}</Text>
            </Pressable>
        </View>

        <View style={styles.card}>
          <View style={{position: "relative"}}>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
            <Text style={{position: "absolute", right: "5%", bottom: "35%", fontSize: 18}}>{type === "crypto" ? order.crypto : "ARS"}</Text>
          </View>
          <View style={{marginBottom: 16}}>
            <Text style={styles.simpleText}>Límite: <Text style={[styles.simpleText, {fontSize: 15, color: sharedColors.secondary}]}>{type == "fiat" ? "$"+ formatNumberWithDots(order.minAmm * order.price) + " ARS  -  $" + formatNumberWithDots(order.maxAmm * order.price) + " ARS" : order.minAmm + " " + order.crypto + "  -  " + order.maxAmm + " " + order.crypto}</Text> </Text>
            <Text style={styles.simpleText}>Disponible: <Text style={[styles.simpleText, {fontSize: 15, color: sharedColors.secondary}]}>{type == "fiat" ? "$" + formatNumberWithDots(order.total * order.price) + " ARS" : order.total + " " + order.crypto}</Text></Text>
          </View>

          <View style={{marginBottom: 16, flexDirection: "row", justifyContent: "space-between", display: ammount ? "flex" : "none"}}>
            <Text style={styles.simpleText}>vas a {(order.orderType == "Vender" && type == "crypto" || order.orderType == "Comprar" && type == "fiat") ? "recibir" : "pagar"}</Text>
            <Text style={[styles.simpleText, {color: "#3A3F42", fontSize: 18}]}>{type == "crypto" ? ("$" + formatNumberWithDots(fiatTotal) + " ARS") : (cryptoTotal + " " +order.crypto)}</Text>
          </View>

          <Text style={[styles.simpleText, {fontSize: 18}]}>Seleccionar método de pago</Text>

          <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
            <Dropdown onPress={() => toggleOpen(700)} placeholder={paymentMethod} width={"85%"} right={true}/>
            <TouchableOpacity style={styles.addPayment} onPress={() => toggleOpen(null, 1)}>
              <Text style={{fontSize:35, fontWeight: "700", color: sharedColors.bablue}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* {order.orderType == "Comprar" && (
          <View>
            <Text style={[styles.simpleText, {fontSize: 18}]}>Introducir la dirección de la billetera </Text>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
            <Text style={[styles.simpleText, {fontSize: 18}]}>Introducir la dirección de la billetera </Text>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
          </View>
        )} */}
        
      </View>
      
      <View style={{flex:1, justifyContent: "flex-end", paddingHorizontal: 16}}>
        <ButtonCustom text="Continuar" type={(ammount>0 && paymentMethod != "Método de pago") ? "green" : "disabled"} 
        onPress={(ammount>0 && paymentMethod != "Método de pago")? () => toggleOpen(null, 2) : null} 
        activeOpacity={(ammount>0 && paymentMethod != "Método de pago") ? false : 1}/>
      </View>
      {open && (
        <>
          <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
          <BottomSheet data={data} maxHeight={maxHeight} title="Elegí tu método de pago" 
          onSelect={handleSlecet} onCancel={() => toggleOpen(null)} onConfirm={handleConfirm} price={formatNumberWithDots(order.price)}
          cryptoTotal={cryptoTotal} fiatTotal={formatNumberWithDots(fiatTotal)} paymentMethod={paymentMethod} type={order.orderType == "Vender" ? "recibir" : "pagar"}
          crypto={order.crypto} address={shortAddress(address, 10)} onClick={() => handleClick()}/>
        </>
      )}
    </GestureHandlerRootView>
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
  simpleText:{
    fontSize: 14,
    fontFamily: "Robot-Medium",
    fontWeight: "400",
    color: sharedColors.inputText,
    letterSpacing: 0.4,
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