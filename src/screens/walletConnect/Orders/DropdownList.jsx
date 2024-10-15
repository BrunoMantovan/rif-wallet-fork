import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { sharedColors } from 'src/shared/constants';

const DropdownList = ({ data }) => {
  // This will store the toggled states of each item
  const [openToggles, setOpenToggles] = useState({});

  const toggleItem = (index) => {
    setOpenToggles((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the current item
    }));
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={{ marginBottom: 10 }}>
        {/* The TouchableOpacity is used as a toggle button */}
        <TouchableOpacity
          onPress={() => toggleItem(index)}
          style={{
            padding: 10,
            backgroundColor: sharedColors.inputInactive,
            borderRadius: 5,
          }}
        >
          <Text style={styles.text} >{item.type}: {item.entity}</Text>
          
        </TouchableOpacity>

        {/* Show the rest of the data if toggled */}
        {openToggles[index] && (
          <View style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 5, marginTop: 5 }}>
            <Text style={styles.text}>Titular: {item.fullName}</Text>
            <Text style={styles.text}>CBU: {item.cbu}</Text>
            <Text style={styles.text}>Alias: {item.alias}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: sharedColors.inputText,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.4,
  }
})

export default DropdownList;