import { useEffect, useMemo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { shortAddress } from 'lib/utils'

import {
  AppButton,
  AppTouchable,
  Typography,
  buttonHeight,
} from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { contactsStackRouteNames } from 'navigation/contactsNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  getContactsAsArrayAndSelected,
  selectRecentContacts,
} from 'store/slices/contactsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { Search } from 'components/input/search'
import { BasicRow } from 'components/BasicRow'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { Contact } from 'shared/types'
import { castStyle } from 'shared/utils'

import { ContactsStackScreenProps } from '../index'
import { ContactCard } from './components/ContactCard'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { current } from '@reduxjs/toolkit'

export type ContactsListScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactsList>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

export const ContactsScreen = ({ navigation }: ContactsListScreenProps) => {
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  })
  const { resetField, watch } = methods
  const { t } = useTranslation()
  const { contacts } = useAppSelector(getContactsAsArrayAndSelected)
  const recentContacts = useAppSelector(selectRecentContacts)

  const searchContactText = watch('search')

  const [searchShown, setSearchShown] = useState(false)

  const contactsFiltered = useMemo(() => {
    let filtered = contacts
    if (searchContactText) {
      filtered = contacts.filter(
        contact =>
          contact.name
            .toLowerCase()
            .includes(searchContactText.toLowerCase()) ||
          contact.displayAddress
            .toLowerCase()
            .includes(searchContactText.toLowerCase()),
      )
    }
    return filtered.sort(({ name: a }, { name: b }) => a.localeCompare(b))
  }, [contacts, searchContactText])

  const onSearchReset = useCallback(() => {
    resetField('search')
  }, [resetField])

  const onSendToRecentContact = useCallback(
    (contact: Contact) => () => {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: { contact, backScreen: contactsStackRouteNames.ContactsList },
      })
    },
    [navigation],
  )

  function toggleSearch(){
    setSearchShown(!searchShown)
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.black))
    }
  }, [dispatch, isFocused])

  return (
    <View style={sharedStyles.screen}>
      {/* <Typography type={'h2'} style={styles.title}>
        {t('contacts_screen_title')}
      </Typography>  */}
      {/* {recentContacts?.length > 0 && (
        <View style={styles.recentContacts}>
          <ScrollView horizontal>
            {recentContacts.map((c, i) => (
              <ContactCard
                key={i}
                name={c.name}
                onPress={onSendToRecentContact(c)}
              />
            ))}
          </ScrollView>
        </View>
      )}  */}
      
      <FormProvider {...methods}>
        {contacts.length === 0 ? (
          <View style={{backgroundColor: sharedColors.mainWhite, flex: 1, width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.noContact}>Todavía no has creado ningún contacto</Text>
          </View>
        ) : (
          <>
            <View style={{width: "100%", alignItems: "flex-end"}}>
              <AppTouchable
              onPress={toggleSearch}
              width={32}
              style={{alignItems: "center", justifyContent: "center", borderRadius: 100,}}
              >
                <FontAwesome5Icon
                  name={'search'}
                  size={24}
                  color={sharedColors.bablue}                  
                  style={styles.fontAwesomeStyle}
                />
              </AppTouchable>
            </View>
            {searchShown ? (
              <Search
              label={t('contacts_search_label')}
              containerStyle={styles.searchInput}
              inputName={'search'}
              resetValue={onSearchReset}
              placeholder={t('search_placeholder')}
              testID={testIDs.searchInput}
              accessibilityLabel={testIDs.searchInput}
              placeholderStyle={{
                fontSize: 16,
                lineHeight: 24,
                letterSpacing: 0.5,
              }}
            />
            ) : null}
            
            <ScrollView
              style={styles.contactsList}
              contentContainerStyle={{
                paddingBottom: insets.bottom + buttonHeight + 12,
              }}>
              {contactsFiltered.map((contact, index) => (
                <AppTouchable
                  key={index + contact.name}
                  accessibilityLabel={contact.name}
                  width={'100%'}
                  onPress={() =>
                    navigation.navigate(
                      contactsStackRouteNames.ContactDetails,
                      {
                        contact,
                      },
                    )
                  }>
                  <BasicRow
                    textStyle={styles.textStyle}
                    style={styles.contacContainer}
                    avatar={{ name: contact.name }}
                    label={contact.name}
                    secondaryLabel={
                      contact.displayAddress.length > 0
                        ? contact.displayAddress
                        : shortAddress(contact.address)
                    }
                  />
                </AppTouchable>
              ))}
            </ScrollView>
          </>
        )}
      </FormProvider>
      <AppButton
        title={t('contacts_new_contact_button_label')}
        accessibilityLabel={testIDs.newContact}
        onPress={() => navigation.navigate(contactsStackRouteNames.ContactForm)}
        style={styles.newContactButton}
        leftIcon={{
          name: "plus",
          size: 24,
        }}
        textColor={sharedColors.black}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textStyle: castStyle.text({
    fontSize: 18,
    lineHeight: 20,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    letterSpacing: 0.25,
    color: sharedColors.inputText,
    marginTop: 6,
    
  }),
  contacContainer: castStyle.view({
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: sharedColors.inputBorder,
    height: 100,
  }),
  title: castStyle.text({
    marginTop: 18,
    fontSize: 22,
    fontFamily: "BalooTammudu",
    fontWeight: "400",
  }),
  noContactsImage: castStyle.image({
    marginTop: 102,
    alignSelf: 'center',
  }),
  searchInput: castStyle.view({
    marginTop: 14,
  }),
  subtitle: castStyle.view({
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  }),
  contactsList: castStyle.view({
    marginTop: 14,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  newContactButton: castStyle.view({
    position: 'absolute',
    bottom: 30,
    right: 12,
    backgroundColor: "#7DC3F4",
    width: 113,
    height: 56,
    paddingVertical: 16,
    paddingRight: 20,
    paddingLeft: 16,
  }),
  recentContacts: castStyle.view({
    height: 100,
    marginTop: 12,
  }),
  fontAwesomeStyle : castStyle.text({
    textAlign: "center",
    width: 32,
  }),
  noContact:{
    fontFamily: "BalooTammudu",
    fontSize: 28,
    fontWeight: "500",
    color: sharedColors.balightblue,
    textAlign: "center",
    lineHeight: 50,
  }
})

export * from './ContactDetails'
