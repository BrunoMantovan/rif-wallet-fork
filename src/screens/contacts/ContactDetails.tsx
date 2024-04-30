import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Alert,
  StyleSheet,
  View,
  Share,
  FlatList,
  ScrollView,
  Text,
} from 'react-native'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Clipboard from '@react-native-community/clipboard'

import { shortAddress } from 'lib/utils'

import { noop, sharedColors, sharedStyles } from 'shared/constants'
import {
  AppButton,
  AppTouchable,
  Avatar,
  Input,
  Typography,
} from 'components/index'
import {
  contactsStackRouteNames,
  ContactsStackScreenProps,
} from 'navigation/contactsNavigator'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { changeTopColor, selectChainId } from 'store/slices/settingsSlice'
import { castStyle } from 'shared/utils'
import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { ConfirmationModal } from 'components/modal'
import { BasicRow } from 'components/BasicRow'
import { addContact, deleteContactByAddress } from 'store/slices/contactsSlice'
import { selectTransactions } from 'store/slices/transactionsSlice'
import { getRnsResolver } from 'src/core/setup'
import { WalletContext } from 'src/shared/wallet'
import HorizontalRule from 'src/components/HorizontalRule/HorizontalRule'

const copyButtonConfig = { name: 'copy', size: 18, color: sharedColors.white }

export const ContactDetails = ({
  navigation,
  route: {
    params: { contact },
  },
}: ContactsStackScreenProps<contactsStackRouteNames.ContactDetails>) => {
  const transactions = useAppSelector(selectTransactions)
  const chainId = useAppSelector(selectChainId)
  const dispatch = useAppDispatch()
  const [isDeleteContactModalVisible, setIsDeleteContactModalVisible] =
    useState(false)
  const isFocused = useIsFocused()
  const { wallet } = useContext(WalletContext)

  const transactionFiltered = transactions.filter(
    tx => tx.to === contact.address,
  )

  const methods = useForm({
    defaultValues: {
      username: contact.name,
      address: contact.address,
      shortAddress: shortAddress(contact.address, 10),
    },
  })
  const { getValues, setValue } = methods
  const { t } = useTranslation()

  const onHideConfirmDeleteModal = useCallback(() => {
    setIsDeleteContactModalVisible(false)
  }, [])

  const onDeleteContact = useCallback(() => {
    setIsDeleteContactModalVisible(true)
  }, [])

  const onConfirmDeleteContact = useCallback(() => {
    setIsDeleteContactModalVisible(false)
    dispatch(deleteContactByAddress(contact.address))
    navigation.goBack()
  }, [dispatch, contact, navigation])

  const onShareContact = useCallback(() => {
    Share.share({
      title: contact.name,
      message: contact.address,
    })
  }, [contact])

  const onSendToContact = useCallback(() => {
    navigation.navigate(rootTabsRouteNames.Home, {
      screen: homeStackRouteNames.Send,
      params: {
        backScreen: contactsStackRouteNames.ContactsList,
        contact,
      },
    })
  }, [navigation, contact])

  const onCopyValue = useCallback(
    (value: string) => () => {
      Alert.alert(t('message_copied_to_clipboard'), undefined, [
        { text: t('ok'), onPress: noop },
      ])
      Clipboard.setString(value)
    },
    [t],
  )

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.inputInactive))
    }
  }, [dispatch, isFocused])

  useEffect(() => {
    navigation.setOptions({
      headerRight: _ => (
        <AppTouchable
          width={24}
          onPress={() =>
            navigation.navigate(contactsStackRouteNames.ContactForm, {
              initialValue: contact,
              proposed: false,
            })
          }
          
          style={sharedStyles.marginRight24}>
          <FontAwesome5Icon
            name={'pen'}
            size={20}
            color={sharedColors.bablue}
          />
        </AppTouchable>
      ),
      headerStyle: {
        backgroundColor: sharedColors.mainWhite,
      },
      headerRightContainerStyle: {
        paddingTop: 0,
      },
      headerLeftContainerStyle: {
        paddingTop: 0,
      },
    })
  }, [navigation, onDeleteContact])

  useEffect(() => {
    if (
      wallet &&
      contact.displayAddress &&
      contact.displayAddress !== contact.address
    ) {
      getRnsResolver(chainId, wallet)
        .addr(contact.displayAddress)
        .then(resolvedAddress => {
          const newAddress = resolvedAddress.toLowerCase()
          if (newAddress !== contact.address) {
            const newContact = {
              ...contact,
              address: newAddress,
            }
            dispatch(addContact(newContact))
            dispatch(deleteContactByAddress(contact.address))
            setValue('address', newAddress)
            setValue('shortAddress', shortAddress(newAddress, 10))
          }
        })
        .catch(_ => {})
    }
  }, [wallet, chainId, contact, dispatch, setValue])

  return (
    <View style={styles.screen}>
      <ConfirmationModal
        isVisible={isDeleteContactModalVisible}
        title={t('contacts_delete_contact_title')}
        description={`${t('contacts_delete_contact_description')}${
          contact.name
        }?`}
        okText={t('contacts_delete_contact_button_delete')}
        cancelText={t('Cancel')}
        onOk={onConfirmDeleteContact}
        onCancel={onHideConfirmDeleteModal}
        color={sharedColors.balightblue}
      />
      <ScrollView contentContainerStyle={styles.scrollviewContainer}>
        <View style={styles.contactDetailsView}>
          <View style={styles.nameAddressView}>
            <Avatar name={contact.name} size={52} />
            <View style={styles.contactInfo}>
              <Typography type={'h2'} color={sharedColors.inputText} style={styles.contactName}>
                {contact.name}
              </Typography>
              <Text>Agregado el {contact.date ? contact.date : null}</Text>
            </View>
          </View>
          <HorizontalRule/>
          <Text style={{fontSize: 12, lineHeight: 16,fontFamily: "Robot-Medium", fontWeight: "500", color: sharedColors.inputText, letterSpacing: 0.5}}>Dirección</Text>
          <Typography type={'h4'} color={sharedColors.labelLight} style={styles.adress}>
            {contact.displayAddress || contact.address}
          </Typography>
        </View>
        {/* <BarButtonGroupContainer backgroundColor={sharedColors.inputActive}>
          <BarButtonGroupIcon
            onPress={onSendToContact}
            iconName={'north-east'}
            IconComponent={MaterialIcon}
          />
          <BarButtonGroupIcon
            onPress={onShareContact}
            iconName={'share-alt'}
            IconComponent={FontAwesome5Icon}
          />
        </BarButtonGroupContainer> */}
        <View style={sharedStyles.screen}>
          <FormProvider {...methods}>
            <Input
              containerStyle={styles.usernameInputContainer}
              label={t('contacts_username_input_label')}
              inputName={'username'}
              rightIcon={copyButtonConfig}
              isReadOnly
              onRightIconPress={onCopyValue(getValues('username'))}
            />
            <Input
              containerStyle={styles.addressInputContainer}
              label={t('contacts_address_input_label')}
              inputName={'shortAddress'}
              rightIcon={copyButtonConfig}
              isReadOnly
              onRightIconPress={onCopyValue(getValues('address'))}
            />
          </FormProvider>
          <Typography
            type={'h3'}
            color={sharedColors.labelLight}
            style={styles.transactionsLabel}>
            {t('contacts_details_transactions')}
          </Typography>
          {transactionFiltered.length !== 0 ? (
            <FlatList
              data={transactionFiltered}
              initialNumToRender={10}
              onEndReachedThreshold={0.2}
              renderItem={({ item }) => (
                <BasicRow
                  label={contact.name}
                  avatar={{ name: contact.name }}
                  secondaryLabel={item.to}
                  symbol={item?.symbol}
                />
              )}
              style={styles.transactionList}
            />
          ) : null}
        </View>
      </ScrollView>
      <AppButton
        style={styles.newContactButton}
        title={t('Delete')}
        onPress={onDeleteContact}
        color={sharedColors.white}
        textColor={sharedColors.black}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.mainWhite,
    paddingHorizontal: 12,
  }),
  scrollviewContainer: castStyle.view({
    paddingBottom: 144,
  }),
  contactDetailsView: castStyle.view({
    backgroundColor: sharedColors.white,
    justifyContent: "space-between",
    height: 168,
    width: "100%",
    marginTop: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: sharedColors.inputBorder,
  }),
  nameAddressView: castStyle.view({flexDirection: "row"}),
  usernameInputContainer: castStyle.view({ marginTop: 25 }),
  addressInputContainer: castStyle.view({ marginTop: 10 }),
  transactionList: castStyle.view({ height: 300 }),
  transactionsLabel: castStyle.text({ marginTop: 34 }),
  editContactButton: castStyle.view({
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
  }),
  contactName: castStyle.text({
    fontSize: 28,
    lineHeight: 36,
  }),
  contactInfo: castStyle.view({
    marginLeft: 16,

  }),
  adress: castStyle.text({
    fontSize: 13,
    letterSpacing: 0.5,
    lineHeight: 16,
    color: sharedColors.inputBorder,
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
  })
})
