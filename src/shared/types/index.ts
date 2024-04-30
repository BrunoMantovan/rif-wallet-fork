import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { Request } from '@rsksmart/rif-wallet-core'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest

export interface Contact {
  name: string
  address: string
  displayAddress: string
  isEditable?: boolean
  date: string
}

export type Contacts = Record<string, Contact>

export type ContactWithAddressRequired = Partial<Omit<Contact, 'address'>> & {
  address: string
}

export type ActivityMainScreenProps =
  RootTabsScreenProps<rootTabsRouteNames.Activity>
