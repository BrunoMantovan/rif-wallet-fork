import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { StyleSheet, Text, View } from 'react-native'

interface HomeBarButtonGroupProps {
  onPress: (decision: 'SEND' | 'RECEIVE' | 'FAUCET') => void
  isSendDisabled: boolean
  color?: string
}
export const HomeBarButtonGroup = ({
  onPress,
  isSendDisabled,
  color,
}: HomeBarButtonGroupProps) => (
  <View style={styles.send_recive}>
  <BarButtonGroupContainer backgroundColor={"#0A3F7A"}>
    <BarButtonGroupIcon
      iconName="south-west"
      IconComponent={MaterialIcon}
      onPress={() => onPress('RECEIVE')}
    />
    </BarButtonGroupContainer>
    <BarButtonGroupContainer backgroundColor={"#0A3F7A"}>
    <BarButtonGroupIcon
      iconName="north-east"
      IconComponent={MaterialIcon}
      onPress={() => {
        if (!isSendDisabled) {
          onPress('SEND')
        }
      }}
    />
  </BarButtonGroupContainer>
  </View>
)

const styles = StyleSheet.create({
  send_recive:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
