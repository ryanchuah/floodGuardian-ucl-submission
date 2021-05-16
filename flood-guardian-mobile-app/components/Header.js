import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Alert} from 'react-native';
import 'react-native-get-random-values';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Flood Guardian</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20
  },
  title: {
    fontFamily: 'Chicle-Regular',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 50,
    color: '#9BBFE9'
  },
});
export default Header;
