import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import 'react-native-get-random-values';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from './screens/Home';
import Chat from './screens/Chat';
import Forecast from './components/Header';
import HomeIcon from './components/tabNavigation/HomeIcon';
import ChatIcon from './components/tabNavigation/ChatIcon';
import EmergencyIcon from './components/tabNavigation/EmergencyIcon';
import ShelterIcon from './components/tabNavigation/ShelterIcon';
import InfoIcon from './components/tabNavigation/InfoIcon';
import MessageArea from './components/chat/MessageArea';
import ErrorBoundary from './screens/ErrorBoundary';
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let icon;

              if (route.name === 'Home') {
                icon = focused ? <HomeIcon /> : <HomeIcon />;
              } else if (route.name === 'Chat') {
                icon = focused ? <ChatIcon /> : <ChatIcon />;
              } else if (route.name === 'Emergency') {
                icon = focused ? <EmergencyIcon /> : <EmergencyIcon />;
              } else if (route.name === 'Shelter') {
                icon = focused ? <ShelterIcon /> : <ShelterIcon />;
              } else if (route.name === 'Info') {
                icon = focused ? <InfoIcon /> : <InfoIcon />;
              }

              // You can return any component that you like here!
              return (
                <View style={{marginTop: 30, marginBottom: 30}}>{icon}</View>
              );
            },
          })}
          tabBarOptions={{
            activeBackgroundColor: 'rgba(255, 255, 255, 0.19)',
            inactiveBackgroundColor: 'rgba(0, 9, 40, 0.8)',
            showLabel: false,
            style: {
              backgroundColor: 'rgba(0, 9, 40, 0.8)',
            },
            keyboardHidesTabBar: true,
          }}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Chat" component={Chat} />
          {/* <Tab.Screen name="Emergency" component={MessageArea} />
          <Tab.Screen name="Shelter" component={Forecast} />
          <Tab.Screen name="Info" component={Forecast} /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;
