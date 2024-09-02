import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { AppButton } from 'src/components';
import { addOrUpdateBalances } from 'src/redux/slices/balancesSlice';
import { useAppDispatch } from 'src/redux/storeUtils';
import { sharedColors, testIDs } from 'src/shared/constants';
import { castStyle } from 'src/shared/utils';

export default function AddTokenButton() {
    const dispatch = useAppDispatch();
  
    useEffect(() => {
        console.log("hola")
        
        const handleAddToken = () => {
          const newToken = {
            contractAddress: '0xeE5E8291B551603a19eF41eEA69ae49592eD14f8',
            balance: '0', // Balance in token units
            decimals: 18, // Decimals for the token
            name: "TestPDOC",
            symbol: 'TPDOC', // Symbol of the token
            usdBalance: '0', // This will be calculated later based on USD pricer
          };
      
          // Dispatch the async thunk
          dispatch(addOrUpdateBalances([newToken]));
          console.log("done");
          
        };
        handleAddToken()
    },[])
  
    return (
      <AppButton
        accessibilityLabel={testIDs.newContact}
        style={styles.newContactButton}
        leftIcon={{
          name: "plus",
          size: 24,
        }}
        textColor={sharedColors.mainWhite}
      />
    );
  };

  const styles = StyleSheet.create({
    newContactButton: castStyle.view({
        position: 'absolute',
        bottom: 30,
        right: 12,
        backgroundColor: "#7DC3F4",
        width: 60,
        height: 60,
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center"
      }),
  })