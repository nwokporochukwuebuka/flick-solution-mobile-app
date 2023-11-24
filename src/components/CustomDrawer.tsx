import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {AuthContext} from '../store/auth-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {height, width, fontScale} = Dimensions.get('window');

const CustomDrawer = (props: any) => {
  const authCtx = useContext(AuthContext);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          paddingVertical: height * 0.05,
          paddingHorizontal: width * 0.1,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}>
        <Pressable
          style={{flexDirection: 'row'}}
          onPress={() => {
            authCtx.signout();
          }}>
          <Text
            style={{fontSize: fontScale * 18, marginTop: 7, marginRight: 10}}>
            Sign Out
          </Text>
          <MaterialIcons name="logout" size={height * 0.04} color={'red'} />
        </Pressable>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
