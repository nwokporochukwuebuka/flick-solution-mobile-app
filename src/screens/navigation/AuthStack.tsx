import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../authStack/SignIn';
import SignUp from '../authStack/SignUp';
import TempSignIn from '../authStack/TempSignIn';
import SetPin from '../authStack/SetPin';
import * as Keychain from 'react-native-keychain';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    (async () => {
      const existingCredentials = await Keychain.getGenericPassword();
      if (existingCredentials) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={loggedIn ? 'TempLogin' : 'Register'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Register" component={SignUp} />
      <Stack.Screen
        name="TempLogin"
        component={TempSignIn}
        initialParams={{email, fromSignUp: false}}
      />
      <Stack.Screen name="SetPin" component={SetPin} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
