import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ParkingLotsList from '../../components/UI/ParkingLotsList';
import ParkingLotDetails from '../../components/UI/ParkingLotDetails';

const Stack = createNativeStackNavigator();

const ParkingSpaces: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  route.params;
  return (
    <Stack.Navigator
      initialRouteName="ParkingLotList"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ParkingLotList" component={ParkingLotsList} />
      <Stack.Screen name="ParkingLotDetail" component={ParkingLotDetails} />
    </Stack.Navigator>
  );
};

export default ParkingSpaces;

const styles = StyleSheet.create({});
