import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppTouchable } from 'components/appTouchable'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import HomeIcon from 'src/components/icons/HomeIcon'
import NetworkIcon from 'src/components/icons/NetworkIcon'
import GearIcon from 'src/components/icons/GearIcon'
import { ScanIcon } from 'src/components/icons/ScanIcon'
import TransactionsIcon from 'src/components/icons/TransactionsIcon'
import UsersIcon from 'src/components/icons/UsersIcon'

const buttonWidth = 64

export const AppFooterMenu = ({ navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets()

  const { routeNames, index } = navigation.getState()
  const currentRouteName = routeNames[index]

  return (
    <View
      style={[
        styles.container,
        sharedStyles.paddingHorizontal24,
        { paddingBottom: bottom + 4 },
      ]}>
      <AppTouchable
        width={buttonWidth}
        onPress={() =>
          navigation.navigate(rootTabsRouteNames.Home, {
            screen: homeStackRouteNames.Main,
          })
        }
        accessibilityLabel="home">
        <HomeIcon active={currentRouteName === rootTabsRouteNames.Home} />
        {/* <Text>Inicio</Text> */}
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.WalletConnect)}
        accessibilityLabel="dapps">
        <NetworkIcon
          active={currentRouteName === rootTabsRouteNames.WalletConnect}/>
          {/* <Text>Mercado</Text> */}
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Contacts)}
        accessibilityLabel="contacts">
        <UsersIcon active={currentRouteName === rootTabsRouteNames.Contacts} />
        {/* <Text>Contactos</Text> */}
      </AppTouchable>

      {/* <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Settings)}
        accessibilityLabel="settings">
        <GearIcon
          active={currentRouteName === rootTabsRouteNames.Settings}/>
          <Text>configuración</Text>
      </AppTouchable> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: sharedColors.white,
  }),
  walletIcon: {
    height: 20,
    resizeMode: 'contain',
  },
  centralButton: castStyle.view({
    backgroundColor: sharedColors.white,
    borderRadius: 26,
  }),
  rotation: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
})
