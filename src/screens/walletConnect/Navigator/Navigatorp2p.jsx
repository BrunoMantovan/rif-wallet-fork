import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
import Market from "../Orders/Market"
import OrderSearch from '../Orders/OrderSearch'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MyOrders from '../Orders/MyOrders';
import Title from '../Components/Title';
import OrderDetails from '../Orders/OrderDetails';
import { useMarket } from '../MarketContext';
import OrderTaken from '../Orders/OrderTaken';
import { sharedColors } from 'src/shared/constants';
import SignUpScreen from '../Login/SignUpScreen';

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const MarketStack = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: sharedColors.mainWhite,
    },
    headerTintColor: '#A4B741',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: "Roboto-Medium",
      color: "#0A3F7A"
    },}}>
    <Stack.Screen name="Market" component={Market} options={{ headerShown: false }} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ title: false }}/>
    <Stack.Screen name="OrderTaken" component={OrderTaken} options={{ title: false }}/>
    <Stack.Screen name="Mercado" component={OrderSearch}/>
    <Stack.Screen name="signUp" component={SignUpScreen} options={{ title: false }}/>
  </Stack.Navigator>
);

export const Navigatorp2p = ()=> {
  const { hideTab } = useMarket();

  return (
    <View style={styles.body}>
      {/* <Text style={styles.title}>Mercado de pares</Text> */}
        <Tab.Navigator tabBar={hideTab ? () => null : undefined} screenOptions={{   
          tabBarAndroidRipple: {borderless: false},     
          tabBarLabelStyle: { fontSize: 16, fontWeight: "500" },
          tabBarStyle: { backgroundColor: 'transparent', elevation: 0, width: "100%"},
          tabBarIndicatorStyle: { backgroundColor: '#0A3F7A' },
          tabBarPressOpacity: 1,
          tabBarItemStyle: { borderWidth: 0, paddingHorizontal: 10}, 
          swipeEnabled: false,
        }}>        
          <Tab.Screen name="Mercado de pares" component={MarketStack} />
         {/*  <Tab.Screen name="Venta" component={SellOrders} /> */}
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