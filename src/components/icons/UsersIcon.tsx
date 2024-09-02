import Svg, { Path, Rect } from 'react-native-svg'

import { FooterIconInterface } from '.'

const UsersIcon = ({ active = false, ...props }: FooterIconInterface) => (
  <Svg width={52} height={52} fill="none" {...props}>
    {active && <Rect width={52} height={52} fill="#C9E6FF" rx={26} />}
    <Path
      id="Vector"
      d="M10 16H16M4 8H7M4 12H7M4 16H7M20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H8C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18V6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6ZM15 11C15 12.1046 14.1046 13 13 13C11.8954 13 11 12.1046 11 11C11 9.89543 11.8954 9 13 9C14.1046 9 15 9.89543 15 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.5)"
      y={8}
      x={7}
    />
  </Svg>
)
export default UsersIcon

