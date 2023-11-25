import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {bookParkingSpace} from '../../http/reservation';
import {AuthContext} from '../../store/auth-context';
import ModalPopup from '../Animation/ModalPopup';

const {fontScale, height, width} = Dimensions.get('window');

const ParkingLotDetails: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);
  const {item} = route.params;
  const reserveParkingSpace = async (id: any) => {
    setIsLoading(true);
    const reserve = await bookParkingSpace(id, authCtx.token);
    if (reserve.status === 200) {
      setVisible(true);
      // show success modal and redirect back to back page
    }
  };
  return (
    <ScrollView style={{padding: 20}} showsVerticalScrollIndicator={false}>
      <View style={{alignSelf: 'center'}}>
        <Image
          source={{uri: item.imgUrl}}
          height={height * 0.2}
          width={width * 0.9}
          style={{borderRadius: 10}}
        />
        <Pressable
          style={{
            backgroundColor: 'white',
            marginVertical: 20,
            padding: 10,
            borderRadius: 10,
          }}>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            VIEW ON MAP
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          marginVertical: 15,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 15,
        }}>
        <Text style={{fontWeight: 'bold', marginVertical: 20}}>Details</Text>
        <Text style={{fontWeight: 'bold', color: 'grey'}}>ADDRESS</Text>
        <Text style={{marginVertical: 20}}>{item.location}</Text>
        <Text style={{fontWeight: 'bold', color: 'grey', marginVertical: 10}}>
          OPERATION
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold', marginVertical: 5}}>Open Now</Text>
          <Text
            style={{
              fontWeight: 'bold',
              marginHorizontal: 5,
              fontSize: 18,
            }}>
            .
          </Text>
          <Text style={{marginVertical: 5}}>10:00AM - 11:30PM</Text>
        </View>
        <Text style={{fontWeight: 'bold', color: 'grey', marginVertical: 20}}>
          VEHICLE CATEGORY
        </Text>
        <Text style={{marginVertical: 5}}>{item.category}</Text>
      </View>
      <View style={{marginVertical: 10, padding: 15}}>
        <Pressable
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
              setVisible(true);
            }, 3000);
          }}
          style={{
            marginVertical: 10,
            backgroundColor: 'black',
            padding: 10,
            borderRadius: 10,
            height: height * 0.07,
            justifyContent: 'center',
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            {isLoading ? (
              <ActivityIndicator
                style={{alignSelf: 'center', marginHorizontal: width * 0.45}}
              />
            ) : (
              'Pick Spot'
            )}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginVertical: 10,
            backgroundColor: 'black',
            padding: 10,
            borderRadius: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <ModalPopup visible={visible}>
        <View style={{height: height * 0.6}}>
          <Image
            source={require('../../assets/images/successgif.gif')}
            style={{
              transform: [{scale: 0.5}],
              alignSelf: 'center',
              marginTop: -height * 0.1,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: -height * 0.05,
              fontSize: fontScale * 16,
              marginBottom: height * 0.05,
            }}>
            Paid Successfully👏👏👏
          </Text>
          <Pressable
            style={{
              alignSelf: 'center',
              backgroundColor: 'green',
              paddingHorizontal: 40,
              paddingVertical: 20,
              borderWidth: 3,
              borderRadius: 10,
              borderColor: '#ccc',
            }}
            onPress={() => {
              setIsLoading(false);
              setVisible(!visible);
            }}>
            <Text>OK</Text>
          </Pressable>
        </View>
      </ModalPopup>
    </ScrollView>
  );
};

export default ParkingLotDetails;

const styles = StyleSheet.create({});
