import { Modal, StyleSheet, View } from 'react-native'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppSpinner } from 'components/index'

interface Props {
  isVisible: boolean
}

export const LoadingScreen = ({ isVisible }: Props) => {
  return (
    <Modal animationType="none" transparent visible={isVisible}>
      <View
        style={[
          sharedStyles.flex,
          sharedStyles.contentCenter,
          styles.activityIndicatorViewStyle,
        ]}>
        <View style={styles.spinnerContainer}>
          <AppSpinner color="#B7CD49" size={150} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  activityIndicatorViewStyle: castStyle.view({
    backgroundColor: sharedColors.mainWhite,
  }),
  spinnerContainer: {
    backgroundColor: 'transparent', // Ensure the container is transparent
    borderRadius: 75, // Ensures smooth circle edges
  },
})
