import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import 'react-native-get-random-values';

const ForecastItem = ({datetime, icon, description}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.datetime}>{datetime}</Text>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 50,
    justifyContent: 'center',
  },
  datetime: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: 115,
  },
});
export default ForecastItem;
