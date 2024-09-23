import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, Button, Touchable, TouchableOpacity, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import AdCard from '../Components/AdCard';
import { useFocusEffect } from '@react-navigation/native';
import CoinSelector from '../Components/CoinSelector';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useMarket } from '../MarketContext';
import Dropdown from '../Components/Dropdown';
import ButtonCustom from '../Login/ButtonCustom';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { castStyle } from 'src/shared/utils';
import { sharedColors } from 'src/shared/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../Components/BottomSheet';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
/* 
interface Order {
    username: string;
    price: number;
    total: number;
  } */

export default function BuyOrders() {
    const [orders, setOrders] = useState/* <Order[]> */([])
/*     const [tipo, setTipo] = useState("DoC") */
    const navigation = useNavigation()
    const { setHideTab } = useMarket();
    const [type, setType] = useState(null)
    const [crypto, setCrypto] = useState(null)
    const [method, setMethod] = useState(null)
    const [zindex, setZindex] = useState(2)
    const order_types = [{text: "Comprar"}, {text: "Vender"}]
    const cryptos = [
        {text: "DoC", image: require('../../../images/slides/doc.png')},
        {text: "rBtc", image: require('../../../images/slides/rbtc.png')}
    ]
    const payment_method = [{text: "Transferencia bancaria"}]
    const [specs, setSpecs] = useState(false)
    const [open, setOpen] = useState(null)
    const [typePlaceholder, setTypePlaceholder] = useState('Tipo de orden');
    const [cryptoPlaceholder, setCryptoPlaceholder] = useState('Activo Digital');
    const [methodPlaceholder, setMethodPlaceholder] = useState('Método de pago');

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

    useFocusEffect(
        React.useCallback(() => {
            setHideTab(false)
            setType(null)
            setCrypto(null)
            setMethod(null)
            setTypePlaceholder('Tipo de orden');
            setCryptoPlaceholder('Activo digital');
            setMethodPlaceholder('Método de pago');            
        }, [])
    );

    useEffect(() => {
        if (type && crypto && method) {
            setSpecs(true);
        } else {
            setSpecs(false);
        }
    }, [type, crypto, method]);

  /*   useEffect(() =>{
        const fetchData = async () => {
            const collection = type + crypto
            try {
                const querySnapshot = await firestore().collection(collection).get();
                const orderData = [];
                querySnapshot.forEach((doc) => {
                    // Extract data from each document and add it to the array
                    orderData.push(doc.data());
                });
                setOrders(orderData);

            } catch (error) {
              console.error('Error fetching orders:', error);
            }
        };
        
        fetchData();
    }, [tipo])
 */
    

    function toggleOpen(value){    
        setOpen(value)        
    }
    function handlePress(tipo){
        setTipo(tipo)
    }
    
    const handleCardPress = (order) => {
        navigation.navigate('OrderDetails', {order})
        setHideTab(true)
    }    
    function onPressing() {
        const search = {
            type: type,
            crypto: crypto,
            method: method,
        }
        navigation.navigate('Mercado', { search })
        setHideTab(true)
    }

    function handleSelect(value){
        if (open === "type"){
            setType(value)
            setTypePlaceholder(value);
        }else if(open === "crypto"){
            setCrypto(value)
            setCryptoPlaceholder(value);
        }else if(open === "payment"){
            setMethod(value)
            setMethodPlaceholder(value);
        }
        setOpen(null);
    }


    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View style={styles.body}>
                <LinearGradient colors={['#DCE6AAB2', '#C0DDF0B2']} style={styles.linearGradient}>
                
                <View style={{zIndex: 2, width: "100%", paddingHorizontal: "5%", paddingTop: 40,}} >
                    <View>
                        <View style={styles.container}>
                            <Text style={styles.subtitle}>¿Qué querés hacer?</Text>
                            <Dropdown placeholder={typePlaceholder} onPress={() => toggleOpen("type")}/>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.subtitle}>Elegir moneda</Text>
                            <Dropdown placeholder={cryptoPlaceholder} onPress={() => toggleOpen("crypto")} image={cryptoPlaceholder === "rBtc" ? require('../../../images/slides/rbtc.png') : cryptoPlaceholder === "DoC" ? require('../../../images/slides/doc.png') : null}/>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.subtitle}>Elegir el método de pago</Text>
                            <Dropdown placeholder={methodPlaceholder} onPress={() => toggleOpen("payment")}/>
                        </View>
                    </View>
                    <View style={{marginTop: "45%"}}>
                        <ButtonCustom text="Buscar" type={specs ? "secondary" : "disabled"} activeOpacity={specs ? false : 1} onPress={specs ? onPressing : undefined}/>
                    </View>
                </View>
                {/*  <View  style={styles.buttonsHolder}>
                        <CoinSelector type={tipo} function={handlePress}/>
                    </View>
                    <ScrollView style={styles.scrollView} refreshControl={<RefreshControl/>} >
                        {orders.sort((a, b) => a.price - b.price)
                        .map((order, index) => (
                            <AdCard key={index} username={order.username} price={order.price} total={order.total} crypto={order.crypto} order_type={order.order_type} onPress={() => handleCardPress(order)} display={"none"}/>
                        ))}
                    </ScrollView> */}
                <Svg
                    height="60%"
                    width="100%"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    style={[styles.svg, { transform: [{ rotateY: '180deg' }] }]}
                >
                    <Path
                        fill={sharedColors.mainWhite}
                        d="M0,256L60,261.3C120,267,240,277,360,256C480,235,600,181,720,144C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </Svg>
            
                </LinearGradient>
                {open && (
                    <>
                        <AnimatedPressable style={[styles.backdrop, {zIndex: 3}]} entering={FadeIn} exiting={FadeOut} onPress={() => toggleOpen(null)} />
                        <BottomSheet data={open === "type" ? order_types : open === "crypto" ? cryptos : payment_method} title={open === 'type' ? '¿Qué querés hacer?' : open === 'crypto' ? 'Elegir moneda' : 'Método de pago'} onSelect={handleSelect}/>
                    </>
                )}
            </View>
        </GestureHandlerRootView>
        
    )
}


const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: sharedColors.mainWhite,
    },
    scrollView:{
        flex:1,
    },
    buttonsHolder: {
        width: "100%",
        flexDirection: "row",
    },
    button: {
        paddingHorizontal: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    button0: {
        borderEndWidth: 1,
        borderColor: "#00000070",
    },
    myAdsButton: {
        borderColor: "#00000070",
        borderStartWidth: 1,
    },
    text: {
        fontSize: 20,
        color: "#00000070"
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        letterSpacing: 0.4,
        lineHeight: 16
    },
    container: {
        height:100, 
        width: "100%",
        marginTop: 20
    },
    linearGradient: castStyle.view({
        width: "100%",
        height: 125,
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
        zIndex: -1
    }),
    svg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
        bottom: 0,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
})