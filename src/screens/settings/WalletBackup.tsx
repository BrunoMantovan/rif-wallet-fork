import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { KeyManagementSystem } from 'lib/core'

import { sharedColors } from 'shared/constants'
import { MnemonicComponent, Typography } from 'components/index'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { castStyle, usePreventScreenshot } from 'shared/utils'
import { getKeys } from 'storage/SecureStorage'
import { getCurrentChainId } from 'storage/ChainStorage'

type Props = SettingsScreenProps<settingsStackRouteNames.WalletBackup>

export const WalletBackup = (_: Props) => {
  const { t } = useTranslation()
  usePreventScreenshot(t)

  const [mnemonic, setMnemonic] = useState<string | null>()
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []

  useEffect(() => {
    const fn = async () => {
      const keys = await getKeys()
      if (keys) {
        const { kms } = KeyManagementSystem.fromSerialized(
          keys,
          getCurrentChainId(),
        )
        console.log("nemonica: ",kms.mnemonic);
        setMnemonic(kms.mnemonic)
      }
    }
    fn()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Typography type="h2" style={styles.title}>
          {t('wallet_backup_subtitle')}
        </Typography>
        <MnemonicComponent words={mnemonicArray} showAdvice={false} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: sharedColors.mainWhite,
    paddingHorizontal: 24,
  }),
  content: castStyle.view({
    marginTop: 24,
  }),
  title: castStyle.text({
    marginVertical: 24,
  }),
})
