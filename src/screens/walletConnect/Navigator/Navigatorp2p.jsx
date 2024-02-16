import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
import BuyOrders from "./BuyOrders"
import SellOrders from './SellOrders'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyOrders from './MyOrders';

const Tab = createMaterialTopTabNavigator();

export const Navigatorp2p = ()=> {
  return (
    <View style={styles.body}>
      
      <Text style={styles.title}>Mercado de pares</Text>
      <Tab.Navigator screenOptions={{   
        tabBarAndroidRipple: {borderless: false},     
        tabBarLabelStyle: { fontSize: 16, fontWeight: "500" },
        tabBarStyle: { backgroundColor: 'transparent', elevation: 0, paddingHorizontal: "5%"},
        tabBarIndicatorStyle: { backgroundColor: 'transparent' },
        tabBarPressOpacity: 1,
        tabBarItemStyle: { borderWidth: 0, width: "auto", paddingHorizontal: 10},
        tabBarGap: 0,  
        swipeEnabled: false,
      }}>        
        <Tab.Screen name="Compra" component={BuyOrders} />
        <Tab.Screen name="Venta" component={SellOrders} />
        <Tab.Screen name="Mis Publicaciones" component={MyOrders} />
      </Tab.Navigator>        
    </View>
  )
}

const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor: "#f9fbfc",
  },
  title:{
    fontSize: 25,
    color: "black",
    fontWeight: "800",
    paddingHorizontal: "5%"
  },
})