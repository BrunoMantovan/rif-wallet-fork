import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { useMarket } from '../MarketContext';
import { sharedColors } from 'src/shared/constants';
import SignUpScreen from '../Login/SignUpScreen';
import LoginScreen from '../Login/LoginScreen';


const Stack = createStackNavigator()

export const NavigatorLogin = ()=> {
  const { hideTab } = useMarket();

  return (
    <View style={styles.body}>
        <Stack.Navigator screenOptions={{
            headerStyle: {backgroundColor: sharedColors.mainWhite,},
            headerTintColor: '#A4B741',
            headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: "Roboto-Medium",
            color: "#0A3F7A"
            },}}>
            <Stack.Screen name="signIn" component={LoginScreen} options={{ title: false }} />
            <Stack.Screen name="signUp" component={SignUpScreen} options={{ title: false }}/>
        </Stack.Navigator>
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