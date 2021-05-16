import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import 'react-native-get-random-values';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TickIcon from './TickIcon';
import {
  storeData,
  getData,
  logCurrentStorage,
  clearAllData,
} from '../../helper';
const serverUrl = 'http://10.0.2.2:5000';
const getLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }
  return false;
};

const LocationModal = ({
  setModalVisible,
  modalVisible,
  setLocationHistory,
  locationHistory,
  setCurrLat,
  setCurrLong,
}) => {
  const handleSetLocation = (location) => {
    if (locationHistory) {
      locationHistory.unshift(location);
      locationHistory = [...new Set(locationHistory)].slice(0, 2);
    } else {
      locationHistory = [location];
    }
    storeData('locationHistory', locationHistory);
    setLocationHistory(locationHistory);
  };

  const handleGetLocation = async () => {
    const hasLocationPermission = await getLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          storeData('currLat', latitude);
          storeData('currLong', longitude);
          setCurrLat(latitude);
          setCurrLong(longitude);
          const url = `${serverUrl}/api/location/revgeocode?latitude=${latitude}&longitude=${longitude}`;
          try {
            const response = await fetch(url);
            if (!response.ok) {
              console.error(
                'Error response from server. Error code: ',
                response.status,
                ' with url: ',
                url,
              );
            } else {
              const data = await response.json();

              handleSetLocation(data.location);
            }
          } catch (err) {
            console.error(
              'An error occured when fetching location: ',
              err.message,
            );
          }
        },
        (error) => {
          // See error code charts below.
          console.error(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalLocationText}>Location</Text>
            <TouchableOpacity
              style={styles.modalLocationItem}
              onPress={handleGetLocation}>
              <Icon name="my-location" color="#2696FF" size={40} />
              <Text style={styles.modalLocationItemText}>
                My current location
              </Text>
            </TouchableOpacity>

            {locationHistory &&
              locationHistory.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={styles.modalLocationItem}
                  onPress={() => {
                    handleSetLocation(location);
                  }}>
                  <Icon name="location-pin" color="#2696FF" size={40} />
                  <Text numberOfLines={1} style={styles.modalLocationItemText}>
                    {location}
                  </Text>
                  {locationHistory[0] == location && <TickIcon />}
                </TouchableOpacity>
              ))}
            <TouchableOpacity>
              <Text style={styles.modalLocationAction}>Add a location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={[styles.modalLocationAction, {paddingBottom: 30}]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalLocationAction: {
    color: '#2696FF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalLocationText: {
    textAlign: 'left',
    fontSize: 20,
    color: '#4d4d4d',
    alignSelf: 'stretch',
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalLocationItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    width: 250,
  },
  modalLocationItemText: {
    fontSize: 20,
    marginLeft: 10,
    marginHorizontal: 10,
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 5,
    width: 350,
    height: null,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
export default LocationModal;
