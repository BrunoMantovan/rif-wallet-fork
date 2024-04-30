import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HomeScreen, ReceiveScreen, SendScreen, SettingsScreen } from 'screens/index'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { HomeStackParamsList, homeStackRouteNames } from './types'
import { screenOptionsWithHeader } from '..'
import { SettingsNavigator } from '../settingsNavigator'

const HomeStack = createStackNavigator<HomeStackParamsList>()

export const HomeNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Home>) => {
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name={homeStackRouteNames.Main}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Send}
        component={SendScreen}
        options={{
          ...screenOptionsWithHeader(top),
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontWeight: '500',
            marginTop: 8,
          },
        }}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Receive}
        component={ReceiveScreen}
        options={{
          ...screenOptionsWithHeader(top),
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontWeight: '500',
            marginTop: 8,
          },
        }}
      />
      <HomeStack.Screen
        name={rootTabsRouteNames.Settings}
        component={SettingsNavigator}
        options={{
          ...screenOptionsWithHeader(top),
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontWeight: '500',
            marginTop: 8,
          },
        }}
      />
    </HomeStack.Navigator>
  )
}
