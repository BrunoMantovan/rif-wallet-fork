import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../Login/ButtonCustom'
import firestore from '@react-native-firebase/firestore';
import { use } from 'i18next';
import { getAddressDisplayText, LoadingScreen } from 'src/components';
import { selectBalances } from 'src/redux/slices/balancesSlice';
import { useAppSelector } from 'src/redux/storeUtils';
import { selectProfile } from 'src/redux/slices/profileSlice';
import { selectChainId } from 'src/redux/slices/settingsSlice';
import { WalletContext } from 'src/shared/wallet';
import { shortAddress } from 'src/lib/utils';
import { P2PMarketplaceAPIClient} from 'src/baApi';
import { useMarket } from '../MarketContext';

export default function OrderSummary({route, navigation}) {

  const {order} = route.params
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [address, setAddress] = useState('');
  const { token, networkId } = route.params;
  const [selectedAsset, setSelectedAsset] = useState();
  const tokenBalances = useAppSelector(selectBalances);
  const { wallet } = useContext(WalletContext);
  const chainId = useAppSelector(selectChainId);
  const profile = useAppSelector(selectProfile);
  const BASE_URL = 'https://bolsillo-argento-586dfd80364d.herokuapp.com';
  const client = new P2PMarketplaceAPIClient(BASE_URL);
  const { username } = useMarket();

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
    console.log(selectedAsset);
    console.log("token balances" + tokenBalances);
    
  }, []);

  useEffect(()=>{
    onGetAddress(selectedAsset);
  }, [selectedAsset])

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


  

  async function handleSubmit(){
    try {
      const user = {
        username: username
      }
      const userReponse = await client.createUser(user);
      console.log("userReponse", userReponse);
      
      const newOrder = {
        type: order.order_type,
        description: "",
        amount: order.total.toString(),
        tokenCode: order.crypto,    
        fiatAmount: (order.price * order.total).toString(),
        status: "PENDING",
        fiatCode: "ARS",
        walletAddress: order.order_type == "BUY" ? address : undefined,
        paymentMethods: order.payment_methods,
        creatorId: userReponse.id,
        creatorUsername: username
      }
      console.log("newOrder", newOrder);
    
      const response = await client.createOrder(newOrder, {
        'x-api-secret': 'test',
        'x-blockchain': 'rsk_testnet'
      });
      console.log('Data:', response);
    
      navigation.navigate('MyOrders');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  return (
    isAddressLoading ? <LoadingScreen/> :
    <View style={{padding: 16, flex: 1}}>
      <Text style={styles.text}>Tipo de operación: <Text style={styles.innetText}>{order.order_type_for_self}</Text></Text>
      <Text style={styles.text}>Activo: <Text style={styles.innetText}>{order.crypto}</Text></Text>
      <Text style={styles.text}>Moneda de {order.order_type_for_self == "Comprar" ? "compra" : "cobro"}: <Text style={styles.innetText}>ARS</Text></Text>
      <Text style={styles.text}>Precio unitario: <Text style={styles.innetText}>${order.price}</Text></Text>
      <Text style={styles.text}>Cantidad total: <Text style={styles.innetText}>{order.total} {order.crypto}</Text></Text>
      {order.order_type == "Comprar" ? <Text style={styles.text}>Método de pago: <Text style={styles.innetText}>{order.payment_method.entity + " (" + order.payment_method.alias + ")"}</Text></Text> : null}
      <Text style={styles.text}>Billetera: <Text style={styles.innetText}>{shortAddress(address, 10)}</Text></Text>
      <View style={{flex: 1, justifyContent: "flex-end"}}><ButtonCustom onPress={()=> handleSubmit()} text="Publicar" type="green"/></View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Robot-Medium",
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 18,
    color: sharedColors.inputText,
    marginVertical: 12,
    padding: 4,
    justifyContent: "center"
  },
  innetText: {
    fontFamily: "Robot-Medium",
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 16,
    backgroundColor: "#E8E8E9",
    padding: 8,
    color: "#5B6369",
    padding: 50
  }
})