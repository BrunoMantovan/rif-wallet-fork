import { View, Text, Dimensions, StyleSheet, Pressable, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../Login/ButtonCustom'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import InputText from '../Login/InputText'


const {height: SCREEN_HEIGHT} = Dimensions.get("window");




export default function BottomSheet(props) {

    const [cbu, setCbu] = useState()
    const [alias, setAlias] = useState()
    const [reference, setReference] = useState()
    const [infoBool, setInfoBool] = useState(false)
    const array = props.data ? props.data : null

    const handleNumberChange = (value, input) => {
        if(input == 1){
            setCbu(value);
        }else if(input == 2){
            setAlias(value)
        }else if(input == 3){
            setReference(value)
        }
    };
    useEffect(()=>{
        if(cbu?.toString().length === 22 && alias && reference){
            setInfoBool(true)
        }
        console.log(infoBool);
    }, [cbu, alias, reference])
    
    return (
        <Animated.View style={[styles.bottomSheetContainer, props.maxHeight ? {maxHeight: props.maxHeight} : {}]} entering={SlideInDown.springify().damping(17)} exiting={SlideOutDown}>
            <View style={styles.line}/>
            {Array.isArray(props.data) ?
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {props.title ? <Text style={styles.title}>{props.title}</Text> : null}
                    {array.map((data, index) => (
                        <Pressable key={index} style={styles.pressable} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}} 
                        onPress={() => props.onSelect(data.text)}>
                            <View style={{flexDirection: "row"}}>
                                {data.image && <Image source={data.image} style={styles.image}/>}
                                <Text style={styles.subtitle}>{data.text}</Text>
                            </View>
                            <FontAwesome5Icon
                                name={'chevron-right'}
                                size={24}
                                color={sharedColors.bablue}
                            />
                        </Pressable>
                    ))}
                </ScrollView> : props.data === 1 ?
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View>
                            <Text style={styles.bankTxt}>Cuenta bancaria</Text>
                            <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#464D51" }]}>
                                Ingrese los datos de la cuenta donde desea recibir el dinero
                            </Text>
                            <InputText value={reference} setValue={(value) => handleNumberChange(value, 3)} placeholder="Referencia" />
                            <InputText value={cbu} setValue={(value) => handleNumberChange(value, 1)} placeholder="CBU" keyboard="numeric" maxLength={22}/>
                            <InputText value={alias} setValue={(value) => handleNumberChange(value, 2)} placeholder="Alias" />
                        </View>
                        <View style={{flexDirection:"row", justifyContent: "space-between"}}>
                            <ButtonCustom text="Cancelar" type="tertiary" borderColor="#8C9094" width="49%" onPress={props.onCancel}/>
                            <ButtonCustom text="Confirmar" type={infoBool ? "green" : "disabled"} width="49%" onPress={()=>props.onConfirm(cbu, alias, reference)}/>    
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView> :
                <View>
                    <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                        <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#B0B3B5", fontSize: 14 }]}>Precio por unidad</Text>
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>{props.price} ARS</Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                        <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#B0B3B5", fontSize: 14 }]}>Monto de la operación</Text>
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>{props.cryptoTotal} {props.crypto}</Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#B0B3B5", fontSize: 14 }]}>Cantidad a {props.type}</Text>
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>{props.fiatTotal} ARS</Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                        <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#B0B3B5", fontSize: 14 }]}>Método de pago</Text>
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>{props.paymentMethod}</Text>
                    </View>
                </View>
            }
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        width: "100%",
        backgroundColor: sharedColors.mainWhite,
        position: "absolute",
        bottom: -20 * 1.1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 16,
        zIndex: 4,
        paddingBottom: 44,
    },
    line: {
        width: 32,
        height: 4,
        backgroundColor: sharedColors.inputActive,
        alignSelf: "center",
        marginVertical: 16,
        borderRadius: 100,
    },
    title: {
        fontSize: 16,
        fontFamily: "BalooTammudu",
        textAlign: "center",
        fontWeight: "400",
        color: "#444548",
        letterSpacing: 0.16,
    },
    pressable: {
        width: "100%",
        height: 56,
        padding: 16,
        paddingLeft: 12,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#D2E6F799",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
    },
    subtitle: {
        color: sharedColors.inputText,
        letterSpacing: 0.25,
        fontSize: 14,
        fontFamily: "Roboto-Medium",
        fontWeight: "400",
        textAlign: "center",
    },
    image: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    bankTxt:{
        fontFamily:"BalooTammudu",
        fontWeight: "400",
        fontSize: 18,
        textAlign: "center",
        color: "#444548",
        letterSpacing: 0.16,
        marginVertical: 6,
    }
})