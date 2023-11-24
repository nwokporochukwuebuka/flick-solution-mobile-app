import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {getAvailableParkingSpaces} from '../../http/parking-lot';
import {AuthContext} from '../../store/auth-context';
import {FlashList} from '@shopify/flash-list';
import ParkingLotItem from './ParkingLotItem';

const {height, width} = Dimensions.get('window');

const ParkingLotsList: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [parkingLots, setParkingLots] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const availableParkingSpaces = await getAvailableParkingSpaces(
        authCtx.token,
      );
      setParkingLots(availableParkingSpaces);
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 20 /* padding: width * 0.04 */,
      }}>
      <FlashList
        data={parkingLots}
        renderItem={({item}) => (
          <ParkingLotItem item={item} navigation={navigation} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{marginVertical: height * 0.01}}></View>
        )}
        estimatedItemSize={15}
      />
    </View>
  );
};

export default ParkingLotsList;

const styles = StyleSheet.create({});
