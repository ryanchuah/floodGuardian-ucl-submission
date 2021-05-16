import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Alert} from 'react-native';
import 'react-native-get-random-values';
import ForecastItem from './ForecastItem';

const NextWeek = () => {
  return (
    <>
      <View style={styles.ForecastItemContainer}>
        <ForecastItem time="Sun" timeStyle={{color: 'white'}} waterLevel={10} />
        <ForecastItem time="Mon" timeStyle={{color: 'white'}} waterLevel={30} />
        <ForecastItem time="Tue" timeStyle={{color: 'white'}} waterLevel={20} />
        <ForecastItem time="Wed" timeStyle={{color: 'white'}} waterLevel={20} />
      </View>
      <View style={[styles.ForecastItemContainer, styles.nextDaysForecastItem]}>
        <ForecastItem time="Thu" timeStyle={{color: 'white'}} waterLevel={10} />
        <ForecastItem time="Fri" timeStyle={{color: 'white'}} waterLevel={50} />
        <ForecastItem time="Sat" timeStyle={{color: 'white'}} waterLevel={90} />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  nextDaysForecastItem: {
    borderTopWidth: 0.5,
    borderTopColor: 'white',
  },
  ForecastItemContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  today: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 10,
  },

});
export default NextWeek;
