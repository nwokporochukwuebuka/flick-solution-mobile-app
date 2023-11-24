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
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {login} from '../../http/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../store/auth-context';

const LoginSchema = Yup.object().shape({
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
});

const {height} = Dimensions.get('window');

const SignIn: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);

  const handleLogin = (values: any) => {
    setLoading(true);
    setTimeout(async () => {
      const signIn = await login(values.email, values.password);
      if (signIn.status !== 200) {
        setLoading(false);
        return Alert.alert('Error', signIn.data.message);
      }
      AsyncStorage.setItem('email', values.email);
      authCtx.email = values.email;
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
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={values => handleLogin(values)}>
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
            <Text style={styles.title}>Log In</Text>

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
              onPress={() => navigation.navigate('Register')}
              style={{alignSelf: 'center', marginVertical: height * 0.02}}>
              <Text>
                Don't have an account? <Text>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignIn;

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
