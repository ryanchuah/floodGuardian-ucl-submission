import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../screens/Home';

jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn()
  }));

test('home page renders correctly', async () => {
  const tree = await renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});