import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import FontAwesome from 'react-native-vector-icons/Ionicons';
import RNRestart from 'react-native-restart';

class ErrorBoundary extends React.Component {
  state = {
    error: false,
  };

  static getDerivedStateFromError(error) {
    return {error: true};
  }

  componentDidCatch(error, errorInfo) {
    // deal with errorInfo if needed
  }

  handleRestart = async () => {
    // restart app
    RNRestart.Restart();
  };

  render() {
    const {theme} = this.context;

    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={{width: '100%'}}>
            <FontAwesome name="ios-information-circle-outline" size={60} />
          </Text>
          <Text style={{fontSize: 32}}>Oops, Something Went Wrong</Text>
          <Text style={{marginVertical: 10, lineHeight: 23, fontWeight: '500'}}>
            The app ran into a problem and could not continue. We apologise for
            any inconvenience this has caused! Press the button below to restart
            the app. Please contact us if this issue persists.
          </Text>
          <Button
            title={'Restart the app'}
            onPress={() => this.handleRestart()}
            style={{
              marginVertical: 15,
            }}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 50,
  },
});

export default ErrorBoundary;
