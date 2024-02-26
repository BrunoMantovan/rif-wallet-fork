import { PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-vector-icons/Icon'

import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'
import { castStyle } from 'shared/utils'

interface BarButtonGroupIconProps {
  iconName: string
  IconComponent: typeof Icon
  onPress: () => void
  size?: number
}

export const BarButtonGroupIcon = ({
  iconName,
  size = 24,
  IconComponent,
  onPress,
}: BarButtonGroupIconProps) => (
  <AppTouchable
    width={25}
    onPress={onPress}
    style={styles.iconContainerStyle}
    accessibilityLabel={iconName}>
    <IconComponent name={iconName} color="white" size={size} />
  </AppTouchable>
)

interface BarButtonGroupContainerProps {
  backgroundColor?: string
}

export const BarButtonGroupContainer = ({
  backgroundColor = "#0A3F7A",
  children,
}: PropsWithChildren<BarButtonGroupContainerProps>) => {
  return <View style={[styles.view, { backgroundColor }]}>{children}</View>
}

const styles = StyleSheet.create({
  view: castStyle.view({
    height:32,
    width: 139,
    flexDirection: 'row',
    opacity: 0.85,
    borderRadius: 16,
    marginHorizontal: 16,
  }),
  iconContainerStyle: castStyle.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
})
