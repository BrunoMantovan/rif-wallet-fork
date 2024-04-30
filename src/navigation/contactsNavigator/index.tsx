import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ContactsScreen, ContactDetails } from 'screens/contacts'
import { ContactFormScreen } from 'screens/contacts/ContactFormScreen'
import { sharedColors } from 'shared/constants'

import { contactsStackRouteNames, ContactStackParamsList } from './types'
import { screenOptionsWithHeader } from '..'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

const Stack = createStackNavigator<ContactStackParamsList>()

export const ContactsNavigation = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Contacts>) => {
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={contactsStackRouteNames.ContactsList}
        component={ContactsScreen}
        options={{
          headerStyle: {
            backgroundColor: sharedColors.mainWhite
          },
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "BalooTammudu",
            fontWeight: '400',
            color: sharedColors.bablue,
            fontSize: 22,
            paddingTop: 8,
          },
        }}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactForm}
        component={ContactFormScreen}
        options={{
          headerStyle: {
            backgroundColor: sharedColors.mainWhite
          },
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "BalooTammudu",
            fontWeight: '400',
            color: sharedColors.bablue,
            fontSize: 22,
          },
        }}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactDetails}
        component={ContactDetails}
        options={{
          headerStyle: {
            backgroundColor: sharedColors.mainWhite,
          },
          headerTintColor: '#B7CD49',
          headerTitleStyle: {
            fontFamily: "BalooTammudu",
            fontWeight: '400',
            color: sharedColors.bablue,
            fontSize: 22,
            paddingTop: 8,
          },
        }}
      />
    </Stack.Navigator>
  )
}

export * from './types'
