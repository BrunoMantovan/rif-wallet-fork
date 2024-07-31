import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Linking, TouchableWithoutFeedback, Image } from 'react-native'
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
import { TouchableOpacity } from 'react-native-gesture-handler'

import { Animated, Easing } from 'react-native';
import { getDefaultTokens } from 'src/core/setup'

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
  const [showPortfolio, setShowPortfolio] = useState<boolean>(false)
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

  let balancesArray = [...Object.values(tokenBalances)];

  /* // Define the desired order
  const desiredOrder = [
    "Dollar on Chain",
    "MOC",
    "Money on Chain Governance Token",
    "BitPro",
    "BitPRO",
    "RBTC",
    "RIF",
    "Testnet RIF Token"
  ];

  // Sort balancesArray according to the desired order
  balancesArray.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.name);
    const indexB = desiredOrder.indexOf(b.name);
    return indexA - indexB;
  }); */
  
  const balancesArrayFiltered = balancesArray.filter(obj => obj.symbol == "RBTC" || obj.symbol === "DOC")
  
  // token or undefined
  const selected = selectedAddress ? tokenBalances[selectedAddress] : undefined
  const selectedColor = getTokenColor(selected?.symbol || '')
  const backgroundColor = {
    backgroundColor: selectedAddress ? selectedColor : sharedColors.borderColor,
  }

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedStyle = {
    height: animatedHeight,
    overflow: 'hidden', // Ensures content is hidden when height is 0
  };

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showPortfolio ? 80 : 0, // Adjust the `200` value as needed
      duration: 200, // Adjust the duration as needed
      easing: Easing.ease,
      useNativeDriver: false, // Set to true for better performance if using transform or opacity
    }).start();
  }, [showPortfolio]);

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
  const togglePortfolio = () => {
    setShowPortfolio(!showPortfolio)
  }

  const goToLink = async () => {
    const url = 'https://linktr.ee/bolsilloargento';
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

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
      <TouchableOpacity onPress={togglePortfolio} style={{flexDirection: "row", alignItems: "center", marginBottom: showPortfolio ? 0 : 24 }}>
      <Typography style={styles.portfolioLabel} type={'h3'}>
        {t('home_screen_portfolio')}
      </Typography>
          
          <FontAwesome5Icon
          name={showPortfolio ? 'chevron-down' : 'chevron-up'}
          size={24}
          color={sharedColors.black}
          style={{marginLeft: 8, paddingTop: 10}}
          />
        </TouchableOpacity>
        {showPortfolio && (
          <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <PortfolioComponent
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            balances={balancesArrayFiltered}
            totalUsdBalance={totalUsdBalance}
          />
          </Animated.View>
        )}

        <TouchableOpacity style={{width: "100%"}} onPress={goToLink}>
          <View style={styles.linkBox}>
            <Text style={{fontSize: 18, color: sharedColors.bablue, fontFamily: "Roboto-Medium", fontWeight: "500"}}>Conseguir DOC </Text>
            <Image source={require("../../images/linktree.png")} style={styles.linktree}/>
          </View>
        </TouchableOpacity>

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
  animatedContainer: {
    width: '100%',
    marginBottom: 24,
  },
  linkBox:{flexDirection: "row",
    width: "100%",
    borderRadius: 16,
    backgroundColor: sharedColors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
    borderColor: sharedColors.inputBorder,
    borderWidth: 1,
  },
  linktree: {
    width: 24,
    height: 24,
    marginLeft: 8,
  }
})
