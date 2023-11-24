import {
  SafeAreaView,
  StyleSheet,
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {getDeviceId} from 'react-native-device-info';
import * as KeyChain from 'react-native-keychain';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {register} from '../../http/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../store/auth-context';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, 'Your name is too short!')
    .max(50, 'Your name is too long!')
    .required('Please enter your full name'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address!'),
  password: Yup.string()
    .min(5, 'Confirm password must be 8 characters long.')
    .required('Please enter your password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Your password must contain at least one uppercase, lowercase, number and a special character',
    ),
  confirmPass: Yup.string()
    .min(8)
    .oneOf([Yup.ref('password')], 'Your passwords do not match')
    .required('Confirm password is required'),
});

const {height, width} = Dimensions.get('window');

const SignUp: React.FC<{navigation: any; route: any}> = ({navigation}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);

  const handleSignup = (values: any) => {
    setLoading(true);
    setTimeout(async () => {
      const signUp = await register(values.name, values.email, values.password);
      if (signUp.status !== 201) {
        setLoading(false);
        return Alert.alert('Error', signUp.data.message);
      }
      /* AsyncStorage.setItem('email', values.email);
      authCtx.email = values.email;  // use react native key chain here */
      setLoading(false);
      navigation.navigate('TempLogin', {email: values.email, fromSignUp: true});
    }, 3000);
  };

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
        name: '',
        email: '',
        password: '',
        confirmPass: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={values => handleSignup(values)}>
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
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.inputStyle,
                  {fontFamily: Platform.OS === 'ios' ? '' : ''},
                ]}
                placeholder="Full Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={() => setFieldTouched('name')}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorTxt}>{errors.name}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Email Address"
                value={values.email}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorTxt}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                onChangeText={handleChange('password')}
                value={values.password}
                onBlur={() => setFieldTouched('password')}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorTxt}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                onBlur={() => setFieldTouched('confirmPass')}
                value={values.confirmPass}
                onChangeText={handleChange('confirmPass')}
              />
              {touched.confirmPass && errors.confirmPass && (
                <Text style={styles.errorTxt}>{errors.confirmPass}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={[
                styles.submitBtn,
                {backgroundColor: isValid ? '#395B64' : '#A5C9CA'},
              ]}
              disabled={!isValid}>
              <Text style={styles.submitBtnTxt}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{alignSelf: 'center', marginVertical: height * 0.02}}>
              <Text>
                Already have an account? <Text>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignUp;

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
