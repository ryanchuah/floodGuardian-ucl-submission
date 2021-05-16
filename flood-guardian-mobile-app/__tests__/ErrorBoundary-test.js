import React from 'react';
import renderer from 'react-test-renderer';
import ErrorBoundary from '../screens/ErrorBoundary';

jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn()
  }));

test('errorBoundary page renders correctly', async () => {
  const tree = await renderer.create(<ErrorBoundary />).toJSON();
  expect(tree).toMatchSnapshot();
});