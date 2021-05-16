import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import 'react-native-get-random-values';

const ForecastModal = ({setModalVisible, modalVisible, modalNarrative}) => {
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
            <ScrollView style={styles.scrollView}>
              <View>
                <Text style={styles.narrativeText}>
                  {modalNarrative.replace(/\.\s/g, '.\n\n')}
                </Text>
              </View>
            </ScrollView>
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
  scrollView: {
    height: 400,
    paddingHorizontal: 20,
  },
  narrativeText: {
    marginTop: 20,
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
  },
  modalLocationAction: {
    color: '#2696FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    paddingBottom: 10,
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
export default ForecastModal;
