import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import 'react-native-get-random-values';

const LocationNotSet = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        It seems you have not set your location yet
      </Text>
      <Text style={styles.text}>
        Click on "Tap to set location" above to get started with viewing flood
        predictions for your area
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 40,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 10,
  },
});
export default LocationNotSet;
