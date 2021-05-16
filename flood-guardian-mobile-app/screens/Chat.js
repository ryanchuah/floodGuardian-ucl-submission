import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import 'react-native-get-random-values';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvatarOnline from '../components/chat/AvatarOnline';
import MessageArea from '../components/chat/MessageArea';
const Chat = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#2C659A', 'rgba(0, 0, 0, 0)']}
      style={styles.linearGradient}>
      <AvatarOnline style={{flex: 1}} />
      <View style={{flex: 4}}>
        <MessageArea navigation={navigation} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
});
export default Chat;
