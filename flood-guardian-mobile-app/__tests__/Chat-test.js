import React from 'react';
import renderer from 'react-test-renderer';
import Chat from '../screens/Chat';

jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn()
  }));

test('chat page renders correctly', async () => {
  const tree = await renderer.create(<Chat />).toJSON();
  expect(tree).toMatchSnapshot();
});