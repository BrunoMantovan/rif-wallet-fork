import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
import BuyOrders from "../Orders/BuyOrders"
import SellOrders from '../Orders/SellOrders'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MyOrders from '../Orders/MyOrders';
import Title from '../Components/Title';
import OrderDetails from '../Orders/OrderDetails';
import { useMarket } from '../MarketContext';
import OrderTaken from '../Orders/OrderTaken';

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const BuyOrdersStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="BuyOrders" component={BuyOrders} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} />
    <Stack.Screen name="OrderTaken" component={OrderTaken}/>
  </Stack.Navigator>
);

export const Navigatorp2p = ()=> {
  const { hideTab } = useMarket();

  return (
    <View style={styles.body}>
      <Title title="Mercado de Pares"/>
      {/* <Text style={styles.title}>Mercado de pares</Text> */}
        <Tab.Navigator tabBar={hideTab ? () => null : undefined} screenOptions={{   
          tabBarAndroidRipple: {borderless: false},     
          tabBarLabelStyle: { fontSize: 16, fontWeight: "500" },
          tabBarStyle: { backgroundColor: 'transparent', elevation: 0, paddingHorizontal: "5%"},
          tabBarIndicatorStyle: { backgroundColor: 'transparent' },
          tabBarPressOpacity: 1,
          tabBarItemStyle: { borderWidth: 0, width: "auto", paddingHorizontal: 10},
          tabBarGap: 0,  
          swipeEnabled: false,
        }}>        
          <Tab.Screen name="Compra" component={BuyOrdersStack} />
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
    marginTop: "5%",
    
  },
})