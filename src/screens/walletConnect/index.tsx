import {
  StyleSheet,
  View,
} from 'react-native'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'

/* import { WalletContext } from 'shared/wallet'


import {
  SessionStruct,
  WalletConnect2Context,
  WalletConnect2Provider,
} from './WalletConnect2Context' */

import CompraDoc from './CompraDoc'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const Marketp2p = ({ route }: Props) => {
/*   const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = require('../../shared/constants/p2p.json');
        
        setOrders(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); */

  return (
    <View style={styles.body}>

      
      <Tab.Navigator>
        
        <Tab.Screen name="Comprar" component={CompraDoc} />
      </Tab.Navigator>
        
    </View>
  )
}

const styles = StyleSheet.create({
  body:{
    flex:1,
    backgroundColor: "#ffff",
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
})