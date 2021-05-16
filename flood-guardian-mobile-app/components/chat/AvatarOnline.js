import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Alert} from 'react-native';
import 'react-native-get-random-values';
import RobotIcon from './RobotIcon';

const AvatarOnline = () => {
  return (
    <View style={styles.container}>
      <RobotIcon />
      <View>
        <Text style={styles.skippy}>Skippy</Text>
        <Text style={styles.online}>Online now</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skippy: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  online: {
    color: '#c2c2c2',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AvatarOnline;
