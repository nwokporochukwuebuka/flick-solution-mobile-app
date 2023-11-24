import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const {fontScale, height, width} = Dimensions.get('window');

const ParkingLotItem: React.FC<{item: any; navigation: any}> = ({
  item,
  navigation,
}) => {
  console.log('===== This is the item =========', item);
  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#e5e8ee',
        paddingVertical: 15,
      }}
      onPress={() => navigation.navigate('ParkingLotDetail', {item})}>
      <View style={{paddingRight: width * 0.05}}>
        <Image
          source={{uri: item.imgUrl}}
          height={width * 0.15}
          width={width * 0.15}
        />
      </View>
      <View>
        <Text
          style={{
            fontSize: fontScale * 17,
            fontWeight: 'bold',
            marginBottom: 15,
          }}>
          {item.name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <EvilIcons name="location" size={20} />
          <Text>{item.location}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ParkingLotItem;

const styles = StyleSheet.create({});
