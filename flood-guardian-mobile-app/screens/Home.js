import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import Forecast from '../components/home/Forecast';
import LocationNotSet from '../components/home/LocationNotSet';
import LocationModal from '../components/home/LocationModal.js';
import {getData} from '../helper';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [locationHistory, setLocationHistory] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('Loading...');
  const [currLat, setCurrLat] = useState(null);
  const [currLong, setCurrLong] = useState(null);
  const [coordsLoading, setCoordsLoading] = useState({lat: true, long: true});
  const [locationHistLoading, setLocationHistLoading] = useState(true);
  useEffect(() => {
    getData('locationHistory').then((hist) => {
      if (hist) setLocationHistory(hist);
      setLocationHistLoading(false);
    });
    getData('lastUpdated').then((time) => {
      if (time) setLastUpdated(time);
    });
    getData('currLat').then((lat) => {
      if (lat) setCurrLat(lat);
      setCoordsLoading((prevState) => ({...prevState, lat: false}));
    });
    getData('currLong').then((long) => {
      if (long) setCurrLong(long);
      setCoordsLoading((prevState) => ({...prevState, long: false}));
    });
  }, [(currLat, currLong)]);

  return (
    <LinearGradient
      colors={['#2C659A', 'rgba(0, 0, 0, 0)']}
      style={styles.linearGradient}>
      <Header />

      <View style={styles.location}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => {
            setModalVisible(true);
          }}>
          <View style={styles.locationIcon}>
            <Icon name="location-pin" color="white" size={40} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationText}>
              {locationHistory ? locationHistory[0] : 'Tap to set location'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.forecast}>
        {locationHistory || locationHistLoading ? (
          <>
            <Text
              style={styles.lastUpdated}>{`Last Updated: ${lastUpdated}`}</Text>
            <Forecast
              key={(currLat, currLong)}
              setLastUpdated={setLastUpdated}
              currLat={currLat}
              currLong={currLong}
              coordsLoading={coordsLoading}
              locationHistLoading={locationHistLoading}
            />
          </>
        ) : (
          <LocationNotSet />
        )}
      </View>

      <View style={styles.modalCenteredView}>
        <LocationModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setLocationHistory={setLocationHistory}
          locationHistory={locationHistory}
          setCurrLat={setCurrLat}
          setCurrLong={setCurrLong}
          // setReloadHome={setReloadHome}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  forecast: {
    alignSelf: 'center',
    backgroundColor: 'rgba(38, 69, 148, 0.08)',
    width: 350,
    borderRadius: 10,
    marginBottom: 15,
  },
  lastUpdated: {
    textAlign: 'right',
    color: '#fff',
    paddingTop: 8,
    paddingBottom: 4,
    paddingRight: 15,
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 70,
    marginRight: 70,
  },
  locationIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  locationTextContainer: {
    justifyContent: 'flex-end',
  },
  locationText: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    paddingLeft: 5,
    textAlign: 'center',
  },
  linearGradient: {
    flex: 1,
  },
});
export default Home;
