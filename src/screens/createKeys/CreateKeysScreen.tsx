import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, View } from 'react-native'

import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  Typography,
} from 'components/index'
import { RifLogo } from 'components/icons/RifLogo'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator'
import { WINDOW_HEIGHT, sharedColors, WINDOW_WIDTH } from 'shared/constants'
import { castStyle } from 'shared/utils'

export const CreateKeysScreen = ({
  navigation,
}: CreateKeysScreenProps<createKeysRouteNames.CreateKeys>) => {
  const { t } = useTranslation()

  return (
    <View style={styles.screen}>
      <Image
        source={require('assets/images/initial_screen.png')}
        style={styles.background}
        resizeMethod={'scale'}
        resizeMode={'cover'}
      />
      <View style={styles.rifLogoContainer}>
        {/* <RifLogo />
        <Typography style={styles.rifLogoText} type={'h1'}>
          {t('initial_screen_title')}
        </Typography> */}
      </View>
      <View style={{position: 'absolute', bottom: WINDOW_HEIGHT * 0.23, width: "100%"}}>
        <Text style={styles.welcome}>Bienvenido a Bolsillo Argento</Text>
      </View>
      {/* <Typography type={'body1'} style={styles.footerText}>
        {t('initial_screen_welcome_footer')}
      </Typography> */}
      <View style={[styles.buttonContainer]}>
        <AppButton
          onPress={() =>
            navigation.navigate(createKeysRouteNames.SecurityInformation, {
              moveTo: createKeysRouteNames.NewMasterKey,
            })
          }
          accessibilityLabel={'newWallet'}
          title={t('initial_screen_button_create')}
          color={sharedColors.white}
          textColor={sharedColors.black}
          style={styles.walletButton}
        />

        <AppButton
          onPress={() =>
            navigation.navigate(createKeysRouteNames.SecurityInformation, {
              moveTo: createKeysRouteNames.ImportMasterKey,
            })
          }
          accessibilityLabel={'importWallet'}
          title={t('initial_screen_button_import')}
          style={styles.importWalletButton}
          backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: "#f9f9ff"
  }),
  background: castStyle.image({
    position: 'absolute',
    height: '60%',
    width: '100%',
    top: WINDOW_HEIGHT * 0.1, // Añadido para centrar verticalmente
    
  }),
  rifLogoContainer: castStyle.view({
    position: 'absolute',
    top: 290,
    left: 30,
  }),
  rifLogoText: castStyle.text({
    fontWeight: '300',
    fontSize: 28,
    color: sharedColors.black,
  }),
  buttonContainer: castStyle.view({
    position: 'absolute',
    bottom: 34,
    left: 30,
    right: 30,
  }),
  footerText: castStyle.text({
    position: 'absolute',
    lineHeight: 15.6,
    bottom: WINDOW_HEIGHT * 0.23,
    left: WINDOW_WIDTH * 0.27
  }),
  walletButton:{
    backgroundColor: sharedColors.bagreen
  },
  importWalletButton: castStyle.view({
    marginTop: 8,
    backgroundColor: sharedColors.bablue
  }),
  welcome:{
    fontSize: 22,
    fontFamily: "Roboto-Medium",
    fontWeight: "bold",
    textAlign: "center",
    color: sharedColors.bablue
  }
})
