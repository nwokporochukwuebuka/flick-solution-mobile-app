import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

const ParkingLotDetails: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  useEffect(() => {}, []);
  return (
    <ScrollView>
      <View></View>
      <View>
        <View style={{}}>
          <Text style={{fontWeight: 'bold'}}>Details</Text>
          <Text style={{fontWeight: 'bold', color: 'grey'}}>ADDRESS</Text>
          <Text style={{fontWeight: 'bold', color: 'grey'}}>
            Location/Desciption
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ParkingLotDetails;

const styles = StyleSheet.create({});
