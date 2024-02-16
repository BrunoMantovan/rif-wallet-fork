import {
  StyleSheet,
  View,
} from 'react-native'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { Navigatorp2p } from './Navigator/Navigatorp2p'
import { useState } from 'react'
import LoginScreen from './Login/LoginScreen'
import { useMarket } from './MarketContext'

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
      {logged ? <Navigatorp2p /> : <LoginScreen/>}
    </View>
  )
}

const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor: "#ffff",
  },
})