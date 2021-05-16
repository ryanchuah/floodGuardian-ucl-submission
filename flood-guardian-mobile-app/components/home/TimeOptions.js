import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Alert} from 'react-native';
import 'react-native-get-random-values';

const TimeOptions = ({active, setActive}) => {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, active === 'This Week' ? styles.active : {}]}
        onPress={() => setActive('This Week')}>
        This{'\n'}Week
      </Text>
      <Text
        style={[styles.text, active === 'Next Week' ? styles.active : {}]}
        onPress={() => setActive('Next Week')}>
        Next{'\n'}Week
      </Text>
      <Text
        style={[styles.text, active === 'This Month' ? styles.active : {}]}
        onPress={() => setActive('This Month')}>
        This{'\n'}Month
      </Text>
      <Text
        style={[styles.text, active === 'This Year' ? styles.active : {}]}
        onPress={() => setActive('This Year')}>
        This{'\n'}Year
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
export default TimeOptions;
