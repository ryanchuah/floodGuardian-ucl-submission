import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import 'react-native-get-random-values';
import ForecastItem from './ForecastItem';
import SafeIcon from './icons/SafeIcon';
import DangerIcon from './icons/DangerIcon';
import LowIcon from './icons/LowIcon';
import WarningIcon from './icons/WarningIcon';
import ForecastModal from './ForecastModal';
import RNRestart from 'react-native-restart';
import {v4 as uuid} from 'uuid';
import {storeData} from '../../helper';
const serverUrl = 'http://10.0.2.2:5000';
const LOCATION_UNAVAILABLE_CODE = 1;
const LOCATION_NOT_DETERMINED = 2;
const ERROR_CODE = 3;
const predictFloods = async (latitude, longitude) => {
  // TODO: change lat and long to state variables

  // const latitude = 52.189738362242885;
  // const longitude = -2.2181236758097;
  const url = `${serverUrl}/api/forecast?latitude=${latitude}&longitude=${longitude}`;
  let data;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        'Error response from server. Error code: ',
        response.status,
        ' with url: ',
        url,
      );
      return ERROR_CODE;
    } else if (response.status == 204) {
      return LOCATION_UNAVAILABLE_CODE;
    } else {
      data = await response.json();
    }
  } catch (err) {
    console.error('An error occured when fetching: ', err.message);
  }
  const floodPredictionsData = [];

  for (let i = 0; i < data.will_flood.length; i++) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = data.date[i];

    let will_flood = data.will_flood[i];
    if (i == 0) {
      date = 'Today';
    } else if (i == 1) {
      date = 'Tomorrow';
    } else {
      date = days[new Date(date).getDay()]; // get text repr on day eg 'Mon'
    }

    floodPredictionsData.push({
      id: uuid(),
      datetime: date,
      will_flood,
      narrative: data.narrative[i],
    });
  }

  return floodPredictionsData;
};

const Forecast = ({
  setLastUpdated,
  currLat,
  currLong,
  coordsLoading,
  locationHistLoading,
}) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNarrative, setModalNarrative] = useState('');
  const [unsuccessfulPrediction, setUnsuccessfulPrediction] = useState(null);

  useEffect(() => {
    if (!currLat || !currLong) {
      setUnsuccessfulPrediction(LOCATION_NOT_DETERMINED);
      setLoading(false);
    } else {
      predictFloods(currLat, currLong)
        .then((data) => {
          if (data == LOCATION_UNAVAILABLE_CODE) {
            setUnsuccessfulPrediction(LOCATION_UNAVAILABLE_CODE);
            setLoading(false);
          } else if (data == ERROR_CODE) {
            setUnsuccessfulPrediction(ERROR_CODE);
            setLoading(false);
          } else {
            setForecastData(data);
            const nowTime = new Date().toLocaleTimeString();
            setLastUpdated(nowTime);
            storeData('lastUpdated', nowTime);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.error(e.error);
        });
    }
  }, []);

  if (loading || coordsLoading.lat || coordsLoading.long || locationHistLoading)
    return (
      <View
        style={{
          height: 200,
          alignContent: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator color="#000" size="large" />
      </View>
    );

  if (unsuccessfulPrediction == LOCATION_UNAVAILABLE_CODE) {
    return (
      <View style={styles.unsuccessfulContainer}>
        <Text style={styles.unsuccessfulText}>
          Unfortunately, our app is not available in your area yet
        </Text>
      </View>
    );
  }

  if (unsuccessfulPrediction == LOCATION_NOT_DETERMINED) {
    return (
      <View style={styles.unsuccessfulContainer}>
        <Text style={styles.unsuccessfulText}>
          Unfortunately, we could not determine your current location
        </Text>
      </View>
    );
  }

  if (unsuccessfulPrediction == ERROR_CODE) {
    return (
      <View style={styles.unsuccessfulContainer}>
        <Text style={styles.unsuccessfulText}>
          An unexpected error occurred when loading our flood predictions. Try
          checking your internet connection. If that fails, try restarting the
          app.
        </Text>
        <Button
          title={'Restart the app'}
          onPress={() => RNRestart.Restart()}
          style={{
            marginVertical: 15,
          }}
        />
      </View>
    );
  }

  const floodContent = {
    0: {icon: <SafeIcon />, text: 'No flood predicted', color: 'green'},
    1: {icon: <LowIcon />, text: 'Low Chance of Flooding', color: '#FFE600'},
    2: {icon: <WarningIcon />, text: 'Flood Warning', color: '#fc7c1e'},
    3: {icon: <DangerIcon />, text: 'Flood Predicted', color: '#f21111'},
  };

  return (
    <>
      <View>
        <Text style={styles.today}>Today</Text>
        <TouchableOpacity
          style={styles.todaysForecast}
          onPress={() => {
            setModalNarrative(forecastData[0].narrative);
            setModalVisible(true);
          }}>
          <View style={styles.todaysTextContainer}>
            <Text
              style={[
                styles.todayFloodText,
                {color: floodContent[forecastData[0].will_flood].color},
              ]}>
              {floodContent[forecastData[0].will_flood].text}
            </Text>
            <Text numberOfLines={4} style={styles.narrative}>
              {forecastData[0].narrative}
            </Text>
          </View>
          <View style={{flex: 1}}>
            {floodContent[forecastData[0].will_flood].icon}
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true}
        style={styles.scrollView}
        persistentScrollbar={true}>
        {forecastData.slice(1).map((item) => (
          <TouchableOpacity
            key={item.id}
            delayPressIn={10}
            onPress={() => {
              setModalNarrative(item.narrative);
              setModalVisible(true);
            }}>
            <ForecastItem
              datetime={item.datetime}
              icon={floodContent[item.will_flood].icon}
              description={floodContent[item.will_flood].text}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.modalCenteredView}>
        <ForecastModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          modalNarrative={modalNarrative}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  unsuccessfulContainer: {
    height: 200,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  unsuccessfulText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  todaysTextContainer: {flex: 4, minHeight: 120, justifyContent: 'center'},
  willFloodText: {
    color: '#f21111',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
    paddingTop: 5,
  },
  todayFloodText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
    paddingTop: 5,
  },
  todaysForecast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 20,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  narrative: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 10,
  },

  scrollView: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
    height: 140,
  },
  nextDaysForecastItem: {
    borderTopWidth: 0.5,
    borderTopColor: 'white',
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
export default Forecast;
