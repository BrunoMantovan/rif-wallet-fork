import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Share,
  ActivityIndicator,
  Text
} from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { showMessage } from 'react-native-flash-message'

import { shortAddress } from 'lib/utils'

import { getAddressDisplayText, Input, Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { MixedTokenAndNetworkType } from 'screens/send/types'
import { selectBitcoin, selectChainId } from 'store/slices/settingsSlice'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { getTokenColor } from 'screens/home/tokenColor'
import { castStyle } from 'shared/utils'
import { selectProfile, selectUsername } from 'store/slices/profileSlice'
import { getIconSource } from 'screens/home/TokenImage'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { getPopupMessage } from 'shared/popupMessage'
import { useWallet } from 'shared/wallet'
import { rootTabsRouteNames } from 'navigation/rootNavigator'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  UsernameText = 'Address.UsernameText',
  ShareAddressButton = 'Address.ShareButton',
  ShareUsernameButton = 'Username.ShareButton',
}

export const ReceiveScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<homeStackRouteNames.Receive>) => {
  const { t } = useTranslation()
  const methods = useForm()
  const bitcoinCore = useAppSelector(selectBitcoin)

  const tokenBalances = useAppSelector(selectBalances)
  const username = useAppSelector(selectUsername)

  const { token, networkId } = route.params
  const [selectedAsset, setSelectedAsset] = useState<
    MixedTokenAndNetworkType | undefined
  >(
    (networkId && bitcoinCore?.networksMap[networkId]) ||
      token ||
      Object.values(tokenBalances)[0],
  )
  const [address, setAddress] = useState<string>('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)

  const [shouldShowAssets, setShouldShowAssets] = useState(true)

  const { address: walletAddress } = useWallet()
  const chainId = useAppSelector(selectChainId)
  const profile = useAppSelector(selectProfile)

  const rskAddress = useMemo(() => {
    if (chainId) {
      return getAddressDisplayText(walletAddress, chainId)
    }
    return null
  }, [walletAddress, chainId])

  const onShareUsername = useCallback(() => {
    Share.share({
      message: profile?.alias || '',
    })
  }, [profile?.alias])

  const onShareAddress = useCallback(() => {
    Share.share({
      message: address,
    })
  }, [address])

  const onChevronAssetShowTap = useCallback(
    () => setShouldShowAssets(curr => !curr),
    [],
  )

  // Function to get the address
  const onGetAddress = useCallback(
    (asset: MixedTokenAndNetworkType) => {
      if (asset) {
        setIsAddressLoading(true)
        if ('bips' in asset) {
          asset.bips[0]
            .fetchExternalAvailableAddress({})
            .then(addressReturned => setAddress(addressReturned))
            .finally(() => setIsAddressLoading(false))
        } else {
          setAddress(rskAddress?.checksumAddress || '')
          setIsAddressLoading(false)
        }
      }
    },
    [rskAddress?.checksumAddress],
  )

  const onChangeSelectedAsset = useCallback(
    asset => () => setSelectedAsset(asset),
    [],
  )

  useEffect(() => {
    if (selectedAsset) {
      onGetAddress(selectedAsset)
    }
  }, [onGetAddress, selectedAsset])

  /* useEffect(() => {
    if (!username) {
      showMessage(
        getPopupMessage(t('popup_message_rns'), t('popup_link_text'), () =>
          navigation.navigate(rootTabsRouteNames.Profile),
        ),
      )
    }
  }, [username, t, navigation]) */

  return (
    <ScrollView style={styles.parent}>
      <FormProvider {...methods}>
        {/* Change Asset Component */}
        <View style={styles.flexRow}>
          <Text style={{fontSize:20, fontFamily: "Roboto-Medium", color: sharedColors.bablue, fontWeight: "bold"}}>Seleccionar activos</Text>
          <FontAwesome5Icon
            name={shouldShowAssets ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="white"
            onPress={onChevronAssetShowTap}
            style={styles.assetsChevronText}
          />
        </View>
        {shouldShowAssets && (
          <ScrollView horizontal>
            {Object.values(tokenBalances).map(asset => {
              const isSelected =
                selectedAsset !== undefined &&
                selectedAsset.symbol === asset.symbol

              const color = isSelected
                ? getTokenColor(asset.symbol)
                : sharedColors.white

              return (
                <View style={{height: 85, alignItems:"center", justifyContent: "center",}}>
                  <PortfolioCard
                  key={asset.symbol}
                  onPress={onChangeSelectedAsset(asset)}
                  color={color}
                  primaryText={asset.symbol}
                  secondaryText={asset.balance}
                  isSelected={isSelected}
                  disabled={isAddressLoading}
                  />
                </View>
              )
            })}
          </ScrollView>
        )}
        {/* QR Component */}
        {address !== '' && !isAddressLoading && (
          <View style={styles.qrViewSryle}>
            <QRGenerator
              key={selectedAsset?.symbol}
              value={address}
              logoBackgroundColor={sharedColors.black}
              accessibilityLabel={TestID.QRCodeDisplay}
            />
          </View>
        )}
        {isAddressLoading && (
          <View style={styles.addressLoadingView}>
            <Typography type="h4" style={styles.loadingTypographyStyle}>
              {t('loading_qr')}...
            </Typography>
            <ActivityIndicator size={'large'} />
          </View>
        )}

        {/* Username Component */}
        {profile.status === ProfileStatus.USER && (
          <Input
            containerStyle={styles.usernameInput}
            label={t('receive_screen_username_label')}
            inputName="username"
            rightIcon={
              <Ionicons
                name="share-outline"
                size={20}
                color={sharedColors.bablue}
                onPress={onShareUsername}
                testID={TestID.ShareUsernameButton}
                disabled
              />
            }
            placeholder={profile.alias}
            isReadOnly
            testID={TestID.UsernameText}
          />
        )}

        {/* Address Component */}
        {isAddressLoading && (
          <View style={[styles.addressLoadingView, styles.marginTopView]}>
            <Typography type="h4" style={styles.loadingTypographyStyle}>
              {t('loading_address')}...
            </Typography>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isAddressLoading && (
          <Input
            label="Mi dirección"
            inputName="address"
            rightIcon={
              <Ionicons
                name="share-outline"
                size={20}
                color={sharedColors.bablue}
                onPress={onShareAddress}
                testID={TestID.ShareAddressButton}
              />
            }
            placeholder={shortAddress(address, 10)}
            isReadOnly
            testID={TestID.AddressText}
          />
        )}
      </FormProvider>
      <View style={styles.emptyPadding} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: castStyle.view({
    backgroundColor: sharedColors.mainWhite,
    flex: 1,
    paddingHorizontal: 12,
  }),
  qrView: castStyle.view({
    paddingHorizontal: 35,
    paddingVertical: 84,
    borderRadius: 20,
    marginTop: 5,
  }),
  headerStyle: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 22.5,
  }),
  emptyPadding: castStyle.view({
    paddingVertical: 15,
  }),
  flexRow: castStyle.view({
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  }),
  loadingTypographyStyle: castStyle.text({
    textAlign: 'center',
    marginBottom: 10,
  }),
  addressLoadingView: castStyle.view({
    justifyContent: 'center',
  }),
  marginTopView: castStyle.view({
    marginTop: 20,
  }),
  flexView: castStyle.view({
    flex: 1,
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
  width50View: castStyle.view({
    width: '50%',
  }),
  assetsChevronText: castStyle.text({
    width: '25%',
    textAlign: 'right',
  }),
  usernameInput: castStyle.view({ marginTop: 30 }),
  qrViewSryle: castStyle.view({
    padding: 32,
    backgroundColor: sharedColors.mainWhite,
    width:248,
    height: 248,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderColor: sharedColors.grey,
    borderWidth: 1.5,
    marginTop: 16,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.5, // Radio de la sombra
    elevation: 5, // Elevación para Android
    marginBottom: 20,
  })
})
