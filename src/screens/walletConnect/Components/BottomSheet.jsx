import { View, Text, Dimensions, StyleSheet, Pressable, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { SlideInDown, SlideOutDown, set, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { sharedColors } from 'src/shared/constants'
import ButtonCustom from '../Login/ButtonCustom'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import InputText from '../Login/InputText'


const {height: SCREEN_HEIGHT} = Dimensions.get("window");




export default function BottomSheet(props) {

    const [cbu, setCbu] = useState()
    const [alias, setAlias] = useState()
    const [reference, setReference] = useState()
    const [owner, setOwner] = useState()
    const [infoBool, setInfoBool] = useState(false)
    const array = props.data ? props.data : null
    const [accountType, setAccountType] = useState('')

    const handleNumberChange = (value, input) => {
        if(input == 1){
            setCbu(value);
        }else if(input == 2){
            setAlias(value)
        }else if(input == 3){
            setReference(value)
        }else if(input == 4){
            setOwner(value)
        }
    };
    useEffect(()=>{
        if(cbu?.toString().length === 22 && alias && reference && owner && accountType){
            setInfoBool(true)
        }
    }, [cbu, alias, reference, owner, accountType])
    
    return (
        <Animated.View style={[styles.bottomSheetContainer, props.maxHeight ? {maxHeight: props.maxHeight} : {}]} entering={SlideInDown.springify().damping(17)} exiting={SlideOutDown}>
            <View style={styles.line}/>
            {Array.isArray(props.data) ?
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {props.title ? <Text style={styles.title}>{props.title}</Text> : null}
                    {array.map((data, index) => (
                        <Pressable  key={index} style={styles.pressable} android_ripple={{borderless: false, foreground: true, color: sharedColors.balightblue1}} 
                        onPress={() => props.onSelect(data.text ? data.text : data.alias)}>
                            <View style={{flexDirection: "row"}}>
                                {data.image && <Image source={data.image} style={styles.image}/>}
                                <Text style={styles.subtitle}>{data.text ? data.text : `${data.entity} (${data.alias})`}</Text>
                            </View>
                            {data.alias ? <Pressable onPress={() => props.onEliminate(data.alias)}>
                                <FontAwesome5Icon
                                name={'trash-alt'}
                                size={24}
                                color={sharedColors.dangerLight}
                                />
                            </Pressable> : <FontAwesome5Icon
                                name={'chevron-right'}
                                size={24}
                                color={sharedColors.bablue}
                                />}
                            
                        </Pressable>
                    ))}
                </ScrollView> : props.data === 1 ?
                <KeyboardAvoidingView behavior="padding" style={{ height: 300}}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View>
                            <Text style={styles.bankTxt}>Cuenta bancaria</Text>
                            <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#464D51" }]}>
                                Ingrese los datos de la cuenta donde desea recibir el dinero
                            </Text>
                            <View style={styles.radioContainer}>
                                <Pressable onPress={() => setAccountType('FINTECH')} style={styles.radioButton}>
                                    <FontAwesome5Icon 
                                        name={accountType === 'FINTECH' ? 'dot-circle' : 'circle'} 
                                        size={20} 
                                        color={accountType === 'FINTECH' ? sharedColors.bablue : '#ccc'}
                                    />
                                    <Text style={styles.radioLabel}>Fintech</Text>
                                </Pressable>
                                <Pressable onPress={() => setAccountType('BANK')} style={styles.radioButton}>
                                    <FontAwesome5Icon 
                                        name={accountType === 'BANK' ? 'dot-circle' : 'circle'} 
                                        size={20} 
                                        color={accountType === 'BANK' ? sharedColors.bablue : '#ccc'}
                                    />
                                    <Text style={styles.radioLabel}>Banco</Text>
                                </Pressable>
                            </View>
                            <InputText value={owner} setValue={(value) => handleNumberChange(value, 4)} placeholder="Titular" />
                            <InputText value={reference} setValue={(value) => handleNumberChange(value, 3)} placeholder="Banco/Billetera virtual" />
                            <InputText value={cbu} setValue={(value) => handleNumberChange(value, 1)} placeholder="CBU" keyboard="numeric" maxLength={22}/>
                            <InputText value={alias} setValue={(value) => handleNumberChange(value, 2)} placeholder="Alias" />
                        </View>
                        <View style={{flexDirection:"row", justifyContent: "space-between"}}>
                            <ButtonCustom text="Cancelar" type="tertiary" borderColor="#8C9094" width="49%" onPress={props.onCancel}/>
                            <ButtonCustom text="Confirmar" type={infoBool ? "green" : "disabled"} width="49%" onPress={()=>props.onConfirm(cbu, alias, reference, owner, accountType)}/>    
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
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>Transferencia bancaria</Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                        <Text style={[styles.bankTxt, { letterSpacing: 0.5, color: "#B0B3B5", fontSize: 14 }]}>Billetera</Text>
                        <Text style={[styles.bankTxt, {color: "#3A3F42" }]}>{props.address}</Text>
                    </View>
                        <ButtonCustom text="Confirmar" type={"green"} width="100%" onPress={()=>props.onClick()}/>
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
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: "#464D51",
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
        color: sharedColors.bablue,
        letterSpacing: 0.25,
        fontSize: 18,
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