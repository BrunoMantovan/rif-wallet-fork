import { Modal, StyleSheet, View } from 'react-native'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppSpinner } from 'components/index'
import { CircleSnail } from 'react-native-progress';

interface Props {
  isVisible: boolean
}

export const LoadingScreen = ({ isVisible }: Props) => {
  return (
    <Modal animationType="none" transparent visible={isVisible}>
      <View style={styles.activityIndicatorViewStyle}>
        <View style={styles.spinnerContainer}>
          <CircleSnail
            size={100}         // Spinner size
            thickness={6}      // Thickness of the snail line
            color={sharedColors.bagreen}  // Colors of the spinner (can be an array)
            indeterminate={true}  // Continuous spinning
            direction="clockwise" // Clockwise spinning direction
            strokeCap="round"     // Smooth ends of the spinner
            style={{ backgroundColor: 'transparent' }}  // Transparent background to avoid the black center
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  activityIndicatorViewStyle: castStyle.view({
    backgroundColor: sharedColors.mainWhite,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }),
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
  },
})
