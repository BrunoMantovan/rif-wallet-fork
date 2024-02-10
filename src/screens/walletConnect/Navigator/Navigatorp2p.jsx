import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
  import publicacionesDoc from "./PublicacionesDoC"
  import publicacionesRBtc from './PublicacionesRBtc'
  import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

  const Tab = createMaterialTopTabNavigator();

  export const Navigatorp2p = ()=> {

    return (
      <View style={styles.body}>
        
        <Text style={styles.title}>Mercado de pares</Text>
        <Tab.Navigator screenOptions={{   
          tabBarAndroidRipple: {borderless: false},     
          tabBarLabelStyle: { fontSize: 16, fontWeight: "500" },
          tabBarStyle: { backgroundColor: 'transparent', width: 300, elevation: 0, paddingHorizontal: "5%"},
          tabBarIndicatorStyle: { backgroundColor: 'transparent' },
          tabBarPressOpacity: 1,
          tabBarItemStyle: { borderWidth: 0, width: 120},
          tabBarGap: 10,  
          swipeEnabled: false,
        }}>        
          <Tab.Screen name="DoC" component={publicacionesDoc} />
          <Tab.Screen name="rBtc" component={publicacionesRBtc} />
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