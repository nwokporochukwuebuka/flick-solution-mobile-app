import {
  SafeAreaView,
  StyleSheet,
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {getDeviceId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../store/auth-context';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {loginDevice, registerDevice} from '../../http/auth';

const LoginDeviceSchema = Yup.object().shape({
  passcode: Yup.string()
    .max(6, 'Pin should be four digit ')
    .required('Please enter your pin'),
});

const {height, width} = Dimensions.get('window');

const TempSignIn: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<boolean>();
  const [usersPassCode, setUsersPassCode] = useState<string>('');
  const {email, fromSignUp} = route.params;

  const authCtx = useContext(AuthContext);

  const loginWithFingerprint = (passcode: string) => {
    const rnBiometrics = new ReactNativeBiometrics();
    rnBiometrics
      .simplePrompt({promptMessage: 'Sign In'})
      .then(async resultObject => {
        const {success} = resultObject;

        if (success) {
          setLoading(true);
          setTimeout(async () => {
            const signIn = await loginDevice(getDeviceId(), passcode);
            setLoginStatus(true);
            authCtx.authenticate(
              signIn.data.tokens.access.token,
              signIn.data.user.email,
              signIn.data.user.name,
              signIn.data.user.id,
            );
            setLoading(false);
            return;
          }, 2000);
        } else {
          setLoading(false);
          ('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        ('biometrics failed');
      });
  };

  const handleLoginDevice = async (values: any) => {
    setLoading(true);

    let deviceRegistration;
    console.log('====this is the login status =======');
    if (loginStatus === false) {
      deviceRegistration = await registerDevice(
        getDeviceId(),
        values.passcode,
        email,
      );
    } else {
      deviceRegistration = await loginDevice(getDeviceId(), values.passcode);
    }
    if (deviceRegistration.status !== 200) {
      setLoading(false);
      return Alert.alert('Error', deviceRegistration.data.message);
    }

    setLoading(false);
    await Keychain.setGenericPassword(getDeviceId(), values.passcode);
    authCtx.authenticate(
      deviceRegistration.data.tokens.access.token,
      deviceRegistration.data.user.name,
      deviceRegistration.data.user.email,
      deviceRegistration.data.user.id,
      values.passcode,
    );
    // return;
  };

  useEffect(() => {
    (async () => {
      const existingCredentials = await Keychain.getGenericPassword();
      if (existingCredentials) {
        setLoginStatus(true);
        setUsersPassCode(existingCredentials.password);
        loginWithFingerprint(existingCredentials.password);
      } else setLoginStatus(false);
    })();
  }, []);

  if (loading)
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={'#395B64'} />
      </SafeAreaView>
    );

  return (
    <Formik
      initialValues={{
        passcode: '',
      }}
      validationSchema={LoginDeviceSchema}
      onSubmit={values => handleLoginDevice(values)}>
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        isValid,
        setFieldTouched,
        touched,
      }) => (
        <View style={styles.wrapper}>
          <StatusBar barStyle={'light-content'} />
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {loginStatus ? 'Enter Passcode' : 'Set Passcode'}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Passcode"
                value={values.passcode}
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={handleChange('passcode')}
                onBlur={() => setFieldTouched('passcode')}
              />
              {touched.passcode && errors.passcode && (
                <Text style={styles.errorTxt}>{errors.passcode}</Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: loginStatus ? 'space-between' : 'center',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: isValid ? '#395B64' : '#A5C9CA',
                      width: !!loginStatus ? width * 0.7 : width * 0.7,
                    },
                  ]}
                  disabled={!isValid}>
                  <Text style={styles.submitBtnTxt}>Submit</Text>
                </TouchableOpacity>
              </View>
              {loginStatus && (
                <View>
                  <Ionicons
                    name="finger-print-outline"
                    size={width * 0.08}
                    onPress={() => loginWithFingerprint(usersPassCode)}
                  />
                </View>
              )}
            </View>
            {!loginStatus && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    authCtx.logout();
                    await Keychain.resetGenericPassword();
                    navigation.navigate('Register');
                  }}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: '#395B64',
                      width: !!loginStatus ? width * 0.7 : width * 0.7,
                    },
                  ]}>
                  <Text style={styles.submitBtnTxt}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </Formik>
  );
};

export default TempSignIn;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3333',
    paddingHorizontal: 15,
  },
  formContainer: {
    backgroundColor: '#F5EDDC',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  title: {
    color: '#16213E',
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 15,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputStyle: {
    borderColor: '#16213E',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  errorTxt: {
    fontSize: 12,
    color: '#FF0d10',
  },
  submitBtn: {
    // backgroundColor: ,
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  submitBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
