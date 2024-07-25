import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

import { Typography } from 'components/typography'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { colors } from 'src/styles'
import {
  selectBalances,
  selectTotalUsdValue,
} from 'store/slices/balancesSlice/selectors'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import {
  changeTopColor,
  selectHideBalance,
  setHideBalance,
} from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { HomeBarButtonGroup } from 'screens/home/HomeBarButtonGroup'
import { CurrencyValue, TokenBalance } from 'components/token'
import {
  getIsGettingStartedClosed,
  hasIsGettingStartedClosed,
  saveIsGettingStartedClosed,
} from 'storage/MainStorage'
import { selectTransactions } from 'store/slices/transactionsSlice'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { ActivityBasicRow } from 'screens/activity/ActivityRow'
import { WalletContext } from 'shared/wallet'

import { HomeInformationBar } from './HomeInformationBar'
import { getTokenColor } from './tokenColor'
import { PortfolioComponent } from './PortfolioComponent'
import { AppHeader } from 'src/ux/appHeader'
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { AppTouchable } from 'src/components'
import { rootTabsRouteNames } from 'src/navigation/rootNavigator'
import GearIcon from 'src/components/icons/GearIcon'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'

enum TestID {
  NoTransactionsTypography = 'NoTransactionsTypography',
}
export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Main>) => {
  const { wallet } = useContext(WalletContext)

  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const dispatch = useAppDispatch()

  const tokenBalances = useAppSelector(selectBalances)
  const transactions = useAppSelector(selectTransactions)
  const totalUsdBalance = useAppSelector(selectTotalUsdValue)
  const prices = useAppSelector(selectUsdPrices)
  const hideBalance = useAppSelector(selectHideBalance)

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [selectedTokenBalance, setSelectedTokenBalance] =
    useState<CurrencyValue>({
      balance: '0.00',
      symbol: '',
      symbolType: 'icon',
    })
  const [selectedTokenBalanceUsd, setSelectedTokenBalanceUsd] =
    useState<CurrencyValue>({
      balance: '0.00',
      symbol: '',
      symbolType: 'usd',
    })
  const [showInfoBar, setShowInfoBar] = useState<boolean>(true)

  const balancesArray = Object.values(tokenBalances)

  // token or undefined
  const selected = selectedAddress ? tokenBalances[selectedAddress] : undefined
  const selectedColor = getTokenColor(selected?.symbol || '')
  const backgroundColor = {
    backgroundColor: selectedAddress ? selectedColor : sharedColors.borderColor,
  }

  /*const rampConfig = useMemo(
    () => ({
      // for testnet:
      url: 'https://app.demo.ramp.network',

      // for IOV:
      swapAsset: 'RSK_RDOC',
      // userAddress must be lowercase or checksummed correctly:
      userAddress: wallet
        ? toChecksumAddress(
            wallet.smartWalletAddress,
            getChainIdByType(chainType),
          )
        : '',

      // for the dapp:
      hostAppName: 'RIF Wallet',
      hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
    }),
    [wallet, chainType],
  )

  const ramp = useMemo(() => new RampSdk(), [])

  const addBalance = useCallback(() => {
    ramp.on('*', console.log)
    ramp.show(rampConfig)
  }, [ramp, rampConfig])*/

  const handleBitcoinSendReceive = useCallback(
    (
      screen: 'SEND' | 'RECEIVE' | 'FAUCET',
      _selected: ITokenWithoutLogo & BitcoinNetwork,
    ) => {
      switch (screen) {
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.Receive, {
            networkId: _selected.contractAddress,
          })
        case 'SEND':
          return navigation.navigate(homeStackRouteNames.Send, {
            token: _selected?.symbol,
            contractAddress: _selected?.contractAddress,
          })
      }
    },
    [navigation],
  )

  // interact with the navigation
  const handleSendReceive = useCallback(
    (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
      if (!!selected && 'bips' in selected) {
        return handleBitcoinSendReceive(screen, selected)
      }
      switch (screen) {
        case 'SEND':
          return navigation.navigate(homeStackRouteNames.Send, {
            token: selected?.symbol,
            contractAddress: selected?.contractAddress,
          })
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.Receive, {
            token: selected,
          })
        // case 'FAUCET':
        //   return addBalance()
      }
    },
    [handleBitcoinSendReceive, navigation, selected],
  )

  useEffect(() => {
    
    if (isFocused) {
      dispatch(changeTopColor(selectedColor))
    }
  }, [selectedColor, dispatch, isFocused])

  const selectedToken = useMemo(() => {
    if (selected) {
      if ('satoshis' in selected) {
        return {
          ...selected,
          price: prices.BTC?.price || 0,
        }
      }

      return {
        ...selected,
        price: prices?.[selected.contractAddress]?.price || 0,
      }
    }
    return undefined
  }, [selected, prices])

  useEffect(() => {
    if (selectedToken) {
      const { symbol, balance, usdBalance } = selectedToken
      setSelectedTokenBalance({
        symbolType: 'icon',
        symbol,
        balance: balance.toString(),
      })
      setSelectedTokenBalanceUsd({
        symbolType: 'usd',
        symbol,
        balance: usdBalance.toFixed(2),
      })
    }
    console.log(tokenBalances);
    
  }, [selectedToken])
  const closed = useMemo(() => {
    if (hasIsGettingStartedClosed()) {
      const { close } = getIsGettingStartedClosed()
      return close
    }
    return false
  }, [])

  const onClose = useCallback(() => {
    saveIsGettingStartedClosed({ close: true })
    setShowInfoBar(false)
  }, [])

  const defaultFirstValue: CurrencyValue = {
    balance: totalUsdBalance,
    symbol: '',
    symbolType: 'usd',
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient colors={['#DCE6AAB2', '#C0DDF0B2']} style={styles.linearGradient}>
        
        <View style={styles.innerCard}>
          <AppTouchable
            width={32}
            onPress={() => navigation.navigate(rootTabsRouteNames.Settings)}
            accessibilityLabel="settings"
            style={{position: "absolute", top: "3%", right: "1%", height: 32, zIndex:20}}>
            <Icon
            name={'cog'}
            size={24}
            color={sharedColors.black}
          />
          </AppTouchable>
          <AppHeader/>
          <TokenBalance
            style={styles.tokenBalance}
            firstValue={
              selectedAddress === undefined
                ? defaultFirstValue
                : selectedTokenBalance
            }
            secondValue={
              selectedAddress === undefined ? undefined : selectedTokenBalanceUsd
            }
            hideable={true}
            hide={hideBalance}
            onHide={() => dispatch(setHideBalance(!hideBalance))}
          />
          <HomeBarButtonGroup
            onPress={handleSendReceive}
            isSendDisabled={balancesArray.length === 0}
          />
        </View>
        <Svg
                height="60%"
                width="100%"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                style={[styles.svg, { transform: [{ rotateY: '180deg' }] }]}
              >
                <Path
                    fill={sharedColors.mainWhite}
                     d="M0,256L60,261.3C120,267,240,277,360,256C480,235,600,181,720,144C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                />
          </Svg>
        
          </LinearGradient>
      

      {showInfoBar && !closed && <HomeInformationBar onClose={onClose} />}

      
      <View style={styles.bodyContainer}>
        <Typography style={styles.portfolioLabel} type={'h3'}>
          {t('home_screen_portfolio')}
        </Typography>
        <PortfolioComponent
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          balances={balancesArray.filter(obj => obj.name === "RBTC" || obj.name === "Dollar on Chain" || obj.name === "tRIF Token")}
          totalUsdBalance={totalUsdBalance}
        />

        <Typography style={styles.transactionsLabel} type={'h3'}>
          {t('home_screen_transactions')}
        </Typography>
        {transactions.length > 0 ? (
          <ScrollView>
            {transactions.slice(0, 5).map((tx, index) => (
              <ActivityBasicRow
                key={tx.id + '   ' + index}
                index={index}
                wallet={wallet}
                activityDetails={tx}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        ) : (
          <>
            <Typography style={styles.emptyTransactionsLabel} type={'h3'}>
              {t('home_screen_empty_transactions')}
            </Typography>
            <Typography
              style={styles.emptyTransactionsLabel}
              type={'h4'}
              accessibilityLabel={TestID.NoTransactionsTypography}>
              {t('home_screen_no_transactions_created')}
            </Typography>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bodyContainer: castStyle.view({
    padding: 12,
  }),
  linearGradient: castStyle.view({
    width: "100%",
    height: 225,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative"
  }),
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    bottom: 0,
  },
  innerCard: {
    position: 'absolute',
    backgroundColor: "#FFFFFF",
    width: "90%",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    zIndex: 1,
  },
  tokenBalance: castStyle.view({
    paddingLeft: 24,
    paddingRight: 18,
  }),
  emptyTransactionsLabel: castStyle.text({
    padding: 6,
    paddingTop: 10,
  }),
  portfolioLabel: castStyle.text({
    fontSize: 18,
    fontFamily: "BalooTammudu",
    lineHeight: 27,
    color: "#000000",
    fontWeight: "500",
    zIndex: 4,
    paddingTop: 15
  }),
  transactionItem: castStyle.view({
    paddingHorizontal: 6,
  }),
  transactionsLabel: castStyle.text({
    paddingTop: 24,
    paddingBottom: 16,
    fontSize: 18,
    fontFamily: "BalooTammudu",
    lineHeight: 27,
    color: "#000000",
    fontWeight: "500"
  }),
  container: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.mainWhite,
  }),
  text: castStyle.text({
    textAlign: 'center',
    color: colors.lightPurple,
  }),
  noBalance: castStyle.image({
    width: '100%',
    resizeMode: 'contain',
  }),
})
