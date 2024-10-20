import { CircleSnail, CircleSnailPropTypes } from 'react-native-progress'

import { sharedColors } from 'shared/constants'

interface Props extends CircleSnailPropTypes {
  size: number
}

export const AppSpinner = ({
  size,
  color = sharedColors.bagreen,
  thickness = 20,
  ...props
}: Props) => {
  return (
    <CircleSnail
      size={size + (thickness ? thickness * 2 : 20 * 2)}
      thickness={thickness}
      strokeCap={'butt'}
      indeterminate={true}
      color={color}
      direction={'clockwise'}
      {...props}
      style={{ backgroundColor: sharedColors.mainWhite }} 
    />
  )
}
