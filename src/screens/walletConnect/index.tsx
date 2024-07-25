import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { Navigatorp2p } from './Navigator/Navigatorp2p'
import LoginScreen from './Login/LoginScreen'
import { useMarket } from './MarketContext'
import SignUpScreen from './Login/SignUpScreen'
import { NavigatorLogin } from './Navigator/NavigatorLogin'
import { sharedColors } from 'src/shared/constants'

/* import { WalletContext } from 'shared/wallet'


import {
  SessionStruct,
  WalletConnect2Context,
  WalletConnect2Provider,
} from './WalletConnect2Context' */

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>


export const Marketp2p: React.FC = (/* { route }: Props */) => {
  const { logged } = useMarket();
  return (

    <View style={styles.body}> 
      {/* <Navigatorp2p />  */}    
      {/* {logged ? <Navigatorp2p /> : <NavigatorLogin/>} */}
      <Text style={styles.text}>Mercado de Pares</Text>
      <Text style={styles.text}>Próximamente </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor: "#f9fbfc",
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: "10%"
  },
  text: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
    fontWeight: "500",
    color: sharedColors.bablue,
    textAlign: "center"
  }
})