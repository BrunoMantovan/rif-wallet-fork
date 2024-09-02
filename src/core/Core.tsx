import { useCallback, useContext, useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { RequestHandler } from 'src/ux/requestsModal/RequestHandler'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectTopColor,
  unlockApp,
} from 'store/slices/settingsSlice'
import { sharedColors, sharedStyles } from 'shared/constants'
import { WalletConnect2Provider } from 'screens/walletConnect/WalletConnect2Context'
import { WalletContext } from 'shared/wallet'
import { useSetGlobalError } from 'components/GlobalErrorHandler'

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'
import { useIsOffline } from './hooks/useIsOffline'
import MarketProvider from 'src/screens/walletConnect/MarketContext'
/* import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { NotificationListeners } from 'src/NotificationListener'
import notifee, { AndroidImportance } from '@notifee/react-native'; */

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const dispatch = useAppDispatch()
  const requests = useAppSelector(selectRequests)
  const topColor = useAppSelector(selectTopColor)
  const setGlobalError = useSetGlobalError()
  const isOffline = useIsOffline()
  const { active, unlocked } = useStateSubscription()
  const { wallet, initializeWallet } = useContext(WalletContext)

  const unlockAppFn = useCallback(async () => {
    try {
      await dispatch(
        unlockApp({ isOffline, initializeWallet, setGlobalError }),
      ).unwrap()
    } catch (err) {
      console.log('ERR CORE', err)
    }
  }, [dispatch, isOffline, initializeWallet, setGlobalError])

  useEffect(() => {
    unlockAppFn()
  }, [unlockAppFn])

  /* async function requestUserPermission() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('Token: ', token);
    }
  }
  useEffect(() => {
    requestUserPermission()
    async function setupNotificationChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    setupNotificationChannel();
    NotificationListeners();
  
  }, []) */
  //instalar dependecias que estan comentadas arriba
  return (
    <SafeAreaProvider>
      <View style={sharedStyles.flex}>
        <StatusBar backgroundColor={sharedColors.bablue} />
        {!active && <Cover />}
        <NavigationContainer ref={navigationContainerRef}>
        <MarketProvider>
          <WalletConnect2Provider wallet={wallet}>
            <>
              <RootNavigationComponent />
              {requests.length !== 0 && wallet && unlocked && (
                <RequestHandler
                  wallet={wallet}
                  request={requests[0]}
                  closeRequest={() => dispatch(closeRequest())}
                />
              )}
            </>
          </WalletConnect2Provider>
          </MarketProvider>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  )
}
