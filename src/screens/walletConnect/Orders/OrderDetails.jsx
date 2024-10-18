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
import { P2PMarketplaceAPIClient } from 'src/baApi'

export default function OrderDetails({route, navigation}) {

  const {order} = route.params 
  parseFloat(order.fiatAmount, order.amount)
  const [cantidad, setCantidad] = useState()
  const [payment_method, setpayment_method] = useState([])
  const [type, setType] = useState("crypto")
  const [ammount, setAmmount] = useState(null)
  const [fiatTotal, setFiatTotal] = useState()
  const [cryptoTotal, setCryptoTotal] = useState()
  const [open, setOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState(null)
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const [data, setData] = useState(null)
  const { addPayment, payments, setOrderId, userInfo, removePayment} = useMarket();
  const [specs, setSpecs] = useState(false)
  
  const BASE_URL = "https://bolsillo-argento-586dfd80364d.herokuapp.com";
  const client = new P2PMarketplaceAPIClient(BASE_URL);
  console.log(order);

  const numberFormatOptions = {
    // Specify the dot as the thousands separator
    useGrouping: true,
    maximumFractionDigits: 2, // Optional: specify the maximum number of fraction digits
  };

  useEffect(() => {
    const handleNumberChange = () => {
      const sanitizedValue = parseFloat(order.amount.replace(/,/g, '.'));
      setAmmount(sanitizedValue);
    };
    handleNumberChange()
  }, [])

  useEffect(() => {
    setpayment_method(payments)
    console.log(payment_method.length)
  }, [payments])

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
  function handleSlecet(value){
    setpayment_method(payments)
    toggleOpen()
  }
  
  async function handleClick(){
    try{
      setOrderId({
        "id": order.id,
        "collection": order.type + order.tokenCode,
      })
      const orderConfirmed = {
        address: address,
        payment_methods: payment_method,
        cryptoTotal: cryptoTotal,
        fiatTotal: fiatTotal,
      }

      let takeOrderRequest 
      console.log("order", order)
      if(order.type == "BUY"){
        takeOrderRequest = {
          type: order.type, //string
          orderId: order.id, //string
          userId: userInfo.id, //string
          amount: order.fiatAmount, //string
          username: userInfo.username, //string
          paymentMethod: payment_method
        };
      }else{
        takeOrderRequest = {
          type: order.type, //string
          orderId: order.id, //string
          userId: userInfo.id, //string 
          buyerAddress: "0xd97D397BfF4610AA208936A5D42C640604570372", //string
          fiatAmount: order.fiatAmount, //string
          username: userInfo.username //string
        };
      }
      console.log("take order request: " ,takeOrderRequest);
      
      const response = await client.takeOrder(takeOrderRequest, {
        'x-api-secret': 'test',
        'x-blockchain': 'rsk_testnet'
      });
      console.log('Order Taken:', response);
      navigation.replace('OrderTaken', {takeOrderRequest})
      console.log('Order Updated:', response);
    
    } catch(e){
      console.log(e)
    }    
  }


  const methods = useForm();
  const bitcoinCore = useAppSelector(selectBitcoin);

  const tokenBalances = useAppSelector(selectBalances);
  
  
  
  //const username = useAppSelector(selectUsername);
  const { token, networkId } = route.params;
  const [selectedAsset, setSelectedAsset] = useState()
  
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
      order.tokenCode == "RBTC" ? e.name == "RBTC" : e.name == "Dollar on Chain"
    );
    setSelectedAsset(tokenSelected);
  }, [order.tokenCode, tokenBalances]);

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
        <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
          <Text style={styles.simpleText}>Precio del {order.tokenCode}:</Text>
          <View style={{padding: 4, backgroundColor: "#E4E6EB", marginLeft: 8}}><Text style={[styles.simpleText, {color: "#19AD79", fontSize: 18}]}>$ {formatNumberWithDots(order.fiatAmount/order.amount)} ARS</Text></View>
        </View>

        {/* <View style={{height:40, width: "100%", flexDirection: "row", marginBottom: 24}}>
            <Pressable onPress={()=> selectType("crypto")} style={[styles.orderSelector, type === "crypto" ? styles.selectedOrder : null, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
              <Text style={[styles.orderText, type === "crypto" ? styles.selectedText : null]}>Activos</Text>
            </Pressable>
            <Pressable onPress={()=> selectType("fiat")} style={[styles.orderSelector, type === "fiat" ? styles.selectedOrder : null, {borderTopRightRadius: 8, borderBottomRightRadius: 8}]} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}}>
              <Text style={[styles.orderText, type === "fiat" ? styles.selectedText : null]}>Fiat</Text>
            </Pressable>
        </View> */}

        <View style={styles.card}>
          {/* <View style={{position: "relative"}}>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
            <Text style={{position: "absolute", right: "5%", bottom: "35%", fontSize: 20}}>{type === "crypto" ? order.tokenCode : "ARS"}</Text>
          </View> */}
          <View style={{marginBottom: 24, flexDirection: "row", justifyContent: "space-between", }}>
            <Text style={styles.simpleText}>vas a {order.type == "BUY" ? "entregar" : "recibir" }</Text>
            <Text style={[styles.simpleText, {color: "#3A3F42", fontSize: 21}]}>{formatNumberWithDots(order.amount) + " " + order.tokenCode}</Text>
          </View>

          <View style={{marginBottom: 24, flexDirection: "row", justifyContent: "space-between", }}>
            <Text style={styles.simpleText}>vas a {order.type == "BUY" ? "recibir" : "pagar"}</Text>
            <Text style={[styles.simpleText, {color: "#3A3F42", fontSize: 21}]}>{("$" + formatNumberWithDots(order.fiatAmount) + " ARS")}</Text>
          </View>

          <Text style={[styles.simpleText, {fontSize: 20}]}>Seleccionar método de pago</Text>

          <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
            <Dropdown onPress={() => toggleOpen(700)} placeholder={"Métodos de pago"} width={"85%"} right={true}/>
            <TouchableOpacity style={styles.addPayment} onPress={() => toggleOpen(null, 1)}>
              <Text style={{fontSize:35, fontWeight: "700", color: sharedColors.bablue}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* {order.order_type == "Comprar" && (
          <View>
            <Text style={[styles.simpleText, {fontSize: 18}]}>Introducir la dirección de la billetera </Text>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
            <Text style={[styles.simpleText, {fontSize: 18}]}>Introducir la dirección de la billetera </Text>
            <InputText placeholder="0" value={ammount} setValue={(value)=> handleNumberChange(value, 1)} keyboard="numeric"/>
          </View>
        )} */}
        
      </View>
      
      <View style={{flex:1, justifyContent: "flex-end", paddingHorizontal: 16}}>
        <ButtonCustom text="Continuar" type={(payment_method.length >0 ) ? "green" : "disabled"} 
        onPress={(ammount>0 && payment_method.length > 0)? () => toggleOpen(null, 2) : null} 
        activeOpacity={payment_method.length <= 0 ? false : 1}/>
      </View>
      {open && (
        <>
          <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
          <BottomSheet data={data} maxHeight={maxHeight} title="Tus métodos de pago" 
          onSelect={handleSlecet} onCancel={() => toggleOpen(null)} onConfirm={handleConfirm} price={formatNumberWithDots(order.fiatAmount/order.amount)}
          cryptoTotal={order.amount} fiatTotal={formatNumberWithDots(order.fiatAmount)} payment_method={payment_method} type={order.type == "Vender" ? "recibir" : "pagar"}
          crypto={order.tokenCode} address={shortAddress(address, 10)} onClick={() => handleClick()} onEliminate={handleEliminate}/>
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
    fontSize: 18,
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